---

name: has(value, equals?)

names:
-   has(value)
-   has(value, equals)

see:
-   has-key
-   has-value

samples:
- |
    var array = [1, 2, 3];
    array.has(2);
    array.has(4);
- |
    var set = new List(["One", "TWO", "three"]);
    set.has("two", function (a, b) {
        return a.toLowerCase() === b.toLowerCase();
    });

---

Returns whether an equivalent value exists in this collection.

--- |

This is a slow operation that visits each value in the collection.
By default, the equality operator is `Object.equals`.

There is an analogous implementation provided by `Set`, `SortedSet`, and
`SortedArraySet`, but those collections have an intrisinc order and uniqueness,
so they do not support the second argument, `equals`.
This method is also distinct from the `has` method provided by maps.

For the purposes of the `has` method, an `Array` behaves like a `List`, even
though the `Array` implements `get` and `set` as if it were a `Map`.
