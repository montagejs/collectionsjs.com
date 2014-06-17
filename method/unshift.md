---

name: unshift(...values)

very-fast:
-   deque
-   list

slow:
-   array

see:
-   pop
-   push
-   poke

samples:
- |
    var list = new List([1, 2, 3]);
    list.unshift(6, 4);
    list.toArray();
- |
    var sortedSet = new SortedSet([2, 8, 5]);
    sortedSet.toArray();
    sortedSet.unshift(1, 6, 14);
    sortedSet.toArray();

---

Adds values to the beginning of a collection.

--- |

For purposes of genericity, collections that have an intrinsic relative order
for their values, like a `SortedSet`, support the `unshift` method but do
not necessarily add the new values to the beginning of the collection.

