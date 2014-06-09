global = this;

(function (modules) {

    // Bundle allows the run-time to extract already-loaded modules from the
    // boot bundle.
    var bundle = {};

    // Unpack module tuples into module objects.
    for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        modules[i] = new Module(module[0], module[1], module[2], module[3]);
        bundle[module[0]] = bundle[module[1]] || {};
        bundle[module[0]][module[1]] = module;
    }

    function Module(name, id, map, factory) {
        // Package name and module identifier are purely informative.
        this.name = name;
        this.id = id;
        // Dependency map and factory are used to instantiate bundled modules.
        this.map = map;
        this.factory = factory;
    }

    Module.prototype.getExports = function () {
        var module = this;
        if (module.exports === void 0) {
            module.exports = {};
            var require = function (id) {
                var index = module.map[id];
                var dependency = modules[index];
                if (!dependency)
                    throw new Error("Bundle is missing a dependency: " + id);
                return dependency.getExports();
            }
            module.exports = module.factory(require, module.exports, module) || module.exports;
        }
        return module.exports;
    };

    // Communicate the bundle to all bundled modules
    Module.prototype.bundle = bundle;

    return modules[0].getExports();
})((function (global){return[["collections-website","lib/collections",{"collections/shim-object":26,"collections/shim-array":24,"collections/list":13,"collections/map":20,"collections/fast-map":3,"collections/lru-map":18,"collections/lfu-map":11,"collections/sorted-map":31,"collections/sorted-array-map":29,"collections/dict":2,"collections/multi-map":21,"collections/weak-map":35,"collections/deque":1,"collections/set":22,"collections/fast-set":4,"collections/lru-set":19,"collections/lfu-set":12,"collections/sorted-set":32,"collections/sorted-array-set":30,"collections/sorted-array":28,"collections/heap":9,"collections/iterator":10,"./repl":34},function (require, exports, module){

// collections-website lib/collections
// -----------------------------------

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
}],["collections","deque",{"./shim-object":26,"./generic-collection":5,"./generic-order":7,"./listen/range-changes":17},function (require, exports, module){

// collections deque
// -----------------

"use strict";

require("./shim-object");
var GenericCollection = require("./generic-collection");
var GenericOrder = require("./generic-order");
var GenericOrder = require("./generic-order");
var RangeChanges = require("./listen/range-changes");

// by Petka Antonov
// https://github.com/petkaantonov/deque/blob/master/js/deque.js
// Deque specifically uses
// http://en.wikipedia.org/wiki/Circular_buffer#Use_a_Fill_Count
// 1. Incrementally maintained length
// 2. Modulus avoided by using only powers of two for the capacity

module.exports = Deque;
function Deque(values, capacity) {
    if (!(this instanceof Deque)) {
        return new Deque(values, capacity);
    }
    this.capacity = this.snap(capacity);
    this.init();
    this.length = 0;
    this.front = 0;
    this.addEach(values);
}

Object.addEach(Deque.prototype, GenericCollection.prototype);
Object.addEach(Deque.prototype, GenericOrder.prototype);
Object.addEach(Deque.prototype, RangeChanges.prototype);

Deque.prototype.maxCapacity = (1 << 30) | 0;
Deque.prototype.minCapacity = 16;

Deque.prototype.constructClone = function (values) {
    return new this.constructor(values, this.capacity)
};

Deque.prototype.add = function (value) {
    this.push(value);
};

Deque.prototype.push = function (value /* or ...values */) {
    var argsLength = arguments.length;
    var length = this.length;

    if (this.dispatchesRangeChanges) {
        var plus = new Array(argsLength);
        for (var argIndex = 0; argIndex < argsLength; ++argIndex) {
            plus[argIndex] = arguments[argIndex];
        }
        var minus = [];
        this.dispatchBeforeRangeChange(plus, minus, length);
    }

    if (argsLength > 1) {
        var capacity = this.capacity;
        if (length + argsLength > capacity) {
            for (var argIndex = 0; argIndex < argsLength; ++argIndex) {
                this.ensureCapacity(length + 1);
                var j = (this.front + length) & (this.capacity - 1);
                this[j] = arguments[argIndex];
                length++;
                this.length = length;
            }
        }
        else {
            var j = this.front;
            for (var argIndex = 0; argIndex < argsLength; ++argIndex) {
                this[(j + length) & (capacity - 1)] = arguments[argIndex];
                j++;
            }
            this.length = length + argsLength;
        }

    } else if (argsLength === 1) {
        this.ensureCapacity(length + 1);
        var index = (this.front + length) & (this.capacity - 1);
        this[index] = value;
        this.length = length + 1;
    }

    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange(plus, minus, length);
    }

    return this.length;
};

Deque.prototype.pop = function () {
    var length = this.length;
    if (length === 0) {
        return;
    }
    var index = (this.front + length - 1) & (this.capacity - 1);
    var result = this[index];

    if (this.dispatchesRangeChanges) {
        this.dispatchBeforeRangeChange([], [result], length - 1);
    }

    this[index] = void 0;
    this.length = length - 1;

    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([], [result], length - 1);
    }

    return result;
};

Deque.prototype.shift = function () {
    if (this.length !== 0) {
        var front = this.front;
        var result = this[front];

        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([], [result], 0);
        }

        this[front] = void 0;
        this.front = (front + 1) & (this.capacity - 1);
        this.length--;

        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([], [result], 0);
        }

        return result;
    }
};

Deque.prototype.unshift = function (value /* or ...values */) {
    var length = this.length;
    var argsLength = arguments.length;

    if (this.dispatchesRangeChanges) {
        var plus = new Array(argsLength);
        for (var argIndex = 0; argIndex < argsLength; ++argIndex) {
            plus[argIndex] = arguments[argIndex];
        }
        var minus = [];
        this.dispatchBeforeRangeChange(plus, minus, 0);
    }

    if (argsLength > 1) {
        var capacity = this.capacity;
        if (length + argsLength > capacity) {
            for (var argIndex = argsLength - 1; argIndex >= 0; argIndex--) {
                this.ensureCapacity(length + 1);
                var capacity = this.capacity;
                var index = (
                    (
                        (
                            ( this.front - 1 ) &
                            ( capacity - 1)
                        ) ^ capacity
                    ) - capacity
                );
                this[index] = arguments[argIndex];
                length++;
                this.front = index;
                this.length = length;
            }
        } else {
            var front = this.front;
            for (var argIndex = argsLength - 1; argIndex >= 0; argIndex--) {
                var index = (
                    (
                        (
                            (front - 1) &
                            (capacity - 1)
                        ) ^ capacity
                    ) - capacity
                );
                this[index] = arguments[argIndex];
                front = index;
            }
            this.front = front;
            this.length = length + argsLength;
        }
    } else if (argsLength === 1) {
        this.ensureCapacity(length + 1);
        var capacity = this.capacity;
        var index = (
            (
                (
                    (this.front - 1) &
                    (capacity - 1)
                ) ^ capacity
            ) - capacity
        );
        this[index] = value;
        this.length = length + 1;
        this.front = index;
    }

    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange(plus, minus, 0);
    }

    return this.length;
};

Deque.prototype.clear = function () {
    this.length = 0;
    this.front = 0;
    this.init();
};

Deque.prototype.ensureCapacity = function (capacity) {
    if (this.capacity < capacity) {
        this.grow(this.snap(this.capacity * 1.5 + 16));
    }
};

Deque.prototype.grow = function (capacity) {
    var oldFront = this.front;
    var oldCapacity = this.capacity;
    var oldContent = new Array(oldCapacity);
    var length = this.length;

    copy(this, 0, oldContent, 0, oldCapacity);
    this.capacity = capacity;
    this.init();
    this.front = 0;
    if (oldFront + length <= oldCapacity) {
        // Can perform direct linear copy.
        copy(oldContent, oldFront, this, 0, length);
    } else {
        // Cannot perform copy directly, perform as much as possible at the
        // end, and then copy the rest to the beginning of the buffer.
        var lengthBeforeWrapping = length - ((oldFront + length) & (oldCapacity - 1));
        copy(oldContent, oldFront, this, 0, lengthBeforeWrapping);
        copy(oldContent, 0, this, lengthBeforeWrapping, length - lengthBeforeWrapping);
    }
};

Deque.prototype.init = function () {
    for (var index = 0; index < this.capacity; ++index) {
        this[index] = "nil"; // TODO void 0
    }
};

Deque.prototype.snap = function (capacity) {
    if (typeof capacity !== "number") {
        return this.minCapacity;
    }
    return pow2AtLeast(
        Math.min(this.maxCapacity, Math.max(this.minCapacity, capacity))
    );
};

Deque.prototype.one = function () {
    if (this.length > 0) {
        return this[this.front];
    }
};

Deque.prototype.peek = function () {
    if (this.length === 0) {
        return;
    }
    return this[this.front];
};

Deque.prototype.poke = function (value) {
    if (this.length === 0) {
        return;
    }
    this[this.front] = value;
};

Deque.prototype.peekBack = function () {
    var length = this.length;
    if (length === 0) {
        return;
    }
    var index = (this.front + length - 1) & (this.capacity - 1);
    return this[index];
};

Deque.prototype.pokeBack = function (value) {
    var length = this.length;
    if (length === 0) {
        return;
    }
    var index = (this.front + length - 1) & (this.capacity - 1);
    this[index] = value;
};

Deque.prototype.get = function (index) {
    // Domain only includes integers
    if (index !== (index | 0)) {
        return;
    }
    // Support negative indicies
    if (index < 0) {
        index = index + this.length;
    }
    // Out of bounds
    if (index < 0 || index >= this.length) {
        return;
    }
    return this[(this.front + index) & (this.capacity - 1)];
};

Deque.prototype.indexOf = function (value, index) {
    // Default start index at beginning
    if (index == null) {
        index = 0;
    }
    // Support negative indicies
    if (index < 0) {
        index = index + this.length;
    }
    // Left to right walk
    var mask = this.capacity - 1;
    for (; index < this.length; index++) {
        var offset = (this.front + index) & mask;
        if (this[offset] === value) {
            return index;
        }
    }
    return -1;
};

Deque.prototype.lastIndexOf = function (value, index) {
    // Default start position at the end
    if (index == null) {
        index = this.length - 1;
    }
    // Support negative indicies
    if (index < 0) {
        index = index + this.length;
    }
    // Right to left walk
    var mask = this.capacity - 1;
    for (; index >= 0; index--) {
        var offset = (this.front + index) & mask;
        if (this[offset] === value) {
            return index;
        }
    }
    return -1;
}

// TODO rename findValue
Deque.prototype.find = function (value, equals, index) {
    equals = equals || Object.equals;
    // Default start index at beginning
    if (index == null) {
        index = 0;
    }
    // Support negative indicies
    if (index < 0) {
        index = index + this.length;
    }
    // Left to right walk
    var mask = this.capacity - 1;
    for (; index < this.length; index++) {
        var offset = (this.front + index) & mask;
        if (equals(value, this[offset])) {
            return index;
        }
    }
    return -1;
};

// TODO rename findLastValue
Deque.prototype.findLast = function (value, equals, index) {
    equals = equals || Object.equals;
    // Default start position at the end
    if (index == null) {
        index = this.length - 1;
    }
    // Support negative indicies
    if (index < 0) {
        index = index + this.length;
    }
    // Right to left walk
    var mask = this.capacity - 1;
    for (; index >= 0; index--) {
        var offset = (this.front + index) & mask;
        if (equals(value, this[offset])) {
            return index;
        }
    }
    return -1;
};

Deque.prototype.has = function (value, equals) {
    equals = equals || Object.equals;
    // Left to right walk
    var mask = this.capacity - 1;
    for (var index = 0; index < this.length; index++) {
        var offset = (this.front + index) & mask;
        if (this[offset] === value) {
            return true;
        }
    }
    return false;
};

Deque.prototype.reduce = function (callback, basis /*, thisp*/) {
    // TODO account for missing basis argument
    var thisp = arguments[2];
    var mask = this.capacity - 1;
    for (var index = 0; index < this.length; index++) {
        var offset = (this.front + index) & mask;
        basis = callback.call(thisp, basis, this[offset], index, this);
    }
    return basis;
};

Deque.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    // TODO account for missing basis argument
    var thisp = arguments[2];
    var mask = this.capacity - 1;
    for (var index = this.length - 1; index >= 0; index--) {
        var offset = (this.front + index) & mask;
        basis = callback.call(thisp, basis, this[offset], index, this);
    }
    return basis;
};

function copy(source, sourceIndex, target, targetIndex, length) {
    for (var index = 0; index < length; ++index) {
        target[index + targetIndex] = source[index + sourceIndex];
    }
}

function pow2AtLeast(n) {
    n = n >>> 0;
    n = n - 1;
    n = n | (n >> 1);
    n = n | (n >> 2);
    n = n | (n >> 4);
    n = n | (n >> 8);
    n = n | (n >> 16);
    return n + 1;
}

}],["collections","dict",{"./shim":23,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"dict":2},function (require, exports, module){

// collections dict
// ----------------

"use strict";

var Shim = require("./shim");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

// Burgled from https://github.com/domenic/dict

module.exports = Dict;
function Dict(values, getDefault) {
    if (!(this instanceof Dict)) {
        return new Dict(values, getDefault);
    }
    getDefault = getDefault || Function.noop;
    this.getDefault = getDefault;
    this.store = {};
    this.length = 0;
    this.addEach(values);
}

Dict.Dict = Dict; // hack so require("dict").Dict will work in MontageJS.

function mangle(key) {
    return "~" + key;
}

function unmangle(mangled) {
    return mangled.slice(1);
}

Object.addEach(Dict.prototype, GenericCollection.prototype);
Object.addEach(Dict.prototype, GenericMap.prototype);
Object.addEach(Dict.prototype, PropertyChanges.prototype);

Dict.prototype.constructClone = function (values) {
    return new this.constructor(values, this.mangle, this.getDefault);
};

Dict.prototype.assertString = function (key) {
    if (typeof key !== "string") {
        throw new TypeError("key must be a string but Got " + key);
    }
}

Dict.prototype.get = function (key, defaultValue) {
    this.assertString(key);
    var mangled = mangle(key);
    if (mangled in this.store) {
        return this.store[mangled];
    } else if (arguments.length > 1) {
        return defaultValue;
    } else {
        return this.getDefault(key);
    }
};

Dict.prototype.set = function (key, value) {
    this.assertString(key);
    var mangled = mangle(key);
    if (mangled in this.store) { // update
        if (this.dispatchesBeforeMapChanges) {
            this.dispatchBeforeMapChange(key, this.store[mangled]);
        }
        this.store[mangled] = value;
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, value);
        }
        return false;
    } else { // create
        if (this.dispatchesMapChanges) {
            this.dispatchBeforeMapChange(key, undefined);
        }
        this.length++;
        this.store[mangled] = value;
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, value);
        }
        return true;
    }
};

Dict.prototype.has = function (key) {
    this.assertString(key);
    var mangled = mangle(key);
    return mangled in this.store;
};

Dict.prototype["delete"] = function (key) {
    this.assertString(key);
    var mangled = mangle(key);
    if (mangled in this.store) {
        if (this.dispatchesMapChanges) {
            this.dispatchBeforeMapChange(key, this.store[mangled]);
        }
        delete this.store[mangle(key)];
        this.length--;
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, undefined);
        }
        return true;
    }
    return false;
};

Dict.prototype.clear = function () {
    var key, mangled;
    for (mangled in this.store) {
        key = unmangle(mangled);
        if (this.dispatchesMapChanges) {
            this.dispatchBeforeMapChange(key, this.store[mangled]);
        }
        delete this.store[mangled];
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, undefined);
        }
    }
    this.length = 0;
};

Dict.prototype.reduce = function (callback, basis, thisp) {
    for (var mangled in this.store) {
        basis = callback.call(thisp, basis, this.store[mangled], unmangle(mangled), this);
    }
    return basis;
};

Dict.prototype.reduceRight = function (callback, basis, thisp) {
    var self = this;
    var store = this.store;
    return Object.keys(this.store).reduceRight(function (basis, mangled) {
        return callback.call(thisp, basis, store[mangled], unmangle(mangled), self);
    }, basis);
};

Dict.prototype.one = function () {
    var key;
    for (key in this.store) {
        return this.store[key];
    }
};

}],["collections","fast-map",{"./shim":23,"./fast-set":4,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"fast-map":3},function (require, exports, module){

// collections fast-map
// --------------------

"use strict";

var Shim = require("./shim");
var Set = require("./fast-set");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

module.exports = FastMap;

function FastMap(values, equals, hash, getDefault) {
    if (!(this instanceof FastMap)) {
        return new FastMap(values, equals, hash, getDefault);
    }
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.store = new Set(
        undefined,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function keyHash(item) {
            return hash(item.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

FastMap.FastMap = FastMap; // hack so require("fast-map").FastMap will work in MontageJS

Object.addEach(FastMap.prototype, GenericCollection.prototype);
Object.addEach(FastMap.prototype, GenericMap.prototype);
Object.addEach(FastMap.prototype, PropertyChanges.prototype);

FastMap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

FastMap.prototype.log = function (charmap, stringify) {
    stringify = stringify || this.stringify;
    this.store.log(charmap, stringify);
};

FastMap.prototype.stringify = function (item, leader) {
    return leader + JSON.stringify(item.key) + ": " + JSON.stringify(item.value);
}

}],["collections","fast-set",{"./shim":23,"./dict":2,"./list":13,"./generic-collection":5,"./generic-set":8,"./tree-log":33,"./listen/property-changes":16,"fast-set":4},function (require, exports, module){

// collections fast-set
// --------------------

"use strict";

var Shim = require("./shim");
var Dict = require("./dict");
var List = require("./list");
var GenericCollection = require("./generic-collection");
var GenericSet = require("./generic-set");
var TreeLog = require("./tree-log");
var PropertyChanges = require("./listen/property-changes");

var object_has = Object.prototype.hasOwnProperty;

module.exports = FastSet;

function FastSet(values, equals, hash, getDefault) {
    if (!(this instanceof FastSet)) {
        return new FastSet(values, equals, hash, getDefault);
    }
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.buckets = new this.Buckets(null, this.Bucket);
    this.length = 0;
    this.addEach(values);
}

FastSet.FastSet = FastSet; // hack so require("fast-set").FastSet will work in MontageJS

Object.addEach(FastSet.prototype, GenericCollection.prototype);
Object.addEach(FastSet.prototype, GenericSet.prototype);
Object.addEach(FastSet.prototype, PropertyChanges.prototype);

FastSet.prototype.Buckets = Dict;
FastSet.prototype.Bucket = List;

FastSet.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

FastSet.prototype.has = function (value) {
    var hash = this.contentHash(value);
    return this.buckets.get(hash).has(value);
};

FastSet.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("FastSet#get does not support second argument: equals");
    }
    var hash = this.contentHash(value);
    var buckets = this.buckets;
    if (buckets.has(hash)) {
        return buckets.get(hash).get(value);
    } else {
        return this.getDefault(value);
    }
};

FastSet.prototype["delete"] = function (value, equals) {
    if (equals) {
        throw new Error("FastSet#delete does not support second argument: equals");
    }
    var hash = this.contentHash(value);
    var buckets = this.buckets;
    if (buckets.has(hash)) {
        var bucket = buckets.get(hash);
        if (bucket["delete"](value)) {
            this.length--;
            if (bucket.length === 0) {
                buckets["delete"](hash);
            }
            return true;
        }
    }
    return false;
};

FastSet.prototype.clear = function () {
    this.buckets.clear();
    this.length = 0;
};

FastSet.prototype.add = function (value) {
    var hash = this.contentHash(value);
    var buckets = this.buckets;
    if (!buckets.has(hash)) {
        buckets.set(hash, new this.Bucket(null, this.contentEquals));
    }
    if (!buckets.get(hash).has(value)) {
        buckets.get(hash).add(value);
        this.length++;
        return true;
    }
    return false;
};

FastSet.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var buckets = this.buckets;
    var index = 0;
    return buckets.reduce(function (basis, bucket) {
        return bucket.reduce(function (basis, value) {
            return callback.call(thisp, basis, value, index++, this);
        }, basis, this);
    }, basis, this);
};

FastSet.prototype.one = function () {
    if (this.length > 0) {
        return this.buckets.one().one();
    }
};

FastSet.prototype.iterate = function () {
    return this.buckets.values().flatten().iterate();
};

FastSet.prototype.log = function (charmap, logNode, callback, thisp) {
    charmap = charmap || TreeLog.unicodeSharp;
    logNode = logNode || this.logNode;
    if (!callback) {
        callback = console.log;
        thisp = console;
    }
    callback = callback.bind(thisp);

    var buckets = this.buckets;
    var hashes = buckets.keys();
    hashes.forEach(function (hash, index) {
        var branch;
        var leader;
        if (index === hashes.length - 1) {
            branch = charmap.fromAbove;
            leader = ' ';
        } else if (index === 0) {
            branch = charmap.branchDown;
            leader = charmap.strafe;
        } else {
            branch = charmap.fromBoth;
            leader = charmap.strafe;
        }
        var bucket = buckets.get(hash);
        callback.call(thisp, branch + charmap.through + charmap.branchDown + ' ' + hash);
        bucket.forEach(function (value, node) {
            var branch, below;
            if (node === bucket.head.prev) {
                branch = charmap.fromAbove;
                below = ' ';
            } else {
                branch = charmap.fromBoth;
                below = charmap.strafe;
            }
            var written;
            logNode(
                node,
                function (line) {
                    if (!written) {
                        callback.call(thisp, leader + ' ' + branch + charmap.through + charmap.through + line);
                        written = true;
                    } else {
                        callback.call(thisp, leader + ' ' + below + '  ' + line);
                    }
                },
                function (line) {
                    callback.call(thisp, leader + ' ' + charmap.strafe + '  ' + line);
                }
            );
        });
    });
};

FastSet.prototype.logNode = function (node, write) {
    var value = node.value;
    if (Object(value) === value) {
        JSON.stringify(value, null, 4).split("\n").forEach(function (line) {
            write(" " + line);
        });
    } else {
        write(" " + value);
    }
};

}],["collections","generic-collection",{"./shim-array":24},function (require, exports, module){

// collections generic-collection
// ------------------------------

"use strict";

module.exports = GenericCollection;
function GenericCollection() {
    throw new Error("Can't construct. GenericCollection is a mixin.");
}

GenericCollection.prototype.addEach = function (values) {
    if (values && Object(values) === values) {
        if (typeof values.forEach === "function") {
            values.forEach(this.add, this);
        } else if (typeof values.length === "number") {
            // Array-like objects that do not implement forEach, ergo,
            // Arguments
            for (var i = 0; i < values.length; i++) {
                this.add(values[i], i);
            }
        } else {
            Object.keys(values).forEach(function (key) {
                this.add(values[key], key);
            }, this);
        }
    }
    return this;
};

// This is sufficiently generic for Map (since the value may be a key)
// and ordered collections (since it forwards the equals argument)
GenericCollection.prototype.deleteEach = function (values, equals) {
    values.forEach(function (value) {
        this["delete"](value, equals);
    }, this);
    return this;
};

// all of the following functions are implemented in terms of "reduce".
// some need "constructClone".

GenericCollection.prototype.forEach = function (callback /*, thisp*/) {
    var thisp = arguments[1];
    return this.reduce(function (undefined, value, key, object, depth) {
        callback.call(thisp, value, key, object, depth);
    }, undefined);
};

GenericCollection.prototype.map = function (callback /*, thisp*/) {
    var thisp = arguments[1];
    var result = [];
    this.reduce(function (undefined, value, key, object, depth) {
        result.push(callback.call(thisp, value, key, object, depth));
    }, undefined);
    return result;
};

GenericCollection.prototype.enumerate = function (start) {
    if (start == null) {
        start = 0;
    }
    var result = [];
    this.reduce(function (undefined, value) {
        result.push([start++, value]);
    }, undefined);
    return result;
};

GenericCollection.prototype.group = function (callback, thisp, equals) {
    equals = equals || Object.equals;
    var groups = [];
    var keys = [];
    this.forEach(function (value, key, object) {
        var key = callback.call(thisp, value, key, object);
        var index = keys.indexOf(key, equals);
        var group;
        if (index === -1) {
            group = [];
            groups.push([key, group]);
            keys.push(key);
        } else {
            group = groups[index][1];
        }
        group.push(value);
    });
    return groups;
};

GenericCollection.prototype.toArray = function () {
    return this.map(Function.identity);
};

// this depends on stringable keys, which apply to Array and Iterator
// because they have numeric keys and all Maps since they may use
// strings as keys.  List, Set, and SortedSet have nodes for keys, so
// toObject would not be meaningful.
GenericCollection.prototype.toObject = function () {
    var object = {};
    this.reduce(function (undefined, value, key) {
        object[key] = value;
    }, undefined);
    return object;
};

GenericCollection.prototype.filter = function (callback /*, thisp*/) {
    var thisp = arguments[1];
    var result = this.constructClone();
    this.reduce(function (undefined, value, key, object, depth) {
        if (callback.call(thisp, value, key, object, depth)) {
            result.add(value, key);
        }
    }, undefined);
    return result;
};

GenericCollection.prototype.every = function (callback /*, thisp*/) {
    var thisp = arguments[1];
    return this.reduce(function (result, value, key, object, depth) {
        return result && callback.call(thisp, value, key, object, depth);
    }, true);
};

GenericCollection.prototype.some = function (callback /*, thisp*/) {
    var thisp = arguments[1];
    return this.reduce(function (result, value, key, object, depth) {
        return result || callback.call(thisp, value, key, object, depth);
    }, false);
};

GenericCollection.prototype.all = function () {
    return this.every(Boolean);
};

GenericCollection.prototype.any = function () {
    return this.some(Boolean);
};

GenericCollection.prototype.min = function (compare) {
    compare = compare || this.contentCompare || Object.compare;
    var first = true;
    return this.reduce(function (result, value) {
        if (first) {
            first = false;
            return value;
        } else {
            return compare(value, result) < 0 ? value : result;
        }
    }, undefined);
};

GenericCollection.prototype.max = function (compare) {
    compare = compare || this.contentCompare || Object.compare;
    var first = true;
    return this.reduce(function (result, value) {
        if (first) {
            first = false;
            return value;
        } else {
            return compare(value, result) > 0 ? value : result;
        }
    }, undefined);
};

GenericCollection.prototype.sum = function (zero) {
    zero = zero === undefined ? 0 : zero;
    return this.reduce(function (a, b) {
        return a + b;
    }, zero);
};

GenericCollection.prototype.average = function (zero) {
    var sum = zero === undefined ? 0 : zero;
    var count = zero === undefined ? 0 : zero;
    this.reduce(function (undefined, value) {
        sum += value;
        count += 1;
    }, undefined);
    return sum / count;
};

GenericCollection.prototype.concat = function () {
    var result = this.constructClone(this);
    for (var i = 0; i < arguments.length; i++) {
        result.addEach(arguments[i]);
    }
    return result;
};

GenericCollection.prototype.flatten = function () {
    var self = this;
    return this.reduce(function (result, array) {
        array.forEach(function (value) {
            this.push(value);
        }, result, self);
        return result;
    }, []);
};

GenericCollection.prototype.zip = function () {
    var table = Array.prototype.slice.call(arguments);
    table.unshift(this);
    return Array.unzip(table);
}

GenericCollection.prototype.join = function (delimiter) {
    return this.reduce(function (result, string) {
        return result + delimiter + string;
    });
};

GenericCollection.prototype.sorted = function (compare, by, order) {
    compare = compare || this.contentCompare || Object.compare;
    // account for comparators generated by Function.by
    if (compare.by) {
        by = compare.by;
        compare = compare.compare || this.contentCompare || Object.compare;
    } else {
        by = by || Function.identity;
    }
    if (order === undefined)
        order = 1;
    return this.map(function (item) {
        return {
            by: by(item),
            value: item
        };
    })
    .sort(function (a, b) {
        return compare(a.by, b.by) * order;
    })
    .map(function (pair) {
        return pair.value;
    });
};

GenericCollection.prototype.reversed = function () {
    return this.constructClone(this).reverse();
};

GenericCollection.prototype.clone = function (depth, memo) {
    if (depth === undefined) {
        depth = Infinity;
    } else if (depth === 0) {
        return this;
    }
    var clone = this.constructClone();
    this.forEach(function (value, key) {
        clone.add(Object.clone(value, depth - 1, memo), key);
    }, this);
    return clone;
};

GenericCollection.prototype.only = function () {
    if (this.length === 1) {
        return this.one();
    }
};

GenericCollection.prototype.iterator = function () {
    return this.iterate.apply(this, arguments);
};

require("./shim-array");

}],["collections","generic-map",{"./shim-object":26,"./listen/map-changes":15,"./listen/property-changes":16},function (require, exports, module){

// collections generic-map
// -----------------------

"use strict";

var Object = require("./shim-object");
var MapChanges = require("./listen/map-changes");
var PropertyChanges = require("./listen/property-changes");

module.exports = GenericMap;
function GenericMap() {
    throw new Error("Can't construct. GenericMap is a mixin.");
}

Object.addEach(GenericMap.prototype, MapChanges.prototype);
Object.addEach(GenericMap.prototype, PropertyChanges.prototype);

// all of these methods depend on the constructor providing a `store` set

GenericMap.prototype.isMap = true;

GenericMap.prototype.addEach = function (values) {
    if (values && Object(values) === values) {
        if (typeof values.forEach === "function") {
            // copy map-alikes
            if (values.isMap === true) {
                values.forEach(function (value, key) {
                    this.set(key, value);
                }, this);
            // iterate key value pairs of other iterables
            } else {
                values.forEach(function (pair) {
                    this.set(pair[0], pair[1]);
                }, this);
            }
        } else {
            // copy other objects as map-alikes
            Object.keys(values).forEach(function (key) {
                this.set(key, values[key]);
            }, this);
        }
    }
    return this;
}

GenericMap.prototype.get = function (key, defaultValue) {
    var item = this.store.get(new this.Item(key));
    if (item) {
        return item.value;
    } else if (arguments.length > 1) {
        return defaultValue;
    } else {
        return this.getDefault(key);
    }
};

GenericMap.prototype.set = function (key, value) {
    var item = new this.Item(key, value);
    var found = this.store.get(item);
    var grew = false;
    if (found) { // update
        if (this.dispatchesMapChanges) {
            this.dispatchBeforeMapChange(key, found.value);
        }
        found.value = value;
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, value);
        }
    } else { // create
        if (this.dispatchesMapChanges) {
            this.dispatchBeforeMapChange(key, undefined);
        }
        if (this.store.add(item)) {
            this.length++;
            grew = true;
        }
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, value);
        }
    }
    return grew;
};

GenericMap.prototype.add = function (value, key) {
    return this.set(key, value);
};

GenericMap.prototype.has = function (key) {
    return this.store.has(new this.Item(key));
};

GenericMap.prototype['delete'] = function (key) {
    var item = new this.Item(key);
    if (this.store.has(item)) {
        var from = this.store.get(item).value;
        if (this.dispatchesMapChanges) {
            this.dispatchBeforeMapChange(key, from);
        }
        this.store["delete"](item);
        this.length--;
        if (this.dispatchesMapChanges) {
            this.dispatchMapChange(key, undefined);
        }
        return true;
    }
    return false;
};

GenericMap.prototype.clear = function () {
    var keys;
    if (this.dispatchesMapChanges) {
        this.forEach(function (value, key) {
            this.dispatchBeforeMapChange(key, value);
        }, this);
        keys = this.keys();
    }
    this.store.clear();
    this.length = 0;
    if (this.dispatchesMapChanges) {
        keys.forEach(function (key) {
            this.dispatchMapChange(key);
        }, this);
    }
};

GenericMap.prototype.reduce = function (callback, basis, thisp) {
    return this.store.reduce(function (basis, item) {
        return callback.call(thisp, basis, item.value, item.key, this);
    }, basis, this);
};

GenericMap.prototype.reduceRight = function (callback, basis, thisp) {
    return this.store.reduceRight(function (basis, item) {
        return callback.call(thisp, basis, item.value, item.key, this);
    }, basis, this);
};

GenericMap.prototype.keys = function () {
    return this.map(function (value, key) {
        return key;
    });
};

GenericMap.prototype.values = function () {
    return this.map(Function.identity);
};

GenericMap.prototype.entries = function () {
    return this.map(function (value, key) {
        return [key, value];
    });
};

// XXX deprecated
GenericMap.prototype.items = function () {
    return this.entries();
};

GenericMap.prototype.equals = function (that, equals) {
    equals = equals || Object.equals;
    if (this === that) {
        return true;
    } else if (that && typeof that.every === "function") {
        return that.length === this.length && that.every(function (value, key) {
            return equals(this.get(key), value);
        }, this);
    } else {
        var keys = Object.keys(that);
        return keys.length === this.length && Object.keys(that).every(function (key) {
            return equals(this.get(key), that[key]);
        }, this);
    }
};

GenericMap.prototype.Item = Item;

function Item(key, value) {
    this.key = key;
    this.value = value;
}

Item.prototype.equals = function (that) {
    return Object.equals(this.key, that.key) && Object.equals(this.value, that.value);
};

Item.prototype.compare = function (that) {
    return Object.compare(this.key, that.key);
};

}],["collections","generic-order",{"./shim-object":26},function (require, exports, module){

// collections generic-order
// -------------------------


var Object = require("./shim-object");

module.exports = GenericOrder;
function GenericOrder() {
    throw new Error("Can't construct. GenericOrder is a mixin.");
}

GenericOrder.prototype.equals = function (that, equals) {
    equals = equals || this.contentEquals || Object.equals;

    if (this === that) {
        return true;
    }
    if (!that) {
        return false;
    }

    var self = this;
    return (
        this.length === that.length &&
        this.zip(that).every(function (pair) {
            return equals(pair[0], pair[1]);
        })
    );
};

GenericOrder.prototype.compare = function (that, compare) {
    compare = compare || this.contentCompare || Object.compare;

    if (this === that) {
        return 0;
    }
    if (!that) {
        return 1;
    }

    var length = Math.min(this.length, that.length);
    var comparison = this.zip(that).reduce(function (comparison, pair, index) {
        if (comparison === 0) {
            if (index >= length) {
                return comparison;
            } else {
                return compare(pair[0], pair[1]);
            }
        } else {
            return comparison;
        }
    }, 0);
    if (comparison === 0) {
        return this.length - that.length;
    }
    return comparison;
};

}],["collections","generic-set",{},function (require, exports, module){

// collections generic-set
// -----------------------


module.exports = GenericSet;
function GenericSet() {
    throw new Error("Can't construct. GenericSet is a mixin.");
}

GenericSet.prototype.isSet = true;

GenericSet.prototype.union = function (that) {
    var union =  this.constructClone(this);
    union.addEach(that);
    return union;
};

GenericSet.prototype.intersection = function (that) {
    return this.constructClone(this.filter(function (value) {
        return that.has(value);
    }));
};

GenericSet.prototype.difference = function (that) {
    var union =  this.constructClone(this);
    union.deleteEach(that);
    return union;
};

GenericSet.prototype.symmetricDifference = function (that) {
    var union = this.union(that);
    var intersection = this.intersection(that);
    return union.difference(intersection);
};

GenericSet.prototype.equals = function (that, equals) {
    var self = this;
    return (
        that && typeof that.reduce === "function" &&
        this.length === that.length &&
        that.reduce(function (equal, value) {
            return equal && self.has(value, equals);
        }, true)
    );
};

// W3C DOMTokenList API overlap (does not handle variadic arguments)

GenericSet.prototype.contains = function (value) {
    return this.has(value);
};

GenericSet.prototype.remove = function (value) {
    return this["delete"](value);
};

GenericSet.prototype.toggle = function (value) {
    if (this.has(value)) {
        this["delete"](value);
    } else {
        this.add(value);
    }
};

}],["collections","heap",{"./listen/array-changes":14,"./shim":23,"./generic-collection":5,"./listen/map-changes":15,"./listen/range-changes":17,"./listen/property-changes":16,"heap":9},function (require, exports, module){

// collections heap
// ----------------


// Adapted from Eloquent JavaScript by Marijn Haverbeke
// http://eloquentjavascript.net/appendix2.html

var ArrayChanges = require("./listen/array-changes");
var Shim = require("./shim");
var GenericCollection = require("./generic-collection");
var MapChanges = require("./listen/map-changes");
var RangeChanges = require("./listen/range-changes");
var PropertyChanges = require("./listen/property-changes");

// Max Heap by default.  Comparison can be reversed to produce a Min Heap.

module.exports = Heap;

function Heap(values, equals, compare) {
    if (!(this instanceof Heap)) {
        return new Heap(values, equals, compare);
    }
    this.contentEquals = equals || Object.equals;
    this.contentCompare = compare || Object.compare;
    this.content = [];
    this.length = 0;
    this.addEach(values);
}

Heap.Heap = Heap; // hack so require("heap").Heap will work in MontageJS

Object.addEach(Heap.prototype, GenericCollection.prototype);
Object.addEach(Heap.prototype, PropertyChanges.prototype);
Object.addEach(Heap.prototype, RangeChanges.prototype);
Object.addEach(Heap.prototype, MapChanges.prototype);

Heap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentCompare
    );
};

Heap.prototype.push = function (value) {
    this.content.push(value);
    this.float(this.content.length - 1);
    this.length++;
};

Heap.prototype.pop = function () {
    // Store the first value so we can return it later.  This will leave a gap
    // at index 0 that must be filled.
    var result = this.content[0];
    // Remove the value at the end of the array.  The value most be removed
    // from the end to preserve the completness of the tree, despite that the
    // last child is also among the most likely to need to sink back to the
    // bottom.
    var top = this.content.pop();
    // If there are any values remaining, put the last value on the top and
    // let it sink back down.
    if (this.content.length > 0) {
        this.content.set(0, top);
        this.sink(0);
    }
    this.length--;
    return result;
};

Heap.prototype.add = function (value) {
    this.push(value);
};

// indexOf must do a linear search since a binary heap does not preserve a
// strict sort order.  Thus, deletion takes linear time for all values except
// for the max value.

Heap.prototype.indexOf = function (value) {
    for (var index = 0; index < this.length; index++) {
        if (this.contentEquals(this.content[index], value)) {
            return index;
        }
    }
    return -1;
};

Heap.prototype["delete"] = function (value, equals) {
    if (equals) {
        throw new Error("Heap#delete does not support second argument: equals");
    }
    var index = this.indexOf(value);
    if (index === -1)
        return false;
    var top = this.content.pop();
    this.length = this.content.length;
    if (index === this.content.length)
        return true;
    this.content.set(index, top);
    var comparison = this.contentCompare(top, value);
    if (comparison > 0) {
        this.float(index);
    } else if (comparison < 0) {
        this.sink(index);
    }
    return true;
};

Heap.prototype.peek = function () {
    if (this.length) {
        return this.content[0];
    }
};

Heap.prototype.max = function () {
    return this.peek();
};

Heap.prototype.one = function () {
    return this.peek();
};

// Brings a value up until its parent is greater than it
Heap.prototype.float = function (index) {
    // Grab the value that is being adjusted
    var value = this.content[index];
    // A value can go no higher that the top: index 0
    while (index > 0) {
        // Compute the parent value's index and fetch it
        var parentIndex = Math.floor((index + 1) / 2) - 1;
        var parent = this.content[parentIndex];
        // If the parent is less than it
        if (this.contentCompare(parent, value) < 0) {
            this.content.set(parentIndex, value);
            this.content.set(index, parent);
        } else {
            // Stop propagating if the parent is greater than the value.
            break;
        }
        // Proceed upward
        index = parentIndex;
    }
};

// Brings a value down until its children are both less than it
Heap.prototype.sink = function (index) {
    // Moves a value downward until it is greater than its children.
    var length = this.content.length;
    var value = this.content[index];
    var left, right, leftIndex, rightIndex, swapIndex, needsSwap;

    while (true) {
        // Invariant: the value is at index.
        // Variant: the index proceedes down the tree.

        // Compute the indicies of the children.
        rightIndex = (index + 1) * 2;
        leftIndex = rightIndex - 1;

        // If the left child exists, determine whether it is greater than the
        // parent (value) and thus whether it can be floated upward.
        needsSwap = false;
        if (leftIndex < length) {
            // Look it up and compare it.
            var left = this.content[leftIndex];
            var comparison = this.contentCompare(left, value);
            // If the child is greater than the parent, it can be floated.
            if (comparison > 0) {
                swapIndex = leftIndex;
                needsSwap = true;
            }
        }

        // If the right child exists, determine whether it is greater than the
        // parent (value), or even greater than the left child.
        if (rightIndex < length) {
            var right = this.content[rightIndex];
            var comparison = this.contentCompare(right, needsSwap ? left : value);
            if (comparison > 0) {
                swapIndex = rightIndex;
                needsSwap = true;
            }
        }

        // if there is a child that is less than the value, float the child and
        // sink the value.
        if (needsSwap) {
            this.content.set(index, this.content[swapIndex]);
            this.content.set(swapIndex, value);
            index = swapIndex;
            // and continue sinking
        } else {
            // if the children are both less than the value
            break;
        }

    }

};

Heap.prototype.clear = function () {
    this.content.clear();
    this.length = 0;
};

Heap.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    return this.content.reduce(function (basis, value, key) {
        return callback.call(thisp, basis, value, key, this);
    }, basis, this);
};

Heap.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    return this.content.reduceRight(function (basis, value, key) {
        return callback.call(thisp, basis, value, key, this);
    }, basis, this);
};

Heap.prototype.makeObservable = function () {
    // TODO refactor dispatchers to allow direct forwarding
    this.content.addRangeChangeListener(this, "content");
    this.content.addBeforeRangeChangeListener(this, "content");
    this.content.addMapChangeListener(this, "content");
    this.content.addBeforeMapChangeListener(this, "content");
};

Heap.prototype.handleContentRangeChange = function (plus, minus, index) {
    this.dispatchRangeChange(plus, minus, index);
};

Heap.prototype.handleContentRangeWillChange = function (plus, minus, index) {
    this.dispatchBeforeRangeChange(plus, minus, index);
};

Heap.prototype.handleContentMapChange = function (value, key) {
    this.dispatchMapChange(key, value);
};

Heap.prototype.handleContentMapWillChange = function (value, key) {
    this.dispatchBeforeMapChange(key, value);
};
}],["collections","iterator",{"./shim-object":26,"./generic-collection":5},function (require, exports, module){

// collections iterator
// --------------------

"use strict";

module.exports = Iterator;

var Object = require("./shim-object");
var GenericCollection = require("./generic-collection");

// upgrades an iterable to a Iterator
function Iterator(iterable) {

    if (!(this instanceof Iterator)) {
        return new Iterator(iterable);
    }

    if (Array.isArray(iterable) || typeof iterable === "string")
        return Iterator.iterate(iterable);

    iterable = Object(iterable);

    if (iterable instanceof Iterator) {
        return iterable;
    } else if (iterable.next) {
        this.next = function () {
            return iterable.next();
        };
    } else if (iterable.iterate) {
        var iterator = iterable.iterate();
        this.next = function () {
            return iterator.next();
        };
    } else if (Object.prototype.toString.call(iterable) === "[object Function]") {
        this.next = iterable;
    } else {
        throw new TypeError("Can't iterate " + iterable);
    }

}

Iterator.prototype.forEach = GenericCollection.prototype.forEach;
Iterator.prototype.map = GenericCollection.prototype.map;
Iterator.prototype.filter = GenericCollection.prototype.filter;
Iterator.prototype.every = GenericCollection.prototype.every;
Iterator.prototype.some = GenericCollection.prototype.some;
Iterator.prototype.any = GenericCollection.prototype.any;
Iterator.prototype.all = GenericCollection.prototype.all;
Iterator.prototype.min = GenericCollection.prototype.min;
Iterator.prototype.max = GenericCollection.prototype.max;
Iterator.prototype.sum = GenericCollection.prototype.sum;
Iterator.prototype.average = GenericCollection.prototype.average;
Iterator.prototype.flatten = GenericCollection.prototype.flatten;
Iterator.prototype.zip = GenericCollection.prototype.zip;
Iterator.prototype.enumerate = GenericCollection.prototype.enumerate;
Iterator.prototype.sorted = GenericCollection.prototype.sorted;
Iterator.prototype.group = GenericCollection.prototype.group;
Iterator.prototype.reversed = GenericCollection.prototype.reversed;
Iterator.prototype.toArray = GenericCollection.prototype.toArray;
Iterator.prototype.toObject = GenericCollection.prototype.toObject;
Iterator.prototype.iterator = GenericCollection.prototype.iterator;

// this is a bit of a cheat so flatten and such work with the generic
// reducible
Iterator.prototype.constructClone = function (values) {
    var clone = [];
    clone.addEach(values);
    return clone;
};

Iterator.prototype.mapIterator = function (callback /*, thisp*/) {
    var self = Iterator(this),
        thisp = arguments[1],
        i = 0;

    if (Object.prototype.toString.call(callback) != "[object Function]")
        throw new TypeError();

    return new self.constructor(function () {
        return callback.call(thisp, self.next(), i++, self);
    });
};

Iterator.prototype.filterIterator = function (callback /*, thisp*/) {
    var self = Iterator(this),
        thisp = arguments[1],
        i = 0;

    if (Object.prototype.toString.call(callback) != "[object Function]")
        throw new TypeError();

    return new self.constructor(function () {
        var value;
        while (true) {
            value = self.next();
            if (callback.call(thisp, value, i++, self))
                return value;
        }
    });
};

Iterator.prototype.reduce = function (callback /*, initial, thisp*/) {
    var self = Iterator(this),
        result = arguments[1],
        thisp = arguments[2],
        i = 0,
        value;

    if (Object.prototype.toString.call(callback) != "[object Function]")
        throw new TypeError();

    // first iteration unrolled
    try {
        value = self.next();
        if (arguments.length > 1) {
            result = callback.call(thisp, result, value, i, self);
        } else {
            result = value;
        }
        i++;
    } catch (exception) {
        if (isStopIteration(exception)) {
            if (arguments.length > 1) {
                return arguments[1]; // initial
            } else {
                throw TypeError("cannot reduce a value from an empty iterator with no initial value");
            }
        } else {
            throw exception;
        }
    }

    // remaining entries
    try {
        while (true) {
            value = self.next();
            result = callback.call(thisp, result, value, i, self);
            i++;
        }
    } catch (exception) {
        if (isStopIteration(exception)) {
            return result;
        } else {
            throw exception;
        }
    }

};

Iterator.prototype.concat = function () {
    return Iterator.concat(
        Array.prototype.concat.apply(this, arguments)
    );
};

Iterator.prototype.dropWhile = function (callback /*, thisp */) {
    var self = Iterator(this),
        thisp = arguments[1],
        stopped = false,
        stopValue;

    if (Object.prototype.toString.call(callback) != "[object Function]")
        throw new TypeError();

    self.forEach(function (value, i) {
        if (!callback.call(thisp, value, i, self)) {
            stopped = true;
            stopValue = value;
            throw StopIteration;
        }
    });

    if (stopped) {
        return self.constructor([stopValue]).concat(self);
    } else {
        return self.constructor([]);
    }
};

Iterator.prototype.takeWhile = function (callback /*, thisp*/) {
    var self = Iterator(this),
        thisp = arguments[1];

    if (Object.prototype.toString.call(callback) != "[object Function]")
        throw new TypeError();

    return self.mapIterator(function (value, i) {
        if (!callback.call(thisp, value, i, self))
            throw StopIteration;
        return value;
    });
};

Iterator.prototype.zipIterator = function () {
    return Iterator.unzip(
        Array.prototype.concat.apply(this, arguments)
    );
};

Iterator.prototype.enumerateIterator = function (start) {
    return Iterator.count(start).zipIterator(this);
};

// creates an iterator for Array and String
Iterator.iterate = function (iterable) {
    var start;
    start = 0;
    return new Iterator(function () {
        // advance to next owned entry
        if (typeof iterable === "object") {
            while (!(start in iterable)) {
                // deliberately late bound
                if (start >= iterable.length)
                    throw StopIteration;
                start += 1;
            }
        } else if (start >= iterable.length) {
            throw StopIteration;
        }
        var result = iterable[start];
        start += 1;
        return result;
    });
};

Iterator.cycle = function (cycle, times) {
    if (arguments.length < 2)
        times = Infinity;
    //cycle = Iterator(cycle).toArray();
    var next = function () {
        throw StopIteration;
    };
    return new Iterator(function () {
        var iteration;
        try {
            return next();
        } catch (exception) {
            if (isStopIteration(exception)) {
                if (times <= 0)
                    throw exception;
                times--;
                iteration = Iterator.iterate(cycle);
                next = iteration.next.bind(iteration);
                return next();
            } else {
                throw exception;
            }
        }
    });
};

Iterator.concat = function (iterators) {
    iterators = Iterator(iterators);
    var next = function () {
        throw StopIteration;
    };
    return new Iterator(function (){
        var iteration;
        try {
            return next();
        } catch (exception) {
            if (isStopIteration(exception)) {
                iteration = Iterator(iterators.next());
                next = iteration.next.bind(iteration);
                return next();
            } else {
                throw exception;
            }
        }
    });
};

Iterator.unzip = function (iterators) {
    iterators = Iterator(iterators).map(Iterator);
    if (iterators.length === 0)
        return new Iterator([]);
    return new Iterator(function () {
        var stopped;
        var result = iterators.map(function (iterator) {
            try {
                return iterator.next();
            } catch (exception) {
                if (isStopIteration(exception)) {
                    stopped = true;
                } else {
                    throw exception;
                }
            }
        });
        if (stopped) {
            throw StopIteration;
        }
        return result;
    });
};

Iterator.zip = function () {
    return Iterator.unzip(
        Array.prototype.slice.call(arguments)
    );
};

Iterator.chain = function () {
    return Iterator.concat(
        Array.prototype.slice.call(arguments)
    );
};

Iterator.range = function (start, stop, step) {
    if (arguments.length < 3) {
        step = 1;
    }
    if (arguments.length < 2) {
        stop = start;
        start = 0;
    }
    start = start || 0;
    step = step || 1;
    return new Iterator(function () {
        if (start >= stop)
            throw StopIteration;
        var result = start;
        start += step;
        return result;
    });
};

Iterator.count = function (start, step) {
    return Iterator.range(start, Infinity, step);
};

Iterator.repeat = function (value, times) {
    return new Iterator.range(times).mapIterator(function () {
        return value;
    });
};

// shim isStopIteration
if (typeof isStopIteration === "undefined") {
    global.isStopIteration = function (exception) {
        return Object.prototype.toString.call(exception) === "[object StopIteration]";
    };
}

// shim StopIteration
if (typeof StopIteration === "undefined") {
    global.StopIteration = {};
    Object.prototype.toString = (function (toString) {
        return function () {
            if (
                this === global.StopIteration ||
                this instanceof global.ReturnValue
            )
                return "[object StopIteration]";
            else
                return toString.call(this, arguments);
        };
    })(Object.prototype.toString);
}

// shim ReturnValue
if (typeof ReturnValue === "undefined") {
    global.ReturnValue = function ReturnValue(value) {
        this.message = "Iteration stopped with " + value;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ReturnValue);
        }
        if (!(this instanceof global.ReturnValue))
            return new global.ReturnValue(value);
        this.value = value;
    };
    ReturnValue.prototype = Error.prototype;
}

}],["collections","lfu-map",{"./shim":23,"./lfu-set":12,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"lfu-map":11},function (require, exports, module){

// collections lfu-map
// -------------------

"use strict";

var Shim = require("./shim");
var LfuSet = require("./lfu-set");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

module.exports = LfuMap;

function LfuMap(values, maxLength, equals, hash, getDefault) {
    if (!(this instanceof LfuMap)) {
        return new LfuMap(values, maxLength, equals, hash, getDefault);
    }
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.store = new LfuSet(
        undefined,
        maxLength,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function keyHash(item) {
            return hash(item.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

LfuMap.LfuMap = LfuMap; // hack so require("lfu-map").LfuMap will work in MontageJS

Object.addEach(LfuMap.prototype, GenericCollection.prototype);
Object.addEach(LfuMap.prototype, GenericMap.prototype);
Object.addEach(LfuMap.prototype, PropertyChanges.prototype);

LfuMap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.maxLength,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

LfuMap.prototype.log = function (charmap, stringify) {
    stringify = stringify || this.stringify;
    this.store.log(charmap, stringify);
};

LfuMap.prototype.stringify = function (item, leader) {
    return leader + JSON.stringify(item.key) + ": " + JSON.stringify(item.value);
};

LfuMap.prototype.addMapChangeListener = function () {
    if (!this.dispatchesMapChanges) {
        // Detect LFU deletions in the LfuSet and emit as MapChanges.
        // Array and Heap have no store.
        // Dict and FastMap define no listeners on their store.
        var self = this;
        this.store.addBeforeRangeChangeListener(function(plus, minus) {
            if (plus.length && minus.length) {  // LFU item pruned
                self.dispatchBeforeMapChange(minus[0].key, undefined);
            }
        });
        this.store.addRangeChangeListener(function(plus, minus) {
            if (plus.length && minus.length) {
                self.dispatchMapChange(minus[0].key, undefined);
            }
        });
    }
    GenericMap.prototype.addMapChangeListener.apply(this, arguments);
};

}],["collections","lfu-set",{"./shim":23,"./set":22,"./generic-collection":5,"./generic-set":8,"./listen/property-changes":16,"./listen/range-changes":17,"lfu-set":12},function (require, exports, module){

// collections lfu-set
// -------------------

"use strict";

// Based on http://dhruvbird.com/lfu.pdf

var Shim = require("./shim");
var Set = require("./set");
var GenericCollection = require("./generic-collection");
var GenericSet = require("./generic-set");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");

module.exports = LfuSet;

function LfuSet(values, capacity, equals, hash, getDefault) {
    if (!(this instanceof LfuSet)) {
        return new LfuSet(values, capacity, equals, hash, getDefault);
    }
    capacity = capacity || Infinity;
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;

    // TODO
    this.store = new Set(
        undefined,
        function valueEqual(a, b) {
            return equals(a.value, b.value);
        },
        function valueHash(node) {
            return hash(node.value);
        }
    );
    this.frequencyHead = new this.FrequencyNode(0);

    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.capacity = capacity;
    this.length = 0;
    this.addEach(values);
}

LfuSet.LfuSet = LfuSet; // hack so require("lfu-set").LfuSet will work in MontageJS

Object.addEach(LfuSet.prototype, GenericCollection.prototype);
Object.addEach(LfuSet.prototype, GenericSet.prototype);
Object.addEach(LfuSet.prototype, PropertyChanges.prototype);
Object.addEach(LfuSet.prototype, RangeChanges.prototype);

LfuSet.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.capacity,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

LfuSet.prototype.has = function (value) {
    return this.store.has(new this.Node(value));
};

LfuSet.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("LfuSet#get does not support second argument: equals");
    }

    var node = this.store.get(new this.Node(value));
    if (node !== undefined) {
        var frequencyNode = node.frequencyNode;
        var nextFrequencyNode = frequencyNode.next;
        if (nextFrequencyNode.frequency !== frequencyNode.frequency + 1) {
            nextFrequencyNode = new this.FrequencyNode(frequencyNode.frequency + 1, frequencyNode, nextFrequencyNode);
        }

        nextFrequencyNode.values.add(node);
        node.frequencyNode = nextFrequencyNode;
        frequencyNode.values["delete"](node);

        if (frequencyNode.values.length === 0) {
            frequencyNode.prev.next = frequencyNode.next;
            frequencyNode.next.prev = frequencyNode.prev;
        }

        return node.value;
    } else {
        return this.getDefault(value);
    }
};

LfuSet.prototype.add = function (value) {
    // if the value already exists, get it so that its frequency increases
    if (this.has(value)) {
        this.get(value);
        return false;
    }

    var plus = [], minus = [], leastFrequentNode, leastFrequent;
    if (this.capacity > 0) {
        plus.push(value);
        if (this.length + 1 > this.capacity) {
            leastFrequentNode = this.frequencyHead.next;
            leastFrequent = leastFrequentNode.values.order.head.next.value;
            minus.push(leastFrequent.value);
        }
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange(plus, minus, 0);
        }

        // removal must happen before addition, otherwise we could remove
        // the value we are about to add
        if (minus.length > 0) {
            this.store["delete"](leastFrequent);
            leastFrequentNode.values["delete"](leastFrequent);
            // Don't remove the frequencyNode with value of 1, because we
            // are about to use it again in the addition.
            if (leastFrequentNode.value !== 1 && leastFrequentNode.values.length === 0) {
                this.frequencyHead.next = leastFrequentNode.next;
                leastFrequentNode.next.prev = this.frequencyHead;
            }
        }

        var node = new this.Node(value);
        var frequencyNode = this.frequencyHead.next;
        if (frequencyNode.frequency !== 1) {
            frequencyNode = new this.FrequencyNode(1, this.frequencyHead, frequencyNode);
        }
        this.store.add(node);
        frequencyNode.values.add(node);
        node.frequencyNode = frequencyNode;

        this.length = this.length + plus.length - minus.length;

        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange(plus, minus, 0);
        }
    }

    // whether it grew
    return plus.length !== minus.length;
};

LfuSet.prototype["delete"] = function (value, equals) {
    if (equals) {
        throw new Error("LfuSet#delete does not support second argument: equals");
    }

    var node = this.store.get(new this.Node(value));
    var found = !!node;
    if (found) {
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([], [value], 0);
        }
        var frequencyNode = node.frequencyNode;

        this.store["delete"](node);
        frequencyNode.values["delete"](node);
        if (frequencyNode.values.length === 0) {
            frequencyNode.prev.next = frequencyNode.next;
            frequencyNode.next.prev = frequencyNode.prev;
        }
        this.length--;

        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([], [value], 0);
        }
    }

    return found;
};

LfuSet.prototype.one = function () {
    if (this.length > 0) {
        return this.frequencyHead.next.values.one().value;
    }
};

LfuSet.prototype.clear = function () {
    this.store.clear();
    this.frequencyHead.next = this.frequencyHead;
    this.length = 0;
};

LfuSet.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var index = 0;
    var frequencyNode = this.frequencyHead.next;

    while (frequencyNode.frequency !== 0) {
        var set = frequencyNode.values;
        basis = set.reduce(function (basis, node) {
            return callback.call(thisp, basis, node.value, index++, this);
        }, basis, this);

        frequencyNode = frequencyNode.next;
    }

    return basis;
};

LfuSet.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var index = this.length - 1;
    var frequencyNode = this.frequencyHead.prev;

    while (frequencyNode.frequency !== 0) {
        var set = frequencyNode.values;
        basis = set.reduceRight(function (basis, node) {
            return callback.call(thisp, basis, node.value, index--, this);
        }, basis, this);

        frequencyNode = frequencyNode.prev;
    }

    return basis;
};

LfuSet.prototype.iterate = function () {
    return this.store.map(function (node) {
        return node.value;
    }).iterate();
};

LfuSet.prototype.Node = Node;

function Node(value, frequencyNode) {
    this.value = value;
    this.frequencyNode = frequencyNode;
}

LfuSet.prototype.FrequencyNode = FrequencyNode;

function FrequencyNode(frequency, prev, next) {
    this.frequency = frequency;
    this.values = new Set();
    this.prev = prev || this;
    this.next = next || this;
    if (prev) {
        prev.next = this;
    }
    if (next) {
        next.prev = this;
    }
}

}],["collections","list",{"./shim":23,"./generic-collection":5,"./generic-order":7,"./listen/property-changes":16,"./listen/range-changes":17,"list":13},function (require, exports, module){

// collections list
// ----------------

"use strict";

module.exports = List;

var Shim = require("./shim");
var GenericCollection = require("./generic-collection");
var GenericOrder = require("./generic-order");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");

function List(values, equals, getDefault) {
    if (!(this instanceof List)) {
        return new List(values, equals, getDefault);
    }
    var head = this.head = new this.Node();
    head.next = head;
    head.prev = head;
    this.contentEquals = equals || Object.equals;
    this.getDefault = getDefault || Function.noop;
    this.length = 0;
    this.addEach(values);
}

List.List = List; // hack so require("list").List will work in MontageJS

Object.addEach(List.prototype, GenericCollection.prototype);
Object.addEach(List.prototype, GenericOrder.prototype);
Object.addEach(List.prototype, PropertyChanges.prototype);
Object.addEach(List.prototype, RangeChanges.prototype);

List.prototype.constructClone = function (values) {
    return new this.constructor(values, this.contentEquals, this.getDefault);
};

List.prototype.find = function (value, equals, index) {
    equals = equals || this.contentEquals;
    var head = this.head;
    var at = this.scan(index, head.next);
    while (at !== head) {
        if (equals(at.value, value)) {
            return at;
        }
        at = at.next;
    }
};

List.prototype.findLast = function (value, equals, index) {
    equals = equals || this.contentEquals;
    var head = this.head;
    var at = this.scan(index, head.prev);
    while (at !== head) {
        if (equals(at.value, value)) {
            return at;
        }
        at = at.prev;
    }
};

List.prototype.has = function (value, equals) {
    return !!this.find(value, equals);
};

List.prototype.get = function (value, equals) {
    var found = this.find(value, equals);
    if (found) {
        return found.value;
    }
    return this.getDefault(value);
};

// LIFO (delete removes the most recently added equivalent value)
List.prototype['delete'] = function (value, equals) {
    var found = this.findLast(value, equals);
    if (found) {
        if (this.dispatchesRangeChanges) {
            var plus = [];
            var minus = [value];
            this.dispatchBeforeRangeChange(plus, minus, found.index);
        }
        found['delete']();
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.updateIndexes(found.next, found.index);
            this.dispatchRangeChange(plus, minus, found.index);
        }
        return true;
    }
    return false;
};

List.prototype.clear = function () {
    var plus, minus;
    if (this.dispatchesRangeChanges) {
        minus = this.toArray();
        plus = [];
        this.dispatchBeforeRangeChange(plus, minus, 0);
    }
    this.head.next = this.head.prev = this.head;
    this.length = 0;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange(plus, minus, 0);
    }
};

List.prototype.add = function (value) {
    var node = new this.Node(value)
    if (this.dispatchesRangeChanges) {
        node.index = this.length;
        this.dispatchBeforeRangeChange([value], [], node.index);
    }
    this.head.addBefore(node);
    this.length++;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([value], [], node.index);
    }
    return true;
};

List.prototype.push = function () {
    var head = this.head;
    if (this.dispatchesRangeChanges) {
        var plus = Array.prototype.slice.call(arguments);
        var minus = []
        var index = this.length;
        this.dispatchBeforeRangeChange(plus, minus, index);
        var start = this.head.prev;
    }
    for (var i = 0; i < arguments.length; i++) {
        var value = arguments[i];
        var node = new this.Node(value);
        head.addBefore(node);
    }
    this.length += arguments.length;
    if (this.dispatchesRangeChanges) {
        this.updateIndexes(start.next, start.index === undefined ? 0 : start.index + 1);
        this.dispatchRangeChange(plus, minus, index);
    }
};

List.prototype.unshift = function () {
    if (this.dispatchesRangeChanges) {
        var plus = Array.prototype.slice.call(arguments);
        var minus = [];
        this.dispatchBeforeRangeChange(plus, minus, 0);
    }
    var at = this.head;
    for (var i = 0; i < arguments.length; i++) {
        var value = arguments[i];
        var node = new this.Node(value);
        at.addAfter(node);
        at = node;
    }
    this.length += arguments.length;
    if (this.dispatchesRangeChanges) {
        this.updateIndexes(this.head.next, 0);
        this.dispatchRangeChange(plus, minus, 0);
    }
};

List.prototype.pop = function () {
    var value;
    var head = this.head;
    if (head.prev !== head) {
        value = head.prev.value;
        if (this.dispatchesRangeChanges) {
            var plus = [];
            var minus = [value];
            var index = this.length - 1;
            this.dispatchBeforeRangeChange(plus, minus, index);
        }
        head.prev['delete']();
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange(plus, minus, index);
        }
    }
    return value;
};

List.prototype.shift = function () {
    var value;
    var head = this.head;
    if (head.prev !== head) {
        value = head.next.value;
        if (this.dispatchesRangeChanges) {
            var plus = [];
            var minus = [value];
            this.dispatchBeforeRangeChange(plus, minus, 0);
        }
        head.next['delete']();
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.updateIndexes(this.head.next, 0);
            this.dispatchRangeChange(plus, minus, 0);
        }
    }
    return value;
};

List.prototype.peek = function () {
    if (this.head !== this.head.next) {
        return this.head.next.value;
    }
};

List.prototype.poke = function (value) {
    if (this.head !== this.head.next) {
        this.head.next.value = value;
    } else {
        this.push(value);
    }
};

List.prototype.one = function () {
    return this.peek();
};

// TODO
// List.prototype.indexOf = function (value) {
// };

// TODO
// List.prototype.lastIndexOf = function (value) {
// };

// an internal utility for coercing index offsets to nodes
List.prototype.scan = function (at, fallback) {
    var head = this.head;
    if (typeof at === "number") {
        var count = at;
        if (count >= 0) {
            at = head.next;
            while (count) {
                count--;
                at = at.next;
                if (at == head) {
                    break;
                }
            }
        } else {
            at = head;
            while (count < 0) {
                count++;
                at = at.prev;
                if (at == head) {
                    break;
                }
            }
        }
        return at;
    } else {
        return at || fallback;
    }
};

// at and end may both be positive or negative numbers (in which cases they
// correspond to numeric indicies, or nodes)
List.prototype.slice = function (at, end) {
    var sliced = [];
    var head = this.head;
    at = this.scan(at, head.next);
    end = this.scan(end, head);

    while (at !== end && at !== head) {
        sliced.push(at.value);
        at = at.next;
    }

    return sliced;
};

List.prototype.splice = function (at, length /*...plus*/) {
    return this.swap(at, length, Array.prototype.slice.call(arguments, 2));
};

List.prototype.swap = function (start, length, plus) {
    var initial = start;
    // start will be head if start is null or -1 (meaning from the end), but
    // will be head.next if start is 0 (meaning from the beginning)
    start = this.scan(start, this.head);
    if (length == null) {
        length = Infinity;
    }
    plus = Array.from(plus);

    // collect the minus array
    var minus = [];
    var at = start;
    while (length-- && length >= 0 && at !== this.head) {
        minus.push(at.value);
        at = at.next;
    }

    // before range change
    var index, startNode;
    if (this.dispatchesRangeChanges) {
        if (start === this.head) {
            index = this.length;
        } else if (start.prev === this.head) {
            index = 0;
        } else {
            index = start.index;
        }
        startNode = start.prev;
        this.dispatchBeforeRangeChange(plus, minus, index);
    }

    // delete minus
    var at = start;
    for (var i = 0, at = start; i < minus.length; i++, at = at.next) {
        at["delete"]();
    }
    // add plus
    if (initial == null && at === this.head) {
        at = this.head.next;
    }
    for (var i = 0; i < plus.length; i++) {
        var node = new this.Node(plus[i]);
        at.addBefore(node);
    }
    // adjust length
    this.length += plus.length - minus.length;

    // after range change
    if (this.dispatchesRangeChanges) {
        if (start === this.head) {
            this.updateIndexes(this.head.next, 0);
        } else {
            this.updateIndexes(startNode.next, startNode.index + 1);
        }
        this.dispatchRangeChange(plus, minus, index);
    }

    return minus;
};

List.prototype.reverse = function () {
    if (this.dispatchesRangeChanges) {
        var minus = this.toArray();
        var plus = minus.reversed();
        this.dispatchBeforeRangeChange(plus, minus, 0);
    }
    var at = this.head;
    do {
        var temp = at.next;
        at.next = at.prev;
        at.prev = temp;
        at = at.next;
    } while (at !== this.head);
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange(plus, minus, 0);
    }
    return this;
};

List.prototype.sort = function () {
    this.swap(0, this.length, this.sorted());
};

// TODO account for missing basis argument
List.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var head = this.head;
    var at = head.next;
    while (at !== head) {
        basis = callback.call(thisp, basis, at.value, at, this);
        at = at.next;
    }
    return basis;
};

List.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var head = this.head;
    var at = head.prev;
    while (at !== head) {
        basis = callback.call(thisp, basis, at.value, at, this);
        at = at.prev;
    }
    return basis;
};

List.prototype.updateIndexes = function (node, index) {
    while (node !== this.head) {
        node.index = index++;
        node = node.next;
    }
};

List.prototype.makeObservable = function () {
    this.head.index = -1;
    this.updateIndexes(this.head.next, 0);
    this.dispatchesRangeChanges = true;
};

List.prototype.iterate = function () {
    return new ListIterator(this.head);
};

function ListIterator(head) {
    this.head = head;
    this.at = head.next;
};

ListIterator.prototype.next = function () {
    if (this.at === this.head) {
        throw StopIteration;
    } else {
        var value = this.at.value;
        this.at = this.at.next;
        return value;
    }
};

List.prototype.Node = Node;

function Node(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
};

Node.prototype['delete'] = function () {
    this.prev.next = this.next;
    this.next.prev = this.prev;
};

Node.prototype.addBefore = function (node) {
    var prev = this.prev;
    this.prev = node;
    node.prev = prev;
    prev.next = node;
    node.next = this;
};

Node.prototype.addAfter = function (node) {
    var next = this.next;
    this.next = node;
    node.next = next;
    next.prev = node;
    node.prev = this;
};

}],["collections","listen/array-changes",{"../shim":23,"../list":13,"weak-map":35,"./property-changes":16,"./range-changes":17,"./map-changes":15},function (require, exports, module){

// collections listen/array-changes
// --------------------------------

/*
    Based in part on observable arrays from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/

/*
    This module is responsible for observing changes to owned properties of
    objects and changes to the content of arrays caused by method calls.
    The interface for observing array content changes establishes the methods
    necessary for any collection with observable content.
*/

require("../shim");
var List = require("../list");
var WeakMap = require("weak-map");
var PropertyChanges = require("./property-changes");
var RangeChanges = require("./range-changes");
var MapChanges = require("./map-changes");

var array_splice = Array.prototype.splice;
var array_slice = Array.prototype.slice;
var array_reverse = Array.prototype.reverse;
var array_sort = Array.prototype.sort;
var array_swap = Array.prototype.swap;

var EMPTY_ARRAY = [];

// use different strategies for making arrays observable between Internet
// Explorer and other browsers.
var protoIsSupported = {}.__proto__ === Object.prototype;
var array_makeObservable;
if (protoIsSupported) {
    array_makeObservable = function () {
        this.__proto__ = ChangeDispatchArray;
    };
} else {
    array_makeObservable = function () {
        Object.defineProperties(this, observableArrayProperties);
    };
}

Object.defineProperty(Array.prototype, "makeObservable", {
    value: array_makeObservable,
    writable: true,
    configurable: true,
    enumerable: false
});

function defineEach(prototype) {
    for (var name in prototype) {
        Object.defineProperty(Array.prototype, name, {
            value: prototype[name],
            writable: true,
            configurable: true,
            enumerable: false
        });
    }
}

defineEach(PropertyChanges.prototype);
defineEach(RangeChanges.prototype);
defineEach(MapChanges.prototype);

var observableArrayProperties = {

    isObservable: {
        value: true,
        writable: true,
        configurable: true
    },

    makeObservable: {
        value: Function.noop, // idempotent
        writable: true,
        configurable: true
    },

    reverse: {
        value: function reverse() {

            var reversed = this.constructClone(this);
            reversed.reverse();
            this.swap(0, this.length, reversed);

            return this;
        },
        writable: true,
        configurable: true
    },

    sort: {
        value: function sort() {

            // dispatch before change events
            this.dispatchBeforeRangeChange(this, this, 0);
            for (var i = 0; i < this.length; i++) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, i, this[i]);
                this.dispatchBeforeMapChange(i, this[i]);
            }

            // actual work
            array_sort.apply(this, arguments);

            // dispatch after change events
            for (var i = 0; i < this.length; i++) {
                PropertyChanges.dispatchOwnPropertyChange(this, i, this[i]);
                this.dispatchMapChange(i, this[i]);
            }
            this.dispatchRangeChange(this, this, 0);

            return this;
        },
        writable: true,
        configurable: true
    },

    swap: {
        value: function swap(start, length, plus) {
            if (plus) {
                if (!Array.isArray(plus)) {
                    plus = array_slice.call(plus);
                }
            } else {
                plus = EMPTY_ARRAY;
            }

            if (start < 0) {
                start = this.length + start;
            } else if (start > this.length) {
                var holes = start - this.length;
                var newPlus = Array(holes + plus.length);
                for (var i = 0, j = holes; i < plus.length; i++, j++) {
                    if (i in plus) {
                        newPlus[j] = plus[i];
                    }
                }
                plus = newPlus;
                start = this.length;
            }

            var minus;
            if (length === 0) {
                // minus will be empty
                if (plus.length === 0) {
                    // at this point if plus is empty there is nothing to do.
                    return []; // [], but spare us an instantiation
                }
                minus = EMPTY_ARRAY;
            } else {
                minus = array_slice.call(this, start, start + length);
            }
            var diff = plus.length - minus.length;
            var oldLength = this.length;
            var newLength = Math.max(this.length + diff, start + plus.length);
            var longest = Math.max(oldLength, newLength);

            // dispatch before change events
            if (diff) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, "length", this.length);
            }
            this.dispatchBeforeRangeChange(plus, minus, start);
            if (diff === 0) { // substring replacement
                for (var i = start; i < start + plus.length; i++) {
                    PropertyChanges.dispatchBeforeOwnPropertyChange(this, i, this[i]);
                    this.dispatchBeforeMapChange(i, this[i]);
                }
            } else if (PropertyChanges.hasOwnPropertyChangeDescriptor(this)) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                for (var i = start; i < longest; i++) {
                    PropertyChanges.dispatchBeforeOwnPropertyChange(this, i, this[i]);
                    this.dispatchBeforeMapChange(i, this[i]);
                }
            }

            // actual work
            if (start > oldLength) {
                this.length = start;
            }
            var result = array_swap.call(this, start, length, plus);

            // dispatch after change events
            if (diff === 0) { // substring replacement
                for (var i = start; i < start + plus.length; i++) {
                    PropertyChanges.dispatchOwnPropertyChange(this, i, this[i]);
                    this.dispatchMapChange(i, this[i]);
                }
            } else if (PropertyChanges.hasOwnPropertyChangeDescriptor(this)) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                for (var i = start; i < longest; i++) {
                    PropertyChanges.dispatchOwnPropertyChange(this, i, this[i]);
                    this.dispatchMapChange(i, this[i]);
                }
            }
            this.dispatchRangeChange(plus, minus, start);
            if (diff) {
                PropertyChanges.dispatchOwnPropertyChange(this, "length", this.length);
            }

            return result;
        },
        writable: true,
        configurable: true
    },

    splice: {
        value: function splice(start, length) {
            // start parameter should be min(start, this.length)
            // http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.12
            if (start > this.length) {
                start = this.length;
            }
            return this.swap.call(this, start, length, array_slice.call(arguments, 2));
        },
        writable: true,
        configurable: true
    },

    // splice is the array content change utility belt.  forward all other
    // content changes to splice so we only have to write observer code in one
    // place

    set: {
        value: function set(index, value) {
            this.swap(index, index >= this.length ? 0 : 1, [value]);
            return true;
        },
        writable: true,
        configurable: true
    },

    shift: {
        value: function shift() {
            return this.splice(0, 1)[0];
        },
        writable: true,
        configurable: true
    },

    pop: {
        value: function pop() {
            if (this.length) {
                return this.splice(this.length - 1, 1)[0];
            }
        },
        writable: true,
        configurable: true
    },

    push: {
        value: function push(arg) {
            if (arguments.length === 1) {
                return this.splice(this.length, 0, arg);
            } else {
                var args = array_slice.call(arguments);
                return this.swap(this.length, 0, args);
            }
        },
        writable: true,
        configurable: true
    },

    unshift: {
        value: function unshift(arg) {
            if (arguments.length === 1) {
                return this.splice(0, 0, arg);
            } else {
                var args = array_slice.call(arguments);
                return this.swap(0, 0, args);
            }
        },
        writable: true,
        configurable: true
    },

    clear: {
        value: function clear() {
            return this.splice(0, this.length);
        },
        writable: true,
        configurable: true
    }

};

var ChangeDispatchArray = Object.create(Array.prototype, observableArrayProperties);

}],["collections","listen/map-changes",{"weak-map":35,"../list":13,"../dict":2},function (require, exports, module){

// collections listen/map-changes
// ------------------------------

"use strict";

var WeakMap = require("weak-map");
var List = require("../list");

module.exports = MapChanges;
function MapChanges() {
    throw new Error("Can't construct. MapChanges is a mixin.");
}

var object_owns = Object.prototype.hasOwnProperty;

/*
    Object map change descriptors carry information necessary for adding,
    removing, dispatching, and shorting events to listeners for map changes
    for a particular key on a particular object.  These descriptors are used
    here for shallow map changes.

    {
        willChangeListeners:Array(Function)
        changeListeners:Array(Function)
    }
*/

var mapChangeDescriptors = new WeakMap();

MapChanges.prototype.getAllMapChangeDescriptors = function () {
    var Dict = require("../dict");
    if (!mapChangeDescriptors.has(this)) {
        mapChangeDescriptors.set(this, Dict());
    }
    return mapChangeDescriptors.get(this);
};

MapChanges.prototype.getMapChangeDescriptor = function (token) {
    var tokenChangeDescriptors = this.getAllMapChangeDescriptors();
    token = token || "";
    if (!tokenChangeDescriptors.has(token)) {
        tokenChangeDescriptors.set(token, {
            willChangeListeners: new List(),
            changeListeners: new List()
        });
    }
    return tokenChangeDescriptors.get(token);
};

MapChanges.prototype.addMapChangeListener = function (listener, token, beforeChange) {
    if (!this.isObservable && this.makeObservable) {
        // for Array
        this.makeObservable();
    }
    var descriptor = this.getMapChangeDescriptor(token);
    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }
    listeners.push(listener);
    Object.defineProperty(this, "dispatchesMapChanges", {
        value: true,
        writable: true,
        configurable: true,
        enumerable: false
    });

    var self = this;
    return function cancelMapChangeListener() {
        if (!self) {
            // TODO throw new Error("Can't remove map change listener again");
            return;
        }
        self.removeMapChangeListener(listener, token, beforeChange);
        self = null;
    };
};

MapChanges.prototype.removeMapChangeListener = function (listener, token, beforeChange) {
    var descriptor = this.getMapChangeDescriptor(token);

    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }

    var node = listeners.findLast(listener);
    if (!node) {
        throw new Error("Can't remove map change listener: does not exist: token " + JSON.stringify(token));
    }
    node["delete"]();
};

MapChanges.prototype.dispatchMapChange = function (key, value, beforeChange) {
    var descriptors = this.getAllMapChangeDescriptors();
    var changeName = "Map" + (beforeChange ? "WillChange" : "Change");
    descriptors.forEach(function (descriptor, token) {

        if (descriptor.isActive) {
            return;
        } else {
            descriptor.isActive = true;
        }

        var listeners;
        if (beforeChange) {
            listeners = descriptor.willChangeListeners;
        } else {
            listeners = descriptor.changeListeners;
        }

        var tokenName = "handle" + (
            token.slice(0, 1).toUpperCase() +
            token.slice(1)
        ) + changeName;

        try {
            // dispatch to each listener
            listeners.forEach(function (listener) {
                if (listener[tokenName]) {
                    listener[tokenName](value, key, this);
                } else if (listener.call) {
                    listener.call(listener, value, key, this);
                } else {
                    throw new Error("Handler " + listener + " has no method " + tokenName + " and is not callable");
                }
            }, this);
        } finally {
            descriptor.isActive = false;
        }

    }, this);
};

MapChanges.prototype.addBeforeMapChangeListener = function (listener, token) {
    return this.addMapChangeListener(listener, token, true);
};

MapChanges.prototype.removeBeforeMapChangeListener = function (listener, token) {
    return this.removeMapChangeListener(listener, token, true);
};

MapChanges.prototype.dispatchBeforeMapChange = function (key, value) {
    return this.dispatchMapChange(key, value, true);
};

}],["collections","listen/property-changes",{"../shim":23,"weak-map":35},function (require, exports, module){

// collections listen/property-changes
// -----------------------------------

/*
    Based in part on observable arrays from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/

/*
    This module is responsible for observing changes to owned properties of
    objects and changes to the content of arrays caused by method calls.
    The interface for observing array content changes establishes the methods
    necessary for any collection with observable content.
*/

require("../shim");
var WeakMap = require("weak-map");

var object_owns = Object.prototype.hasOwnProperty;

/*
    Object property descriptors carry information necessary for adding,
    removing, dispatching, and shorting events to listeners for property changes
    for a particular key on a particular object.  These descriptors are used
    here for shallow property changes.

    {
        willChangeListeners:Array(Function)
        changeListeners:Array(Function)
    }
*/
var propertyChangeDescriptors = new WeakMap();

// Maybe remove entries from this table if the corresponding object no longer
// has any property change listeners for any key.  However, the cost of
// book-keeping is probably not warranted since it would be rare for an
// observed object to no longer be observed unless it was about to be disposed
// of or reused as an observable.  The only benefit would be in avoiding bulk
// calls to dispatchOwnPropertyChange events on objects that have no listeners.

/*
    To observe shallow property changes for a particular key of a particular
    object, we install a property descriptor on the object that overrides the previous
    descriptor.  The overridden descriptors are stored in this weak map.  The
    weak map associates an object with another object that maps property names
    to property descriptors.

    overriddenObjectDescriptors.get(object)[key]

    We retain the old descriptor for various purposes.  For one, if the property
    is no longer being observed by anyone, we revert the property descriptor to
    the original.  For "value" descriptors, we store the actual value of the
    descriptor on the overridden descriptor, so when the property is reverted, it
    retains the most recently set value.  For "get" and "set" descriptors,
    we observe then forward "get" and "set" operations to the original descriptor.
*/
var overriddenObjectDescriptors = new WeakMap();

module.exports = PropertyChanges;

function PropertyChanges() {
    throw new Error("This is an abstract interface. Mix it. Don't construct it");
}

PropertyChanges.debug = true;

PropertyChanges.prototype.getOwnPropertyChangeDescriptor = function (key) {
    if (!propertyChangeDescriptors.has(this)) {
        propertyChangeDescriptors.set(this, {});
    }
    var objectPropertyChangeDescriptors = propertyChangeDescriptors.get(this);
    if (!object_owns.call(objectPropertyChangeDescriptors, key)) {
        objectPropertyChangeDescriptors[key] = {
            willChangeListeners: [],
            changeListeners: []
        };
    }
    return objectPropertyChangeDescriptors[key];
};

PropertyChanges.prototype.hasOwnPropertyChangeDescriptor = function (key) {
    if (!propertyChangeDescriptors.has(this)) {
        return false;
    }
    if (!key) {
        return true;
    }
    var objectPropertyChangeDescriptors = propertyChangeDescriptors.get(this);
    if (!object_owns.call(objectPropertyChangeDescriptors, key)) {
        return false;
    }
    return true;
};

PropertyChanges.prototype.addOwnPropertyChangeListener = function (key, listener, beforeChange) {
    if (this.makeObservable && !this.isObservable) {
        this.makeObservable(); // particularly for observable arrays, for
        // their length property
    }
    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);
    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }
    PropertyChanges.makePropertyObservable(this, key);
    listeners.push(listener);

    var self = this;
    return function cancelOwnPropertyChangeListener() {
        PropertyChanges.removeOwnPropertyChangeListener(self, key, listeners, beforeChange);
        self = null;
    };
};

PropertyChanges.prototype.addBeforeOwnPropertyChangeListener = function (key, listener) {
    return PropertyChanges.addOwnPropertyChangeListener(this, key, listener, true);
};

PropertyChanges.prototype.removeOwnPropertyChangeListener = function (key, listener, beforeChange) {
    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);

    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }

    var index = listeners.lastIndexOf(listener);
    if (index === -1) {
        throw new Error("Can't remove property change listener: does not exist: property name" + JSON.stringify(key));
    }
    listeners.splice(index, 1);
};

PropertyChanges.prototype.removeBeforeOwnPropertyChangeListener = function (key, listener) {
    return PropertyChanges.removeOwnPropertyChangeListener(this, key, listener, true);
};

PropertyChanges.prototype.dispatchOwnPropertyChange = function (key, value, beforeChange) {
    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);

    if (descriptor.isActive) {
        return;
    }
    descriptor.isActive = true;

    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }

    var changeName = (beforeChange ? "Will" : "") + "Change";
    var genericHandlerName = "handleProperty" + changeName;
    var propertyName = String(key);
    propertyName = propertyName && propertyName[0].toUpperCase() + propertyName.slice(1);
    var specificHandlerName = "handle" + propertyName + changeName;

    try {
        // dispatch to each listener
        listeners.slice().forEach(function (listener) {
            if (listeners.indexOf(listener) < 0) {
                return;
            }
            var thisp = listener;
            listener = (
                listener[specificHandlerName] ||
                listener[genericHandlerName] ||
                listener
            );
            if (!listener.call) {
                throw new Error("No event listener for " + specificHandlerName + " or " + genericHandlerName + " or call on " + listener);
            }
            listener.call(thisp, value, key, this);
        }, this);
    } finally {
        descriptor.isActive = false;
    }
};

PropertyChanges.prototype.dispatchBeforeOwnPropertyChange = function (key, listener) {
    return PropertyChanges.dispatchOwnPropertyChange(this, key, listener, true);
};

PropertyChanges.prototype.makePropertyObservable = function (key) {
    // arrays are special.  we do not support direct setting of properties
    // on an array.  instead, call .set(index, value).  this is observable.
    // 'length' property is observable for all mutating methods because
    // our overrides explicitly dispatch that change.
    if (Array.isArray(this)) {
        return;
    }

    if (!Object.isExtensible(this, key)) {
        throw new Error("Can't make property " + JSON.stringify(key) + " observable on " + this + " because object is not extensible");
    }

    var state;
    if (typeof this.__state__ === "object") {
        state = this.__state__;
    } else {
        state = {};
        if (Object.isExtensible(this, "__state__")) {
            Object.defineProperty(this, "__state__", {
                value: state,
                writable: true,
                enumerable: false
            });
        }
    }
    state[key] = this[key];

    // memoize overridden property descriptor table
    if (!overriddenObjectDescriptors.has(this)) {
        overriddenPropertyDescriptors = {};
        overriddenObjectDescriptors.set(this, overriddenPropertyDescriptors);
    }
    var overriddenPropertyDescriptors = overriddenObjectDescriptors.get(this);

    if (object_owns.call(overriddenPropertyDescriptors, key)) {
        // if we have already recorded an overridden property descriptor,
        // we have already installed the observer, so short-here
        return;
    }

    // walk up the prototype chain to find a property descriptor for
    // the property name
    var overriddenDescriptor;
    var attached = this;
    var formerDescriptor = Object.getOwnPropertyDescriptor(attached, key);
    do {
        overriddenDescriptor = Object.getOwnPropertyDescriptor(attached, key);
        if (overriddenDescriptor) {
            break;
        }
        attached = Object.getPrototypeOf(attached);
    } while (attached);
    // or default to an undefined value
    overriddenDescriptor = overriddenDescriptor || {
        value: undefined,
        enumerable: true,
        writable: true,
        configurable: true
    };

    if (!overriddenDescriptor.configurable) {
        throw new Error("Can't observe non-configurable properties");
    }

    // memoize the descriptor so we know not to install another layer,
    // and so we can reuse the overridden descriptor when uninstalling
    overriddenPropertyDescriptors[key] = overriddenDescriptor;

    // give up *after* storing the overridden property descriptor so it
    // can be restored by uninstall.  Unwritable properties are
    // silently not overriden.  Since success is indistinguishable from
    // failure, we let it pass but don't waste time on intercepting
    // get/set.
    if (!overriddenDescriptor.writable && !overriddenDescriptor.set) {
        return;
    }

    // TODO reflect current value on a displayed property

    var propertyListener;
    // in both of these new descriptor variants, we reuse the overridden
    // descriptor to either store the current value or apply getters
    // and setters.  this is handy since we can reuse the overridden
    // descriptor if we uninstall the observer.  We even preserve the
    // assignment semantics, where we get the value from up the
    // prototype chain, and set as an owned property.
    if ('value' in overriddenDescriptor) {
        propertyListener = {
            get: function () {
                return overriddenDescriptor.value
            },
            set: function (value) {
                if (value === overriddenDescriptor.value) {
                    return value;
                }
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, key, overriddenDescriptor.value);
                overriddenDescriptor.value = value;
                state[key] = value;
                PropertyChanges.dispatchOwnPropertyChange(this, key, value);
                return value;
            },
            enumerable: overriddenDescriptor.enumerable,
            configurable: true
        };
    } else { // 'get' or 'set', but not necessarily both
        propertyListener = {
            get: function () {
                if (overriddenDescriptor.get) {
                    return overriddenDescriptor.get.apply(this, arguments);
                }
            },
            set: function (value) {
                var formerValue;

                // get the actual former value if possible
                if (overriddenDescriptor.get) {
                    formerValue = overriddenDescriptor.get.apply(this, arguments);
                }
                // call through to actual setter
                if (overriddenDescriptor.set) {
                    overriddenDescriptor.set.apply(this, arguments)
                }
                // use getter, if possible, to discover whether the set
                // was successful
                if (overriddenDescriptor.get) {
                    value = overriddenDescriptor.get.apply(this, arguments);
                    state[key] = value;
                }
                // if it has not changed, suppress a notification
                if (value === formerValue) {
                    return value;
                }
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, key, formerValue);

                // dispatch the new value: the given value if there is
                // no getter, or the actual value if there is one
                PropertyChanges.dispatchOwnPropertyChange(this, key, value);
                return value;
            },
            enumerable: overriddenDescriptor.enumerable,
            configurable: true
        };
    }

    Object.defineProperty(this, key, propertyListener);
};

PropertyChanges.prototype.makePropertyUnobservable = function (key) {
    // arrays are special.  we do not support direct setting of properties
    // on an array.  instead, call .set(index, value).  this is observable.
    // 'length' property is observable for all mutating methods because
    // our overrides explicitly dispatch that change.
    if (Array.isArray(this)) {
        return;
    }

    if (!overriddenObjectDescriptors.has(this)) {
        throw new Error("Can't uninstall observer on property");
    }
    var overriddenPropertyDescriptors = overriddenObjectDescriptors.get(this);

    if (!overriddenPropertyDescriptors[key]) {
        throw new Error("Can't uninstall observer on property");
    }

    var overriddenDescriptor = overriddenPropertyDescriptors[key];
    delete overriddenPropertyDescriptors[key];

    var state;
    if (typeof this.__state__ === "object") {
        state = this.__state__;
    } else {
        state = {};
        if (Object.isExtensible(this, "__state__")) {
            Object.defineProperty(this, "__state__", {
                value: state,
                writable: true,
                enumerable: false
            });
        }
    }
    delete state[key];

    Object.defineProperty(this, key, overriddenDescriptor);
};

// constructor functions

PropertyChanges.getOwnPropertyChangeDescriptor = function (object, key) {
    if (object.getOwnPropertyChangeDescriptor) {
        return object.getOwnPropertyChangeDescriptor(key);
    } else {
        return PropertyChanges.prototype.getOwnPropertyChangeDescriptor.call(object, key);
    }
};

PropertyChanges.hasOwnPropertyChangeDescriptor = function (object, key) {
    if (object.hasOwnPropertyChangeDescriptor) {
        return object.hasOwnPropertyChangeDescriptor(key);
    } else {
        return PropertyChanges.prototype.hasOwnPropertyChangeDescriptor.call(object, key);
    }
};

PropertyChanges.addOwnPropertyChangeListener = function (object, key, listener, beforeChange) {
    if (!Object.isObject(object)) {
    } else if (object.addOwnPropertyChangeListener) {
        return object.addOwnPropertyChangeListener(key, listener, beforeChange);
    } else {
        return PropertyChanges.prototype.addOwnPropertyChangeListener.call(object, key, listener, beforeChange);
    }
};

PropertyChanges.removeOwnPropertyChangeListener = function (object, key, listener, beforeChange) {
    if (!Object.isObject(object)) {
    } else if (object.removeOwnPropertyChangeListener) {
        return object.removeOwnPropertyChangeListener(key, listener, beforeChange);
    } else {
        return PropertyChanges.prototype.removeOwnPropertyChangeListener.call(object, key, listener, beforeChange);
    }
};

PropertyChanges.dispatchOwnPropertyChange = function (object, key, value, beforeChange) {
    if (!Object.isObject(object)) {
    } else if (object.dispatchOwnPropertyChange) {
        return object.dispatchOwnPropertyChange(key, value, beforeChange);
    } else {
        return PropertyChanges.prototype.dispatchOwnPropertyChange.call(object, key, value, beforeChange);
    }
};

PropertyChanges.addBeforeOwnPropertyChangeListener = function (object, key, listener) {
    return PropertyChanges.addOwnPropertyChangeListener(object, key, listener, true);
};

PropertyChanges.removeBeforeOwnPropertyChangeListener = function (object, key, listener) {
    return PropertyChanges.removeOwnPropertyChangeListener(object, key, listener, true);
};

PropertyChanges.dispatchBeforeOwnPropertyChange = function (object, key, value) {
    return PropertyChanges.dispatchOwnPropertyChange(object, key, value, true);
};

PropertyChanges.makePropertyObservable = function (object, key) {
    if (object.makePropertyObservable) {
        return object.makePropertyObservable(key);
    } else {
        return PropertyChanges.prototype.makePropertyObservable.call(object, key);
    }
};

PropertyChanges.makePropertyUnobservable = function (object, key) {
    if (object.makePropertyUnobservable) {
        return object.makePropertyUnobservable(key);
    } else {
        return PropertyChanges.prototype.makePropertyUnobservable.call(object, key);
    }
};

}],["collections","listen/range-changes",{"weak-map":35,"../dict":2},function (require, exports, module){

// collections listen/range-changes
// --------------------------------

"use strict";

var WeakMap = require("weak-map");
var Dict = require("../dict");

var rangeChangeDescriptors = new WeakMap(); // {isActive, willChangeListeners, changeListeners}

module.exports = RangeChanges;
function RangeChanges() {
    throw new Error("Can't construct. RangeChanges is a mixin.");
}

RangeChanges.prototype.getAllRangeChangeDescriptors = function () {
    if (!rangeChangeDescriptors.has(this)) {
        rangeChangeDescriptors.set(this, Dict());
    }
    return rangeChangeDescriptors.get(this);
};

RangeChanges.prototype.getRangeChangeDescriptor = function (token) {
    var tokenChangeDescriptors = this.getAllRangeChangeDescriptors();
    token = token || "";
    if (!tokenChangeDescriptors.has(token)) {
        tokenChangeDescriptors.set(token, {
            isActive: false,
            changeListeners: [],
            willChangeListeners: []
        });
    }
    return tokenChangeDescriptors.get(token);
};

RangeChanges.prototype.addRangeChangeListener = function (listener, token, beforeChange) {
    // a concession for objects like Array that are not inherently observable
    if (!this.isObservable && this.makeObservable) {
        this.makeObservable();
    }

    var descriptor = this.getRangeChangeDescriptor(token);

    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }

    // even if already registered
    listeners.push(listener);
    Object.defineProperty(this, "dispatchesRangeChanges", {
        value: true,
        writable: true,
        configurable: true,
        enumerable: false
    });

    var self = this;
    return function cancelRangeChangeListener() {
        if (!self) {
            // TODO throw new Error("Range change listener " + JSON.stringify(token) + " has already been canceled");
            return;
        }
        self.removeRangeChangeListener(listener, token, beforeChange);
        self = null;
    };
};

RangeChanges.prototype.removeRangeChangeListener = function (listener, token, beforeChange) {
    var descriptor = this.getRangeChangeDescriptor(token);

    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    } else {
        listeners = descriptor.changeListeners;
    }

    var index = listeners.lastIndexOf(listener);
    if (index === -1) {
        throw new Error("Can't remove range change listener: does not exist: token " + JSON.stringify(token));
    }
    listeners.splice(index, 1);
};

RangeChanges.prototype.dispatchRangeChange = function (plus, minus, index, beforeChange) {
    var descriptors = this.getAllRangeChangeDescriptors();
    var changeName = "Range" + (beforeChange ? "WillChange" : "Change");
    descriptors.forEach(function (descriptor, token) {

        if (descriptor.isActive) {
            return;
        } else {
            descriptor.isActive = true;
        }

        // before or after
        var listeners;
        if (beforeChange) {
            listeners = descriptor.willChangeListeners;
        } else {
            listeners = descriptor.changeListeners;
        }

        var tokenName = "handle" + (
            token.slice(0, 1).toUpperCase() +
            token.slice(1)
        ) + changeName;
        // notably, defaults to "handleRangeChange" or "handleRangeWillChange"
        // if token is "" (the default)

        // dispatch each listener
        try {
            listeners.slice().forEach(function (listener) {
                if (listeners.indexOf(listener) < 0) {
                    return;
                }
                if (listener[tokenName]) {
                    listener[tokenName](plus, minus, index, this, beforeChange);
                } else if (listener.call) {
                    listener.call(this, plus, minus, index, this, beforeChange);
                } else {
                    throw new Error("Handler " + listener + " has no method " + tokenName + " and is not callable");
                }
            }, this);
        } finally {
            descriptor.isActive = false;
        }
    }, this);
};

RangeChanges.prototype.addBeforeRangeChangeListener = function (listener, token) {
    return this.addRangeChangeListener(listener, token, true);
};

RangeChanges.prototype.removeBeforeRangeChangeListener = function (listener, token) {
    return this.removeRangeChangeListener(listener, token, true);
};

RangeChanges.prototype.dispatchBeforeRangeChange = function (plus, minus, index) {
    return this.dispatchRangeChange(plus, minus, index, true);
};

}],["collections","lru-map",{"./shim":23,"./lru-set":19,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"lru-map":18},function (require, exports, module){

// collections lru-map
// -------------------

"use strict";

var Shim = require("./shim");
var LruSet = require("./lru-set");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

module.exports = LruMap;

function LruMap(values, maxLength, equals, hash, getDefault) {
    if (!(this instanceof LruMap)) {
        return new LruMap(values, maxLength, equals, hash, getDefault);
    }
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.store = new LruSet(
        undefined,
        maxLength,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function keyHash(item) {
            return hash(item.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

LruMap.LruMap = LruMap; // hack so require("lru-map").LruMap will work in MontageJS

Object.addEach(LruMap.prototype, GenericCollection.prototype);
Object.addEach(LruMap.prototype, GenericMap.prototype);
Object.addEach(LruMap.prototype, PropertyChanges.prototype);

LruMap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.maxLength,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

LruMap.prototype.log = function (charmap, stringify) {
    stringify = stringify || this.stringify;
    this.store.log(charmap, stringify);
};

LruMap.prototype.stringify = function (item, leader) {
    return leader + JSON.stringify(item.key) + ": " + JSON.stringify(item.value);
};

LruMap.prototype.addMapChangeListener = function () {
    if (!this.dispatchesMapChanges) {
        // Detect LRU deletions in the LruSet and emit as MapChanges.
        // Array and Heap have no store.
        // Dict and FastMap define no listeners on their store.
        var self = this;
        this.store.addBeforeRangeChangeListener(function(plus, minus) {
            if (plus.length && minus.length) {  // LRU item pruned
                self.dispatchBeforeMapChange(minus[0].key, undefined);
            }
        });
        this.store.addRangeChangeListener(function(plus, minus) {
            if (plus.length && minus.length) {
                self.dispatchMapChange(minus[0].key, undefined);
            }
        });
    }
    GenericMap.prototype.addMapChangeListener.apply(this, arguments);
};

}],["collections","lru-set",{"./shim":23,"./set":22,"./generic-collection":5,"./generic-set":8,"./listen/property-changes":16,"./listen/range-changes":17,"lru-set":19},function (require, exports, module){

// collections lru-set
// -------------------

"use strict";

var Shim = require("./shim");
var Set = require("./set");
var GenericCollection = require("./generic-collection");
var GenericSet = require("./generic-set");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");

module.exports = LruSet;

function LruSet(values, capacity, equals, hash, getDefault) {
    if (!(this instanceof LruSet)) {
        return new LruSet(values, capacity, equals, hash, getDefault);
    }
    capacity = capacity || Infinity;
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.store = new Set(undefined, equals, hash);
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.capacity = capacity;
    this.length = 0;
    this.addEach(values);
}

LruSet.LruSet = LruSet; // hack so require("lru-set").LruSet will work in MontageJS

Object.addEach(LruSet.prototype, GenericCollection.prototype);
Object.addEach(LruSet.prototype, GenericSet.prototype);
Object.addEach(LruSet.prototype, PropertyChanges.prototype);
Object.addEach(LruSet.prototype, RangeChanges.prototype);

LruSet.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.capacity,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

LruSet.prototype.has = function (value) {
    return this.store.has(value);
};

LruSet.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("LruSet#get does not support second argument: equals");
    }
    value = this.store.get(value);
    if (value !== undefined) {
        this.store["delete"](value);
        this.store.add(value);
    } else {
        value = this.getDefault(value);
    }
    return value;
};

LruSet.prototype.add = function (value) {
    var found = this.store.has(value);
    var plus = [], minus = [], eldest;
    // if the value already exists, we delete it and add it back again so it
    // appears at the end of the list of values to truncate
    if (found) {    // update
        this.store["delete"](value);
        this.store.add(value);
    } else if (this.capacity > 0) {    // add
        // because minus is constructed before adding value, we must ensure the
        // set has positive length. hence the capacity check.
        plus.push(value);
        if (this.length >= this.capacity) {
            eldest = this.store.order.head.next;
            minus.push(eldest.value);
        }
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange(plus, minus, 0);
        }
        this.store.add(value);
        if (minus.length > 0) {
            this.store['delete'](eldest.value);
        }
        // only assign to length once to avoid jitter on length observers
        this.length = this.length + plus.length - minus.length;
        // after change
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange(plus, minus, 0);
        }
    }
    // whether it grew
    return plus.length !== minus.length;
};

LruSet.prototype["delete"] = function (value, equals) {
    if (equals) {
        throw new Error("LruSet#delete does not support second argument: equals");
    }
    var found = this.store.has(value);
    if (found) {
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([], [value], 0);
        }
        this.store["delete"](value);
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([], [value], 0);
        }
    }
    return found;
};

LruSet.prototype.one = function () {
    if (this.length > 0) {
        return this.store.one();
    }
};

LruSet.prototype.clear = function () {
    this.store.clear();
    this.length = 0;
};

LruSet.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var set = this.store;
    var index = 0;
    return set.reduce(function (basis, value) {
        return callback.call(thisp, basis, value, index++, this);
    }, basis, this);
};

LruSet.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var set = this.store;
    var index = this.length - 1;
    return set.reduceRight(function (basis, value) {
        return callback.call(thisp, basis, value, index--, this);
    }, basis, this);
};

LruSet.prototype.iterate = function () {
    return this.store.iterate();
};

}],["collections","map",{"./shim":23,"./set":22,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"map":20},function (require, exports, module){

// collections map
// ---------------

"use strict";

var Shim = require("./shim");
var Set = require("./set");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

module.exports = Map;

function Map(values, equals, hash, getDefault) {
    if (!(this instanceof Map)) {
        return new Map(values, equals, hash, getDefault);
    }
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.store = new Set(
        undefined,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function keyHash(item) {
            return hash(item.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

Map.Map = Map; // hack so require("map").Map will work in MontageJS

Object.addEach(Map.prototype, GenericCollection.prototype);
Object.addEach(Map.prototype, GenericMap.prototype); // overrides GenericCollection
Object.addEach(Map.prototype, PropertyChanges.prototype);

Map.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

Map.prototype.log = function (charmap, logNode, callback, thisp) {
    logNode = logNode || this.logNode;
    this.store.log(charmap, function (node, log, logBefore) {
        logNode(node.value.value, log, logBefore);
    }, callback, thisp);
};

Map.prototype.logNode = function (node, log) {
    log(' key: ' + node.key);
    log(' value: ' + node.value);
};

}],["collections","multi-map",{"./map":20,"multi-map":21},function (require, exports, module){

// collections multi-map
// ---------------------

"use strict";

var Map = require("./map");

module.exports = MultiMap;
function MultiMap(values, bucket, equals, hash) {
    if (!(this instanceof MultiMap)) {
        return new MultiMap(values, bucket, equals, hash);
    }
    this.bucket = bucket || this.bucket;
    Map.call(this, values, equals, hash, function getDefault(key) {
        var bucket = this.bucket();
        Map.prototype.set.call(this, key, bucket);
        return bucket;
    });
}

MultiMap.MultiMap = MultiMap; // hack so require("multi-map").MultiMap will work in MontageJS

MultiMap.prototype = Object.create(Map.prototype);

MultiMap.prototype.constructor = MultiMap;

MultiMap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.bucket,
        this.contentEquals,
        this.contentHash
    );
};

MultiMap.prototype.set = function (key, newValues) {
    var values = this.get(key);
    values.swap(0, values.length, newValues);
};

MultiMap.prototype.bucket = function (key) {
    return [];
};

}],["collections","set",{"./shim":23,"./list":13,"./fast-set":4,"./generic-collection":5,"./generic-set":8,"./listen/property-changes":16,"./listen/range-changes":17,"set":22},function (require, exports, module){

// collections set
// ---------------

"use strict";

var Shim = require("./shim");
var List = require("./list");
var FastSet = require("./fast-set");
var GenericCollection = require("./generic-collection");
var GenericSet = require("./generic-set");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");

module.exports = Set;

function Set(values, equals, hash, getDefault) {
    if (!(this instanceof Set)) {
        return new Set(values, equals, hash, getDefault);
    }
    equals = equals || Object.equals;
    hash = hash || Object.hash;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    // a list of values in insertion order, used for all operations that depend
    // on iterating in insertion order
    this.order = new this.Order(undefined, equals);
    // a set of nodes from the order list, indexed by the corresponding value,
    // used for all operations that need to quickly seek  value in the list
    this.store = new this.Store(
        undefined,
        function (a, b) {
            return equals(a.value, b.value);
        },
        function (node) {
            return hash(node.value);
        }
    );
    this.length = 0;
    this.addEach(values);
}

Set.Set = Set; // hack so require("set").Set will work in MontageJS

Object.addEach(Set.prototype, GenericCollection.prototype);
Object.addEach(Set.prototype, GenericSet.prototype);
Object.addEach(Set.prototype, PropertyChanges.prototype);
Object.addEach(Set.prototype, RangeChanges.prototype);

Set.prototype.Order = List;
Set.prototype.Store = FastSet;

Set.prototype.constructClone = function (values) {
    return new this.constructor(values, this.contentEquals, this.contentHash, this.getDefault);
};

Set.prototype.has = function (value) {
    var node = new this.order.Node(value);
    return this.store.has(node);
};

Set.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("Set#get does not support second argument: equals");
    }
    var node = new this.order.Node(value);
    node = this.store.get(node);
    if (node) {
        return node.value;
    } else {
        return this.getDefault(value);
    }
};

Set.prototype.add = function (value) {
    var node = new this.order.Node(value);
    if (!this.store.has(node)) {
        var index = this.length;
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([value], [], index);
        }
        this.order.add(value);
        node = this.order.head.prev;
        this.store.add(node);
        this.length++;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([value], [], index);
        }
        return true;
    }
    return false;
};

Set.prototype["delete"] = function (value, equals) {
    if (equals) {
        throw new Error("Set#delete does not support second argument: equals");
    }
    var node = new this.order.Node(value);
    if (this.store.has(node)) {
        var node = this.store.get(node);
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([], [value], node.index);
        }
        this.store["delete"](node); // removes from the set
        this.order.splice(node, 1); // removes the node from the list
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([], [value], node.index);
        }
        return true;
    }
    return false;
};

Set.prototype.pop = function () {
    if (this.length) {
        var result = this.order.head.prev.value;
        this["delete"](result);
        return result;
    }
};

Set.prototype.shift = function () {
    if (this.length) {
        var result = this.order.head.next.value;
        this["delete"](result);
        return result;
    }
};

Set.prototype.one = function () {
    if (this.length > 0) {
        return this.store.one().value;
    }
};

Set.prototype.clear = function () {
    var clearing;
    if (this.dispatchesRangeChanges) {
        clearing = this.toArray();
        this.dispatchBeforeRangeChange([], clearing, 0);
    }
    this.store.clear();
    this.order.clear();
    this.length = 0;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([], clearing, 0);
    }
};

Set.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var list = this.order;
    var index = 0;
    return list.reduce(function (basis, value) {
        return callback.call(thisp, basis, value, index++, this);
    }, basis, this);
};

Set.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var list = this.order;
    var index = this.length - 1;
    return list.reduceRight(function (basis, value) {
        return callback.call(thisp, basis, value, index--, this);
    }, basis, this);
};

Set.prototype.iterate = function () {
    return this.order.iterate();
};

Set.prototype.log = function () {
    var set = this.store;
    return set.log.apply(set, arguments);
};

Set.prototype.makeObservable = function () {
    this.order.makeObservable();
};

}],["collections","shim",{"./shim-array":24,"./shim-object":26,"./shim-function":25,"./shim-regexp":27},function (require, exports, module){

// collections shim
// ----------------


var Array = require("./shim-array");
var Object = require("./shim-object");
var Function = require("./shim-function");
var RegExp = require("./shim-regexp");

}],["collections","shim-array",{"./shim-function":25,"./generic-collection":5,"./generic-order":7,"weak-map":35},function (require, exports, module){

// collections shim-array
// ----------------------

"use strict";

/*
    Based in part on extras from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/

var Function = require("./shim-function");
var GenericCollection = require("./generic-collection");
var GenericOrder = require("./generic-order");
var WeakMap = require("weak-map");

module.exports = Array;

var array_splice = Array.prototype.splice;
var array_slice = Array.prototype.slice;

Array.empty = [];

if (Object.freeze) {
    Object.freeze(Array.empty);
}

Array.from = function (values) {
    var array = [];
    array.addEach(values);
    return array;
};

Array.unzip = function (table) {
    var transpose = [];
    var length = Infinity;
    // compute shortest row
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        table[i] = row.toArray();
        if (row.length < length) {
            length = row.length;
        }
    }
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        for (var j = 0; j < row.length; j++) {
            if (j < length && j in row) {
                transpose[j] = transpose[j] || [];
                transpose[j][i] = row[j];
            }
        }
    }
    return transpose;
};

function define(key, value) {
    Object.defineProperty(Array.prototype, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    });
}

define("addEach", GenericCollection.prototype.addEach);
define("deleteEach", GenericCollection.prototype.deleteEach);
define("toArray", GenericCollection.prototype.toArray);
define("toObject", GenericCollection.prototype.toObject);
define("all", GenericCollection.prototype.all);
define("any", GenericCollection.prototype.any);
define("min", GenericCollection.prototype.min);
define("max", GenericCollection.prototype.max);
define("sum", GenericCollection.prototype.sum);
define("average", GenericCollection.prototype.average);
define("only", GenericCollection.prototype.only);
define("flatten", GenericCollection.prototype.flatten);
define("zip", GenericCollection.prototype.zip);
define("enumerate", GenericCollection.prototype.enumerate);
define("group", GenericCollection.prototype.group);
define("sorted", GenericCollection.prototype.sorted);
define("reversed", GenericCollection.prototype.reversed);

define("constructClone", function (values) {
    var clone = new this.constructor();
    clone.addEach(values);
    return clone;
});

define("has", function (value, equals) {
    return this.find(value, equals) !== -1;
});

define("get", function (index, defaultValue) {
    if (+index !== index)
        throw new Error("Indicies must be numbers");
    if (!index in this) {
        return defaultValue;
    } else {
        return this[index];
    }
});

define("set", function (index, value) {
    this[index] = value;
    return true;
});

define("add", function (value) {
    this.push(value);
    return true;
});

define("delete", function (value, equals) {
    var index = this.find(value, equals);
    if (index !== -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
});

define("find", function (value, equals) {
    equals = equals || this.contentEquals || Object.equals;
    for (var index = 0; index < this.length; index++) {
        if (index in this && equals(this[index], value)) {
            return index;
        }
    }
    return -1;
});

define("findLast", function (value, equals) {
    equals = equals || this.contentEquals || Object.equals;
    var index = this.length;
    do {
        index--;
        if (index in this && equals(this[index], value)) {
            return index;
        }
    } while (index > 0);
    return -1;
});

define("swap", function (start, length, plus) {
    var args, plusLength, i, j, returnValue;
    if (start > this.length) {
        this.length = start;
    }
    if (typeof plus !== "undefined") {
        args = [start, length];
        if (!Array.isArray(plus)) {
            plus = array_slice.call(plus);
        }
        i = 0;
        plusLength = plus.length;
        // 1000 is a magic number, presumed to be smaller than the remaining
        // stack length. For swaps this small, we take the fast path and just
        // use the underlying Array splice. We could measure the exact size of
        // the remaining stack using a try/catch around an unbounded recursive
        // function, but this would defeat the purpose of short-circuiting in
        // the common case.
        if (plusLength < 1000) {
            for (i; i < plusLength; i++) {
                args[i+2] = plus[i];
            }
            return array_splice.apply(this, args);
        } else {
            // Avoid maximum call stack error.
            // First delete the desired entries.
            returnValue = array_splice.apply(this, args);
            // Second batch in 1000s.
            for (i; i < plusLength;) {
                args = [start+i, 0];
                for (j = 2; j < 1002 && i < plusLength; j++, i++) {
                    args[j] = plus[i];
                }
                array_splice.apply(this, args);
            }
            return returnValue;
        }
    // using call rather than apply to cut down on transient objects
    } else if (typeof length !== "undefined") {
        return array_splice.call(this, start, length);
    }  else if (typeof start !== "undefined") {
        return array_splice.call(this, start);
    } else {
        return [];
    }
});

define("peek", function () {
    return this[0];
});

define("poke", function (value) {
    if (this.length > 0) {
        this[0] = value;
    }
});

define("peekBack", function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
});

define("pokeBack", function (value) {
    if (this.length > 0) {
        this[this.length - 1] = value;
    }
});

define("one", function () {
    for (var i in this) {
        if (Object.owns(this, i)) {
            return this[i];
        }
    }
});

define("clear", function () {
    this.length = 0;
    return this;
});

define("compare", function (that, compare) {
    compare = compare || Object.compare;
    var i;
    var length;
    var lhs;
    var rhs;
    var relative;

    if (this === that) {
        return 0;
    }

    if (!that || !Array.isArray(that)) {
        return GenericOrder.prototype.compare.call(this, that, compare);
    }

    length = Math.min(this.length, that.length);

    for (i = 0; i < length; i++) {
        if (i in this) {
            if (!(i in that)) {
                return -1;
            } else {
                lhs = this[i];
                rhs = that[i];
                relative = compare(lhs, rhs);
                if (relative) {
                    return relative;
                }
            }
        } else if (i in that) {
            return 1;
        }
    }

    return this.length - that.length;
});

define("equals", function (that, equals) {
    equals = equals || Object.equals;
    var i = 0;
    var length = this.length;
    var left;
    var right;

    if (this === that) {
        return true;
    }
    if (!that || !Array.isArray(that)) {
        return GenericOrder.prototype.equals.call(this, that);
    }

    if (length !== that.length) {
        return false;
    } else {
        for (; i < length; ++i) {
            if (i in this) {
                if (!(i in that)) {
                    return false;
                }
                left = this[i];
                right = that[i];
                if (!equals(left, right)) {
                    return false;
                }
            } else {
                if (i in that) {
                    return false;
                }
            }
        }
    }
    return true;
});

define("clone", function (depth, memo) {
    if (depth == null) {
        depth = Infinity;
    } else if (depth === 0) {
        return this;
    }
    memo = memo || new WeakMap();
    if (memo.has(this)) {
        return memo.get(this);
    }
    var clone = new Array(this.length);
    memo.set(this, clone);
    for (var i in this) {
        clone[i] = Object.clone(this[i], depth - 1, memo);
    };
    return clone;
});

define("iterate", function (start, end) {
    return new ArrayIterator(this, start, end);
});

define("Iterator", ArrayIterator);

function ArrayIterator(array, start, end) {
    this.array = array;
    this.start = start == null ? 0 : start;
    this.end = end;
};

ArrayIterator.prototype.next = function () {
    if (this.start === (this.end == null ? this.array.length : this.end)) {
        throw StopIteration;
    } else {
        return this.array[this.start++];
    }
};

}],["collections","shim-function",{},function (require, exports, module){

// collections shim-function
// -------------------------


module.exports = Function;

/**
    A utility to reduce unnecessary allocations of <code>function () {}</code>
    in its many colorful variations.  It does nothing and returns
    <code>undefined</code> thus makes a suitable default in some circumstances.

    @function external:Function.noop
*/
Function.noop = function () {
};

/**
    A utility to reduce unnecessary allocations of <code>function (x) {return
    x}</code> in its many colorful but ultimately wasteful parameter name
    variations.

    @function external:Function.identity
    @param {Any} any value
    @returns {Any} that value
*/
Function.identity = function (value) {
    return value;
};

/**
    A utility for creating a comparator function for a particular aspect of a
    figurative class of objects.

    @function external:Function.by
    @param {Function} relation A function that accepts a value and returns a
    corresponding value to use as a representative when sorting that object.
    @param {Function} compare an alternate comparator for comparing the
    represented values.  The default is <code>Object.compare</code>, which
    does a deep, type-sensitive, polymorphic comparison.
    @returns {Function} a comparator that has been annotated with
    <code>by</code> and <code>compare</code> properties so
    <code>sorted</code> can perform a transform that reduces the need to call
    <code>by</code> on each sorted object to just once.
 */
Function.by = function (by , compare) {
    compare = compare || Object.compare;
    by = by || Function.identity;
    var compareBy = function (a, b) {
        return compare(by(a), by(b));
    };
    compareBy.compare = compare;
    compareBy.by = by;
    return compareBy;
};

// TODO document
Function.get = function (key) {
    return function (object) {
        return Object.get(object, key);
    };
};

}],["collections","shim-object",{"weak-map":35},function (require, exports, module){

// collections shim-object
// -----------------------

"use strict";

var WeakMap = require("weak-map");

module.exports = Object;

/*
    Based in part on extras from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/

/**
    Defines extensions to intrinsic <code>Object</code>.
    @see [Object class]{@link external:Object}
*/

/**
    A utility object to avoid unnecessary allocations of an empty object
    <code>{}</code>.  This object is frozen so it is safe to share.

    @object external:Object.empty
*/
Object.empty = Object.freeze(Object.create(null));

/**
    Returns whether the given value is an object, as opposed to a value.
    Unboxed numbers, strings, true, false, undefined, and null are not
    objects.  Arrays are objects.

    @function external:Object.isObject
    @param {Any} value
    @returns {Boolean} whether the given value is an object
*/
Object.isObject = function (object) {
    return Object(object) === object;
};

/**
    Returns the value of an any value, particularly objects that
    implement <code>valueOf</code>.

    <p>Note that, unlike the precedent of methods like
    <code>Object.equals</code> and <code>Object.compare</code> would suggest,
    this method is named <code>Object.getValueOf</code> instead of
    <code>valueOf</code>.  This is a delicate issue, but the basis of this
    decision is that the JavaScript runtime would be far more likely to
    accidentally call this method with no arguments, assuming that it would
    return the value of <code>Object</code> itself in various situations,
    whereas <code>Object.equals(Object, null)</code> protects against this case
    by noting that <code>Object</code> owns the <code>equals</code> property
    and therefore does not delegate to it.

    @function external:Object.getValueOf
    @param {Any} value a value or object wrapping a value
    @returns {Any} the primitive value of that object, if one exists, or passes
    the value through
*/
Object.getValueOf = function (value) {
    if (value && typeof value.valueOf === "function") {
        value = value.valueOf();
    }
    return value;
};

var hashMap = new WeakMap();
Object.hash = function (object) {
    if (object && typeof object.hash === "function") {
        return "" + object.hash();
    } else if (Object(object) === object) {
        if (!hashMap.has(object)) {
            hashMap.set(object, Math.random().toString(36).slice(2));
        }
        return hashMap.get(object);
    } else {
        return "" + object;
    }
};

/**
    A shorthand for <code>Object.prototype.hasOwnProperty.call(object,
    key)</code>.  Returns whether the object owns a property for the given key.
    It does not consult the prototype chain and works for any string (including
    "hasOwnProperty") except "__proto__".

    @function external:Object.owns
    @param {Object} object
    @param {String} key
    @returns {Boolean} whether the object owns a property wfor the given key.
*/
var owns = Object.prototype.hasOwnProperty;
Object.owns = function (object, key) {
    return owns.call(object, key);
};

/**
    A utility that is like Object.owns but is also useful for finding
    properties on the prototype chain, provided that they do not refer to
    methods on the Object prototype.  Works for all strings except "__proto__".

    <p>Alternately, you could use the "in" operator as long as the object
    descends from "null" instead of the Object.prototype, as with
    <code>Object.create(null)</code>.  However,
    <code>Object.create(null)</code> only works in fully compliant EcmaScript 5
    JavaScript engines and cannot be faithfully shimmed.

    <p>If the given object is an instance of a type that implements a method
    named "has", this function defers to the collection, so this method can be
    used to generically handle objects, arrays, or other collections.  In that
    case, the domain of the key depends on the instance.

    @param {Object} object
    @param {String} key
    @returns {Boolean} whether the object, or any of its prototypes except
    <code>Object.prototype</code>
    @function external:Object.has
*/
Object.has = function (object, key) {
    if (typeof object !== "object") {
        throw new Error("Object.has can't accept non-object: " + typeof object);
    }
    // forward to mapped collections that implement "has"
    if (object && typeof object.has === "function") {
        return object.has(key);
    // otherwise report whether the key is on the prototype chain,
    // as long as it is not one of the methods on object.prototype
    } else if (typeof key === "string") {
        return key in object && object[key] !== Object.prototype[key];
    } else {
        throw new Error("Key must be a string for Object.has on plain objects");
    }
};

/**
    Gets the value for a corresponding key from an object.

    <p>Uses Object.has to determine whether there is a corresponding value for
    the given key.  As such, <code>Object.get</code> is capable of retriving
    values from the prototype chain as long as they are not from the
    <code>Object.prototype</code>.

    <p>If there is no corresponding value, returns the given default, which may
    be <code>undefined</code>.

    <p>If the given object is an instance of a type that implements a method
    named "get", this function defers to the collection, so this method can be
    used to generically handle objects, arrays, or other collections.  In that
    case, the domain of the key depends on the implementation.  For a `Map`,
    for example, the key might be any object.

    @param {Object} object
    @param {String} key
    @param {Any} value a default to return, <code>undefined</code> if omitted
    @returns {Any} value for key, or default value
    @function external:Object.get
*/
Object.get = function (object, key, value) {
    if (typeof object !== "object") {
        throw new Error("Object.get can't accept non-object: " + typeof object);
    }
    // forward to mapped collections that implement "get"
    if (object && typeof object.get === "function") {
        return object.get(key, value);
    } else if (Object.has(object, key)) {
        return object[key];
    } else {
        return value;
    }
};

/**
    Sets the value for a given key on an object.

    <p>If the given object is an instance of a type that implements a method
    named "set", this function defers to the collection, so this method can be
    used to generically handle objects, arrays, or other collections.  As such,
    the key domain varies by the object type.

    @param {Object} object
    @param {String} key
    @param {Any} value
    @returns <code>undefined</code>
    @function external:Object.set
*/
Object.set = function (object, key, value) {
    if (object && typeof object.set === "function") {
        object.set(key, value);
    } else {
        object[key] = value;
    }
};

Object.addEach = function (target, source) {
    if (!source) {
    } else if (typeof source.forEach === "function" && !source.hasOwnProperty("forEach")) {
        // copy map-alikes
        if (typeof source.keys === "function") {
            source.forEach(function (value, key) {
                target[key] = value;
            });
        // iterate key value pairs of other iterables
        } else {
            source.forEach(function (pair) {
                target[pair[0]] = pair[1];
            });
        }
    } else {
        // copy other objects as map-alikes
        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });
    }
    return target;
};

/**
    Iterates over the owned properties of an object.

    @function external:Object.forEach
    @param {Object} object an object to iterate.
    @param {Function} callback a function to call for every key and value
    pair in the object.  Receives <code>value</code>, <code>key</code>,
    and <code>object</code> as arguments.
    @param {Object} thisp the <code>this</code> to pass through to the
    callback
*/
Object.forEach = function (object, callback, thisp) {
    Object.keys(object).forEach(function (key) {
        callback.call(thisp, object[key], key, object);
    });
};

/**
    Iterates over the owned properties of a map, constructing a new array of
    mapped values.

    @function external:Object.map
    @param {Object} object an object to iterate.
    @param {Function} callback a function to call for every key and value
    pair in the object.  Receives <code>value</code>, <code>key</code>,
    and <code>object</code> as arguments.
    @param {Object} thisp the <code>this</code> to pass through to the
    callback
    @returns {Array} the respective values returned by the callback for each
    item in the object.
*/
Object.map = function (object, callback, thisp) {
    return Object.keys(object).map(function (key) {
        return callback.call(thisp, object[key], key, object);
    });
};

/**
    Returns the values for owned properties of an object.

    @function external:Object.map
    @param {Object} object
    @returns {Array} the respective value for each owned property of the
    object.
*/
Object.values = function (object) {
    return Object.map(object, Function.identity);
};

// TODO inline document concat
Object.concat = function () {
    var object = {};
    for (var i = 0; i < arguments.length; i++) {
        Object.addEach(object, arguments[i]);
    }
    return object;
};

Object.from = Object.concat;

/**
    Returns whether two values are identical.  Any value is identical to itself
    and only itself.  This is much more restictive than equivalence and subtly
    different than strict equality, <code>===</code> because of edge cases
    including negative zero and <code>NaN</code>.  Identity is useful for
    resolving collisions among keys in a mapping where the domain is any value.
    This method does not delgate to any method on an object and cannot be
    overridden.
    @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
    @param {Any} this
    @param {Any} that
    @returns {Boolean} whether this and that are identical
    @function external:Object.is
*/
Object.is = function (x, y) {
    if (x === y) {
        // 0 === -0, but they are not identical
        return x !== 0 || 1 / x === 1 / y;
    }
    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    return x !== x && y !== y;
};

/**
    Performs a polymorphic, type-sensitive deep equivalence comparison of any
    two values.

    <p>As a basic principle, any value is equivalent to itself (as in
    identity), any boxed version of itself (as a <code>new Number(10)</code> is
    to 10), and any deep clone of itself.

    <p>Equivalence has the following properties:

    <ul>
        <li><strong>polymorphic:</strong>
            If the given object is an instance of a type that implements a
            methods named "equals", this function defers to the method.  So,
            this function can safely compare any values regardless of type,
            including undefined, null, numbers, strings, any pair of objects
            where either implements "equals", or object literals that may even
            contain an "equals" key.
        <li><strong>type-sensitive:</strong>
            Incomparable types are not equal.  No object is equivalent to any
            array.  No string is equal to any other number.
        <li><strong>deep:</strong>
            Collections with equivalent content are equivalent, recursively.
        <li><strong>equivalence:</strong>
            Identical values and objects are equivalent, but so are collections
            that contain equivalent content.  Whether order is important varies
            by type.  For Arrays and lists, order is important.  For Objects,
            maps, and sets, order is not important.  Boxed objects are mutally
            equivalent with their unboxed values, by virtue of the standard
            <code>valueOf</code> method.
    </ul>
    @param this
    @param that
    @returns {Boolean} whether the values are deeply equivalent
    @function external:Object.equals
*/
Object.equals = function (a, b, equals, memo) {
    equals = equals || Object.equals;
    // unbox objects, but do not confuse object literals
    a = Object.getValueOf(a);
    b = Object.getValueOf(b);
    if (a === b)
        return true;
    if (Object.isObject(a)) {
        memo = memo || new WeakMap();
        if (memo.has(a)) {
            return true;
        }
        memo.set(a, true);
    }
    if (Object.isObject(a) && typeof a.equals === "function") {
        return a.equals(b, equals, memo);
    }
    // commutative
    if (Object.isObject(b) && typeof b.equals === "function") {
        return b.equals(a, equals, memo);
    }
    if (Object.isObject(a) && Object.isObject(b)) {
        if (Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
            for (var name in a) {
                if (!equals(a[name], b[name], equals, memo)) {
                    return false;
                }
            }
            for (var name in b) {
                if (!(name in a) || !equals(b[name], a[name], equals, memo)) {
                    return false;
                }
            }
            return true;
        }
    }
    // NaN !== NaN, but they are equal.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    // We have established that a !== b, but if a !== a && b !== b, they are
    // both NaN.
    if (a !== a && b !== b)
        return true;
    if (!a || !b)
        return a === b;
    return false;
};

// Because a return value of 0 from a `compare` function  may mean either
// "equals" or "is incomparable", `equals` cannot be defined in terms of
// `compare`.  However, `compare` *can* be defined in terms of `equals` and
// `lessThan`.  Again however, more often it would be desirable to implement
// all of the comparison functions in terms of compare rather than the other
// way around.

/**
    Determines the order in which any two objects should be sorted by returning
    a number that has an analogous relationship to zero as the left value to
    the right.  That is, if the left is "less than" the right, the returned
    value will be "less than" zero, where "less than" may be any other
    transitive relationship.

    <p>Arrays are compared by the first diverging values, or by length.

    <p>Any two values that are incomparable return zero.  As such,
    <code>equals</code> should not be implemented with <code>compare</code>
    since incomparability is indistinguishable from equality.

    <p>Sorts strings lexicographically.  This is not suitable for any
    particular international setting.  Different locales sort their phone books
    in very different ways, particularly regarding diacritics and ligatures.

    <p>If the given object is an instance of a type that implements a method
    named "compare", this function defers to the instance.  The method does not
    need to be an owned property to distinguish it from an object literal since
    object literals are incomparable.  Unlike <code>Object</code> however,
    <code>Array</code> implements <code>compare</code>.

    @param {Any} left
    @param {Any} right
    @returns {Number} a value having the same transitive relationship to zero
    as the left and right values.
    @function external:Object.compare
*/
Object.compare = function (a, b) {
    // unbox objects, but do not confuse object literals
    // mercifully handles the Date case
    a = Object.getValueOf(a);
    b = Object.getValueOf(b);
    if (a === b)
        return 0;
    var aType = typeof a;
    var bType = typeof b;
    if (aType === "number" && bType === "number")
        return a - b;
    if (aType === "string" && bType === "string")
        return a < b ? -Infinity : Infinity;
        // the possibility of equality elimiated above
    if (a && typeof a.compare === "function")
        return a.compare(b);
    // not commutative, the relationship is reversed
    if (b && typeof b.compare === "function")
        return -b.compare(a);
    return 0;
};

/**
    Creates a deep copy of any value.  Values, being immutable, are
    returned without alternation.  Forwards to <code>clone</code> on
    objects and arrays.

    @function external:Object.clone
    @param {Any} value a value to clone
    @param {Number} depth an optional traversal depth, defaults to infinity.
    A value of <code>0</code> means to make no clone and return the value
    directly.
    @param {Map} memo an optional memo of already visited objects to preserve
    reference cycles.  The cloned object will have the exact same shape as the
    original, but no identical objects.  Te map may be later used to associate
    all objects in the original object graph with their corresponding member of
    the cloned graph.
    @returns a copy of the value
*/
Object.clone = function (value, depth, memo) {
    value = Object.getValueOf(value);
    memo = memo || new WeakMap();
    if (depth === undefined) {
        depth = Infinity;
    } else if (depth === 0) {
        return value;
    }
    if (Object.isObject(value)) {
        if (!memo.has(value)) {
            if (value && typeof value.clone === "function") {
                memo.set(value, value.clone(depth, memo));
            } else {
                var prototype = Object.getPrototypeOf(value);
                if (prototype === null || prototype === Object.prototype) {
                    var clone = Object.create(prototype);
                    memo.set(value, clone);
                    for (var key in value) {
                        clone[key] = Object.clone(value[key], depth - 1, memo);
                    }
                } else {
                    throw new Error("Can't clone " + value);
                }
            }
        }
        return memo.get(value);
    }
    return value;
};

/**
    Removes all properties owned by this object making the object suitable for
    reuse.

    @function external:Object.clear
    @returns this
*/
Object.clear = function (object) {
    if (object && typeof object.clear === "function") {
        object.clear();
    } else {
        var keys = Object.keys(object),
            i = keys.length;
        while (i) {
            i--;
            delete object[keys[i]];
        }
    }
    return object;
};

}],["collections","shim-regexp",{},function (require, exports, module){

// collections shim-regexp
// -----------------------


/**
    accepts a string; returns the string with regex metacharacters escaped.
    the returned string can safely be used within a regex to match a literal
    string. escaped characters are [, ], {, }, (, ), -, *, +, ?, ., \, ^, $,
    |, #, [comma], and whitespace.
*/
if (!RegExp.escape) {
    var special = /[-[\]{}()*+?.\\^$|,#\s]/g;
    RegExp.escape = function (string) {
        return string.replace(special, "\\$&");
    };
}

}],["collections","sorted-array",{"./shim":23,"./generic-collection":5,"./listen/property-changes":16,"./listen/range-changes":17,"sorted-array":28},function (require, exports, module){

// collections sorted-array
// ------------------------

"use strict";

module.exports = SortedArray;

var Shim = require("./shim");
var GenericCollection = require("./generic-collection");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");

function SortedArray(values, equals, compare, getDefault) {
    if (!(this instanceof SortedArray)) {
        return new SortedArray(values, equals, compare, getDefault);
    }
    if (Array.isArray(values)) {
        this.array = values;
        values = values.splice(0, values.length);
    } else {
        this.array = [];
    }
    this.contentEquals = equals || Object.equals;
    this.contentCompare = compare || Object.compare;
    this.getDefault = getDefault || Function.noop;

    this.length = 0;
    this.addEach(values);
}

// hack so require("sorted-array").SortedArray will work in MontageJS
SortedArray.SortedArray = SortedArray;

Object.addEach(SortedArray.prototype, GenericCollection.prototype);
Object.addEach(SortedArray.prototype, PropertyChanges.prototype);
Object.addEach(SortedArray.prototype, RangeChanges.prototype);

SortedArray.prototype.isSorted = true;

function search(array, value, compare) {
    var first = 0;
    var last = array.length - 1;
    while (first <= last) {
        var middle = (first + last) >> 1; // Math.floor( / 2)
        var comparison = compare(value, array[middle]);
        if (comparison > 0) {
            first = middle + 1;
        } else if (comparison < 0) {
            last = middle - 1;
        } else {
            return middle;
        }
    }
    return -(first + 1);
}

function searchFirst(array, value, compare, equals) {
    var index = search(array, value, compare);
    if (index < 0) {
        return -1;
    } else {
        while (index > 0 && equals(value, array[index - 1])) {
            index--;
        }
        if (!equals(value, array[index])) {
            return -1;
        } else {
            return index;
        }
    }
}

function searchLast(array, value, compare, equals) {
    var index = search(array, value, compare);
    if (index < 0) {
        return -1;
    } else {
        while (index < array.length - 1 && equals(value, array[index + 1])) {
            index++;
        }
        if (!equals(value, array[index])) {
            return -1;
        } else {
            return index;
        }
    }
}

function searchForInsertionIndex(array, value, compare) {
    var index = search(array, value, compare);
    if (index < 0) {
        return -index - 1;
    } else {
        var last = array.length - 1;
        while (index < last && compare(value, array[index + 1]) === 0) {
            index++;
        }
        return index;
    }
}

SortedArray.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentCompare,
        this.getDefault
    );
};

SortedArray.prototype.has = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#has does not support second argument: equals");
    }
    var index = search(this.array, value, this.contentCompare);
    return index >= 0 && this.contentEquals(this.array[index], value);
};

SortedArray.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("SortedArray#get does not support second argument: equals");
    }
    var index = searchFirst(this.array, value, this.contentCompare, this.contentEquals);
    if (index !== -1) {
        return this.array[index];
    } else {
        return this.getDefault(value);
    }
};

SortedArray.prototype.add = function (value) {
    var index = searchForInsertionIndex(this.array, value, this.contentCompare);
    if (this.dispatchesRangeChanges) {
        this.dispatchBeforeRangeChange([value], [], index);
    }
    this.array.splice(index, 0, value);
    this.length++;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([value], [], index);
    }
    return true;
};

SortedArray.prototype["delete"] = function (value, equals) {
    if (equals) {
        throw new Error("SortedArray#delete does not support second argument: equals");
    }
    var index = searchFirst(this.array, value, this.contentCompare, this.contentEquals);
    if (index !== -1) {
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([], [value], index);
        }
        this.array.splice(index, 1);
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([], [value], index);
        }
        return true;
    } else {
        return false;
    }
};

SortedArray.prototype.indexOf = function (value) {
    return searchFirst(this.array, value, this.contentCompare, this.contentEquals);
};

SortedArray.prototype.lastIndexOf = function (value) {
    return searchLast(this.array, value, this.contentCompare, this.contentEquals);
};

SortedArray.prototype.find = function (value, equals, index) {
    if (equals) {
        throw new Error("SortedArray#find does not support second argument: equals");
    }
    if (index) {
        throw new Error("SortedArray#find does not support third argument: index");
    }
    return searchFirst(this.array, value, this.contentCompare, this.contentEquals);
};

SortedArray.prototype.findLast = function (value, equals, index) {
    if (equals) {
        throw new Error("SortedArray#findLast does not support second argument: equals");
    }
    if (index) {
        throw new Error("SortedArray#findLast does not support third argument: index");
    }
    return searchLast(this.array, value, this.contentCompare, this.contentEquals);
};

SortedArray.prototype.push = function () {
    this.addEach(arguments);
};

SortedArray.prototype.unshift = function () {
    this.addEach(arguments);
};

SortedArray.prototype.pop = function () {
    var val = this.array.pop();
    this.length = this.array.length;
    return val;
};

SortedArray.prototype.shift = function () {
    var val = this.array.shift();
    this.length = this.array.length;
    return val;
};

SortedArray.prototype.slice = function () {
    return this.array.slice.apply(this.array, arguments);
};

SortedArray.prototype.splice = function (index, length /*...plus*/) {
    return this.swap(index, length, Array.prototype.slice.call(arguments, 2));
};

SortedArray.prototype.swap = function (index, length, plus) {
    if (index === undefined && length === undefined) {
        return [];
    }
    index = index || 0;
    if (index < 0) {
        index += this.length;
    }
    if (length === undefined) {
        length = Infinity;
    }
    var minus = this.slice(index, index + length);
    if (this.dispatchesRangeChanges) {
        this.dispatchBeforeRangeChange(plus, minus, index);
    }
    this.array.splice(index, length);
    this.addEach(plus);
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange(plus, minus, index);
    }
    return minus;
};

SortedArray.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    return this.array.reduce(function (basis, value, key) {
        return callback.call(thisp, basis, value, key, this);
    }, basis, this);
};

SortedArray.prototype.reduceRight = function () {
    var thisp = arguments[2];
    return this.array.reduceRight(function (basis, value, key) {
        return callback.call(thisp, basis, value, key, this);
    }, basis, this);
};

SortedArray.prototype.min = function () {
    if (this.length) {
        return this.array[0];
    }
};

SortedArray.prototype.max = function () {
    if (this.length) {
        return this.array[this.length - 1];
    }
};

SortedArray.prototype.one = function () {
    return this.array.one();
};

SortedArray.prototype.clear = function () {
    var minus;
    if (this.dispatchesRangeChanges) {
        minus = this.array.slice();
        this.dispatchBeforeRangeChange([], minus, 0);
    }
    this.length = 0;
    this.array.clear();
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([], minus, 0);
    }
};

SortedArray.prototype.equals = function (that, equals) {
    return this.array.equals(that, equals);
};

SortedArray.prototype.compare = function (that, compare) {
    return this.array.compare(that, compare);
};

SortedArray.prototype.iterate = function (start, end) {
    return new this.Iterator(this.array, start, end);
};

SortedArray.prototype.Iterator = Array.prototype.Iterator;
}],["collections","sorted-array-map",{"./shim":23,"./sorted-array-set":30,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"sorted-array-map":29},function (require, exports, module){

// collections sorted-array-map
// ----------------------------

"use strict";

var Shim = require("./shim");
var SortedArraySet = require("./sorted-array-set");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

module.exports = SortedArrayMap;

function SortedArrayMap(values, equals, compare, getDefault) {
    if (!(this instanceof SortedArrayMap)) {
        return new SortedArrayMap(values, equals, compare, getDefault);
    }
    equals = equals || Object.equals;
    compare = compare || Object.compare;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentCompare = compare;
    this.getDefault = getDefault;
    this.store = new SortedArraySet(
        null,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function compareKeys(a, b) {
            return compare(a.key, b.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

// hack so require("sorted-array-map").SortedArrayMap will work in MontageJS
SortedArrayMap.SortedArrayMap = SortedArrayMap;

Object.addEach(SortedArrayMap.prototype, GenericCollection.prototype);
Object.addEach(SortedArrayMap.prototype, GenericMap.prototype);
Object.addEach(SortedArrayMap.prototype, PropertyChanges.prototype);

SortedArrayMap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentCompare,
        this.getDefault
    );
};

}],["collections","sorted-array-set",{"./shim":23,"./sorted-array":28,"./generic-set":8,"./listen/property-changes":16},function (require, exports, module){

// collections sorted-array-set
// ----------------------------

"use strict";

module.exports = SortedArraySet;

var Shim = require("./shim");
var SortedArray = require("./sorted-array");
var GenericSet = require("./generic-set");
var PropertyChanges = require("./listen/property-changes");

function SortedArraySet(values, equals, compare, getDefault) {
    if (!(this instanceof SortedArraySet)) {
        return new SortedArraySet(values, equals, compare, getDefault);
    }
    SortedArray.call(this, values, equals, compare, getDefault);
}

// hack so require("sorted-array-set".SortedArraySet works in MontageJS
SortedArraySet.SortedArraySet = SortedArraySet;

SortedArraySet.prototype = Object.create(SortedArray.prototype);

SortedArraySet.prototype.constructor = SortedArraySet;

Object.addEach(SortedArraySet.prototype, GenericSet.prototype);
Object.addEach(SortedArraySet.prototype, PropertyChanges.prototype);

SortedArraySet.prototype.isSorted = true;

SortedArraySet.prototype.add = function (value) {
    if (!this.has(value)) {
        SortedArray.prototype.add.call(this, value);
        return true;
    } else {
        return false;
    }
};

SortedArraySet.prototype.reduce = function (callback, basis /*, thisp*/) {
    var self = this;
    var thisp = arguments[2];
    return this.array.reduce(function (basis, value, index) {
        return callback.call(thisp, basis, value, index, self);
    }, basis);
};

SortedArraySet.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var self = this;
    var thisp = arguments[2];
    return this.array.reduceRight(function (basis, value, index) {
        return callback.call(thisp, basis, value, index, self);
    }, basis);
};

}],["collections","sorted-map",{"./shim":23,"./sorted-set":32,"./generic-collection":5,"./generic-map":6,"./listen/property-changes":16,"sorted-map":31},function (require, exports, module){

// collections sorted-map
// ----------------------

"use strict";

var Shim = require("./shim");
var SortedSet = require("./sorted-set");
var GenericCollection = require("./generic-collection");
var GenericMap = require("./generic-map");
var PropertyChanges = require("./listen/property-changes");

module.exports = SortedMap;

function SortedMap(values, equals, compare, getDefault) {
    if (!(this instanceof SortedMap)) {
        return new SortedMap(values, equals, compare, getDefault);
    }
    equals = equals || Object.equals;
    compare = compare || Object.compare;
    getDefault = getDefault || Function.noop;
    this.contentEquals = equals;
    this.contentCompare = compare;
    this.getDefault = getDefault;
    this.store = new SortedSet(
        null,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function compareKeys(a, b) {
            return compare(a.key, b.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

// hack so require("sorted-map").SortedMap will work in MontageJS
SortedMap.SortedMap = SortedMap;

Object.addEach(SortedMap.prototype, GenericCollection.prototype);
Object.addEach(SortedMap.prototype, GenericMap.prototype);
Object.addEach(SortedMap.prototype, PropertyChanges.prototype);

SortedMap.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentCompare,
        this.getDefault
    );
};

SortedMap.prototype.log = function (charmap, logNode, callback, thisp) {
    logNode = logNode || this.logNode
    this.store.log(charmap, function (node, log, logBefore) {
        logNode(node.value, log, logBefore);
    }, callback, thisp);
};

SortedMap.prototype.logNode = function (node, log) {
    log(" key: " + node.key);
    log(" value: " + node.value);
};

}],["collections","sorted-set",{"./shim":23,"./generic-collection":5,"./generic-set":8,"./listen/property-changes":16,"./listen/range-changes":17,"./tree-log":33,"sorted-set":32},function (require, exports, module){

// collections sorted-set
// ----------------------

"use strict";

module.exports = SortedSet;

var Shim = require("./shim");
var GenericCollection = require("./generic-collection");
var GenericSet = require("./generic-set");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");
var TreeLog = require("./tree-log");

function SortedSet(values, equals, compare, getDefault) {
    if (!(this instanceof SortedSet)) {
        return new SortedSet(values, equals, compare, getDefault);
    }
    this.contentEquals = equals || Object.equals;
    this.contentCompare = compare || Object.compare;
    this.getDefault = getDefault || Function.noop;
    this.root = null;
    this.length = 0;
    this.addEach(values);
}

// hack so require("sorted-set").SortedSet will work in MontageJS
SortedSet.SortedSet = SortedSet;

Object.addEach(SortedSet.prototype, GenericCollection.prototype);
Object.addEach(SortedSet.prototype, GenericSet.prototype);
Object.addEach(SortedSet.prototype, PropertyChanges.prototype);
Object.addEach(SortedSet.prototype, RangeChanges.prototype);

SortedSet.prototype.isSorted = true;

SortedSet.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentCompare,
        this.getDefault
    );
};

SortedSet.prototype.has = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#has does not support second argument: equals");
    }
    if (this.root) {
        this.splay(value);
        return this.contentEquals(value, this.root.value);
    } else {
        return false;
    }
};

SortedSet.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#get does not support second argument: equals");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            return this.root.value;
        }
    }
    return this.getDefault(value);
};

SortedSet.prototype.add = function (value) {
    var node = new this.Node(value);
    if (this.root) {
        this.splay(value);
        if (!this.contentEquals(value, this.root.value)) {
            var comparison = this.contentCompare(value, this.root.value);
            if (comparison === 0) {
                throw new Error("SortedSet cannot contain incomparable but inequal values: " + value + " and " + this.root.value);
            }
            if (this.dispatchesRangeChanges) {
                this.dispatchBeforeRangeChange([value], [], this.root.index);
            }
            if (comparison < 0) {
                // rotate right
                //   R        N
                //  / \  ->  / \
                // l   r    l   R
                // :   :    :    \
                //                r
                //                :
                node.right = this.root;
                node.left = this.root.left;
                this.root.left = null;
                this.root.touch();
            } else {
                // rotate left
                //   R        N
                //  / \  ->  / \
                // l   r    R   r
                // :   :   /    :
                //        l
                //        :
                node.left = this.root;
                node.right = this.root.right;
                this.root.right = null;
                this.root.touch();
            }
            node.touch();
            this.root = node;
            this.length++;
            if (this.dispatchesRangeChanges) {
                this.dispatchRangeChange([value], [], this.root.index);
            }
            return true;
        }
    } else {
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([value], [], 0);
        }
        this.root = node;
        this.length++;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([value], [], 0);
        }
        return true;
    }
    return false;
};

SortedSet.prototype['delete'] = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#delete does not support second argument: equals");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            var index = this.root.index;
            if (this.dispatchesRangeChanges) {
                this.dispatchBeforeRangeChange([], [value], index);
            }
            if (!this.root.left) {
                this.root = this.root.right;
            } else {
                // remove the right side of the tree,
                var right = this.root.right;
                this.root = this.root.left;
                // the tree now only contains the left side of the tree, so all
                // values are less than the value deleted.
                // splay so that the root has an empty right child
                this.splay(value);
                // put the right side of the tree back
                this.root.right = right;
            }
            this.length--;
            if (this.root) {
                this.root.touch();
            }
            if (this.dispatchesRangeChanges) {
                this.dispatchRangeChange([], [value], index);
            }
            return true;
        }
    }
    return false;
};

SortedSet.prototype.indexOf = function (value, index) {
    if (index) {
        throw new Error("SortedSet#indexOf does not support second argument: startIndex");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            return this.root.index;
        }
    }
    return -1;
};

SortedSet.prototype.find = function (value, equals, index) {
    if (equals) {
        throw new Error("SortedSet#find does not support second argument: equals");
    }
    if (index) {
        // TODO contemplate using splayIndex to isolate a subtree in
        // which to search.
        throw new Error("SortedSet#find does not support third argument: index");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            return this.root;
        }
    }
};

SortedSet.prototype.findGreatest = function (at) {
    if (this.root) {
        at = at || this.root;
        while (at.right) {
            at = at.right;
        }
        return at;
    }
};

SortedSet.prototype.findLeast = function (at) {
    if (this.root) {
        at = at || this.root;
        while (at.left) {
            at = at.left;
        }
        return at;
    }
};

SortedSet.prototype.findGreatestLessThanOrEqual = function (value) {
    if (this.root) {
        this.splay(value);
        // assert root.value <= value
        return this.root;
    }
};

SortedSet.prototype.findGreatestLessThan = function (value) {
    if (this.root) {
        this.splay(value);
        // assert root.value <= value
        return this.root.getPrevious();
    }
};

SortedSet.prototype.findLeastGreaterThanOrEqual = function (value) {
    if (this.root) {
        this.splay(value);
        // assert root.value <= value
        var comparison = this.contentCompare(value, this.root.value);
        if (comparison === 0) {
            return this.root;
        } else {
            return this.root.getNext();
        }
    }
};

SortedSet.prototype.findLeastGreaterThan = function (value) {
    if (this.root) {
        this.splay(value);
        // assert root.value <= value
        var comparison = this.contentCompare(value, this.root.value);
        return this.root.getNext();
    }
};

SortedSet.prototype.pop = function () {
    if (this.root) {
        var found = this.findGreatest();
        this["delete"](found.value);
        return found.value;
    }
};

SortedSet.prototype.shift = function () {
    if (this.root) {
        var found = this.findLeast();
        this["delete"](found.value);
        return found.value;
    }
};

SortedSet.prototype.push = function () {
    this.addEach(arguments);
};

SortedSet.prototype.unshift = function () {
    this.addEach(arguments);
};

SortedSet.prototype.slice = function (start, end) {
    var temp;
    start = start || 0;
    end = end || this.length;
    if (start < 0) {
        start += this.length;
    }
    if (end < 0) {
        end += this.length;
    }
    var sliced = [];
    if (this.root) {
        this.splayIndex(start);
        while (this.root.index < end) {
            sliced.push(this.root.value);
            if (!this.root.right) {
                break;
            }
            this.splay(this.root.getNext().value);
        }
    }
    return sliced;
};

SortedSet.prototype.splice = function (at, length /*...plus*/) {
    return this.swap(at, length, Array.prototype.slice.call(arguments, 2));
};

SortedSet.prototype.swap = function (start, length, plus) {
    if (start === undefined && length === undefined) {
        return [];
    }
    start = start || 0;
    if (start < 0) {
        start += this.length;
    }
    if (length === undefined) {
        length = Infinity;
    }
    var swapped = [];

    if (this.root) {

        // start
        this.splayIndex(start);

        // minus length
        for (var i = 0; i < length; i++) {
            swapped.push(this.root.value);
            var next = this.root.getNext();
            this["delete"](this.root.value);
            if (!next) {
                break;
            }
            this.splay(next.value);
        }
    }

    // plus
    this.addEach(plus);

    return swapped;
};

// This is the simplified top-down splaying algorithm from: "Self-adjusting
// Binary Search Trees" by Sleator and Tarjan guarantees that the root.value <=
// value if root exists
// - as described in https://github.com/hij1nx/forest
SortedSet.prototype.splay = function (value) {
    var stub, left, right, temp, root, history;

    if (!this.root) {
        return;
    }

    // Create a stub node.  The use of the stub node is a bit
    // counter-intuitive: The right child of the stub node will hold the L tree
    // of the algorithm.  The left child of the stub node will hold the R tree
    // of the algorithm.  Using a stub node, left and right will always be
    // nodes and we avoid special cases.
    // - http://code.google.com/p/v8/source/browse/branches/bleeding_edge/src/splay-tree-inl.h
    stub = left = right = new this.Node();
    // The history is an upside down tree used to propagate new tree sizes back
    // up the left and right arms of a traversal.  The right children of the
    // transitive left side of the tree will be former roots while linking
    // left.  The left children of the transitive walk to the right side of the
    // history tree will all be previous roots from linking right.  The last
    // node of the left and right traversal will each become a child of the new
    // root.
    history = new this.Node();
    root = this.root;

    while (true) {
        var comparison = this.contentCompare(value, root.value);
        if (comparison < 0) {
            if (root.left) {
                if (this.contentCompare(value, root.left.value) < 0) {
                    // rotate right
                    //        Root         L(temp)
                    //      /     \       / \
                    //     L(temp) R    LL    Root
                    //    / \                /    \
                    //  LL   LR            LR      R
                    temp = root.left;
                    root.left = temp.right;
                    root.touch();
                    temp.right = root;
                    temp.touch();
                    root = temp;
                    if (!root.left) {
                        break;
                    }
                }
                // remember former root for repropagating length
                temp = new Node();
                temp.right = root;
                temp.left = history.left;
                history.left = temp;
                // link left
                right.left = root;
                right.touch();
                right = root;
                root = root.left;
            } else {
                break;
            }
        } else if (comparison > 0) {
            if (root.right) {
                if (this.contentCompare(value, root.right.value) > 0) {
                    // rotate left
                    //        Root         L(temp)
                    //      /     \       / \
                    //     L(temp) R    LL    Root
                    //    / \                /    \
                    //  LL   LR            LR      R
                    temp = root.right;
                    root.right = temp.left;
                    root.touch();
                    temp.left = root;
                    temp.touch();
                    root = temp;
                    if (!root.right) {
                        break;
                    }
                }
                // remember former root for repropagating length
                temp = new Node();
                temp.left = root;
                temp.right = history.right;
                history.right = temp;
                // link right
                left.right = root;
                left.touch();
                left = root;
                root = root.right;
            } else {
                break;
            }
        } else { // equal or incomparable
            break;
        }
    }

    // reassemble
    left.right = root.left;
    left.touch();
    right.left = root.right;
    right.touch();
    root.left = stub.right;
    root.right = stub.left;

    // propagate new lengths
    while (history.left) {
        history.left.right.touch();
        history.left = history.left.left;
    }
    while (history.right) {
        history.right.left.touch();
        history.right = history.right.right;
    }
    root.touch();

    this.root = root;
};

// an internal utility for splaying a node based on its index
SortedSet.prototype.splayIndex = function (index) {
    if (this.root) {
        var at = this.root;
        var atIndex = this.root.index;

        while (atIndex !== index) {
            if (atIndex > index && at.left) {
                at = at.left;
                atIndex -= 1 + (at.right ? at.right.length : 0);
            } else if (atIndex < index && at.right) {
                at = at.right;
                atIndex += 1 + (at.left ? at.left.length : 0);
            } else {
                break;
            }
        }

        this.splay(at.value);

        return this.root.index === index;
    }
    return false;
};

SortedSet.prototype.reduce = function (callback, basis, thisp) {
    if (this.root) {
        basis = this.root.reduce(callback, basis, 0, thisp, this);
    }
    return basis;
};

SortedSet.prototype.reduceRight = function (callback, basis, thisp) {
    if (this.root) {
        basis = this.root.reduceRight(callback, basis, this.length - 1, thisp, this);
    }
    return basis;
};

SortedSet.prototype.min = function (at) {
    var least = this.findLeast(at);
    if (least) {
        return least.value;
    }
};

SortedSet.prototype.max = function (at) {
    var greatest = this.findGreatest(at);
    if (greatest) {
        return greatest.value;
    }
};

SortedSet.prototype.one = function () {
    return this.min();
};

SortedSet.prototype.clear = function () {
    var minus;
    if (this.dispatchesRangeChanges) {
        minus = this.toArray();
        this.dispatchBeforeRangeChange([], minus, 0);
    }
    this.root = null;
    this.length = 0;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([], minus, 0);
    }
};

SortedSet.prototype.iterate = function (start, end) {
    return new this.Iterator(this, start, end);
};

SortedSet.prototype.Iterator = Iterator;

SortedSet.prototype.summary = function () {
    if (this.root) {
        return this.root.summary();
    } else {
        return "()";
    }
};

SortedSet.prototype.log = function (charmap, logNode, callback, thisp) {
    charmap = charmap || TreeLog.unicodeRound;
    logNode = logNode || this.logNode;
    if (!callback) {
        callback = console.log;
        thisp = console;
    }
    callback = callback.bind(thisp);
    if (this.root) {
        this.root.log(charmap, logNode, callback, callback);
    }
};

SortedSet.prototype.logNode = function (node, log, logBefore) {
    log(" " + node.value);
};

SortedSet.logCharsets = TreeLog;

SortedSet.prototype.Node = Node;

function Node(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.length = 1;
}

// TODO case where no basis is provided for reduction

Node.prototype.reduce = function (callback, basis, index, thisp, tree, depth) {
    depth = depth || 0;
    if (this.left) {
        // prerecord length to be resistant to mutation
        var length = this.left.length;
        basis = this.left.reduce(callback, basis, index, thisp, tree, depth + 1);
        index += length;
    }
    basis = callback.call(thisp, basis, this.value, index, tree, this, depth);
    index += 1;
    if (this.right) {
        basis = this.right.reduce(callback, basis, index, thisp, tree, depth + 1);
    }
    return basis;
};

Node.prototype.reduceRight = function (callback, basis, index, thisp, tree, depth) {
    depth = depth || 0;
    if (this.right) {
        basis = this.right.reduce(callback, basis, index, thisp, tree, depth + 1);
        index -= this.right.length;
    }
    basis = callback.call(thisp, basis, this.value, this.value, tree, this, depth);
    index -= 1;
    if (this.left) {
        basis = this.left.reduce(callback, basis, index, thisp, tree, depth + 1);
    }
    return basis;
};

Node.prototype.touch = function () {
    this.length = 1 +
        (this.left ? this.left.length : 0) +
        (this.right ? this.right.length : 0);
    this.index = this.left ? this.left.length : 0;
};

Node.prototype.checkIntegrity = function () {
    var length = 1;
    length += this.left ? this.left.checkIntegrity() : 0;
    length += this.right ? this.right.checkIntegrity() : 0;
    if (this.length !== length)
        throw new Error("Integrity check failed: " + this.summary());
    return length;
}

// get the next node in this subtree
Node.prototype.getNext = function () {
    var node = this;
    if (node.right) {
        node = node.right;
        while (node.left) {
            node = node.left;
        }
        return node;
    }
};

// get the previous node in this subtree
Node.prototype.getPrevious = function () {
    var node = this;
    if (node.left) {
        node = node.left;
        while (node.right) {
            node = node.right;
        }
        return node;
    }
};

Node.prototype.summary = function () {
    var value = this.value || "-";
    value += " <" + this.length;
    if (!this.left && !this.right) {
        return "(" + value + ")";
    }
    return "(" + value + " " + (
        this.left ? this.left.summary() : "()"
    ) + ", " + (
        this.right ? this.right.summary() : "()"
    ) + ")";
};

Node.prototype.log = function (charmap, logNode, log, logAbove) {
    var self = this;

    var branch;
    if (this.left && this.right) {
        branch = charmap.intersection;
    } else if (this.left) {
        branch = charmap.branchUp;
    } else if (this.right) {
        branch = charmap.branchDown;
    } else {
        branch = charmap.through;
    }

    var loggedAbove;
    this.left && this.left.log(
        charmap,
        logNode,
        function innerWrite(line) {
            if (!loggedAbove) {
                loggedAbove = true;
                // leader
                logAbove(charmap.fromBelow + charmap.through + line);
            } else {
                // below
                logAbove(charmap.strafe + " " + line);
            }
        },
        function innerWriteAbove(line) {
            // above
            logAbove("  " + line);
        }
    );

    var loggedOn;
    logNode(
        this,
        function innerWrite(line) {
            if (!loggedOn) {
                loggedOn = true;
                log(branch + line);
            } else {
                log((self.right ? charmap.strafe : " ") + line);
            }
        },
        function innerWriteAbove(line) {
            logAbove((self.left ? charmap.strafe : " ") + line);
        }
    );

    var loggedBelow;
    this.right && this.right.log(
        charmap,
        logNode,
        function innerWrite(line) {
            if (!loggedBelow) {
                loggedBelow = true;
                log(charmap.fromAbove + charmap.through + line);
            } else {
                log("  " + line);
            }
        },
        function innerWriteAbove(line) {
            log(charmap.strafe + " " + line);
        }
    );
};

function Iterator(set, start, end) {
    this.set = set;
    this.prev = null;
    this.end = end;
    if (start) {
        var next = this.set.findLeastGreaterThanOrEqual(start);
        if (next) {
            this.set.splay(next.value);
            this.prev = next.getPrevious();
        }
    }
}

Iterator.prototype.next = function () {
    var next;
    if (this.prev) {
        next = this.set.findLeastGreaterThan(this.prev.value);
    } else {
        next = this.set.findLeast();
    }
    if (!next) {
        throw StopIteration;
    }
    if (
        this.end !== undefined &&
        this.set.contentCompare(next.value, this.end) >= 0
    ) {
        throw StopIteration;
    }
    this.prev = next;
    return next.value;
};

}],["collections","tree-log",{},function (require, exports, module){

// collections tree-log
// --------------------

"use strict";

module.exports = TreeLog;

function TreeLog() {
}

TreeLog.ascii = {
    intersection: "+",
    through: "-",
    branchUp: "+",
    branchDown: "+",
    fromBelow: ".",
    fromAbove: "'",
    fromBoth: "+",
    strafe: "|"
};

TreeLog.unicodeRound = {
    intersection: "\u254b",
    through: "\u2501",
    branchUp: "\u253b",
    branchDown: "\u2533",
    fromBelow: "\u256d", // round corner
    fromAbove: "\u2570", // round corner
    fromBoth: "\u2523",
    strafe: "\u2503"
};

TreeLog.unicodeSharp = {
    intersection: "\u254b",
    through: "\u2501",
    branchUp: "\u253b",
    branchDown: "\u2533",
    fromBelow: "\u250f", // sharp corner
    fromAbove: "\u2517", // sharp corner
    fromBoth: "\u2523",
    strafe: "\u2503"
};

}],["collections-website","lib/repl",{},function (require, exports, module){

// collections-website lib/repl
// ----------------------------


var globalEval = eval;

module.exports = function (element) {
    evalSample(element);
    addInput(element);
};

function evalSample(element) {
    var statementEls = element.querySelectorAll(".repl-input");

    for (var i = 0; i < statementEls.length; i++) {
        var statementEl = statementEls[i];
        var output = createOutputElement(evaluate(statementEl.textContent));

        if (output) {
            if (statementEl.nextElementSibling) {
                element.insertBefore(output, statementEl.nextElementSibling);
            } else {
                element.appendChild(output);
            }
        }
    }
}

function evaluate(source) {
    var result;
    try {
        result = globalEval(source);
        if (typeof result === "function") {
            result = result.toString();
        } else {
            try {
                result = JSON.stringify(result);
            } catch (error) {
                result = "<Unable to stringify " + result.toString() + ">";
            }
        }
    } catch (error) {
        result = error.name + ": " + error.message;
    }
    return result;
}

function createInputElement(source) {
    var input = document.createElement("span");
    input.classList.add("repl-input");
    input.textContent = source + "\n";

    return input;
}

function createOutputElement(result) {
    if (typeof result !== "undefined") {
        var output = document.createElement("span");
        output.classList.add("repl-output");
        output.textContent = result + "\n";

        var comment = document.createElement("span");
        comment.classList.add("repl-output-comment");
        comment.textContent = "// ";
        output.insertBefore(comment, output.lastChild);

        return output;
    }
}

function addInput(element) {
    var container = document.createElement("div");
    container.classList.add("repl-command");

    var input = document.createElement("input");
    input.placeholder = "\u276F";

    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13 && this.value) {
            var input = createInputElement(this.value);
            element.insertBefore(input, container);
            var output = createOutputElement(evaluate(this.value));
            if (output) {
                element.insertBefore(output, container);
            }
            this.value = "";
        }
    });
    container.appendChild(input);

    element.appendChild(container);
}

}],["weak-map","weak-map",{},function (require, exports, module){

// weak-map weak-map
// -----------------

// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Install a leaky WeakMap emulation on platforms that
 * don't provide a built-in one.
 *
 * <p>Assumes that an ES5 platform where, if {@code WeakMap} is
 * already present, then it conforms to the anticipated ES6
 * specification. To run this file on an ES5 or almost ES5
 * implementation where the {@code WeakMap} specification does not
 * quite conform, run <code>repairES5.js</code> first.
 *
 * <p> Even though WeakMapModule is not global, the linter thinks it
 * is, which is why it is in the overrides list below.
 *
 * @author Mark S. Miller
 * @requires crypto, ArrayBuffer, Uint8Array, navigator
 * @overrides WeakMap, ses, Proxy
 * @overrides WeakMapModule
 */

/**
 * This {@code WeakMap} emulation is observably equivalent to the
 * ES-Harmony WeakMap, but with leakier garbage collection properties.
 *
 * <p>As with true WeakMaps, in this emulation, a key does not
 * retain maps indexed by that key and (crucially) a map does not
 * retain the keys it indexes. A map by itself also does not retain
 * the values associated with that map.
 *
 * <p>However, the values associated with a key in some map are
 * retained so long as that key is retained and those associations are
 * not overridden. For example, when used to support membranes, all
 * values exported from a given membrane will live for the lifetime
 * they would have had in the absence of an interposed membrane. Even
 * when the membrane is revoked, all objects that would have been
 * reachable in the absence of revocation will still be reachable, as
 * far as the GC can tell, even though they will no longer be relevant
 * to ongoing computation.
 *
 * <p>The API implemented here is approximately the API as implemented
 * in FF6.0a1 and agreed to by MarkM, Andreas Gal, and Dave Herman,
 * rather than the offially approved proposal page. TODO(erights):
 * upgrade the ecmascript WeakMap proposal page to explain this API
 * change and present to EcmaScript committee for their approval.
 *
 * <p>The first difference between the emulation here and that in
 * FF6.0a1 is the presence of non enumerable {@code get___, has___,
 * set___, and delete___} methods on WeakMap instances to represent
 * what would be the hidden internal properties of a primitive
 * implementation. Whereas the FF6.0a1 WeakMap.prototype methods
 * require their {@code this} to be a genuine WeakMap instance (i.e.,
 * an object of {@code [[Class]]} "WeakMap}), since there is nothing
 * unforgeable about the pseudo-internal method names used here,
 * nothing prevents these emulated prototype methods from being
 * applied to non-WeakMaps with pseudo-internal methods of the same
 * names.
 *
 * <p>Another difference is that our emulated {@code
 * WeakMap.prototype} is not itself a WeakMap. A problem with the
 * current FF6.0a1 API is that WeakMap.prototype is itself a WeakMap
 * providing ambient mutability and an ambient communications
 * channel. Thus, if a WeakMap is already present and has this
 * problem, repairES5.js wraps it in a safe wrappper in order to
 * prevent access to this channel. (See
 * PATCH_MUTABLE_FROZEN_WEAKMAP_PROTO in repairES5.js).
 */

/**
 * If this is a full <a href=
 * "http://code.google.com/p/es-lab/wiki/SecureableES5"
 * >secureable ES5</a> platform and the ES-Harmony {@code WeakMap} is
 * absent, install an approximate emulation.
 *
 * <p>If WeakMap is present but cannot store some objects, use our approximate
 * emulation as a wrapper.
 *
 * <p>If this is almost a secureable ES5 platform, then WeakMap.js
 * should be run after repairES5.js.
 *
 * <p>See {@code WeakMap} for documentation of the garbage collection
 * properties of this WeakMap emulation.
 */
(function WeakMapModule() {
  "use strict";

  if (typeof ses !== 'undefined' && ses.ok && !ses.ok()) {
    // already too broken, so give up
    return;
  }

  /**
   * In some cases (current Firefox), we must make a choice betweeen a
   * WeakMap which is capable of using all varieties of host objects as
   * keys and one which is capable of safely using proxies as keys. See
   * comments below about HostWeakMap and DoubleWeakMap for details.
   *
   * This function (which is a global, not exposed to guests) marks a
   * WeakMap as permitted to do what is necessary to index all host
   * objects, at the cost of making it unsafe for proxies.
   *
   * Do not apply this function to anything which is not a genuine
   * fresh WeakMap.
   */
  function weakMapPermitHostObjects(map) {
    // identity of function used as a secret -- good enough and cheap
    if (map.permitHostObjects___) {
      map.permitHostObjects___(weakMapPermitHostObjects);
    }
  }
  if (typeof ses !== 'undefined') {
    ses.weakMapPermitHostObjects = weakMapPermitHostObjects;
  }

  // Check if there is already a good-enough WeakMap implementation, and if so
  // exit without replacing it.
  if (typeof WeakMap === 'function') {
    var HostWeakMap = WeakMap;
    // There is a WeakMap -- is it good enough?
    if (typeof navigator !== 'undefined' &&
        /Firefox/.test(navigator.userAgent)) {
      // We're now *assuming not*, because as of this writing (2013-05-06)
      // Firefox's WeakMaps have a miscellany of objects they won't accept, and
      // we don't want to make an exhaustive list, and testing for just one
      // will be a problem if that one is fixed alone (as they did for Event).

      // If there is a platform that we *can* reliably test on, here's how to
      // do it:
      //  var problematic = ... ;
      //  var testHostMap = new HostWeakMap();
      //  try {
      //    testHostMap.set(problematic, 1);  // Firefox 20 will throw here
      //    if (testHostMap.get(problematic) === 1) {
      //      return;
      //    }
      //  } catch (e) {}

      // Fall through to installing our WeakMap.
    } else {
      module.exports = WeakMap;
      return;
    }
  }

  var hop = Object.prototype.hasOwnProperty;
  var gopn = Object.getOwnPropertyNames;
  var defProp = Object.defineProperty;
  var isExtensible = Object.isExtensible;

  /**
   * Security depends on HIDDEN_NAME being both <i>unguessable</i> and
   * <i>undiscoverable</i> by untrusted code.
   *
   * <p>Given the known weaknesses of Math.random() on existing
   * browsers, it does not generate unguessability we can be confident
   * of.
   *
   * <p>It is the monkey patching logic in this file that is intended
   * to ensure undiscoverability. The basic idea is that there are
   * three fundamental means of discovering properties of an object:
   * The for/in loop, Object.keys(), and Object.getOwnPropertyNames(),
   * as well as some proposed ES6 extensions that appear on our
   * whitelist. The first two only discover enumerable properties, and
   * we only use HIDDEN_NAME to name a non-enumerable property, so the
   * only remaining threat should be getOwnPropertyNames and some
   * proposed ES6 extensions that appear on our whitelist. We monkey
   * patch them to remove HIDDEN_NAME from the list of properties they
   * returns.
   *
   * <p>TODO(erights): On a platform with built-in Proxies, proxies
   * could be used to trap and thereby discover the HIDDEN_NAME, so we
   * need to monkey patch Proxy.create, Proxy.createFunction, etc, in
   * order to wrap the provided handler with the real handler which
   * filters out all traps using HIDDEN_NAME.
   *
   * <p>TODO(erights): Revisit Mike Stay's suggestion that we use an
   * encapsulated function at a not-necessarily-secret name, which
   * uses the Stiegler shared-state rights amplification pattern to
   * reveal the associated value only to the WeakMap in which this key
   * is associated with that value. Since only the key retains the
   * function, the function can also remember the key without causing
   * leakage of the key, so this doesn't violate our general gc
   * goals. In addition, because the name need not be a guarded
   * secret, we could efficiently handle cross-frame frozen keys.
   */
  var HIDDEN_NAME_PREFIX = 'weakmap:';
  var HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'ident:' + Math.random() + '___';

  if (typeof crypto !== 'undefined' &&
      typeof crypto.getRandomValues === 'function' &&
      typeof ArrayBuffer === 'function' &&
      typeof Uint8Array === 'function') {
    var ab = new ArrayBuffer(25);
    var u8s = new Uint8Array(ab);
    crypto.getRandomValues(u8s);
    HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'rand:' +
      Array.prototype.map.call(u8s, function(u8) {
        return (u8 % 36).toString(36);
      }).join('') + '___';
  }

  function isNotHiddenName(name) {
    return !(
        name.substr(0, HIDDEN_NAME_PREFIX.length) == HIDDEN_NAME_PREFIX &&
        name.substr(name.length - 3) === '___');
  }

  /**
   * Monkey patch getOwnPropertyNames to avoid revealing the
   * HIDDEN_NAME.
   *
   * <p>The ES5.1 spec requires each name to appear only once, but as
   * of this writing, this requirement is controversial for ES6, so we
   * made this code robust against this case. If the resulting extra
   * search turns out to be expensive, we can probably relax this once
   * ES6 is adequately supported on all major browsers, iff no browser
   * versions we support at that time have relaxed this constraint
   * without providing built-in ES6 WeakMaps.
   */
  defProp(Object, 'getOwnPropertyNames', {
    value: function fakeGetOwnPropertyNames(obj) {
      return gopn(obj).filter(isNotHiddenName);
    }
  });

  /**
   * getPropertyNames is not in ES5 but it is proposed for ES6 and
   * does appear in our whitelist, so we need to clean it too.
   */
  if ('getPropertyNames' in Object) {
    var originalGetPropertyNames = Object.getPropertyNames;
    defProp(Object, 'getPropertyNames', {
      value: function fakeGetPropertyNames(obj) {
        return originalGetPropertyNames(obj).filter(isNotHiddenName);
      }
    });
  }

  /**
   * <p>To treat objects as identity-keys with reasonable efficiency
   * on ES5 by itself (i.e., without any object-keyed collections), we
   * need to add a hidden property to such key objects when we
   * can. This raises several issues:
   * <ul>
   * <li>Arranging to add this property to objects before we lose the
   *     chance, and
   * <li>Hiding the existence of this new property from most
   *     JavaScript code.
   * <li>Preventing <i>certification theft</i>, where one object is
   *     created falsely claiming to be the key of an association
   *     actually keyed by another object.
   * <li>Preventing <i>value theft</i>, where untrusted code with
   *     access to a key object but not a weak map nevertheless
   *     obtains access to the value associated with that key in that
   *     weak map.
   * </ul>
   * We do so by
   * <ul>
   * <li>Making the name of the hidden property unguessable, so "[]"
   *     indexing, which we cannot intercept, cannot be used to access
   *     a property without knowing the name.
   * <li>Making the hidden property non-enumerable, so we need not
   *     worry about for-in loops or {@code Object.keys},
   * <li>monkey patching those reflective methods that would
   *     prevent extensions, to add this hidden property first,
   * <li>monkey patching those methods that would reveal this
   *     hidden property.
   * </ul>
   * Unfortunately, because of same-origin iframes, we cannot reliably
   * add this hidden property before an object becomes
   * non-extensible. Instead, if we encounter a non-extensible object
   * without a hidden record that we can detect (whether or not it has
   * a hidden record stored under a name secret to us), then we just
   * use the key object itself to represent its identity in a brute
   * force leaky map stored in the weak map, losing all the advantages
   * of weakness for these.
   */
  function getHiddenRecord(key) {
    if (key !== Object(key)) {
      throw new TypeError('Not an object: ' + key);
    }
    var hiddenRecord = key[HIDDEN_NAME];
    if (hiddenRecord && hiddenRecord.key === key) { return hiddenRecord; }
    if (!isExtensible(key)) {
      // Weak map must brute force, as explained in doc-comment above.
      return void 0;
    }
    var gets = [];
    var vals = [];
    hiddenRecord = {
      key: key,   // self pointer for quick own check above.
      gets: gets, // get___ methods identifying weak maps
      vals: vals  // values associated with this key in each
                  // corresponding weak map.
    };
    defProp(key, HIDDEN_NAME, {
      value: hiddenRecord,
      writable: false,
      enumerable: false,
      configurable: false
    });
    return hiddenRecord;
  }


  /**
   * Monkey patch operations that would make their argument
   * non-extensible.
   *
   * <p>The monkey patched versions throw a TypeError if their
   * argument is not an object, so it should only be done to functions
   * that should throw a TypeError anyway if their argument is not an
   * object.
   */
  (function(){
    var oldFreeze = Object.freeze;
    defProp(Object, 'freeze', {
      value: function identifyingFreeze(obj) {
        getHiddenRecord(obj);
        return oldFreeze(obj);
      }
    });
    var oldSeal = Object.seal;
    defProp(Object, 'seal', {
      value: function identifyingSeal(obj) {
        getHiddenRecord(obj);
        return oldSeal(obj);
      }
    });
    var oldPreventExtensions = Object.preventExtensions;
    defProp(Object, 'preventExtensions', {
      value: function identifyingPreventExtensions(obj) {
        getHiddenRecord(obj);
        return oldPreventExtensions(obj);
      }
    });
  })();


  function constFunc(func) {
    func.prototype = null;
    return Object.freeze(func);
  }

  // Right now (12/25/2012) the histogram supports the current
  // representation. We should check this occasionally, as a true
  // constant time representation is easy.
  // var histogram = [];

  var OurWeakMap = function() {
    // We are currently (12/25/2012) never encountering any prematurely
    // non-extensible keys.
    var keys = []; // brute force for prematurely non-extensible keys.
    var vals = []; // brute force for corresponding values.

    function get___(key, opt_default) {
      var hr = getHiddenRecord(key);
      var i, vs;
      if (hr) {
        i = hr.gets.indexOf(get___);
        vs = hr.vals;
      } else {
        i = keys.indexOf(key);
        vs = vals;
      }
      return (i >= 0) ? vs[i] : opt_default;
    }

    function has___(key) {
      var hr = getHiddenRecord(key);
      var i;
      if (hr) {
        i = hr.gets.indexOf(get___);
      } else {
        i = keys.indexOf(key);
      }
      return i >= 0;
    }

    function set___(key, value) {
      var hr = getHiddenRecord(key);
      var i;
      if (hr) {
        i = hr.gets.indexOf(get___);
        if (i >= 0) {
          hr.vals[i] = value;
        } else {
//          i = hr.gets.length;
//          histogram[i] = (histogram[i] || 0) + 1;
          hr.gets.push(get___);
          hr.vals.push(value);
        }
      } else {
        i = keys.indexOf(key);
        if (i >= 0) {
          vals[i] = value;
        } else {
          keys.push(key);
          vals.push(value);
        }
      }
    }

    function delete___(key) {
      var hr = getHiddenRecord(key);
      var i;
      if (hr) {
        i = hr.gets.indexOf(get___);
        if (i >= 0) {
          hr.gets.splice(i, 1);
          hr.vals.splice(i, 1);
        }
      } else {
        i = keys.indexOf(key);
        if (i >= 0) {
          keys.splice(i, 1);
          vals.splice(i, 1);
        }
      }
      return true;
    }

    return Object.create(OurWeakMap.prototype, {
      get___:    { value: constFunc(get___) },
      has___:    { value: constFunc(has___) },
      set___:    { value: constFunc(set___) },
      delete___: { value: constFunc(delete___) }
    });
  };
  OurWeakMap.prototype = Object.create(Object.prototype, {
    get: {
      /**
       * Return the value most recently associated with key, or
       * opt_default if none.
       */
      value: function get(key, opt_default) {
        return this.get___(key, opt_default);
      },
      writable: true,
      configurable: true
    },

    has: {
      /**
       * Is there a value associated with key in this WeakMap?
       */
      value: function has(key) {
        return this.has___(key);
      },
      writable: true,
      configurable: true
    },

    set: {
      /**
       * Associate value with key in this WeakMap, overwriting any
       * previous association if present.
       */
      value: function set(key, value) {
        this.set___(key, value);
      },
      writable: true,
      configurable: true
    },

    'delete': {
      /**
       * Remove any association for key in this WeakMap, returning
       * whether there was one.
       *
       * <p>Note that the boolean return here does not work like the
       * {@code delete} operator. The {@code delete} operator returns
       * whether the deletion succeeds at bringing about a state in
       * which the deleted property is absent. The {@code delete}
       * operator therefore returns true if the property was already
       * absent, whereas this {@code delete} method returns false if
       * the association was already absent.
       */
      value: function remove(key) {
        return this.delete___(key);
      },
      writable: true,
      configurable: true
    }
  });

  if (typeof HostWeakMap === 'function') {
    (function() {
      // If we got here, then the platform has a WeakMap but we are concerned
      // that it may refuse to store some key types. Therefore, make a map
      // implementation which makes use of both as possible.

      function DoubleWeakMap() {
        // Preferable, truly weak map.
        var hmap = new HostWeakMap();

        // Our hidden-property-based pseudo-weak-map. Lazily initialized in the
        // 'set' implementation; thus we can avoid performing extra lookups if
        // we know all entries actually stored are entered in 'hmap'.
        var omap = undefined;

        // Hidden-property maps are not compatible with proxies because proxies
        // can observe the hidden name and either accidentally expose it or fail
        // to allow the hidden property to be set. Therefore, we do not allow
        // arbitrary WeakMaps to switch to using hidden properties, but only
        // those which need the ability, and unprivileged code is not allowed
        // to set the flag.
        var enableSwitching = false;

        function dget(key, opt_default) {
          if (omap) {
            return hmap.has(key) ? hmap.get(key)
                : omap.get___(key, opt_default);
          } else {
            return hmap.get(key, opt_default);
          }
        }

        function dhas(key) {
          return hmap.has(key) || (omap ? omap.has___(key) : false);
        }

        function dset(key, value) {
          if (enableSwitching) {
            try {
              hmap.set(key, value);
            } catch (e) {
              if (!omap) { omap = new OurWeakMap(); }
              omap.set___(key, value);
            }
          } else {
            hmap.set(key, value);
          }
        }

        function ddelete(key) {
          hmap['delete'](key);
          if (omap) { omap.delete___(key); }
        }

        return Object.create(OurWeakMap.prototype, {
          get___:    { value: constFunc(dget) },
          has___:    { value: constFunc(dhas) },
          set___:    { value: constFunc(dset) },
          delete___: { value: constFunc(ddelete) },
          permitHostObjects___: { value: constFunc(function(token) {
            if (token === weakMapPermitHostObjects) {
              enableSwitching = true;
            } else {
              throw new Error('bogus call to permitHostObjects___');
            }
          })}
        });
      }
      DoubleWeakMap.prototype = OurWeakMap.prototype;
      module.exports = DoubleWeakMap;

      // define .constructor to hide OurWeakMap ctor
      Object.defineProperty(WeakMap.prototype, 'constructor', {
        value: WeakMap,
        enumerable: false,  // as default .constructor is
        configurable: true,
        writable: true
      });
    })();
  } else {
    // There is no host WeakMap, so we must use the emulation.

    // Emulated WeakMaps are incompatible with native proxies (because proxies
    // can observe the hidden name), so we must disable Proxy usage (in
    // ArrayLike and Domado, currently).
    if (typeof Proxy !== 'undefined') {
      Proxy = undefined;
    }

    module.exports = OurWeakMap;
  }
})();
}]]})(this))