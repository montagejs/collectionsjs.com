/*global ga */
var data = require("./data");
var typeahead = require("./typeahead");

var search = document.querySelector(".search input");
autocomplete(search);

function autocomplete(element) {
    var $element = typeahead(element, {
      hint: false,
      highlight: true,
      minLength: 1
    },
    {
      name: 'documents',
      displayKey: 'name',
      source: findMatches,
      templates: {
          empty: "No matching documents.",
          suggestion: function (suggestion) {
              return suggestion.name + " <em>" + suggestion.type + "</em>" + suggestion.summary;
          }
      }
    });

    $element.on("typeahead:selected", function (_, suggestion) {
        if (ga) { ga("send", "event", "search", "selected", suggestion.type + "/" + suggestion.ref); }
        if (suggestion.type === "collection") {
            location.pathname = "/" + suggestion.ref;
        } else {
            location.pathname = "/" + suggestion.type + "/" + suggestion.ref;
        }
    });

    $element.on("typeahead:closed", function () {
        if (ga) { ga("send", "event", "search", "closed", $element.val()); }
    });
}

function findMatches(q, cb) {
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    var matches = [];

    q = q.toLowerCase().replace(/\W+/g, " ");

    var i, j;
    for (i = 0; i < data.searchIndex.length; i++) {
        var thing = data.searchIndex[i];
        if (thing.search.indexOf(q) >= 0) {
            matches.push(thing);
        }
    }

    var name, pos;
    for (i = 0; i < data.propertyIndex.length; i++) {
        var property = data.propertyIndex[i];
        for (j = 0; j < property.searches.length; j++) {
            name = property.searches[j];
            pos = name.indexOf(q);
            if (pos >= 0) {
                matches.push(property);
                break;
            }
        }
    }

    for (i = 0; i < data.methodIndex.length; i++) {
        var method = data.methodIndex[i];
        for (j = 0; j < method.searches.length; j++) {
            name = method.searches[j];
            pos = name.indexOf(q);
            if (pos >= 0) {
                matches.push(method);
                break;
            }
        }
    }

    cb(matches.slice(0, 10));
}

