
names:
-   deleteEach(values)
-   deleteEach(values, equals)
-   deleteEach(keys)
-   deleteEach(keys, equals)

collections:
-   array
-   list
-   deque
-   set
-   map
-   multi-map
-   sorted-set
-   sorted-map
-   lru-set
-   lru-map
-   lfu-set
-   lfu-map
-   sorted-array
-   sorted-array-set
-   sorted-array-map
-   fast-set
-   fast-map
-   dict
-   heap

todo:
-   consider breaking this into versions for each of the kinds of delete

---

Deletes every value or every value for each key.
Returns the number of successful deletions.

---

If provided an `equals` argument, it will forward that operator to the
underlying `delete` implementation, which may or may not be appropriate
depending on the collection.

