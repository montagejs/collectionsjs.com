---

name: Map

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

methods:
-   construct-clone
-   map-log
-   map-log-node

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

