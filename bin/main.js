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
    Source.prototype.save = function (encode) {
        fs2.mkdirSync(this.path, 777, true);
        fs.writeFileSync(this.path + 'index.html', this.content, encode);
    };
    Source.prototype.saveToPath = function (path, fileName, encode) {
        fs2.mkdirSync(path, 777, true);
        fs.writeFileSync(path + '/' + fileName, this.content, encode);
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
            fileContent = fs.readFileSync(blog.path + '/' + config['folders']['content'] + '/' + file, config['file_encode']);
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        lines = fileContent.split(this.BREAK_LINE);
        var openHeader = false;
        for(var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if(line != '' && line != '---' && !openHeader) {
                console.log(line);
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
        this.group = 'default';
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
            fileContent = fs.readFileSync(this.blog.path + '/' + this.config['folders']['theme'] + '/' + this.config['template']['default'], this.config['file_encode']);
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        var render = jade.compile(fileContent, {
            filename: this.config['folders']['theme'] + '/tmpl'
        });
        return new Source(render({
            main: this.siteHub,
            page: this,
            config: this.config
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
var SiteHub = (function () {
    function SiteHub() {
        this.pages = [];
        this.plugins = {
        };
        this.groups = [];
        this.blog = new Blog('.');
    }
    SiteHub.prototype.renderPlugin = function (plugin, main, page) {
        return this.plugins[plugin.toUpperCase()].render(main, page);
    };
    SiteHub.prototype.loadPlugins = function () {
        var itens = fs.readdirSync(this.config['folders']['plugins']);
        for(var i = 0; i < itens.length; i++) {
            var item = itens[i];
            var plugin = require(process.cwd() + '/' + this.config['folders']['plugins'] + '/' + item + '/main.js');
            this.plugins[item.toUpperCase()] = plugin;
        }
    };
    SiteHub.prototype.loadConfig = function () {
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync('./_config.json');
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        this.config = JSON.parse(fileContent);
        this.loadPlugins();
    };
    SiteHub.prototype.loadPages = function () {
        var files = fs.readdirSync(this.config['folders']['content']);
        if(files.length > 0) {
            files = Enumerable.From(files).Reverse().ToArray();
            for(var i = 0; i < files.length; i++) {
                var page = new Page(files[i], this.blog, this.config, this);
                this.pages.push(page);
            }
        }
    };
    SiteHub.prototype.getPage = function (page) {
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync(page, this.config['file_encode']);
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        var render = jade.compile(fileContent, {
            filename: this.config['folders']['theme'] + '/tmpl'
        });
        return new Source(render({
            main: this,
            config: this.config
        }), this.config['folders']['site']);
    };
    SiteHub.prototype.getAtom = function () {
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync('./atom.jade', this.config['file_encode']);
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        var render = jade.compile(fileContent, {
            filename: this.config['folders']['theme'] + '/tmpl'
        });
        return new Source(render({
            main: this,
            config: this.config
        }), this.config['folders']['site'] + '/atom.xml');
    };
    SiteHub.prototype.loadGroups = function () {
        if(this.pages.length > 0) {
            for(var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if(!this.groups[page.group]) {
                    this.groups[page.group] = [];
                }
                this.groups[page.group].push(page);
            }
            for(var key in this.groups) {
                var group = this.groups[key];
                for(var k = 0; k < group.length; k++) {
                    if(k > 0) {
                        group[k].previous = group[k - 1];
                    }
                    if(k < group.length) {
                        group[k].next = group[k + 1];
                    }
                }
            }
        }
    };
    SiteHub.prototype.build = function () {
        var _this = this;
        this.loadConfig();
        this.loadPages();
        this.loadGroups();
        if(this.pages.length > 0) {
            for(var i = 0; i < this.pages.length; i++) {
                this.pages[i].build();
            }
            fs3.removeRecursive(this.blog.path + '/' + this.config['folders']['site'], function (err, status) {
                var itens = fs.readdirSync(_this.blog.path + '/' + _this.config['folders']['theme']);
                for(var i = 0; i < itens.length; i++) {
                    if(itens[i].substr(itens[i].lastIndexOf('.')).toUpperCase() == '.JADE') {
                        if(itens[i].toUpperCase() == 'INDEX.JADE') {
                            if(!_this.config['home']) {
                                console.log('!home');
                                _this.getPage(_this.blog.path + '/' + _this.config['folders']['theme'] + '/' + itens[i]).saveToPath(_this.config['folders']['site'], '/index.html', _this.config['file_encode']);
                            }
                        } else {
                            console.log(itens[i]);
                            _this.getPage(_this.blog.path + '/' + _this.config['folders']['theme'] + '/' + itens[i]).saveToPath(_this.config['folders']['site'], '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html', _this.config['file_encode']);
                        }
                    }
                }
                if(_this.config['home']) {
                    var group = _this.groups[_this.config['home']];
                    var source = group[0].getSource();
                    source.saveToPath(_this.blog.path + '/' + _this.config['folders']['site'], 'index.html', _this.config['file_encode']);
                }
                _this.getAtom().saveToPath(_this.blog.path + '/' + _this.config['folders']['site'], 'atom.xml', _this.config['file_encode']);
                for(var i = 0; i < _this.pages.length; i++) {
                    _this.pages[i].getSource().save(_this.config['file_encode']);
                }
                ncp(_this.blog.path + '/' + _this.config['folders']['theme'] + '/css', _this.blog.path + '/' + _this.config['folders']['site'] + '/css', function (err) {
                    if(err) {
                        return console.error(err);
                    }
                });
                ncp(_this.blog.path + '/' + _this.config['folders']['theme'] + '/img', _this.blog.path + '/' + _this.config['folders']['site'] + '/img', function (err) {
                    if(err) {
                        return console.error(err);
                    }
                });
                ncp(_this.blog.path + '/' + _this.config['folders']['theme'] + '/js', _this.blog.path + '/' + _this.config['folders']['site'] + '/js', function (err) {
                    if(err) {
                        return console.error(err);
                    }
                });
            });
        }
    };
    return SiteHub;
})();
var Main = (function () {
    function Main() { }
    Main.createSite = function createSite() {
        console.log('creating new site...');
        var itens = fs.readdirSync("./");
        if(itens.length > 0) {
            console.log('Error! this folder is not empty.');
        } else {
            ncp(__dirname + '/../lib/base/', "./", function (err) {
                if(err) {
                    return console.error(err);
                }
                console.log('site created!');
            });
        }
    }
    Main.build = function build() {
        new SiteHub().build();
    }
    Main.run = function run() {
        var arg1 = process.argv[2];
        if(!arg1) {
            Main.build();
        }
        if(arg1 == 'new') {
            Main.createSite();
        }
    }
    return Main;
})();
var ncp = require('ncp').ncp;
var jade = require('jade');
var fs = require('fs');
var fs2 = require('./libs/node-fs');
var fs3 = require('./libs/fs.removeRecursive');
var Showdown = require('./libs/showdown.js');
var Enumerable = require('./libs/linq');
ncp.limit = 16;
Main.run();
