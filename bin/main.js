var ConfigFileNotFoundException = (function () {
    function ConfigFileNotFoundException() {
        this.message = "Config file not found.";
    }
    return ConfigFileNotFoundException;
})();
var BlogHubDiagnostics = (function () {
    function BlogHubDiagnostics() { }
    BlogHubDiagnostics.log4js = require('log4js');
    BlogHubDiagnostics.logger = undefined;
    BlogHubDiagnostics.init = function init() {
        BlogHubDiagnostics.log4js.configure({
            appenders: [
                {
                    type: 'console'
                }
            ]
        });
        BlogHubDiagnostics.logger = BlogHubDiagnostics.log4js.getLogger('bloghub');
        BlogHubDiagnostics.logger.setLevel('INFO');
    }
    BlogHubDiagnostics.trace = function trace(msg) {
        BlogHubDiagnostics.logger.trace(msg);
    }
    BlogHubDiagnostics.debug = function debug(msg) {
        BlogHubDiagnostics.logger.debug(msg);
    }
    BlogHubDiagnostics.info = function info(msg) {
        BlogHubDiagnostics.logger.info(msg);
    }
    BlogHubDiagnostics.warn = function warn(msg) {
        BlogHubDiagnostics.logger.warn(msg);
    }
    BlogHubDiagnostics.error = function error(msg) {
        BlogHubDiagnostics.logger.error(msg);
    }
    BlogHubDiagnostics.fatal = function fatal(msg) {
        BlogHubDiagnostics.logger.fatal(msg);
    }
    return BlogHubDiagnostics;
})();
var Site;
(function (Site) {
    var SiteFile = (function () {
        function SiteFile(file) {
            this.fs = require('fs');
            this.BREAK_LINE = '\n';
            this.header = {
            };
            this.config = new Config();
            var lines = null;
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync('./' + this.config.folders.content + '/' + file, this.config.fileEncode);
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
        function SiteBase(siteHub, siteFile, file) {
            this.siteHub = siteHub;
            this.siteFile = siteFile;
            this.file = file;
            this.fs = require('fs');
            this.jade = require('jade');
            this.showdown = require('./libs/showdown.js');
            this.config = new Config();
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
            this.url = this.relatovePathName().substr(this.config.folders.site.length + 1);
        };
        SiteBase.prototype.getSource = function () {
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync('./' + this.config.folders.theme + '/' + (this.siteFile.header['template']), this.config.fileEncode);
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            var render = this.jade.compile(fileContent, {
                filename: this.config.folders.theme + '/tmpl'
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
var IO = (function () {
    function IO() { }
    IO.fs = require('fs');
    IO.ncp = require('ncp').ncp;
    IO.readFileSync = function readFileSync(file) {
        var fileContent = null;
        try  {
            return fileContent = this.fs.readFileSync(file);
        } catch (err) {
            throw new ConfigFileNotFoundException();
        }
    }
    IO.readJsonFile = function readJsonFile(file) {
        var fileContent = IO.readFileSync(file);
        return JSON.parse(fileContent);
    }
    IO.readDirSync = function readDirSync(path) {
        return this.fs.readdirSync(path);
    }
    IO.copyFolder = function copyFolder(folder, destination, callback) {
        this.ncp(folder, destination, function (err) {
            callback(err);
        });
    }
    return IO;
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
                this.CURRENT_FOLDER = './';
            }
            Builder.prototype.exec = function () {
                IO.copyFolder(__dirname + '/../lib/base_blog/', this.CURRENT_FOLDER, function (err) {
                    if(err) {
                        throw err;
                    }
                    BlogHubDiagnostics.info('blog site created');
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
            function BlogPage(siteHub, file, siteFile) {
                        _super.call(this, siteHub, siteFile, file);
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
                var config = new Config();
                var result = '/' + config.folders.site + '/';
                var parts = config.folders.blog.relativePath.split('/');
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
var ConfigPropertyNotFoundException = (function () {
    function ConfigPropertyNotFoundException(key) {
        this.message = "Config property: '" + key + "' not found";
    }
    return ConfigPropertyNotFoundException;
})();
var BlogCobfig = (function () {
    function BlogCobfig(cfg) {
        this.cfg = cfg;
    }
    Object.defineProperty(BlogCobfig.prototype, "relativePath", {
        get: function () {
            return this.get('relativePath');
        },
        enumerable: true,
        configurable: true
    });
    BlogCobfig.prototype.get = function (key) {
        if(this.cfg.__blog[key]) {
            return this.cfg.__blog[key];
        } else {
            throw new ConfigPropertyNotFoundException('blog.' + key);
        }
    };
    return BlogCobfig;
})();
var AuthorConfig = (function () {
    function AuthorConfig(cfg) {
        this.cfg = cfg;
    }
    Object.defineProperty(AuthorConfig.prototype, "name", {
        get: function () {
            return this.get('name');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthorConfig.prototype, "email", {
        get: function () {
            return this.get('email');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthorConfig.prototype, "github", {
        get: function () {
            return this.get('github');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthorConfig.prototype, "twitter", {
        get: function () {
            return this.get('twitter');
        },
        enumerable: true,
        configurable: true
    });
    AuthorConfig.prototype.get = function (key) {
        if(key in this.cfg.__author) {
            return this.cfg.__author[key];
        } else {
            throw new ConfigPropertyNotFoundException('author.' + key);
        }
    };
    return AuthorConfig;
})();
var FoldersConfig = (function () {
    function FoldersConfig(cfg) {
        this.cfg = cfg;
    }
    Object.defineProperty(FoldersConfig.prototype, "site", {
        get: function () {
            return this.get('site');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "plugins", {
        get: function () {
            return this.get('plugins');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "content", {
        get: function () {
            return this.get('content');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "theme", {
        get: function () {
            return this.get('theme');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "basePath", {
        get: function () {
            return this.get('basePath');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "current", {
        get: function () {
            return process.cwd();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "__blog", {
        get: function () {
            return this.get('blog');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldersConfig.prototype, "blog", {
        get: function () {
            return new BlogCobfig(this);
        },
        enumerable: true,
        configurable: true
    });
    FoldersConfig.prototype.get = function (key) {
        if(key in this.cfg.__folders) {
            return this.cfg.__folders[key];
        } else {
            throw new ConfigPropertyNotFoundException('folders.' + key);
        }
    };
    return FoldersConfig;
})();
var Config = (function () {
    function Config() {
        this.init();
    }
    Config.json = undefined;
    Object.defineProperty(Config.prototype, "version", {
        get: function () {
            return this.get('version');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "fileEncode", {
        get: function () {
            return this.get('file_encode');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "copyFolders", {
        get: function () {
            return this.get('copy_folders');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "__folders", {
        get: function () {
            return this.get('folders');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "folders", {
        get: function () {
            return new FoldersConfig(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "__author", {
        get: function () {
            return this.get('author');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "author", {
        get: function () {
            return new AuthorConfig(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "tagLine", {
        get: function () {
            return this.get('tagLine');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "defaultGroup", {
        get: function () {
            return this.get('default_group');
        },
        enumerable: true,
        configurable: true
    });
    Config.prototype.init = function () {
        if(!Config.json) {
            BlogHubDiagnostics.debug('loading config file');
            Config.json = IO.readJsonFile('./_config.json');
            BlogHubDiagnostics.debug('config file loaded');
        }
    };
    Config.prototype.get = function (key) {
        if(key in Config.json) {
            return Config.json[key];
        } else {
            throw new ConfigPropertyNotFoundException(key);
        }
    };
    return Config;
})();
var Site;
(function (Site) {
    var SiteHub = (function () {
        function SiteHub() {
            this.MAIN_PLUGIN_FILE = '/main.js';
            this.fs = require('fs');
            this.jade = require('jade');
            this.fs3 = require('./libs/fs.removeRecursive');
            this.enumerable = require('./libs/linq');
            this.ncp = require('ncp').ncp;
            this.pages = [];
            this.plugins = {
            };
            this.config = new Config();
        }
        SiteHub.prototype.renderPlugin = function (plugin, page) {
            BlogHubDiagnostics.debug('loading "' + plugin + '" plugin');
            if(this.plugins[plugin.toUpperCase()]) {
                return this.plugins[plugin.toUpperCase()].render(this, page, this.config);
            } else {
                BlogHubDiagnostics.error('"' + plugin + '" plugin not found');
                return '<div style="color:red;border: 2px solid red;background-color: yellow;padding: 15px;"><strong>' + plugin + '</strong> PLUGIN NOT FOUND</div>';
            }
        };
        SiteHub.prototype.loadPlugins = function () {
            var itens = this.fs.readdirSync(this.config.folders.plugins);
            for(var i = 0; i < itens.length; i++) {
                var item = itens[i];
                var plugin = require(this.config.folders.current + '/' + this.config.folders.plugins + '/' + item + this.MAIN_PLUGIN_FILE);
                this.plugins[item.toUpperCase()] = plugin;
            }
        };
        SiteHub.prototype.loadPages = function () {
            var files = this.fs.readdirSync(this.config.folders.content);
            if(files.length > 0) {
                files = this.enumerable.From(files).Reverse().ToArray();
                for(var i = 0; i < files.length; i++) {
                    var siteFile = new Site.SiteFile(files[i]);
                    if(siteFile.header['engine']) {
                        var engine = siteFile.header['engine'];
                        if(engine == 'blog') {
                            var page = new Site.Blog.BlogPage(this, files[i], siteFile);
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
                fileContent = this.fs.readFileSync(page, this.config.fileEncode);
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            var render = this.jade.compile(fileContent, {
                filename: this.config.folders.theme + '/tmpl'
            });
            return new Source(render({
                main: this,
                config: this.config
            }), this.config.folders.site);
        };
        SiteHub.prototype.getAtom = function () {
            var fileContent = null;
            try  {
                fileContent = this.fs.readFileSync('./atom.jade', this.config.fileEncode);
            } catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }
            var render = this.jade.compile(fileContent, {
                filename: this.config.folders.theme + '/tmpl'
            });
            return new Source(render({
                main: this,
                config: this.config
            }), this.config.folders.site + '/atom.xml');
        };
        SiteHub.prototype.getJadePages = function () {
            var pages = [];
            var itens = this.fs.readdirSync('./' + this.config.folders.theme);
            for(var i = 0; i < itens.length; i++) {
                if(itens[i].substr(itens[i].lastIndexOf('.')).toUpperCase() == '.JADE') {
                    pages.push(itens[i]);
                }
            }
            return pages;
        };
        SiteHub.prototype.copyThemeFolders = function () {
            for(var i = 0; i < this.config.copyFolders.length; i++) {
                var folder = this.config.copyFolders[i];
                this.ncp('./' + this.config.folders.theme + '/' + folder, './' + this.config.folders.site + '/' + folder, function (err) {
                    if(err) {
                        return console.error(err);
                    }
                });
            }
        };
        SiteHub.prototype.saveAtom = function () {
            this.getAtom().saveToPath('./' + this.config.folders.site, 'atom.xml', this.config.fileEncode);
        };
        SiteHub.prototype.buildPages = function () {
            if(this.pages.length > 0) {
                for(var i = 0; i < this.pages.length; i++) {
                    this.pages[i].build();
                }
            }
        };
        SiteHub.prototype.saveMdPages = function () {
            for(var i = 0; i < this.pages.length; i++) {
                this.pages[i].getSource().save(this.config.fileEncode);
            }
        };
        SiteHub.prototype.saveJadePages = function () {
            var itens = this.getJadePages();
            for(var i = 0; i < itens.length; i++) {
                BlogHubDiagnostics.info('[Create] file: ' + itens[i]);
                this.getPage('./' + this.config.folders.theme + '/' + itens[i]).saveToPath(this.config.folders.site, '/' + itens[i].substr(0, itens[i].lastIndexOf('.')) + '.html', this.config.fileEncode);
            }
        };
        SiteHub.prototype.savePages = function () {
            this.saveJadePages();
            this.saveAtom();
            this.saveMdPages();
        };
        SiteHub.prototype.build = function () {
            var _this = this;
            this.loadPlugins();
            this.loadPages();
            if(this.pages.length > 0) {
                this.buildPages();
                this.fs3.removeRecursive('./' + this.config.folders.site, function (err, status) {
                    _this.savePages();
                    _this.copyThemeFolders();
                });
            }
        };
        return SiteHub;
    })();
    Site.SiteHub = SiteHub;    
})(Site || (Site = {}));
var OptionsParserException = (function () {
    function OptionsParserException() {
        this.message = '';
        var opts = arguments[0];
        if(Array.isArray(opts)) {
            for(var i = 0; i < opts.length; i++) {
                this.message += "\nUnknown option '" + opts[i] + "'\nUse the '--help' flag to see options\n";
            }
        } else {
            this.message = "\nUnknown option '" + opts + "'\nUse the '--help' flag to see options\n";
        }
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
var StaticHttpServer = (function () {
    function StaticHttpServer() {
        this.fs = require('fs');
        this.express = require('express');
    }
    StaticHttpServer.prototype.init = function () {
        var _this = this;
        BlogHubDiagnostics.debug('Initing Static HttpServer');
        this.config = new Config();
        this.server = this.express();
        this.server.configure(function () {
            var path = _this.config.folders.current + '/' + _this.config.folders.site;
            _this.server.use(path, _this.express.static(path));
            _this.server.use(_this.express.static(path));
        });
    };
    StaticHttpServer.prototype.start = function () {
        BlogHubDiagnostics.debug('Starting HttpServer...');
        this.server.listen(3000);
        BlogHubDiagnostics.info('Ready on http://localhost:3000/');
    };
    return StaticHttpServer;
})();
var FolderNotEmptyException = (function () {
    function FolderNotEmptyException() {
        this.message = "This folder is not empty";
    }
    return FolderNotEmptyException;
})();
var CreateSiteTypeException = (function () {
    function CreateSiteTypeException() {
        this.message = "Invalid create site argument";
    }
    return CreateSiteTypeException;
})();
var Main = (function () {
    function Main() {
        this.CURRENT_FOLDER = './';
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
        opts.flag('build', {
            usage: 'Build the site',
            set: function () {
                _this.buildSite();
            }
        }, 'b');
        opts.flag('server', {
            usage: 'Run local server',
            set: function () {
                _this.runServer();
            }
        }, 's');
        opts.flag('help', {
            usage: 'Print this message',
            set: function () {
                opts.printUsage();
            }
        }, 'h');
        BlogHubDiagnostics.debug('process.argv.length: ' + process.argv.slice(2).length);
        opts.parse(process.argv.slice(2));
        for(var i = 0; i < opts.unnamed.length; i++) {
            BlogHubDiagnostics.error('unnamed opts: ' + opts.unnamed[i]);
        }
        if(opts.unnamed.length > 0) {
            throw new OptionsParserException(opts.unnamed);
        }
        if(opts.length == 0) {
            BlogHubDiagnostics.debug('printing help...');
            opts.printUsage();
        }
    };
    Main.prototype.buildSite = function () {
        new Site.SiteHub().build();
    };
    Main.prototype.isFolderEmpty = function () {
        var itens = IO.readDirSync(this.CURRENT_FOLDER);
        return itens.length == 0;
    };
    Main.prototype.runServer = function () {
        var server = new StaticHttpServer();
        server.init();
        server.start();
    };
    Main.prototype.newSite = function (type) {
        if(!type) {
            throw new CreateSiteTypeException();
        }
        if(!this.isFolderEmpty()) {
            throw new FolderNotEmptyException();
        }
        BlogHubDiagnostics.debug("new site: " + type);
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
BlogHubDiagnostics.init();
BlogHubDiagnostics.debug('Starting...');
try  {
    var main = new Main();
    main.batchCompile();
} catch (e) {
    BlogHubDiagnostics.fatal(e.message);
}
