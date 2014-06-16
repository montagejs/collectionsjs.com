---

name: push(...values)

very-fast:
-   array
-   deque
-   list

see:
-   pop
-   unshift
-   poke-back

samples:
- |
    var array = [1, 2, 3];
    array.push(6, 4);
    array
- |
    var sortedSet = new SortedSet([2, 8, 5]);
    sortedSet.toArray();
    sortedSet.push(1, 6, 14);
    sortedSet.toArray();

---

Adds values to the end of a collection.

--- |

For purposes of genericity, collections that have an intrinsic relative order
for their values, like a `SortedSet`, support the `push` method but do not
necessarily add the new values to the end of the collection.

As of version 1.1.0 and 2.0.1, `Heap` does not yet support `push` for multiple
values.

