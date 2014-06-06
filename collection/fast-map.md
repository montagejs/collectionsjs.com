---

name: FastMap

names:
-   FastMap()
-   FastMap(values)
-   FastMap(values, equals)
-   FastMap(values, equals, hash)
-   FastMap(values, equals, hash, getDefault)

see:
-   map
-   fast-set

inherits:
-   generic-collection
-   generic-map
-   observable-object
-   property-changes

methods:

-   construct-clone
-   fast-map-log
-   fast-map-stringify
-   content-equals
-   content-hash

---

The backing store for a `Map`.

--- |

The `FastMap` is a map from arbitrary keys to values.
It is itself backed by a `FastSet` of *[key, value]* entries, with
`contentEquals` and `contentCompare` overridden to consider only the *key*.
The `FastMap` is fast because it does not track insertion order of the entries,
so it will not behave exactly like an ECMAScript 6 `Map` in that regard.
The enumeration order of the map will depend on whether there are hash
collisions.
If there are no hash collisions, its enumeration order is consistent with `Map`.

