names:
-   delete(value)
-   delete(value, equals)
collections:
-   array
-   list
-   deque
---

Seeks out and deletes the first equivalent value.
Returns whether the key was found and successfully deleted.

---

This is a slow operation because it involves a linear walk to find the
equivalent value.
For an array, the hole left by the deletion will be filled by shifting
subsequent values leftward.

By default, the eqality comparison is performed by `Object.equals`, with the
reference value first.

