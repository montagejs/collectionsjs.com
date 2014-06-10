---

name: makePropertyObservable(name)

version: 1

see:
-   add-own-property-change-listener

---

May perform internal changes necessary to dispatch property changes for a
particular name.

--- |

This method is implemented by `Array` since arrays require special consideration
to dispatch synchronous change notifications.
It can be implemented by any object to make special properties observable.

