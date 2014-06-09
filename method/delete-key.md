---

name: delete(key)
samples:
- |
    var map = new Map({a: 10});
    map.toObject();
    map.delete("a");
    map.toObject();
    map.delete("a");
---

Deletes the value for a given key.
Returns whether the key was found and successfully deleted.

--- |

