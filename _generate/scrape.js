
var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");
var marked = require("marked");
var highlight = require("highlight.js");
var Dict = require("collections/dict");

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
        summary: render(parts[1]),
        detail: render(parts[2])
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
        summary: render(parts[1] || ""),
        detail: render(parts[2] || ""),
        samples: render(parts[3] || "")
    }];
}));

// Construct full collection list for each method

var methods = new Dict(methodRefs.map(function (ref) {
    var parts = readYaml(path.join("method", ref + ".md"));
    var front = parts[0] || {};
    var versions;
    if (front.version) {
        versions = new Dict([["" + front.version, {}]]);
    } else {
        versions = new Dict(front.versions || {"all": {}});
    }
    var myCollections = new Dict();
    collectCollections(myCollections, front["very-fast"], "very-fast");
    collectCollections(myCollections, front["fast"], "fast");
    collectCollections(myCollections, front["slow"], "slow");
    collectCollections(myCollections, collectionRefs);
    return [ref, {
        ref: ref,
        name: front.name,
        names: front.names,
        deprecated: Boolean(front.deprecated),
        summary: render(parts[1] || ""),
        detail: render(parts[2] || ""),
        samples: render(parts[3] || ""),
        collections: myCollections.values(),
        versions: new Dict(versions.map(function (versionSpecific, version) {
            return [version, {
                ref: ref,
                version: version,
                name: versionSpecific.name || front.name,
                names: versionSpecific.names || front.names || [versionSpecific.name || front.name],
                deprecated: Boolean(front.deprecated),
                summary: render(parts[1] || "")
            }];
        }))
    }];
}));

function collectCollections(myCollections, refs, speed) {
    (refs || []).forEach(function (ref) {
        if (!myCollections.has(ref)) {
            var collection = collections.get(ref);
            myCollections.set(ref, {
                ref: ref,
                name: collection.name,
                speed: speed
            });
        }
    });
}

// Collection complete list of implemented methods and the prototype used for
// each method

collections = new Dict(collections.map(function (collection, ref) {
    var implemented = new Dict();
    collectMethods(implemented, collection);
    var implementations = methods.filter(function (method) {
        return implemented.has(method.ref);
    }).map(function (method) {
        return implemented.get(method.ref);
    });
    var collectionMethods = implementations.map(function (implementation) {
        return methods.get(implementation.ref).versions.map(function (method, version) {
            return {
                ref: method.ref,
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
                    normal: name.toLowerCase().replace(/\W+/g, " ").trim(),
                    name: name,
                    summary: method.summary,
                    ref: method.ref,
                    version: method.version
                };
            });
        });
    }).flatten().flatten();
    return [ref, {
        ref: ref,
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

// Construct a global method search index
//var methodVersions = methods.map(function (method, ref) {
//    return method.versions.map(function (method, version) {
//        return {
//            ref: ref + "/" + version,
//            version: version,
//            name: method.name,
//            names: method.names,
//            summary: method.summary,
//            detail: method.detail,
//            samples: method.samples
//        };
//    });
//}).flatten();

//function defaultLink(rel, ref, viaRel, viaRef) {
//    if (rel === viaRel) {
//        return ref + ".html";
//    } else {
//        return "../" + rel + "/" + ref + ".html";
//    }
//}

function render(markdown) {
    return marked(markdown, {
        highlight: function (code) {
            return highlight.highlightAuto(code).value;
        }
    });
}

module.exports = {
    interfaces: interfaces,
    collections: collections,
    methods: methods
};

