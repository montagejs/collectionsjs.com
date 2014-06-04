---

name: swap(start, length, values)

names:
-   swap(start, length)
-   swap(start, length, values)

see:
-   splice
-   slice

---

Replaces a length of values from a starting position with the given values.

--- |

Unlike `splice`, if the start index is beyond the length of an array, `swap`
will extend the array to the given start index, leaving holes between the old
length and the start index.

In version 2, `swap` no longer returns an array of the removed length of values,
which further distinguishes it from `splice`, making it less wasteful in some
cases.

