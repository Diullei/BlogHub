// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='siteBase.ts'/>
///<reference path='blog/blog.ts'/>
///<reference path='siteHub.ts'/>

module Site {
    export class Page extends Site.SiteBase {
        private showdown = require('./libs/showdown.js');
        private MATCH: any = /^(.+\/)*(\d{4}-\d{2}-\d{2})-(.*)(\.[^.]+)$/g;

        public header: {
            title: string;
            category: string;
            tags: string[];
        } = { title: null, category: null, tags: [] };
        public date: {
            y: number;
            m: number;
            d: number;
        } = { y: 0, m: 0, d: 0 };
        public content: {
            md: string;
            html: string;
        } = { md: null, html: null };
        public name: string;

        constructor(public file: string, blog: Blog, config: Object, siteHub: SiteHub) {
            super(blog, config, siteHub);

            if (!this.file) {
                throw new Error('site file name cant be null');
            }

            if (!this.validate(this.file)) {
                throw new Error('invalid site file name');
            }

            this.name = file.substring(11, file.lastIndexOf('.'));
            this.parseDate(file.substring(0, 10));
            this.parserSiteData();
        }

        private parserSiteData() {
            this.siteFile = new SiteFile(this.file, this.blog, this.config);

            super.parserSiteData();

            for (var key in this.siteFile.header) {
                if (key == 'title') {
                    this.header.title = this.siteFile.header[key];
                }
                else if (key == 'category') {
                    this.header.category = this.siteFile.header[key];
                }
                else if (key == 'tags') {
                    this.header.tags = this.siteFile.header[key].split(',');
                }
            }

            this.content.md = this.siteFile.content;

            this.content.html = new this.showdown.converter().makeHtml(this.content.md);

            for (var i = 0; i < this.header.tags.length; i++) {
                this.header.tags[i] = this.header.tags[i].trim();
            }
        }

        private parseDate(strDate) {
            this.date.y = strDate.substr(0, 4);
            this.date.m = strDate.substr(5, 2);
            this.date.d = strDate.substr(8, 2);
        }

        private validate(file: string) {
            return file.match(this.MATCH);
        }

        public getDate() {
            return new Date(this.date.y, this.date.m - 1, this.date.d);
        }
    }
}