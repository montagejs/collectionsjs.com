---

name: findLeastGreaterThanOrEqual(value)

see:
-   find-greatest-less-than-or-equal
-   find-least-greater-than
-   find-least
-   find-value

---

Finds the smallest value greater than or equal to the given value,
returning the node at which it was found, or undefined.

---

Values are compared using the collection’s intrinsic `contentEquals` and
`contentCompare`, determined at time of construction.

This is fast (logarithmic) and may rotate the underlying splay tree.

