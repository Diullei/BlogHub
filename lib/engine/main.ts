class Main {
    public static createSite() { 
        console.log('creating new site...');

        var itens = fs.readdirSync("./");
        if (itens.length > 0) {
            console.log('Error! this folder is not empty.');
        } else {
            ncp(__dirname + '/../lib/base/', "./", function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('site created!');
            });
        }
    }

	public static build() {
		new SiteHub().build();
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
