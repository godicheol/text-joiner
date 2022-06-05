(function() {
    'use strict';

    var exports = {};

    var alias = {
        "b": "Bytes",
        "byte": "Bytes",
        "bytes": "Bytes",
        "kb": "KB",
        "killobyte": "KB",
        "killobytes": "KB",
        'mb': "MB",
        'megabyte': "MB",
        'megabytes': "MB",
        'gb': "GB",
        'gigabyte': "GB",
        'gigabytes': "GB",
        'tb': "TB",
        'terrabyte': "TB",
        'terrabytes': "TB",
        'pb': "PB",
        'petabyte': "PB",
        'petabytes': "PB",
        'eb': "EB",
        'exabyte': "EB",
        'exabytes': "EB",
        'zb': "ZB",
        'zettabyte': "ZB",
        'zettabytes': "ZB",
        'yb': "YB",
        'yottabyte': "YB",
        'yottabytes': "YB"
    }

    exports.humanize = function(bytes, dot = 2) {
        if (bytes === 0) return '0 Bytes';

        var k = 1024;
        var dp = dot < 0 ? 0 : dot;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        var i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dp)) + ' ' + sizes[i];
    }

    exports.convert = function(bytes, format, dot = 2) {
        var f = format && alias[format.toLowerCase()] ? alias[format.toLowerCase()] : "Bytes";
        if (bytes === 0) return '0 ' + f;

        var k = 1024;
        var dp = dot < 0 ? 0 : dot;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = sizes.indexOf(f);
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dp)) + ' ' + sizes[i];
    }
    
    exports.difference = function(a, b, dot = 2) {
        var diff = Math.abs(a - b);
        return this.humanize(diff, dot);
    }    

    if (typeof(window.fileSizeConverter) === "undefined") {
        window.fileSizeConverter = exports;
    }
})();