---

name: findGreatest()

see:
-   find-least
-   find-greatest-less-than
-   find-greatest-less-than-or-equal
-   find-value

---

Finds the largest value, returning the node at which it was found, or undefined.

---

Values are compared using the collection’s intrinsic `contentEquals` and
`contentCompare`, determined at time of construction.

This is fast (logarithmic) and performs no rotations of the splay tree backing
the `SortedSet`.

