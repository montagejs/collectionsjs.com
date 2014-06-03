---

collections:
-   map
-   fast-map
-   lfu-map
-   lru-map
-   multi-map
-   sorted-array-map
-   weak-map

---

A map is the interface of a lookup table.
The methods intrinsic to a map are `get(key)`, `set(key, value)`, `has(key)`,
and `delete(key)`.

All maps are iterable and reducible, but vary in one detail.
The callback receives the value for each key, and unlike with an `Array`, the
key takes the place of the index.

```js
var map = Map({a: 10});

map.forEach(function (value, key) {
    expect(key).toBe("a");
    expect(value).toBe(10);
})

var iterator = map.iterate();
var iteration = iterator.next();
expect(iteration.value).toBe(10);
expect(iteration.index).toBe("a");
```

All maps can be identified by their `isMap` property.

All maps are backed by an analogous set of key and value entries.
The map implementation overrides the intrinsic operators for the internal
`store` set — like `equals`, `compare`, and `hash` — to consider only the key in
determining equivalence, order, and uniqueness for each entry, as applicable.
All maps share most of their implementation through a `GenericMap` abstract
collection.

By virtue of implementation reuse, all maps are also observable.
However, the observer implementation varies significantly between versions 1 and
2.

