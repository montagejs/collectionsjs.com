---

name: LruMap

usage: |
    var LruMap = require("collections/lru-map");

names:
-   LruMap()
-   LruMap(values)
-   LruMap(values, capacity)
-   LruMap(values, capacity, equals, hash)
-   LruMap(values, capacity, equals, hash, getDefault)

inherits:
-   generic-collection
-   generic-map
-   property-changes
-   observable-object

methods:
-   construct-clone
-   lru-map-log
-   lru-map-stringify
-   lru-add-map-change-listener
-   content-equals
-   content-hash

samples:
- |
    var lruMap = new LruMap({a: 1, b: 2, c: 3}, 3);
    lruMap.get("a");
    lruMap.get("c");
    lruMap.set("d", 4);
    lruMap.toObject();

---

A map with a maximum capacity that will evict the least recently used entry.

--- |

An `LruMap` is backed by an `LruSet` of *[key, value]* entries, with
`contentEquals` and `contentHash` overriden to only consider the *key*.

