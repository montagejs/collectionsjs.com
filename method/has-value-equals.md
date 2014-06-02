---
names:
-   has(value)
-   has(value, equals)
collections:
-   list
-   array
-   deque
---

Returns whether an equivalent value exists in this collection.

---

This is a slow operation that visits each value in the collection.
By default, the equality operator is `Object.equals`.

There is an analogous implementation provided by `Set`, `SortedSet`, and
`SortedArraySet`, but those collections have an intrisinc order and uniqueness,
so they do not support the second argument, `equals`.
This method is also distinct from the `has` method provided by maps.

For the purposes of the `has` method, an `Array` behaves like a `List`, even
though the `Array` implements `get` and `set` as if it were a `Map`.

```js
var found = [1, 2, 3].has(1);
expect(found).toBe(true);
```

