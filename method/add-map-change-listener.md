---

name: addMapChangeListener(listener, token?, beforeChange?)

version: 1

names:
-   addMapChangeListener(listener)
-   addMapChangeListener(listener, token)
-   addMapChangeListener(listener, token, beforeChange)

see:
-   add-before-map-change-listener
-   remove-map-change-listener
-   dispatch-map-change

---

Adds a listener for when the value for a key changes, or when entries are added
or removed.

--- |

When the value for a key *changes*, maps will first dispatch a *map will change*
notification with the old value followed by a *map change* event with the new
value.
When a new entry gets *added* to a map, it will first dispatch a *map will
change* with undefined, followed by the *map change* with the initial value.
When an existing entry is *deleted* from a map, it will first dispatch a *map
will change* with the current value, followed by a *map change* with undefined.

As such, it is not possible to distinguish an undefined value from a
non-existant value, and it is not possible to capture both the new and old value
with a single listener.
These problems are addressed in version 2 with a new `observeMapChange`
interface.

Map change listeners receive such messages synchronously, as the map changes.

The listener itself can be a function, or a “handler” object.
A map change listener function `(value, key, map)`, the same argument pattern
familiar from iterator callbacks.

A handler object must implement a method that receives the same arguments, but
the name of the method depends on whether your change listener has a name or
“token” and whether the change listener is listening for change before or after
they take effect.

The `token` argument passed to `addMapChangeListener` dictates the listener’s
name, and the `beforeChange` argument (true or false) determines whether the
listener is called before or after the change is reflected on the collection.

If the `token` is `"values"` and `beforeChange` is `false`, the handler method
name would be `handleValuesMapChange`.
If `beforeChange` is `true`, the handler method would be
`handleValuesMapWillChange`.
If there is no `token`, the handler method would be either `handleMapChange`
or `handleMapWillChange`.

The formula for handler method names gives precedence to the most specific name
implemented by the handler:

-   handle + **token** + Map + Change **or** WillChange
-   handleMap + Change **or** WillChange
-   call

The `collections/map-changes` module exports a map changes **mixin**.
The methods of `MapChanges.prototype` can be copied to any collection
that needs this interface.  Its mutation methods will need to dispatch
the map changes.

To register a will-change listener, use
[addBeforeMapChangeListener](add-before-map-change-listener) and avoid using
the `beforeChange` boolean argument unless it does in fact depend on a variable
with that name, for the sake of readability.

