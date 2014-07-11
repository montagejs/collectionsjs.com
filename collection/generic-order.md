---

name: GenericOrder

usage: |
    require("collections/shim-object");
    var GenericOrder = require("collections/generic-order");
    Object.addEach(MyOrder.prototype, GenericOrder.prototype);

methods:
-   equals
-   compare
-   to-json

---

An abstract collection that implements generic methods that can be used by any
collection that keeps its values in a meaningful order.

--- |

