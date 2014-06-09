---

name: Dict

names:
-   Dict()
-   Dict(entries)
-   Dict(map)

inherits:
-   generic-collection
-   generic-map
-   property-changes
-   observable-object

methods:
-   get-key
-   set
-   has-key
-   delete-key
-   dict-assert-string
-   clear
-   reduce
-   reduce-right
-   one
-   construct-clone

samples:
- |
    var dict = new Dict({a: 1}, function (key) {
        return "default: " + key;
    });
    dict.get("a");
    dict.get("b");

---

A mapping from string keys to values.

--- |

A dictionary is a specialized `map`.
The keys are required to be strings.
With this constraint in place, the mapping can make many simplifying assumptions
and use a plain JavaScript object as its backing store.

```js
var Dict = require("collections/dict");
var dict = new Dict();
```

The `new` keyword is optional.

The optional first argument of the dictionary constructor is an object to copy
into the dictionary initially.
The value to copy may be...

-   An object literal
-   Any map-like collection with strings for keys
-   Any other kind of collection containing [key, value] pairs.

The optional second argument of the constructor is a `getDefault(key)` function.
This function will be called as a method of the dictionary if the value for a
given key does not exist when a user calls `get(key)`.

```js
var dict = new Dict(null, function (key) {
    return this.get(key.slice(0, key.length - 1));
});
dict.set("a", 10);
expect(dict.get("abcdefg")).toBe(10);
```

