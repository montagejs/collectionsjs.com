---

name: PropertyChanges

version: 1

usage: |
    require("collections/shim-object");
    var PropertyChanges = require("collections/listen/property-changes");
    Object.addEach(MyConstructor.prototype, PropertyChanges.prototype);

methods:
-   add-own-property-change-listener
-   add-before-own-property-change-listener
-   remove-own-property-change-listener
-   remove-before-own-property-change-listener
-   dispatch-own-property-change
-   dispatch-before-own-property-change
-   make-property-observable

---

A prototype that provides the interface for listening to and dispatching
synchronous property change notifications.

--- |

ECMAScript 5 introduces property descriptors to JavaScript.
The `Object.defineProperty` interface allows us to install `get` and `set`
methods that intercept changes to particular properties.
This allows us to watch for changes to specific methods on arbitrary objects.

The property change listener system installs property descriptors on arbitrary
objects.

Arrays are special.
You cannot add a change listener on `length`, and it would be impractical to
install change listeners on every index of an array.
The `collections/listen/array-changes` module provides an override for
[makeObservable](/method/make-observable) that instead swaps out the
implemntations of all array change *methods* and manually dispatches property
changes to each observed index and the `length`.

However, property change listeners cannot observe the effect of the `delete`
operator, because deletion changes the property descriptor.
Setting a value to `null` or `undefined` should suffice in all cases where
property change listeners are involved.

### Arbitrary objects

Objects do not need to implement the property changes interface to be
observable.
The `PropertyChanges` constructor provides alternate methods to those on the
prototype that accept the desired object as a first argument.

```js
var object = {x: 10};
function xChange(value, key, object) {}
PropertyChanges.addOwnPropertyChangeListener(object, "x", xChange);
```

### Version 2

This property changes interface is endemic to Collections version 1.
In particular, property change listeners do not receive both the old and new
value, so you must install separate change and will-change listeners if you want
to see both values.
The system will ignore duplicate requests to install a specific change listener
for a key and `beforeChange` flag, but will throw an error if you unregister
multiple times.
In version 2, we will introduce property observers which overcome these
limitations.
Particularly, in version 2, change observers have much less book-keeping (just
an array for each property and phase), allow redundant listeners, gracefully
handle redundant cancellations, and recycle the change observer objects to
reduce garbage collections.
Change observers will also compose better, allowing one change observer to be
automatically be created and cancelled depending on the value of another
observer.

