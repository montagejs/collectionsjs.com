---

name: group(callback, thisp?, equals?)

names:
-   group(callback)
-   group(callback, thisp)
-   group(callback, thisp, equals)

see:
-   reduce
-   for-each
-   map
-   filter
-   group

todo:
-   expand this documentation, significantly

---

Returns an array of *[key, class]* entries where every value from the collection
is placed into the same equivalence class if they return the same key through
the given callback.

--- |

The given callback receives the value for each entry, the key or index, and the
collection itself.

