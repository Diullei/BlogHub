var fs = require('fs');
var jade = require('jade');
var Showdown = require('./libs/showdown.js');

///<reference path='engine/blog.ts'/>
///<reference path='engine/source.ts'/>
///<reference path='engine/siteFile.ts'/>
///<reference path='engine/page.ts'/>
///<reference path='engine/site.ts'/>

//try { 
	var files = fs.readdirSync('_content'); 
//catch (err) {
//  console.error("There was an error reading files:");
//  console.log(err);
//}

if (files.length > 0) {
	for (var i = 0; i < files.length; i++) {
		//console.log(files[i]);
		var site = new Site(files[i], new Blog('./_content'));
		//console.log(site.build().content);
	}
}



