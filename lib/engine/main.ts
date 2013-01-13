// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// **** definitions
///<reference path='../../definition/node-0.8.d.ts'/>

// **** references
///<reference path='site/siteHub.ts'/>

class Main {
    private static ncp = require('ncp').ncp;
    private static fs = require('fs');

    public static createSite() { 
        console.log('creating new site...');

        var itens = this.fs.readdirSync("./");
        if (itens.length > 0) {
            console.log('Error! this folder is not empty.');
        } else {
            this.ncp(__dirname + '/../lib/base/', "./", function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('site created!');
            });
        }
    }

	public static build() {
		new Site.SiteHub().build();
	}

	public static run() { 
        var arg1 = process.argv[2];

        if (!arg1) {
            Main.build();
        } if (arg1 == 'new') {
            Main.createSite();
        }
    }
}
