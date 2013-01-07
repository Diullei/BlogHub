var Blog = (function () {
    function Blog(path) {
        this.path = path;
        this.config = {
            pagePathName: "/:header.category/:date.y/:date.m/:date.d/:name"
        };
    }
    Blog.prototype.buildRelatovePathName = function (page) {
        var result = '/';
        var parts = this.config.pagePathName.split('/');
        for(var i = 0; i < parts.length; i++) {
            if(parts[i] && parts[i].substr(1).trim() != '') {
                var p = eval('page.' + parts[i].substr(1));
                if(p) {
                    result += p;
                }
                if(i < parts.length - 1) {
                    result += '/';
                }
            }
        }
        return result;
    };
    return Blog;
})();
var Source = (function () {
    function Source(content, path) {
        this.content = content;
        this.path = path;
    }
    Source.prototype.save = function () {
    };
    return Source;
})();
var SiteFile = (function () {
    function SiteFile(file, blog) {
        this.BREAK_LINE = '\n';
        this.header = {
        };
        var lines = null;
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync(blog.path + '/' + file, 'binary');
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        lines = fileContent.split(this.BREAK_LINE);
        var openHeader = false;
        for(var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if(line != '' && line != '---' && !openHeader) {
                throw new Error('invalid site header file');
            } else {
                if(line == '---') {
                    if(!openHeader) {
                        openHeader = true;
                    } else {
                        break;
                    }
                } else {
                    var key = line.split(':')[0];
                    this.header[key] = line.substr(key.length + 1).trim();
                }
            }
        }
        i++;
        this.content = '';
        for(; i < lines.length; i++) {
            this.content += lines[i] + this.BREAK_LINE;
        }
    }
    return SiteFile;
})();
var Page = (function () {
    function Page(blog) {
        this.blog = blog;
        this.template = 'index.html';
    }
    Page.prototype.parserSiteData = function () {
    };
    Page.prototype.outName = function () {
        return this.blog.buildRelatovePathName(this);
    };
    Page.prototype.build = function () {
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync(this.blog.path + '/templates/' + this.template, 'binary');
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        var render = jade.compile(fileContent);
        return new Source(render(this), this.blog.path + this.outName());
    };
    return Page;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Site = (function (_super) {
    __extends(Site, _super);
    function Site(file, blog) {
        _super.call(this, blog);
        this.file = file;
        this.MATCH = /^(.+\/)*(\d{4}-\d{2}-\d{2})-(.*)(\.[^.]+)$/g;
        this.header = {
            title: null,
            category: null,
            tags: []
        };
        this.date = {
            y: 0,
            m: 0,
            d: 0
        };
        this.content = {
            md: null,
            html: null
        };
        if(!this.file) {
            throw new Error('site file name cant be null');
        }
        if(!this.validate(this.file)) {
            throw new Error('invalid site file name');
        }
        this.name = file.substring(11, file.lastIndexOf('.'));
        this.parseDate(file.substring(0, 10));
        this.parserSiteData();
    }
    Site.prototype.parserSiteData = function () {
        this.siteFile = new SiteFile(this.file, this.blog);
        _super.prototype.parserSiteData.call(this);
        for(var key in this.siteFile.header) {
            if(key == 'title') {
                this.header.title = this.siteFile.header[key];
            } else {
                if(key == 'category') {
                    this.header.category = this.siteFile.header[key];
                } else {
                    if(key == 'tags') {
                        this.header.tags = this.siteFile.header[key].split(',');
                    }
                }
            }
        }
        this.content.md = this.siteFile.content;
        this.content.html = new Showdown.converter().makeHtml(this.content.md);
        for(var i = 0; i < this.header.tags.length; i++) {
            this.header.tags[i] = this.header.tags[i].trim();
        }
    };
    Site.prototype.parseDate = function (strDate) {
        this.date.y = strDate.substr(0, 4);
        this.date.m = strDate.substr(5, 2);
        this.date.d = strDate.substr(8, 2);
    };
    Site.prototype.validate = function (file) {
        return file.match(this.MATCH);
    };
    return Site;
})(Page);
var fs = require('fs');
var jade = require('jade');
var Showdown = require('./libs/showdown.js');
var files = fs.readdirSync('_content');
if(files.length > 0) {
    for(var i = 0; i < files.length; i++) {
        var site = new Site(files[i], new Blog('./_content'));
    }
}
