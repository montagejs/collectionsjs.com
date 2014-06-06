
var Q = require("q");
var fs = require("q-io/fs");
var Reader = require("q-io/reader");
var path = require("path");
var Handlebars = require("handlebars");

var data = require("./scrape");

if (require.main === module) {
    var siteFs = fs.reroot("_site");
    return fs.removeTree("_site")
    .catch(function () {})
    .then(function () {
        return fs.makeTree("_site");
    })
    .then(build.bind(null, siteFs))
    .then(serve.bind(null, siteFs))
    .done();
}

exports.build = build;
function build(siteFs) {
    return Q()
    .then(setup.bind(null, siteFs))
    .then(loadTemplates)
    .then(generate.bind(null, siteFs))
    .then(buildJavascript.bind(null, siteFs))
}

function setup(siteFs) {
    return Q()
    .then(function () {
        return fs.copyTree("assets", ".", siteFs);
    })
    .then(function () {
        return Q.all([
            siteFs.makeTree("method")
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

function generate(siteFs, templates) {
    var collectionTemplate = templates.collection;
    var methodTemplate = templates.method;

    return Q().then(function () {
        return Reader(data.collections)
        .forEach(function (details, name) {
            return siteFs.write(name + ".html", collectionTemplate(details));
        });
    })
    .then(function () {
        return Reader(data.methods)
        .forEach(function (details, name) {
            return siteFs.write(path.join("method", name + ".html"), methodTemplate(details));
        });
    })
    .then(function () {
        console.log("Generated.");
    });
}

function buildJavascript(siteFs) {
    var build = require("mr/build");
    return build("assets/script/index.js")
    .then(function (bundle) {
        return siteFs.write(path.join("script", "recollections.js"), bundle);
    });
}

exports.serve = serve;
function serve(siteFs) {
    var httpApps = require("q-io/http-apps");

    var app = new httpApps.Chain()
    .use(httpApps.Error)
    .use(httpApps.Log)
    .use(httpApps.HandleHtmlFragmentResponses)
    .use(httpApps.ListDirectories)
    .use(function HtmlRedirect(next) {
        return function (request) {
            return next(request)
            .then(function (response) {
                // if no .html extension then retry with .html extension. Leads
                // to cleaner urls (and emulates github)
                if (response.status === 404 && request.url.search(/\.html$/) === -1) {
                    request.url += ".html";
                    request.path += ".html";
                    request.pathInfo += ".html";
                    return next(request);
                } else {
                    return response;
                }
            });
        };
    })
    .use(function (next) {
        return httpApps.FileTree("/", {
            fs: siteFs
        });
    })
    .end();

    require("q-io/http").Server(app).listen(8000);
    console.log("Serving on http://127.0.0.1:8000");
}

