---

name: GenericCollection

usage: |
    require("collections/shim-object");
    var GenericCollection = require("collections/generic-collection");
    Object.addEach(MyCollection.prototype, GenericCollection.prototype);

methods:
-   add-each
-   delete-each
-   for-each
-   map
-   enumerate
-   group
-   to-array
-   to-object
-   filter
-   every
-   some
-   all
-   any
-   min
-   max
-   sum
-   average
-   concat
-   flatten
-   zip
-   join
-   sorted
-   reversed
-   clone
-   only
-   iterator

---

An abstract collection that implements many generic methods, reusable by most
collections.

--- |

