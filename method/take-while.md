---

name: takeWhile(callback, thisp?)

names:
-   takeWhile(callback)
-   takeWhile(callback, thisp)

see:
-   drop-while
-   map
-   filter
-   map-iterator
-   filter-iterator

---

Returns an iterator that will produce every value from this iteration until an
entry fails a test.

--- |

The callback receives a value, its index, and this iterator.
The callback is expected to return whether this value should be included.
Once a value has been excluded, the returned iteration is done.

