---

name: iterate(start, end)

names:
-   iterate()
-   iterate(start)
-   iterate(start, end)

see:
-   iterate

todo:
-   support start and end indexes and nodes in list

---

Iterates from start to end within a collection.

--- |

Returns an iterator that will start at the given index and stop when it reaches
the end.
The iterator will not produce the value at the end index.

The optional `end` argument defaults to the length of the collection.

The optional `start` argument defaults to zero, the beginning of the collection.

Although many collections implement `iterate`, not all support the `start` and
`end` indexes.

