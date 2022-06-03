(function() {
    'use strict';

    var exports = {};

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    exports.compare = function(a, b, sensitivity) {
        if (sensitivity) {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        var aArr = a.split(/(\d+)/);
        var bArr = b.split(/(\d+)/);
        var aLen = aArr.length;
        var bLen = bArr.length;
        var i, str1, str2;

        for (i = 0; i < Math.max(aLen, bLen); i++) {
            str1 = isNumber(aArr[i]) ? parseInt(aArr[i]) : aArr[i];
            str2 = isNumber(bArr[i]) ? parseInt(bArr[i]) : bArr[i];
            if (str1 != str2) {
                if (typeof(str1) == "undefined") {
                    return -1;
                }
                if (typeof(str2) == "undefined") {
                    return 1;
                }
                if (str1 > str2) {
                    return 1;
                }
                if (str1 < str2) {
                    return -1;
                }
            }
        }
        return 0;
    }

    if (typeof(window.textComparer) === "undefined") {
        window.textComparer = exports;
    }
})();