
names:
-   get(value)
-   get(value, equals)

collections:
-   list
-   deque

---

Retrieves the equivalent value from this collection.

---

This is a slow operation that visits each value in the collection.
By default, the equality operator is `Object.equals`.

Note that `Array` does not subscribe to this interpretation of the `get` method.
For the purposes of `get`, an array behaves like a map from indexes to the
values at those indexes.

