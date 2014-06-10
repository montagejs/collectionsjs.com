---

name: dispatchOwnPropertyChange(key, value, beforeChange?)

version: 1

names:
-   dispatchOwnPropertyChange(key, value)
-   dispatchOwnPropertyChange(key, value beforeChange)

see:
-   add-own-property-change-listener
-   dispatch-before-own-property-change

---

Informs property change listeners that the value for a property name has
changed.

--- |

This method is particularly useful for cases where there is a computed property,
defined by a getter, that can change behind the scenes, without assigning to the
property itself.
Such types must manually dispatch the property change at the point the computed
property changes.

