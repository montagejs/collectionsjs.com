
var Q = require("q");
var fs = require("q-io/fs");
var Reader = require("q-io/reader");
var Dict = require("collections/dict");
var path = require("path");
var Handlebars = require("handlebars");
var Uglify = require("uglify-js");
var mrs = require("mr/build");
var data = require("./scrape");

if (require.main === module) {
    var siteFs = fs.reroot("_site");
    return fs.removeTree(fs.join(__dirname, "..", "_site"))
    .catch(function () {})
    .then(function () {
        return fs.makeTree("_site");
    })
    .then(generate.bind(null, siteFs))
    .done();
}

module.exports = generate;
function generate(siteFs, options) {
    options = options || {};
    options.minify = true;

    return Q()
    .then(setup.bind(null, siteFs))
    .then(buildData.bind(null, siteFs))
    .then(loadTemplates)
    .then(buildPages.bind(null, siteFs))
    .then(buildJavascript.bind(null, siteFs, options))
    .then(function () {
        console.log("Generated.");
    });
}

function setup(siteFs) {
    return Q()
    .then(function () {
        return fs.copyTree(fs.join(__dirname, "..", "assets"), ".", siteFs);
    })
    .then(function () {
        return Q.all([
            siteFs.makeTree("property"),
            siteFs.makeTree("method"),
            siteFs.makeTree("script")
        ]);
    });
}

function loadTemplates() {
    return fs.list(fs.join(__dirname, "..", "templates", "includes"))
    .then(function (list) {
        // Compile all includes
        var includes = {};
        return Reader(list)
        .forEach(function (filename) {
            var name = path.basename(filename, ".html");
            return fs.read(path.join(__dirname, "..", "templates", "includes", filename))
            .then(function (include) {
                includes[name] = Handlebars.compile(include.toString("utf8"));
            });
        })
        .thenResolve(includes);
    })
    .then(function (includes) {
        // Register "include" helper, which takes an include name and a hash
        // of variables to use. If used as a block then then the {{{content}}}
        // variable inside of the include will be replaced with the content
        // you pass to the block:
        //
        // * {{include "include-name" variable="value"}}
        // * {{#include "include-name" variable="value"}}
        //      some content
        //   {{/include}}
        Handlebars.registerHelper("include", function (name, options) {
            if (includes[name]) {
                if (options.fn) {
                    options.hash.content = options.fn(options.data.root);
                }
                return new Handlebars.SafeString(includes[name](options.hash));
            } else {
                console.log(name, options);
                throw new Error("No include '" + name + "'");
            }
        });
    })
    .then(function () {
        return Reader(["index", "all", "collection", "property", "method"])
        .map(function (name) {
            return fs.read(fs.join(__dirname, "..", "templates", name + ".html"))
            .then(function (template) {
                return [name, Handlebars.compile(template.toString("utf-8"))];
            })
        })
        .all()
        .then(function (templates) {
            return new Dict(templates).toObject();
        })
    })
}

function buildData(siteFs) {
    return fs.write(
        fs.join(__dirname, "..", "lib", "data.js"),
        "module.exports=" + JSON.stringify({
            propertyIndex: data.propertyIndex,
            methodIndex: data.methodIndex,
            searchIndex: data.searchIndex
        }, null, 4),
        {charset: "utf-8"}
    );
}

function buildPages(siteFs, templates) {
    var collectionTemplate = templates.collection;
    var methodTemplate = templates.method;
    var propertyTemplate = templates.property;
    return Q().then(function () {
        return siteFs.write("index.html", templates.index({
            collections: data.collections.toObject()
        }));
    }).then(function () {
        return siteFs.write("all.html", templates.all({
            collections: data.collections.toObject(),
            properties: data.properties.toObject(),
            methods: data.methods.toObject()
        }));
    }).then(function () {
        return Reader(data.collections)
        .forEach(function (details, name) {
            return siteFs.write(name + ".html", collectionTemplate(details));
        });
    })
    .then(function () {
        return Reader(data.properties)
        .forEach(function (details, name) {
            return siteFs.write(path.join("property", name + ".html"), propertyTemplate(details));
        });
    }).then(function () {
        return Reader(data.methods)
        .forEach(function (details, name) {
            return siteFs.write(path.join("method", name + ".html"), methodTemplate(details));
        });
    });
}

function buildJavascript(siteFs, options) {
    return Reader(["index.js", "autocomplete.js", "collections.js"])
    .forEach(function (entry) {
        return mrs(path.join("lib", entry))
        .then(function (bundle) {
            if (options.minify) {
                bundle = Uglify.minify(bundle, {fromString: true}).code;
            }
            return siteFs.write(path.join("script", entry), bundle);
        });
    });
}

