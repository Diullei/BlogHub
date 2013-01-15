// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='blog/blogPage.ts'/>

module Site {

    export class SiteHub {
        private fs = require('fs');
        private jade = require('jade');
        private fs3 = require('./libs/fs.removeRecursive');
        private enumerable = require('./libs/linq');
        private ncp = require('ncp').ncp;

        config: string;
        pages: Site.SiteBase[] = [];
        plugins: any = {};

        constructor() {
        }

        public renderPlugin(plugin, main, page) {
            return this.plugins[plugin.toUpperCase()].render(main, page);
        }

        private loadPlugins() {
            var itens = this.fs.readdirSync(this.config['folders']['plugins']);
            for (var i = 0; i < itens.length; i++) {
                var item = itens[i];
                var plugin = require(process.cwd() + '/' + this.config['folders']['plugins'] + '/' + item + '/main.js');
                this.plugins[item.toUpperCase()] = plugin;
            }
        }

        private loadConfig() {
            var fileContent = null;
            try {
                fileContent = this.fs.readFileSync('./_config.json');
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            this.config = JSON.parse(fileContent);

            this.loadPlugins();
        }

        private loadPages() {
            var files = this.fs.readdirSync(this.config['folders']['content']);
            if (files.length > 0) {
                files = this.enumerable.From(files).Reverse().ToArray();

                for (var i = 0; i < files.length; i++) {
                    var siteFile = new SiteFile(files[i], this.config);
                    if (siteFile.header['engine']) {
                        var engine = siteFile.header['engine'];
                        if (engine == 'blog') {

                            console.log(engine)
                            var page = new Site.Blog.BlogPage(this, files[i], this.config, siteFile);
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
                fileContent = this.fs.readFileSync(page, this.config['file_encode']);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { filename: this.config['folders']['theme'] + '/tmpl' });

            return new Source(render({ main: this, config: this.config }), this.config['folders']['site']);
        }

        private getAtom() {
            var fileContent = null;
            try {
                fileContent = this.fs.readFileSync('./atom.jade', this.config['file_encode']);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { filename: this.config['folders']['theme'] + '/tmpl' });

            return new Source(render({ main: this, config: this.config }), this.config['folders']['site'] + '/atom.xml');
        }

        public getJadePages(): string[] {
            var pages: string[] = [];
            var itens = this.fs.readdirSync('./' + this.config['folders']['theme']);
            for (var i = 0; i < itens.length; i++) {
                if (itens[i].substr(itens[i].lastIndexOf('.')).toUpperCase() == '.JADE') {
                    pages.push(itens[i]);
                }
            }
            return pages;
        }

        public build() {
            this.loadConfig();
            this.loadPages();

            if (this.pages.length > 0) {
                for (var i = 0; i < this.pages.length; i++) {
                    this.pages[i].build();
                }

                this.fs3.removeRecursive('./' + this.config['folders']['site'], (err, status) => {

                    var itens = this.getJadePages();
                    for (var i = 0; i < itens.length; i++) {
                        console.log(itens[i])
                        this.getPage('./' + this.config['folders']['theme'] + '/' + itens[i]).saveToPath(
                            this.config['folders']['site'],
                            '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html',
                            this.config['file_encode']);
                    }

                    this.getAtom().saveToPath('./' + this.config['folders']['site'], 'atom.xml', this.config['file_encode']);

                    // pages
                    for (var i = 0; i < this.pages.length; i++) {
                        this.pages[i].getSource().save(this.config['file_encode']);
                    }

                    // copy folders
                    for (var i = 0; i < this.config['exclude'].length; i++) { 
                        var folder = this.config['exclude'][i];
                        this.ncp('./' + this.config['folders']['theme'] + '/' + folder, './' + this.config['folders']['site'] + '/' + folder, function (err) { if (err) { return console.error(err); } });
                    }
                });
            }
        }
    }
}