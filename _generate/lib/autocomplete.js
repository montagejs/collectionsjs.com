var data = require("./search");
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
      name: 'states',
      displayKey: 'name',
      source: matcher(data)
    });

    $element.on("typeahead:selected", function (_, suggestion) {
        if (suggestion.type === "collection") {
            location.pathname = "/" + suggestion.ref;
        } else {
            location.pathname = "/" + suggestion.type + "/" + suggestion.ref;
        }
    });
}

function matcher(data) {
  return function findMatches(q, cb) {
    q = q.toLowerCase();

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    var matches = [];
    data.forEach(function (thing) {
      if (thing.search.indexOf(q) !== -1) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push(thing);
      }
    });

    cb(matches);
  };
};
