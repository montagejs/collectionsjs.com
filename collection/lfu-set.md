---

name: LfuSet

names:
-   LfuSet(values)
-   LfuSet(values, capacity)
-   LfuSet(values, capacity, equals, hash)
-   LfuSet(values, capacity, equals, hash, getDefault)

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
-   content-equals
-   content-hash

---

A set with a maximum capacity that will evict the least frequently used value.

--- |

An `LfuSet` is backed by a `Set` and a doubly linked list of `Set` instances for
each cohort of values by frequency of use.

