---

name: Map

usage: |
    var Map = require("collections/map");

names:
-   Map()
-   Map(values)
-   Map(values, equals, hash)
-   Map(values, equals, hash, getDefault)

inherits:
-   generic-collection
-   generic-map
-   property-changes
-   observable-object

properties:
-   length

methods:
-   construct-clone
-   map-log
-   map-log-node
-   content-equals
-   content-hash

samples:
- |
    var map = new Map({a: 1, b: 2});
    map.set("c", 3);
    map.toObject();
    var key = {x: "hello"};
    map.set(key, 4);
    map.get(key);
    map.entries();
- |
    var defaultMap = new Map({a: 1}, null, null, function (key) {
        return "default: " + key;
    });
    defaultMap.get("a");
    defaultMap.get("missing");

---

A map of *[key, value]* entries, where keys may be arbitrary values including
objects.

--- |

The optional `equals` and `hash` override the `contentEquals` and `contentHash`
properties that operate on the keys of the map to determine whether keys are
equivalent and where to store them.

The optional `getDefault` function overrides the map’s own `getDefault` method,
which is called by `get(key)` if no entry is found for the requested key.

A `Map` is backed by a `Set` of *[key, value]* entries, with `contentEquals` and
`contentHash` overridden to only consider the *key*.

