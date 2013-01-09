///<reference path='../definition/linq-2.2.d.ts'/>

var jade = require('jade');
var fs = require('fs');
var fs2 = require('./libs/node-fs');
var fs3 = require('./libs/fs.removeRecursive');
var Showdown = require('./libs/showdown.js');
var Enumerable = require('./libs/linq');

///<reference path='engine/blog.ts'/>
///<reference path='engine/source.ts'/>
///<reference path='engine/siteFile.ts'/>
///<reference path='engine/pageBase.ts'/>
///<reference path='engine/page.ts'/>

class SiteHub {
	config: string;
	pages: Page[] = [];
	blog: Blog;

	constructor() { 
	    this.blog = new Blog('.');
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
	}

	public build() {
		this.loadConfig();

		var files = fs.readdirSync(this.config['folders']['content']); 

		var groups = [];
		if (files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				var page = new Page(files[i], this.blog, this.config, this);
				this.pages.push(page);

				if(!page.group) {
					page.group = '';
				}

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

            //.removeRecursive(full_path_to_dir,function(err,status){});
			fs3.removeRecursive(this.blog.path + '/' + this.config['folders']['site'], () => { 
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

Main.run();

// mofdifica page
// render page part

/*
PagePart
 - new(data)
 - build()
 - identifier
 - render()

*/
