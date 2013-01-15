var Site;
(function (Site) {
    var SiteFile = (function () {
        function SiteFile(file, config) {
            this.fs = require('fs');
            this.BREAK_LINE = '\n';
            this.header = {
            };
            var lines = null;
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync('./' + config['folders']['content'] + '/' + file, config['file_encode']);
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
    Site.SiteFile = SiteFile;    
})(Site || (Site = {}));
var Source = (function () {
    function Source(content, path) {
        this.content = content;
        this.path = path;
        this.fs = require('fs');
        this.fs2 = require('./libs/node-fs');
    }
    Source.prototype.save = function (encode) {
        this.fs2.mkdirSync(this.path, 777, true);
        this.fs.writeFileSync(this.path + 'index.html', this.content, encode);
    };
    Source.prototype.saveToPath = function (path, fileName, encode) {
        this.fs2.mkdirSync(path, 777, true);
        this.fs.writeFileSync(path + '/' + fileName, this.content, encode);
    };
    return Source;
})();
var Site;
(function (Site) {
    var SiteBase = (function () {
        function SiteBase(config, siteHub, siteFile, file) {
            this.config = config;
            this.siteHub = siteHub;
            this.siteFile = siteFile;
            this.file = file;
            this.fs = require('fs');
            this.jade = require('jade');
            this.showdown = require('./libs/showdown.js');
            if(!this.file) {
                throw new Error('site file name cant be null');
            }
            this.name = file.substring(0, file.lastIndexOf('.'));
        }
        SiteBase.prototype.parserSiteData = function () {
        };
        SiteBase.prototype.relatovePathName = function () {
            throw new Error('Site.outName() not implemented!');
            return '';
        };
        SiteBase.prototype.build = function () {
            this.url = this.relatovePathName().substr(this.config['folders']['site'].length + 1);
        };
        SiteBase.prototype.getSource = function () {
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync('./' + this.config['folders']['theme'] + '/' + (this.siteFile.header['template']), this.config['file_encode']);
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            var render = this.jade.compile(fileContent, {
                filename: this.config['folders']['theme'] + '/tmpl'
            });
            return new Source(render({
                main: this.siteHub,
                page: this,
                config: this.config
            }), './' + this.relatovePathName());
        };
        return SiteBase;
    })();
    Site.SiteBase = SiteBase;    
})(Site || (Site = {}));
var Print = (function () {
    function Print() { }
    Print.out = function out(msg) {
        if(msg.replace) {
            msg = msg.replace(/Error!/g, '\u001b[31mError!\u001b[0m');
            msg = msg.replace(/Info!/g, '\u001b[32mInfo!\u001b[0m');
        }
        console.log(msg);
    }
    return Print;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Site;
(function (Site) {
    (function (Blog) {
        var Builder = (function () {
            function Builder() {
                this.ncp = require('ncp').ncp;
            }
            Builder.prototype.exec = function () {
                this.ncp(__dirname + '/../lib/base_blog/', "./", function (err) {
                    if(err) {
                        return Print.out(err);
                    }
                    Print.out('Info! blog site created');
                });
            };
            return Builder;
        })();
        Blog.Builder = Builder;        
        var Header = (function () {
            function Header() {
                this.tags = [];
                this.group = 'default';
            }
            return Header;
        })();
        Blog.Header = Header;        
        var PostDate = (function () {
            function PostDate() {
                this.y = 0;
                this.m = 0;
                this.d = 0;
            }
            PostDate.prototype.asDateObject = function () {
                return new Date(this.y, this.m - 1, this.d);
            };
            return PostDate;
        })();
        Blog.PostDate = PostDate;        
        var Content = (function () {
            function Content() { }
            return Content;
        })();
        Blog.Content = Content;        
        var BlogPage = (function (_super) {
            __extends(BlogPage, _super);
            function BlogPage(siteHub, file, config, siteFile) {
                        _super.call(this, config, siteHub, siteFile, file);
                this.MATCH = /^(.+\/)*(\d{4}-\d{2}-\d{2})-(.*)(\.[^.]+)$/g;
                this.header = new Header();
                this.date = new PostDate();
                this.content = new Content();
                if(!this.validate(this.file)) {
                    throw new Error('invalid site file name');
                }
                this.name = file.substring(11, file.lastIndexOf('.'));
                this.parseDate(file.substring(0, 10));
                this.parserSiteData();
            }
            BlogPage.prototype.parserSiteData = function () {
                _super.prototype.parserSiteData.call(this);
                for(var key in this.siteFile.header) {
                    if(key == 'group') {
                        this.header.group = this.siteFile.header['group'];
                    } else {
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
                }
                this.content.md = this.siteFile.content;
                this.content.html = new this.showdown.converter().makeHtml(this.content.md);
                for(var i = 0; i < this.header.tags.length; i++) {
                    this.header.tags[i] = this.header.tags[i].trim();
                }
            };
            BlogPage.prototype.parseDate = function (strDate) {
                this.date.y = strDate.substr(0, 4);
                this.date.m = strDate.substr(5, 2);
                this.date.d = strDate.substr(8, 2);
            };
            BlogPage.prototype.validate = function (file) {
                return file.match(this.MATCH);
            };
            BlogPage.prototype.relatovePathName = function () {
                var result = '/' + this.config['folders']['site'] + '/';
                var parts = this.config['folders']['blog']['relativePath'].split('/');
                for(var i = 0; i < parts.length; i++) {
                    if(parts[i] && parts[i].substr(1).trim() != '') {
                        var p = eval('this.' + parts[i].substr(1));
                        if(p) {
                            result += p;
                        }
                        result += '/';
                    }
                }
                return result;
            };
            BlogPage.loadGroups = function loadGroups(pages) {
                var groups = [];
                if(pages.length > 0) {
                    for(var i = 0; i < pages.length; i++) {
                        var page = pages[i];
                        if(!groups[page.header.group]) {
                            groups[page.header.group] = [];
                        }
                        groups[page.header.group].push(page);
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
                }
                return groups;
            }
            return BlogPage;
        })(Site.SiteBase);
        Blog.BlogPage = BlogPage;        
    })(Site.Blog || (Site.Blog = {}));
    var Blog = Site.Blog;
})(Site || (Site = {}));
var Site;
(function (Site) {
    var SiteHub = (function () {
        function SiteHub() {
            this.fs = require('fs');
            this.jade = require('jade');
            this.fs3 = require('./libs/fs.removeRecursive');
            this.enumerable = require('./libs/linq');
            this.ncp = require('ncp').ncp;
            this.pages = [];
            this.plugins = {
            };
        }
        SiteHub.prototype.renderPlugin = function (plugin, main, page) {
            return this.plugins[plugin.toUpperCase()].render(main, page);
        };
        SiteHub.prototype.loadPlugins = function () {
            var itens = this.fs.readdirSync(this.config['folders']['plugins']);
            for(var i = 0; i < itens.length; i++) {
                var item = itens[i];
                var plugin = require(process.cwd() + '/' + this.config['folders']['plugins'] + '/' + item + '/main.js');
                this.plugins[item.toUpperCase()] = plugin;
            }
        };
        SiteHub.prototype.loadConfig = function () {
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync('./_config.json');
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            this.config = JSON.parse(fileContent);
            this.loadPlugins();
        };
        SiteHub.prototype.loadPages = function () {
            var files = this.fs.readdirSync(this.config['folders']['content']);
            if(files.length > 0) {
                files = this.enumerable.From(files).Reverse().ToArray();
                for(var i = 0; i < files.length; i++) {
                    var siteFile = new Site.SiteFile(files[i], this.config);
                    if(siteFile.header['engine']) {
                        var engine = siteFile.header['engine'];
                        if(engine == 'blog') {
                            console.log(engine);
                            var page = new Site.Blog.BlogPage(this, files[i], this.config, siteFile);
                            this.pages.push(page);
                        } else {
                            if(engine == 'doc') {
                            } else {
                                if(engine == 'page') {
                                }
                            }
                        }
                    }
                }
            }
        };
        SiteHub.prototype.getPage = function (page) {
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync(page, this.config['file_encode']);
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            var render = this.jade.compile(fileContent, {
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
                fileContent = this.fs.readFileSync('./atom.jade', this.config['file_encode']);
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            var render = this.jade.compile(fileContent, {
                filename: this.config['folders']['theme'] + '/tmpl'
            });
            return new Source(render({
                main: this,
                config: this.config
            }), this.config['folders']['site'] + '/atom.xml');
        };
        SiteHub.prototype.getJadePages = function () {
            var pages = [];
            var itens = this.fs.readdirSync('./' + this.config['folders']['theme']);
            for(var i = 0; i < itens.length; i++) {
                if(itens[i].substr(itens[i].lastIndexOf('.')).toUpperCase() == '.JADE') {
                    pages.push(itens[i]);
                }
            }
            return pages;
        };
        SiteHub.prototype.build = function () {
            var _this = this;
            this.loadConfig();
            this.loadPages();
            if(this.pages.length > 0) {
                for(var i = 0; i < this.pages.length; i++) {
                    this.pages[i].build();
                }
                this.fs3.removeRecursive('./' + this.config['folders']['site'], function (err, status) {
                    var itens = _this.getJadePages();
                    for(var i = 0; i < itens.length; i++) {
                        console.log(itens[i]);
                        _this.getPage('./' + _this.config['folders']['theme'] + '/' + itens[i]).saveToPath(_this.config['folders']['site'], '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html', _this.config['file_encode']);
                    }
                    _this.getAtom().saveToPath('./' + _this.config['folders']['site'], 'atom.xml', _this.config['file_encode']);
                    for(var i = 0; i < _this.pages.length; i++) {
                        _this.pages[i].getSource().save(_this.config['file_encode']);
                    }
                    for(var i = 0; i < _this.config['exclude'].length; i++) {
                        var folder = _this.config['exclude'][i];
                        _this.ncp('./' + _this.config['folders']['theme'] + '/' + folder, './' + _this.config['folders']['site'] + '/' + folder, function (err) {
                            if(err) {
                                return console.error(err);
                            }
                        });
                    }
                });
            }
        };
        return SiteHub;
    })();
    Site.SiteHub = SiteHub;    
})(Site || (Site = {}));
var OptionsParserException = (function () {
    function OptionsParserException(opt) {
        this.message = "Error! Unknown option '" + opt + "'\nError! Use the '--help' flag to see options\n";
    }
    return OptionsParserException;
})();
var OptionsParser = (function () {
    function OptionsParser() {
        this.DEFAULT_SHORT_FLAG = "-";
        this.DEFAULT_LONG_FLAG = "--";
        this.length = 0;
        this.unnamed = [];
        this.options = [];
    }
    OptionsParser.prototype.findOption = function (arg) {
        for(var i = 0; i < this.options.length; i++) {
            if(arg === this.options[i].short || arg === this.options[i].name) {
                return this.options[i];
            }
        }
        return null;
    };
    OptionsParser.prototype.printUsage = function () {
        Print.out("Syntax:   bloghub [options]");
        Print.out("");
        Print.out("Examples: bloghub --new blog");
        Print.out("          bloghub --build");
        Print.out("");
        Print.out("Options:");
        var output = [];
        var maxLength = 0;
        this.options = this.options.sort(function (a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();
            if(aName > bName) {
                return 1;
            } else {
                if(aName < bName) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
        for(var i = 0; i < this.options.length; i++) {
            var option = this.options[i];
            if(option.experimental) {
                continue;
            }
            if(!option.usage) {
                break;
            }
            var usageString = "  ";
            var type = option.type ? " " + option.type.toUpperCase() : "";
            if(option.short) {
                usageString += this.DEFAULT_SHORT_FLAG + option.short + type + ", ";
            }
            usageString += this.DEFAULT_LONG_FLAG + option.name + type;
            output.push([
                usageString, 
                option.usage
            ]);
            if(usageString.length > maxLength) {
                maxLength = usageString.length;
            }
        }
        for(var i = 0; i < output.length; i++) {
            Print.out(output[i][0] + (new Array(maxLength - output[i][0].length + 3)).join(" ") + output[i][1]);
        }
    };
    OptionsParser.prototype.option = function (name, config, short) {
        if(!config) {
            config = short;
            short = null;
        }
        config.name = name;
        config.short = short;
        config.flag = false;
        this.options.push(config);
    };
    OptionsParser.prototype.flag = function (name, config, short) {
        if(!config) {
            config = short;
            short = null;
        }
        config.name = name;
        config.short = short;
        config.flag = true;
        this.options.push(config);
    };
    OptionsParser.prototype.parse = function (args) {
        var position = 0;
        function consume() {
            return args[position++];
        }
        while(position < args.length) {
            var current = consume();
            var match = current.match(/^(--?)(.*)/);
            var value = null;
            if(match) {
                var arg = match[2];
                var option = this.findOption(arg);
                if(option === null) {
                    throw new OptionsParserException(arg);
                } else {
                    if(!option.flag) {
                        value = consume();
                    }
                    option.set(value);
                    this.length++;
                }
            } else {
                this.unnamed.push(current);
            }
        }
    };
    return OptionsParser;
})();
var FolderNotEmptyException = (function () {
    function FolderNotEmptyException() {
        this.message = "Error! this folder is not empty.\n";
    }
    return FolderNotEmptyException;
})();
var CreateSiteTypeException = (function () {
    function CreateSiteTypeException() {
        this.message = "Error! Invalid create site argument.\n";
    }
    return CreateSiteTypeException;
})();
var Main = (function () {
    function Main() {
        this.fs = require('fs');
    }
    Main.prototype.batchCompile = function () {
        var _this = this;
        var opts = new OptionsParser();
        opts.option('new', {
            usage: 'Create a new site source (examples --new blog)',
            experimental: false,
            set: function (str) {
                _this.newSite(str);
            }
        }, 'n');
        opts.option('build', {
            usage: 'build the site',
            set: function () {
                _this.buildSite();
            }
        }, 'b');
        opts.flag('help', {
            usage: 'Print this message',
            set: function () {
                opts.printUsage();
            }
        }, 'h');
        opts.parse(process.argv.slice(2));
        for(var i = 0; i < opts.unnamed.length; i++) {
            throw new OptionsParserException(opts.unnamed[i]);
        }
        if(opts.length == 0) {
            opts.printUsage();
        }
    };
    Main.prototype.buildSite = function () {
        new Site.SiteHub().build();
    };
    Main.prototype.isFolderEmpty = function () {
        var itens = this.fs.readdirSync("./");
        return itens.length == 0;
    };
    Main.prototype.newSite = function (type) {
        if(!type) {
            throw new CreateSiteTypeException();
        }
        if(!this.isFolderEmpty()) {
            throw new FolderNotEmptyException();
        }
        switch(type) {
            case "blog": {
                new Site.Blog.Builder().exec();
                break;

            }
            default: {
                throw new CreateSiteTypeException();

            }
        }
    };
    return Main;
})();
require('./libs/dateFormat');
try  {
    var main = new Main();
    main.batchCompile();
} catch (e) {
    Print.out(e.message);
}
