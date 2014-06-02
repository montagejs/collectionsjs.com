
names:
-   has(value)

collections:
-   set
-   sorted-set
-   sorted-array-set

---

Whether an equivalent value exists in this collection.

---

This operation is very fast for sets because they are backed by a hash table.
The operation is fast for `SortedSet` and `SortedArraySet` by virtue of a binary
search.

To avoid confusion with the linear search available as `has(value, equals)` on
`Array`, `List`, and `Deque`, if you pass a second argument, this method will
throw an exception.

