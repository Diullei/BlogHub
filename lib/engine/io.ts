// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

class IO {
    private static fs = require('fs');
    private static ncp = require('ncp').ncp;

    public static readFileSync(file: string): string {
        var fileContent = null;
        try {
            return fileContent = this.fs.readFileSync(file);
        }
        catch (err) {
            throw new ConfigFileNotFoundException();
        }
    }

    public static readJsonFile(file: string): any {
        var fileContent = IO.readFileSync(file);
        return JSON.parse(fileContent);
    }

    public static readDirSync(path: string): string[] {
        return this.fs.readdirSync(path);
    }

    public static copyFolder(folder: string, destination: string, callback: (err: any) => any) { 
        this.ncp(folder, destination, function (err) {
            callback(err);
        });
    }
}