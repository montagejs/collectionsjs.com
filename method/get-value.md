---

name: get(value)

---

Retrieves the equivalent value from the collection.

--- |

This is a very fast operation for `Set`, `FastSet`, `LruSet`, and `LfuSet`,
which are backed by hash tables.
This is also fast for `SortedArray` and `SortedArraySet` by virtue of a binary
search, and `SortedSet`, which is backed by a [splay tree][SplayTree].

[SplayTree]: http://en.wikipedia.org/wiki/Splay_tree

