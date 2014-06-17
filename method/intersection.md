---

name: intersection(values)

see:
-   union
-   difference
-   symmetric-difference

samples:
- |
    var set = new SortedSet([2, 8, 5]);
    var intersectionSet = set.intersection([3, 8, 5]);
    intersectionSet.toArray();
---

Returns the set of values that are in both of these sets.

--- |

The given values may be any iterable.

The returned set will be the same type of this set, for any kind of set that
inherits `GenericSet`.

