---

name: scan(index, default)

---

An internal utility of `List` coercing indexes to nodes.

---

Returns the `index` if it is a node.
Returns the `default` if the index is not defined.
Otherwise, scans to the given index.
The index may be negative, in which case it will scan backward from the head
node.

