// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='siteFile.ts'/>
///<reference path='../source.ts'/>

module Site {
    export class SiteBase {
        private fs = require('fs');
        private jade = require('jade');

        siteFile: SiteFile;
        group: string = 'default';
        url: string;

        constructor(public blog: Blog, public config: Object, public siteHub: SiteHub) {
        }

        parserSiteData() {
            if (this.siteFile.header['group']) {
                this.group = this.siteFile.header['group'];
            }
        }

        public outName() {
            return this.blog.buildRelatovePathName(this);
        }

        public build() {
            this.url = this.outName().substr(this.config['folders']['site'].length + 1);
        }

        public getSource(): Source {
            var fileContent = null;
            try {
                fileContent = this.fs.readFileSync(this.blog.path + '/' + this.config['folders']['theme'] + '/' + this.config['template']['default'], this.config['file_encode']);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { filename: this.config['folders']['theme'] + '/tmpl' });

            return new Source(render({ main: this.siteHub, page: this, config: this.config }), this.blog.path + this.outName());
        }
    }
}