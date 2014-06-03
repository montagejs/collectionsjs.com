---

name: add(value, key)

---

Adds a value for a given key to a map.

---

This is an alias for `set(key, value)` that does not have an obvious reason to
exist.
The purpose of this method is to allow certain generic collection methods
including `addEach`, `filter`, and `clone`, to treat sets and maps in the same
fashion, without regard for whether the keys are or not meaningful for the
collection.
For example, sets implement `add(value)`, but maps implement `add(value, key)`.
Iterating a `List` provides meaningful indexes that can be used for keys if they
are converted to maps.
Consider this excerpt from `addEach(values)` for generic collections.

```js
values.forEach(this.add, this);
```

This copies values from an abitrary collection into this one.
Regardless of whether this collection is a map or a set, and whether the values
come from a map or a set, `add` is able to bridge the gap.
This is particularly important since `addEach(values)` is the last operation of
every collection constructor.

