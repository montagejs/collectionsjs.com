
var repl = require("./repl");

var repls = document.querySelectorAll(".repl");
for (var i = 0; i < repls.length; i++) {
    repl(repls[i]);
}

