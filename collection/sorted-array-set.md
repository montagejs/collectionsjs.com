---

name: SortedArraySet

usage: |
    var SortedArraySet = require("collections/sorted-array-set");

names:
-   SortedArraySet()
-   SortedArraySet(values)
-   SortedArraySet(values, equals, compare)
-   SortedArraySet(values, equals, compare, getDefault)

inherits:
-   sorted-array
-   generic-set
-   property-changes
-   observable-object

methods:
-   add
-   reduce
-   reduce-right
-   construct-clone
-   content-equals
-   content-compare

---

A collection of unique values stored in sorted order, backed by a plain array.

--- |

If the given values are an actual array, the `SortedArraySet` takes ownership of
that array and maintains its content.
The user can then observe that array for changes.

A sorted array sets performs better than a `SortedSet` when it has roughly less
than 100 values.

`SortedArraySet` instances fly the `isSorted` and `isSet` flags.

> ⚠️ **Callback Caveat**:
> The equality of your `compare` callback must match the equality of your `equals` callback,
> or you may end up with duplicates in your set.
> #### Broken example:    
> `equals`: `(foo, bar) => foo.a === bar.a`  
> `compare`: `(foo, bar) => foo.b - bar.b`
> #### Working alternative:
>`equals`: `(foo, bar) => foo.a === bar.a`  
>`compare`: `(foo, bar) => foo.a === bar.a ? 0 : foo.b - bar.b` 
>
> More info here: https://github.com/montagejs/collections/issues/93
