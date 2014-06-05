---

name: SortedSet

names:
-   SortedSet()
-   SortedSet(values)
-   SortedSet(values, equals, compare)
-   SortedSet(values, equals, compare, getDefault)

inherits:
-   generic-collection
-   generic-set
-   property-changes
-   range-changes
-   observable-object
-   observable-range

methods:
-   has-value
-   get-value
-   add
-   delete-value
-   index-of
-   find-value
-   find-greatest
-   find-greatest-less-than
-   find-greatest-less-than-or-equal
-   find-least
-   find-least-greater-than
-   find-least-greater-than-or-equal
-   pop
-   shift
-   push
-   unshift
-   slice
-   splice
-   swap
-   splay
-   splay-index
-   reduce
-   reduce-right
-   min
-   max
-   one
-   clear
-   iterate
-   iterate-start-end
-   sorted-set-summary
-   sorted-set-log
-   sorted-set-log-node
-   construct-clone

---

A collection of values stored in sorted order using a binary tree.

--- |

A `SortedSet` is a splay tree, using the top-down splaying algorithm from
“Self-adjusting Binary Search Trees” by Sleator and Tarjan.
Instead of traversing the tree, every algorithm rotates until the node of
interest surfaces to the root node.
This tends to cause the most frequently used nodes to stay toward the top over
time.

`SortedSet` instances fly the `isSorted` and `isSet` flags.

