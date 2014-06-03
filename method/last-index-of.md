---

name: lastIndexOf(value)

names:
-   lastIndexOf(value)

---

Returns the last position of a value, or *-1* if the value is not found.

---

Returns the position of the last of equivalent values.
Equivalence is defined by the equality operator intrinsic to the collection,
either the one given as the `equals` argument to its constructor, or
`Object.equals` by default.

For a `SortedSet`, this operation is fast, because it is backed by a binary
search tree.
For a `SortedArray`, or `SortedArraySet`, this is also fast, employing a binary
search.

The implementation of `indexOf` for `Array`, `List`, and `Deque` is slower
but more flexible.

