class SiteFile {
	private BREAK_LINE = '\n';
	
	public header: Object = {};
	public content: string;

	constructor(file: string, blog: Blog, config: Object) {
		var lines = null;
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync(blog.path + '/' + config['folders']['content'] + '/' + file, config['file_encode']);
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
                console.log(line)
				throw new Error('invalid site header file');
			} else if(line == '---') {
				if(!openHeader) {
					openHeader = true;
				} else {
					break;
				}
			} else {
			    var key = line.split(':')[0];
				this.header[key.trim()] = line.substr(key.length + 1).trim();
			}
		}
		
		i++;
		this.content = '';
		for(; i < lines.length; i++) {
			this.content += lines[i] + this.BREAK_LINE;
		}
	}
}