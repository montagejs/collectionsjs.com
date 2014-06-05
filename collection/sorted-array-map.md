---

name: SortedArrayMap

names:
-   SortedArrayMap()
-   SortedArrayMap(entries)
-   SortedArrayMap(entries, equals, compare)
-   SortedArrayMap(entries, equals, compare, getDefault)

inherits:
-   generic-collection
-   generic-map
-   property-changes
-   observable-object

methods:
-   construct-clone

---

A map of key value pairs, sorted by key, backed by an array.

--- |

A `SortedArrayMap` is a `Map` backed by a `SortedArraySet`, which is in turn
backed by a `SortedArray`, backed by an `Array`.
The sorted array maintains the order of the entries using a binary search
considering only the key portion of each entry.

`SortedArrayMap` instances fly the `isSorted` and `isMap` flags.

