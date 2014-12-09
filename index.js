/**
 ** This is here to provide all my language bindings without interfering with browserify
 **/

var traceur = require('traceur'),
    pegjs = require("pegjs"),
    fs = require("fs");

require.extensions['.pegjs'] =
    function (module, filename) {
        module.exports = pegjs.buildParser(fs.readFileSync(filename, 'utf8'), { cache: true });
    }

traceur.require.makeDefault(function(filename) {
    // don't transpile our dependencies, just our app
    return filename.indexOf('node_modules') === -1;
}, {annotations: true});

module.exports = require("./lib");

console.log(module.exports);
