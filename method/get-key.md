---
names:
-   get(key)
-   get(key, default)
-   get(index)
-   get(index, default)
collections:
-   map
-   sorted-map
-   sorted-array-map
-   weak-map
-   array
-   object
---

Gets the value for a key in a map.

---

If there is no entry with the request key, and the user calls `get` with a
second argument *even if that argument is undefined*, the second argument will
be returned instead.
Otherwise, `get` will return the result of `getDefault(key)`, which itself
defaults to returning undefined.

Every map implementation gives an opportunity to override `getDefault` through
the constructor, but it can always be overridden on either the instance or the
prototype.
It is often useful to provide a `getDefault` that will create, save, and return
a default instance for a given key.

```js
var users = new Dict();
users.getDefault = function (id) {
    var user = new User(id);
    this.set(id, user);
    return user;
};
```

For the purposes of the `get` and `set` methods, an `Array` behaves like a map
from index to the value at that index.

```js
var value = [1, 2, 3].get(1);
expect(value).toBe(2);
```

In contrast, for the purposes of the `has` method, an `Array` behaves as a list
of values.

```js
var found = [1, 2, 3].has(1);
expect(found).toBe(true);
```

