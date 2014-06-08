// *sigh*
window.jQuery = require("jquery/dist/jquery");
require("typeahead.js/dist/typeahead.bundle.js");

module.exports = function (element /*, options */) {
    var $element = window.jQuery(element);
    $element.typeahead.apply($element, Array.prototype.slice.call(arguments, 1));
    return $element;
};
