---

names:
-   Array()
-   Array(length)
-   Array(...values)
-   Array.from(values)

mixin:
-   add-each
-   delete-each
-   to-array
-   to-object
-   all
-   any
-   min
-   max
-   sum
-   average
-   only
-   flatten
-   zip
-   enumerate
-   group
-   sorted
-   reversed

methods:
-   push
-   pop
-   shift
-   unshift
-   has-value-equals
-   get-key
-   set
-   delete-key
-   find-equals-start
-   find-last-value-equals-start
-   swap
-   peek
-   poke
-   peek-back
-   poke-back
-   one
-   clear
-   compare
-   equals
-   construct-clone
-   clone
-   iterate-start-end

---

An ordered collection of values with fast random access, `push(...values)`, and
`pop()`, but can be slow to splice when sufficiently massive.

---

The `shim-array` module provides extensions so it hosts all the expressiveness
of other collections.  The `shim-array` module shims some ECMAScript 5 methods
onto the array prototype if they are not natively implemented.

```js
require("collections/shim-array");
```

