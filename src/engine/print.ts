// Copyright (c) Diullei Gomes. All rights reserved. Licensed under MIT License
// See LICENSE file in the project root for complete license information.

class Print {
    public static out(msg) { 
        if (msg.replace) {
            msg = msg.replace(/Error!/g, '\u001b[31mError!\u001b[0m');
            msg = msg.replace(/Info!/g, '\u001b[32mInfo!\u001b[0m');
        }
        console.log(msg);
    }
}
