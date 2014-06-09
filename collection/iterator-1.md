---

name: Iterator

version: v1

see:
-   iterator-2

usage: |
    var Iterator = require("collections/iterator");

names:
-   Iterator(iterable)
-   Iterator(iterator)
-   Iterator(next)

mixin:
-   generic-collection/for-each
-   generic-collection/map
-   generic-collection/filter
-   generic-collection/every
-   generic-collection/some
-   generic-collection/any
-   generic-collection/all
-   generic-collection/min
-   generic-collection/max
-   generic-collection/sum
-   generic-collection/average
-   generic-collection/flatten
-   generic-collection/zip
-   generic-collection/enumerate
-   generic-collection/sorted
-   generic-collection/group
-   generic-collection/reversed
-   generic-collection/to-array
-   generic-collection/to-object
-   generic-collection/iterator

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

