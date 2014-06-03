---

names:
-   Deque()
-   Deque(values)

inherits:
-   generic-collection
-   generic-order
-   range-changes

methods:
-   add
-   push
-   pop
-   shift
-   unshift
-   clear
-   ensure-capacity
-   grow
-   deque-init
-   deque-snap
-   one
-   peek
-   peek-back
-   poke
-   poke-back
-   get-value-equals
-   index-of-start
-   last-index-of-start
-   find-value
-   find-last-value
-   has-value-equals
-   reduce
-   reduce-right
-   construct-clone

todo:
-   clone
-   iterate

---

An ordered collection of values with fast random access, `push`, `pop`, `shift`,
and `unshift`, but slow to splice when massive.

---

A double ended queue is backed by a circular buffer, which cuts down on garbage
collector churn.
As long as the queue is stable, meaning values are added and removed at roughtly
the same pace, the backing store will not create new objects.
The store itself is an object with numeric indexes, like an array.
The indexes of the deque are offset from the indexes within the circular buffer,
and values spill over from the end of the buffer back to the beginning.
As values are removed by way of shifting, it makes remove for values by way of
pushing.

```js
var Deque = require("collections/deque")
```

Deques have constants `maxCapacity` and `minCapacity`.

