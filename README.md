# image-js

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![npm download][download-image]][download-url]

Image processing and manipulation in JavaScript

## [API Documentation](https://image-js.github.io/image-js/)

## Installation

`npm install image-js`

### A note about Canvas

Currently, to run some methods of `image-js` on Node.js (including: `.save()`, `.toDataURL()`, `load()` on a JPEG image), it is necessary to install the `canvas` native addon. The addon is specified as an optional dependency. If its compilation fails and you need it, follow the instructions to install it on your OS [here](https://github.com/Automattic/node-canvas#installation).  
Browser builds of the library are not affected as they use the standard Canvas API.

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/image-js.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/image-js
[travis-image]: https://img.shields.io/travis/image-js/image-js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/image-js/image-js
[codecov-image]: https://img.shields.io/codecov/c/github/image-js/image-js.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/image-js/image-js
[download-image]: https://img.shields.io/npm/dm/image-js.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/image-js
 
