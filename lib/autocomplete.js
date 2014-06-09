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

    for (var i = 0; i < data.searchIndex.length; i++) {
        var thing = data.searchIndex[i];
        if (thing.search.indexOf(q) >= 0) {
            matches.push(thing);
        }
    }

    for (var i = 0; i < data.methodIndex.length; i++) {
        var method = data.methodIndex[i];
        for (var j = 0; j < method.searches.length; j++) {
            var name = method.searches[j];
            var pos = name.indexOf(q);
            if (pos >= 0) {
                matches.push(method);
                break;
            }
        }
    }

    cb(matches.slice(0, 10));
}

