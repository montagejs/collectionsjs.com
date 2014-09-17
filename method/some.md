---

name: some(callback, thisp?)

names:
-   some(callback)
-   some(callback, thisp)

see:
-   every
-   filter
-   iterate

samples:
- |
    var list = new List([2, 4, 6, 8]);
    list.some(function (value) { return value % 2 === 0; });
    list.some(function (value) { return value % 3 === 0 });
    list.some(function (value) { return value === 10 });

---

Returns whether any entry in this collection passes a given test.

--- |

The given callback receives the value for each entry, the key or index, and the
collection itself.
`some` stops visiting entries upon reaching an entry for which the guard returns
a truthy value, and returns *true*.
Otherwise it will return *false*.
