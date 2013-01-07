class Blog {
	public config: {pagePathName: string;} = {pagePathName: "/:header.category/:date.y/:date.m/:date.d/:name"};

	constructor(public path: string) {
	}
	
	public buildRelatovePathName(page) {		 
		var result = '/';
		var parts = this.config.pagePathName.split('/');
		for(var i = 0; i<parts.length; i++) {
			if(parts[i] && parts[i].substr(1).trim() != '') {
				var p = eval('page.' + parts[i].substr(1));
				if(p) {
					result += p;
				}
				
				if(i < parts.length - 1) {
					result += '/';
				}
			}
		}
		return result;
	}
}
