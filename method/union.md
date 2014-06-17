---

name: union(values)

see:
-   intersection
-   difference
-   symmetric-difference

samples:
- |
    var set = new SortedSet([2, 8, 5]);
    var unionSet = set.union([3, 8, 5]);
    unionSet.toArray();

---

Returns the set of values including all values from both of these sets.

--- |

The given values may be any iterable.

The returned set will be the same type of this set, for any kind of set that
inherits `GenericSet`.

