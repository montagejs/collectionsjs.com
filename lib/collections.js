require("collections/shim-object");
require("collections/shim-array");

window.List = require("collections/list");
window.Map = require("collections/map");
window.FastMap = require("collections/fast-map");
window.LruMap = require("collections/lru-map");
window.LfuMap = require("collections/lfu-map");
window.SortedMap = require("collections/sorted-map");
window.SortedArrayMap = require("collections/sorted-array-map");
window.Dict = require("collections/dict");
window.MultiMap = require("collections/multi-map");
window.WeakMap = require("collections/weak-map");
window.Deque = require("collections/deque");
window.Set = require("collections/set");
window.FastSet = require("collections/fast-set");
window.LruSet = require("collections/lru-set");
window.LfuSet = require("collections/lfu-set");
window.SortedSet = require("collections/sorted-set");
window.SortedArraySet = require("collections/sorted-array-set");
window.SortedArray = require("collections/sorted-array");
window.Heap = require("collections/heap");
window.Iterator = require("collections/iterator");


var repl = require("./repl");

var repls = document.querySelectorAll(".repl");
for (var i = 0; i < repls.length; i++) {
    repl(repls[i]);
}

