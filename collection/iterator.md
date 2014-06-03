---

see:
-   iterator-2

names:
-   Iterator(iterable)
-   Iterator(iterator)
-   Iterator(next)

mixin:
-   for-each
-   map
-   filter
-   every
-   some
-   any
-   all
-   min
-   max
-   sum
-   average
-   flatten
-   zip
-   enumerate
-   sorted
-   group
-   reversed
-   to-array
-   to-object
-   iterator
-   iterate

methods:
-   construct-clone
-   map-iterator
-   filter-iterator
-   reduce
-   concat
-   drop-while
-   take-while
-   zip-iterator
-   enumerate-iterator

constructor-methods:
-   iterator-iterate
-   iterator-cycle
-   iterator-concat
-   iterator-unzip
-   iterator-zip
-   iterator-chain
-   iterator-range
-   iterator-count
-   iterator-repeat

---

Produces values in order on demand.

--- |

:warning: Version 2 iterators differ substantially from version 1.
This is a description of iterators from version 1, which tracked an earlier
version of the ECMAScript iterator proposal.

An iterator is an object with a `next` method that returns the next value for
the iterator, or throws `StopIteration`, a global sentinel object for all
iterators.
`ReturnValue` is a global constructor for instances that inherit from
`StopIteration` used to stop an iterator with a return value, particularly
useful for generators.
The `iterator` module shims these globals if they do not already exist.

An iterable is an object that implements `iterator`.
Collections that implement `iterator` may return either an iterator or an
`Iterator`.
`Iterator` supports additional methods beyond `next`.

