
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

