﻿// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

// based on http://typescript.codeplex.com/SourceControl/changeset/view/d0d2019499be#src/compiler/optionsParser.ts

interface IOptions {
    name?: string;
    flag?: bool;
    short?: string;
    usage?: string;
    set?: (s: string) => void;
    type?: string;
    experimental?: bool;
}

class OptionsParserException implements Error {
    public name: string;
    public message: string;

    constructor(opts: string);
    constructor(opts: string[]);
    constructor() { 
        this.message = '';
        var opts = arguments[0];
        if (Array.isArray(opts)) {
            for (var i = 0; i < opts.length; i++) {
                this.message += "\nUnknown option '" + opts[i] + "'\nUse the '--help' flag to see options\n";
            }
        } else { 
            this.message = "\nUnknown option '" + opts + "'\nUse the '--help' flag to see options\n";
        }
    }
}

class OptionsParser {
    private DEFAULT_SHORT_FLAG = "-";
    private DEFAULT_LONG_FLAG = "--";

    public length: number = 0;

    // Find the option record for the given string. Returns null if not found.
    private findOption(arg: string) {

        for (var i = 0; i < this.options.length; i++) {

            if (arg === this.options[i].short || arg === this.options[i].name) {
                return this.options[i];
            }
        }

        return null;
    }

    public unnamed: string[] = [];

    public options: IOptions[] = [];

    constructor () {
    }

    public printUsage() {
        console.log("Syntax:   bloghub [options]");
        console.log("");
        console.log("Examples: bloghub --new blog");
        console.log("          bloghub --build");
        console.log("");
        console.log("Options:");

        var output = [];
        var maxLength = 0;

        this.options = this.options.sort(function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();

            if (aName > bName) {
                return 1;
            } else if (aName < bName) {
                return -1;
            } else {
                return 0;
            }
        });

        // Build up output array
        for (var i = 0; i < this.options.length; i++) {
            var option = this.options[i];

            if (option.experimental) {
                continue;
            }

            if (!option.usage) {
                break;
            }

            var usageString = "  ";
            var type = option.type ? " " + option.type.toUpperCase() : "";

            if (option.short) {
                usageString += this.DEFAULT_SHORT_FLAG + option.short + type + ", ";
            }

            usageString += this.DEFAULT_LONG_FLAG + option.name + type;

            output.push([usageString, option.usage]);

            if (usageString.length > maxLength) {
                maxLength = usageString.length;
            }
        }

        // Print padded output
        for (var i = 0; i < output.length; i++) {
            console.log(output[i][0] + (new Array(maxLength - output[i][0].length + 3)).join(" ") + output[i][1]);
        }
    }

    public option(name: string, config: IOptions, short?: string) {
        if (!config) {
            config = <any>short;
            short = null;
        }

        config.name = name;
        config.short = short;
        config.flag = false;

        this.options.push(config);
    }

    public flag(name: string, config: IOptions, short?: string) {
        if (!config) {
            config = <any>short;
            short = null;
        }

        config.name = name;
        config.short = short;
        config.flag = true

        this.options.push(config);
    }

    // Parse arguments as they come from the platform: split into arguments.
    public parse(args: string[]) {
        var position = 0;

        function consume() {
            return args[position++];
        }

        while (position < args.length) {
            var current = consume();
            var match = current.match(/^(--?)(.*)/);
            var value = null;

            if (match) {
                var arg = match[2];
                var option = this.findOption(arg);

                if (option === null) {
                    throw new OptionsParserException(arg);
                } else {
                    if (!option.flag)
                        value = consume();

                    option.set(value);
                    this.length++;
                }
            } else {
                this.unnamed.push(current);
            }
        }
    }
}