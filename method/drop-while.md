---

name: dropWhile(callback, thisp?)

names:
-   dropWhile(callback)
-   dropWhile(callback, thisp)

see:
-   take-while
-   map
-   filter
-   map-iterator
-   filter-iterator

---

Returns an iterator that will begin with the first value from this iteration
that passes a test.

--- |

The callback receives a value, its index, and this iterator.
The callback is expected to return whether this value should be excluded.
Once a value has been included, all subsequent entries from this iteration will
pass through.

