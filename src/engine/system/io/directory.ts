// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../../definition/node-0.8.d.ts'/>

module System.IO {

    export class Directory {
        private _fs = require('fs');
        private _path = require('path');

        public directoryExists(path: string): bool {
            return this._fs.existsSync(path) && this._fs.lstatSync(path).isDirectory();
        }

        public createDirectory(path: string): void {
            path = path.replace(/\\/g, '/');
            path = path.replace('//', '/');

            if (!this.directoryExists(path)) {

                var parts = path.split('/');

                var dpath = '';
                for (var i = 0; i < parts.length; i++) {
                    dpath += parts[i] + '/';
                    //if (dpath != './') {
                        if (!this.directoryExists(dpath)) {
                            this._fs.mkdirSync(dpath);
                        }
                    //}
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

        public getFolders(path: string): string[] {
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

        public remove(path: string) {
            var rmDir = function (dirPath) {
                try { var files = this._fs.readdirSync(dirPath); }
                catch (e) { return; }
                if (files.length > 0)
                    for (var i = 0; i < files.length; i++) {
                        var filePath = dirPath + '/' + files[i];
                        if (this._fs.statSync(filePath).isFile())
                            this._fs.unlinkSync(filePath);
                        else
                            rmDir(filePath);
                    }
                this._fs.rmdirSync(dirPath);
            };
        }

        public copy(sourceDir: string, newDirLocation: string, opts?) {
            if (!opts || !opts.preserve) {
                try {
                    if (this._fs.statSync(newDirLocation).isDirectory()) exports.rmdirSyncRecursive(newDirLocation);
                } catch (e) { }
            }

            /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
            var checkDir = this._fs.statSync(sourceDir);
            try {
                this._fs.mkdirSync(newDirLocation, checkDir.mode);
            } catch (e) {
            //if the directory already exists, that's okay
                if (e.code !== 'EEXIST') throw e;
            }

            var files = this._fs.readdirSync(sourceDir);

            for (var i = 0; i < files.length; i++) {
                // ignores all files or directories which match the RegExp in opts.filter
                if (typeof opts !== 'undefined') {
                    if (!opts.whitelist && opts.filter && files[i].match(opts.filter)) continue;
                    // if opts.whitelist is true every file or directory which doesn't match opts.filter will be ignored
                    if (opts.whitelist && opts.filter && !files[i].match(opts.filter)) continue;
                    if (opts.excludeHiddenUnix && /^\./.test(files[i])) continue;
                }

                var currFile = this._fs.lstatSync(this._path.join(sourceDir, files[i]));

                var fCopyFile = (srcFile, destFile) => {
                    if (typeof opts !== 'undefined' && opts.preserveFiles && this._fs.existsSync(destFile)) return;

                    var contents = this._fs.readFileSync(srcFile);
                    this._fs.writeFileSync(destFile, contents);
                };

                if (currFile.isDirectory()) {
                    /*  recursion this thing right on back. */
                    this.copy(this._path.join(sourceDir, files[i]), this._path.join(newDirLocation, files[i]), opts);
                } else if (currFile.isSymbolicLink()) {
                    var symlinkFull = this._fs.readlinkSync(this._path.join(sourceDir, files[i]));

                    if (typeof opts !== 'undefined' && !opts.inflateSymlinks) {
                        this._fs.symlinkSync(symlinkFull, this._path.join(newDirLocation, files[i]));
                        continue;
                    }

                    var tmpCurrFile = this._fs.lstatSync(this._path.join(sourceDir, symlinkFull));
                    if (tmpCurrFile.isDirectory()) {
                        this.copy(this._path.join(sourceDir, symlinkFull), this._path.join(newDirLocation, files[i]), opts);
                    } else {
                        /*  At this point, we've hit a file actually worth copying... so copy it on over. */
                        fCopyFile(this._path.join(sourceDir, symlinkFull), this._path.join(newDirLocation, files[i]));
                    }
                } else {
                    /*  At this point, we've hit a file actually worth copying... so copy it on over. */
                    fCopyFile(this._path.join(sourceDir, files[i]), this._path.join(newDirLocation, files[i]));
                }
            }
        }
    }
}