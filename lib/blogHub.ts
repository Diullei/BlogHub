///<reference path='../definition/linq-2.2.d.ts'/>

var ncp = require('ncp').ncp;
var jade = require('jade');
var fs = require('fs');
var fs2 = require('./libs/node-fs');
var fs3 = require('./libs/fs.removeRecursive');
var Showdown = require('./libs/showdown.js');
var Enumerable = require('./libs/linq');

declare var process: any;
declare var __dirname: any;

ncp.limit = 16;

///<reference path='engine/blog.ts'/>
///<reference path='engine/source.ts'/>
///<reference path='engine/siteFile.ts'/>
///<reference path='engine/pageBase.ts'/>
///<reference path='engine/page.ts'/>

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

	public build() {
		this.loadConfig();

		var files = fs.readdirSync(this.config['folders']['content']); 

		var groups = [];
		if (files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				var page = new Page(files[i], this.blog, this.config, this);
				this.pages.push(page);

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


class Main {
	public static run() {
		new SiteHub().build();
	}
}

function createSite() { 
    console.log('creating new site...');

    var itens = fs.readdirSync("./");
    if (itens.length > 0) {
        console.log('Error! this folder is not empty.');
    } else {
        ncp(__dirname + '/../lib/base/', "./", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('site created!');
        });
    }
}

var arg1 = process.argv[2];

if (!arg1) {
    Main.run();
} if (arg1 == 'new') {
    createSite();
}
