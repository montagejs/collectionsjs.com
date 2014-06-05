---

name: filterIterator(callback, thisp?)

version: v1

names:
-   filterIterator(callback)
-   filterIterator(callback, thisp)

see:
-   filter
-   mapIterator

---

Returns an iterator for all values from this iterator that pass a test.

--- |

THe given callback receives the value for each entry, its index, and the
iterator itself.
The callback is expected to return a truthy value if the entry is to be
retained.
The `next` method on the iterator will consume values from this iterator until
it finds a value that passes.

