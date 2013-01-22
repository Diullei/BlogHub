// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='BlogHubDiagnostics.ts'/>
///<reference path='config.ts'/>

class StaticHttpServer { 
    private express = require('express');
    private server: any;
    private config: Config;

    public init() { 
        BlogHubDiagnostics.debug('Initing Static HttpServer');

        this.config = new Config();

        this.server = this.express();
        this.server.configure( () => {
            var path = this.config.folders.current + '/' + this.config.folders.site;
            this.server.use(path, this.express.static(path));
            this.server.use(this.express.static(path));
        });
    }

    public start() { 
        BlogHubDiagnostics.debug('Starting HttpServer...');
        this.server.listen(3000);
        BlogHubDiagnostics.info('Ready on http://localhost:3000/');
    }
}