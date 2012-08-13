<<<<<<< HEAD
var JsonDatabaseManager = require('./db').JsonDatabaseManager;
=======
var JsonDatabaseManager = require('./../build/db').JsonDatabaseManager;
>>>>>>> 76d57c402b694337a47bfcfc7775cbc6ce544b69

function compile() {
	var inputFolder = __dirname  + '\\..\\..\\blog\\posts';
	var outPutFile = __dirname  + '\\..\\..\\blog\\compiled-sources\\posts';

	var db = new JsonDatabaseManager();

	db.createPostIndexerFile(inputFolder, outPutFile);
}

exports.compile = compile;