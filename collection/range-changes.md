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

Every change to an array, or any flat collection of values, can model any
content change as a values added or removed at a particular index.

Every method that changes an array can be implemented in terms of `splice(index,
length, ...values)`.
For example, every time you `set(index, value)` on an array, it can be modeled
as `splice(index, 1, value)`.
Every time you push a value onto an array, it can be modeled as `splice(length,
0, value)`.
Every time you shift a value off an array, it cam be modeled as `splice(0, 1)`.
Each of these changes can be communicated with a single message, `(index, plus,
minus)`: the index of the change, the values removed after that index, then the
values that were added after that index, in that order.

Range change listeners receive such messages synchronously, as the array
changes.

