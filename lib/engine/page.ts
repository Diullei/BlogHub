class Page {
	siteFile: SiteFile;
	private template: string = 'index.html';
	
	constructor(public blog: Blog) {
	}
	
	parserSiteData() {
	}
	
	public outName() {
		return this.blog.buildRelatovePathName(this);
	}
	
	public build(): Source {
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync(this.blog.path + '/templates/' + this.template, 'binary');
		}
		catch (err) {
		  console.error("There was an error opening the file:");
		  console.log(err);
		}
		
		var render = jade.compile(fileContent);
		
		return new Source(render(this), this.blog.path + this.outName());
	}
}