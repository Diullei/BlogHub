class Blog {
	constructor(public path: string) {
	}
	
	public buildRelatovePathName(page) {
		var result = '/' + page.config['folders']['site'] + '/';
		var parts = page.config['folders']['relativePath'].split('/');
		for(var i = 0; i<parts.length; i++) {
			if(parts[i] && parts[i].substr(1).trim() != '') {
				var p = eval('page.' + parts[i].substr(1));
				if(p) {
					result += p;
				}
				
				result += '/';
			}
		}
		return result;
	}
}
