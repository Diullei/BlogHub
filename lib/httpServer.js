console.log('NOTE! Change site folder name if you are don´t using "_site" name');
console.log('ready on http://localhost:3000/');

var express = require('express');
var server = express();
server.configure(function () {
    server.use('/_site', express.static(__dirname + '/_site'));
    server.use(express.static(__dirname + '/_site'));
});

server.listen(3000);