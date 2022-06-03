(function() {
    'use strict';

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
                } else if (elem instanceof File && elem.type != "text/plain") {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        queue.push(e.target.result);
                        count++;
                        recursiveFn();
                    };
                    reader.onerror = function(e) {
                        console.error("Load error");
                        count++;
                        recursiveFn();
                    };
                    reader.readAsText(elem, "UTF-8");
                } else if (elem instanceof Blob) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        queue.push(e.target.result);
                        count++;
                        recursiveFn();
                    };
                    reader.onerror = function(e) {
                        console.error("Load error");
                        count++;
                        recursiveFn();
                    };
                    reader.readAsText(elem, "UTF-8");
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
                    // <input type="file">
                    var files = [];
                    // FileList to Array
                    for (var i = 0; i < elem.files.length; i++) {
                        if (elem.files[i].type == "text/plain" && elem.files[i] instanceof Blob) {
                            files.push(elem.files[i]);
                        }
                    }
                    
                    // sort multiple files
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

    exports.join = function(arr, lb, cb) {
        if (!Array.isArray(arr) && !arr instanceof FileList) {
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
    
                // line break
                // "CR": "\r", // Mac(1~9) 0x0D
                // "LF": "\n", // Unix/Linux, Mac(10~) 0x0A
                // "CRLF": "\r\n", // windows 0x0D 0x0A
                if (i != 0) {
                    str += lb || "\r\n"; // default "CRLF"
                }
                
                // main
                str += elem;
            }
    
            return cb(null, str);
        });
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