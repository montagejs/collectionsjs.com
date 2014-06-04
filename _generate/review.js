
var marked = require("marked");
var data = require("./scrape");

var context = {};

function highlight(code) {
    return "<em>" + code + "</em>";
}

marked.setOptions({ highlight: highlight });

console.log(data);

