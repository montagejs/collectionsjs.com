
var yaml = require("js-yaml");
var fs = require("fs");
var path = require("path");
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
        detail: parts[1]
    }];
}));

var collections = new Dict(collectionRefs.map(function (ref) {
    var parts = readYaml(path.join("collection", ref + ".md"));
    var front = parts[0] || {};
    return [ref, {
        ref: ref,
        name: front.name,
        names: front.names,
        inherits: front.inherits || [],
        mixin: front.mixin || [],
        methods: front.methods || [],
        summary: parts[1] || "",
        detail: parts[2] || "",
        samples: parts[3] || ""
    }];
}));

var methods = new Dict(methodRefs.map(function (ref) {
    var parts = readYaml(path.join("method", ref + ".md"));
    var front = parts[0] || {};
    return [ref, {
        ref: ref,
        name: front.name,
        names: front.names,
        veryFast: front["very-fast"],
        fast: front.fast,
        slow: front.slow,
        summary: parts[1] || "",
        detail:  parts[2] || "",
        samples: parts[3] || ""
    }];
}));

// Construct full method list for each collection

collections = new Dict(collections.map(function (collection, ref) {
    var implemented = new Dict();
    collect(implemented, collection);
    return [ref, {
        ref: ref,
        name: collection.name,
        names: collection.names,
        implemented: methods.filter(function (method) {
            return implemented.has(method.ref);
        }).map(function (method) {
            return implemented.get(method.ref);
        }),
        summary: collection.summary,
        detail: collection.detail,
        samples: collection.samples
    }];
}));

function collect(methods, collection) {
    collection.inherits.forEach(function (parent) {
        if (collections.has(parent)) {
            collect(methods, collections.get(parent));
        }
    });
    collection.mixin.forEach(function (line) {
        var parts = line.split("/");
        var parent = parts[0];
        var ref = parts[1];
        methods.set(ref, {
            ref: ref,
            prototype: parent
        });
    });
    collection.methods.forEach(function (ref) {
        methods.set(ref, {
            ref: ref,
            prototype: collection.ref
        });
    });
}

// Construct full collection list for each method

// Annotate very fast, fast, slow, very slow collections for each method.

// Construct contextual search indexes for each detail

