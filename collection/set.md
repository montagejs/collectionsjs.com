---

name: Set

usage: |
    var Set = require("collections/set");

names:
-   Set(values)
-   Set(values, equals, hash)
-   Set(values, equals, hash, getDefault)

inherits:
-   generic-collection
-   generic-set
-   property-changes
-   range-changes
-   observable-object
-   observable-range

methods:
-   has-value
-   get-value
-   add-value
-   delete-value
-   pop
-   shift
-   one
-   clear
-   reduce
-   reduce-right
-   iterator
-   set-log
-   make-observable
-   construct-clone
-   content-equals
-   content-hash

samples:
- |
    var object = {x: "hello"};
    var set = new Set(["a", object]);
    set.add("b");
    set.toArray();
    set.add(object);
    set.toArray();
- |
    var nameSet = new Set(null, function (a, b) {
        return a.name === b.name;
    }, function (object) {
        return object.name;
    });
    nameSet.add({name: "Kris", github: "kriskowal"});
    nameSet.add({name: "Stuart", github: "stuk"});
    nameSet.get({name: "Kris"});
    nameSet.add({name: "Stuart", github: "wrong"});
    nameSet.get({name: "Stuart"});

---

A collection of unique values.

--- |

The constructor will add all of the values if any are given.
If the values are a map, the keys will be lost.

The optional `equals` and `hash` arguments override the set’s `contentEquals` and
`contentCompare` methods and determine where to store values and whether they
are equivalent.

The optional `getDefault` argument overrides the set’s `getDefault(value)`
method, which will be called by `get` if it cannot find an equivalent value
within the set.

The purpose of `get` is less obvious on a `Set` than a `Map`, since you would
not often need to find a value you already have.
However, by virtue of overriding `contentEquals` and `contentHash`, it is
possible to search for a value using an “equivalent” place-holder.
This is how maps use sets to find *[key, value]* entries when they only know the
*key*.

A `Set` is backed by a `FastSet` and a `List`.
The `List` is called `order` and tracks the iteration order of the `Set`.
Values are produced in the order they were first inserted.
The `FastSet` is called `store` and ensures uniqueness and very fast searches.
The `FastSet` stores nodes form the `order` list but hashes and compares them by
their `value` property.

The `Store` and `Order` constructors can be overridden by inheritors.

