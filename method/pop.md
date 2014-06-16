---

name: pop()

very-fast:
-   array
-   deque
-   list
-   heap
-   sorted-set

see:
-   push
-   shift
-   peek-back

samples:
- |
    var array = [1, 2, 3];
    array.pop();
    array
- |
    var heap = new Heap([2, 8, 5]);
    heap.pop();
    heap.toArray();

---

Removes a value from the end of a collection, and returns that value.

--- |

For a `SortedSet` and a `Heap`, this is equivalent to removing the maximum value
of the collection.

