---

name: addRangeChangeListener(listener, token?, beforeChange?)

version: 1

names:
-   addRangeChangeListener(listener)
-   addRangeChangeListener(listener, token)
-   addRangeChangeListener(listener, token, beforeChange)

see:
-   add-before-range-change-listener
-   remove-range-change-listener
-   dispatch-range-change

samples:
- |
    var array = [1, 2, 3];
    var cancel = array.addRangeChangeListener(function (plus, minus, index) {
        console.log("added:", plus, "removed:", minus, "at", index);
    });
    array.push(4);
    array.splice(1, 2, 5);

---

Adds a listener for when values are added or removed at any position.

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

The listener itself can be a function, or a “handler” object.
The function receives the arguments, `(index, plus, minus)`.
A handler object must implement a method that receives the same arguments, but
the name of the method depends on whether your change listener has a name or
“token” and whether the change listener is listening for change before or after
they take effect.

The `token` argument passed to `addRangeChangeListener` dictates the listener’s
name, and the `beforeChange` argument (true or false) determines whether the
listener is called before or after the change is reflected on the collection.

If the `token` is `"values"` and `beforeChange` is `false`, the handler method
name would be `handleValuesRangeChange`.
If `beforeChange` is `true`, the handler method would be
`handleValuesRangeWillChange`.
If there is no `token`, the handler method would be either `handleRangeChange`
or `handleRangeWillChange`.

The formula for handler method names gives precedence to the most specific name
implemented by the handler:

-   handle + **token** + Range + Change **or** WillChange
-   handleRange + Change **or** WillChange
-   call

The `collections/range-changes` module exports a range changes **mixin**.
The methods of `RangeChanges.prototype` can be copied to any collection
that needs this interface.  Its mutation methods will need to dispatch
the range changes.

To register a will-change listener, use
[addBeforeRangeChangeListener](add-before-range-change-listener) and avoid using
the `beforeChange` boolean argument unless it does in fact depend on a variable
with that name, for the sake of readability.

