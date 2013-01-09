class Source {
	constructor(public content: string, public path: string) {
	}
	
	public save() {
		fs2.mkdirSync(this.path, 0777, true);
		fs.writeFileSync(this.path + 'index.html', this.content, 'utf8');
	}
}
