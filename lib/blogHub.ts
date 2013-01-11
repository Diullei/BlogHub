// **** definitions
///<reference path='../definition/linq-2.2.d.ts'/>

// **** references
///<reference path='engine/blog.ts'/>
///<reference path='engine/source.ts'/>
///<reference path='engine/siteFile.ts'/>
///<reference path='engine/pageBase.ts'/>
///<reference path='engine/page.ts'/>
///<reference path='engine/siteHub.ts'/>
///<reference path='engine/main.ts'/>

// **** imports
var ncp = require('ncp').ncp;
var jade = require('jade');
var fs = require('fs');
var fs2 = require('./libs/node-fs');
var fs3 = require('./libs/fs.removeRecursive');
var Showdown = require('./libs/showdown.js');
var Enumerable = require('./libs/linq');

// **** declarations
declare var process: any;
declare var __dirname: any;

// **** configurations
ncp.limit = 16;

// **** boot
Main.run();