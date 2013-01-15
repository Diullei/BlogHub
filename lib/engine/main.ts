// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='site/siteHub.ts'/>
///<reference path='optionsParser.ts'/>

class FolderNotEmptyException implements Error { 
    public name: string;
    public message: string;

    constructor() { 
        this.message = "Error! this folder is not empty.\n";
    }
}

class CreateSiteTypeException implements Error { 
    public name: string;
    public message: string;

    constructor() { 
        this.message = "Error! Invalid create site argument.\n";
    }
}

class Main {
    private fs = require('fs');

    public batchCompile() {
        var opts = new OptionsParser();

        opts.option('new', {
            usage: 'Create a new site source (examples --new blog)',
            experimental: false,
            set: (str) => {
                this.newSite(str);
            }
        }, 'n');

        opts.option('build', {
            usage: 'build the site',
            set: () => {
                this.buildSite()
            }
        }, 'b');

        opts.flag('help', {
            usage: 'Print this message',
            set: () => {
                opts.printUsage();
            }
        }, 'h');

        opts.parse(process.argv.slice(2));

        for (var i = 0; i < opts.unnamed.length; i++) {
            throw new OptionsParserException(opts.unnamed[i]);
        }

        if (opts.length == 0) { 
            opts.printUsage();
        }
    }

    public buildSite() { 
        new Site.SiteHub().build();
    }

    public isFolderEmpty() { 
        var itens = this.fs.readdirSync("./");
        return itens.length == 0;
    }

    public newSite(type: string) { 
        if(!type)
            throw new CreateSiteTypeException();

        if (!this.isFolderEmpty()) {
            throw new FolderNotEmptyException();
        }

        switch (type) { 
            case "blog":
                new Site.Blog.Builder().exec();
                this.fs.createReadStream(__dirname + '/../lib/httpServer.js').pipe(this.fs.createWriteStream('./httpServer.js'));
            break;
            default:
                throw new CreateSiteTypeException();
        }
    }
}
