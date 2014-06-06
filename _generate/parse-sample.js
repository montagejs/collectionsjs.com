var esprima = require("esprima");

module.exports = function (source) {
    var syntax;
    try {
        syntax = esprima.parse(source, {
            comment: true,
            loc: true,
            range: true
        });
    } catch (error) {
        error.message += " when parsing '" + source + "'";
        throw error;
    }

    return syntax.body.map(function (statement) {
        return source.slice(statement.range[0], statement.range[1]).trim();
    });
};
