---

name: compare(value)

see:
-   equals
-   hash

---

Compares two values and returns a number having the same relative value to zero.

--- |

Compare will return a number

-   less than zero if the left is less than the right
-   more than zero if the right is more than the left
-   equal to zero if the left is either incomparable or equivalent to the right

`Object.compare` delegates to `compare` methods of objects when they are
available, and returns *0* if neither the left or right object support
comparison.

When comparing numbers, `compare` returns the difference between the left and
right, which expresses both the direction and magnitude of the relative values.
If the magnitude of the difference is not meaningful, compare *should* return
only *Infinity*, *-Infinity*, or *0*, but there is a long established precedent
from C of returning *-1* and *1* instead.

Note that comparison is not sufficient to distinguish equality, since *0* can
mean that the values are incomparable.

The optional second argument is an alternate comparator to use on the content of
the left collection, and defaults to `Object.compare`.

