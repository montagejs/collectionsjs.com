---

name: delete(value)

names:
-   delete(value)
-   delete(value, equals)

todo:
-   deque

---

Seeks out and deletes an equivalent value.
Returns whether the value was found and successfully deleted.

---

This is a slow operation because it involves a linear walk to find the
equivalent value.
For an array, the hole left by the deletion will be filled by shifting
subsequent values leftward.

By default, the eqality comparison is performed by `Object.equals`, with the
reference value first.

In versions 1.1.1 and 2.0.1, `delete` favors the last found value for lists, and
the first found value for arrays.
This behavior is inconsistent subject to change, pending discovery of whether
FIFO or LIFO semantics are more useful by default.

