var Blog = (function () {
    function Blog(path) {
        this.path = path;
    }
    Blog.prototype.buildRelatovePathName = function (page) {
        var result = '/' + page.config['folders']['site'] + '/';
        var parts = page.config['folders']['relativePath'].split('/');
        for(var i = 0; i < parts.length; i++) {
            if(parts[i] && parts[i].substr(1).trim() != '') {
                var p = eval('page.' + parts[i].substr(1));
                if(p) {
                    result += p;
                }
                result += '/';
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
        fs2.mkdirSync(this.path, 777, true);
        fs.writeFileSync(this.path + 'index.html', this.content, 'utf8');
    };
    return Source;
})();
var SiteFile = (function () {
    function SiteFile(file, blog, config) {
        this.BREAK_LINE = '\n';
        this.header = {
        };
        var lines = null;
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync(blog.path + '/' + config['folders']['content'] + '/' + file, 'binary');
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
                    this.header[key.trim()] = line.substr(key.length + 1).trim();
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
var PageBase = (function () {
    function PageBase(blog, config, siteHub) {
        this.blog = blog;
        this.config = config;
        this.siteHub = siteHub;
    }
    PageBase.prototype.parserSiteData = function () {
        if(this.siteFile.header['group']) {
            this.group = this.siteFile.header['group'];
        }
    };
    PageBase.prototype.outName = function () {
        return this.blog.buildRelatovePathName(this);
    };
    PageBase.prototype.build = function () {
        this.url = this.outName().substr(this.config['folders']['site'].length + 1);
    };
    PageBase.prototype.getSource = function () {
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync(this.blog.path + '/' + this.config['folders']['theme'] + '/' + this.config['template']['default'], 'binary');
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        var render = jade.compile(fileContent);
        return new Source(render({
            main: this.siteHub,
            page: this
        }), this.blog.path + this.outName());
    };
    return PageBase;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Page = (function (_super) {
    __extends(Page, _super);
    function Page(file, blog, config, siteHub) {
        _super.call(this, blog, config, siteHub);
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
    Page.prototype.parserSiteData = function () {
        this.siteFile = new SiteFile(this.file, this.blog, this.config);
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
    Page.prototype.parseDate = function (strDate) {
        this.date.y = strDate.substr(0, 4);
        this.date.m = strDate.substr(5, 2);
        this.date.d = strDate.substr(8, 2);
    };
    Page.prototype.validate = function (file) {
        return file.match(this.MATCH);
    };
    return Page;
})(PageBase);
var jade = require('jade');
var fs = require('fs');
var fs2 = require('./libs/node-fs');
var fs3 = require('./libs/fs.removeRecursive');
var Showdown = require('./libs/showdown.js');
var Enumerable = require('./libs/linq');
var SiteHub = (function () {
    function SiteHub() {
        this.pages = [];
        this.blog = new Blog('.');
    }
    SiteHub.prototype.loadConfig = function () {
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync('./_config.json');
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        this.config = JSON.parse(fileContent);
    };
    SiteHub.prototype.build = function () {
        var _this = this;
        this.loadConfig();
        var files = fs.readdirSync(this.config['folders']['content']);
        var groups = [];
        if(files.length > 0) {
            for(var i = 0; i < files.length; i++) {
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
            for(var i = 0; i < this.pages.length; i++) {
                this.pages[i].build();
            }
            fs3.removeRecursive(this.blog.path + '/' + this.config['folders']['site'], function () {
                for(var i = 0; i < _this.pages.length; i++) {
                    _this.pages[i].getSource().save();
                }
            });
        }
    };
    return SiteHub;
})();
var Main = (function () {
    function Main() { }
    Main.run = function run() {
        new SiteHub().build();
    }
    return Main;
})();
Main.run();
