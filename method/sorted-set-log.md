---

---

Writes a tree describing the internal state of the sorted set splay tree.

--- |

`charmap` is an object that notes which characters to use to draw
lines.  By default, this is the `TreeLog.unicodeRound` property from the
`tree-log` module.  `TreeLog.unicodeSharp` and `TreeLog.ascii` are
alternatives.  The properties are:

-   intersection: ╋
-   through: ━
-   branchUp: ┻
-   branchDown: ┳
-   fromBelow: ╭
-   fromAbove: ╰
-   fromBoth: ┣
-   strafe: ┃

`callback` is a customizable function for rendering each node of the tree.
By default, it just writes the value of the node.  It accepts the node and
a writer functions.  The `write` function produces the line on which the
node joins the tree, and each subsequent line.  The `writeAbove` function
can write lines before the branch.

`log` and `logger` default to `console.log` and `console`.  To write
the representation to an array instead, they can be `array.push` and
`array`.

