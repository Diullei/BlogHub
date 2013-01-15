// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** references
///<reference path='engine/main.ts'/>
///<reference path='engine/print.ts'/>

require('./libs/dateFormat');

try { 
    var main = new Main();
    main.batchCompile();
} catch (e) { 
    Print.out(e.message);
}
