---

name: sort()

names:
-   sort()
-   sort(compare)

see:
-   sorted

---

Sorts a collection in place.

---

:warning: The default comparator for `sort` on `Array` is defined by the
JavaScript language specification and is almost never appropriate.
The left and right values are coerced to strings and compared lexicographically.
Consider using `Object.compare`.
For all other collections that implement `sort`, `Object.compare` is the
default.

The comparator must be a function that accepts two values and returns a number.

-   less than zero if the left is less than the right
-   more than zero if the left is more than the right
-   equal to zero if the left is either incomparable or equivalent to the right

A comparator for numbers should subtract the right from the left and expresses
both the direction and magnitude of the difference.
If the magnitude of the difference is not meaningful, a comparator *should*
return only *Infinity*, *-Infinity*, or *0*, to increase the usefulness of the
comparator.

