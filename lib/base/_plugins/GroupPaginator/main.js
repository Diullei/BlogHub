var jade = require('jade');
var fs = require('fs');
var out = '';
exports.render = function (main, page) {
    var fileContent = null;
    try  {
        fileContent = fs.readFileSync(main.config['folders']['plugins'] + '/GroupPaginator/template.html', 'binary');
    } catch (err) {
        console.error("There was an error opening the file:");
        console.log(err);
    }
    var fn = jade.compile(fileContent);
    return fn({
        main: main,
        page: page
    });
};
