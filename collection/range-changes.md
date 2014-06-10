---

name: RangeChanges

version: 1

usage: |
    require("collections/shim-object");
    var RangeChange = require("collections/listen/range-changes");
    Object.addEach(MyRange.prototype, RangeChange.prototype);

methods:
-   add-range-change-listener
-   add-before-range-change-listener
-   remove-range-change-listener
-   remove-before-range-change-listener
-   dispatch-range-change
-   dispatch-before-range-change

---

An abstract collection that provides the interface for listening to and
dispatching notifications when values are removed then added at an index.

--- |

