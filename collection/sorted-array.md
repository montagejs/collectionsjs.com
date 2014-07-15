---

name: SortedArray

usage: |
    var SortedArray = require("collections/sorted-array");

names:
-   SortedArray()
-   SortedArray(values)
-   SortedArray(values, equals, compare)
-   SortedArray(values, equals, compare, getDefault)

inherits:
-   generic-collection
-   property-changes
-   range-changes
-   observable-object
-   observable-range

properties:
-   length

methods:
-   has-value
-   get-value
-   add-value
-   delete-value
-   delete-all
-   index-of
-   last-index-of
-   find-value
-   find-last-value
-   push
-   unshift
-   pop
-   shift
-   slice
-   splice
-   swap
-   reduce
-   reduce-right
-   min
-   max
-   one
-   clear
-   equals
-   compare
-   construct-clone
-   content-equals
-   content-compare
-   to-json

samples:
- |
    var sortedArray = new SortedArray([2, 8, 5]);
    sortedArray.push(3);
    sortedArray.toArray();
    sortedArray.pop();

---

A collection of values stored in stable stored order, backed by an array.

--- |

If the given values are an array, the `SortedArray` takes ownership of that
array and modifies it in place.
These changes can be observed.

`SortedArray` flies the `isSorted` flag.

