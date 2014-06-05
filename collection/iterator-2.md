---

name: Iterator

version: v2

see:
-   iterator

---

Produces values in order on demand.

--- |

:warning: Version 2 iterators differ substantially from version 1.
This is a description of iterators for version 2, which are on track for the
next version of JavaScript.

An iterator an object with a `next` method that returns iterations.
An `Iterator` is a kind of iterator with additional methods which can wrap any
existing iterator or be constructed by an iterable.

An iterable is an object that implements `iterate`.
Collections that implement `iterate` return `Iterator` instances.

An iteration corresponds to either yielding a value, or returning a value when
the iterator has been exhausted.
A yield iteration has a `value` property and a falsy `done` property.
A return iteration has truthy `done` property and may have a `value`.

In addition, an `Iteration` from an `Iterator` may have an `index` property,
which refers to either the index or key for the value from the collection that
produced the iteration, or the index of the iteration produced by the iterator
itself.

