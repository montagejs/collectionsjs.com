---

name: sum(zero?)

names:
-   sum()
-   sum(zero)

see:
-   average
-   reduce

---

Returns the sum of all values in this collection.

--- |

The zero argument is the initial value to begin accumulating the sum, and
defaults to *0*.
The sum is aggregated with the plus operator, so an empty string is an equally
viable zero for a collection of strings.

