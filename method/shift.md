---

name: shift()

very-fast:
-   deque
-   list
-   sorted-set

slow:
-   array

see:
-   unshift
-   pop
-   peek

---

Removes a value from the beginning of a collection, and returns that value.

--- |

For a `SortedSet`, this is equivalent to removing the minimum value of the
collection.

For `List` and `Deque`, this operation is very fast.
For an `Array`, this operation will require all subsequent values to be
shifted to the left to fill the void at index zero.

