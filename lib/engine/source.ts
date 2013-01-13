// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

class Source {
    private fs = require('fs');
    private fs2 = require('./libs/node-fs');

	constructor(public content: string, public path: string) {
	}
	
	public save(encode: string) {
		this.fs2.mkdirSync(this.path, 0777, true);
		this.fs.writeFileSync(this.path + 'index.html', this.content, encode);
	}

	public saveToPath(path, fileName: string, encode: string) {
        this.fs2.mkdirSync(path, 0777, true);
		this.fs.writeFileSync(path + '/' + fileName, this.content, encode);
	}
}
