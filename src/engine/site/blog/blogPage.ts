// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='../../blogHubDiagnostics.ts'/>
///<reference path='../siteBase.ts'/>
///<reference path='../siteHub.ts'/>
///<reference path='../../print.ts'/>

module Site.Blog {

    export class Builder { 
        private CURRENT_FOLDER = './';

        public exec() { 
            new System.IO.Directory().copy(__dirname + '/../src/base_blog/', this.CURRENT_FOLDER);
            BlogHubDiagnostics.info('Blog site created');
        }
    }

    export class Header { 
        title: string;
        category: string;
        tags: string[] = [];
        group: string = 'default';
    }

    export class PostDate { 
        y: number = 0;
        m: number = 0;
        d: number = 0;

        public asDateObject() {
            return new Date(this.y, this.m - 1, this.d);
        }
    }

    export class Content { 
        md: string;
        html: string;
    }

    export class BlogPage extends Site.SiteBase {
        private MATCH: any = /^(.+\/)*(\d{4}-\d{2}-\d{2})-(.*)(\.[^.]+)$/g;

        public header: Header = new Header();
        public date: PostDate = new PostDate();
        public content: Content = new Content();

        constructor(siteHub: SiteHub, file: string, siteFile: SiteFile) {
            super(siteHub, siteFile, file);

            if (!this.validate(this.file)) {
                throw new Error('invalid site file name');
            }

            this.name = file.substring(11, file.lastIndexOf('.'));
            this.parseDate(file.substring(0, 10));
            this.parserSiteData();
        }

        private parserSiteData() {
            super.parserSiteData();

            for (var key in this.siteFile.header) {
                if (key == 'group') {
                    this.header.group = this.siteFile.header['group'];
                }
                else if (key == 'title') {
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

	    public relatovePathName() {
            var config = new Config();
		    var result = '/' + config.folders.site + '/';
		    var parts = config.folders.blog.relativePath.split('/');
		    for(var i = 0; i<parts.length; i++) {
			    if(parts[i] && parts[i].substr(1).trim() != '') {
				    var p = eval('this.' + parts[i].substr(1));
				    if(p) {
					    result += p;
				    }
				
				    result += '/';
			    }
		    }
		    return result;
	    }

        public static loadGroups(pages: SiteBase[]):any[] {
            var groups: any[] = [];
            if (pages.length > 0) {
                for (var i = 0; i < pages.length; i++) {
                    var page = <BlogPage>pages[i];

                    if (!groups[page.header.group]) {
                        groups[page.header.group] = [];
                    }

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
    }
}