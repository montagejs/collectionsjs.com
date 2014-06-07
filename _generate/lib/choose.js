
// WIP

exports.Query = Query;
function Query() {
    this.shape = null; // "non-map", "map", "iterator"
    this.keys = null; // "strings", "objects", "numbers", null
    this.sorted = false;
    this.unique = false; // not taken into consideration for maps
    this.capacity = false;
    this.strategy = "recency"; // one of "frequency" or "recency"
    this.ordered = true;
    this.multi = false;
    // range access
    this.first = false;
    this.slice = false;
    this.last = false;
    // range mutation
    this.shift = false;
    this.swap = false;
    this.pop = false;
    this.long = false;
    this.evil = null; // "gc" or "scan"
}

exports.answers = {

    // Whether to ask
    "shape": function (_) {
        return true;
    },
    "unique": function (_) {
        return _.shape === "non-map";
    },
    "capacity": function (_) {
        return _.shape === "map" || (_.shape === "non-map" && !_.unique);
    },
    "strategy": function (_) {
        return _.capacity;
    },
    "keys": function (_) {
        return _.shape === "map" && !_.multi;
    },
    "sorted": function (_) {
        return !_.multi && (
            (_.shape === "map") ||
            (_.shape === "non-map")
        );
    },
    "ordered": function (_) {
        return (
            (_.shape === "map" && _.keys !== "strings" && !_.multi) ||
            (_.shape === "non-map" && !_.multi && _.unique)
        );
    },

    // Whether available and recommended
    "list": function (_) {
        return _.shape === "non-map";
    },
    "deque": function (_) {
        return _.shape === "non-map";
    },
    "map": function (_) {
        return (
            _shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi
        );
    },
    "set": function (_) {
        return _.shape === "non-map";
    },
    "heap": function (_) {
        return _.shape === "non-map";
    },
    "dict": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            _.keys === "strings"
        ) ? "available" : "unavailable";
    },
    "sorted-array": function (_) {
        return (
            _.shape === "non-map"
        );
    },
    "fast-set": function (_) {
        return _.shape === "non-map";
    },
    "lfu-set": function (_) {
        return _.shape === "non-map";
    },
    "lru-set": function (_) {
        return _.shape === "non-map";
    },
    "sorted-array-set": function (_) {
        return _.shape === "non-map";
    },
    "fast-map": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            !_.ordered
        ) ? "available" : "unavailable";
    },
    "lfu-map": function (_) {
        return (
            _.shape === "map" &&
            _.capacity &&
            _.strategy === "frequency"
        );
    },
    "lru-map": function (_) {
        return (
            _.shape === "map" &&
            _.capacity &&
            _.strategy === "recency"
        );
    },
    "multi-map": function (_) {
        return _.shape === "map";
    },
    "sorted-map": function (_) {
        return _.shape === "map";
    },
    "sorted-array-map": function (_) {
        return _.shape === "map";
    },
    "weak-map": function (_) {
        return (
            _.shape === "map" &&
            !_.sorted &&
            !_.capacity &&
            !_.multi &&
            !_.ordered &&
            !_.keys === "objects"
        ) ? "available" : "unavailable";
    },
    "iterator": function (_) {
        return _.shape === "iterator";
    },
    "array": function (_) {
        return (
            (
                _.shape === "map" &&
                !_.sorted &&
                !_.capacity &&
                !_.multi &&
                _.keys === "numbers"
            ) || (
                _.shape === "non-map"
            )
        );
    },
    "object": function (_) {
        return false;
    }

};

