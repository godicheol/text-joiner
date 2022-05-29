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

    function getString(arr, cb) {
        var index = arr.length;
        var count = 0;
        var queue = [];
        var recursiveFn = function() {
            if (index > count) {
                // execute
                var elem = arr[count];
                if (typeof(elem) == "string") {
                    // String
                    queue.push(elem);
                    count++;
                    recursiveFn();
                } else if (elem instanceof Node && elem.tagName.toUpperCase() == "TEXTAREA") {
                    // <textarea>
                    queue.push(elem.value);
                    count++;
                    recursiveFn();
                } else if (elem instanceof Node && elem.tagName.toUpperCase() == "INPUT" && elem.getAttribute("type") == "text") {
                    // <input type="text">
                    queue.push(elem.value);
                    count++;
                    recursiveFn();
                } else if (elem instanceof Node && elem.tagName.toUpperCase() == "INPUT" && elem.getAttribute("type") == "file") {
                    var files = [];
                    for (var i = 0; i < elem.files.length; i++) {
                        // sort multiple files
                        if (
                            elem.files[i].type != "text/plain" ||
                            !elem.files[i] instanceof Blob ||
                            typeof(elem.files[i].name) == "undefined"
                        ) {
                            continue;
                        }
                        files.push(elem.files[i]);
                    }
                    
                    files.sort(function(a, b) {
                        if (!String.localeCompare) {
                            return a.name - b.name;
                        } else {
                            return a.name.localeCompare(b.name, undefined, {
                                sensitivity: "base",
                                numeric: true,
                            });
                        }
                    });

                    var index2 = files.length;
                    var count2 = 0;
                    var recursiveFn2 = function() {
                        if (index2 > count2) {
                            var file = elem.files[count2];
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                queue.push(e.target.result);
                                count2++;
                                recursiveFn2();
                            };
                            reader.onerror = function(e) {
                                console.error("Load error");
                                count2++;
                                recursiveFn2();
                            };
                            reader.readAsText(file, "UTF-8");
                        } else {
                            count++;
                            recursiveFn();
                        }
                    }
                    recursiveFn2();
                } else {
                    console.error("Element not valid");
                    count++;
                    recursiveFn();
                }
            } else {
                // end
                return cb(null, queue);
            }
        }
        recursiveFn();
    }

    var exports = {};

    exports.setLineBreaker = function(str) {
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

    exports.join = function(arr, cb) {
        if (!Array.isArray(arr)) {
            console.error("Parameter is not Array.");
            return false;
        }
    
        getString(arr, function(err, res) {
            if (err) {
                return cb(err);
            }

            var str = "";
            for (var i = 0; i < res.length; i++) {
                var elem = res[i];
    
                // is not start
                if (i != 0) {
                    str += getLineBreaker();
                }
                
                // main
                str += elem;
            }
    
            return cb(null, str);
        });
    }

    if (typeof(window.tj) === "undefined") {
        window.tj = exports;
    }

    // polyfill
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
})();