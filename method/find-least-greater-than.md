---

name: findLeastGreaterThan(value)

see:
-   find-greatest-less-than
-   find-least-greater-than-or-equal
-   find-least
-   find-value

---

Finds the smallest value greater than the given value, returning the node
at which it was found, or undefined.

---

Values are compared using the collection’s intrinsic `contentEquals` and
`contentCompare`, determined at time of construction.

This is fast (logarithmic) and may rotate the underlying splay tree.


