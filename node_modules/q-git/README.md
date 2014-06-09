
# Q-Git

Interface with a [JS-Git][] repository as a [Q-IO][] compatible file system.

[JS-Git]: https://github.com/creationix/js-git
[Q-IO]: https://github.com/kriskowal/q-io


## Usage

```sh
npm install --save js-git q-git git-node-fs
```

Create a repository. For example, this repository is backed by the `.git`
on your local file system.
JS-Git requires a certain amount of ceremony oweing to its many layers of
configurability and code reuse.

```js
var repo = {};
repo.rootPath = fs.join(__dirname, "..", ".git");
require("git-node-fs/mixins/fs-db")(repo, repo.rootPath);
require('js-git/mixins/create-tree')(repo);
require('js-git/mixins/pack-ops')(repo);
require('js-git/mixins/walkers')(repo);
require('js-git/mixins/read-combiner')(repo);
require('js-git/mixins/formats')(repo);
```

Then create a file system face for that repository.
From there, you must either load a reference from the repository, or create an
orphan branch by clearing the index.

```js
var gitFs = new GitFs(repo);
return gitFs.load(ref);
// or...
return gitFs.clear();
```

The Git file system supports a very close approximation of the interface the
[Q-IO][] file system.
Each change to the file system constructs a new tree, including streaming writes
to files.

In addition to the file system interface, there are methods for manipulating the
index, commiting, and updating references.
The index tracks the current tree, last commit, and the reference the index was
last loaded or saved from.
All of these return promises for the file system itself.

-   *load(ref)* sets the index’s reference, last commit, and current tree
    to values obtained from the repository through the reference.
-   *clear()* clears the index’s last known commit, reference, and tree.
    This can be called initially to start with an empty commit log and tree.
-   *commit({message, author: {name, email}, parents: [])* creates a commit,
    parented in the previous commit if no parents are specified, with the given
    message and author and the current tree, but does not save the commit to a
    reference.
-   *save()* writes the last commit to the last reference loaded or saved.
-   *saveAs(ref)* writes the last commit to the given reference.

## Copyright and License

Copyright (c) 2014, Montage Studio and contributors.

BSD 3-Clause License (enclosed).

