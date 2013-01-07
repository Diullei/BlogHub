var fs = require('fs');
var jade = require('jade');
var Showdown = require('./libs/showdown.js');

///<reference path='../lib/engine/blog.ts'/>
///<reference path='../lib/engine/source.ts'/>
///<reference path='../lib/engine/siteFile.ts'/>
///<reference path='../lib/engine/page.ts'/>
///<reference path='../lib/engine/site.ts'/>


declare var exports: any;

exports.testSiteFileNameCantBeNull = function(test) {
	try{
		new Site(null, new Blog(''));
		test.ok(false);
	}catch(e){
		test.ok(true);
	}
	
	test.done();
}

var fileName = "2013-01-05-site-name.md";
var site = new Site(fileName, new Blog('test/files/blog'));

exports.testSiteFileName = function(test) {
	test.ok(site.date.y == 2013);
	test.ok(site.date.m == 01);
	test.ok(site.date.d == 05);

	test.ok(site.header.title == "Titulo");
	test.ok(site.header.category == "Categoria");
	test.ok(site.header.tags.length == 3);
	test.ok(site.header.tags[0] == "categ1");
	test.ok(site.header.tags[1] == "categ2");
	test.ok(site.header.tags[2] == "categ3");
	
	test.done();
}

console.log(site.build().content);
console.log(site.build().path);

