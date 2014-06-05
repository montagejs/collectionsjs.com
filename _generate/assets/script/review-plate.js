"use strict";

document.body.normalize();
document.body.classList.add("javascript");

var panelElements = {
    interfaces: document.getElementById("interfaces"),
    collections: document.getElementById("collections"),
    details: document.getElementById("details"),
    methods: document.getElementById("methods")
};

var allState = {
    interfaces: null,
    collections: null,
    details: null,
    methods: null
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
            cardElement.offsetHeight;
        }
        panelElement.scrollTop = scroll[panel];
    }
}

var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
cards.forEach(card);

