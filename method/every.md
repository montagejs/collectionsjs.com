---

name: every(callback)

names:
-   every(callback)
-   every(callback, thisp)

see:
-   some
-   filter
-   iterate

---

Returns whether any entry in this collection passes a given test.

---

The given callback receives the value for each entry, the key or index, and the
collection itself.
`some` stops visiting entries upon reaching an entry for which the guard returns
a truthy value, and returns *true*.
Otherwise it will return *false*.

