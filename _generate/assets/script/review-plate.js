"use strict";

document.body.normalize();
document.body.classList.add("javascript");

var panelElements = {
    interfaces: document.getElementById("interfaces"),
    collections: document.getElementById("collections"),
    details: document.getElementById("details"),
    methods: document.getElementById("methods")
};

var headerElements = {
    interfaces: document.getElementById("interfacesHeader"),
    collections: document.getElementById("collectionsHeader"),
    details: document.getElementById("detailsHeader"),
    methods: document.getElementById("methodsHeader")
};

var allState = {
    interfaces: null,
    collections: null,
    details: null,
    methods: null
};

var headers = {
    "interface": {
        interfaces: "Interfaces",
        collections: "Implementations",
        methods: "Methods"
    },
    collection: {
        interfaces: "Interfaces",
        collections: "Collections",
        methods: "Implements"
    },
    method: {
        interfaces: "Interfaces",
        collections: "Implementors",
        methods: "Methods"
    }
};

var activeTarget;
var selectedId;

function cardMouseDown(event) {
    if (activeTarget) {
        cardMouseUp();
    }
    activeTarget = event.currentTarget;
    event.currentTarget.classList.add("card--active");
    window.addEventListener("mouseup", cardMouseUp);
}

function cardMouseUp(event) {
    activeTarget.classList.remove("card--active");
    activeTarget = null;
    window.removeEventListener("mouseup", cardMouseUp);
}

function cardClick(event) {
    var target = event.currentTarget;
    if (selectedId === target.id) {
        selectedId = null;
        render(allState);
    } else {
        selectedId = target.id;
        render(data.states[target.id]);
        target.classList.add("selected");
        target.scrollIntoViewIfNeeded();
        for (var name in headers) {
            if (target.classList.contains(name)) {
                var headers = headers[name];
                for (var name in headers) {
                    headerElements[name].innerText = headers[name];
                }
                break;
            }
        }
        if (target.classList.contains("method")) {
            panelElements.collections.scrollTop = 0;
        } else if (target.classList.contains("collection")) {
            panelElements.methods.scrollTop = 0;
        }
    }
}

function card(element) {
    element.addEventListener("mousedown", cardMouseDown);
    element.addEventListener("click", cardClick);
}

var elements = {};
function scoop(element) {
    var child = element.firstChild;
    while (child) {
        elements[child.id] = child;
        var next = child.nextSibling;
        element.removeChild(child);
        child.className = "";
        child = next;
    }
}

function render(state) {
    var scroll = {};
    for (var panel in state) {
        var panelElement = panelElements[panel];
        scroll[panel] = panelElement.scrollTop;
        scoop(panelElement);
    }
    for (var panel in state) {
        var cards = state[panel] || data[panel] || [];
        var panelElement = panelElements[panel];
        for (var index = 0; index < cards.length; index++) {
            var card = cards[index];
            var cardElement = elements[card.id];
            cardElement.className = (card.className || "");
            panelElement.appendChild(cardElement);
            // force a paint. chrome render glitch.
            //cardElement.offsetHeight;
        }
        panelElement.scrollTop = scroll[panel];
    }
}

var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
cards.forEach(card);

