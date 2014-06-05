---

version: v2

name: iterate()

see:
-   iterate-start-end
-   iterator

---

Iterates every value in this collection.

--- |

:warning: The `iterate` method and its notion of iterators only applies to
version 2. See [iterator][iterator] for version 1.

The `iterate` method returns an `Iterator`.

An iterator is an object that implements `next`, and though the `Iterator` provided
by collections supports a much more rich set of methods, the `next` method is
the sufficient kernel for any iterator.

The `next` method returns an iteration.
An iteration will have a `value` property signifying the next value in the
iteration.
If the iteration has passed the end of the collection, it will have a `done`
property equal to *true*.

A “done” iteration may also have a `value` but the meaning of a completion value
varies.
Completion values make the most sense for iterators returned by generator
functions.
The completion value is the value returned by the generator.
However, certain iterator functions like `forEach` will pass this completion
value through to the next iterator.

Iterators from collections may also have an `index` property, representing
either the key or the index of the value.
This library adds an `iterate` method to `Array` that supports this feature, and
supports it in every collection that tracks indexes and maps that have keys.

