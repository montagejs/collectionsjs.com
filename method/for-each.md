---

see:
-   reduce
-   map
-   filter
-   group

---

Calls the callback for each entry in the collection.

---

The given callback receives the value for each entry, the key or index, and the
collection itself.
It is not obliged to return anything, and `forEach` returns nothing.

The iteration of lists is resilient to changes to the list during iteration.
Nodes added after the current node will be visited.
Nodes removed before the current node will not affect subsequent iterations.

If this collection is an array with holes, those entries will not be visited.

