---

name: concat(...iterables)

see:
-   flatten

---

Returns a new collection of the same type containing all the values of itself
and the values of any number of other iterable collections in order.

--- |

For collections that do not allow duplicate values, like `Set`, `concat` will
favor the last of all duplicates.
For maps, the iterables are treated as map-like objects and each successively
updates the result.

`concat` is the variadic cousin of `flatten`.

