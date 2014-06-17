---

name: has(value)

see:
-   has-key
-   has-value-equals

samples:
- |
    var set = new Set([1, 2, 3]);
    set.has(2);
    set.has(4);

---

Whether an equivalent value exists in this collection.

--- |

This operation is very fast for sets because they are backed by a hash table.
The operation is fast for `SortedSet` and `SortedArraySet` by virtue of a binary
search.

To avoid confusion with the linear search available as `has(value, equals)` on
`Array`, `List`, and `Deque`, if you pass a second argument, this method will
throw an exception.

