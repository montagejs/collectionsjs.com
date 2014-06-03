---

name: flatten()

see:
-   concat

---

Assuming that this is a collection of collections, returns a new collection that
contains all the values of each nested collection in order.

---

For collections that do not allow duplicate values, like `Set`, `concat` will
favor the last of all duplicates.
For maps, the iterables are treated as map-like objects and each successively
updates the result.

Flattening nested arrays is equivalent to concatenating each of them to an empty
array.

