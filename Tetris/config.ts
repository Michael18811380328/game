declare var requirejs, require;

requirejs.config({
    paths: {
        // "angular": "/node_modules/angular/angular"
    },
    urlArgs: function(id, url) {

        var rando = Math.floor(Math.random() * Math.floor(100000));
        
        var args = '';
        if (url.indexOf('index') !== -1) {
            args = '?v=' + rando;
        }
        return args;
    }
});

require(["index"]);