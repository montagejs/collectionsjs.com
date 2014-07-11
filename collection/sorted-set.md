---

name: SortedSet

usage: |
    var SortedSet = require("collections/sorted-set");

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
-   iterator
-   sorted-set-summary
-   sorted-set-log
-   sorted-set-log-node
-   construct-clone
-   content-equals
-   content-compare

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


### Design notes

This collection was designed based on analysis of two other JavaScript splay
tree implementations, but further augmented to incrementally track the length of
every subtree.

- a SplayTree impementation buried in Fedor Indutny’s super-secret
  [Callgrind](https://github.com/indutny/callgrind.js). This
  implementation uses parent references.
- a SplayTree implementation adapted by [Paolo
  Fragomeni](https://github.com/hij1nx/forest) from the V8 project and
  based on the top-down splaying algorithm from "Self-adjusting Binary
  Search Trees" by Sleator and Tarjan. This does not use or require
  parent references, so I favored it over Fedor Indutny’s style.

