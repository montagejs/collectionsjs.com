
var fs = require("q-io/fs");
var httpApps = require("q-io/http-apps");
var generate = require("./generate");

if (require.main === module) {
    var siteFs = fs.reroot(fs.join(__dirname, "..", "_site"));
    return fs.removeTree(fs.join(__dirname, "..", "_site"))
    .catch(function () {})
    .then(function () {
        return fs.makeTree(fs.join(__dirname, "..", "_site"));
    })
    .then(generate.bind(null, siteFs))
    .then(serve.bind(null, siteFs))
    .done();
}

module.exports = serve;
function serve(siteFs) {

    var app = new httpApps.Chain()
    .use(httpApps.Error)
    .use(httpApps.Log)
    .use(httpApps.HandleHtmlFragmentResponses)
    .use(function HtmlRedirect(next) {
        // TODO remove
        return function (request) {
            return next(request)
            .then(function (response) {
                // if no .html extension then retry with .html extension. Leads
                // to cleaner urls (and emulates github)
                if (response.status === 404 && request.url.search(/\.html$/) === -1) {
                    request.url += ".html";
                    request.path += ".html";
                    request.pathInfo += ".html";
                    return next(request);
                } else {
                    return response;
                }
            });
        };
    })
    .use(httpApps.DirectoryIndex)
    .use(function (next) {
        return httpApps.FileTree("/", {
            fs: siteFs
        });
    })
    .end();

    require("q-io/http").Server(app).listen(8000);
    console.log("Serving on http://127.0.0.1:8000");
}

