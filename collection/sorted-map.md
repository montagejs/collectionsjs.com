---

name: SortedMap

usage: |
    var SortedMap = require("collections/sorted-map");

names:
-   SortedMap()
-   SortedMap(entries)
-   SortedMap(entries, equals, compare)
-   SortedMap(entries, equals, compare, getDefault)

inherits:
-   generic-collection
-   generic-map
-   property-changes
-   observable-object

properties:
-   length

methods:
-   construct-clone
-   sorted-map-log
-   sorted-map-log-node
-   content-equals
-   content-compare

---

A map with entries sorted by key.

--- |

A `SortedMap` is backed by a `SortedSet` of *[key, value]* entries, with
`contentEquals` and `contentCompare` overridden to consider only the key.

