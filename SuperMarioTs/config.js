//prevent caching
requirejs.config({
    // paths: {
    // "jquery": "https://code.jquery.com/jquery-3.3.1.min",
    // },
    urlArgs: function (id, url) {
        var random = Math.floor(Math.random() * 100000);
        var args = '';
        args = '?v=' + random;
        return args;
    }
});
require(["index"]);
//# sourceMappingURL=config.js.map