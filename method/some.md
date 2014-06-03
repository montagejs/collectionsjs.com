---

name: some(callback)

names:
-   some(callback)
-   some(callback, thisp)

see:
-   every
-   filter
-   iterate

---

Returns whether every entry in this collection passes a given test.

---

The given callback receives the value for each entry, the key or index, and the
collection itself.
`every` stops visiting entries upon reaching an entry for which the guard
returns a falsy value, and returns *false*.
Otherwise it will return *true*.

