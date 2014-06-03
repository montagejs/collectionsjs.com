---

name: SortedArray()

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

methods:
-   has-value
-   get-value
-   add-value
-   delete-value
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
-   iterate-start-end

---

A collection of values stored in stable stored order, backed by an array.

---

If the given values are an array, the `SortedArray` takes ownership of that
array and modifies it in place.
These changes can be observed.

`SortedArray` flies the `isSorted` flag.

