---

name: Set

collections:
-   set
-   fast-set
-   sorted-set
-   sorted-array
-   sorted-array-set
-   lru-set
-   lfu-set

---

Any collection that has no duplicate values.

--- |

A set represents a collection of unique values.
The methods intrinsic to a set are `add(value)` and `delete(value)`.
Sets ignore attempts to add duplicate values.
Sets share a wealth of special methods like `union(values)` and
`intersection(values)`.

See the interface of ECMAScript Harmony [simple maps and
sets](http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets)

