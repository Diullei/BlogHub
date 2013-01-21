// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='system/io/FileHandle.ts'/>
///<reference path='system/io/directory.ts'/>


class Source {

	constructor(public content: string, public path: string) {
	}
	
	public save(encode: string) {
		new System.IO.Directory().createDirectory(this.path);
		new System.IO.FileHandle().save(this.path + 'index.html', this.content);
	}

	public saveToPath(path, fileName: string, encode: string) {
        new System.IO.Directory().createDirectory(path);
        new System.IO.FileHandle().save(path + '/' + fileName, this.content);
	}
}
