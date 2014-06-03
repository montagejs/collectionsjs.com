---

name: findLGreatestLessThan(value)

see:
-   find-least-greater-than
-   find-greatest-less-than-or-equal
-   find-greatest
-   find-value

---

Finds the largest value less than the given value, returning the node at which
it was found, or undefined.

---

Values are compared using the collection’s intrinsic `contentEquals` and
`contentCompare`, determined at time of construction.

This is fast (logarithmic) and may rotate the underlying splay tree.

