
var globalEval = eval;

module.exports = function (element) {
    var outputEl = element.children[0];
    var log = createLogFunction(outputEl);
    evalSample(outputEl, log);
    addInput(element, outputEl, log);
};

function createLogFunction(element) {
    return function () {
        var stringified = "";
        for (var i = 0; i < arguments.length; i++) {
            stringified += stringify(arguments[i]) + " ";
        }
        var output = createOutputElement(stringified, "log");
        if (output) {
            element.appendChild(output);
        }
    };
}

function evalSample(element, log) {
    var statementEls = element.querySelectorAll(".repl-input");

    // What's this?! Removing the statemtents, only to add them again below?!
    // Yep, it's inefficient, but it's the most straightforward way I can
    // think of to get the correct ordering of input, console.logs and return
    // value, without having to have special cases for this initial eval.
    // Fortunately it's synchronous and we're not reading any styling
    // information from the DOM so it shouldn't cause any reflows.
    for (var i = 0; i < statementEls.length; i++) {
        element.removeChild(statementEls[i]);
    }

    for (i = 0; i < statementEls.length; i++) {
        var statementEl = statementEls[i];

        element.appendChild(statementEl);

        var output = createOutputElement(evaluate(statementEl.textContent, log));
        if (output) {
            element.appendChild(output);
        }
    }
}

function evaluate(source, log) {
    var result;

    window.__replApi__ = {
        console: {
            log: log
        }
    };
    var wrappedSource = "with(window.__replApi__){\n" + source + "\n}";

    try {
        result = stringify(globalEval(wrappedSource));
    } catch (error) {
        result = error.name + ": " + error.message;
    }

    delete window.__replApi__;

    return result;
}

function stringify(value) {
    var stringified;
    if (typeof value === "function") {
        stringified = value.toString();
    } else {
        try {
            stringified = JSON.stringify(value);
        } catch (error) {
            stringified = "<Unable to stringify " + value.toString() + ">";
        }
    }
    return stringified;
}

function createInputElement(source) {
    var input = document.createElement("span");
    input.classList.add("repl-input");
    input.textContent = source + "\n";

    return input;
}

function createOutputElement(result, cssClass) {
    cssClass = cssClass || "output";
    if (typeof result !== "undefined") {
        var output = document.createElement("span");
        output.classList.add("repl-" + cssClass);
        output.textContent = result + "\n";

        var comment = document.createElement("span");
        comment.classList.add("repl-output-comment");
        comment.textContent = "// ";
        output.insertBefore(comment, output.lastChild);

        return output;
    }
}

function addInput(element, outputEl, log) {
    var container = document.createElement("div");
    container.classList.add("repl-command");

    var input = document.createElement("input");

    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13 && this.value) {
            var input = createInputElement(this.value);
            outputEl.appendChild(input);
            var output = createOutputElement(evaluate(this.value, log));
            if (output) {
                outputEl.appendChild(output);
            }
            this.value = "";
        }
    });
    container.appendChild(input);

    element.appendChild(container);
}

