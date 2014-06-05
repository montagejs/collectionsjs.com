
var Dict = require("collections/dict");
var fs = require("fs");
var path = require("path");
var data = require("./scrape");
var Handlebars = require("handlebars");

var template = Handlebars.compile(fs.readFileSync("templates/review-plate.html", "utf-8"));
fs.writeFileSync("assets/review-plate.html", template({
    interfaces: data.interfaces.values(),
    collections: data.collections.values(),
    methods: data.methods.values(),
    methodVersions: data.methods.map(function (method) {
        return method.versions.values();
    }).flatten()
}), "utf-8");


fs.writeFileSync("assets/script/data.js", "data=" + JSON.stringify({
    interfaces: data.interfaces.map(function (interface, ref) {
        return {id: "interface-" + ref, className: "card interface"};
    }),
    collections: data.collections.map(function (collection, ref) {
        return {id: "collection-" + ref, className: "card collection"};
    }),
    methods: data.methods.map(function (method, ref) {
        return {id: "method-" + ref, className: "card method"};
    }),
    states: new Dict([
        data.interfaces.map(function (interface, ref) {
            return ["interface-" + ref, {
                interfaces: null,
                collections: interface.collections.map(function (collectionRef) {
                    return {
                        id: "collection-" + collectionRef,
                        className: "card collection"
                    }
                }),
                details: [{
                    id: "detail-interface-" + ref,
                    className: "detail"
                }],
                methods: null
            }];
        }),
        data.collections.map(function (collection, ref) {
            return ["collection-" + ref, {
                interfaces: null,
                collections: null,
                details: [{
                    id: "detail-collection-" + ref,
                    className: "detail"
                }],
                methods: collection.methods.map(function (method, ref) {
                    return {
                        id: "method-" + method.ref,
                        className: "card method"
                    };
                })
            }];
        }),
        data.methods.map(function (method, ref) {
            return ["method-" + ref, {
                interfaces: null,
                collections: method.collections.map(function (collection) {
                    return {
                        id: "collection-" + collection.ref,
                        className: "card collection" +
                            (collection.note ? " " + collection.note : "")
                    };
                }),
                details: [{
                    id: "detail-method-" + ref,
                    className: "detail"
                }],
                methods: null
            }];
        })
    ].flatten()).toObject()
}, null, 4), "utf-8");

