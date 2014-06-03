---

names:
-   addEach(values)
-   addEach(map)

collections:
-   list
-   deque
-   map
-   set
-   heap
-   dict
-   sorted-array
-   fast-set
-   lru-set
-   lfu-set
-   sorted-array-set
-   sorted-set
-   fast-map
-   lfu-map
-   lru-map
-   multi-map
-   sorted-map
-   sorted-array-map
-   array
-   object

---

Copies values or entries from another collection into this collection,
and then returns this.

--- |

If the argument is an object that implements `forEach`, for example, most
collections including `Map` and `Array`, the behavior of `addEach` varies by
whether each involved collection supports keys or indexes.

In the simple cases, values get added in order, and map entries get set in
order.

```js
var array = [1, 2, 3, 2, 3, 4];
var set = new Set();
set.addEach(array);
expect(set.toArray()).toEqual([1, 2, 3, 4]);

var map = new Map({a: 10, b: 20});
var dict = new Dict();
dict.addEach(map);
expect(dict.entries()).toEqual([["a", 10], ["b", 20]]);
```

If this collection is a map and the source is not, the source must contain key
to value entries, which will then be copied to this map in order.

```js
var list = new List([[0, "a"], [1, "b"], [2, "c"]]);
var dict = new Dict();
dict.addEach(list);
expect(dict.entries()).toEqual([["0", "a"], ["1", "b"], ["2", "c"]]);
```

If the argument is an object that has a length and that length is a number, for
example arguments or object literals masquerading as arrays, the object is
treated as a map from index to value at that index.

```js
var map = new Map();

function argue() { return arguments; }
map.addEach(argue("a, "b", "c"));
expect(map.entries()).toEqual([[0, "a"], [1, "b"], [2, "c"]]);

var list = new List();
list.addEach(argue(1, 2, 3));
expect(list.toArray()).toEqual([1, 2, 3]);

map.addEach({0: "g", 1: "h", 2: "i", length: 3});
expect(map.entries()).toEqual([[0, "g"], [1, "h"], [2, "i"]]);
```

After versions `1.1.1` and `2.0.1`, the argument may also be a string and
receive
the same treatment.

```js
map.addEach("def");
expect(map.entries()).toEqual([[0, "d"], [1, "e"], [2, "f"]]);
```

If the argument is any other kind of object, it is treated as a mapping from
property name to value, where the property name is the key.
If this collection supports keys, the keys will be preserved.

```js
var dict = new Dict();
dict.addEach({a: 10, b: 20, c: 30});
expect(dict.entries()).toEqual([["a", 10], ["b", 20], ["c", 30]]);
```

Otherwise, the values will be added to this collection in the order they appear.

```
var array = [];
array.addEach({a: 10, b: 20, c: 30});
expect(array).toEqual([10, 20, 30]);
```

Null and undefined are ignored.
Since `addEach` is an implementation detail for all collection constructors,
this allows the first argument, the values to copy upon construction, to be
elided.

At time of writing, all other values are ignored as well, but the implementors
have a free hand to throw a `TypeError` in a future version.

In addition, `Object.addEach(target, source)` behaves in the same fashion as
above except the source is used in place of the context object and is treated as
a mapping from property names to values.
Also, if the source owns a property `forEach`, it is ignored.
This makes `addEach` suitable for prototype mixins.

```js
Object.addEach(Set.prototype, GenericCollection.prototype);
```

