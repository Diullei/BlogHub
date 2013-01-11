declare var require: any;
declare var process: any;

var jade = require('jade');
var fs = require('fs');

declare var exports: any;

var out = '';

exports.render = function (main, page) {
    //return 'xxxxxxxxxxxxxxxxxxxxxxxxx';
	var fileContent = null;
	try {
		fileContent = fs.readFileSync(main.config['folders']['plugins'] + '/GroupPaginator/template.html', 'binary');
        //fileContent = fs.readFileSync('template.html', 'binary');
	}
	catch (err) {
		console.error("There was an error opening the file:");
		console.log(err);
	}
	
	//return fileContent;

	var fn = jade.compile(fileContent);

	return fn({main: main, page: page});
};

//exports.result = out;