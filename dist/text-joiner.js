(function() {
    'use strict';

    var lineBreakers = {
        "CR": "\r", // Mac(1~9) 0x0D
        "LF": "\n", // Unix/Linux, Mac(10~) 0x0A
        "CRLF": "\r\n", // windows 0x0D 0x0A
    }

    var config = {
        lineBreaker: "CRLF",
    }

    function getLineBreaker() {
        return lineBreakers[config.lineBreaker];
    }

    function setLineBreaker(str) {
        switch(str.toUpperCase()) {
            case "CR":
                config.lineBreaker = "CR";
                break;
            case "LF":
                config.lineBreaker = "LF";
                break;
            case "CRLF":
                config.lineBreaker = "CRLF";
                break;
        }
    }

    function joinString(arr) {
        if (!Array.isArray(arr)) {
            console.error("Parameter is not string.");
            return false;
        }

        var str = "";
        for (var i = 0; i < arr.length; i++) {
            var elem = arr[i];

            if (typeof(elem) != "string") {
                continue;
            }

            // is not start
            if (i != 0) {
                str += getLineBreaker();
            }

            // main
            str += elem;
        }

        return str;
    }

    var exports = {
        setLineBreaker: setLineBreaker,
        join: joinString,
    }

    if (typeof(window.textJoiner) === "undefined") {
        window.textJoiner = exports;
    }

    // polyfill
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
})();