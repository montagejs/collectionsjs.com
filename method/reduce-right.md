---

see:
-   reduce

---

Aggregates every value in this collection, from right to left.

---

The callback argument is a function that will accept the result collected so
far, the value for each entry, the key or index, and the collection itself.
Its return value will become the new accumulated result.
`reduceRight` will return the accumulated result upon visiting every index.

The second argument is a `basis`, the aggregate result before any value has been
visited, and the ultimate result if this collection is empty.

The `Array` implementation establishes a precedent that the basis should be
optional.
If the user provides no basis and the collection is empty, `reduceRight` throws
an error.
However, at time of writing, all other collections in this library require an
initial `basis`.
This is a shortcoming that should be rectified in version 2.

If this collection is an array with holes, those entries will not be visited.

