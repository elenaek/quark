const {spawn} = require('child_process');
const path = require('path');
const url = require('url');

let server;

var quark = function (opts) {
    if (server == null) {
        let nodePath;
        switch(opts.os){
            case "darwin":
                nodePath = "node"
                break;
            case "win32":
                nodePath = "node.exe"
                break;
            default:
                nodePath = "node.exe"
        }

        console.log(`Base path: ${path.join(__dirname, nodePath).replace('app.asar', 'app.asar.unpacked')}`);
        console.log(`Creating server for ${opts.os}`);

        server = spawn(path.join(__dirname, nodePath).replace('app.asar','app.asar.unpacked'), [path.join(__dirname, 'server')], {
            env: {
                QUARK_PORT: opts.port || 21048,
                QUARK_DIR: opts.dir || __dirname,
                QUARK_DESC: opts.description || 'default',
                QUARK_LOG: opts.log || false,
                PATH: process.env.PATH
            }
        });

        server.opts = opts;

        server.stdout.on('data', (data) => {
            console.log(data.toString());
        })

        server.stderr.on('data', (data) => {
            console.log(data.toString());
        })
    }
};

quark.url = function (path) {
    return url.format({
        hostname: 'localhost',
        port: server.opts.port,
        pathname: path,
        protocol: 'http'
    });
}

quark.html = function (path) {
    return quark.url(`${path}.html`);
}

quark.js = function (path) {
    return quark.url(`${path}.js`)
}

module.exports = quark;
