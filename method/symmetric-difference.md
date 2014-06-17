---

name: symmetricDifference(values)

see:
-   difference
-   union
-   intersection

samples:
- |
    var set = new SortedSet([2, 8, 5]);
    var symDifferenceSet = set.symmetricDifference([3, 8, 5]);
    symDifferenceSet.toArray();

---

Returns the set of values that are only in one of these sets.

--- |

The given values may be any iterable.

The returned set will be the same type of this set, for any kind of set that
inherits `GenericSet`.

