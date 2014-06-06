---

name: MultiMap

names:
-   MultiMap()
-   MultiMap(values)
-   MultiMap(values, bucket)
-   MultiMap(values, bucket, equals, hash)

inherits:
-   map

methods:
-   set
-   bucket
-   construct-clone
-   content-equals
-   content-hash

---

A map from keys to buckets, typically arrays.

--- |

A `MultMap` is a thin layer on a `Map`.
The `getDefault` and `set` methods are overriden to ensure that there will
always be a single bucket value intrinsic to each key, always returned by `get`
and only modified by `set`.

The optional `bucket` argument overrides the `MultiMap`’s default `bucket(key)`
method, which creates a new bucketsfor a given key.
By default, this method just returns an empty array.

The optional `equals` and `hash` arguments override the `contentEquals` and
`contentHash` methods, which operate on keys of the map to find where to store
entries.

