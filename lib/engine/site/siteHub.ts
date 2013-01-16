// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='blog/blogPage.ts'/>
///<reference path='../config.ts'/>

module Site {

    export class SiteHub {
        private MAIN_PLUGIN_FILE = '/main.js';
        private fs = require('fs');
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
            var itens = this.fs.readdirSync(this.config.folders.plugins);
            for (var i = 0; i < itens.length; i++) {
                var item = itens[i];
                var plugin = require(this.config.folders.current + '/' + this.config.folders.plugins + '/' + item + this.MAIN_PLUGIN_FILE);
                this.plugins[item.toUpperCase()] = plugin;
            }
        }

        private loadPages() {
            var files = this.fs.readdirSync(this.config.folders.content);
            if (files.length > 0) {
                files = this.enumerable.From(files).Reverse().ToArray();

                for (var i = 0; i < files.length; i++) {
                    var siteFile = new SiteFile(files[i]);
                    if (siteFile.header['engine']) {
                        var engine = siteFile.header['engine'];
                        if (engine == 'blog') {

                            var page = new Site.Blog.BlogPage(this, files[i], siteFile);
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
                fileContent = this.fs.readFileSync(page, this.config.fileEncode);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { filename: this.config.folders.theme + '/tmpl' });

            return new Source(render({ main: this, config: this.config }), this.config.folders.site);
        }

        private getAtom() {
            var fileContent = null;
            try {
                fileContent = this.fs.readFileSync('./atom.jade', this.config.fileEncode);
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
            var itens = this.fs.readdirSync('./' + this.config.folders.theme);
            for (var i = 0; i < itens.length; i++) {
                if (itens[i].substr(itens[i].lastIndexOf('.')).toUpperCase() == '.JADE') {
                    pages.push(itens[i]);
                }
            }
            return pages;
        }

        public build() {
            this.loadPlugins();
            this.loadPages();

            if (this.pages.length > 0) {
                for (var i = 0; i < this.pages.length; i++) {
                    this.pages[i].build();
                }

                this.fs3.removeRecursive('./' + this.config.folders.site, (err, status) => {

                    var itens = this.getJadePages();
                    for (var i = 0; i < itens.length; i++) {
                        BlogHubDiagnostics.info('[Create] file: ' + itens[i])
                        this.getPage('./' + this.config.folders.theme + '/' + itens[i]).saveToPath(
                            this.config.folders.site,
                            '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html',
                            this.config.fileEncode);
                    }

                    this.getAtom().saveToPath('./' + this.config.folders.site, 'atom.xml', this.config.fileEncode);

                    // pages
                    for (var i = 0; i < this.pages.length; i++) {
                        this.pages[i].getSource().save(this.config.fileEncode);
                    }

                    // copy folders
                    for (var i = 0; i < this.config.copyFolders.length; i++) { 
                        var folder = this.config.copyFolders[i];
                        this.ncp('./' + this.config.folders.theme + '/' + folder, './' + this.config.folders.site + '/' + folder, function (err) { if (err) { return console.error(err); } });
                    }
                });
            }
        }
    }
}