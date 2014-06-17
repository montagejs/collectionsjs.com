---

name: difference(values)

see:
-   symmetric-difference
-   union
-   intersection

samples:
- |
    var set = new SortedSet([2, 8, 5]);
    var differenceSet = set.difference([3, 8, 5]);
    differenceSet.toArray();

---

Returns the set of values that are in this set, excluding the values that are
also in the other set.

--- |

The given values may be any iterable.

The returned set will be the same type of this set, for any kind of set that
inherits `GenericSet`.

