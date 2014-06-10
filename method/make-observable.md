---

name: makeObservable()

see:
-   add-range-change-listener
-   add-map-change-listener
-   add-property-change-listener

---

Makes changes observable for this collection.

--- |

Adding any kind of change listener to an object will call this method.
Various collections implement this method to activate internal change listeners
needed to propagate their own changes.
Particularly, the module `collections/listen/array-changes` installs this method
on the `Array` prototype.

Calling this method on an array will either swap its prototype with the
observable array prototype or patch observable methods on the instance.
These methods in turn translate all array changes into range changes (as all
changes can be modeled by a splice operation), map changes (as the array is a
map from index to value), and property changes (as every index is a property,
but also taking the `length` into account).

