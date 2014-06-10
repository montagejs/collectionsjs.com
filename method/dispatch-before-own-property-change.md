
---

name: dispatchBeforeOwnPropertyChange(key, value)

version: 1

see:
-   dispatch-own-property-change
-   add-own-property-change-listener

---

Informs property change listeners that the value for a property name will
change.

--- |

This method is particularly useful for cases where there is a computed property,
defined by a getter, that can change behind the scenes, without assigning to the
property itself.
Such types must manually dispatch the property change at the point the computed
property changes.

