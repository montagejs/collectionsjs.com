---

name: hash(value)

see:
-   equals
-   compare

---

Consistently returns the same string for the same object.

---

To support maps and sets in advance of the `Map` and `Set` soon to be provided
by JavaScript, `hash` allows us to emulate these collections.
The `Object.hash` algorithm depends on a `WeakMap` shim to assign random
consistent hashes to objects.

In other languages, the hash function would return an integer since it would be
used to index into an array.
In JavaScript, more ready access to a hash table exists through objects, so
`hash` must return strings suitable for property names.

Because arrays are also used as tuples, the consistent hash takes into account
the array’s content, so equivalent tuples will return the same consistent hash.
This allows tuples to be used in sets and map keys, provided they are not
modified.

