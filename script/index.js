global = this;

(function (modules) {

    // Bundle allows the run-time to extract already-loaded modules from the
    // boot bundle.
    var bundle = {};

    // Unpack module tuples into module objects.
    for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        modules[i] = new Module(module[0], module[1], module[2], module[3]);
        bundle[module[0]] = bundle[module[1]] || {};
        bundle[module[0]][module[1]] = module;
    }

    function Module(name, id, map, factory) {
        // Package name and module identifier are purely informative.
        this.name = name;
        this.id = id;
        // Dependency map and factory are used to instantiate bundled modules.
        this.map = map;
        this.factory = factory;
    }

    Module.prototype.getExports = function () {
        var module = this;
        if (module.exports === void 0) {
            module.exports = {};
            var require = function (id) {
                var index = module.map[id];
                var dependency = modules[index];
                if (!dependency)
                    throw new Error("Bundle is missing a dependency: " + id);
                return dependency.getExports();
            }
            module.exports = module.factory(require, module.exports, module) || module.exports;
        }
        return module.exports;
    };

    // Communicate the bundle to all bundled modules
    Module.prototype.bundle = bundle;

    return modules[0].getExports();
})((function (global){return[["collections-website","lib/index",{"./choose":1},function (require, exports, module){

// collections-website lib/index
// -----------------------------


var Query = require("./choose").Query;
var questions = require("./choose").questions;

var existingClasses = {
    shape: "hide",
    keys: "hide",
    capacity: "hide",
    strategy: "hide",
    weak: "hide",
    unique: "hide",
    ordered: "hide",
    sorted: "hide",
    multi: "hide",
    "long": "hide",
    churn: "hide",
    access: "hide",
    mutate: "hide",
    list: "unavailable",
    object: "unavailable",
    map: "unavailable",
    "fast-map": "unavailable",
    "lru-map": "unavailable",
    "lfu-map": "unavailable",
    "sorted-map": "unavailable",
    "sorted-array-map": "unavailable",
    "dict": "unavailable",
    "multi-map": "unavailable",
    "weak-map": "unavailable",
    "deque": "unavailable",
    "array": "unavailable",
    "set": "unavailable",
    "fast-set": "unavailable",
    "lru-set": "unavailable",
    "lfu-set": "unavailable",
    "sorted-set": "unavailable",
    "sorted-array-set": "unavailable",
    "sorted-array": "unavailable",
    "heap": "unavailable",
    "iterator": "unavailable"
};
var form = document.getElementById("choose");

[
    form.shape[0],
    form.shape[1],
    form.shape[2],
    form.keys[0],
    form.keys[1],
    form.keys[2],
    form.keys[3],
    form.sorted,
    form.weak,
    form.unique,
    form.capacity,
    form.strategy[0],
    form.strategy[1],
    form.ordered,
    form.multi,
    form.index,
    form.shift,
    form.splice,
    form.long,
    form.churn[0],
    form.churn[1]
].forEach(function (element) {
    element.addEventListener("change", handleChange);
});

function handleChange() {
    var query = new Query();

    query.shape = getRadioGroupValue(form.shape);
    query.keys = getRadioGroupValue(form.keys);
    query.unique = form.unique.checked && query.shape !== "map";
    query.weak = form.weak.checked;
    query.capacity = (query.shape === "map" || query.unique) && form.capacity.checked;
    query.strategy = getRadioGroupValue(form.strategy);
    query.ordered = !query.weak && form.ordered.checked;
    query.sorted = query.ordered && form.sorted.checked;
    query.multi = form.multi.checked;
    query.index = form.index.checked;
    query.shift = form.shift.checked;
    query.splice = form.splice.checked;
    query.long = form.long.checked;
    query.churn = getRadioGroupValue(form.churn);

    for (var id in questions) {
        var element = document.getElementById(id);
        if (!element) continue; // XXX
        element.classList.remove(existingClasses[id]);
        var className = questions[id](query);
        existingClasses[id] = className;
        element.classList.add(className);
    }

}

function getRadioGroupValue(nodeList) {
    // Available on the RadioNodeList
    if (nodeList.value) {
        return nodeList.value;
    }

    for (var i = 0; i < nodeList.length; i++) {
        var radio = nodeList[i];
        if (radio.checked) {
            return radio.value;
        }
    }
}
}],["collections-website","lib/choose",{},function (require, exports, module){

// collections-website lib/choose
// ------------------------------


exports.Query = Query;
function Query() {
    this.shape = null; // "flat", "map", "iterator"
    this.keys = null; // "strings", "objects", "numbers", "any"
    this.sorted = false;
    this.unique = false; // not taken into consideration for maps
    this.capacity = false;
    this.strategy = "recency"; // one of "frequency" or "recency"
    this.ordered = true;
    this.multi = false;
    // range access
    this.first = false;
    this.index = false;
    this.last = false;
    // range mutation
    this.shift = false;
    this.splice = false;
    this.pop = false;
    this.long = false;
    this.churn = null; // "gc" or "scan"
}

exports.questions = {

    // Whether to ask
    "shape": function (_) {
        return "show";
    },
    "keys": function (_) {
        return (
            _.shape === "map" && !_.multi && !_.capacity
        ) ? "show" : "hide"
    },
    "capacity": function (_) {
        return (
            !_.sorted &&
            !_.multi &&
            (
                (_.shape === "map" && !_.weak) ||
                (_.shape === "flat" && _.unique)
            )
        ) ? "show" : "hide";
    },
    "strategy": function (_) {
        return (
            this.capacity(_) && _.capacity
        ) ? "show" : "hide";
    },
    "unique": function (_) {
        return (
            _.shape === "flat"
        ) ? "show" : "hide";
    },
    "weak": function (_) {
        return (
            _.shape === "map" && _.keys === "objects"
        ) ? "show" : "hide";
    },
    "ordered": function (_) {
        return !_.capacity && (
            (_.shape === "map" && _.keys !== "strings" && !_.multi && !_.weak) ||
            (_.shape === "flat" && !_.multi && _.unique)
        ) ? "show" : "hide";
    },
    "sorted": function (_) {
        return (
            _.ordered && !_.multi && !_.capacity && (
                (_.shape === "map") ||
                (_.shape === "flat")
            )
        ) ? "show" : "hide"
    },
    "multi": function (_) {
        return (
            _.shape === "map" &&
            !_.capacity &&
            !_.sorted &&
            !_.weak
        ) ? "show" : "hide";
    },
    "long": function (_) {
        return (
            (
                _.shape === "map" &&
                !_.capacity &&
                !_.multi &&
                _.sorted
            ) ||
            (
                _.shape === "flat" &&
                (
                    (
                        _.unique &&
                        _.sorted
                    ) ||
                    (
                        !_.unique &&
                        !_.sorted
                    )
                )
            )
        ) ? "show" : "hide";
    },
    "accessOrMutate": function (_) {
        return (
            _.shape !== "iterator" &&
            !_.unique &&
            !_.sorted &&
            _.long
        ) ? "show" : "hide";
    },
    "access": function (_) {
        return this.accessOrMutate(_);
    },
    "mutate": function (_) {
        return this.accessOrMutate(_);
    },
    "churn": function (_) {
        return (
            _.shape === "flat" &&
            !_.sorted &&
            !_.unique &&
            !_.capacity &&
            _.long &&
            _.shift &&
            !_.splice &&
            !_.index
        ) ? "show" : "hide";
    },

    // Whether available and recommended
    "list": function (_) {
        return (
            _.shape === "flat" &&
            !_.sorted &&
            !_.unique &&
            !_.capacity &&
            !(_.long && _.index)
        ) ? (
            (
                _.long && (
                    _.splice ||
                    (_.shift && _.churn === "garbage")
                )
            ) ? "recommended" : "available"
        ) : "unavailable";
    },
    "deque": function (_) {
        return (
            _.shape === "flat" &&
            !_.sorted &&
            !_.unique &&
            !_.capacity &&
            !(_.long && _.splice)
        ) ? (
            (
                _.long && _.shift && (
                    _.index ||
                    _.churn === "shift"
                )
            ) ? "recommended" : "available"
        ) : "unavailable";
    },
    "map": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            !(_.keys === "objects" && _.weak)
        ) ? (
            (
                _.ordered &&
                (_.keys === "any" || _.keys === "objects")
            ) ? "recommended" : "available"
        ) : "unavailable";
    },
    "set": function (_) {
        return (
            _.shape === "flat" &&
            _.unique &&
            !_.sorted &&
            !_.capacity
        ) ? (
            _.ordered ? "recommended" : "available"
        ) : "unavailable";
    },
    "heap": function (_) {
        return (
            _.shape === "flat" &&
            _.max // TODO
        ) ? "available" : "unavailable";
    },
    "dict": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            _.keys === "strings"
        ) ? "recommended" : "unavailable";
    },
    "sorted-array": function (_) {
        return (
            _.shape === "flat" &&
            _.sorted &&
            !_.unique
        ) ? "available" : "unavailable";
    },
    "sorted-set": function (_) {
        return (
            _.shape === "flat" &&
            _.unique &&
            _.sorted
        ) ? (
            _.long ? "recommended" : "available"
        ) : "unavailable";
    },
    "fast-set": function (_) {
        return (
            _.shape === "flat" &&
            _.unique &&
            !_.capacity &&
            !_.ordered &&
            !_.sorted
        ) ? "recommended" : "unavailable";
    },
    "lfu-set": function (_) {
        return (
            _.shape === "flat" &&
            _.unique &&
            _.capacity
        ) ? (
            _.strategy === "frequency" ? "recommended" : "available"
        ) : "unavailable";
    },
    "lru-set": function (_) {
        return (
            _.shape === "flat" &&
            _.unique &&
            _.capacity
        ) ? (
            _.strategy === "recency" ? "recommended" : "available"
        ) : "unavailable";
    },
    "sorted-array-set": function (_) {
        return (
            _.shape === "flat" &&
            _.unique &&
            _.sorted
        ) ? (
            !_.long ? "recommended" : "available"
        ) : "unavailable";
    },
    "fast-map": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            !_.ordered &&
            !(_.keys === "objects" && _.weak)
        ) ? (
            _.keys === "any" ? "recommended" : "available"
        ) : "unavailable";
    },
    "lfu-map": function (_) {
        return (
            _.shape === "map" &&
            _.capacity
        ) ? (
            _.strategy === "frequency" ? "recommended" : "available"
        ) : "unavailable";
    },
    "lru-map": function (_) {
        return (
            _.shape === "map" &&
            _.capacity
        ) ? (
            _.strategy === "recency" ? "recommended" : "available"
        ) : "unavailable";
    },
    "multi-map": function (_) {
        return (
            _.shape === "map" &&
            _.multi
        ) ? "recommended" : "unavailable";
    },
    "sorted-map": function (_) {
        return (
            _.shape === "map" &&
            !_.multi &&
            !_.capacity &&
            _.sorted
        ) ? (
            _.long ? "recommended" : "available"
        ) : "unavailable";
    },
    "sorted-array-map": function (_) {
        return (
            _.shape === "map" &&
            _.sorted &&
            !_.multi &&
            !_.capacity
        ) ? (
            !_.long ? "recommended" : "available"
        ) : "unavailable";
    },
    "weak-map": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            !_.ordered &&
            _.keys === "objects"
        ) ? "recommended" : "unavailable";
    },
    "iterator": function (_) {
        return (
            _.shape === "iterator"
        ) ? "recommended" : "unavailable";
    },
    "array": function (_) {
        return (
            !_.sorted &&
            !_.capacity &&
            !_.unique &&
            !_.multi && (
                (
                    _.shape === "map" &&
                    _.keys === "numbers"
                ) || (
                    _.shape === "flat" &&
                    !(_.long && _.shift)
                )
            )
        ) ? (
            (
                _.shape === "map" ||
                (
                    _.shape === "flat" &&
                    (
                        !(_.long && _.splice) ||
                        (_.long && _.index && _.splice)
                    )
                )
            ) ? "recommended" : "available"
        ) : "unavailable";
    },
    "object": function (_) {
        return (
            _.shape === "map" && false // TODO
        ) ? "available" : "unavailable";
    }

};

}]]})(this))