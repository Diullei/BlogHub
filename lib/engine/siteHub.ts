class SiteHub {
    config: string;
    pages: Page[] = [];
    blog: Blog;
    plugins: any = {};
    groups: any[] = [];

	constructor() { 
	    this.blog = new Blog('.');
    }

	public renderPlugin(plugin, main, page) { 
	    return this.plugins[plugin.toUpperCase()].render(main, page);
    }

	private loadPlugins() { 
	    var itens = fs.readdirSync(this.config['folders']['plugins']); 
	    for (var i = 0; i < itens.length; i++) { 
	        var item = itens[i];
	            var plugin = require(process.cwd() + '/' + this.config['folders']['plugins'] + '/' + item + '/main.js');
	            this.plugins[item.toUpperCase()] = plugin;
        }
    }

	private loadConfig() {
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync('./_config.json');
		}
		catch (err) {
		  console.error("There was an error opening the file:");
		  console.log(err);
		}
		this.config = JSON.parse(fileContent);

		this.loadPlugins();
	}

	private loadPages() { 
        var files = fs.readdirSync(this.config['folders']['content']);
        if (files.length > 0) {
            files = Enumerable.From(files).Reverse().ToArray();

			for (var i = 0; i < files.length; i++) {
				var page = new Page(files[i], this.blog, this.config, this);
				this.pages.push(page);
			}
        }
    }

	private getPage(page: string) { 
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync(page, this.config['file_encode']);
		}
		catch (err) {
		  console.error("There was an error opening the file:");
		  console.log(err);
		}

		var render = jade.compile(fileContent, {filename: this.config['folders']['theme'] + '/tmpl'});

		return new Source(render({main: this, config: this.config}), this.config['folders']['site']);
    }

    private getAtom() { 
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync('./atom.jade', this.config['file_encode']);
		}
		catch (err) {
		  console.error("There was an error opening the file:");
		  console.log(err);
		}

		var render = jade.compile(fileContent, {filename: this.config['folders']['theme'] + '/tmpl'});

		return new Source(render({main: this, config: this.config}), this.config['folders']['site'] + '/atom.xml');
    }

	private loadGroups() { 
		if (this.pages.length > 0) {
			for (var i = 0; i < this.pages.length; i++) {
			    var page = this.pages[i];

				if(!this.groups[page.group]) {
					this.groups[page.group] = [];
				}

				this.groups[page.group].push(page);
			}

			for(var key in this.groups) {
				var group = this.groups[key];

				for(var k = 0; k < group.length; k++) {
					if(k > 0) {
						group[k].previous = group[k - 1];
					}
					if(k < group.length) {
						group[k].next = group[k + 1];
					}
				}
			}
		}
    }

	public build() {
		this.loadConfig();
		this.loadPages();
		this.loadGroups();

		if (this.pages.length > 0) {
			for (var i = 0; i < this.pages.length; i++) {
			    this.pages[i].build();
			}

			fs3.removeRecursive(this.blog.path + '/' + this.config['folders']['site'], (err,status) => { 

	            var itens = fs.readdirSync(this.blog.path + '/' + this.config['folders']['theme']); 
	            for (var i = 0; i < itens.length; i++) { 
	                if (itens[i].substr(itens[i].lastIndexOf('.')).toUpperCase() == '.JADE') {

	                    if (itens[i].toUpperCase() == 'INDEX.JADE') {
	                        if (!this.config['home']) {
	                            // custom pages
	                            console.log('!home')
	                            this.getPage(this.blog.path + '/' + this.config['folders']['theme'] + '/' + itens[i]).saveToPath(
                                    this.config['folders']['site'], 
                                    '/index.html', 
                                    this.config['file_encode']);
	                        }
                        } else { 
	                        console.log(itens[i])
	                        this.getPage(this.blog.path + '/' + this.config['folders']['theme'] + '/' + itens[i]).saveToPath(
                                this.config['folders']['site'], 
                                '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html', 
                                this.config['file_encode']);
                        }
	                }
                }
	            if (this.config['home']) {
	                // index
	                var group = this.groups[this.config['home']];
	                var source = group[0].getSource();
	                source.saveToPath(this.blog.path + '/' + this.config['folders']['site'], 'index.html', this.config['file_encode']);
	            }

	            this.getAtom().saveToPath(this.blog.path + '/' + this.config['folders']['site'], 'atom.xml', this.config['file_encode']);

                // pages
			    for (var i = 0; i < this.pages.length; i++) {
			        this.pages[i].getSource().save(this.config['file_encode']);
			    }

                // deve ir para configuração do tema definindo o que deve ser ou não copiado
                ncp(this.blog.path + '/' + this.config['folders']['theme'] + '/css', this.blog.path + '/' + this.config['folders']['site'] + '/css', function (err) { if (err) { return console.error(err); } });
                ncp(this.blog.path + '/' + this.config['folders']['theme'] + '/img', this.blog.path + '/' + this.config['folders']['site'] + '/img', function (err) { if (err) { return console.error(err); } });
                ncp(this.blog.path + '/' + this.config['folders']['theme'] + '/js', this.blog.path + '/' + this.config['folders']['site'] + '/js', function (err) { if (err) { return console.error(err); } });
            });
		}
	}
}
