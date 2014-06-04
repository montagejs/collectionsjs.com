---

name: LruMap()

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

---

A map with a maximum capacity that will evict the least recently used entry.

--- |

An `LruMap` is backed by an `LruSet` of *[key, value]* entries, with
`contentEquals` and `contentHash` overriden to only consider the *key*.

