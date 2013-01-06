declare var require: any;

var fs = require('fs');
var Showdown = require('./libs/showdown.js');

class PostFile {
	private BREAK_LINE = '\n';
	
	public header: Object = {};
	public content: string;

	constructor(file: string, blog: Blog) {
		var lines = null;
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync(blog.path + '/' + file, 'binary');
		}
		catch (err) {
		  console.error("There was an error opening the file:");
		  console.log(err);
		}	
	
		lines = fileContent.split(this.BREAK_LINE);
		
		var openHeader = false;
		
		for(var i = 0; i < lines.length; i++) {
			var line = lines[i].trim();
			if(line != '' && line != '---' && !openHeader) {
				throw new Error('invalid post header file');
			} else if(line == '---') {
				if(!openHeader) {
					openHeader = true;
				} else {
					break;
				}
			} else {
				var key = line.split(':')[0];
				this.header[key] = line.substr(key.length + 1).trim();
			}
		}
		
		i++;
		this.content = '';
		for(; i < lines.length; i++) {
			this.content += lines[i] + this.BREAK_LINE;
		}
	}
}

class Post {
	private MATCH: any = /^(.+\/)*(\d{4}-\d{2}-\d{2})-(.*)(\.[^.]+)$/g;
	private postFile: PostFile;
	
	public header: {
		title: string; 
		category: string; 
		tags: string[];
	} = {title: null, category: null, tags: []};
	public date: {
		y: number; 
		m: number; 
		d: number;
	} = {y:0,m:0,d:0};
	public content: {
		md: string; 
		html: string;
	} = {md: null, html: null};
	
	constructor(public file: string, public blog: Blog) {
		if(!this.file) {
			throw new Error('post file name cant be null');
		}
		
		if(!this.validate(this.file)) {
			throw new Error('invalid post file name');
		}
		
		this.parseDate(file.substring(0, 10));
		this.parserPostData();
	}
	
	private parserPostData() {
		this.postFile = new PostFile(this.file, this.blog);
		
		for(var key in this.postFile.header) {
			if(key == 'title') {
				this.header.title = this.postFile.header[key];
			}
			else if(key == 'category') {
				this.header.category = this.postFile.header[key];
			}
			else if(key == 'tags') {
				this.header.tags = this.postFile.header[key].split(',');
			}
		}
		
		this.content.md = this.postFile.content;
		
		this.content.html = new Showdown.converter().makeHtml(this.content.md);

		for(var i = 0; i<this.header.tags.length; i++) {
			this.header.tags[i] = this.header.tags[i].trim();
		}
	}
	
	private parseDate(strDate) {
		this.date.y = strDate.substr(0, 4);
		this.date.m = strDate.substr(5, 2);
		this.date.d = strDate.substr(8, 2);
	}
	
	private validate(file: string) {
		return file.match(this.MATCH);
	}
}
