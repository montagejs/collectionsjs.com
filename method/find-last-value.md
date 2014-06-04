---

name: findLastValue(value)

names:
-   findLastValue(value)
-   findLastValue(value, equals)

see:
-   find-value
-   find-last
-   find-last-index

---

Finds the last equivalent value, searching from the right.

--- |

For `List` and `SortedSet`, returns the node at which the value was found, or
`null` if no equivalent value exists.
For other collections, returns the index of the found value or *-1* if no
equivalent value exists.
Regardless of the collection, the value returned is suitable for passing to
other methods like `slice`, `splice`, and `swap`.

The optional `equals` argument is alternative for `Object.equals`.

The optional `start` is the index from which to begin searching.
Values to the right of the start index will not be considered.

`SortedSet`, `SortedArray`, and `SortedArraySet` do not support overriding the
`equals` operator nor the `start` index, and will throw an exception if provided
either.
A meaningful implementation with these parameters may be provided in a future
release.

In version 1, this method is called `findLast`.
It has been renamed `findLastValue` in version 2 to avoid a conflict with
`find` as proposed for ECMAScript 6.

