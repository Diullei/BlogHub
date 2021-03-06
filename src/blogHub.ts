// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** references
///<reference path='engine/main.ts'/>
///<reference path='engine/blogHubDiagnostics.ts'/>

require('./libs/dateFormat');

BlogHubDiagnostics.init();

BlogHubDiagnostics.debug('Starting...');

try { 
    var main = new Main();
    main.batchCompile();
} catch (e) { 
    BlogHubDiagnostics.fatal(e.message);
    console.log(e.stack);
}
