// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../../definition/node-0.8.d.ts'/>

module Site {

    export class SiteFile {
        private fs = require('fs');
        private BREAK_LINE = '\n';
        private config: Config;

        public header: Object = {};
        public content: string;

        constructor(file: string) {
            this.config = new Config();

            var lines = null;
            var fileContent = null;
            try {
                fileContent = this.fs.readFileSync('./' + this.config.folders.content + '/' + file, this.config.fileEncode);
            }
            catch (err) {
                console.error("There was an error opening the file:");
                console.log(err);
            }

            lines = fileContent.split(this.BREAK_LINE);

            var openHeader = false;

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line != '' && line != '---' && !openHeader) {
                    console.log(line)
                    throw new Error('invalid site header file');
                } else if (line == '---') {
                    if (!openHeader) {
                        openHeader = true;
                    } else {
                        break;
                    }
                } else {
                    var key = line.split(':')[0];
                    this.header[key.trim()] = line.substr(key.length + 1).trim();
                }
            }

            i++;
            this.content = '';
            for (; i < lines.length; i++) {
                this.content += lines[i] + this.BREAK_LINE;
            }
        }
    }
}