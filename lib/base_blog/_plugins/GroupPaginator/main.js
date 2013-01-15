var jade = require('jade');
var fs = require('fs');
exports.render = function (main, page, config) {
    var fileContent = null;
    try  {
        fileContent = fs.readFileSync(main.config['folders']['plugins'] + '/GroupPaginator/template.jade', main.config['file_encode']);
    } catch (err) {
        console.error("There was an error opening the file:");
        console.log(err);
    }
    var fn = jade.compile(fileContent);
    return fn({
        main: main,
        page: page,
        config: config
    });
};
