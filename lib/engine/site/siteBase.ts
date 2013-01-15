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

        public showdown = require('./libs/showdown.js');
        public name: string;
        public url: string;

        constructor(public config: Object, public siteHub: SiteHub, public siteFile: SiteFile, public file: string) {
            if (!this.file) {
                throw new Error('site file name cant be null');
            }
            this.name = file.substring(0, file.lastIndexOf('.'));
        }

        public parserSiteData() {
            //...
        }

        public relatovePathName() {
            throw new Error('Site.outName() not implemented!');
            return '';
        }

        public build() {
            this.url = this.relatovePathName().substr(this.config['folders']['site'].length + 1);
        }

        public getSource(): Source {
            var fileContent = null;
            try {
                fileContent = this.fs.readFileSync('./' + this.config['folders']['theme'] + '/' + (this.siteFile.header['template']), this.config['file_encode']);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            var render = this.jade.compile(fileContent, { filename: this.config['folders']['theme'] + '/tmpl' });

            return new Source(render({ main: this.siteHub, page: this, config: this.config }), './' + this.relatovePathName());
        }
    }
}