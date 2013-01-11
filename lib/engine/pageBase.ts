class PageBase {
	siteFile: SiteFile;
	group: string = '';
	url: string;
	
	constructor(public blog: Blog, public config: Object, public siteHub: SiteHub) {
	}
	
	parserSiteData() {
		if(this.siteFile.header['group']) {
			this.group = this.siteFile.header['group'];
		}
	}
	
	public outName() {
		return this.blog.buildRelatovePathName(this);
	}
	
	public build() { 
		this.url = this.outName().substr(this.config['folders']['site'].length + 1);
    }

	public getSource(): Source {
		var fileContent = null;
		try {
		  fileContent = fs.readFileSync(this.blog.path + '/' + this.config['folders']['theme'] + '/' + this.config['template']['default'], 'utf8');
		}
		catch (err) {
		  console.error("There was an error opening the file:");
		  console.log(err);
		}

		var render = jade.compile(fileContent);

		return new Source(render( { main: this.siteHub, page: this } ), this.blog.path + this.outName());
	}
}