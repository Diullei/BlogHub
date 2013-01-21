// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='blog/blogPage.ts'/>
///<reference path='../config.ts'/>
///<reference path='../system/io/FileHandle.ts'/>
///<reference path='../system/io/directory.ts'/>

module Site {

    export class SiteHub {
        private MAIN_PLUGIN_FILE = '/main.js';
        //private fs = require('fs');
        private jade = require('jade');
        private fs3 = require('./libs/fs.removeRecursive');
        private enumerable = require('./libs/linq');
        private ncp = require('ncp').ncp;
        private config: Config;

        public pages: Site.SiteBase[] = [];
        public plugins: any = {};

        constructor() {
            this.config = new Config();
        }

        public renderPlugin(plugin, page) {
            BlogHubDiagnostics.debug('loading "' + plugin + '" plugin');

            if (this.plugins[plugin.toUpperCase()]) {
                return this.plugins[plugin.toUpperCase()].render(this, page, this.config);
            } else { 
                BlogHubDiagnostics.error('"' + plugin + '" plugin not found');
                return '<div style="color:red;border: 2px solid red;background-color: yellow;padding: 15px;"><strong>' + plugin + '</strong> PLUGIN NOT FOUND</div>';
            }
        }

        private loadPlugins() {
            var itens = new System.IO.Directory().getFolders(this.config.folders.plugins);
            //var itens = this.fs.readdirSync(this.config.folders.plugins);
            for (var i = 0; i < itens.length; i++) {
                var item = itens[i];
                var plugin = require(this.config.folders.current + '/' + this.config.folders.plugins + '/' + item + this.MAIN_PLUGIN_FILE);
                this.plugins[item.toUpperCase()] = plugin;
            }
        }

        public getGroups(): any[] { 
	        var groups = [];
	        if (this.pages.length > 0) {
	            for (var i = 0; i < this.pages.length; i++) {
	                var page = <any>this.pages[i];

	                if (!groups[page.header.group])
	                    groups[page.header.group] = [];

	                groups[page.header.group].push(page);
	            }
	            for (var key in groups) {
	                var group = groups[key];

	                for (var k = 0; k < group.length; k++) {
	                    if (k > 0) {
	                        group[k].previous = group[k - 1];
	                    }
	                    if (k < group.length) {
	                        group[k].next = group[k + 1];
	                    }
	                }
	            }
	        }
            return groups;
        }

        public getLastPageFromDefaultGroup() { 
            return this.getGroups()[this.config.defaultGroup][0];
        }

        public getTags(): any {
		    var tags = {};
		    for (var i = 0; i < this.pages.length; i++){
			    var page = <any>this.pages[i];
			    if (page.header.tags.length > 0) {
				    for (var j = 0; j < page.header.tags.length; j++) {
					    var tag = page.header.tags[j];
					    if (!tags[tag]) {
						    tags[tag] = [];
					    }
					    tags[tag].push(page);
				    }
			    }
		    }

		    return tags;
        }

        public getCategories(): any {
		    var categories = {};
		    for (var i = 0; i < this.pages.length; i++){
			    var page = <any>this.pages[i];
			    if (!categories[page.header.category])
				    categories[page.header.category] = [];
			    categories[page.header.category].push(page);
		    }
		    return categories;
        }

        private loadPages() {
            var files = new System.IO.Directory().getFiles(this.config.folders.content);
            //var files = this.fs.readdirSync(this.config.folders.content);
            if (files.length > 0) {
                files = this.enumerable.From(files).Reverse().ToArray();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i].substr(this.config.folders.content.length + 1);
                    var siteFile = new SiteFile(file);
                    if (siteFile.header['engine']) {
                        var engine = siteFile.header['engine'];
                        if (engine == 'blog') {

                            var page = new Site.Blog.BlogPage(this, file, siteFile);
                            this.pages.push(page);

                        } else if (engine == 'doc') {
                        } else if (engine == 'page') {
                        }
                    }
                }
            }
        }

        private getPage(page: string) {
            var fileContent = null;
            try {
                fileContent = new System.IO.FileHandle().readFile(page);
                //fileContent = this.fs.readFileSync(page, this.config.fileEncode);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { compileDebug: true, filename: this.config.folders.theme + '/tmpl' });

            return new Source(render({ main: this, config: this.config }), this.config.folders.site);
        }

        private getAtom() {
            var fileContent = null;
            try {
                fileContent = new System.IO.FileHandle().readFile('./atom.jade');
                //fileContent = this.fs.readFileSync('./atom.jade', this.config.fileEncode);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { filename: this.config.folders.theme + '/tmpl' });

            return new Source(render({ main: this, config: this.config }), this.config.folders.site + '/atom.xml');
        }

        public getJadePages(): string[] {
            var pages: string[] = [];
            var itens = new System.IO.Directory().getFiles('./' + this.config.folders.theme);
            //var itens = this.fs.readdirSync('./' + this.config.folders.theme);
            for (var i = 0; i < itens.length; i++) {
                var item = itens[i].substr(this.config.folders.theme.length + 2);
                if (item.substr(item.lastIndexOf('.')).toUpperCase() == '.JADE') {
                    pages.push(item);
                }
            }
            return pages;
        }

        private copyThemeFolders() { 
            for (var i = 0; i < this.config.copyFolders.length; i++) { 
                var folder = this.config.copyFolders[i];
                BlogHubDiagnostics.info('[Create] folder: ' + folder);
                this.ncp('./' + this.config.folders.theme + '/' + folder, './' + this.config.folders.site + '/' + folder, function (err) { if (err) { return console.error(err); } });
            }
        }

        private saveAtom() { 
            BlogHubDiagnostics.info('[Create] file: atom.xml')
            this.getAtom().saveToPath('./' + this.config.folders.site, 'atom.xml', this.config.fileEncode);
        }

        private buildPages() { 
            if (this.pages.length > 0) {
                for (var i = 0; i < this.pages.length; i++) {
                    this.pages[i].build();
                }
            }
        }

        private saveMdPages() { 
            for (var i = 0; i < this.pages.length; i++) {
                var source = this.pages[i].getSource();
                BlogHubDiagnostics.info('[Create] file: ' + source.path)
                source.save(this.config.fileEncode);
            }
        }

        private saveJadePages() { 
            var itens = this.getJadePages();
            for (var i = 0; i < itens.length; i++) {
                BlogHubDiagnostics.info('[Create] file: ' + itens[i])
                this.getPage('./' + this.config.folders.theme + '/' + itens[i]).saveToPath(
                    this.config.folders.site,
                    '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html',
                    this.config.fileEncode);
            }
        }

        private savePages() { 
            this.saveJadePages();
            this.saveAtom();
            this.saveMdPages();
        }

        public build() {
            this.loadPlugins();
            this.loadPages();

            if (this.pages.length > 0) {
                this.buildPages();

                BlogHubDiagnostics.info('Remove site folder');
                this.fs3.removeRecursive('./' + this.config.folders.site, (err, status) => {
                    this.savePages();
                    this.copyThemeFolders();
                });
            }
        }
    }
}