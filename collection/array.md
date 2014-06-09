---

name: Array

names:
-   Array()
-   Array(length)
-   Array(...values)
-   Array.from(values)

mixin:
-   generic-collection/add-each
-   generic-collection/delete-each
-   generic-collection/to-array
-   generic-collection/to-object
-   generic-collection/all
-   generic-collection/any
-   generic-collection/min
-   generic-collection/max
-   generic-collection/sum
-   generic-collection/average
-   generic-collection/only
-   generic-collection/flatten
-   generic-collection/zip
-   generic-collection/enumerate
-   generic-collection/group
-   generic-collection/sorted
-   generic-collection/reversed

methods:
-   push
-   pop
-   shift
-   unshift
-   has-value
-   has-value-equals
-   get-key
-   set
-   delete-value
-   delete-value-equals
-   find-value
-   find-last-value
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

---

An ordered collection of values with fast random access, `push(...values)`, and
`pop()`, but can be slow to splice when sufficiently massive.

--- |

The `shim-array` module provides extensions so it hosts all the expressiveness
of other collections.  The `shim-array` module shims some ECMAScript 5 methods
onto the array prototype if they are not natively implemented.

```js
require("collections/shim-array");
```

