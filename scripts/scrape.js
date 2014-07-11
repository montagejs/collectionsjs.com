
var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");
var marked = require("marked");
var highlight = require("highlight.js");
var Dict = require("collections/dict");
var Set = require("collections/set");
var MultiMap = require("collections/multi-map");
var parseSample = require("./parse-sample.js");

var root = path.dirname(__dirname);

function readYaml(name) {
    var text = fs.readFileSync(path.join(root, name), "utf-8");
    var parts = [];
    try {
        yaml.safeLoadAll(text, function (part) {
            parts.push(part);
        });
    } catch (error) {
        error.message = "Can't parse " + name + " because " + error.message;
        throw error;
    }
    return parts;
}

var interfaceRefs = readYaml("interfaces.yaml")[0];
var collectionRefs = readYaml("collections.yaml")[0];
var methodRefs = readYaml("methods.yaml")[0];

var interfaces = new Dict(interfaceRefs.map(function (ref) {
    var parts = readYaml(path.join("interface", ref + ".md"));
    var front = parts[0] || {};
    return [ref, {
        ref: ref,
        name: front.name,
        collections: front.collections,
        summary: render(front.summary || parts[1] || ""),
        detail: render(front.detail || parts[2] || "")
    }];
}));

var collections = new Dict(collectionRefs.map(function (ref) {
    var parts = readYaml(path.join("collection", ref + ".md"));
    var front = parts[0] || {};
    return [ref, {
        ref: ref,
        name: front.name,
        names: front.names || [front.name],
        inherits: front.inherits || [],
        mixin: front.mixin || [],
        methods: front.methods || [],
        summary: render(front.summary || parts[1] || ""),
        detail: render(front.detail || parts[2] || ""),
        samples: (front.samples || []).map(parseSample),
        usage: render("```js\n" + (front.usage || "").trim() + "\n```"),
        source: front.source || ref,
        see: front.see || []
    }];
}));

// Build method version tree

var methods = new Dict(methodRefs.map(function (ref) {
    var parts = readYaml(path.join("method", ref + ".md"));
    return [ref, parseYaml(ref, "method", parts)];
}));

function parseYaml(ref, type, parts) {
    var front = parts[0] || {};

    var versions;
    if (front.version) {
        versions = new Dict([["" + front.version, {}]]);
    } else {
        versions = new Dict(front.versions || {"": {}});
    }

    return {
        ref: ref,
        type: type,
        name: front.name,
        names: front.names,
        deprecated: Boolean(front.deprecated),
        summary: render(front.summary || parts[1] || ""),
        detail: render(front.detail || parts[2] || ""),
        samples: (front.samples || []).map(parseSample),
        see: front.see || [],
        "very-fast": front["very-fast"],
        "fast": front["fast"],
        "slow": front["slow"],
        versions: new Dict(versions.map(function (versionSpecific, version) {
            return [version, {
                ref: ref,
                type: type,
                version: version,
                name: versionSpecific.name || front.name,
                names: versionSpecific.names || front.names || [versionSpecific.name || front.name],
                deprecated: Boolean(front.deprecated),
                summary: render(front.summary || parts[1] || "")
            }];
        }))
    };
}

// Collection complete list of implemented methods and the prototype used for
// each method
// Also generate "see" cross reference
// TODO Also generate "deepSee" cross reference

// Map from method object to an array of all collections it is available on
var collectionsByMethod = new MultiMap();

collections = new Dict(collections.map(function (collection, ref) {
    var implementedMethods = collect("methods", collection);

    var collectionMethods = methods.filter(function (method) {
        // Filter all methods based on what this collection implements
        return implementedMethods.has(method.ref);
    }).map(function (method) {
        // Update the inverted index of method -> [collection, ...] as each
        // method is processed
        collectionsByMethod.get(method.ref).add(ref);

        var implementation = implementedMethods.get(method.ref);
        return method.versions.map(function (method, version) {
            return {
                ref: method.ref,
                type: "collection",
                name: method.name,
                prototype: implementation.prototype,
                summary: method.summary,
                version: version
            };
        });
    }).flatten();

    return [ref, {
        ref: ref,
        type: "collection",
        name: collection.name,
        names: collection.names,
        summary: collection.summary,
        detail: collection.detail,
        samples: collection.samples,
        usage: collection.usage,
        source: collection.source,
        see: collection.see.map(function (see) {
            var collection = collections.get(see);
            if (!collection) {
                console.log("Bad reference in " + ref + " to " + see);
                return;
            }
            return {
                ref: see,
                type: "collection",
                name: collection.name,
                summary: collection.summary
            };
        }).filter(Boolean),
        methods: collectionMethods
    }];
}));


// Collects all the methods the collection has from: the explicitly listed, all
// of the inherited methods, and any individual mixins.
function collect(type, collection, implemented) {
    implemented = implemented || new Dict();

    collection.inherits.forEach(function (parent) {
        if (collections.has(parent)) {
            collect(type, collections.get(parent), implemented);
        }
    });
    collection.mixin.forEach(function (line) {
        var parts = line.split("/");
        var parent = parts[0];
        var ref = parts[1];
        implemented.set(ref, {
            ref: ref,
            prototype: parent
        });
    });
    // "methods" or "properties"
    collection[type].forEach(function (ref) {
        implemented.set(ref, {
            ref: ref,
            prototype: collection.ref
        });
    });

    return implemented;
}

// Construct full collection list for each method
// Also construct complete "see" cross reference
// TODO Also construct transitive "deepSee" list

methods = new Dict(methods.map(function (method, ref) {
    var myCollections = new Dict();
    collectCollections(myCollections, method["very-fast"], "very-fast");
    collectCollections(myCollections, method["fast"], "fast");
    collectCollections(myCollections, method["slow"], "slow");
    collectCollections(myCollections, collectionsByMethod.get(ref));
    collectCollections(myCollections, collectionRefs, "not-implemented");
    return [ref, {
        ref: method.ref,
        type: "method",
        name: method.name,
        names: method.names,
        deprecated: method.deprecated,
        summary: method.summary,
        detail: method.detail,
        samples: method.samples,
        see: method.see.map(function (see) {
            var method = methods.get(see);
            if (!method) {
                console.warn("Bad see reference in " + ref + " to " + see);
                return;
            }
            return {
                ref: see,
                type: "method",
                name: method.name,
                summary: method.summary
            };
        }).filter(Boolean),
        collections: myCollections.values(),
        versions: method.versions
    }];
}));

function collectCollections(myCollections, refs, note) {
    (refs || []).forEach(function (ref) {
        if (!myCollections.has(ref)) {
            var collection = collections.get(ref);
            myCollections.set(ref, {
                ref: ref,
                name: collection.name,
                note: note,
                implemented: note !== "not-implemented"
            });
        }
    });
}

// Create seach indexes

var methodIndex = methods.map(function (method, ref) {
    return {
        ref: ref,
        type: "method",
        name: method.name,
        searches: new Set(method.versions.map(function (version) {
            return version.names.map(function (name) {
                return name.toLowerCase().replace(/\W+/g, " ");
            })
        })).flatten(),
        summary: method.summary
    };
});

var searchIndex = [
    collections.map(function (collection) {
        return {
            ref: collection.ref,
            type: "collection",
            name: collection.name,
            search: collection.name.toLowerCase().replace(/\W+/g, " "),
            summary: collection.summary
        };
    }),
    // TODO interface pages
    //interfaces.map(function (interface) {
    //    return {
    //        ref: interface.ref,
    //        type: "interface",
    //        name: interface.name,
    //        search: " " + interface.name.toLowerCase().replace(/\W+/g, " " ) + " ",
    //        summary: interface.summary
    //    };
    //})
].flatten();

function render(markdown) {
    return marked(markdown, {
        highlight: function (code) {
            return highlight.highlightAuto(code).value;
        }
    });
}

module.exports = {
    interfaceRefs: interfaceRefs,
    collectionRefs: collectionRefs,
    methodRefs: methodRefs,
    interfaces: interfaces,
    collections: collections,
    methods: methods,
    methodIndex: methodIndex,
    searchIndex: searchIndex
};

