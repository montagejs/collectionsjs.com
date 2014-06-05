---

name: List

names:
-   List()
-   List(values)

inherits:
-   generic-collection
-   generic-order
-   property-changes
-   range-changes
-   observable-object
-   observable-range

methods:
-   find-value
-   find-last-value
-   has-value-equals
-   get-value-equals
-   delete-value-equals
-   clear
-   add-value
-   push
-   unshift
-   pop
-   shift
-   peek
-   poke
-   one
-   scan
-   slice
-   splice
-   swap
-   reverse
-   sort
-   reduce
-   reduce-right
-   update-indexes
-   make-observable
-   iterate

---

An ordered list of values.

--- |

A `List` is backed by a doubly linked list with a head node.

The list has a `head` property to an empty node.
The list begins with the `next` node from the `head`.
The last node of the list is the `prev` node from the `head`.
The `head` represents the node one past the end of the list and has no `value`.

Nodes can be manipulated directly.
Lists use a `Node(value)` property as their node constructor.
It supports `delete()`, `addBefore(node)`, and `addAfter(node)`.
Directly manipulating `next` and `prev` of a node allows for fast splicing.

Nodes can be reused to avoid garbage collector churn.
However, if you do not need to splice, a `Deque` may perform better than `List`.

Lists can be iterated.
The iterator will produce artificial indexes for each value.

Lists provide slow random access by index.
Methods that accept indexes to seek a position will count as they walk to the
sought node.
These methods will always accept a node instead to instantly traverse to a known
position.

