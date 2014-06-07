
var Query = require("./choose").Query;
var questions = require("./choose").questions;

var search = require("./search"); // TODO

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

    query.shape = form.shape.value;
    query.keys = form.keys.value;
    query.unique = form.unique.checked;
    query.weak = form.weak.checked;
    query.capacity = (query.shape === "map" || query.unique) && form.capacity.checked;
    query.strategy = form.strategy.value;
    query.ordered = !query.weak && form.ordered.checked;
    query.sorted = query.ordered && form.sorted.checked;
    query.multi = form.multi.checked;
    query.index = form.index.checked;
    query.shift = form.shift.checked;
    query.splice = form.splice.checked;
    query.long = form.long.checked;
    query.churn = form.churn.value;

    for (var id in questions) {
        var element = document.getElementById(id);
        if (!element) continue; // XXX
        element.classList.remove(existingClasses[id]);
        var className = questions[id](query);
        existingClasses[id] = className;
        element.classList.add(className);
    }

}

