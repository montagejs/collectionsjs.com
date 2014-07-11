---

name: GenericSet

usage: |
    require("collections/shim-object");
    var GenericSet = require("collections/generic-set");
    Object.addEach(MySet.prototype, GenericSet.prototype);

methods:
-   union
-   intersection
-   difference
-   symmetric-difference
-   equals
-   contains
-   remove
-   toggle
-   delete-all
-   to-json

---

An abstract collection that implements many generic methods, reusable by most
sets.

--- |

