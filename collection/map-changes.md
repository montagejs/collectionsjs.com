---

name: MapChanges

version: 1

usage: |
    require("collections/shim-object");
    var MapChange = require("collections/listen/map-changes");
    Object.addEach(MyMap.prototype, MapChange.prototype);

methods:
-   add-map-change-listener
-   add-before-map-change-listener
-   remove-map-change-listener
-   remove-before-map-change-listener
-   dispatch-map-change
-   dispatch-before-map-change

---

An abstract collection that provides the interface for listening to and
dispatching notifications when the value for a key changes and when entries are
added or removed.

