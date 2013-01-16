// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='BlogHubDiagnostics.ts'/>
///<reference path='io.ts'/>

class ConfigPropertyNotFoundException implements Error { 
    public name: string;
    public message: string;

    constructor(key: string) { 
        this.message = "Config property: '" + key + "' not found";
    }
}

class BlogCobfig { 
    public cfg: FoldersConfig;

    constructor(cfg: FoldersConfig) {
        this.cfg = cfg;
    }

    public get relativePath() { 
        return this.get('relativePath');
    }

    public get(key: string) { 
        if (this.cfg.__blog[key]) {
            return this.cfg.__blog[key];
        } else { 
            throw new ConfigPropertyNotFoundException('blog.' + key);
        }
    }
}

class AuthorConfig { 
    public cfg: Config;

    constructor(cfg: Config) {
        this.cfg = cfg;
    }

    public get name() { 
        return this.get('name');
    }

    public get email() { 
        return this.get('email');
    }

    public get github() { 
        return this.get('github');
    }

    public get twitter() { 
        return this.get('twitter');
    }

    public get(key: string) { 
        if (key in this.cfg.__author) {
            return this.cfg.__author[key];
        } else { 
            throw new ConfigPropertyNotFoundException('author.' + key);
        }
    }
}

class FoldersConfig { 
    public cfg: Config;

    constructor(cfg: Config) {
        this.cfg = cfg;
    }

    public get site() { 
        return this.get('site');
    }

    public get plugins() { 
        return this.get('plugins');
    }

    public get content() { 
        return this.get('content');
    }

    public get theme() { 
        return this.get('theme');
    }

    public get basePath() { 
        return this.get('basePath');
    }

    public get current(): string { 
        return <string><any>process.cwd();
    }

    public get __blog() { 
        return this.get('blog');
    }

    public get blog(): BlogCobfig { 
        return new BlogCobfig(this);
    }

    public get(key: string) { 
        if (key in this.cfg.__folders) {
            return this.cfg.__folders[key];
        } else { 
            throw new ConfigPropertyNotFoundException('folders.' + key);
        }
    }
}

class Config { 
    private static json: any;

    public get version() { 
        return this.get('version');
    }

    public get fileEncode() { 
        return this.get('file_encode');
    }

    public get copyFolders(): string[] { 
        return this.get('copy_folders');
    }

    public get __folders() { 
        return this.get('folders');
    }

    public get folders(): FoldersConfig {
        return new FoldersConfig(this); 
    }

    public get __author() { 
        return this.get('author');
    }

    public get author(): AuthorConfig {
        return new AuthorConfig(this); 
    }

    public get tagLine() { 
        return this.get('tagLine');
    }

    public get defaultGroup() { 
        return this.get('default_group');
    }

    constructor() { 
        this.init();
    }

    public init() { 
        if (!Config.json) {
            BlogHubDiagnostics.debug('loading config file');
            Config.json = IO.readJsonFile('./_config.json');
            BlogHubDiagnostics.debug('config file loaded');
        }
    }

    public get(key: string) { 
        if (key in Config.json) {
            return Config.json[key];
        } else { 
            throw new ConfigPropertyNotFoundException(key);
        }
    }
}