---

name: delete(value)

---

Deletes the first equivalent value.
Returns whether the key was found and successfully deleted.

--- |

This is a very fast operation for `Set`, `LruSet`, and `FastSet` because they
are backed by hash tables.
This is a fast operation for `SortedSet` because it is backed by a splay tree,
fast for `SortedArray` and `SortedArraySet` beause they use a binary search,
and fast for `Heap` because it is backed by a binary search tree projected on an
array.

However, `delete(value)` for these collections does not support the
`delete(value, equals)` overload.
Providing a second argument to `delete` in these collections will throw an
error.

