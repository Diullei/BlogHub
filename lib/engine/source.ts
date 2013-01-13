class Source {
	constructor(public content: string, public path: string) {
	}
	
	public save(encode: string) {
		fs2.mkdirSync(this.path, 0777, true);
		fs.writeFileSync(this.path + 'index.html', this.content, encode);
	}

	public saveToPath(path, fileName: string, encode: string) {
        fs2.mkdirSync(path, 0777, true);
		fs.writeFileSync(path + '/' + fileName, this.content, encode);
	}
}
