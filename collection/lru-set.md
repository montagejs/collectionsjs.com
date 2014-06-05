---

name: LruSet

names:
-   LruSet(values)
-   LruSet(values, capacity)
-   LruSet(values, capacity, equals, hash)
-   LruSet(values, capacity, equals, hash, getDefault)

inherits:
-   generic-collection
-   generic-set
-   property-changes
-   range-changes
-   observable-object
-   observable-range

methods:
-   construct-clone
-   has-value
-   get-value
-   add-value
-   delete-value
-   one
-   clear
-   reduce
-   reduce-right
-   iterate

---

A set with a maximum capacity that will evict the least recently used value.

--- |

An `LruSet` is backed by a `Set` and uses the set’s own insertion order list to
track which value was least recently used.

