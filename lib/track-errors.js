/*global ga*/

window.onerror = function (message, file, line) {
    if (ga) {
        ga("send", "event", "global", "error", message + " in " + file + " line " + line);
    }
};
