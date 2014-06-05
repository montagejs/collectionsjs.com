---

name: Heap

names:
-   Heap()
-   Heap(values)
-   Heap(values, equals, compare)

inherits:
-   generic-collection
-   property-changes
-   range-changes
-   map-changes
-   observable-object
-   observable-range
-   observable-map

methods:
-   push
-   pop
-   add
-   index-of
-   delete-value
-   peek
-   max
-   one
-   clear
-   reduce
-   reduce-right
-   construct-clone
-   heap-float
-   heap-sink
-   heap-make-observable
-   heap-handle-content-range-change
-   heap-handle-content-range-will-change
-   heap-handle-content-map-change
-   heap-handle-content-map-will-change

---

A collection of values with the largest always on top.

--- |

A heap is a binary tree where each node is greater than both its leaves.
The tree itself is complete or nearly complete at all times, so the heap is
backed by a compact array.
When values are added or removed, the tree rotates until the value has sunk
until its parent is greater, or floated until all children are less.

Values are presumed to not change in relative position without first being
removed, and perhaps added back, or adjusted after mutation using `sink(index)`
or `float(index)`.

