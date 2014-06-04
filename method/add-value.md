---

name: add(value)

---

Adds a value to a collection.

--- |

Ignores the operation if the value already exists within a set.
Regardless of the collection, returns whether the value was in fact added to the
set.

Generic collection methods often invoke this method as `add(value, key)` or
`add(value, index)`, in which case these collections ignore the second argument.
The genericity of `add` allows generic methods like `addEach`, `filter`, and
`clone` to use the same treatment for sets and maps, where the key or index may
or may not be meaningful.
Consider the implementation of filter.

```js
GenericCollection.prototype.filter = function (callback /*, thisp*/) {
    var thisp = arguments[1];
    var result = this.constructClone();
    this.reduce(function (undefined, value, key, object, depth) {
        if (callback.call(thisp, value, key, object, depth)) {
            result.add(value, key);
        }
    }, void 0);
    return result;
};
```

The result will have the same type as this collection, which may be a map or a
set for example, because each of these have a `constructClone()` method that
will return an instance of their own type.
If the collection is a set, the keys will be meaningless and ignored.
If the collection is a map, the resulting map will have the entries, both key
and value, of the original map, except those for do not pass the test.

