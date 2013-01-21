// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

class ConfigFileNotFoundException implements Error { 
    public name: string;
    public message: string;

    constructor() { 
        this.message = "Config file not found.";
    }
}

class BlogHubDiagnostics {
    private static log4js = require('log4js');
    private static logger: any;

    public static init() { 
        BlogHubDiagnostics.log4js.configure({appenders: [{ type: 'console' }]});
        BlogHubDiagnostics.logger = BlogHubDiagnostics.log4js.getLogger('bloghub');
        BlogHubDiagnostics.logger.setLevel('INFO');
    }

    public static trace(msg) { 
        BlogHubDiagnostics.logger.trace(msg);
    }

    public static debug(msg) { 
        BlogHubDiagnostics.logger.debug(msg);
    }

    public static info(msg) { 
        BlogHubDiagnostics.logger.info(msg);
    }

    public static warn(msg) { 
        BlogHubDiagnostics.logger.warn(msg);
    }

    public static error(msg) { 
        BlogHubDiagnostics.logger.error(msg);
    }

    public static fatal(msg) { 
        BlogHubDiagnostics.logger.fatal(msg);
    }
}