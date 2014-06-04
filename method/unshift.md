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

---

Adds values to the beginning of a collection.

--- |

For purposes of genericity, collections that have an intrinsic relative order
for their values, like a `SortedSet`, support the `unsfhit` method but do
not necessarily add the new values to the beginning of the collection.

