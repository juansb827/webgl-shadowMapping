'use strict';

// Answer provided by 'jolly.exe' in StackOverflow post
//  http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Taken from http://stackoverflow.com/questions/641857/javascript-window-resize-event
//  Post by user Alex V
function AddEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

function RemoveEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.removeEventListener) {
        object.removeEventListener(type, callback, false);
    } else if (object.detachEvent) {
        object.detachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

function LoadTextResource (url, cb) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open('GET', url, true);

    xmlhttp.onload = function (e) {
        if (xmlhttp.status < 200 || xmlhttp.status >= 300) {
            console.error('ERROR loading text resource', url, xmlhttp.status, xmlhttp.statusText);
            cb(new Error(xmlhttp.statusText));
        } else {
            cb(null, xmlhttp.responseText);
        }
    };
    xmlhttp.setRequestHeader("access-control-allow-origin","*");
    xmlhttp.onerror = cb;

    
    xmlhttp.send();
};

function LoadJSONResource (url, cb) {
    LoadTextResource(url, function (err, res) {
        if (err) {
            cb(err);
        } else {
            try {
                var obj = JSON.parse(res);
                cb(null, obj);
            } catch (e) {
                cb(e);
            }
        }
    });
};

function LoadImage (url, cb) {
    var image = new Image();
    image.onload = function () {
        cb (null, image);
    };
    image.src = url;
};

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}