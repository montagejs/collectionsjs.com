---

name: deleteAll(value, equals?)

names:
-   deleteAll(value)
-   deleteAll(value, equals)

version: 1.2.1

---

Deletes every value equivalent to the given value from the collection.

--- |

*Introduced in version 1.2.1.*

For sets, this is equivalent to delete, but for lists, arrays, and sorted
arrays, may delete more than one value.
For lists and arrays, this involves a linear search, from the beginning,
splicing out each node as it is traversed.

For sorted arrays, there is a mode for the provided equals and the intrinsic
equals.
The provided equals falls back to the linear search provided by the underlying
array.
However, if deleteAll uses its intrinsic order and equivalence, it can guarantee
that all intrinsic values are within a range from the first to the last
equivalent value, so it can splice all equivalent values at once, using a binary
search to find the first equivalent value, and a linear search to find the last..
The method is not implemented on Deque or Heap since random manipulation of
internal content is out of scope for these collections.

