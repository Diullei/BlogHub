// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='blogHubDiagnostics.ts'/>
///<reference path='site/siteHub.ts'/>
///<reference path='optionsParser.ts'/>
///<reference path='staticHttpServer.ts'/>
///<reference path='config.ts'/>

class FolderNotEmptyException implements Error { 
    public name: string;
    public message: string;

    constructor() { 
        this.message = "This folder is not empty";
    }
}

class CreateSiteTypeException implements Error { 
    public name: string;
    public message: string;

    constructor() { 
        this.message = "Invalid create site argument";
    }
}

class Main {
    private CURRENT_FOLDER = './';

    public batchCompile() {
        var opts = new OptionsParser();

        opts.option('new', {
            usage: 'Create a new site source (examples --new blog)',
            experimental: false,
            set: (str) => {
                this.newSite(str);
            }
        }, 'n');

        opts.flag('build', {
            usage: 'Build the site',
            set: () => {
                this.buildSite()
            }
        }, 'b');

        opts.flag('server', {
            usage: 'Run local server',
            set: () => {
                this.runServer();
            }
        }, 's');

        opts.flag('help', {
            usage: 'Print this message',
            set: () => {
                opts.printUsage();
            }
        }, 'h');

        BlogHubDiagnostics.debug('process.argv.length: ' + process.argv.slice(2).length);
        opts.parse(process.argv.slice(2));

        for (var i = 0; i < opts.unnamed.length; i++) {
            BlogHubDiagnostics.error('unnamed opts: ' + opts.unnamed[i]);
        }

        if (opts.unnamed.length > 0) { 
            throw new OptionsParserException(opts.unnamed);
        }

        if (opts.length == 0) { 
            BlogHubDiagnostics.debug('printing help...');
            opts.printUsage();
        }
    }

    public buildSite() { 
        new Site.SiteHub().build();
    }

    public isFolderEmpty() { 
        return new System.IO.Directory().isEmpty(this.CURRENT_FOLDER);
    }

    public runServer() { 
        var server = new StaticHttpServer();
        server.init();
        server.start();
    }

    public newSite(type: string) { 
        if(!type)
            throw new CreateSiteTypeException();

        if (!this.isFolderEmpty()) {
            throw new FolderNotEmptyException();
        }

        BlogHubDiagnostics.debug("new site: " + type);

        switch (type) { 
            case "blog":
                new Site.Blog.Builder().exec();
            break;
            default:
                throw new CreateSiteTypeException();
        }
    }
}
