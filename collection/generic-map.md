---

name: GenericMap

usage: |
    require("collections/shim-object");
    var GenericMap = require("collections/generic-map");
    Object.addEach(MyMap.prototype, GenericMap.prototype);

inherits:
-   map-changes

methods:
-   add-each
-   get-key
-   set
-   add-value-key
-   has-key
-   delete-key
-   clear
-   reduce
-   reduce-right
-   keys
-   values
-   entries
-   equals
-   to-json

---

An abstract collection that implements many generic methods, reusable by most
maps.

--- |

