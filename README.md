# image-js

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][coveralls-image]][coveralls-url]
  [![npm download][download-image]][download-url]

Image processing and manipulation in JavaScript

## Installation

`npm install image-js`

## Development

### JavaScript tips and tricks

https://github.com/image-js/core/wiki/JavaScript-tips-and-tricks

### Setup

* You will have first to install Node.js. We recommend to use [nvm](https://github.com/creationix/nvm) to install and keep node up to date
* For the developement we are using https://www.jetbrains.com/webstorm/
* In order to be able to connect to GitHub easily it is interesting to add your public SSH key in the preferences of your GitHub account. Detailed procedure is available at https://help.github.com/articles/generating-ssh-keys/.
* After, you may clone and install the project from a console:

```
mkdir image-js
cd image-js
git clone git@github.com:image-js/core.git
cd core
npm install
```

Notes:
* npm install may require the compilation of some code.
  It is therefore necessary to have the compiler.
  On OSX you will have to install the command line tools
  Run `xcode-select --install` and click on "install"
* in order to test you need to install the npm 'canvas'. Follow the instructions for your OS [here](https://github.com/Automattic/node-canvas#installation)

### NPM scripts

NPM scripts allow to run easily certain tasks. They are defined in the script section of the package.json file.
To run any script, use the command `npm run script-name`.

Script name | Description
----------- | -----------
build | build the browser files (for release, do not use it for tests)
build-test | build the browser test file (test/browser/image.js)
clean-dist | delete browser build files
compile | build the Node.js lib files
test | Run the test suite and other checks. Always run this before pushing to GitHub
test-mocha | Run the test suite
watch-browser | build continuously the browser test file
watch-node | build continuously the lib files
build-doc | build the documentation in the doc folder",
publish-doc | publish the documentation in gh-pages branch that is available on https://image-js.github.io/core
eslint-fix | try to fix as well as it can the syntax errors in the code


## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/image-js.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/image-js
[travis-image]: https://img.shields.io/travis/image-js/core/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/image-js/core
[coveralls-image]: https://img.shields.io/coveralls/image-js/core.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/image-js/core
[download-image]: https://img.shields.io/npm/dm/image-js.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/image-js
