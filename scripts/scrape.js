
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
        samples: (front.samples || []).map(parseSample)
    }];
}));

// Build method version tree

var methods = new Dict(methodRefs.map(function (ref) {
    var parts = readYaml(path.join("method", ref + ".md"));
    var front = parts[0] || {};
    var versions;
    if (front.version) {
        versions = new Dict([["" + front.version, {}]]);
    } else {
        versions = new Dict(front.versions || {"": {}});
    }
    return [ref, {
        ref: ref,
        type: "method",
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
                type: "method",
                version: version,
                name: versionSpecific.name || front.name,
                names: versionSpecific.names || front.names || [versionSpecific.name || front.name],
                deprecated: Boolean(front.deprecated),
                summary: render(front.summary || parts[1] || "")
            }];
        }))
    }];
}));

// Collection complete list of implemented methods and the prototype used for
// each method

var collectionsByMethod = new MultiMap();
collections = new Dict(collections.map(function (collection, ref) {
    var implemented = new Dict();
    collectMethods(implemented, collection);
    var implementations = methods.filter(function (method) {
        return implemented.has(method.ref);
    }).map(function (method) {
        collectionsByMethod.get(method.ref).add(ref);
        return implemented.get(method.ref);
    });
    var collectionMethods = implementations.map(function (implementation) {
        return methods.get(implementation.ref).versions.map(function (method, version) {
            return {
                ref: method.ref,
                type: "collection",
                name: method.name,
                prototype: implementation.prototype,
                version: version
            };
        });
    }).flatten();
    // The collection specific method search index
    var methodIndex = implementations.map(function (implementation) {
        return methods.get(implementation.ref).versions.map(function (method, version) {
            return method.names.map(function (name) {
                return {
                    search: name.toLowerCase().replace(/\W+/g, " ").trim(),
                    name: name,
                    summary: method.summary,
                    ref: method.ref,
                    type: "method",
                    version: method.version
                };
            });
        });
    }).flatten().flatten();
    return [ref, {
        ref: ref,
        type: "collection",
        name: collection.name,
        names: collection.names,
        summary: collection.summary,
        detail: collection.detail,
        samples: collection.samples,
        methods: collectionMethods,
        methodIndex: methodIndex
    }];
}));

function collectMethods(implemented, collection) {
    collection.inherits.forEach(function (parent) {
        if (collections.has(parent)) {
            collectMethods(implemented, collections.get(parent));
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
    collection.methods.forEach(function (ref) {
        implemented.set(ref, {
            ref: ref,
            prototype: collection.ref
        });
    });
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
                throw new Error("Bad see reference in " + ref + " to " + see);
            }
            return {
                ref: see,
                type: "method",
                name: method.name,
                summary: method.summary
            };
        }),
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

