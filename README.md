# image-js

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

Image manipulation in JavaScript

## Installation

`npm install ij`

## Developement

### Setup

* You will have first to install nodejs : https://nodejs.org/
* For the developement we are using https://www.jetbrains.com/webstorm/
* In order to be able to connect to github easily it is interesting to add your public SSH key in the preferences of your github account. Detailed procedure is available at https://help.github.com/articles/generating-ssh-keys/.
* After you may clone and install the project from a console:

```
mkdir image-js
cd image-js
git clone git@github.com:image-js/ij.git
cd ij
npm install
```


Notes:
* npm install may require the compilation of some code.
  It is therefore necessary to have the compiler.
  On OsX you will have to instlal xcode and start it once to accept the licence.
* in order to test you need to install the npm 'canvas'.
  On OsX you should first install brew (http://brew.sh/) and then
````
brew update
brew install cairo
brew install giflib
brew install libjpeg
brew install pkg-config
## and then from the image-js/ij folder
npm install canvas
```

### NPM scripts

NPM cripts allow to run easily certain tasks  
To run any script, use the command `npm run script-name`.

Script name | Description
----------- | -----------
build | build the browser files (for release, do not use it for tests)
build-test | build the browser test file (test/browser/ij.js)
compile | build the Node.js files (in lib folder)
clean | delete build files
test | compile and run the test suite
test-mocha | Run the test suite (need to compile first)
watch-browser | build continuously the browser test file
watch-node | build continuously the Node.js files

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ij.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ij
[travis-image]: https://img.shields.io/travis/image-js/ij/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/image-js/ij
[download-image]: https://img.shields.io/npm/dm/ij.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/ij
