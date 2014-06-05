---

name: deleteEach(values|keys, equals?)

names:
-   deleteEach(values)
-   deleteEach(values, equals)
-   deleteEach(keys)
-   deleteEach(keys, equals)

todo:
-   consider breaking this into versions for each of the kinds of delete

---

Deletes every value or every value for each key.
Returns the number of successful deletions.

--- |

If provided an `equals` argument, it will forward that operator to the
underlying `delete` implementation, which may or may not be appropriate
depending on the collection.

