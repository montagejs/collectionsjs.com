---

name: find|findValue(value, equals?, start?)

versions:
    v1:
        name: find(value, equals?, start?)
        names:
            -   find(value)
            -   find(value, equals)
            -   find(value, equals, start)
    v2:
        name: findValue(value, equals?, start?)
        names:
        -   findValue(value)
        -   findValue(value, equals)
        -   findValue(value, equals, start)

see:
-   find-last-value
-   find
-   find-index

---

Finds the first equivalent value.

--- |

For `List` and `SortedSet`, returns the node at which the value was found, or
`null` if no equivalent value exists.
For other collections, returns the index of the found value or *-1* if no
equivalent value exists.
Regardless of the collection, the value returned is suitable for passing to
other methods like `slice`, `splice`, and `swap`.

The optional `equals` argument is alternative for `Object.equals`.

The optional `start` is the index from which to begin searching.
Values to the left of the start index will not be considered.

`SortedSet`, `SortedArray`, and `SortedArraySet` do not support overriding the
`equals` operator nor the `start` index, and will throw an exception if provided
either.
A meaningful implementation with these parameters may be provided in a future
release.

In version 1, this method is called `find`, which conflicts with the definition
of `find` provided by ECMAScript 6.
In version 2, this method is called `findValue` to eliminate the conflict.

