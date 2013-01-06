var Blog = require('../lib/engine/blog');
var Post = require('../lib/engine/post');
exports.testPostFileNameCantBeNull = function (test) {
    try  {
        new Post(null, new Blog(''));
        test.ok(false);
    } catch (e) {
        test.ok(true);
    }
    test.done();
};
exports.testPostFileName = function (test) {
    var fileName = "2013-01-05-post-name.md";
    var post = new Post(fileName, new Blog('test/files/blog'));
    test.ok(post.date.y == 2013);
    test.ok(post.date.m == 1);
    test.ok(post.date.d == 5);
    test.ok(post.header.title == "Titulo");
    test.ok(post.header.category == "Categoria");
    test.ok(post.header.tags.length == 3);
    test.ok(post.header.tags[0] == "categ1");
    test.ok(post.header.tags[1] == "categ2");
    test.ok(post.header.tags[2] == "categ3");
    test.done();
};
