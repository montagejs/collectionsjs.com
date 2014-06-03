---

see:
-   for-each
-   map
-   group
-   reduce

---

Returns an array with each value from this collection that passes the given
test.

---

The given callback receives the value for each entry, the key or index, and the
collection itself.
If the return value of the callback is truthy, the value will be included in the
resulting array.

The index of the value will be ignored and the resulting array will be compact,
even if this collection is an array with holes.
Positions in this array that are holes will not be visited.

