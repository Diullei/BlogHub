class SiteHub {
	config: string;
	pages: Page[] = [];
	blog: Blog;
	plugins: any = {};

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
        var files = fs.readdirSync(this.config['folders']['content']);;
        if (files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				var page = new Page(files[i], this.blog, this.config, this);
				this.pages.push(page);
			}
        }
    }

	private loadGroups() { 
		var groups = [];
		if (this.pages.length > 0) {
			for (var i = 0; i < this.pages.length; i++) {
			    var page = this.pages[i];

				if(!groups[page.group]) {
					groups[page.group] = [];
				}

				groups[page.group].push(page);
			}

			for(var key in groups) {
				var group = groups[key];

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
			    for (var i = 0; i < this.pages.length; i++) {
			        this.pages[i].getSource().save();
			    }
            });
		}
	}
}
