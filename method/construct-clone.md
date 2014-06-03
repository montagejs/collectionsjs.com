---

name: constructClone()

names:
-   constructClone()
-   constructClone(values)

see:
-   clone

---

Creates a shallow clone of this collection.

---

`constructClone` is a utility for other generic collection methods, particularly
`clone` and `filter`.
`constructClone` must invoke its own constructor with the same parameters as
were used to construct itself, so a `Set` with a particular hash and
equality operator would produce a `Set` with the same operators.

`constructClone` will populate the copy with the given values if provided.

