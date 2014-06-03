---

name: clone()

names:
-   clone()
-   clone(null, memo)
-   clone(depth)
-   clone(depth, memo)

see:
-   construct-clone

---

Creates a deep replica of this collection.

---

Clones values deeply, to the specified depth, using the memo map to connect
reference cycles.

The default depth is `Infinity`, in which case, clone will explore every
transitive reference of this object graph, producing a mirror image in the clone
graph.
A depth of *1* signifies a shallow clone, and a depth of *0* signifies no clone
at all and this collection returns itself.

The memo is only required to implement `has` and `set`, and accept arbitrary
objects for keys.
`Map` is sufficient and can be thrown away immediately to recover memory.
The map can however serve a secondary purpose of being able to look up an object
in the clone graph by its corresponding object in this graph.
A memo can also be primed with pre-determined replicas of certain objects,
particularly useful for non-clonable objects, or to extend an existing clone
graph.
The default memo may be a `Map` or `WeakMap`.

Clone will delegate to objects that implement the `clone` method, passing the
next depth and the memo.
Clone replicates object literals that inherit directly from *Object.prototype*
or *null*.
However, if an object does is not clonable, `clone` will throw a `TypeError`.

Though `clone` can and should be overridden for specific types, it should be
consumed through `Object.clone`, which handles the default depth and memo cases,
so clone methods do not need to.

