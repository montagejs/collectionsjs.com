
// A thin wrapper around a JS-Git repository for promise oriented methods

var Q = require("q");

module.exports = Repository;
function Repository(repository) {
    this.repository = repository;
}

Repository.from = function (repository) {
    if (repository instanceof this) {
        return repository;
    } else {
        return new this(repository);
    }
};

Repository.prototype.updateRef = function (ref, hash) {
    var deferred = Q.defer();
    this.repository.updateRef(ref, hash, deferred.makeNodeResolver());
    return deferred.promise;
};

Repository.prototype.readRef = function (hashish) {
    var self = this;
    var deferred = Q.defer();
    this.repository.readRef(hashish, deferred.makeNodeResolver());
    return deferred.promise.then(function (hash) {
        if (!hash) {
            throw new Error(
                "Can't find hash for reference " + JSON.stringify(hashish) +
                " in " + JSON.stringify(self.repository.rootPath)
            );
        } else {
            return hash;
        }
    });
};

Repository.prototype.loadAs = function (type, hash) {
    var deferred = Q.defer();
    // The arrity of the loadAs callback does not play well with
    // makeNodeResolver.
    this.repository.loadAs(type, hash, deferred.makeNodeResolver());
    return deferred.promise;
};

Repository.prototype.saveAs = function (type, content) {
    var deferred = Q.defer();
    this.repository.saveAs(type, content, deferred.makeNodeResolver());
    return deferred.promise;
};

