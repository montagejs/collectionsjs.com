
var Dict = require("collections/dict");
var data = require("./scrape");

console.log(JSON.stringify({
    interfaces: data.interfaces.toObject(),
    collections: data.collections.toObject(),
    methods: new Dict(data.methods.map(function (method, ref) {
        return [ref, {
            ref: ref,
            name: method.name,
            names: method.names,
            deprecated: method.deprecated,
            summary: method.summary,
            detail: method.detail,
            samples: method.samples,
            collections: method.collections,
            versions: method.versions.toObject()
        }];
    })).toObject()
}, null, 4));

