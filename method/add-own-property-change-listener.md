---

name: addOwnPropertyChangeListener(key, listener, beforeChange?)

version: 1

names:
-   addOwnPropertyChangeListener(key, listener)
-   addOwnPropertyChangeListener(key, listener, beforeChange)

see:
-   add-before-own-property-change-listener
-   remove-own-property-change-listener
-   dispatch-own-property-change

---

Adds a listener for an owned property with the given name.

--- |

The listener itself can be a function or a “handler” object.
The function receives the arguments, `(value, key, object)`, familiar from
iterator callbacks.
A handler object must implement a method that receives the same arguments.
The dispatcher gives precedence to the most specific handler method name.
If the name is `Value`, the preferred handler method name is
`handleValueChange`, or `handleValueWillChange` if `beforeChange` is true.
Otherwise, the dispatcher falls back to the generic `handlePropertyChange` or
`handlePropertyWillChange`.

The formula for handler method names gives precedence to the most specific name
implemented by the handler:

-   handle + **key** + Change **or** WillChange
-   handleProperty + Change **or** WillChange
-   call

To register a will-change listener, use
[addBeforeOwnPropertyChangeListener](add-before-own-property-change-listener)
and avoid using the `beforeChange` boolean argument unless it does in fact
depend on a variable with that name, for the sake of readability.

