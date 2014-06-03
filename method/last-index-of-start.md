---

names:
-   lastIndexOf(value)
-   lastIndexOf(value, start)

collections:
-   array
-   deque

see:
-   index-of-start
-   index-of
-   find-last-value
-   find-last
-   find-last-index

todo:
-   list implementation
-   set implementation

---

Returns the last position of a value, or *-1* if the value is not found.

---

Returns the position of the last of equivalent values.  The second argument
is an optional index from which to start seeking, the upper bound of the
search, and defaults to *length - 1*, meaning search the entire collection.

For arrays, equivalence is defined by the `===` operator.
For all other collections, equivalence is defined by `contentEquals`, which
can be overridden with an argument to the collection’s constructor, or by
assigning a property to either the instance or prototype.
The default `contentEquals` is `Object.equals`, which performs a deep equality
comparison.

This method is slow, requiring a linear walk.
Fast implementations of `lastIndexOf(value)` exist for `SortedSet`, `SortedArray`,
and `SortedArraySet`, but do not support a start index.

The precedent for the `lastIndexOf` method is the JavaScript Array method, as
described on [MDN][].

[MDN]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf

