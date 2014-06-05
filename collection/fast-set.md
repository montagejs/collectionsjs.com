---

name: FastSet

inherits:
-   generic-collection
-   generic-set
-   observable-object
-   property-changes

methods:
-   has-value
-   get-value
-   delete-value
-   add-value
-   clear
-   reduce
-   one
-   iterate
-   construct-clone
-   fast-set-log
-   fast-set-log-node

---

The backing store for `Set` and `FastMap`.

--- |

A `FastSet` is a set of arbitrary values, including objects.
It is itself backed by a `Dict` of hash keys to a `List` of non-equivalent
values that share the same hash key.
The order of iteration is depth first through this structure, so not a faithful
emulation of a proper ECMAScript 6 `Set` if there are hash collisions.

