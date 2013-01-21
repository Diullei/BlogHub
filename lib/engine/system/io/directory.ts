// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../../definition/node-0.8.d.ts'/>

module System.IO {

    export class Directory {
        private _fs = require('fs');
        private  _path = require('path');

        public directoryExists(path: string): bool { 
            return this._fs.existsSync(path) && this._fs.lstatSync(path).isDirectory();
        }

        public createDirectory(path: string): void { 
            if (!this.directoryExists(path)) {

                path = path.replace('\\', '/');
                var parts = path.split('/');

                var dpath = '';
                for (var i = 0; i < parts.length; i++) { 
                    dpath += parts[i] + '/';
                    if (!this.directoryExists(path)) {
                        this._fs.mkdirSync(dpath);
                    }
                }
            }
        }

        public dirName(path: string): string { 
            return this._path.dirname(path);
        }

        public getFiles(path, spec?, options?): string[] { 
            options = options || <{ recursive?: bool; }>{};

            var filesInFolder = (folder: string): string[] => {
                var paths = [];

                var files = this._fs.readdirSync(folder);
                for (var i = 0; i < files.length; i++) {
                    var stat = this._fs.statSync(folder + "/" + files[i]);
                    if (options.recursive && stat.isDirectory()) {
                        paths = paths.concat(filesInFolder(folder + "/" + files[i]));
                    } else if (stat.isFile() && (!spec || files[i].match(spec))) {
                        paths.push(folder + "/" + files[i]);
                    }
                }

                return paths;
            }

            return filesInFolder(path);
        }

        public getFolders(path): string[] { 
            var paths = [];

            var files = this._fs.readdirSync(path);
            for (var i = 0; i < files.length; i++) {
                var stat = this._fs.statSync(path + "/" + files[i]);
                if (stat.isDirectory()) {
                    paths.push(files[i]);
                }
            }

            return paths;
        }

    }
}