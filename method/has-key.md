---

name: has(key)

see:
-   has-value
-   has-value-equals

samples:
- |
    var dict = new Dict({a: 1, b: 2});
    dict.has("b");
    dict.has("c");

---

Returns whether an entry with the given key exists in a `Map`.

--- |

