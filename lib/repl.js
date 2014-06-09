
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

