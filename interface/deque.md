---

collections:
-   deque
-   list
-   array

---

A deque, our double-ended-queue, is a collection that supports
`push(...values)`, `pop()`, `shift()`, and `unshift(...values)`.
An `Array` is a prime example of a `Deque`, but `shift()` and
`unshift(...values)` reposition every subsequent value within the array.

The `Deque` collection is designed specifically to perform well for all four of
these operations.
A deque is backed by a circular buffer, which has nice properties for avoiding
garbage collection when values are frequently added and removed.
However, `swap(index, length, values)` and `splice(index, length, ...values`) do
require repositioning every subsequent value in the circular buffer.

A `List` collection also supports fast deque operations.
Lists are backed by a doubly linked list with a head node.
The linked list is part of the list's public interface and you can manipulate it
directly, which makes it possible to perform very fast concatenation and splices
at any position.
However, frequently adding and removing values will effect garbage collector
churn.

