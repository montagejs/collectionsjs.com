---

name: equals(value, equals?)

names:
-   equals(value)
-   equals(value, equals)

see:
-   compare
-   hash

---

Returns whether this collection is equivalent to the given collection.

--- |

In general, collections are equivalent if they have the same content.
However, length, order, and uniqueness must also be equivalent if this collection,
or the collection on the left for `Object.equals`, discriminate those
attributes.

For example, if the left operand is a `List`, `Deque`, or `Array`, order will be
significant.
If the left operand is a `Set`, uniqueness will matter, but order will not.

The optional second argument is the equality operator to use when comparing the
content of these collections, and defaults to `Object.equals`.

