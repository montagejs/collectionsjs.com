---

name: toJSON()

samples:
- |
    var map = new Map();
    map.set({a: 1}, 10);
    map.set({b: 2}, 20);
    var json = JSON.stringify(map);
    var newMap = new Map(JSON.parse(json));
    newMap.entries();

---

Used by `JSON.stringify` to create a JSON representation of the collection.

--- |

For most maps this is equivalent to `entries()`, except `Dict` which returns an Object. For sets this is equivalent to `toArray()`.

A collection can be revived by passing the `JSON.parse`d value back into the collection's constructor.

It is important to note that only the collection's contents are serialized to JSON. It is up to you to ensure that when you revive the collection you restore other constraints such as the `equals`, `hash`, or `getDefault` functions.

