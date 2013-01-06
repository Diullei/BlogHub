var Blog = (function () {
    function Blog(path) {
        this.path = path;
    }
    return Blog;
})();
var fs = require('fs');
var Showdown = require('./libs/showdown.js');
var Post = (function () {
    function Post(file, blog) {
        this.file = file;
        this.blog = blog;
        this.MATCH = /^(.+\/)*(\d{4}-\d{2}-\d{2})-(.*)(\.[^.]+)$/g;
        this.BREAK_LINE = '\n';
        this.header = {
            title: null,
            category: null,
            tags: []
        };
        this.date = {
            y: 0,
            m: 0,
            d: 0
        };
        this.content = {
            md: null,
            html: null
        };
        if(!this.file) {
            throw new Error('post file name cant be null');
        }
        if(!this.validate(this.file)) {
            throw new Error('invalid post file name');
        }
        this.parseDate(file.substring(0, 10));
        this.parserPostData();
    }
    Post.prototype.parserPostData = function () {
        var lines = null;
        var fileContent = null;
        try  {
            fileContent = fs.readFileSync(this.blog.path + '/' + this.file, 'binary');
        } catch (err) {
            console.error("There was an error opening the file:");
            console.log(err);
        }
        lines = fileContent.split(this.BREAK_LINE);
        var openHeader = false;
        for(var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if(line != '' && line != '---' && !openHeader) {
                throw new Error('invalid post header file');
            } else {
                if(line == '---') {
                    if(!openHeader) {
                        openHeader = true;
                    } else {
                        break;
                    }
                } else {
                    var key = line.split(':')[0];
                    if(key == 'title') {
                        this.header.title = line.substr(key.length + 1).trim();
                    } else {
                        if(key == 'category') {
                            this.header.category = line.substr(key.length + 1).trim();
                        } else {
                            if(key == 'tags') {
                                this.header.tags = line.substr(key.length + 1).trim().split(',');
                            }
                        }
                    }
                }
            }
        }
        i++;
        this.content.md = '';
        for(; i < lines.length; i++) {
            this.content.md += lines[i] + this.BREAK_LINE;
        }
        this.content.html = new Showdown.converter().makeHtml(this.content.md);
        for(var i = 0; i < this.header.tags.length; i++) {
            this.header.tags[i] = this.header.tags[i].trim();
        }
    };
    Post.prototype.parseDate = function (strDate) {
        this.date.y = strDate.substr(0, 4);
        this.date.m = strDate.substr(5, 2);
        this.date.d = strDate.substr(8, 2);
    };
    Post.prototype.validate = function (file) {
        return file.match(this.MATCH);
    };
    return Post;
})();
