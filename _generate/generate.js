
var Q = require("q");
var fs = require("q-io/fs");
var path = require("path");
var Handlebars = require("handlebars");

var data = require("./scrape");

setup()
.then(loadTemplates)
.then(generate)
.then(serve)
.done();

function setup() {
    return fs.removeTree("_site")
    .catch(function () {})
    .then(function () {
        return fs.copyTree("assets", "_site");
    })
    .then(function () {
        return Q.all([
            fs.makeDirectory("_site/collection"),
            fs.makeDirectory("_site/method")
        ]);
    });
}

function loadTemplates() {
    return Q.all([
        fs.read("./templates/index.html"),
        fs.read("./templates/collection.html"),
        fs.read("./templates/method.html")
    ])
    .spread(function (index, collection, method) {
        return {
            index: Handlebars.compile(index.toString("utf8")),
            collection: Handlebars.compile(collection.toString("utf8")),
            method: Handlebars.compile(method.toString("utf8"))
        };
    });
}

function generate(templates) {
    var collectionTemplate = templates.collection;
    data.collections.map(function (details, name) {
        fs.write(path.join("_site", "collection", name + ".html"), collectionTemplate(details)).done();
    });

    var methodTemplate = templates.method;
    data.methods.map(function (details, name) {
        fs.write(path.join("_site", "method", name + ".html"), methodTemplate(details)).done();
    });

    console.log("Generated.");
}


function serve() {
    var httpApps = require("q-io/http-apps");
    require("q-io/http").Server(httpApps.HandleHtmlFragmentResponses(httpApps.ListDirectories(httpApps.FileTree("_site")))).listen(8000);
    console.log("Serving on http://127.0.0.1:8000");
}
