---

name: LfuMap

usage: |
    var LfuMap = require("collections/lfu-map");

names:
-   LfuMap()
-   LfuMap(values)
-   LfuMap(values, capacity)
-   LfuMap(values, capacity, equals, hash)
-   LfuMap(values, capacity, equals, hash, getDefault)

inherits:
-   generic-collection
-   generic-map
-   property-changes
-   observable-object

methods:
-   construct-clone
-   lfu-map-log
-   lfu-map-stringify
-   lfu-add-map-change-listener
-   content-equals
-   content-hash

---

A map with a maximum capacity that will evict the least frequently used entry.

--- |

An `LfuMap` is backed by an `LfuSet` of *[key, value]* entries, with
`contentEquals` and `contentHash` overriden to only consider the *key*.

