---

names:
-   indexOf(value)
-   indexOf(value, start)

collections:
-   array
-   deque

see:
-   last-index-of-start
-   index-of
-   find-index
-   find-value

todo:
-   list implementation
-   set implementation

---

Returns the position of a value, or *-1* if the value is not found.

--- |

Returns the position of the first of equivalent values.
The second argument is an optional index from which to start seeking, and
defaults to 0, meaning search the entire collection.

For arrays, equivalence is defined by the `===` operator.
For all other collections, equivalence is defined by `contentEquals`, which
can be overridden with an argument to the collection’s constructor, or by
assigning a property to either the instance or prototype.
The default `contentEquals` is `Object.equals`, which performs a deep equality
comparison.

This method is slow, requiring a linear walk.
Fast implementations of `indexOf(value)` exist for `SortedSet`, `SortedArray`,
and `SortedArraySet`, but do not support a start index.

The precedent for the `indexOf` method is the JavaScript Array method, as
described on [MDN][].

[MDN]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

