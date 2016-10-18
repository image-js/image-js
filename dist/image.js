(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.IJS = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var ES = require('es-abstract/es6');
var $isNaN = Number.isNaN || function (a) {
	return a !== a;
};
var $isFinite = Number.isFinite || function (n) {
	return typeof n === 'number' && global.isFinite(n);
};
var indexOf = Array.prototype.indexOf;

module.exports = function includes(searchElement) {
	var fromIndex = arguments.length > 1 ? ES.ToInteger(arguments[1]) : 0;
	if (indexOf && !$isNaN(searchElement) && $isFinite(fromIndex) && typeof searchElement !== 'undefined') {
		return indexOf.apply(this, arguments) > -1;
	}

	var O = ES.ToObject(this);
	var length = ES.ToLength(O.length);
	if (length === 0) {
		return false;
	}
	var k = fromIndex >= 0 ? fromIndex : Math.max(0, length + fromIndex);
	while (k < length) {
		if (ES.SameValueZero(searchElement, O[k])) {
			return true;
		}
		k += 1;
	}
	return false;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"es-abstract/es6":25}],2:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var ES = require('es-abstract/es6');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var polyfill = getPolyfill();
var shim = require('./shim');

var slice = Array.prototype.slice;

/* eslint-disable no-unused-vars */
var boundIncludesShim = function includes(array, searchElement) {
	/* eslint-enable no-unused-vars */
	ES.RequireObjectCoercible(array);
	return polyfill.apply(array, slice.call(arguments, 1));
};
define(boundIncludesShim, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = boundIncludesShim;

},{"./implementation":1,"./polyfill":3,"./shim":4,"define-properties":23,"es-abstract/es6":25}],3:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return Array.prototype.includes || implementation;
};

},{"./implementation":1}],4:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayPrototypeIncludes() {
	var polyfill = getPolyfill();
	if (Array.prototype.includes !== polyfill) {
		define(Array.prototype, { includes: polyfill });
	}
	return polyfill;
};

},{"./polyfill":3,"define-properties":23}],5:[function(require,module,exports){
"use strict";

module.exports = function _atob(str) {
  return atob(str);
};

},{}],6:[function(require,module,exports){
'use strict';

/* jshint -W079 */

var Blob = require('blob');
var Promise = require('native-or-lie');

//
// PRIVATE
//

// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function binaryStringToArrayBuffer(binary) {
  var length = binary.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  var i = -1;
  while (++i < length) {
    arr[i] = binary.charCodeAt(i);
  }
  return buf;
}

// Can't find original post, but this is close
// http://stackoverflow.com/questions/6965107/ (continues on next line)
// converting-between-strings-and-arraybuffers
function arrayBufferToBinaryString(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  var i = -1;
  while (++i < length) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

// doesn't download the image more than once, because
// browsers aren't dumb. uses the cache
function loadImage(src, crossOrigin) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    img.onload = function () {
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function imgToCanvas(img) {
  var canvas = document.createElement('canvas');

  canvas.width = img.width;
  canvas.height = img.height;

  // copy the image contents to the canvas
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

  return canvas;
}

//
// PUBLIC
//

/**
 * Shim for
 * [new Blob()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Blob.Blob}
 * to support
 * [older browsers that use the deprecated <code>BlobBuilder</code> API]{@link http://caniuse.com/blob}.
 *
 * @param {Array} parts - content of the <code>Blob</code>
 * @param {Object} options - usually just <code>{type: myContentType}</code>
 * @returns {Blob}
 */
function createBlob(parts, options) {
  options = options || {};
  if (typeof options === 'string') {
    options = { type: options }; // do you a solid here
  }
  return new Blob(parts, options);
}

/**
 * Shim for
 * [URL.createObjectURL()]{@link https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL}
 * to support browsers that only have the prefixed
 * <code>webkitURL</code> (e.g. Android <4.4).
 * @param {Blob} blob
 * @returns {string} url
 */
function createObjectURL(blob) {
  return (window.URL || window.webkitURL).createObjectURL(blob);
}

/**
 * Shim for
 * [URL.revokeObjectURL()]{@link https://developer.mozilla.org/en-US/docs/Web/API/URL.revokeObjectURL}
 * to support browsers that only have the prefixed
 * <code>webkitURL</code> (e.g. Android <4.4).
 * @param {string} url
 */
function revokeObjectURL(url) {
  return (window.URL || window.webkitURL).revokeObjectURL(url);
}

/**
 * Convert a <code>Blob</code> to a binary string. Returns a Promise.
 *
 * @param {Blob} blob
 * @returns {Promise} Promise that resolves with the binary string
 */
function blobToBinaryString(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var hasBinaryString = typeof reader.readAsBinaryString === 'function';
    reader.onloadend = function (e) {
      var result = e.target.result || '';
      if (hasBinaryString) {
        return resolve(result);
      }
      resolve(arrayBufferToBinaryString(result));
    };
    reader.onerror = reject;
    if (hasBinaryString) {
      reader.readAsBinaryString(blob);
    } else {
      reader.readAsArrayBuffer(blob);
    }
  });
}

/**
 * Convert a base64-encoded string to a <code>Blob</code>. Returns a Promise.
 * @param {string} base64
 * @param {string|undefined} type - the content type (optional)
 * @returns {Promise} Promise that resolves with the <code>Blob</code>
 */
function base64StringToBlob(base64, type) {
  return Promise.resolve().then(function () {
    var parts = [binaryStringToArrayBuffer(atob(base64))];
    return type ? createBlob(parts, { type: type }) : createBlob(parts);
  });
}

/**
 * Convert a binary string to a <code>Blob</code>. Returns a Promise.
 * @param {string} binary
 * @param {string|undefined} type - the content type (optional)
 * @returns {Promise} Promise that resolves with the <code>Blob</code>
 */
function binaryStringToBlob(binary, type) {
  return Promise.resolve().then(function () {
    return base64StringToBlob(btoa(binary), type);
  });
}

/**
 * Convert a <code>Blob</code> to a binary string. Returns a Promise.
 * @param {Blob} blob
 * @returns {Promise} Promise that resolves with the binary string
 */
function blobToBase64String(blob) {
  return blobToBinaryString(blob).then(function (binary) {
    return btoa(binary);
  });
}

/**
 * Convert a data URL string
 * (e.g. <code>'data:image/png;base64,iVBORw0KG...'</code>)
 * to a <code>Blob</code>. Returns a Promise.
 * @param {string} dataURL
 * @returns {Promise} Promise that resolves with the <code>Blob</code>
 */
function dataURLToBlob(dataURL) {
  return Promise.resolve().then(function () {
    var type = dataURL.match(/data:([^;]+)/)[1];
    var base64 = dataURL.replace(/^[^,]+,/, '');

    var buff = binaryStringToArrayBuffer(atob(base64));
    return createBlob([buff], { type: type });
  });
}

/**
 * Convert an image's <code>src</code> URL to a data URL by loading the image and painting
 * it to a <code>canvas</code>. Returns a Promise.
 *
 * <p/>Note: this will coerce the image to the desired content type, and it
 * will only paint the first frame of an animated GIF.
 *
 * @param {string} src
 * @param {string|undefined} type - the content type (optional, defaults to 'image/png')
 * @param {string|undefined} crossOrigin - for CORS-enabled images, set this to
 *                                         'Anonymous' to avoid "tainted canvas" errors
 * @param {number|undefined} quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns {Promise} Promise that resolves with the data URL string
 */
function imgSrcToDataURL(src, type, crossOrigin, quality) {
  type = type || 'image/png';

  return loadImage(src, crossOrigin).then(function (img) {
    return imgToCanvas(img);
  }).then(function (canvas) {
    return canvas.toDataURL(type, quality);
  });
}

/**
 * Convert a <code>canvas</code> to a <code>Blob</code>. Returns a Promise.
 * @param {string} canvas
 * @param {string|undefined} type - the content type (optional, defaults to 'image/png')
 * @param {number|undefined} quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns {Promise} Promise that resolves with the <code>Blob</code>
 */
function canvasToBlob(canvas, type, quality) {
  return Promise.resolve().then(function () {
    if (typeof canvas.toBlob === 'function') {
      return new Promise(function (resolve) {
        canvas.toBlob(resolve, type, quality);
      });
    }
    return dataURLToBlob(canvas.toDataURL(type, quality));
  });
}

/**
 * Convert an image's <code>src</code> URL to a <code>Blob</code> by loading the image and painting
 * it to a <code>canvas</code>. Returns a Promise.
 *
 * <p/>Note: this will coerce the image to the desired content type, and it
 * will only paint the first frame of an animated GIF.
 *
 * @param {string} src
 * @param {string|undefined} type - the content type (optional, defaults to 'image/png')
 * @param {string|undefined} crossOrigin - for CORS-enabled images, set this to
 *                                         'Anonymous' to avoid "tainted canvas" errors
 * @param {number|undefined} quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns {Promise} Promise that resolves with the <code>Blob</code>
 */
function imgSrcToBlob(src, type, crossOrigin, quality) {
  type = type || 'image/png';

  return loadImage(src, crossOrigin).then(function (img) {
    return imgToCanvas(img);
  }).then(function (canvas) {
    return canvasToBlob(canvas, type, quality);
  });
}

/**
 * Convert an <code>ArrayBuffer</code> to a <code>Blob</code>. Returns a Promise.
 *
 * @param {ArrayBuffer} buffer
 * @param {string|undefined} type - the content type (optional)
 * @returns {Promise} Promise that resolves with the <code>Blob</code>
 */
function arrayBufferToBlob(buffer, type) {
  return Promise.resolve().then(function () {
    return createBlob([buffer], type);
  });
}

/**
 * Convert a <code>Blob</code> to an <code>ArrayBuffer</code>. Returns a Promise.
 * @param {Blob} blob
 * @returns {Promise} Promise that resolves with the <code>ArrayBuffer</code>
 */
function blobToArrayBuffer(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var result = e.target.result || new ArrayBuffer(0);
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

module.exports = {
  createBlob: createBlob,
  createObjectURL: createObjectURL,
  revokeObjectURL: revokeObjectURL,
  imgSrcToBlob: imgSrcToBlob,
  imgSrcToDataURL: imgSrcToDataURL,
  canvasToBlob: canvasToBlob,
  dataURLToBlob: dataURLToBlob,
  blobToBase64String: blobToBase64String,
  base64StringToBlob: base64StringToBlob,
  binaryStringToBlob: binaryStringToBlob,
  blobToBinaryString: blobToBinaryString,
  arrayBufferToBlob: arrayBufferToBlob,
  blobToArrayBuffer: blobToArrayBuffer
};

},{"blob":7,"native-or-lie":112}],7:[function(require,module,exports){
(function (global){
'use strict';

/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = function () {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch (e) {
    return false;
  }
}();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && function () {
  try {
    var b = new Blob([new Uint8Array([1, 2])]);
    return b.size === 2;
  } catch (e) {
    return false;
  }
}();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return options.type ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = function () {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
"use strict";

},{}],9:[function(require,module,exports){
'use strict';

module.exports = {
  hex2rgb: require('./lib/hex2rgb'),
  hsv2hex: require('./lib/hsv2hex'),
  hsv2rgb: require('./lib/hsv2rgb'),
  rgb2hex: require('./lib/rgb2hex'),
  rgb2hsv: require('./lib/rgb2hsv'),
  rgba: require('./lib/rgba'),
  rgba2rgb: require('./lib/rgba2rgb'),
  rgba2hex: require('./lib/rgba2hex'),
  hsl2hsv: require('./lib/hsl2hsv'),
  hsv2hsl: require('./lib/hsv2hsl'),
  hsl2rgb: require('./lib/hsl2rgb'),
  cssColor: require('./lib/css-color')
};

},{"./lib/css-color":11,"./lib/hex2rgb":12,"./lib/hsl2hsv":13,"./lib/hsl2rgb":14,"./lib/hsv2hex":15,"./lib/hsv2hsl":16,"./lib/hsv2rgb":17,"./lib/rgb2hex":18,"./lib/rgb2hsv":19,"./lib/rgba":20,"./lib/rgba2hex":21,"./lib/rgba2rgb":22}],10:[function(require,module,exports){
"use strict";

module.exports = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 132, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 255, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 203],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [119, 128, 144],
  slategrey: [119, 128, 144],
  snow: [255, 255, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 5]
};

},{}],11:[function(require,module,exports){
'use strict';

// based on component/color-parser

var hsl2rgb = require('./hsl2rgb');
var colors = require('./_colors');

function parse(str) {
  return named(str) || hex3(str) || hex6(str) || rgb(str) || rgba(str) || hsl(str) || hsla(str);
}

function named(str) {
  var c = colors[str.toLowerCase()];
  if (!c) return;
  return {
    r: c[0],
    g: c[1],
    b: c[2],
    a: 100
  };
}

function rgb(str) {
  if (0 == str.indexOf('rgb(')) {
    str = str.match(/rgb\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */).map(Number);
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: 100
    };
  }
}

function rgba(str) {
  if (str.indexOf('rgba(') === 0) {
    str = str.match(/rgba\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */).map(Number);

    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts[3] * 100
    };
  }
}

function hex6(str) {
  if ('#' === str[0] && 7 === str.length) {
    return {
      r: parseInt(str.slice(1, 3), 16),
      g: parseInt(str.slice(3, 5), 16),
      b: parseInt(str.slice(5, 7), 16),
      a: 100
    };
  }
}

function hex3(str) {
  if ('#' === str[0] && 4 === str.length) {
    return {
      r: parseInt(str[1] + str[1], 16),
      g: parseInt(str[2] + str[2], 16),
      b: parseInt(str[3] + str[3], 16),
      a: 100
    };
  }
}

function hsl(str) {
  if (str.indexOf('hsl(') === 0) {
    str = str.match(/hsl\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */);

    var h = parseInt(parts[0], 10);
    var s = parseInt(parts[1], 10);
    var l = parseInt(parts[2], 10);

    var rgba = hsl2rgb(h, s, l);
    rgba.a = 100;

    return rgba;
  }
}

function hsla(str) {
  if (str.indexOf('hsla(') === 0) {
    str = str.match(/hsla\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */);

    var h = parseInt(parts[0], 10);
    var s = parseInt(parts[1], 10);
    var l = parseInt(parts[2], 10);
    var a = parseInt(parts[3] * 100, 10);

    var rgba = hsl2rgb(h, s, l);
    rgba.a = a;

    return rgba;
  }
}

module.exports = parse;

},{"./_colors":10,"./hsl2rgb":14}],12:[function(require,module,exports){
'use strict';

module.exports = function (hex) {
  if (hex[0] === '#') hex = hex.substr(1);

  if (hex.length === 6) {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  } else if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16)
    };
  }
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function (h, s, l) {
  s *= (l < 50 ? l : 100 - l) / 100;

  console.log('s', s);

  return {
    h: h,
    s: 2 * s / (l + s) * 100,
    v: l + s
  };
};

},{}],14:[function(require,module,exports){
'use strict';

var hsl2hsv = require('./hsl2hsv');
var hsv2rgb = require('./hsv2rgb');

module.exports = function (h, s, l) {
  var hsv = hsl2hsv(h, s, l);
  return hsv2rgb(hsv.h, hsv.s, hsv.v);
};

},{"./hsl2hsv":13,"./hsv2rgb":17}],15:[function(require,module,exports){
'use strict';

var hsv2rgb = require('./hsv2rgb');
var rgb2hex = require('./rgb2hex');

module.exports = function (h, s, v) {
  var rgb = hsv2rgb(h, s, v);
  return rgb2hex(rgb.r, rgb.g, rgb.b);
};

},{"./hsv2rgb":17,"./rgb2hex":18}],16:[function(require,module,exports){
"use strict";

module.exports = function (h, s, v) {
  var hh = (200 - s) * v / 100;

  return {
    h: h,
    s: s * v / (hh < 100 ? hh : 200 - hh),
    l: hh / 2
  };
};

},{}],17:[function(require,module,exports){
"use strict";

// http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
module.exports = function (h, s, v) {
  var s = s / 100,
      v = v / 100;
  var rgb = [];

  var c = v * s;
  var hh = h / 60;
  var x = c * (1 - Math.abs(hh % 2 - 1));
  var m = v - c;

  switch (parseInt(hh, 10)) {
    case 0:
      rgb = [c, x, 0];
      break;

    case 1:
      rgb = [x, c, 0];
      break;

    case 2:
      rgb = [0, c, x];
      break;

    case 3:
      rgb = [0, x, c];
      break;

    case 4:
      rgb = [x, 0, c];
      break;

    case 5:
      rgb = [c, 0, x];
      break;
  }

  return {
    r: Math.round(255 * (rgb[0] + m)),
    g: Math.round(255 * (rgb[1] + m)),
    b: Math.round(255 * (rgb[2] + m))
  };
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function (r, g, b) {
  return [_convert(r), _convert(g), _convert(b)].join('');

  function _convert(num) {
    var hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
};

},{}],19:[function(require,module,exports){
"use strict";

// http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
module.exports = function (r, g, b) {
  var h, s, v;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var delta = max - min;

  // hue
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // saturation
  s = Math.round((max === 0 ? 0 : delta / max) * 100);

  // value
  v = Math.round(max / 255 * 100);

  return {
    h: h,
    s: s,
    v: v
  };
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function (r, g, b, a) {
  return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
};

},{}],21:[function(require,module,exports){
'use strict';

var rgba2rgb = require('./rgba2rgb');
var rgb2hex = require('./rgb2hex');

module.exports = function (r, g, b, a) {
  var rgb = rgba2rgb(r, g, b, a);
  return rgb2hex(rgb.r, rgb.g, rgb.b);
};

},{"./rgb2hex":18,"./rgba2rgb":22}],22:[function(require,module,exports){
"use strict";

// https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending
module.exports = function (r, g, b, a) {
  a = a / 100;

  return {
    r: parseInt((1 - a) * 255 + a * r, 10),
    g: parseInt((1 - a) * 255 + a * g, 10),
    b: parseInt((1 - a) * 255 + a * b, 10)
  };
};

},{}],23:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function isFunction(fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function arePropertyDescriptorsSupported() {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
		/* eslint-disable no-unused-vars, no-restricted-syntax */
		for (var _ in obj) {
			return false;
		}
		/* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) {
		/* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function defineProperty(object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function defineProperties(object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":41,"object-keys":116}],24:[function(require,module,exports){
'use strict';

var $isNaN = require('./helpers/isNaN');
var $isFinite = require('./helpers/isFinite');

var sign = require('./helpers/sign');
var mod = require('./helpers/mod');

var IsCallable = require('is-callable');
var toPrimitive = require('es-to-primitive/es5');

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) {
			return 0;
		}
		if (number === 0 || !$isFinite(number)) {
			return number;
		}
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) {
			// 0 === -0, but they are not identical.
			if (x === 0) {
				return 1 / x === 1 / y;
			}
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	}
};

module.exports = ES5;

},{"./helpers/isFinite":27,"./helpers/isNaN":28,"./helpers/mod":30,"./helpers/sign":31,"es-to-primitive/es5":32,"is-callable":50}],25:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

var $isNaN = require('./helpers/isNaN');
var $isFinite = require('./helpers/isFinite');
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = require('./helpers/assign');
var sign = require('./helpers/sign');
var mod = require('./helpers/mod');
var isPrimitive = require('./helpers/isPrimitive');
var toPrimitive = require('es-to-primitive/es6');
var parseInteger = parseInt;
var bind = require('function-bind');
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[\-\+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = ['\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function trim(value) {
	return replace(value, trimRegex, '');
};

var ES5 = require('./es5');

var hasRegExpMatcher = require('is-regex');

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
		if (typeof value === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) {
			return 0;
		}
		if (number >= 0xFF) {
			return 0xFF;
		}
		var f = Math.floor(argument);
		if (f + 0.5 < number) {
			return f + 1;
		}
		if (number < f + 0.5) {
			return f;
		}
		if (f % 2 !== 0) {
			return f + 1;
		}
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) {
			return 0;
		} // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) {
			return MAX_SAFE_INTEGER;
		}
		return len;
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') {
			return -0;
		}
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) {
			return n;
		}
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) {
			return true;
		}
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = argument[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return x === y || $isNaN(x) && $isNaN(y);
	},

	Type: function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		return ES5.Type(x);
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new TypeError('no constructor found');
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

},{"./es5":24,"./helpers/assign":26,"./helpers/isFinite":27,"./helpers/isNaN":28,"./helpers/isPrimitive":29,"./helpers/mod":30,"./helpers/sign":31,"es-to-primitive/es6":33,"function-bind":43,"is-regex":54}],26:[function(require,module,exports){
"use strict";

var has = Object.prototype.hasOwnProperty;
module.exports = Object.assign || function assign(target, source) {
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

},{}],27:[function(require,module,exports){
'use strict';

var $isNaN = Number.isNaN || function (a) {
  return a !== a;
};

module.exports = Number.isFinite || function (x) {
  return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity;
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

},{}],29:[function(require,module,exports){
'use strict';

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && typeof value !== 'object';
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

},{}],32:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function DefaultValue(O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

},{"./helpers/isPrimitive":34,"is-callable":50}],33:[function(require,module,exports){
'use strict';

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = require('./helpers/isPrimitive');
var isCallable = require('is-callable');
var isDate = require('is-date-object');
var isSymbol = require('is-symbol');

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || hint !== 'number' && hint !== 'string') {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

},{"./helpers/isPrimitive":34,"is-callable":50,"is-date-object":51,"is-symbol":55}],34:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],35:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options,
	    name,
	    src,
	    copy,
	    copyIsArray,
	    clone,
	    target = arguments[0],
	    i = 1,
	    length = arguments.length,
	    deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== 'object' && typeof target !== 'function' || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],36:[function(require,module,exports){
'use strict';

var IOBuffer = require('iobuffer');
var tiff = require('tiff');

function decode(data) {
    var buffer = new IOBuffer(data);
    var result = {};
    buffer.setBigEndian();
    var val = buffer.readUint16();
    if (val !== 0xffd8) {
        throw new Error('SOI marker not found. Not a valid JPEG file');
    }
    var next = buffer.readUint16();
    if (next === 0xffe1) {
        var length = buffer.readUint16();
        var header = buffer.readBytes(6);
        if (header[0] === 69 && // E
        header[1] === 120 && // x
        header[2] === 105 && // i
        header[3] === 102 && // f
        header[4] === 0 && header[5] === 0) {
            //     buffer.skip(2);
            var exif = tiff.decode(buffer, {
                onlyFirst: true,
                ignoreImageData: true,
                offset: buffer.offset
            });
            result.exif = exif;
        }
    }
    return result;
}

module.exports = decode;

},{"iobuffer":48,"tiff":137}],37:[function(require,module,exports){
'use strict';

exports.decode = require('./decode');

},{"./decode":36}],38:[function(require,module,exports){
'use strict';

var IOBuffer = require('iobuffer');
var Inflator = require('pako').Inflate;

var empty = new Uint8Array(0);
var NULL = '\0';
var pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

class PNGDecoder extends IOBuffer {
    constructor(data) {
        super(data);
        this._decoded = false;
        this._inflator = new Inflator();
        this._png = null;
        this._end = false;
        // PNG is always big endian
        // http://www.w3.org/TR/PNG/#7Integers-and-byte-order
        this.setBigEndian();
    }

    decode() {
        if (this._decoded) return this._png;
        this._png = {
            tEXt: {}
        };
        this.decodeSignature();
        while (!this._end) {
            this.decodeChunk();
        }
        this.decodeImage();
        return this._png;
    }

    // http://www.w3.org/TR/PNG/#5PNG-file-signature
    decodeSignature() {
        for (var i = 0; i < 8; i++) {
            if (this.readUint8() !== pngSignature[i]) {
                throw new Error(`Wrong PNG signature. Byte at ${ i } should be ${ pngSignature[i] }.`);
            }
        }
    }

    // http://www.w3.org/TR/PNG/#5Chunk-layout
    decodeChunk() {
        var length = this.readUint32();
        var type = this.readChars(4);
        var offset = this.offset;
        switch (type) {
            case 'IHDR':
                this.decodeIHDR();
                break;
            case 'PLTE':
                this.decodePLTE(length);
                break;
            case 'IDAT':
                this.decodeIDAT(length);
                break;
            case 'tEXt':
                this.decodetEXt(length);
                break;
            case 'IEND':
                this._end = true;
                break;
            default:
                this.skip(length);
                break;
        }
        if (this.offset - offset !== length) {
            throw new Error('Length mismatch while decoding chunk ' + type);
        }
        // TODO compute and validate CRC ?
        // http://www.w3.org/TR/PNG/#5CRC-algorithm
        var crc = this.readUint32();
    }

    // http://www.w3.org/TR/PNG/#11IHDR
    decodeIHDR() {
        var image = this._png;
        image.width = this.readUint32();
        image.height = this.readUint32();
        image.bitDepth = this.readUint8();
        image.colourType = this.readUint8();
        image.compressionMethod = this.readUint8();
        image.filterMethod = this.readUint8();
        image.interlaceMethod = this.readUint8();
        if (this._png.compressionMethod !== 0) {
            throw new Error('Unsupported compression method: ' + image.compressionMethod);
        }
    }

    // https://www.w3.org/TR/PNG/#11PLTE
    decodePLTE(length) {
        if (length % 3 !== 0) {
            throw new RangeError('PLTE field length must be a multiple of 3. Got ' + length);
        }
        var l = length / 3;
        this._hasPalette = true;
        var palette = this._palette = new Array(l);
        for (var i = 0; i < l; i++) {
            palette[i] = [this.readUint8(), this.readUint8(), this.readUint8()];
        }
    }

    // http://www.w3.org/TR/PNG/#11IDAT
    decodeIDAT(length) {
        this._inflator.push(new Uint8Array(this.buffer, this.offset, length));
        this.skip(length);
    }

    // http://www.w3.org/TR/PNG/#11tEXt
    decodetEXt(length) {
        var keyword = '';
        var char;
        while ((char = this.readChar()) !== NULL) {
            keyword += char;
        }
        this._png.tEXt[keyword] = this.readChars(length - keyword.length - 1);
    }

    decodeImage() {
        this._inflator.push(empty, true);
        if (this._inflator.err) {
            throw new Error('Error while decompressing the data');
        }
        var data = this._inflator.result;
        this._inflator = null;

        if (this._png.filterMethod !== 0) {
            throw new Error('Filter method ' + this._png.filterMethod + ' not supported');
        }

        if (this._png.interlaceMethod === 0) {
            this.decodeInterlaceNull(data);
        } else {
            throw new Error('Interlace method ' + this._png.interlaceMethod + ' not supported');
        }
    }

    decodeInterlaceNull(data) {

        var channels;
        switch (this._png.colourType) {
            case 0:
                channels = 1;break;
            case 2:
                channels = 3;break;
            case 3:
                if (!this._hasPalette) throw new Error('Missing palette');
                channels = 1;
                break;
            case 4:
                channels = 2;break;
            case 6:
                channels = 4;break;
            default:
                throw new Error('Unknown colour type: ' + this._png.colourType);
        }

        var height = this._png.height;
        var bytesPerPixel = channels * this._png.bitDepth / 8;
        var bytesPerLine = this._png.width * bytesPerPixel;
        var newData = new Uint8Array(this._png.height * bytesPerLine);

        var prevLine = empty;
        var offset = 0;
        var currentLine, newLine;

        for (var i = 0; i < height; i++) {
            currentLine = data.subarray(offset + 1, offset + 1 + bytesPerLine);
            newLine = newData.subarray(i * bytesPerLine, (i + 1) * bytesPerLine);
            switch (data[offset]) {
                case 0:
                    unfilterNone(currentLine, newLine, bytesPerLine);
                    break;
                case 1:
                    unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel);
                    break;
                case 2:
                    unfilterUp(currentLine, newLine, prevLine, bytesPerLine);
                    break;
                case 3:
                    unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
                    break;
                case 4:
                    unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
                    break;
                default:
                    throw new Error('Unsupported filter: ' + data[offset]);
            }
            prevLine = newLine;
            offset += bytesPerLine + 1;
        }

        if (this._hasPalette) {
            this._png.palette = this._palette;
        }
        this._png.data = newData;
    }

}

module.exports = PNGDecoder;

function unfilterNone(currentLine, newLine, bytesPerLine) {
    for (var i = 0; i < bytesPerLine; i++) {
        newLine[i] = currentLine[i];
    }
}

function unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel) {
    var i = 0;
    for (; i < bytesPerPixel; i++) {
        // just copy first bytes
        newLine[i] = currentLine[i];
    }
    for (; i < bytesPerLine; i++) {
        newLine[i] = currentLine[i] + newLine[i - bytesPerPixel] & 0xFF;
    }
}

function unfilterUp(currentLine, newLine, prevLine, bytesPerLine) {
    var i = 0;
    if (prevLine.length === 0) {
        // just copy bytes for first line
        for (; i < bytesPerLine; i++) {
            newLine[i] = currentLine[i];
        }
    } else {
        for (; i < bytesPerLine; i++) {
            newLine[i] = currentLine[i] + prevLine[i] & 0xFF;
        }
    }
}

function unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
    var i = 0;
    if (prevLine.length === 0) {
        for (; i < bytesPerPixel; i++) {
            newLine[i] = currentLine[i];
        }
        for (; i < bytesPerLine; i++) {
            newLine[i] = currentLine[i] + (newLine[i - bytesPerPixel] >> 1) & 0xFF;
        }
    } else {
        for (; i < bytesPerPixel; i++) {
            newLine[i] = currentLine[i] + (prevLine[i] >> 1) & 0xFF;
        }
        for (; i < bytesPerLine; i++) {
            newLine[i] = currentLine[i] + (newLine[i - bytesPerPixel] + prevLine[i] >> 1) & 0xFF;
        }
    }
}

function unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
    var i = 0;
    if (prevLine.length === 0) {
        for (; i < bytesPerPixel; i++) {
            newLine[i] = currentLine[i];
        }
        for (; i < bytesPerLine; i++) {
            newLine[i] = currentLine[i] + newLine[i - bytesPerPixel] & 0xFF;
        }
    } else {
        for (; i < bytesPerPixel; i++) {
            newLine[i] = currentLine[i] + prevLine[i] & 0xFF;
        }
        for (; i < bytesPerLine; i++) {
            newLine[i] = currentLine[i] + paethPredictor(newLine[i - bytesPerPixel], prevLine[i], prevLine[i - bytesPerPixel]) & 0xFF;
        }
    }
}

function paethPredictor(a, b, c) {
    var p = a + b - c;
    var pa = Math.abs(p - a);
    var pb = Math.abs(p - b);
    var pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;else if (pb <= pc) return b;else return c;
}

},{"iobuffer":48,"pako":118}],39:[function(require,module,exports){
'use strict';

exports.PNGDecoder = require('./PNGDecoder');

},{"./PNGDecoder":38}],40:[function(require,module,exports){
'use strict';

module.exports = function (buf) {
	if (!(buf && buf.length > 1)) {
		return null;
	}

	if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
		return {
			ext: 'jpg',
			mime: 'image/jpeg'
		};
	}

	if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
		return {
			ext: 'png',
			mime: 'image/png'
		};
	}

	if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
		return {
			ext: 'gif',
			mime: 'image/gif'
		};
	}

	if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
		return {
			ext: 'webp',
			mime: 'image/webp'
		};
	}

	if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x49 && buf[3] === 0x46) {
		return {
			ext: 'flif',
			mime: 'image/flif'
		};
	}

	// needs to be before `tif` check
	if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0 || buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A) && buf[8] === 0x43 && buf[9] === 0x52) {
		return {
			ext: 'cr2',
			mime: 'image/x-canon-cr2'
		};
	}

	if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0 || buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A) {
		return {
			ext: 'tif',
			mime: 'image/tiff'
		};
	}

	if (buf[0] === 0x42 && buf[1] === 0x4D) {
		return {
			ext: 'bmp',
			mime: 'image/bmp'
		};
	}

	if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0xBC) {
		return {
			ext: 'jxr',
			mime: 'image/vnd.ms-photo'
		};
	}

	if (buf[0] === 0x38 && buf[1] === 0x42 && buf[2] === 0x50 && buf[3] === 0x53) {
		return {
			ext: 'psd',
			mime: 'image/vnd.adobe.photoshop'
		};
	}

	// needs to be before `zip` check
	if (buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x3 && buf[3] === 0x4 && buf[30] === 0x6D && buf[31] === 0x69 && buf[32] === 0x6D && buf[33] === 0x65 && buf[34] === 0x74 && buf[35] === 0x79 && buf[36] === 0x70 && buf[37] === 0x65 && buf[38] === 0x61 && buf[39] === 0x70 && buf[40] === 0x70 && buf[41] === 0x6C && buf[42] === 0x69 && buf[43] === 0x63 && buf[44] === 0x61 && buf[45] === 0x74 && buf[46] === 0x69 && buf[47] === 0x6F && buf[48] === 0x6E && buf[49] === 0x2F && buf[50] === 0x65 && buf[51] === 0x70 && buf[52] === 0x75 && buf[53] === 0x62 && buf[54] === 0x2B && buf[55] === 0x7A && buf[56] === 0x69 && buf[57] === 0x70) {
		return {
			ext: 'epub',
			mime: 'application/epub+zip'
		};
	}

	// needs to be before `zip` check
	// assumes signed .xpi from addons.mozilla.org
	if (buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x3 && buf[3] === 0x4 && buf[30] === 0x4D && buf[31] === 0x45 && buf[32] === 0x54 && buf[33] === 0x41 && buf[34] === 0x2D && buf[35] === 0x49 && buf[36] === 0x4E && buf[37] === 0x46 && buf[38] === 0x2F && buf[39] === 0x6D && buf[40] === 0x6F && buf[41] === 0x7A && buf[42] === 0x69 && buf[43] === 0x6C && buf[44] === 0x6C && buf[45] === 0x61 && buf[46] === 0x2E && buf[47] === 0x72 && buf[48] === 0x73 && buf[49] === 0x61) {
		return {
			ext: 'xpi',
			mime: 'application/x-xpinstall'
		};
	}

	if (buf[0] === 0x50 && buf[1] === 0x4B && (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) && (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)) {
		return {
			ext: 'zip',
			mime: 'application/zip'
		};
	}

	if (buf[257] === 0x75 && buf[258] === 0x73 && buf[259] === 0x74 && buf[260] === 0x61 && buf[261] === 0x72) {
		return {
			ext: 'tar',
			mime: 'application/x-tar'
		};
	}

	if (buf[0] === 0x52 && buf[1] === 0x61 && buf[2] === 0x72 && buf[3] === 0x21 && buf[4] === 0x1A && buf[5] === 0x7 && (buf[6] === 0x0 || buf[6] === 0x1)) {
		return {
			ext: 'rar',
			mime: 'application/x-rar-compressed'
		};
	}

	if (buf[0] === 0x1F && buf[1] === 0x8B && buf[2] === 0x8) {
		return {
			ext: 'gz',
			mime: 'application/gzip'
		};
	}

	if (buf[0] === 0x42 && buf[1] === 0x5A && buf[2] === 0x68) {
		return {
			ext: 'bz2',
			mime: 'application/x-bzip2'
		};
	}

	if (buf[0] === 0x37 && buf[1] === 0x7A && buf[2] === 0xBC && buf[3] === 0xAF && buf[4] === 0x27 && buf[5] === 0x1C) {
		return {
			ext: '7z',
			mime: 'application/x-7z-compressed'
		};
	}

	if (buf[0] === 0x78 && buf[1] === 0x01) {
		return {
			ext: 'dmg',
			mime: 'application/x-apple-diskimage'
		};
	}

	if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && (buf[3] === 0x18 || buf[3] === 0x20) && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 || buf[0] === 0x33 && buf[1] === 0x67 && buf[2] === 0x70 && buf[3] === 0x35 || buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x6D && buf[9] === 0x70 && buf[10] === 0x34 && buf[11] === 0x32 && buf[16] === 0x6D && buf[17] === 0x70 && buf[18] === 0x34 && buf[19] === 0x31 && buf[20] === 0x6D && buf[21] === 0x70 && buf[22] === 0x34 && buf[23] === 0x32 && buf[24] === 0x69 && buf[25] === 0x73 && buf[26] === 0x6F && buf[27] === 0x6D || buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x69 && buf[9] === 0x73 && buf[10] === 0x6F && buf[11] === 0x6D || buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1c && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x6D && buf[9] === 0x70 && buf[10] === 0x34 && buf[11] === 0x32 && buf[12] === 0x0 && buf[13] === 0x0 && buf[14] === 0x0 && buf[15] === 0x0) {
		return {
			ext: 'mp4',
			mime: 'video/mp4'
		};
	}

	if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x4D && buf[9] === 0x34 && buf[10] === 0x56) {
		return {
			ext: 'm4v',
			mime: 'video/x-m4v'
		};
	}

	if (buf[0] === 0x4D && buf[1] === 0x54 && buf[2] === 0x68 && buf[3] === 0x64) {
		return {
			ext: 'mid',
			mime: 'audio/midi'
		};
	}

	// needs to be before the `webm` check
	if (buf[31] === 0x6D && buf[32] === 0x61 && buf[33] === 0x74 && buf[34] === 0x72 && buf[35] === 0x6f && buf[36] === 0x73 && buf[37] === 0x6B && buf[38] === 0x61) {
		return {
			ext: 'mkv',
			mime: 'video/x-matroska'
		};
	}

	if (buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) {
		return {
			ext: 'webm',
			mime: 'video/webm'
		};
	}

	if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x14 && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
		return {
			ext: 'mov',
			mime: 'video/quicktime'
		};
	}

	if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x41 && buf[9] === 0x56 && buf[10] === 0x49) {
		return {
			ext: 'avi',
			mime: 'video/x-msvideo'
		};
	}

	if (buf[0] === 0x30 && buf[1] === 0x26 && buf[2] === 0xB2 && buf[3] === 0x75 && buf[4] === 0x8E && buf[5] === 0x66 && buf[6] === 0xCF && buf[7] === 0x11 && buf[8] === 0xA6 && buf[9] === 0xD9) {
		return {
			ext: 'wmv',
			mime: 'video/x-ms-wmv'
		};
	}

	if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x1 && buf[3].toString(16)[0] === 'b') {
		return {
			ext: 'mpg',
			mime: 'video/mpeg'
		};
	}

	if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33 || buf[0] === 0xFF && buf[1] === 0xfb) {
		return {
			ext: 'mp3',
			mime: 'audio/mpeg'
		};
	}

	if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x4D && buf[9] === 0x34 && buf[10] === 0x41 || buf[0] === 0x4D && buf[1] === 0x34 && buf[2] === 0x41 && buf[3] === 0x20) {
		return {
			ext: 'm4a',
			mime: 'audio/m4a'
		};
	}

	// needs to be before `ogg` check
	if (buf[28] === 0x4F && buf[29] === 0x70 && buf[30] === 0x75 && buf[31] === 0x73 && buf[32] === 0x48 && buf[33] === 0x65 && buf[34] === 0x61 && buf[35] === 0x64) {
		return {
			ext: 'opus',
			mime: 'audio/opus'
		};
	}

	if (buf[0] === 0x4F && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) {
		return {
			ext: 'ogg',
			mime: 'audio/ogg'
		};
	}

	if (buf[0] === 0x66 && buf[1] === 0x4C && buf[2] === 0x61 && buf[3] === 0x43) {
		return {
			ext: 'flac',
			mime: 'audio/x-flac'
		};
	}

	if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x41 && buf[10] === 0x56 && buf[11] === 0x45) {
		return {
			ext: 'wav',
			mime: 'audio/x-wav'
		};
	}

	if (buf[0] === 0x23 && buf[1] === 0x21 && buf[2] === 0x41 && buf[3] === 0x4D && buf[4] === 0x52 && buf[5] === 0x0A) {
		return {
			ext: 'amr',
			mime: 'audio/amr'
		};
	}

	if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
		return {
			ext: 'pdf',
			mime: 'application/pdf'
		};
	}

	if (buf[0] === 0x4D && buf[1] === 0x5A) {
		return {
			ext: 'exe',
			mime: 'application/x-msdownload'
		};
	}

	if ((buf[0] === 0x43 || buf[0] === 0x46) && buf[1] === 0x57 && buf[2] === 0x53) {
		return {
			ext: 'swf',
			mime: 'application/x-shockwave-flash'
		};
	}

	if (buf[0] === 0x7B && buf[1] === 0x5C && buf[2] === 0x72 && buf[3] === 0x74 && buf[4] === 0x66) {
		return {
			ext: 'rtf',
			mime: 'application/rtf'
		};
	}

	if (buf[0] === 0x77 && buf[1] === 0x4F && buf[2] === 0x46 && buf[3] === 0x46 && (buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00 || buf[4] === 0x4F && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4F)) {
		return {
			ext: 'woff',
			mime: 'application/font-woff'
		};
	}

	if (buf[0] === 0x77 && buf[1] === 0x4F && buf[2] === 0x46 && buf[3] === 0x32 && (buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00 || buf[4] === 0x4F && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4F)) {
		return {
			ext: 'woff2',
			mime: 'application/font-woff'
		};
	}

	if (buf[34] === 0x4C && buf[35] === 0x50 && (buf[8] === 0x00 && buf[9] === 0x00 && buf[10] === 0x01 || buf[8] === 0x01 && buf[9] === 0x00 && buf[10] === 0x02 || buf[8] === 0x02 && buf[9] === 0x00 && buf[10] === 0x02)) {
		return {
			ext: 'eot',
			mime: 'application/octet-stream'
		};
	}

	if (buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00 && buf[4] === 0x00) {
		return {
			ext: 'ttf',
			mime: 'application/font-sfnt'
		};
	}

	if (buf[0] === 0x4F && buf[1] === 0x54 && buf[2] === 0x54 && buf[3] === 0x4F && buf[4] === 0x00) {
		return {
			ext: 'otf',
			mime: 'application/font-sfnt'
		};
	}

	if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) {
		return {
			ext: 'ico',
			mime: 'image/x-icon'
		};
	}

	if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x56 && buf[3] === 0x01) {
		return {
			ext: 'flv',
			mime: 'video/x-flv'
		};
	}

	if (buf[0] === 0x25 && buf[1] === 0x21) {
		return {
			ext: 'ps',
			mime: 'application/postscript'
		};
	}

	if (buf[0] === 0xFD && buf[1] === 0x37 && buf[2] === 0x7A && buf[3] === 0x58 && buf[4] === 0x5A && buf[5] === 0x00) {
		return {
			ext: 'xz',
			mime: 'application/x-xz'
		};
	}

	if (buf[0] === 0x53 && buf[1] === 0x51 && buf[2] === 0x4C && buf[3] === 0x69) {
		return {
			ext: 'sqlite',
			mime: 'application/x-sqlite3'
		};
	}

	if (buf[0] === 0x4E && buf[1] === 0x45 && buf[2] === 0x53 && buf[3] === 0x1A) {
		return {
			ext: 'nes',
			mime: 'application/x-nintendo-nes-rom'
		};
	}

	if (buf[0] === 0x43 && buf[1] === 0x72 && buf[2] === 0x32 && buf[3] === 0x34) {
		return {
			ext: 'crx',
			mime: 'application/x-google-chrome-extension'
		};
	}

	if (buf[0] === 0x4D && buf[1] === 0x53 && buf[2] === 0x43 && buf[3] === 0x46 || buf[0] === 0x49 && buf[1] === 0x53 && buf[2] === 0x63 && buf[3] === 0x28) {
		return {
			ext: 'cab',
			mime: 'application/vnd.ms-cab-compressed'
		};
	}

	// needs to be before `ar` check
	if (buf[0] === 0x21 && buf[1] === 0x3C && buf[2] === 0x61 && buf[3] === 0x72 && buf[4] === 0x63 && buf[5] === 0x68 && buf[6] === 0x3E && buf[7] === 0x0A && buf[8] === 0x64 && buf[9] === 0x65 && buf[10] === 0x62 && buf[11] === 0x69 && buf[12] === 0x61 && buf[13] === 0x6E && buf[14] === 0x2D && buf[15] === 0x62 && buf[16] === 0x69 && buf[17] === 0x6E && buf[18] === 0x61 && buf[19] === 0x72 && buf[20] === 0x79) {
		return {
			ext: 'deb',
			mime: 'application/x-deb'
		};
	}

	if (buf[0] === 0x21 && buf[1] === 0x3C && buf[2] === 0x61 && buf[3] === 0x72 && buf[4] === 0x63 && buf[5] === 0x68 && buf[6] === 0x3E) {
		return {
			ext: 'ar',
			mime: 'application/x-unix-archive'
		};
	}

	if (buf[0] === 0xED && buf[1] === 0xAB && buf[2] === 0xEE && buf[3] === 0xDB) {
		return {
			ext: 'rpm',
			mime: 'application/x-rpm'
		};
	}

	if (buf[0] === 0x1F && buf[1] === 0xA0 || buf[0] === 0x1F && buf[1] === 0x9D) {
		return {
			ext: 'Z',
			mime: 'application/x-compress'
		};
	}

	if (buf[0] === 0x4C && buf[1] === 0x5A && buf[2] === 0x49 && buf[3] === 0x50) {
		return {
			ext: 'lz',
			mime: 'application/x-lzip'
		};
	}

	if (buf[0] === 0xD0 && buf[1] === 0xCF && buf[2] === 0x11 && buf[3] === 0xE0 && buf[4] === 0xA1 && buf[5] === 0xB1 && buf[6] === 0x1A && buf[7] === 0xE1) {
		return {
			ext: 'msi',
			mime: 'application/x-msi'
		};
	}

	return null;
};

},{}],41:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach(obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

},{}],42:[function(require,module,exports){
'use strict';

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function binder() {
        if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(that, args.concat(slice.call(arguments)));
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],43:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":42}],44:[function(require,module,exports){
'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = exports = function hasOwn(prop, obj) {
  return hasOwnProperty.call(obj, prop);
};

exports.version = require('./package').version;

},{"./package":45}],45:[function(require,module,exports){
module.exports={
  "name": "has-own",
  "version": "1.0.0",
  "description": "A safer .hasOwnProperty() - hasOwn(name, obj)",
  "main": "index.js",
  "scripts": {
    "test": "make test"
  },
  "author": "Aaron Heckmann <aaron.heckmann+github@gmail.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git://github.com/pebble/has-own.git"
  },
  "homepage": "https://github.com/pebble/has-own/",
  "devDependencies": {
    "mocha": "^1.21.0"
  }
}

},{}],46:[function(require,module,exports){
'use strict';

var fileType = require('file-type');

module.exports = function (buf) {
	var imageExts = ['jpg', 'png', 'gif', 'webp', 'tif', 'bmp', 'jxr', 'psd'];

	var ret = fileType(buf);

	return imageExts.indexOf(ret && ret.ext) !== -1 ? ret : null;
};

},{"file-type":40}],47:[function(require,module,exports){
(function (global){
'use strict';

var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function scheduleDrain() {
      element.data = called = ++called % 2;
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function scheduleDrain() {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function scheduleDrain() {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function scheduleDrain() {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],48:[function(require,module,exports){
'use strict';

var defaultByteLength = 1024 * 8;
var charArray = [];

class IOBuffer {
    constructor(data, options) {
        options = options || {};
        if (data === undefined) {
            data = defaultByteLength;
        }
        if (typeof data === 'number') {
            data = new ArrayBuffer(data);
        }
        var length = data.byteLength;
        var offset = options.offset ? options.offset >>> 0 : 0;
        if (data.buffer) {
            length = data.byteLength - offset;
            if (data.byteLength !== data.buffer.byteLength) {
                // Node.js buffer from pool
                data = data.buffer.slice(data.byteOffset + offset, data.byteOffset + data.byteLength);
            } else if (offset) {
                data = data.buffer.slice(offset);
            } else {
                data = data.buffer;
            }
        }
        this.buffer = data;
        this.length = length;
        this.byteLength = length;
        this.byteOffset = 0;
        this.offset = 0;
        this.littleEndian = true;
        this._data = new DataView(this.buffer);
        this._increment = length || defaultByteLength;
        this._mark = 0;
    }

    available(byteLength) {
        if (byteLength === undefined) byteLength = 1;
        return this.offset + byteLength <= this.length;
    }

    isLittleEndian() {
        return this.littleEndian;
    }

    setLittleEndian() {
        this.littleEndian = true;
    }

    isBigEndian() {
        return !this.littleEndian;
    }

    setBigEndian() {
        this.littleEndian = false;
    }

    skip(n) {
        if (n === undefined) n = 1;
        this.offset += n;
    }

    seek(offset) {
        this.offset = offset;
    }

    mark() {
        this._mark = this.offset;
    }

    reset() {
        this.offset = this._mark;
    }

    rewind() {
        this.offset = 0;
    }

    ensureAvailable(byteLength) {
        if (byteLength === undefined) byteLength = 1;
        if (!this.available(byteLength)) {
            var newIncrement = this._increment + this._increment;
            this._increment = newIncrement;
            var newLength = this.length + newIncrement;
            var newArray = new Uint8Array(newLength);
            newArray.set(new Uint8Array(this.buffer));
            this.buffer = newArray.buffer;
            this.length = newLength;
            this._data = new DataView(this.buffer);
        }
    }

    readBoolean() {
        return this.readUint8() !== 0;
    }

    readInt8() {
        return this._data.getInt8(this.offset++);
    }

    readUint8() {
        return this._data.getUint8(this.offset++);
    }

    readByte() {
        return this.readUint8();
    }

    readBytes(n) {
        if (n === undefined) n = 1;
        var bytes = new Uint8Array(n);
        for (var i = 0; i < n; i++) {
            bytes[i] = this.readByte();
        }
        return bytes;
    }

    readInt16() {
        var value = this._data.getInt16(this.offset, this.littleEndian);
        this.offset += 2;
        return value;
    }

    readUint16() {
        var value = this._data.getUint16(this.offset, this.littleEndian);
        this.offset += 2;
        return value;
    }

    readInt32() {
        var value = this._data.getInt32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }

    readUint32() {
        var value = this._data.getUint32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }

    readFloat32() {
        var value = this._data.getFloat32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }

    readFloat64() {
        var value = this._data.getFloat64(this.offset, this.littleEndian);
        this.offset += 8;
        return value;
    }

    readChar() {
        return String.fromCharCode(this.readInt8());
    }

    readChars(n) {
        if (n === undefined) n = 1;
        charArray.length = n;
        for (var i = 0; i < n; i++) {
            charArray[i] = this.readChar();
        }
        return charArray.join('');
    }

    writeBoolean(bool) {
        this.writeUint8(bool ? 0xff : 0x00);
    }

    writeInt8(value) {
        this.ensureAvailable(1);
        this._data.setInt8(this.offset++, value);
    }

    writeUint8(value) {
        this.ensureAvailable(1);
        this._data.setUint8(this.offset++, value);
    }

    writeByte(value) {
        this.writeUint8(value);
    }

    writeBytes(bytes) {
        this.ensureAvailable(bytes.length);
        for (var i = 0; i < bytes.length; i++) {
            this._data.setUint8(this.offset++, bytes[i]);
        }
    }

    writeInt16(value) {
        this.ensureAvailable(2);
        this._data.setInt16(this.offset, value, this.littleEndian);
        this.offset += 2;
    }

    writeUint16(value) {
        this.ensureAvailable(2);
        this._data.setUint16(this.offset, value, this.littleEndian);
        this.offset += 2;
    }

    writeInt32(value) {
        this.ensureAvailable(4);
        this._data.setInt32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    writeUint32(value) {
        this.ensureAvailable(4);
        this._data.setUint32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    writeFloat32(value) {
        this.ensureAvailable(4);
        this._data.setFloat32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    writeFloat64(value) {
        this.ensureAvailable(8);
        this._data.setFloat64(this.offset, value, this.littleEndian);
        this.offset += 8;
    }

    writeChar(str) {
        this.writeUint8(str.charCodeAt(0));
    }

    writeChars(str) {
        for (var i = 0; i < str.length; i++) {
            this.writeUint8(str.charCodeAt(i));
        }
    }

    toArray() {
        return new Uint8Array(this.buffer, 0, this.offset);
    }
}

module.exports = IOBuffer;

},{}],49:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString;

module.exports = function isArrayType(value) {
    return toString.call(value).substr(-6, 5) === 'Array';
};

},{}],50:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) {
			return false;
		}
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) {
		return false;
	}
	if (typeof value !== 'function' && typeof value !== 'object') {
		return false;
	}
	if (hasToStringTag) {
		return tryFunctionObject(value);
	}
	if (isES6ClassFn(value)) {
		return false;
	}
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],51:[function(require,module,exports){
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},{}],52:[function(require,module,exports){
'use strict';

var numberIsNan = require('number-is-nan');

module.exports = Number.isFinite || function (val) {
	return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
};

},{"number-is-nan":115}],53:[function(require,module,exports){
"use strict";

// https://github.com/paulmillr/es6-shim
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isinteger
var isFinite = require("is-finite");
module.exports = Number.isInteger || function (val) {
  return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
};

},{"is-finite":52}],54:[function(require,module,exports){
'use strict';

var regexExec = RegExp.prototype.exec;
var tryRegexExec = function tryRegexExec(value) {
	try {
		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (typeof value !== 'object') {
		return false;
	}
	return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
};

},{}],55:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}],56:[function(require,module,exports){
(function (global){
"use strict";

(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.PriorityQueue = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (_dereq_, module, exports) {
      var AbstractPriorityQueue,
          ArrayStrategy,
          BHeapStrategy,
          BinaryHeapStrategy,
          PriorityQueue,
          extend = function extend(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }function ctor() {
          this.constructor = child;
        }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
      },
          hasProp = {}.hasOwnProperty;

      AbstractPriorityQueue = _dereq_('./PriorityQueue/AbstractPriorityQueue');

      ArrayStrategy = _dereq_('./PriorityQueue/ArrayStrategy');

      BinaryHeapStrategy = _dereq_('./PriorityQueue/BinaryHeapStrategy');

      BHeapStrategy = _dereq_('./PriorityQueue/BHeapStrategy');

      PriorityQueue = function (superClass) {
        extend(PriorityQueue, superClass);

        function PriorityQueue(options) {
          options || (options = {});
          options.strategy || (options.strategy = BinaryHeapStrategy);
          options.comparator || (options.comparator = function (a, b) {
            return (a || 0) - (b || 0);
          });
          PriorityQueue.__super__.constructor.call(this, options);
        }

        return PriorityQueue;
      }(AbstractPriorityQueue);

      PriorityQueue.ArrayStrategy = ArrayStrategy;

      PriorityQueue.BinaryHeapStrategy = BinaryHeapStrategy;

      PriorityQueue.BHeapStrategy = BHeapStrategy;

      module.exports = PriorityQueue;
    }, { "./PriorityQueue/AbstractPriorityQueue": 2, "./PriorityQueue/ArrayStrategy": 3, "./PriorityQueue/BHeapStrategy": 4, "./PriorityQueue/BinaryHeapStrategy": 5 }], 2: [function (_dereq_, module, exports) {
      var AbstractPriorityQueue;

      module.exports = AbstractPriorityQueue = function () {
        function AbstractPriorityQueue(options) {
          var ref;
          if ((options != null ? options.strategy : void 0) == null) {
            throw 'Must pass options.strategy, a strategy';
          }
          if ((options != null ? options.comparator : void 0) == null) {
            throw 'Must pass options.comparator, a comparator';
          }
          this.priv = new options.strategy(options);
          this.length = (options != null ? (ref = options.initialValues) != null ? ref.length : void 0 : void 0) || 0;
        }

        AbstractPriorityQueue.prototype.queue = function (value) {
          this.length++;
          this.priv.queue(value);
          return void 0;
        };

        AbstractPriorityQueue.prototype.dequeue = function (value) {
          if (!this.length) {
            throw 'Empty queue';
          }
          this.length--;
          return this.priv.dequeue();
        };

        AbstractPriorityQueue.prototype.peek = function (value) {
          if (!this.length) {
            throw 'Empty queue';
          }
          return this.priv.peek();
        };

        AbstractPriorityQueue.prototype.clear = function () {
          this.length = 0;
          return this.priv.clear();
        };

        return AbstractPriorityQueue;
      }();
    }, {}], 3: [function (_dereq_, module, exports) {
      var ArrayStrategy, binarySearchForIndexReversed;

      binarySearchForIndexReversed = function binarySearchForIndexReversed(array, value, comparator) {
        var high, low, mid;
        low = 0;
        high = array.length;
        while (low < high) {
          mid = low + high >>> 1;
          if (comparator(array[mid], value) >= 0) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return low;
      };

      module.exports = ArrayStrategy = function () {
        function ArrayStrategy(options) {
          var ref;
          this.options = options;
          this.comparator = this.options.comparator;
          this.data = ((ref = this.options.initialValues) != null ? ref.slice(0) : void 0) || [];
          this.data.sort(this.comparator).reverse();
        }

        ArrayStrategy.prototype.queue = function (value) {
          var pos;
          pos = binarySearchForIndexReversed(this.data, value, this.comparator);
          this.data.splice(pos, 0, value);
          return void 0;
        };

        ArrayStrategy.prototype.dequeue = function () {
          return this.data.pop();
        };

        ArrayStrategy.prototype.peek = function () {
          return this.data[this.data.length - 1];
        };

        ArrayStrategy.prototype.clear = function () {
          this.data.length = 0;
          return void 0;
        };

        return ArrayStrategy;
      }();
    }, {}], 4: [function (_dereq_, module, exports) {
      var BHeapStrategy;

      module.exports = BHeapStrategy = function () {
        function BHeapStrategy(options) {
          var arr, i, j, k, len, ref, ref1, shift, value;
          this.comparator = (options != null ? options.comparator : void 0) || function (a, b) {
            return a - b;
          };
          this.pageSize = (options != null ? options.pageSize : void 0) || 512;
          this.length = 0;
          shift = 0;
          while (1 << shift < this.pageSize) {
            shift += 1;
          }
          if (1 << shift !== this.pageSize) {
            throw 'pageSize must be a power of two';
          }
          this._shift = shift;
          this._emptyMemoryPageTemplate = arr = [];
          for (i = j = 0, ref = this.pageSize; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            arr.push(null);
          }
          this._memory = [];
          this._mask = this.pageSize - 1;
          if (options.initialValues) {
            ref1 = options.initialValues;
            for (k = 0, len = ref1.length; k < len; k++) {
              value = ref1[k];
              this.queue(value);
            }
          }
        }

        BHeapStrategy.prototype.queue = function (value) {
          this.length += 1;
          this._write(this.length, value);
          this._bubbleUp(this.length, value);
          return void 0;
        };

        BHeapStrategy.prototype.dequeue = function () {
          var ret, val;
          ret = this._read(1);
          val = this._read(this.length);
          this.length -= 1;
          if (this.length > 0) {
            this._write(1, val);
            this._bubbleDown(1, val);
          }
          return ret;
        };

        BHeapStrategy.prototype.peek = function () {
          return this._read(1);
        };

        BHeapStrategy.prototype.clear = function () {
          this.length = 0;
          this._memory.length = 0;
          return void 0;
        };

        BHeapStrategy.prototype._write = function (index, value) {
          var page;
          page = index >> this._shift;
          while (page >= this._memory.length) {
            this._memory.push(this._emptyMemoryPageTemplate.slice(0));
          }
          return this._memory[page][index & this._mask] = value;
        };

        BHeapStrategy.prototype._read = function (index) {
          return this._memory[index >> this._shift][index & this._mask];
        };

        BHeapStrategy.prototype._bubbleUp = function (index, value) {
          var compare, indexInPage, parentIndex, parentValue;
          compare = this.comparator;
          while (index > 1) {
            indexInPage = index & this._mask;
            if (index < this.pageSize || indexInPage > 3) {
              parentIndex = index & ~this._mask | indexInPage >> 1;
            } else if (indexInPage < 2) {
              parentIndex = index - this.pageSize >> this._shift;
              parentIndex += parentIndex & ~(this._mask >> 1);
              parentIndex |= this.pageSize >> 1;
            } else {
              parentIndex = index - 2;
            }
            parentValue = this._read(parentIndex);
            if (compare(parentValue, value) < 0) {
              break;
            }
            this._write(parentIndex, value);
            this._write(index, parentValue);
            index = parentIndex;
          }
          return void 0;
        };

        BHeapStrategy.prototype._bubbleDown = function (index, value) {
          var childIndex1, childIndex2, childValue1, childValue2, compare;
          compare = this.comparator;
          while (index < this.length) {
            if (index > this._mask && !(index & this._mask - 1)) {
              childIndex1 = childIndex2 = index + 2;
            } else if (index & this.pageSize >> 1) {
              childIndex1 = (index & ~this._mask) >> 1;
              childIndex1 |= index & this._mask >> 1;
              childIndex1 = childIndex1 + 1 << this._shift;
              childIndex2 = childIndex1 + 1;
            } else {
              childIndex1 = index + (index & this._mask);
              childIndex2 = childIndex1 + 1;
            }
            if (childIndex1 !== childIndex2 && childIndex2 <= this.length) {
              childValue1 = this._read(childIndex1);
              childValue2 = this._read(childIndex2);
              if (compare(childValue1, value) < 0 && compare(childValue1, childValue2) <= 0) {
                this._write(childIndex1, value);
                this._write(index, childValue1);
                index = childIndex1;
              } else if (compare(childValue2, value) < 0) {
                this._write(childIndex2, value);
                this._write(index, childValue2);
                index = childIndex2;
              } else {
                break;
              }
            } else if (childIndex1 <= this.length) {
              childValue1 = this._read(childIndex1);
              if (compare(childValue1, value) < 0) {
                this._write(childIndex1, value);
                this._write(index, childValue1);
                index = childIndex1;
              } else {
                break;
              }
            } else {
              break;
            }
          }
          return void 0;
        };

        return BHeapStrategy;
      }();
    }, {}], 5: [function (_dereq_, module, exports) {
      var BinaryHeapStrategy;

      module.exports = BinaryHeapStrategy = function () {
        function BinaryHeapStrategy(options) {
          var ref;
          this.comparator = (options != null ? options.comparator : void 0) || function (a, b) {
            return a - b;
          };
          this.length = 0;
          this.data = ((ref = options.initialValues) != null ? ref.slice(0) : void 0) || [];
          this._heapify();
        }

        BinaryHeapStrategy.prototype._heapify = function () {
          var i, j, ref;
          if (this.data.length > 0) {
            for (i = j = 1, ref = this.data.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
              this._bubbleUp(i);
            }
          }
          return void 0;
        };

        BinaryHeapStrategy.prototype.queue = function (value) {
          this.data.push(value);
          this._bubbleUp(this.data.length - 1);
          return void 0;
        };

        BinaryHeapStrategy.prototype.dequeue = function () {
          var last, ret;
          ret = this.data[0];
          last = this.data.pop();
          if (this.data.length > 0) {
            this.data[0] = last;
            this._bubbleDown(0);
          }
          return ret;
        };

        BinaryHeapStrategy.prototype.peek = function () {
          return this.data[0];
        };

        BinaryHeapStrategy.prototype.clear = function () {
          this.length = 0;
          this.data.length = 0;
          return void 0;
        };

        BinaryHeapStrategy.prototype._bubbleUp = function (pos) {
          var parent, x;
          while (pos > 0) {
            parent = pos - 1 >>> 1;
            if (this.comparator(this.data[pos], this.data[parent]) < 0) {
              x = this.data[parent];
              this.data[parent] = this.data[pos];
              this.data[pos] = x;
              pos = parent;
            } else {
              break;
            }
          }
          return void 0;
        };

        BinaryHeapStrategy.prototype._bubbleDown = function (pos) {
          var last, left, minIndex, right, x;
          last = this.data.length - 1;
          while (true) {
            left = (pos << 1) + 1;
            right = left + 1;
            minIndex = pos;
            if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
              minIndex = left;
            }
            if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
              minIndex = right;
            }
            if (minIndex !== pos) {
              x = this.data[minIndex];
              this.data[minIndex] = this.data[pos];
              this.data[pos] = x;
              pos = minIndex;
            } else {
              break;
            }
          }
          return void 0;
        };

        return BinaryHeapStrategy;
      }();
    }, {}] }, {}, [1])(1);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],57:[function(require,module,exports){
'use strict';

var immediate = require('immediate');

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED || typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && typeof obj === 'object' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"immediate":47}],58:[function(require,module,exports){
'use strict';

var Stat = require('ml-stat').array;
/**
 * Function that returns an array of points given 1D array as follows:
 *
 * [x1, y1, .. , x2, y2, ..]
 *
 * And receive the number of dimensions of each point.
 * @param array
 * @param dimensions
 * @returns {Array} - Array of points.
 */
function coordArrayToPoints(array, dimensions) {
    if (array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var length = array.length / dimensions;
    var pointsArr = new Array(length);

    var k = 0;
    for (var i = 0; i < array.length; i += dimensions) {
        var point = new Array(dimensions);
        for (var j = 0; j < dimensions; ++j) {
            point[j] = array[i + j];
        }

        pointsArr[k] = point;
        k++;
    }

    return pointsArr;
}

/**
 * Function that given an array as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * Returns an array as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * And receives the number of dimensions of each coordinate.
 * @param array
 * @param dimensions
 * @returns {Array} - Matrix of coordinates
 */
function coordArrayToCoordMatrix(array, dimensions) {
    if (array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var coordinatesArray = new Array(dimensions);
    var points = array.length / dimensions;
    for (var i = 0; i < coordinatesArray.length; i++) {
        coordinatesArray[i] = new Array(points);
    }

    for (i = 0; i < array.length; i += dimensions) {
        for (var j = 0; j < dimensions; ++j) {
            var currentPoint = Math.floor(i / dimensions);
            coordinatesArray[j][currentPoint] = array[i + j];
        }
    }

    return coordinatesArray;
}

/**
 * Function that receives a coordinate matrix as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * Returns an array of coordinates as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param coordMatrix
 * @returns {Array}
 */
function coordMatrixToCoordArray(coordMatrix) {
    var coodinatesArray = new Array(coordMatrix.length * coordMatrix[0].length);
    var k = 0;
    for (var i = 0; i < coordMatrix[0].length; ++i) {
        for (var j = 0; j < coordMatrix.length; ++j) {
            coodinatesArray[k] = coordMatrix[j][i];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Tranpose a matrix, this method is for coordMatrixToPoints and
 * pointsToCoordMatrix, that because only transposing the matrix
 * you can change your representation.
 *
 * @param matrix
 * @returns {Array}
 */
function transpose(matrix) {
    var resultMatrix = new Array(matrix[0].length);
    for (var i = 0; i < resultMatrix.length; ++i) {
        resultMatrix[i] = new Array(matrix.length);
    }

    for (i = 0; i < matrix.length; ++i) {
        for (var j = 0; j < matrix[0].length; ++j) {
            resultMatrix[j][i] = matrix[i][j];
        }
    }

    return resultMatrix;
}

/**
 * Function that transform an array of points into a coordinates array
 * as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param points
 * @returns {Array}
 */
function pointsToCoordArray(points) {
    var coodinatesArray = new Array(points.length * points[0].length);
    var k = 0;
    for (var i = 0; i < points.length; ++i) {
        for (var j = 0; j < points[0].length; ++j) {
            coodinatesArray[k] = points[i][j];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Apply the dot product between the smaller vector and a subsets of the
 * largest one.
 *
 * @param firstVector
 * @param secondVector
 * @returns {Array} each dot product of size of the difference between the
 *                  larger and the smallest one.
 */
function applyDotProduct(firstVector, secondVector) {
    var largestVector, smallestVector;
    if (firstVector.length <= secondVector.length) {
        smallestVector = firstVector;
        largestVector = secondVector;
    } else {
        smallestVector = secondVector;
        largestVector = firstVector;
    }

    var difference = largestVector.length - smallestVector.length + 1;
    var dotProductApplied = new Array(difference);

    for (var i = 0; i < difference; ++i) {
        var sum = 0;
        for (var j = 0; j < smallestVector.length; ++j) {
            sum += smallestVector[j] * largestVector[i + j];
        }
        dotProductApplied[i] = sum;
    }

    return dotProductApplied;
}
/**
 * To scale the input array between the specified min and max values. The operation is performed inplace
 * if the options.inplace is specified. If only one of the min or max parameters is specified, then the scaling
 * will multiply the input array by min/min(input) or max/max(input)
 * @param input
 * @param options
 * @returns {*}
 */
function scale(input, options) {
    var y;
    if (options.inPlace) {
        y = input;
    } else {
        y = new Array(input.length);
    }
    var max = options.max;
    var min = options.min;
    if (typeof max === "number") {
        if (typeof min === "number") {
            var minMax = Stat.minMax(input);
            var factor = (max - min) / (minMax.max - minMax.min);
            for (var i = 0; i < y.length; i++) {
                y[i] = (input[i] - minMax.min) * factor + min;
            }
        } else {
            var currentMin = Stat.max(input);
            var factor = max / currentMin;
            for (var i = 0; i < y.length; i++) {
                y[i] = input[i] * factor;
            }
        }
    } else {
        if (typeof min === "number") {
            var currentMin = Stat.min(input);
            var factor = min / currentMin;
            for (var i = 0; i < y.length; i++) {
                y[i] = input[i] * factor;
            }
        }
    }
    return y;
}

module.exports = {
    coordArrayToPoints: coordArrayToPoints,
    coordArrayToCoordMatrix: coordArrayToCoordMatrix,
    coordMatrixToCoordArray: coordMatrixToCoordArray,
    coordMatrixToPoints: transpose,
    pointsToCoordArray: pointsToCoordArray,
    pointsToCoordMatrix: transpose,
    applyDotProduct: applyDotProduct,
    scale: scale
};

},{"ml-stat":110}],59:[function(require,module,exports){
'use strict';

/**
 *
 * Function that returns a Number array of equally spaced numberOfPoints
 * containing a representation of intensities of the spectra arguments x
 * and y.
 *
 * The options parameter contains an object in the following form:
 * from: starting point
 * to: last point
 * numberOfPoints: number of points between from and to
 * variant: "slot" or "smooth" - smooth is the default option
 *
 * The slot variant consist that each point in the new array is calculated
 * averaging the existing points between the slot that belongs to the current
 * value. The smooth variant is the same but takes the integral of the range
 * of the slot and divide by the step size between two points in the new array.
 *
 * @param x - sorted increasing x values
 * @param y
 * @param options
 * @returns {Array} new array with the equally spaced data.
 *
 */

function getEquallySpacedData(x, y, options) {
    if (x.length > 1 && x[0] > x[1]) {
        x = x.slice().reverse();
        y = y.slice().reverse();
    }

    var xLength = x.length;
    if (xLength !== y.length) throw new RangeError("the x and y vector doesn't have the same size.");

    if (options === undefined) options = {};

    var from = options.from === undefined ? x[0] : options.from;
    if (isNaN(from) || !isFinite(from)) {
        throw new RangeError("'From' value must be a number");
    }
    var to = options.to === undefined ? x[x.length - 1] : options.to;
    if (isNaN(to) || !isFinite(to)) {
        throw new RangeError("'To' value must be a number");
    }

    var reverse = from > to;
    if (reverse) {
        var temp = from;
        from = to;
        to = temp;
    }

    var numberOfPoints = options.numberOfPoints === undefined ? 100 : options.numberOfPoints;
    if (isNaN(numberOfPoints) || !isFinite(numberOfPoints)) {
        throw new RangeError("'Number of points' value must be a number");
    }
    if (numberOfPoints < 1) throw new RangeError("the number of point must be higher than 1");

    var algorithm = options.variant === "slot" ? "slot" : "smooth"; // default value: smooth

    var output = algorithm === "slot" ? getEquallySpacedSlot(x, y, from, to, numberOfPoints) : getEquallySpacedSmooth(x, y, from, to, numberOfPoints);

    return reverse ? output.reverse() : output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "smooth"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "smooth"
 */
function getEquallySpacedSmooth(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    var initialOriginalStep = x[1] - x[0];
    var lastOriginalStep = x[x.length - 1] - x[x.length - 2];

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = Number.MIN_VALUE;
    var previousY = 0;
    var nextX = x[0] - initialOriginalStep;
    var nextY = 0;

    var currentValue = 0;
    var slope = 0;
    var intercept = 0;
    var sumAtMin = 0;
    var sumAtMax = 0;

    var i = 0; // index of input
    var j = 0; // index of output

    function getSlope(x0, y0, x1, y1) {
        return (y1 - y0) / (x1 - x0);
    }

    main: while (true) {
        while (nextX - max >= 0) {
            // no overlap with original point, just consume current value
            var add = integral(0, max - previousX, slope, previousY);
            sumAtMax = currentValue + add;

            output[j] = (sumAtMax - sumAtMin) / step;
            j++;

            if (j === numberOfPoints) break main;

            min = max;
            max += step;
            sumAtMin = sumAtMax;
        }

        if (previousX <= min && min <= nextX) {
            add = integral(0, min - previousX, slope, previousY);
            sumAtMin = currentValue + add;
        }

        currentValue += integral(previousX, nextX, slope, intercept);

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else if (i === xLength) {
            nextX += lastOriginalStep;
            nextY = 0;
        }
        // updating parameters
        slope = getSlope(previousX, previousY, nextX, nextY);
        intercept = -slope * previousX + previousY;
    }

    return output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "slot"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "slot"
 */
function getEquallySpacedSlot(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;
    var lastStep = x[x.length - 1] - x[x.length - 2];

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = -Number.MAX_VALUE;
    var previousY = 0;
    var nextX = x[0];
    var nextY = y[0];
    var frontOutsideSpectra = 0;
    var backOutsideSpectra = true;

    var currentValue = 0;

    // for slot algorithm
    var currentPoints = 0;

    var i = 1; // index of input
    var j = 0; // index of output

    main: while (true) {
        if (previousX >= nextX) throw new Error('x must be an increasing serie');
        while (previousX - max > 0) {
            // no overlap with original point, just consume current value
            if (backOutsideSpectra) {
                currentPoints++;
                backOutsideSpectra = false;
            }

            output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
            j++;

            if (j === numberOfPoints) break main;

            min = max;
            max += step;
            currentValue = 0;
            currentPoints = 0;
        }

        if (previousX > min) {
            currentValue += previousY;
            currentPoints++;
        }

        if (previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1) currentPoints--;

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else {
            nextX += lastStep;
            nextY = 0;
            frontOutsideSpectra++;
        }
    }

    return output;
}
/**
 * Function that calculates the integral of the line between two
 * x-coordinates, given the slope and intercept of the line.
 *
 * @param x0
 * @param x1
 * @param slope
 * @param intercept
 * @returns {number} integral value.
 */
function integral(x0, x1, slope, intercept) {
    return 0.5 * slope * x1 * x1 + intercept * x1 - (0.5 * slope * x0 * x0 + intercept * x0);
}

exports.getEquallySpacedData = getEquallySpacedData;
exports.integral = integral;

},{}],60:[function(require,module,exports){
'use strict';

module.exports = exports = require('./ArrayUtils');

exports.getEquallySpacedData = require('./getEquallySpaced').getEquallySpacedData;
exports.SNV = require('./snv').SNV;

},{"./ArrayUtils":58,"./getEquallySpaced":59,"./snv":61}],61:[function(require,module,exports){
'use strict';

exports.SNV = SNV;
var Stat = require('ml-stat').array;

/**
 * Function that applies the standard normal variate (SNV) to an array of values.
 *
 * @param data - Array of values.
 * @returns {Array} - applied the SNV.
 */
function SNV(data) {
    var mean = Stat.mean(data);
    var std = Stat.standardDeviation(data);
    var result = data.slice();
    for (var i = 0; i < data.length; i++) {
        result[i] = (result[i] - mean) / std;
    }
    return result;
}

},{"ml-stat":110}],62:[function(require,module,exports){
'use strict';

function squaredEuclidean(p, q) {
    var d = 0;
    for (var i = 0; i < p.length; i++) {
        d += (p[i] - q[i]) * (p[i] - q[i]);
    }
    return d;
}

function euclidean(p, q) {
    return Math.sqrt(squaredEuclidean(p, q));
}

module.exports = euclidean;
euclidean.squared = squaredEuclidean;

},{}],63:[function(require,module,exports){
'use strict';

var FFT = require('./fftlib');

var FFTUtils = {
    DEBUG: false,

    /**
     * Calculates the inverse of a 2D Fourier transform
     *
     * @param ft
     * @param ftRows
     * @param ftCols
     * @return
     */
    ifft2DArray: function ifft2DArray(ft, ftRows, ftCols) {
        var tempTransform = new Array(ftRows * ftCols);
        var nRows = ftRows / 2;
        var nCols = (ftCols - 1) * 2;
        // reverse transform columns
        FFT.init(nRows);
        var tmpCols = { re: new Array(nRows), im: new Array(nRows) };
        for (var iCol = 0; iCol < ftCols; iCol++) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = ft[iRow * 2 * ftCols + iCol];
                tmpCols.im[iRow] = ft[(iRow * 2 + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tempTransform[iRow * 2 * ftCols + iCol] = tmpCols.re[iRow];
                tempTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        // reverse row transform
        var finalTransform = new Array(nRows * nCols);
        FFT.init(nCols);
        var tmpRows = { re: new Array(nCols), im: new Array(nCols) };
        var scale = nCols * nRows;
        for (var iRow = 0; iRow < ftRows; iRow += 2) {
            tmpRows.re[0] = tempTransform[iRow * ftCols];
            tmpRows.im[0] = tempTransform[(iRow + 1) * ftCols];
            for (var iCol = 1; iCol < ftCols; iCol++) {
                tmpRows.re[iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[iCol] = tempTransform[(iRow + 1) * ftCols + iCol];
                tmpRows.re[nCols - iCol] = tempTransform[iRow * ftCols + iCol];
                tmpRows.im[nCols - iCol] = -tempTransform[(iRow + 1) * ftCols + iCol];
            }
            //Unnormalized inverse transform
            FFT.bt(tmpRows.re, tmpRows.im);

            var indexB = iRow / 2 * nCols;
            for (var iCol = nCols - 1; iCol >= 0; iCol--) {
                finalTransform[indexB + iCol] = tmpRows.re[iCol] / scale;
            }
        }
        return finalTransform;
    },
    /**
     * Calculates the fourier transform of a matrix of size (nRows,nCols) It is
     * assumed that both nRows and nCols are a power of two
     *
     * On exit the matrix has dimensions (nRows * 2, nCols / 2 + 1) where the
     * even rows contain the real part and the odd rows the imaginary part of the
     * transform
     * @param data
     * @param nRows
     * @param nCols
     * @return
     */
    fft2DArray: function fft2DArray(data, nRows, nCols, opt) {
        var options = Object.assign({}, { inplace: true });
        var ftCols = nCols / 2 + 1;
        var ftRows = nRows * 2;
        var tempTransform = new Array(ftRows * ftCols);
        FFT.init(nCols);
        // transform rows
        var tmpRows = { re: new Array(nCols), im: new Array(nCols) };
        var row1 = { re: new Array(nCols), im: new Array(nCols) };
        var row2 = { re: new Array(nCols), im: new Array(nCols) };
        var index, iRow0, iRow1, iRow2, iRow3;
        for (var iRow = 0; iRow < nRows / 2; iRow++) {
            index = iRow * 2 * nCols;
            tmpRows.re = data.slice(index, index + nCols);

            index = (iRow * 2 + 1) * nCols;
            tmpRows.im = data.slice(index, index + nCols);

            FFT.fft1d(tmpRows.re, tmpRows.im);

            this.reconstructTwoRealFFT(tmpRows, row1, row2);
            //Now lets put back the result into the output array
            iRow0 = iRow * 4 * ftCols;
            iRow1 = (iRow * 4 + 1) * ftCols;
            iRow2 = (iRow * 4 + 2) * ftCols;
            iRow3 = (iRow * 4 + 3) * ftCols;
            for (var k = ftCols - 1; k >= 0; k--) {
                tempTransform[iRow0 + k] = row1.re[k];
                tempTransform[iRow1 + k] = row1.im[k];
                tempTransform[iRow2 + k] = row2.re[k];
                tempTransform[iRow3 + k] = row2.im[k];
            }
        }

        //console.log(tempTransform);
        row1 = null;
        row2 = null;
        // transform columns
        var finalTransform = new Array(ftRows * ftCols);

        FFT.init(nRows);
        var tmpCols = { re: new Array(nRows), im: new Array(nRows) };
        for (var iCol = ftCols - 1; iCol >= 0; iCol--) {
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                tmpCols.re[iRow] = tempTransform[iRow * 2 * ftCols + iCol];
                tmpCols.im[iRow] = tempTransform[(iRow * 2 + 1) * ftCols + iCol];
                //TODO Chech why this happens
                if (isNaN(tmpCols.re[iRow])) {
                    tmpCols.re[iRow] = 0;
                }
                if (isNaN(tmpCols.im[iRow])) {
                    tmpCols.im[iRow] = 0;
                }
            }
            FFT.fft1d(tmpCols.re, tmpCols.im);
            for (var iRow = nRows - 1; iRow >= 0; iRow--) {
                finalTransform[iRow * 2 * ftCols + iCol] = tmpCols.re[iRow];
                finalTransform[(iRow * 2 + 1) * ftCols + iCol] = tmpCols.im[iRow];
            }
        }

        //console.log(finalTransform);
        return finalTransform;
    },
    /**
     *
     * @param fourierTransform
     * @param realTransform1
     * @param realTransform2
     *
     * Reconstructs the individual Fourier transforms of two simultaneously
     * transformed series. Based on the Symmetry relationships (the asterisk
     * denotes the complex conjugate)
     *
     * F_{N-n} = F_n^{*} for a purely real f transformed to F
     *
     * G_{N-n} = G_n^{*} for a purely imaginary g transformed to G
     *
     */
    reconstructTwoRealFFT: function reconstructTwoRealFFT(fourierTransform, realTransform1, realTransform2) {
        var length = fourierTransform.re.length;

        // the components n=0 are trivial
        realTransform1.re[0] = fourierTransform.re[0];
        realTransform1.im[0] = 0.0;
        realTransform2.re[0] = fourierTransform.im[0];
        realTransform2.im[0] = 0.0;
        var rm, rp, im, ip, j;
        for (var i = length / 2; i > 0; i--) {
            j = length - i;
            rm = 0.5 * (fourierTransform.re[i] - fourierTransform.re[j]);
            rp = 0.5 * (fourierTransform.re[i] + fourierTransform.re[j]);
            im = 0.5 * (fourierTransform.im[i] - fourierTransform.im[j]);
            ip = 0.5 * (fourierTransform.im[i] + fourierTransform.im[j]);
            realTransform1.re[i] = rp;
            realTransform1.im[i] = im;
            realTransform1.re[j] = rp;
            realTransform1.im[j] = -im;
            realTransform2.re[i] = ip;
            realTransform2.im[i] = -rm;
            realTransform2.re[j] = ip;
            realTransform2.im[j] = rm;
        }
    },

    /**
     * In place version of convolute 2D
     *
     * @param ftSignal
     * @param ftFilter
     * @param ftRows
     * @param ftCols
     * @return
     */
    convolute2DI: function convolute2DI(ftSignal, ftFilter, ftRows, ftCols) {
        var re, im;
        for (var iRow = 0; iRow < ftRows / 2; iRow++) {
            for (var iCol = 0; iCol < ftCols; iCol++) {
                //
                re = ftSignal[iRow * 2 * ftCols + iCol] * ftFilter[iRow * 2 * ftCols + iCol] - ftSignal[(iRow * 2 + 1) * ftCols + iCol] * ftFilter[(iRow * 2 + 1) * ftCols + iCol];
                im = ftSignal[iRow * 2 * ftCols + iCol] * ftFilter[(iRow * 2 + 1) * ftCols + iCol] + ftSignal[(iRow * 2 + 1) * ftCols + iCol] * ftFilter[iRow * 2 * ftCols + iCol];
                //
                ftSignal[iRow * 2 * ftCols + iCol] = re;
                ftSignal[(iRow * 2 + 1) * ftCols + iCol] = im;
            }
        }
    },
    /**
     *
     * @param data
     * @param kernel
     * @param nRows
     * @param nCols
     * @returns {*}
     */
    convolute: function convolute(data, kernel, nRows, nCols, opt) {
        var ftSpectrum = new Array(nCols * nRows);
        for (var i = 0; i < nRows * nCols; i++) {
            ftSpectrum[i] = data[i];
        }

        ftSpectrum = this.fft2DArray(ftSpectrum, nRows, nCols);

        var dimR = kernel.length;
        var dimC = kernel[0].length;
        var ftFilterData = new Array(nCols * nRows);
        for (var i = 0; i < nCols * nRows; i++) {
            ftFilterData[i] = 0;
        }

        var iRow, iCol;
        var shiftR = Math.floor((dimR - 1) / 2);
        var shiftC = Math.floor((dimC - 1) / 2);
        for (var ir = 0; ir < dimR; ir++) {
            iRow = (ir - shiftR + nRows) % nRows;
            for (var ic = 0; ic < dimC; ic++) {
                iCol = (ic - shiftC + nCols) % nCols;
                ftFilterData[iRow * nCols + iCol] = kernel[ir][ic];
            }
        }
        ftFilterData = this.fft2DArray(ftFilterData, nRows, nCols);

        var ftRows = nRows * 2;
        var ftCols = nCols / 2 + 1;
        this.convolute2DI(ftSpectrum, ftFilterData, ftRows, ftCols);

        return this.ifft2DArray(ftSpectrum, ftRows, ftCols);
    },

    toRadix2: function toRadix2(data, nRows, nCols) {
        var i, j, irow, icol;
        var cols = nCols,
            rows = nRows,
            prows = 0,
            pcols = 0;
        if (!(nCols !== 0 && (nCols & nCols - 1) === 0)) {
            //Then we have to make a pading to next radix2
            cols = 0;
            while (nCols >> ++cols != 0) {}
            cols = 1 << cols;
            pcols = cols - nCols;
        }
        if (!(nRows !== 0 && (nRows & nRows - 1) === 0)) {
            //Then we have to make a pading to next radix2
            rows = 0;
            while (nRows >> ++rows != 0) {}
            rows = 1 << rows;
            prows = (rows - nRows) * cols;
        }
        if (rows == nRows && cols == nCols) //Do nothing. Returns the same input!!! Be careful
            return { data: data, rows: nRows, cols: nCols };

        var output = new Array(rows * cols);
        var shiftR = Math.floor((rows - nRows) / 2) - nRows;
        var shiftC = Math.floor((cols - nCols) / 2) - nCols;

        for (i = 0; i < rows; i++) {
            irow = i * cols;
            icol = (i - shiftR) % nRows * nCols;
            for (j = 0; j < cols; j++) {
                output[irow + j] = data[icol + (j - shiftC) % nCols];
            }
        }
        return { data: output, rows: rows, cols: cols };
    },

    /**
     * Crop the given matrix to fit the corresponding number of rows and columns
     */
    crop: function crop(data, rows, cols, nRows, nCols, opt) {

        if (rows == nRows && cols == nCols) //Do nothing. Returns the same input!!! Be careful
            return data;

        var options = Object.assign({}, opt);

        var output = new Array(nCols * nRows);

        var shiftR = Math.floor((rows - nRows) / 2);
        var shiftC = Math.floor((cols - nCols) / 2);
        var destinyRow, sourceRow, i, j;
        for (i = 0; i < nRows; i++) {
            destinyRow = i * nCols;
            sourceRow = (i + shiftR) * cols;
            for (j = 0; j < nCols; j++) {
                output[destinyRow + j] = data[sourceRow + (j + shiftC)];
            }
        }

        return output;
    }
};

module.exports = FFTUtils;

},{"./fftlib":64}],64:[function(require,module,exports){
'use strict';

/**
 * Fast Fourier Transform module
 * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
 */
var FFT = function () {
  var FFT;

  if (typeof exports !== 'undefined') {
    FFT = exports; // for CommonJS
  } else {
    FFT = {};
  }

  var version = {
    release: '0.3.0',
    date: '2013-03'
  };
  FFT.toString = function () {
    return "version " + version.release + ", released " + version.date;
  };

  // core operations
  var _n = 0,
      // order
  _bitrev = null,
      // bit reversal table
  _cstb = null; // sin/cos table

  var core = {
    init: function init(n) {
      if (n !== 0 && (n & n - 1) === 0) {
        _n = n;
        core._initArray();
        core._makeBitReversalTable();
        core._makeCosSinTable();
      } else {
        throw new Error("init: radix-2 required");
      }
    },
    // 1D-FFT
    fft1d: function fft1d(re, im) {
      core.fft(re, im, 1);
    },
    // 1D-IFFT
    ifft1d: function ifft1d(re, im) {
      var n = 1 / _n;
      core.fft(re, im, -1);
      for (var i = 0; i < _n; i++) {
        re[i] *= n;
        im[i] *= n;
      }
    },
    // 1D-IFFT
    bt1d: function bt1d(re, im) {
      core.fft(re, im, -1);
    },
    // 2D-FFT Not very useful if the number of rows have to be equal to cols
    fft2d: function fft2d(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for (var y = 0; y < _n; y++) {
        i = y * _n;
        for (var x1 = 0; x1 < _n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.fft1d(tre, tim);
        for (var x2 = 0; x2 < _n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for (var x = 0; x < _n; x++) {
        for (var y1 = 0; y1 < _n; y1++) {
          i = x + y1 * _n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.fft1d(tre, tim);
        for (var y2 = 0; y2 < _n; y2++) {
          i = x + y2 * _n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // 2D-IFFT
    ifft2d: function ifft2d(re, im) {
      var tre = [],
          tim = [],
          i = 0;
      // x-axis
      for (var y = 0; y < _n; y++) {
        i = y * _n;
        for (var x1 = 0; x1 < _n; x1++) {
          tre[x1] = re[x1 + i];
          tim[x1] = im[x1 + i];
        }
        core.ifft1d(tre, tim);
        for (var x2 = 0; x2 < _n; x2++) {
          re[x2 + i] = tre[x2];
          im[x2 + i] = tim[x2];
        }
      }
      // y-axis
      for (var x = 0; x < _n; x++) {
        for (var y1 = 0; y1 < _n; y1++) {
          i = x + y1 * _n;
          tre[y1] = re[i];
          tim[y1] = im[i];
        }
        core.ifft1d(tre, tim);
        for (var y2 = 0; y2 < _n; y2++) {
          i = x + y2 * _n;
          re[i] = tre[y2];
          im[i] = tim[y2];
        }
      }
    },
    // core operation of FFT
    fft: function fft(re, im, inv) {
      var d,
          h,
          ik,
          m,
          tmp,
          wr,
          wi,
          xr,
          xi,
          n4 = _n >> 2;
      // bit reversal
      for (var l = 0; l < _n; l++) {
        m = _bitrev[l];
        if (l < m) {
          tmp = re[l];
          re[l] = re[m];
          re[m] = tmp;
          tmp = im[l];
          im[l] = im[m];
          im[m] = tmp;
        }
      }
      // butterfly operation
      for (var k = 1; k < _n; k <<= 1) {
        h = 0;
        d = _n / (k << 1);
        for (var j = 0; j < k; j++) {
          wr = _cstb[h + n4];
          wi = inv * _cstb[h];
          for (var i = j; i < _n; i += k << 1) {
            ik = i + k;
            xr = wr * re[ik] + wi * im[ik];
            xi = wr * im[ik] - wi * re[ik];
            re[ik] = re[i] - xr;
            re[i] += xr;
            im[ik] = im[i] - xi;
            im[i] += xi;
          }
          h += d;
        }
      }
    },
    // initialize the array (supports TypedArray)
    _initArray: function _initArray() {
      if (typeof Uint32Array !== 'undefined') {
        _bitrev = new Uint32Array(_n);
      } else {
        _bitrev = [];
      }
      if (typeof Float64Array !== 'undefined') {
        _cstb = new Float64Array(_n * 1.25);
      } else {
        _cstb = [];
      }
    },
    // zero padding
    _paddingZero: function _paddingZero() {
      // TODO
    },
    // makes bit reversal table
    _makeBitReversalTable: function _makeBitReversalTable() {
      var i = 0,
          j = 0,
          k = 0;
      _bitrev[0] = 0;
      while (++i < _n) {
        k = _n >> 1;
        while (k <= j) {
          j -= k;
          k >>= 1;
        }
        j += k;
        _bitrev[i] = j;
      }
    },
    // makes trigonometiric function table
    _makeCosSinTable: function _makeCosSinTable() {
      var n2 = _n >> 1,
          n4 = _n >> 2,
          n8 = _n >> 3,
          n2p4 = n2 + n4,
          t = Math.sin(Math.PI / _n),
          dc = 2 * t * t,
          ds = Math.sqrt(dc * (2 - dc)),
          c = _cstb[n4] = 1,
          s = _cstb[0] = 0;
      t = 2 * dc;
      for (var i = 1; i < n8; i++) {
        c -= dc;
        dc += t * c;
        s += ds;
        ds -= t * s;
        _cstb[i] = s;
        _cstb[n4 - i] = c;
      }
      if (n8 !== 0) {
        _cstb[n8] = Math.sqrt(0.5);
      }
      for (var j = 0; j < n4; j++) {
        _cstb[n2 - j] = _cstb[j];
      }
      for (var k = 0; k < n2p4; k++) {
        _cstb[k + n2] = -_cstb[k];
      }
    }
  };
  // aliases (public APIs)
  var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];
  for (var i = 0; i < apis.length; i++) {
    FFT[apis[i]] = core[apis[i]];
  }
  FFT.bt = core.bt1d;
  FFT.fft = core.fft1d;
  FFT.ifft = core.ifft1d;

  return FFT;
}.call(undefined);

},{}],65:[function(require,module,exports){
'use strict';

exports.FFTUtils = require("./FFTUtils");
exports.FFT = require('./fftlib');

},{"./FFTUtils":63,"./fftlib":64}],66:[function(require,module,exports){
'use strict';

var squaredEuclidean = require('ml-distance-euclidean').squared;

var defaultOptions = {
    sigma: 1
};

class GaussianKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
        this.divisor = 2 * options.sigma * options.sigma;
    }

    compute(x, y) {
        var distance = squaredEuclidean(x, y);
        return Math.exp(-distance / this.divisor);
    }
}

module.exports = GaussianKernel;

},{"ml-distance-euclidean":62}],67:[function(require,module,exports){
'use strict';

var defaultOptions = {
    degree: 1,
    constant: 1,
    scale: 1
};

class PolynomialKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);

        this.degree = options.degree;
        this.constant = options.constant;
        this.scale = options.scale;
    }

    compute(x, y) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return Math.pow(this.scale * sum + this.constant, this.degree);
    }
}

module.exports = PolynomialKernel;

},{}],68:[function(require,module,exports){
'use strict';

var defaultOptions = {
    alpha: 0.01,
    constant: -Math.E
};

class SigmoidKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.alpha = options.alpha;
        this.constant = options.constant;
    }

    compute(x, y) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return Math.tanh(this.alpha * sum + this.constant);
    }
}

module.exports = SigmoidKernel;

},{}],69:[function(require,module,exports){
'use strict';

var Matrix = require('ml-matrix');

var GaussianKernel = require('ml-kernel-gaussian');
var PolynomialKernel = require('ml-kernel-polynomial');
var ANOVAKernel = require('./kernels/anova-kernel');
var CauchyKernel = require('./kernels/cauchy-kernel');
var ExponentialKernel = require('./kernels/exponential-kernel');
var HistogramKernel = require('./kernels/histogram-intersection-kernel');
var LaplacianKernel = require('./kernels/laplacian-kernel');
var MultiquadraticKernel = require('./kernels/multiquadratic-kernel');
var RationalKernel = require('./kernels/rational-quadratic-kernel');
var SigmoidKernel = require('ml-kernel-sigmoid');

var kernelType = {
    gaussian: GaussianKernel,
    rbf: GaussianKernel,
    polynomial: PolynomialKernel,
    poly: PolynomialKernel,
    anova: ANOVAKernel,
    cauchy: CauchyKernel,
    exponential: ExponentialKernel,
    histogram: HistogramKernel,
    min: HistogramKernel,
    laplacian: LaplacianKernel,
    multiquadratic: MultiquadraticKernel,
    rational: RationalKernel,
    sigmoid: SigmoidKernel,
    mlp: SigmoidKernel
};

class Kernel {
    constructor(type, options) {
        this.kernelType = type;
        if (type === 'linear') return;

        if (typeof type === 'string') {
            type = type.toLowerCase();

            var KernelConstructor = kernelType[type];
            if (KernelConstructor) {
                this.kernelFunction = new KernelConstructor(options);
            } else {
                throw new Error('unsupported kernel type: ' + type);
            }
        } else if (typeof type === 'object' && typeof type.compute === 'function') {
            this.kernelFunction = type;
        } else {
            throw new TypeError('first argument must be a valid kernel type or instance');
        }
    }

    compute(inputs, landmarks) {
        if (landmarks === undefined) {
            landmarks = inputs;
        }

        if (this.kernelType === 'linear') {
            var matrix = new Matrix(inputs);
            return matrix.mmul(new Matrix(landmarks).transpose());
        }

        var kernelMatrix = new Matrix(inputs.length, landmarks.length);
        var i, j;
        if (inputs === landmarks) {
            // fast path, matrix is symmetric
            for (i = 0; i < inputs.length; i++) {
                for (j = i; j < inputs.length; j++) {
                    kernelMatrix[i][j] = kernelMatrix[j][i] = this.kernelFunction.compute(inputs[i], inputs[j]);
                }
            }
        } else {
            for (i = 0; i < inputs.length; i++) {
                for (j = 0; j < landmarks.length; j++) {
                    kernelMatrix[i][j] = this.kernelFunction.compute(inputs[i], landmarks[j]);
                }
            }
        }
        return kernelMatrix;
    }
}

module.exports = Kernel;

},{"./kernels/anova-kernel":70,"./kernels/cauchy-kernel":71,"./kernels/exponential-kernel":72,"./kernels/histogram-intersection-kernel":73,"./kernels/laplacian-kernel":74,"./kernels/multiquadratic-kernel":75,"./kernels/rational-quadratic-kernel":76,"ml-kernel-gaussian":66,"ml-kernel-polynomial":67,"ml-kernel-sigmoid":68,"ml-matrix":86}],70:[function(require,module,exports){
'use strict';

var defaultOptions = {
    sigma: 1,
    degree: 1
};

class ANOVAKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
        this.degree = options.degree;
    }

    compute(x, y) {
        var sum = 0;
        var len = Math.min(x.length, y.length);
        for (var i = 1; i <= len; ++i) {
            sum += Math.pow(Math.exp(-this.sigma * Math.pow(Math.pow(x[i - 1], i) - Math.pow(y[i - 1], i), 2)), this.degree);
        }
        return sum;
    }
}

module.exports = ANOVAKernel;

},{}],71:[function(require,module,exports){
'use strict';

var squaredEuclidean = require('ml-distance-euclidean').squared;

var defaultOptions = {
    sigma: 1
};

class CauchyKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
    }

    compute(x, y) {
        return 1 / (1 + squaredEuclidean(x, y) / (this.sigma * this.sigma));
    }
}

module.exports = CauchyKernel;

},{"ml-distance-euclidean":62}],72:[function(require,module,exports){
'use strict';

var euclidean = require('ml-distance-euclidean');

var defaultOptions = {
    sigma: 1
};

class ExponentialKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
        this.divisor = 2 * options.sigma * options.sigma;
    }

    compute(x, y) {
        var distance = euclidean(x, y);
        return Math.exp(-distance / this.divisor);
    }
}

module.exports = ExponentialKernel;

},{"ml-distance-euclidean":62}],73:[function(require,module,exports){
'use strict';

class HistogramIntersectionKernel {
    compute(x, y) {
        var min = Math.min(x.length, y.length);
        var sum = 0;
        for (var i = 0; i < min; ++i) {
            sum += Math.min(x[i], y[i]);
        }return sum;
    }
}

module.exports = HistogramIntersectionKernel;

},{}],74:[function(require,module,exports){
'use strict';

var euclidean = require('ml-distance-euclidean');

var defaultOptions = {
    sigma: 1
};

class LaplacianKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
    }

    compute(x, y) {
        var distance = euclidean(x, y);
        return Math.exp(-distance / this.sigma);
    }
}

module.exports = LaplacianKernel;

},{"ml-distance-euclidean":62}],75:[function(require,module,exports){
'use strict';

var squaredEuclidean = require('ml-distance-euclidean').squared;

var defaultOptions = {
    constant: 1
};

class MultiquadraticKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.constant = options.constant;
    }

    compute(x, y) {
        return Math.sqrt(squaredEuclidean(x, y) + this.constant * this.constant);
    }
}

module.exports = MultiquadraticKernel;

},{"ml-distance-euclidean":62}],76:[function(require,module,exports){
'use strict';

var squaredEuclidean = require('ml-distance-euclidean').squared;

var defaultOptions = {
    constant: 1
};

class RationalQuadraticKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.constant = options.constant;
    }

    compute(x, y) {
        var distance = squaredEuclidean(x, y);
        return 1 - distance / (distance + this.constant);
    }
}

module.exports = RationalQuadraticKernel;

},{"ml-distance-euclidean":62}],77:[function(require,module,exports){
"use strict";
'use strict;';
/**
 * Created by acastillo on 7/7/16.
 */

var FFTUtils = require("ml-fft").FFTUtils;

function convolutionFFT(input, kernel, opt) {
    var tmp = matrix2Array(input);
    var inputData = tmp.data;
    var options = Object.assign({ normalize: false, divisor: 1, rows: tmp.rows, cols: tmp.cols }, opt);

    var nRows, nCols;
    if (options.rows && options.cols) {
        nRows = options.rows;
        nCols = options.cols;
    } else {
        throw new Error("Invalid number of rows or columns " + nRows + " " + nCols);
    }

    var divisor = options.divisor;
    var i, j;
    var kHeight = kernel.length;
    var kWidth = kernel[0].length;
    if (options.normalize) {
        divisor = 0;
        for (i = 0; i < kHeight; i++) {
            for (j = 0; j < kWidth; j++) {
                divisor += kernel[i][j];
            }
        }
    }
    if (divisor === 0) {
        throw new RangeError('convolution: The divisor is equal to zero');
    }

    var radix2Sized = FFTUtils.toRadix2(inputData, nRows, nCols);
    var conv = FFTUtils.convolute(radix2Sized.data, kernel, radix2Sized.rows, radix2Sized.cols);
    conv = FFTUtils.crop(conv, radix2Sized.rows, radix2Sized.cols, nRows, nCols);

    if (divisor != 0 && divisor != 1) {
        for (i = 0; i < conv.length; i++) {
            conv[i] /= divisor;
        }
    }

    return conv;
}

function convolutionDirect(input, kernel, opt) {
    var tmp = matrix2Array(input);
    var inputData = tmp.data;
    var options = Object.assign({ normalize: false, divisor: 1, rows: tmp.rows, cols: tmp.cols }, opt);

    var nRows, nCols;
    if (options.rows && options.cols) {
        nRows = options.rows;
        nCols = options.cols;
    } else {
        throw new Error("Invalid number of rows or columns " + nRows + " " + nCols);
    }

    var divisor = options.divisor;
    var kHeight = kernel.length;
    var kWidth = kernel[0].length;
    var i, j, x, y, index, sum, kVal, row, col;
    if (options.normalize) {
        divisor = 0;
        for (i = 0; i < kHeight; i++) {
            for (j = 0; j < kWidth; j++) {
                divisor += kernel[i][j];
            }
        }
    }
    if (divisor === 0) {
        throw new RangeError('convolution: The divisor is equal to zero');
    }

    var output = new Array(nRows * nCols);

    var hHeight = Math.floor(kHeight / 2);
    var hWidth = Math.floor(kWidth / 2);

    for (y = 0; y < nRows; y++) {
        for (x = 0; x < nCols; x++) {
            sum = 0;
            for (j = 0; j < kHeight; j++) {
                for (i = 0; i < kWidth; i++) {
                    kVal = kernel[kHeight - j - 1][kWidth - i - 1];
                    row = (y + j - hHeight + nRows) % nRows;
                    col = (x + i - hWidth + nCols) % nCols;
                    index = row * nCols + col;
                    sum += inputData[index] * kVal;
                }
            }
            index = y * nCols + x;
            output[index] = sum / divisor;
        }
    }
    return output;
}

function LoG(sigma, nPoints, options) {
    var factor = 1000;
    if (options && options.factor) {
        factor = options.factor;
    }

    var kernel = new Array(nPoints);
    var i, j, tmp, y2, tmp2;

    factor *= -1; //-1/(Math.PI*Math.pow(sigma,4));
    var center = (nPoints - 1) / 2;
    var sigma2 = 2 * sigma * sigma;
    for (i = 0; i < nPoints; i++) {
        kernel[i] = new Array(nPoints);
        y2 = (i - center) * (i - center);
        for (j = 0; j < nPoints; j++) {
            tmp = -((j - center) * (j - center) + y2) / sigma2;
            kernel[i][j] = Math.round(factor * (1 + tmp) * Math.exp(tmp));
        }
    }

    return kernel;
}

function matrix2Array(input) {
    var inputData = input;
    var nRows, nCols;
    if (typeof input[0] != "number") {
        nRows = input.length;
        nCols = input[0].length;
        inputData = new Array(nRows * nCols);
        for (var i = 0; i < nRows; i++) {
            for (var j = 0; j < nCols; j++) {
                inputData[i * nCols + j] = input[i][j];
            }
        }
    } else {
        var tmp = Math.sqrt(input.length);
        if (Number.isInteger(tmp)) {
            nRows = tmp;
            nCols = tmp;
        }
    }

    return { data: inputData, rows: nRows, cols: nCols };
}

module.exports = {
    fft: convolutionFFT,
    direct: convolutionDirect,
    kernelFactory: { LoG: LoG },
    matrix2Array: matrix2Array
};

},{"ml-fft":65}],78:[function(require,module,exports){
'use strict';

module.exports = abstractMatrix;

var arrayUtils = require('ml-array-utils');
var util = require('./util');
var MatrixTransposeView = require('./views/transpose');
var MatrixRowView = require('./views/row');
var MatrixSubView = require('./views/sub');
var MatrixSelectionView = require('./views/selection');
var MatrixColumnView = require('./views/column');
var MatrixFlipRowView = require('./views/flipRow');
var MatrixFlipColumnView = require('./views/flipColumn');

function abstractMatrix(superCtor) {
    if (superCtor === undefined) superCtor = Object;

    /**
     * Real matrix
     * @class Matrix
     * @param {number|Array|Matrix} nRows - Number of rows of the new matrix,
     * 2D array containing the data or Matrix instance to clone
     * @param {number} [nColumns] - Number of columns of the new matrix
     */
    class Matrix extends superCtor {
        static get [Symbol.species]() {
            return this;
        }

        /**
         * Constructs a Matrix with the chosen dimensions from a 1D array
         * @param {number} newRows - Number of rows
         * @param {number} newColumns - Number of columns
         * @param {Array} newData - A 1D array containing data for the matrix
         * @returns {Matrix} - The new matrix
         */
        static from1DArray(newRows, newColumns, newData) {
            var length = newRows * newColumns;
            if (length !== newData.length) {
                throw new RangeError('Data length does not match given dimensions');
            }
            var newMatrix = new this(newRows, newColumns);
            for (var row = 0; row < newRows; row++) {
                for (var column = 0; column < newColumns; column++) {
                    newMatrix.set(row, column, newData[row * newColumns + column]);
                }
            }
            return newMatrix;
        }

        /**
         * Creates a row vector, a matrix with only one row.
         * @param {Array} newData - A 1D array containing data for the vector
         * @returns {Matrix} - The new matrix
         */
        static rowVector(newData) {
            var vector = new this(1, newData.length);
            for (var i = 0; i < newData.length; i++) {
                vector.set(0, i, newData[i]);
            }
            return vector;
        }

        /**
         * Creates a column vector, a matrix with only one column.
         * @param {Array} newData - A 1D array containing data for the vector
         * @returns {Matrix} - The new matrix
         */
        static columnVector(newData) {
            var vector = new this(newData.length, 1);
            for (var i = 0; i < newData.length; i++) {
                vector.set(i, 0, newData[i]);
            }
            return vector;
        }

        /**
         * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @returns {Matrix} - The new matrix
         */
        static empty(rows, columns) {
            return new this(rows, columns);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to zero.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @returns {Matrix} - The new matrix
         */
        static zeros(rows, columns) {
            return this.empty(rows, columns).fill(0);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to one.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @returns {Matrix} - The new matrix
         */
        static ones(rows, columns) {
            return this.empty(rows, columns).fill(1);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be randomly set.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {function} [rng=Math.random] - Random number generator
         * @returns {Matrix} The new matrix
         */
        static rand(rows, columns, rng) {
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    matrix.set(i, j, rng());
                }
            }
            return matrix;
        }

        /**
         * Creates a matrix with the given dimensions. Values will be random integers.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {number} [maxValue=1000] - Maximum value
         * @param {function} [rng=Math.random] - Random number generator
         * @returns {Matrix} The new matrix
         */
        static randInt(rows, columns, maxValue, rng) {
            if (maxValue === undefined) maxValue = 1000;
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var value = Math.floor(rng() * maxValue);
                    matrix.set(i, j, value);
                }
            }
            return matrix;
        }

        /**
         * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and others will be 0.
         * @param {number} rows - Number of rows
         * @param {number} [columns] - Number of columns (Default: rows)
         * @returns {Matrix} - The new identity matrix
         */
        static eye(rows, columns, value) {
            if (value === undefined) value = 1;
            if (columns === undefined) columns = rows;
            var min = Math.min(rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, value);
            }
            return matrix;
        }

        /**
         * Creates a diagonal matrix based on the given array.
         * @param {Array} data - Array containing the data for the diagonal
         * @param {number} [rows] - Number of rows (Default: data.length)
         * @param {number} [columns] - Number of columns (Default: rows)
         * @returns {Matrix} - The new diagonal matrix
         */
        static diag(data, rows, columns) {
            var l = data.length;
            if (rows === undefined) rows = l;
            if (columns === undefined) columns = rows;
            var min = Math.min(l, rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, data[i]);
            }
            return matrix;
        }

        /**
         * Returns a matrix whose elements are the minimum between matrix1 and matrix2
         * @param matrix1
         * @param matrix2
         * @returns {Matrix}
         */
        static min(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Returns a matrix whose elements are the maximum between matrix1 and matrix2
         * @param matrix1
         * @param matrix2
         * @returns {Matrix}
         */
        static max(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Check that the provided value is a Matrix and tries to instantiate one if not
         * @param value - The value to check
         * @returns {Matrix}
         */
        static checkMatrix(value) {
            return Matrix.isMatrix(value) ? value : new this(value);
        }

        /**
         * Returns true if the argument is a Matrix, false otherwise
         * @param value - The value to check
         * @return {boolean}
         */
        static isMatrix(value) {
            return value != null && value.klass === 'Matrix';
        }

        /**
         * @property {number} - The number of elements in the matrix.
         */
        get size() {
            return this.rows * this.columns;
        }

        /**
         * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
         * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
         * @returns {Matrix} this
         */
        apply(callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var ii = this.rows;
            var jj = this.columns;
            for (var i = 0; i < ii; i++) {
                for (var j = 0; j < jj; j++) {
                    callback.call(this, i, j);
                }
            }
            return this;
        }

        /**
         * Returns a new 1D array filled row by row with the matrix values
         * @returns {Array}
         */
        to1DArray() {
            var array = new Array(this.size);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    array[i * this.columns + j] = this.get(i, j);
                }
            }
            return array;
        }

        /**
         * Returns a 2D array containing a copy of the data
         * @returns {Array}
         */
        to2DArray() {
            var copy = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                copy[i] = new Array(this.columns);
                for (var j = 0; j < this.columns; j++) {
                    copy[i][j] = this.get(i, j);
                }
            }
            return copy;
        }

        /**
         * @returns {boolean} true if the matrix has one row
         */
        isRowVector() {
            return this.rows === 1;
        }

        /**
         * @returns {boolean} true if the matrix has one column
         */
        isColumnVector() {
            return this.columns === 1;
        }

        /**
         * @returns {boolean} true if the matrix has one row or one column
         */
        isVector() {
            return this.rows === 1 || this.columns === 1;
        }

        /**
         * @returns {boolean} true if the matrix has the same number of rows and columns
         */
        isSquare() {
            return this.rows === this.columns;
        }

        /**
         * @returns {boolean} true if the matrix is square and has the same values on both sides of the diagonal
         */
        isSymmetric() {
            if (this.isSquare()) {
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j <= i; j++) {
                        if (this.get(i, j) !== this.get(j, i)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        /**
         * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @param {number} value - The new value for the element
         * @returns {Matrix} this
         */
        set(rowIndex, columnIndex, value) {
            throw new Error('set method is unimplemented');
        }

        /**
         * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @returns {number}
         */
        get(rowIndex, columnIndex) {
            throw new Error('get method is unimplemented');
        }

        /**
         * Creates a new matrix that is a repetition of the current matrix. New matrix has rowRep times the number of
         * rows of the matrix, and colRep times the number of columns of the matrix
         * @param {number} rowRep - Number of times the rows should be repeated
         * @param {number} colRep - Number of times the columns should be re
         * @example
         * var matrix = new Matrix([[1,2]]);
         * matrix.repeat(2); // [[1,2],[1,2]]
         */
        repeat(rowRep, colRep) {
            rowRep = rowRep || 1;
            colRep = colRep || 1;
            var matrix = new this.constructor[Symbol.species](this.rows * rowRep, this.columns * colRep);
            for (var i = 0; i < rowRep; i++) {
                for (var j = 0; j < colRep; j++) {
                    matrix.setSubMatrix(this, this.rows * i, this.columns * j);
                }
            }
            return matrix;
        }

        /**
         * Fills the matrix with a given value. All elements will be set to this value.
         * @param {number} value - New value
         * @returns {Matrix} this
         */
        fill(value) {
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, value);
                }
            }
            return this;
        }

        /**
         * Negates the matrix. All elements will be multiplied by (-1)
         * @returns {Matrix} this
         */
        neg() {
            return this.mulS(-1);
        }

        /**
         * Returns a new array from the given row index
         * @param {number} index - Row index
         * @returns {Array}
         */
        getRow(index) {
            util.checkRowIndex(this, index);
            var row = new Array(this.columns);
            for (var i = 0; i < this.columns; i++) {
                row[i] = this.get(index, i);
            }
            return row;
        }

        /**
         * Returns a new row vector from the given row index
         * @param {number} index - Row index
         * @returns {Matrix}
         */
        getRowVector(index) {
            return this.constructor.rowVector(this.getRow(index));
        }

        /**
         * Sets a row at the given index
         * @param {number} index - Row index
         * @param {Array|Matrix} array - Array or vector
         * @returns {Matrix} this
         */
        setRow(index, array) {
            util.checkRowIndex(this, index);
            array = util.checkRowVector(this, array);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, array[i]);
            }
            return this;
        }

        /**
         * Swaps two rows
         * @param {number} row1 - First row index
         * @param {number} row2 - Second row index
         * @returns {Matrix} this
         */
        swapRows(row1, row2) {
            util.checkRowIndex(this, row1);
            util.checkRowIndex(this, row2);
            for (var i = 0; i < this.columns; i++) {
                var temp = this.get(row1, i);
                this.set(row1, i, this.get(row2, i));
                this.set(row2, i, temp);
            }
            return this;
        }

        /**
         * Returns a new array from the given column index
         * @param {number} index - Column index
         * @returns {Array}
         */
        getColumn(index) {
            util.checkColumnIndex(this, index);
            var column = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                column[i] = this.get(i, index);
            }
            return column;
        }

        /**
         * Returns a new column vector from the given column index
         * @param {number} index - Column index
         * @returns {Matrix}
         */
        getColumnVector(index) {
            return this.constructor.columnVector(this.getColumn(index));
        }

        /**
         * Sets a column at the given index
         * @param {number} index - Column index
         * @param {Array|Matrix} array - Array or vector
         * @returns {Matrix} this
         */
        setColumn(index, array) {
            util.checkColumnIndex(this, index);
            array = util.checkColumnVector(this, array);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, array[i]);
            }
            return this;
        }

        /**
         * Swaps two columns
         * @param {number} column1 - First column index
         * @param {number} column2 - Second column index
         * @returns {Matrix} this
         */
        swapColumns(column1, column2) {
            util.checkColumnIndex(this, column1);
            util.checkColumnIndex(this, column2);
            for (var i = 0; i < this.rows; i++) {
                var temp = this.get(i, column1);
                this.set(i, column1, this.get(i, column2));
                this.set(i, column2, temp);
            }
            return this;
        }

        /**
         * Adds the values of a vector to each row
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        addRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[j]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each row
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        subRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[j]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each row
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        mulRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[j]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each row by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        divRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[j]);
                }
            }
            return this;
        }

        /**
         * Adds the values of a vector to each column
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        addColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[i]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each column
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        subColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each column
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        mulColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[i]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each column by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @returns {Matrix} this
         */
        divColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a row with a scalar
         * @param {number} index - Row index
         * @param {number} value
         * @returns {Matrix} this
         */
        mulRow(index, value) {
            util.checkRowIndex(this, index);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, this.get(index, i) * value);
            }
            return this;
        }

        /**
         * Multiplies the values of a column with a scalar
         * @param {number} index - Column index
         * @param {number} value
         * @returns {Matrix} this
         */
        mulColumn(index, value) {
            util.checkColumnIndex(this, index);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, this.get(i, index) * value);
            }
        }

        /**
         * Returns the maximum value of the matrix
         * @returns {number}
         */
        max() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value
         * @returns {Array}
         */
        maxIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of the matrix
         * @returns {number}
         */
        min() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value
         * @returns {Array}
         */
        minIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one row
         * @param {number} row - Row index
         * @returns {number}
         */
        maxRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @returns {Array}
         */
        maxRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one row
         * @param {number} row - Row index
         * @returns {number}
         */
        minRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @returns {Array}
         */
        minRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one column
         * @param {number} column - Column index
         * @returns {number}
         */
        maxColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one column
         * @param {number} column - Column index
         * @returns {Array}
         */
        maxColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one column
         * @param {number} column - Column index
         * @returns {number}
         */
        minColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value of one column
         * @param {number} column - Column index
         * @returns {Array}
         */
        minColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns an array containing the diagonal values of the matrix
         * @returns {Array}
         */
        diag() {
            var min = Math.min(this.rows, this.columns);
            var diag = new Array(min);
            for (var i = 0; i < min; i++) {
                diag[i] = this.get(i, i);
            }
            return diag;
        }

        /**
         * Returns the sum of all elements of the matrix
         * @returns {number}
         */
        sum() {
            var v = 0;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    v += this.get(i, j);
                }
            }
            return v;
        }

        /**
         * Returns the mean of all elements of the matrix
         * @returns {number}
         */
        mean() {
            return this.sum() / this.size;
        }

        /**
         * Returns the product of all elements of the matrix
         * @returns {number}
         */
        prod() {
            var prod = 1;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    prod *= this.get(i, j);
                }
            }
            return prod;
        }

        /**
         * Computes the cumulative sum of the matrix elements (in place, row by row)
         * @returns {Matrix} this
         */
        cumulativeSum() {
            var sum = 0;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    sum += this.get(i, j);
                    this.set(i, j, sum);
                }
            }
            return this;
        }

        /**
         * Computes the dot (scalar) product between the matrix and another
         * @param {Matrix} vector2 vector
         * @returns {number}
         */
        dot(vector2) {
            if (Matrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
            var vector1 = this.to1DArray();
            if (vector1.length !== vector2.length) {
                throw new RangeError('vectors do not have the same size');
            }
            var dot = 0;
            for (var i = 0; i < vector1.length; i++) {
                dot += vector1[i] * vector2[i];
            }
            return dot;
        }

        /**
         * Returns the matrix product between this and other
         * @param {Matrix} other
         * @returns {Matrix}
         */
        mmul(other) {
            other = this.constructor.checkMatrix(other);
            if (this.columns !== other.rows) console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');

            var m = this.rows;
            var n = this.columns;
            var p = other.columns;

            var result = new this.constructor[Symbol.species](m, p);

            var Bcolj = new Array(n);
            for (var j = 0; j < p; j++) {
                for (var k = 0; k < n; k++) {
                    Bcolj[k] = other.get(k, j);
                }

                for (var i = 0; i < m; i++) {
                    var s = 0;
                    for (k = 0; k < n; k++) {
                        s += this.get(i, k) * Bcolj[k];
                    }

                    result.set(i, j, s);
                }
            }
            return result;
        }

        strassen_2x2(other) {
            var result = new this.constructor[Symbol.species](2, 2);
            var a11 = this.get(0, 0);
            var b11 = other.get(0, 0);
            var a12 = this.get(0, 1);
            var b12 = other.get(0, 1);
            var a21 = this.get(1, 0);
            var b21 = other.get(1, 0);
            var a22 = this.get(1, 1);
            var b22 = other.get(1, 1);

            // Compute intermediate values.
            var m1 = (a11 + a22) * (b11 + b22);
            var m2 = (a21 + a22) * b11;
            var m3 = a11 * (b12 - b22);
            var m4 = a22 * (b21 - b11);
            var m5 = (a11 + a12) * b22;
            var m6 = (a21 - a11) * (b11 + b12);
            var m7 = (a12 - a22) * (b21 + b22);

            // Combine intermediate values into the output.
            var c00 = m1 + m4 - m5 + m7;
            var c01 = m3 + m5;
            var c10 = m2 + m4;
            var c11 = m1 - m2 + m3 + m6;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            return result;
        }

        strassen_3x3(other) {
            var result = new this.constructor[Symbol.species](3, 3);

            var a00 = this.get(0, 0);
            var a01 = this.get(0, 1);
            var a02 = this.get(0, 2);
            var a10 = this.get(1, 0);
            var a11 = this.get(1, 1);
            var a12 = this.get(1, 2);
            var a20 = this.get(2, 0);
            var a21 = this.get(2, 1);
            var a22 = this.get(2, 2);

            var b00 = other.get(0, 0);
            var b01 = other.get(0, 1);
            var b02 = other.get(0, 2);
            var b10 = other.get(1, 0);
            var b11 = other.get(1, 1);
            var b12 = other.get(1, 2);
            var b20 = other.get(2, 0);
            var b21 = other.get(2, 1);
            var b22 = other.get(2, 2);

            var m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
            var m2 = (a00 - a10) * (-b01 + b11);
            var m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
            var m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
            var m5 = (a10 + a11) * (-b00 + b01);
            var m6 = a00 * b00;
            var m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
            var m8 = (-a00 + a20) * (b02 - b12);
            var m9 = (a20 + a21) * (-b00 + b02);
            var m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
            var m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
            var m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
            var m13 = (a02 - a22) * (b11 - b21);
            var m14 = a02 * b20;
            var m15 = (a21 + a22) * (-b20 + b21);
            var m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
            var m17 = (a02 - a12) * (b12 - b22);
            var m18 = (a11 + a12) * (-b20 + b22);
            var m19 = a01 * b10;
            var m20 = a12 * b21;
            var m21 = a10 * b02;
            var m22 = a20 * b01;
            var m23 = a22 * b22;

            var c00 = m6 + m14 + m19;
            var c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
            var c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
            var c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
            var c11 = m2 + m4 + m5 + m6 + m20;
            var c12 = m14 + m16 + m17 + m18 + m21;
            var c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
            var c21 = m12 + m13 + m14 + m15 + m22;
            var c22 = m6 + m7 + m8 + m9 + m23;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(0, 2, c02);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            result.set(1, 2, c12);
            result.set(2, 0, c20);
            result.set(2, 1, c21);
            result.set(2, 2, c22);
            return result;
        }

        /**
         * Returns the matrix product between x and y. More efficient than mmul(other) only when we multiply squared matrix and when the size of the matrix is > 1000.
         * @param {Matrix} x
         * @param {Matrix} y
         * @returns {Matrix}
         */
        mmul_strassen(y) {
            var x = this.clone();
            var r1 = x.rows;
            var c1 = x.columns;
            var r2 = y.rows;
            var c2 = y.columns;
            if (c1 != r2) {
                console.log(`Multiplying ${ r1 } x ${ c1 } and ${ r2 } x ${ c2 } matrix: dimensions do not match.`);
            }

            // Put a matrix into the top left of a matrix of zeros.
            // `rows` and `cols` are the dimensions of the output matrix.
            function embed(mat, rows, cols) {
                var r = mat.rows;
                var c = mat.columns;
                if (r == rows && c == cols) {
                    return mat;
                } else {
                    var resultat = Matrix.zeros(rows, cols);
                    resultat = resultat.setSubMatrix(mat, 0, 0);
                    return resultat;
                }
            }

            // Make sure both matrices are the same size.
            // This is exclusively for simplicity:
            // this algorithm can be implemented with matrices of different sizes.

            var r = Math.max(r1, r2);
            var c = Math.max(c1, c2);
            var x = embed(x, r, c);
            var y = embed(y, r, c);

            // Our recursive multiplication function.
            function block_mult(a, b, rows, cols) {
                // For small matrices, resort to naive multiplication.
                if (rows <= 512 || cols <= 512) {
                    return a.mmul(b); // a is equivalent to this
                }

                // Apply dynamic padding.
                if (rows % 2 == 1 && cols % 2 == 1) {
                    a = embed(a, rows + 1, cols + 1);
                    b = embed(b, rows + 1, cols + 1);
                } else if (rows % 2 == 1) {
                    a = embed(a, rows + 1, cols);
                    b = embed(b, rows + 1, cols);
                } else if (cols % 2 == 1) {
                    a = embed(a, rows, cols + 1);
                    b = embed(b, rows, cols + 1);
                }

                var half_rows = parseInt(a.rows / 2);
                var half_cols = parseInt(a.columns / 2);
                // Subdivide input matrices.
                var a11 = a.subMatrix(0, half_rows - 1, 0, half_cols - 1);
                var b11 = b.subMatrix(0, half_rows - 1, 0, half_cols - 1);

                var a12 = a.subMatrix(0, half_rows - 1, half_cols, a.columns - 1);
                var b12 = b.subMatrix(0, half_rows - 1, half_cols, b.columns - 1);

                var a21 = a.subMatrix(half_rows, a.rows - 1, 0, half_cols - 1);
                var b21 = b.subMatrix(half_rows, b.rows - 1, 0, half_cols - 1);

                var a22 = a.subMatrix(half_rows, a.rows - 1, half_cols, a.columns - 1);
                var b22 = b.subMatrix(half_rows, b.rows - 1, half_cols, b.columns - 1);

                // Compute intermediate values.
                var m1 = block_mult(Matrix.add(a11, a22), Matrix.add(b11, b22), half_rows, half_cols);
                var m2 = block_mult(Matrix.add(a21, a22), b11, half_rows, half_cols);
                var m3 = block_mult(a11, Matrix.sub(b12, b22), half_rows, half_cols);
                var m4 = block_mult(a22, Matrix.sub(b21, b11), half_rows, half_cols);
                var m5 = block_mult(Matrix.add(a11, a12), b22, half_rows, half_cols);
                var m6 = block_mult(Matrix.sub(a21, a11), Matrix.add(b11, b12), half_rows, half_cols);
                var m7 = block_mult(Matrix.sub(a12, a22), Matrix.add(b21, b22), half_rows, half_cols);

                // Combine intermediate values into the output.
                var c11 = Matrix.add(m1, m4);
                c11.sub(m5);
                c11.add(m7);
                var c12 = Matrix.add(m3, m5);
                var c21 = Matrix.add(m2, m4);
                var c22 = Matrix.sub(m1, m2);
                c22.add(m3);
                c22.add(m6);

                //Crop output to the desired size (undo dynamic padding).
                var resultat = Matrix.zeros(2 * c11.rows, 2 * c11.columns);
                resultat = resultat.setSubMatrix(c11, 0, 0);
                resultat = resultat.setSubMatrix(c12, c11.rows, 0);
                resultat = resultat.setSubMatrix(c21, 0, c11.columns);
                resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
                return resultat.subMatrix(0, rows - 1, 0, cols - 1);
            }
            var resultat_final = block_mult(x, y, r, c);
            return resultat_final;
        }

        /**
         * Returns a row-by-row scaled matrix
         * @param {Number} [min=0] - Minimum scaled value
         * @param {Number} [max=1] - Maximum scaled value
         * @returns {Matrix} - The scaled matrix
         */
        scaleRows(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.rows; i++) {
                var scaled = arrayUtils.scale(this.getRow(i), { min: min, max: max });
                newMatrix.setRow(i, scaled);
            }
            return newMatrix;
        }

        /**
         * Returns a new column-by-column scaled matrix
         * @param {Number} [min=0] - Minimum scaled value
         * @param {Number} [max=1] - Maximum scaled value
         * @returns {Matrix} - The new scaled matrix
         * @example
         * var matrix = new Matrix([[1,2],[-1,0]]);
         * var scaledMatrix = matrix.scaleColumns(); // [[1,1],[0,0]]
         */
        scaleColumns(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.columns; i++) {
                var scaled = arrayUtils.scale(this.getColumn(i), {
                    min: min,
                    max: max
                });
                newMatrix.setColumn(i, scaled);
            }
            return newMatrix;
        }

        /**
         * Returns the Kronecker product (also known as tensor product) between this and other
         * See https://en.wikipedia.org/wiki/Kronecker_product
         * @param {Matrix} other
         * @return {Matrix}
         */
        kroneckerProduct(other) {
            other = this.constructor.checkMatrix(other);

            var m = this.rows;
            var n = this.columns;
            var p = other.rows;
            var q = other.columns;

            var result = new this.constructor[Symbol.species](m * p, n * q);
            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    for (var k = 0; k < p; k++) {
                        for (var l = 0; l < q; l++) {
                            result[p * i + k][q * j + l] = this.get(i, j) * other.get(k, l);
                        }
                    }
                }
            }
            return result;
        }

        /**
         * Transposes the matrix and returns a new one containing the result
         * @returns {Matrix}
         */
        transpose() {
            var result = new this.constructor[Symbol.species](this.columns, this.rows);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    result.set(j, i, this.get(i, j));
                }
            }
            return result;
        }

        /**
         * Sorts the rows (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @returns {Matrix} this
         */
        sortRows(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.rows; i++) {
                this.setRow(i, this.getRow(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Sorts the columns (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @returns {Matrix} this
         */
        sortColumns(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.columns; i++) {
                this.setColumn(i, this.getColumn(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Returns a subset of the matrix
         * @param {number} startRow - First row index
         * @param {number} endRow - Last row index
         * @param {number} startColumn - First column index
         * @param {number} endColumn - Last column index
         * @returns {Matrix}
         */
        subMatrix(startRow, endRow, startColumn, endColumn) {
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, endColumn - startColumn + 1);
            for (var i = startRow; i <= endRow; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    newMatrix[i - startRow][j - startColumn] = this.get(i, j);
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of row indices
         * @param {Array} indices - Array containing the row indices
         * @param {number} [startColumn = 0] - First column index
         * @param {number} [endColumn = this.columns-1] - Last column index
         * @returns {Matrix}
         */
        subMatrixRow(indices, startColumn, endColumn) {
            if (startColumn === undefined) startColumn = 0;
            if (endColumn === undefined) endColumn = this.columns - 1;
            if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](indices.length, endColumn - startColumn + 1);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    if (indices[i] < 0 || indices[i] >= this.rows) {
                        throw new RangeError('Row index out of range: ' + indices[i]);
                    }
                    newMatrix.set(i, j - startColumn, this.get(indices[i], j));
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of column indices
         * @param {Array} indices - Array containing the column indices
         * @param {number} [startRow = 0] - First row index
         * @param {number} [endRow = this.rows-1] - Last row index
         * @returns {Matrix}
         */
        subMatrixColumn(indices, startRow, endRow) {
            if (startRow === undefined) startRow = 0;
            if (endRow === undefined) endRow = this.rows - 1;
            if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, indices.length);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startRow; j <= endRow; j++) {
                    if (indices[i] < 0 || indices[i] >= this.columns) {
                        throw new RangeError('Column index out of range: ' + indices[i]);
                    }
                    newMatrix.set(j - startRow, i, this.get(j, indices[i]));
                }
            }
            return newMatrix;
        }

        /**
         * Set a part of the matrix to the given sub-matrix
         * @param {Matrix|Array< Array >} matrix - The source matrix from which to extract values.
         * @param startRow - The index of the first row to set
         * @param startColumn - The index of the first column to set
         * @returns {Matrix}
         */
        setSubMatrix(matrix, startRow, startColumn) {
            matrix = this.constructor.checkMatrix(matrix);
            var endRow = startRow + matrix.rows - 1;
            var endColumn = startColumn + matrix.columns - 1;
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            for (var i = 0; i < matrix.rows; i++) {
                for (var j = 0; j < matrix.columns; j++) {
                    this[startRow + i][startColumn + j] = matrix.get(i, j);
                }
            }
            return this;
        }

        /**
         * Return a new matrix based on a selection of rows and columns
         * @param {Array<number>} rowIndices - The row indices to select. Order matters and an index can be more than once.
         * @param {Array<number>} columnIndices - The column indices to select. Order matters and an index can be use more than once.
         * @returns {Matrix} The new matrix
         */
        selection(rowIndices, columnIndices) {
            var indices = util.checkIndices(this, rowIndices, columnIndices);
            var newMatrix = new this.constructor[Symbol.species](rowIndices.length, columnIndices.length);
            for (var i = 0; i < indices.row.length; i++) {
                var rowIndex = indices.row[i];
                for (var j = 0; j < indices.column.length; j++) {
                    var columnIndex = indices.column[j];
                    newMatrix[i][j] = this.get(rowIndex, columnIndex);
                }
            }
            return newMatrix;
        }

        /**
         * Returns the trace of the matrix (sum of the diagonal elements)
         * @returns {number}
         */
        trace() {
            var min = Math.min(this.rows, this.columns);
            var trace = 0;
            for (var i = 0; i < min; i++) {
                trace += this.get(i, i);
            }
            return trace;
        }

        /*
         Matrix views
         */

        /**
         * Returns a view of the transposition of the matrix
         * @returns {MatrixTransposeView}
         */
        transposeView() {
            return new MatrixTransposeView(this);
        }

        /**
         * Returns a view of the row vector with the given index
         * @param {number} row - row index of the vector
         * @returns {MatrixRowView}
         */
        rowView(row) {
            util.checkRowIndex(this, row);
            return new MatrixRowView(this, row);
        }

        /**
         * Returns a view of the column vector with the given index
         * @param {number} column - column index of the vector
         * @returns {MatrixColumnView}
         */
        columnView(column) {
            util.checkColumnIndex(this, column);
            return new MatrixColumnView(this, column);
        }

        /**
         * Returns a view of the matrix flipped in the row axis
         * @returns {MatrixFlipRowView}
         */
        flipRowView() {
            return new MatrixFlipRowView(this);
        }

        /**
         * Returns a view of the matrix flipped in the column axis
         * @returns {MatrixFlipColumnView}
         */
        flipColumnView() {
            return new MatrixFlipColumnView(this);
        }

        /**
         * Returns a view of a submatrix giving the index boundaries
         * @param {number} startRow - first row index of the submatrix
         * @param {number} endRow - last row index of the submatrix
         * @param {number} startColumn - first column index of the submatrix
         * @param {number} endColumn - last column index of the submatrix
         * @returns {MatrixSubView}
         */
        subMatrixView(startRow, endRow, startColumn, endColumn) {
            return new MatrixSubView(this, startRow, endRow, startColumn, endColumn);
        }

        /**
         * Returns a view of the cross of the row indices and the column indices
         * @example
         * // resulting vector is [[2], [2]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).selectionView([0, 0], [1])
         * @param {Array<number>} rowIndices
         * @param {Array<number>} columnIndices
         * @returns {MatrixSelectionView}
         */
        selectionView(rowIndices, columnIndices) {
            return new MatrixSelectionView(this, rowIndices, columnIndices);
        }
    }

    Matrix.prototype.klass = 'Matrix';

    /**
     * @private
     * Check that two matrices have the same dimensions
     * @param {Matrix} matrix
     * @param {Matrix} otherMatrix
     */
    function checkDimensions(matrix, otherMatrix) {
        if (matrix.rows !== otherMatrix.rows || matrix.columns !== otherMatrix.columns) {
            throw new RangeError('Matrices dimensions must be equal');
        }
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    /*
     Synonyms
     */

    Matrix.random = Matrix.rand;
    Matrix.diagonal = Matrix.diag;
    Matrix.prototype.diagonal = Matrix.prototype.diag;
    Matrix.identity = Matrix.eye;
    Matrix.prototype.negate = Matrix.prototype.neg;
    Matrix.prototype.tensorProduct = Matrix.prototype.kroneckerProduct;

    /*
     Add dynamically instance and static methods for mathematical operations
     */

    var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var inplaceOperatorScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% value);
        }
    }
    return this;
})
`;

    var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% matrix.get(i, j));
        }
    }
    return this;
})
`;

    var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(value);
})
`;

    var inplaceMethod = `
(function %name%() {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j)));
        }
    }
    return this;
})
`;

    var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%();
})
`;

    var inplaceMethodWithArgs = `
(function %name%(%args%) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), %args%));
        }
    }
    return this;
})
`;

    var staticMethodWithArgs = `
(function %name%(matrix, %args%) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(%args%);
})
`;

    var inplaceMethodWithOneArgScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), value));
        }
    }
    return this;
})
`;
    var inplaceMethodWithOneArgMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), matrix.get(i, j)));
        }
    }
    return this;
})
`;

    var inplaceMethodWithOneArg = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var staticMethodWithOneArg = staticMethodWithArgs;

    var operators = [
    // Arithmetic operators
    ['+', 'add'], ['-', 'sub', 'subtract'], ['*', 'mul', 'multiply'], ['/', 'div', 'divide'], ['%', 'mod', 'modulus'],
    // Bitwise operators
    ['&', 'and'], ['|', 'or'], ['^', 'xor'], ['<<', 'leftShift'], ['>>', 'signPropagatingRightShift'], ['>>>', 'rightShift', 'zeroFillRightShift']];

    for (var operator of operators) {
        var inplaceOp = eval(fillTemplateFunction(inplaceOperator, { name: operator[1], op: operator[0] }));
        var inplaceOpS = eval(fillTemplateFunction(inplaceOperatorScalar, { name: operator[1] + 'S', op: operator[0] }));
        var inplaceOpM = eval(fillTemplateFunction(inplaceOperatorMatrix, { name: operator[1] + 'M', op: operator[0] }));
        var staticOp = eval(fillTemplateFunction(staticOperator, { name: operator[1] }));
        for (var i = 1; i < operator.length; i++) {
            Matrix.prototype[operator[i]] = inplaceOp;
            Matrix.prototype[operator[i] + 'S'] = inplaceOpS;
            Matrix.prototype[operator[i] + 'M'] = inplaceOpM;
            Matrix[operator[i]] = staticOp;
        }
    }

    var methods = [['~', 'not']];

    ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil', 'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p', 'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'].forEach(function (mathMethod) {
        methods.push(['Math.' + mathMethod, mathMethod]);
    });

    for (var method of methods) {
        var inplaceMeth = eval(fillTemplateFunction(inplaceMethod, { name: method[1], method: method[0] }));
        var staticMeth = eval(fillTemplateFunction(staticMethod, { name: method[1] }));
        for (var i = 1; i < method.length; i++) {
            Matrix.prototype[method[i]] = inplaceMeth;
            Matrix[method[i]] = staticMeth;
        }
    }

    var methodsWithArgs = [['Math.pow', 1, 'pow']];

    for (var methodWithArg of methodsWithArgs) {
        var args = 'arg0';
        for (var i = 1; i < methodWithArg[1]; i++) {
            args += `, arg${ i }`;
        }
        if (methodWithArg[1] !== 1) {
            var inplaceMethWithArgs = eval(fillTemplateFunction(inplaceMethodWithArgs, {
                name: methodWithArg[2],
                method: methodWithArg[0],
                args: args
            }));
            var staticMethWithArgs = eval(fillTemplateFunction(staticMethodWithArgs, { name: methodWithArg[2], args: args }));
            for (var i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethWithArgs;
                Matrix[methodWithArg[i]] = staticMethWithArgs;
            }
        } else {
            var tmplVar = {
                name: methodWithArg[2],
                args: args,
                method: methodWithArg[0]
            };
            var inplaceMethod = eval(fillTemplateFunction(inplaceMethodWithOneArg, tmplVar));
            var inplaceMethodS = eval(fillTemplateFunction(inplaceMethodWithOneArgScalar, tmplVar));
            var inplaceMethodM = eval(fillTemplateFunction(inplaceMethodWithOneArgMatrix, tmplVar));
            var staticMethod = eval(fillTemplateFunction(staticMethodWithOneArg, tmplVar));
            for (var i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethod;
                Matrix.prototype[methodWithArg[i] + 'M'] = inplaceMethodM;
                Matrix.prototype[methodWithArg[i] + 'S'] = inplaceMethodS;
                Matrix[methodWithArg[i]] = staticMethod;
            }
        }
    }

    function fillTemplateFunction(template, values) {
        for (var i in values) {
            template = template.replace(new RegExp('%' + i + '%', 'g'), values[i]);
        }
        return template;
    }

    return Matrix;
}

},{"./util":89,"./views/column":91,"./views/flipColumn":92,"./views/flipRow":93,"./views/row":94,"./views/selection":95,"./views/sub":96,"./views/transpose":97,"ml-array-utils":60}],79:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');

// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
function CholeskyDecomposition(value) {
    if (!(this instanceof CholeskyDecomposition)) {
        return new CholeskyDecomposition(value);
    }
    value = Matrix.checkMatrix(value);
    if (!value.isSymmetric()) throw new Error('Matrix is not symmetric');

    var a = value,
        dimension = a.rows,
        l = new Matrix(dimension, dimension),
        positiveDefinite = true,
        i,
        j,
        k;

    for (j = 0; j < dimension; j++) {
        var Lrowj = l[j];
        var d = 0;
        for (k = 0; k < j; k++) {
            var Lrowk = l[k];
            var s = 0;
            for (i = 0; i < k; i++) {
                s += Lrowk[i] * Lrowj[i];
            }
            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
            d = d + s * s;
        }

        d = a[j][j] - d;

        positiveDefinite &= d > 0;
        l[j][j] = Math.sqrt(Math.max(d, 0));
        for (k = j + 1; k < dimension; k++) {
            l[j][k] = 0;
        }
    }

    if (!positiveDefinite) {
        throw new Error('Matrix is not positive definite');
    }

    this.L = l;
}

CholeskyDecomposition.prototype = {
    get lowerTriangularMatrix() {
        return this.L;
    },
    solve: function solve(value) {
        value = Matrix.checkMatrix(value);

        var l = this.L,
            dimension = l.rows;

        if (value.rows !== dimension) {
            throw new Error('Matrix dimensions do not match');
        }

        var count = value.columns,
            B = value.clone(),
            i,
            j,
            k;

        for (k = 0; k < dimension; k++) {
            for (j = 0; j < count; j++) {
                for (i = 0; i < k; i++) {
                    B[k][j] -= B[i][j] * l[k][i];
                }
                B[k][j] /= l[k][k];
            }
        }

        for (k = dimension - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                for (i = k + 1; i < dimension; i++) {
                    B[k][j] -= B[i][j] * l[i][k];
                }
                B[k][j] /= l[k][k];
            }
        }

        return B;
    }
};

module.exports = CholeskyDecomposition;

},{"../matrix":87}],80:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');
var util = require('./util');
var hypotenuse = util.hypotenuse;
var getFilled2DArray = util.getFilled2DArray;

var defaultOptions = {
    assumeSymmetric: false
};

// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
function EigenvalueDecomposition(matrix, options) {
    options = Object.assign({}, defaultOptions, options);
    if (!(this instanceof EigenvalueDecomposition)) {
        return new EigenvalueDecomposition(matrix, options);
    }
    matrix = Matrix.checkMatrix(matrix);
    if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns,
        V = getFilled2DArray(n, n, 0),
        d = new Array(n),
        e = new Array(n),
        value = matrix,
        i,
        j;

    var isSymmetric = false;
    if (options.assumeSymmetric) {
        isSymmetric = true;
    } else {
        isSymmetric = matrix.isSymmetric();
    }

    if (isSymmetric) {
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                V[i][j] = value.get(i, j);
            }
        }
        tred2(n, e, d, V);
        tql2(n, e, d, V);
    } else {
        var H = getFilled2DArray(n, n, 0),
            ort = new Array(n);
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                H[i][j] = value.get(i, j);
            }
        }
        orthes(n, H, ort, V);
        hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
}

EigenvalueDecomposition.prototype = {
    get realEigenvalues() {
        return this.d;
    },
    get imaginaryEigenvalues() {
        return this.e;
    },
    get eigenvectorMatrix() {
        if (!Matrix.isMatrix(this.V)) {
            this.V = new Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        var n = this.n,
            e = this.e,
            d = this.d,
            X = new Matrix(n, n),
            i,
            j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                X[i][j] = 0;
            }
            X[i][i] = d[i];
            if (e[i] > 0) {
                X[i][i + 1] = e[i];
            } else if (e[i] < 0) {
                X[i][i - 1] = e[i];
            }
        }
        return X;
    }
};

function tred2(n, e, d, V) {

    var f, g, h, i, j, k, hh, scale;

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
    }

    for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
            scale = scale + Math.abs(d[k]);
        }

        if (scale === 0) {
            e[i] = d[i - 1];
            for (j = 0; j < i; j++) {
                d[j] = V[i - 1][j];
                V[i][j] = 0;
                V[j][i] = 0;
            }
        } else {
            for (k = 0; k < i; k++) {
                d[k] /= scale;
                h += d[k] * d[k];
            }

            f = d[i - 1];
            g = Math.sqrt(h);
            if (f > 0) {
                g = -g;
            }

            e[i] = scale * g;
            h = h - f * g;
            d[i - 1] = f - g;
            for (j = 0; j < i; j++) {
                e[j] = 0;
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                V[j][i] = f;
                g = e[j] + V[j][j] * f;
                for (k = j + 1; k <= i - 1; k++) {
                    g += V[k][j] * d[k];
                    e[k] += V[k][j] * f;
                }
                e[j] = g;
            }

            f = 0;
            for (j = 0; j < i; j++) {
                e[j] /= h;
                f += e[j] * d[j];
            }

            hh = f / (h + h);
            for (j = 0; j < i; j++) {
                e[j] -= hh * d[j];
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                g = e[j];
                for (k = j; k <= i - 1; k++) {
                    V[k][j] -= f * e[k] + g * d[k];
                }
                d[j] = V[i - 1][j];
                V[i][j] = 0;
            }
        }
        d[i] = h;
    }

    for (i = 0; i < n - 1; i++) {
        V[n - 1][i] = V[i][i];
        V[i][i] = 1;
        h = d[i + 1];
        if (h !== 0) {
            for (k = 0; k <= i; k++) {
                d[k] = V[k][i + 1] / h;
            }

            for (j = 0; j <= i; j++) {
                g = 0;
                for (k = 0; k <= i; k++) {
                    g += V[k][i + 1] * V[k][j];
                }
                for (k = 0; k <= i; k++) {
                    V[k][j] -= g * d[k];
                }
            }
        }

        for (k = 0; k <= i; k++) {
            V[k][i + 1] = 0;
        }
    }

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
        V[n - 1][j] = 0;
    }

    V[n - 1][n - 1] = 1;
    e[0] = 0;
}

function tql2(n, e, d, V) {

    var g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2, iter;

    for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
    }

    e[n - 1] = 0;

    var f = 0,
        tst1 = 0,
        eps = Math.pow(2, -52);

    for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
            if (Math.abs(e[m]) <= eps * tst1) {
                break;
            }
            m++;
        }

        if (m > l) {
            iter = 0;
            do {
                iter = iter + 1;

                g = d[l];
                p = (d[l + 1] - g) / (2 * e[l]);
                r = hypotenuse(p, 1);
                if (p < 0) {
                    r = -r;
                }

                d[l] = e[l] / (p + r);
                d[l + 1] = e[l] * (p + r);
                dl1 = d[l + 1];
                h = g - d[l];
                for (i = l + 2; i < n; i++) {
                    d[i] -= h;
                }

                f = f + h;

                p = d[m];
                c = 1;
                c2 = c;
                c3 = c;
                el1 = e[l + 1];
                s = 0;
                s2 = 0;
                for (i = m - 1; i >= l; i--) {
                    c3 = c2;
                    c2 = c;
                    s2 = s;
                    g = c * e[i];
                    h = c * p;
                    r = hypotenuse(p, e[i]);
                    e[i + 1] = s * r;
                    s = e[i] / r;
                    c = p / r;
                    p = c * d[i] - s * g;
                    d[i + 1] = h + s * (c * g + s * d[i]);

                    for (k = 0; k < n; k++) {
                        h = V[k][i + 1];
                        V[k][i + 1] = s * V[k][i] + c * h;
                        V[k][i] = c * V[k][i] - s * h;
                    }
                }

                p = -s * s2 * c3 * el1 * e[l] / dl1;
                e[l] = s * p;
                d[l] = c * p;
            } while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
    }

    for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
            if (d[j] < p) {
                k = j;
                p = d[j];
            }
        }

        if (k !== i) {
            d[k] = d[i];
            d[i] = p;
            for (j = 0; j < n; j++) {
                p = V[j][i];
                V[j][i] = V[j][k];
                V[j][k] = p;
            }
        }
    }
}

function orthes(n, H, ort, V) {

    var low = 0,
        high = n - 1,
        f,
        g,
        h,
        i,
        j,
        m,
        scale;

    for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
            scale = scale + Math.abs(H[i][m - 1]);
        }

        if (scale !== 0) {
            h = 0;
            for (i = high; i >= m; i--) {
                ort[i] = H[i][m - 1] / scale;
                h += ort[i] * ort[i];
            }

            g = Math.sqrt(h);
            if (ort[m] > 0) {
                g = -g;
            }

            h = h - ort[m] * g;
            ort[m] = ort[m] - g;

            for (j = m; j < n; j++) {
                f = 0;
                for (i = high; i >= m; i--) {
                    f += ort[i] * H[i][j];
                }

                f = f / h;
                for (i = m; i <= high; i++) {
                    H[i][j] -= f * ort[i];
                }
            }

            for (i = 0; i <= high; i++) {
                f = 0;
                for (j = high; j >= m; j--) {
                    f += ort[j] * H[i][j];
                }

                f = f / h;
                for (j = m; j <= high; j++) {
                    H[i][j] -= f * ort[j];
                }
            }

            ort[m] = scale * ort[m];
            H[m][m - 1] = scale * g;
        }
    }

    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            V[i][j] = i === j ? 1 : 0;
        }
    }

    for (m = high - 1; m >= low + 1; m--) {
        if (H[m][m - 1] !== 0) {
            for (i = m + 1; i <= high; i++) {
                ort[i] = H[i][m - 1];
            }

            for (j = m; j <= high; j++) {
                g = 0;
                for (i = m; i <= high; i++) {
                    g += ort[i] * V[i][j];
                }

                g = g / ort[m] / H[m][m - 1];
                for (i = m; i <= high; i++) {
                    V[i][j] += g * ort[i];
                }
            }
        }
    }
}

function hqr2(nn, e, d, V, H) {
    var n = nn - 1,
        low = 0,
        high = nn - 1,
        eps = Math.pow(2, -52),
        exshift = 0,
        norm = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        z = 0,
        iter = 0,
        i,
        j,
        k,
        l,
        m,
        t,
        w,
        x,
        y,
        ra,
        sa,
        vr,
        vi,
        notlast,
        cdivres;

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            d[i] = H[i][i];
            e[i] = 0;
        }

        for (j = Math.max(i - 1, 0); j < nn; j++) {
            norm = norm + Math.abs(H[i][j]);
        }
    }

    while (n >= low) {
        l = n;
        while (l > low) {
            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
            if (s === 0) {
                s = norm;
            }
            if (Math.abs(H[l][l - 1]) < eps * s) {
                break;
            }
            l--;
        }

        if (l === n) {
            H[n][n] = H[n][n] + exshift;
            d[n] = H[n][n];
            e[n] = 0;
            n--;
            iter = 0;
        } else if (l === n - 1) {
            w = H[n][n - 1] * H[n - 1][n];
            p = (H[n - 1][n - 1] - H[n][n]) / 2;
            q = p * p + w;
            z = Math.sqrt(Math.abs(q));
            H[n][n] = H[n][n] + exshift;
            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
            x = H[n][n];

            if (q >= 0) {
                z = p >= 0 ? p + z : p - z;
                d[n - 1] = x + z;
                d[n] = d[n - 1];
                if (z !== 0) {
                    d[n] = x - w / z;
                }
                e[n - 1] = 0;
                e[n] = 0;
                x = H[n][n - 1];
                s = Math.abs(x) + Math.abs(z);
                p = x / s;
                q = z / s;
                r = Math.sqrt(p * p + q * q);
                p = p / r;
                q = q / r;

                for (j = n - 1; j < nn; j++) {
                    z = H[n - 1][j];
                    H[n - 1][j] = q * z + p * H[n][j];
                    H[n][j] = q * H[n][j] - p * z;
                }

                for (i = 0; i <= n; i++) {
                    z = H[i][n - 1];
                    H[i][n - 1] = q * z + p * H[i][n];
                    H[i][n] = q * H[i][n] - p * z;
                }

                for (i = low; i <= high; i++) {
                    z = V[i][n - 1];
                    V[i][n - 1] = q * z + p * V[i][n];
                    V[i][n] = q * V[i][n] - p * z;
                }
            } else {
                d[n - 1] = x + p;
                d[n] = x + p;
                e[n - 1] = z;
                e[n] = -z;
            }

            n = n - 2;
            iter = 0;
        } else {
            x = H[n][n];
            y = 0;
            w = 0;
            if (l < n) {
                y = H[n - 1][n - 1];
                w = H[n][n - 1] * H[n - 1][n];
            }

            if (iter === 10) {
                exshift += x;
                for (i = low; i <= n; i++) {
                    H[i][i] -= x;
                }
                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
                x = y = 0.75 * s;
                w = -0.4375 * s * s;
            }

            if (iter === 30) {
                s = (y - x) / 2;
                s = s * s + w;
                if (s > 0) {
                    s = Math.sqrt(s);
                    if (y < x) {
                        s = -s;
                    }
                    s = x - w / ((y - x) / 2 + s);
                    for (i = low; i <= n; i++) {
                        H[i][i] -= s;
                    }
                    exshift += s;
                    x = y = w = 0.964;
                }
            }

            iter = iter + 1;

            m = n - 2;
            while (m >= l) {
                z = H[m][m];
                r = x - z;
                s = y - z;
                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
                q = H[m + 1][m + 1] - z - r - s;
                r = H[m + 2][m + 1];
                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
                p = p / s;
                q = q / s;
                r = r / s;
                if (m === l) {
                    break;
                }
                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
                    break;
                }
                m--;
            }

            for (i = m + 2; i <= n; i++) {
                H[i][i - 2] = 0;
                if (i > m + 2) {
                    H[i][i - 3] = 0;
                }
            }

            for (k = m; k <= n - 1; k++) {
                notlast = k !== n - 1;
                if (k !== m) {
                    p = H[k][k - 1];
                    q = H[k + 1][k - 1];
                    r = notlast ? H[k + 2][k - 1] : 0;
                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
                    if (x !== 0) {
                        p = p / x;
                        q = q / x;
                        r = r / x;
                    }
                }

                if (x === 0) {
                    break;
                }

                s = Math.sqrt(p * p + q * q + r * r);
                if (p < 0) {
                    s = -s;
                }

                if (s !== 0) {
                    if (k !== m) {
                        H[k][k - 1] = -s * x;
                    } else if (l !== m) {
                        H[k][k - 1] = -H[k][k - 1];
                    }

                    p = p + s;
                    x = p / s;
                    y = q / s;
                    z = r / s;
                    q = q / p;
                    r = r / p;

                    for (j = k; j < nn; j++) {
                        p = H[k][j] + q * H[k + 1][j];
                        if (notlast) {
                            p = p + r * H[k + 2][j];
                            H[k + 2][j] = H[k + 2][j] - p * z;
                        }

                        H[k][j] = H[k][j] - p * x;
                        H[k + 1][j] = H[k + 1][j] - p * y;
                    }

                    for (i = 0; i <= Math.min(n, k + 3); i++) {
                        p = x * H[i][k] + y * H[i][k + 1];
                        if (notlast) {
                            p = p + z * H[i][k + 2];
                            H[i][k + 2] = H[i][k + 2] - p * r;
                        }

                        H[i][k] = H[i][k] - p;
                        H[i][k + 1] = H[i][k + 1] - p * q;
                    }

                    for (i = low; i <= high; i++) {
                        p = x * V[i][k] + y * V[i][k + 1];
                        if (notlast) {
                            p = p + z * V[i][k + 2];
                            V[i][k + 2] = V[i][k + 2] - p * r;
                        }

                        V[i][k] = V[i][k] - p;
                        V[i][k + 1] = V[i][k + 1] - p * q;
                    }
                }
            }
        }
    }

    if (norm === 0) {
        return;
    }

    for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];

        if (q === 0) {
            l = n;
            H[n][n] = 1;
            for (i = n - 1; i >= 0; i--) {
                w = H[i][i] - p;
                r = 0;
                for (j = l; j <= n; j++) {
                    r = r + H[i][j] * H[j][n];
                }

                if (e[i] < 0) {
                    z = w;
                    s = r;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        H[i][n] = w !== 0 ? -r / w : -r / (eps * norm);
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                        t = (x * s - z * r) / q;
                        H[i][n] = t;
                        H[i + 1][n] = Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z;
                    }

                    t = Math.abs(H[i][n]);
                    if (eps * t * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        } else if (q < 0) {
            l = n - 1;

            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
                H[n - 1][n - 1] = q / H[n][n - 1];
                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
            } else {
                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
                H[n - 1][n - 1] = cdivres[0];
                H[n - 1][n] = cdivres[1];
            }

            H[n][n - 1] = 0;
            H[n][n] = 1;
            for (i = n - 2; i >= 0; i--) {
                ra = 0;
                sa = 0;
                for (j = l; j <= n; j++) {
                    ra = ra + H[i][j] * H[j][n - 1];
                    sa = sa + H[i][j] * H[j][n];
                }

                w = H[i][i] - p;

                if (e[i] < 0) {
                    z = w;
                    r = ra;
                    s = sa;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        cdivres = cdiv(-ra, -sa, w, q);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                        vi = (d[i] - p) * 2 * q;
                        if (vr === 0 && vi === 0) {
                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                        }
                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                        if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
                        } else {
                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
                            H[i + 1][n - 1] = cdivres[0];
                            H[i + 1][n] = cdivres[1];
                        }
                    }

                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
                    if (eps * t * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n - 1] = H[j][n - 1] / t;
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        }
    }

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            for (j = i; j < nn; j++) {
                V[i][j] = H[i][j];
            }
        }
    }

    for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
            z = 0;
            for (k = low; k <= Math.min(j, high); k++) {
                z = z + V[i][k] * H[k][j];
            }
            V[i][j] = z;
        }
    }
}

function cdiv(xr, xi, yr, yi) {
    var r, d;
    if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
    } else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
    }
}

module.exports = EigenvalueDecomposition;

},{"../matrix":87,"./util":84}],81:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');

// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
function LuDecomposition(matrix) {
    if (!(this instanceof LuDecomposition)) {
        return new LuDecomposition(matrix);
    }
    matrix = Matrix.checkMatrix(matrix);

    var lu = matrix.clone(),
        rows = lu.rows,
        columns = lu.columns,
        pivotVector = new Array(rows),
        pivotSign = 1,
        i,
        j,
        k,
        p,
        s,
        t,
        v,
        LUrowi,
        LUcolj,
        kmax;

    for (i = 0; i < rows; i++) {
        pivotVector[i] = i;
    }

    LUcolj = new Array(rows);

    for (j = 0; j < columns; j++) {

        for (i = 0; i < rows; i++) {
            LUcolj[i] = lu[i][j];
        }

        for (i = 0; i < rows; i++) {
            LUrowi = lu[i];
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
                s += LUrowi[k] * LUcolj[k];
            }
            LUrowi[j] = LUcolj[i] -= s;
        }

        p = j;
        for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
                p = i;
            }
        }

        if (p !== j) {
            for (k = 0; k < columns; k++) {
                t = lu[p][k];
                lu[p][k] = lu[j][k];
                lu[j][k] = t;
            }

            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;

            pivotSign = -pivotSign;
        }

        if (j < rows && lu[j][j] !== 0) {
            for (i = j + 1; i < rows; i++) {
                lu[i][j] /= lu[j][j];
            }
        }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
}

LuDecomposition.prototype = {
    isSingular: function isSingular() {
        var data = this.LU,
            col = data.columns;
        for (var j = 0; j < col; j++) {
            if (data[j][j] === 0) {
                return true;
            }
        }
        return false;
    },
    get determinant() {
        var data = this.LU;
        if (!data.isSquare()) throw new Error('Matrix must be square');
        var determinant = this.pivotSign,
            col = data.columns;
        for (var j = 0; j < col; j++) {
            determinant *= data[j][j];
        }return determinant;
    },
    get lowerTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i > j) {
                    X[i][j] = data[i][j];
                } else if (i === j) {
                    X[i][j] = 1;
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get upperTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i <= j) {
                    X[i][j] = data[i][j];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get pivotPermutationVector() {
        return this.pivotVector.slice();
    },
    solve: function solve(value) {
        value = Matrix.checkMatrix(value);

        var lu = this.LU,
            rows = lu.rows;

        if (rows !== value.rows) throw new Error('Invalid matrix dimensions');
        if (this.isSingular()) throw new Error('LU matrix is singular');

        var count = value.columns,
            X = value.subMatrixRow(this.pivotVector, 0, count - 1),
            columns = lu.columns,
            i,
            j,
            k;

        for (k = 0; k < columns; k++) {
            for (i = k + 1; i < columns; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        for (k = columns - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= lu[k][k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        return X;
    }
};

module.exports = LuDecomposition;

},{"../matrix":87}],82:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');
var hypotenuse = require('./util').hypotenuse;

//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
function QrDecomposition(value) {
    if (!(this instanceof QrDecomposition)) {
        return new QrDecomposition(value);
    }
    value = Matrix.checkMatrix(value);

    var qr = value.clone(),
        m = value.rows,
        n = value.columns,
        rdiag = new Array(n),
        i,
        j,
        k,
        s;

    for (k = 0; k < n; k++) {
        var nrm = 0;
        for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr[i][k]);
        }
        if (nrm !== 0) {
            if (qr[k][k] < 0) {
                nrm = -nrm;
            }
            for (i = k; i < m; i++) {
                qr[i][k] /= nrm;
            }
            qr[k][k] += 1;
            for (j = k + 1; j < n; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * qr[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    qr[i][j] += s * qr[i][k];
                }
            }
        }
        rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
}

QrDecomposition.prototype = {
    solve: function solve(value) {
        value = Matrix.checkMatrix(value);

        var qr = this.QR,
            m = qr.rows;

        if (value.rows !== m) throw new Error('Matrix row dimensions must agree');
        if (!this.isFullRank()) throw new Error('Matrix is rank deficient');

        var count = value.columns,
            X = value.clone(),
            n = qr.columns,
            i,
            j,
            k,
            s;

        for (k = 0; k < n; k++) {
            for (j = 0; j < count; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * X[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    X[i][j] += s * qr[i][k];
                }
            }
        }
        for (k = n - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= this.Rdiag[k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * qr[i][k];
                }
            }
        }

        return X.subMatrix(0, n - 1, 0, count - 1);
    },
    isFullRank: function isFullRank() {
        var columns = this.QR.columns;
        for (var i = 0; i < columns; i++) {
            if (this.Rdiag[i] === 0) {
                return false;
            }
        }
        return true;
    },
    get upperTriangularMatrix() {
        var qr = this.QR,
            n = qr.columns,
            X = new Matrix(n, n),
            i,
            j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                if (i < j) {
                    X[i][j] = qr[i][j];
                } else if (i === j) {
                    X[i][j] = this.Rdiag[i];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get orthogonalMatrix() {
        var qr = this.QR,
            rows = qr.rows,
            columns = qr.columns,
            X = new Matrix(rows, columns),
            i,
            j,
            k,
            s;

        for (k = columns - 1; k >= 0; k--) {
            for (i = 0; i < rows; i++) {
                X[i][k] = 0;
            }
            X[k][k] = 1;
            for (j = k; j < columns; j++) {
                if (qr[k][k] !== 0) {
                    s = 0;
                    for (i = k; i < rows; i++) {
                        s += qr[i][k] * X[i][j];
                    }

                    s = -s / qr[k][k];

                    for (i = k; i < rows; i++) {
                        X[i][j] += s * qr[i][k];
                    }
                }
            }
        }
        return X;
    }
};

module.exports = QrDecomposition;

},{"../matrix":87,"./util":84}],83:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');
var util = require('./util');
var hypotenuse = util.hypotenuse;
var getFilled2DArray = util.getFilled2DArray;

// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
function SingularValueDecomposition(value, options) {
    if (!(this instanceof SingularValueDecomposition)) {
        return new SingularValueDecomposition(value, options);
    }
    value = Matrix.checkMatrix(value);

    options = options || {};

    var m = value.rows,
        n = value.columns,
        nu = Math.min(m, n);

    var wantu = true,
        wantv = true;
    if (options.computeLeftSingularVectors === false) wantu = false;
    if (options.computeRightSingularVectors === false) wantv = false;
    var autoTranspose = options.autoTranspose === true;

    var swapped = false;
    var a;
    if (m < n) {
        if (!autoTranspose) {
            a = value.clone();
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
            a = value.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            var aux = wantu;
            wantu = wantv;
            wantv = aux;
        }
    } else {
        a = value.clone();
    }

    var s = new Array(Math.min(m + 1, n)),
        U = getFilled2DArray(m, nu, 0),
        V = getFilled2DArray(n, n, 0),
        e = new Array(n),
        work = new Array(m);

    var nct = Math.min(m - 1, n);
    var nrt = Math.max(0, Math.min(n - 2, m));

    var i, j, k, p, t, ks, f, cs, sn, max, kase, scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
        if (k < nct) {
            s[k] = 0;
            for (i = k; i < m; i++) {
                s[k] = hypotenuse(s[k], a[i][k]);
            }
            if (s[k] !== 0) {
                if (a[k][k] < 0) {
                    s[k] = -s[k];
                }
                for (i = k; i < m; i++) {
                    a[i][k] /= s[k];
                }
                a[k][k] += 1;
            }
            s[k] = -s[k];
        }

        for (j = k + 1; j < n; j++) {
            if (k < nct && s[k] !== 0) {
                t = 0;
                for (i = k; i < m; i++) {
                    t += a[i][k] * a[i][j];
                }
                t = -t / a[k][k];
                for (i = k; i < m; i++) {
                    a[i][j] += t * a[i][k];
                }
            }
            e[j] = a[k][j];
        }

        if (wantu && k < nct) {
            for (i = k; i < m; i++) {
                U[i][k] = a[i][k];
            }
        }

        if (k < nrt) {
            e[k] = 0;
            for (i = k + 1; i < n; i++) {
                e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
                if (e[k + 1] < 0) e[k] = -e[k];
                for (i = k + 1; i < n; i++) {
                    e[i] /= e[k];
                }
                e[k + 1] += 1;
            }
            e[k] = -e[k];
            if (k + 1 < m && e[k] !== 0) {
                for (i = k + 1; i < m; i++) {
                    work[i] = 0;
                }
                for (j = k + 1; j < n; j++) {
                    for (i = k + 1; i < m; i++) {
                        work[i] += e[j] * a[i][j];
                    }
                }
                for (j = k + 1; j < n; j++) {
                    t = -e[j] / e[k + 1];
                    for (i = k + 1; i < m; i++) {
                        a[i][j] += t * work[i];
                    }
                }
            }
            if (wantv) {
                for (i = k + 1; i < n; i++) {
                    V[i][k] = e[i];
                }
            }
        }
    }

    p = Math.min(n, m + 1);
    if (nct < n) {
        s[nct] = a[nct][nct];
    }
    if (m < p) {
        s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
        e[nrt] = a[nrt][p - 1];
    }
    e[p - 1] = 0;

    if (wantu) {
        for (j = nct; j < nu; j++) {
            for (i = 0; i < m; i++) {
                U[i][j] = 0;
            }
            U[j][j] = 1;
        }
        for (k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
                for (j = k + 1; j < nu; j++) {
                    t = 0;
                    for (i = k; i < m; i++) {
                        t += U[i][k] * U[i][j];
                    }
                    t = -t / U[k][k];
                    for (i = k; i < m; i++) {
                        U[i][j] += t * U[i][k];
                    }
                }
                for (i = k; i < m; i++) {
                    U[i][k] = -U[i][k];
                }
                U[k][k] = 1 + U[k][k];
                for (i = 0; i < k - 1; i++) {
                    U[i][k] = 0;
                }
            } else {
                for (i = 0; i < m; i++) {
                    U[i][k] = 0;
                }
                U[k][k] = 1;
            }
        }
    }

    if (wantv) {
        for (k = n - 1; k >= 0; k--) {
            if (k < nrt && e[k] !== 0) {
                for (j = k + 1; j < n; j++) {
                    t = 0;
                    for (i = k + 1; i < n; i++) {
                        t += V[i][k] * V[i][j];
                    }
                    t = -t / V[k + 1][k];
                    for (i = k + 1; i < n; i++) {
                        V[i][j] += t * V[i][k];
                    }
                }
            }
            for (i = 0; i < n; i++) {
                V[i][k] = 0;
            }
            V[k][k] = 1;
        }
    }

    var pp = p - 1,
        iter = 0,
        eps = Math.pow(2, -52);
    while (p > 0) {
        for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
                break;
            }
            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
                e[k] = 0;
                break;
            }
        }
        if (k === p - 2) {
            kase = 4;
        } else {
            for (ks = p - 1; ks >= k; ks--) {
                if (ks === k) {
                    break;
                }
                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
                if (Math.abs(s[ks]) <= eps * t) {
                    s[ks] = 0;
                    break;
                }
            }
            if (ks === k) {
                kase = 3;
            } else if (ks === p - 1) {
                kase = 1;
            } else {
                kase = 2;
                k = ks;
            }
        }

        k++;

        switch (kase) {
            case 1:
                {
                    f = e[p - 2];
                    e[p - 2] = 0;
                    for (j = p - 2; j >= k; j--) {
                        t = hypotenuse(s[j], f);
                        cs = s[j] / t;
                        sn = f / t;
                        s[j] = t;
                        if (j !== k) {
                            f = -sn * e[j - 1];
                            e[j - 1] = cs * e[j - 1];
                        }
                        if (wantv) {
                            for (i = 0; i < n; i++) {
                                t = cs * V[i][j] + sn * V[i][p - 1];
                                V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                                V[i][j] = t;
                            }
                        }
                    }
                    break;
                }
            case 2:
                {
                    f = e[k - 1];
                    e[k - 1] = 0;
                    for (j = k; j < p; j++) {
                        t = hypotenuse(s[j], f);
                        cs = s[j] / t;
                        sn = f / t;
                        s[j] = t;
                        f = -sn * e[j];
                        e[j] = cs * e[j];
                        if (wantu) {
                            for (i = 0; i < m; i++) {
                                t = cs * U[i][j] + sn * U[i][k - 1];
                                U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                                U[i][j] = t;
                            }
                        }
                    }
                    break;
                }
            case 3:
                {
                    scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
                    sp = s[p - 1] / scale;
                    spm1 = s[p - 2] / scale;
                    epm1 = e[p - 2] / scale;
                    sk = s[k] / scale;
                    ek = e[k] / scale;
                    b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
                    c = sp * epm1 * (sp * epm1);
                    shift = 0;
                    if (b !== 0 || c !== 0) {
                        shift = Math.sqrt(b * b + c);
                        if (b < 0) {
                            shift = -shift;
                        }
                        shift = c / (b + shift);
                    }
                    f = (sk + sp) * (sk - sp) + shift;
                    g = sk * ek;
                    for (j = k; j < p - 1; j++) {
                        t = hypotenuse(f, g);
                        cs = f / t;
                        sn = g / t;
                        if (j !== k) {
                            e[j - 1] = t;
                        }
                        f = cs * s[j] + sn * e[j];
                        e[j] = cs * e[j] - sn * s[j];
                        g = sn * s[j + 1];
                        s[j + 1] = cs * s[j + 1];
                        if (wantv) {
                            for (i = 0; i < n; i++) {
                                t = cs * V[i][j] + sn * V[i][j + 1];
                                V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                                V[i][j] = t;
                            }
                        }
                        t = hypotenuse(f, g);
                        cs = f / t;
                        sn = g / t;
                        s[j] = t;
                        f = cs * e[j] + sn * s[j + 1];
                        s[j + 1] = -sn * e[j] + cs * s[j + 1];
                        g = sn * e[j + 1];
                        e[j + 1] = cs * e[j + 1];
                        if (wantu && j < m - 1) {
                            for (i = 0; i < m; i++) {
                                t = cs * U[i][j] + sn * U[i][j + 1];
                                U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                                U[i][j] = t;
                            }
                        }
                    }
                    e[p - 2] = f;
                    iter = iter + 1;
                    break;
                }
            case 4:
                {
                    if (s[k] <= 0) {
                        s[k] = s[k] < 0 ? -s[k] : 0;
                        if (wantv) {
                            for (i = 0; i <= pp; i++) {
                                V[i][k] = -V[i][k];
                            }
                        }
                    }
                    while (k < pp) {
                        if (s[k] >= s[k + 1]) {
                            break;
                        }
                        t = s[k];
                        s[k] = s[k + 1];
                        s[k + 1] = t;
                        if (wantv && k < n - 1) {
                            for (i = 0; i < n; i++) {
                                t = V[i][k + 1];
                                V[i][k + 1] = V[i][k];
                                V[i][k] = t;
                            }
                        }
                        if (wantu && k < m - 1) {
                            for (i = 0; i < m; i++) {
                                t = U[i][k + 1];
                                U[i][k + 1] = U[i][k];
                                U[i][k] = t;
                            }
                        }
                        k++;
                    }
                    iter = 0;
                    p--;
                    break;
                }
        }
    }

    if (swapped) {
        var tmp = V;
        V = U;
        U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
}

SingularValueDecomposition.prototype = {
    get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
    },
    get norm2() {
        return this.s[0];
    },
    get rank() {
        var eps = Math.pow(2, -52),
            tol = Math.max(this.m, this.n) * this.s[0] * eps,
            r = 0,
            s = this.s;
        for (var i = 0, ii = s.length; i < ii; i++) {
            if (s[i] > tol) {
                r++;
            }
        }
        return r;
    },
    get diagonal() {
        return this.s;
    },
    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
    get threshold() {
        return Math.pow(2, -52) / 2 * Math.max(this.m, this.n) * this.s[0];
    },
    get leftSingularVectors() {
        if (!Matrix.isMatrix(this.U)) {
            this.U = new Matrix(this.U);
        }
        return this.U;
    },
    get rightSingularVectors() {
        if (!Matrix.isMatrix(this.V)) {
            this.V = new Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        return Matrix.diag(this.s);
    },
    solve: function solve(value) {

        var Y = value,
            e = this.threshold,
            scols = this.s.length,
            Ls = Matrix.zeros(scols, scols),
            i;

        for (i = 0; i < scols; i++) {
            if (Math.abs(this.s[i]) <= e) {
                Ls[i][i] = 0;
            } else {
                Ls[i][i] = 1 / this.s[i];
            }
        }

        var U = this.U;
        var V = this.rightSingularVectors;

        var VL = V.mmul(Ls),
            vrows = V.rows,
            urows = U.length,
            VLU = Matrix.zeros(vrows, urows),
            j,
            k,
            sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < scols; k++) {
                    sum += VL[i][k] * U[j][k];
                }
                VLU[i][j] = sum;
            }
        }

        return VLU.mmul(Y);
    },
    solveForDiagonal: function solveForDiagonal(value) {
        return this.solve(Matrix.diag(value));
    },
    inverse: function inverse() {
        var V = this.V;
        var e = this.threshold,
            vrows = V.length,
            vcols = V[0].length,
            X = new Matrix(vrows, this.s.length),
            i,
            j;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < vcols; j++) {
                if (Math.abs(this.s[j]) > e) {
                    X[i][j] = V[i][j] / this.s[j];
                } else {
                    X[i][j] = 0;
                }
            }
        }

        var U = this.U;

        var urows = U.length,
            ucols = U[0].length,
            Y = new Matrix(vrows, urows),
            k,
            sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < ucols; k++) {
                    sum += X[i][k] * U[j][k];
                }
                Y[i][j] = sum;
            }
        }

        return Y;
    }
};

module.exports = SingularValueDecomposition;

},{"../matrix":87,"./util":84}],84:[function(require,module,exports){
'use strict';

exports.hypotenuse = function hypotenuse(a, b) {
    if (Math.abs(a) > Math.abs(b)) {
        var r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
    }
    if (b !== 0) {
        var r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
    }
    return 0;
};

// For use in the decomposition algorithms. With big matrices, access time is
// too long on elements from array subclass
// todo check when it is fixed in v8
// http://jsperf.com/access-and-write-array-subclass
exports.getEmpty2DArray = function (rows, columns) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
    }
    return array;
};

exports.getFilled2DArray = function (rows, columns, value) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            array[i][j] = value;
        }
    }
    return array;
};

},{}],85:[function(require,module,exports){
'use strict';

var Matrix = require('./matrix');

var SingularValueDecomposition = require('./dc/svd');
var EigenvalueDecomposition = require('./dc/evd');
var LuDecomposition = require('./dc/lu');
var QrDecomposition = require('./dc/qr');
var CholeskyDecomposition = require('./dc/cholesky');

function inverse(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    return solve(matrix, Matrix.eye(matrix.rows));
}

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.inverse = Matrix.inv = inverse;

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.prototype.inverse = Matrix.prototype.inv = function () {
    return inverse(this);
};

function solve(leftHandSide, rightHandSide) {
    leftHandSide = Matrix.checkMatrix(leftHandSide);
    rightHandSide = Matrix.checkMatrix(rightHandSide);
    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
}

Matrix.solve = solve;
Matrix.prototype.solve = function (other) {
    return solve(this, other);
};

module.exports = {
    SingularValueDecomposition: SingularValueDecomposition,
    SVD: SingularValueDecomposition,
    EigenvalueDecomposition: EigenvalueDecomposition,
    EVD: EigenvalueDecomposition,
    LuDecomposition: LuDecomposition,
    LU: LuDecomposition,
    QrDecomposition: QrDecomposition,
    QR: QrDecomposition,
    CholeskyDecomposition: CholeskyDecomposition,
    CHO: CholeskyDecomposition,
    inverse: inverse,
    solve: solve
};

},{"./dc/cholesky":79,"./dc/evd":80,"./dc/lu":81,"./dc/qr":82,"./dc/svd":83,"./matrix":87}],86:[function(require,module,exports){
'use strict';

module.exports = require('./matrix');
module.exports.Decompositions = module.exports.DC = require('./decompositions');

},{"./decompositions":85,"./matrix":87}],87:[function(require,module,exports){
'use strict';

require('./symbol-species');
var abstractMatrix = require('./abstractMatrix');
var util = require('./util');

class Matrix extends abstractMatrix(Array) {
    constructor(nRows, nColumns) {
        if (arguments.length === 1 && typeof nRows === 'number') {
            return new Array(nRows);
        }
        if (Matrix.isMatrix(nRows)) {
            return nRows.clone();
        } else if (Number.isInteger(nRows) && nRows > 0) {
            // Create an empty matrix
            super(nRows);
            if (Number.isInteger(nColumns) && nColumns > 0) {
                for (var i = 0; i < nRows; i++) {
                    this[i] = new Array(nColumns);
                }
            } else {
                throw new TypeError('nColumns must be a positive integer');
            }
        } else if (Array.isArray(nRows)) {
            // Copy the values from the 2D array
            var matrix = nRows;
            nRows = matrix.length;
            nColumns = matrix[0].length;
            if (typeof nColumns !== 'number' || nColumns === 0) {
                throw new TypeError('Data must be a 2D array with at least one element');
            }
            super(nRows);
            for (var i = 0; i < nRows; i++) {
                if (matrix[i].length !== nColumns) {
                    throw new RangeError('Inconsistent array dimensions');
                }
                this[i] = [].concat(matrix[i]);
            }
        } else {
            throw new TypeError('First argument must be a positive number or an array');
        }
        this.rows = nRows;
        this.columns = nColumns;
    }

    set(rowIndex, columnIndex, value) {
        this[rowIndex][columnIndex] = value;
        return this;
    }

    get(rowIndex, columnIndex) {
        return this[rowIndex][columnIndex];
    }

    /**
     * Creates an exact and independent copy of the matrix
     * @returns {Matrix}
     */
    clone() {
        var newMatrix = new this.constructor[Symbol.species](this.rows, this.columns);
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                newMatrix.set(row, column, this.get(row, column));
            }
        }
        return newMatrix;
    }

    /**
     * Removes a row from the given index
     * @param {number} index - Row index
     * @returns {Matrix} this
     */
    removeRow(index) {
        util.checkRowIndex(this, index);
        if (this.rows === 1) throw new RangeError('A matrix cannot have less than one row');
        this.splice(index, 1);
        this.rows -= 1;
        return this;
    }

    /**
     * Adds a row at the given index
     * @param {number} [index = this.rows] - Row index
     * @param {Array|Matrix} array - Array or vector
     * @returns {Matrix} this
     */
    addRow(index, array) {
        if (array === undefined) {
            array = index;
            index = this.rows;
        }
        util.checkRowIndex(this, index, true);
        array = util.checkRowVector(this, array, true);
        this.splice(index, 0, array);
        this.rows += 1;
        return this;
    }

    /**
     * Removes a column from the given index
     * @param {number} index - Column index
     * @returns {Matrix} this
     */
    removeColumn(index) {
        util.checkColumnIndex(this, index);
        if (this.columns === 1) throw new RangeError('A matrix cannot have less than one column');
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 1);
        }
        this.columns -= 1;
        return this;
    }

    /**
     * Adds a column at the given index
     * @param {number} [index = this.columns] - Column index
     * @param {Array|Matrix} array - Array or vector
     * @returns {Matrix} this
     */
    addColumn(index, array) {
        if (typeof array === 'undefined') {
            array = index;
            index = this.columns;
        }
        util.checkColumnIndex(this, index, true);
        array = util.checkColumnVector(this, array);
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 0, array[i]);
        }
        this.columns += 1;
        return this;
    }
}

module.exports = Matrix;
Matrix.abstractMatrix = abstractMatrix;

},{"./abstractMatrix":78,"./symbol-species":88,"./util":89}],88:[function(require,module,exports){
'use strict';

if (!Symbol.species) {
    Symbol.species = Symbol.for('@@species');
}

},{}],89:[function(require,module,exports){
'use strict';

/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */

exports.checkRowIndex = function checkRowIndex(matrix, index, outer) {
    var max = outer ? matrix.rows : matrix.rows - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Row index out of range');
    }
};

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkColumnIndex = function checkColumnIndex(matrix, index, outer) {
    var max = outer ? matrix.columns : matrix.columns - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Column index out of range');
    }
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @returns {Array}
 * @throws {RangeError}
 */
exports.checkRowVector = function checkRowVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.columns) {
        throw new RangeError('vector size must be the same as the number of columns');
    }
    return vector;
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @returns {Array}
 * @throws {RangeError}
 */
exports.checkColumnVector = function checkColumnVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.rows) {
        throw new RangeError('vector size must be the same as the number of rows');
    }
    return vector;
};

exports.checkIndices = function checkIndices(matrix, rowIndices, columnIndices) {
    var rowOut = rowIndices.some(r => {
        return r < 0 || r >= matrix.rows;
    });

    var columnOut = columnIndices.some(c => {
        return c < 0 || c >= matrix.columns;
    });

    if (rowOut || columnOut) {
        throw new RangeError('Indices are out of range');
    }

    if (typeof rowIndices !== 'object' || typeof columnIndices !== 'object') {
        throw new TypeError('Unexpected type for row/column indices');
    }
    if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);
    if (!Array.isArray(columnIndices)) rowIndices = Array.from(columnIndices);

    return {
        row: rowIndices,
        column: columnIndices
    };
};

exports.checkRange = function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
    if (arguments.length !== 5) throw new TypeError('Invalid argument type');
    var notAllNumbers = Array.from(arguments).slice(1).some(function (arg) {
        return typeof arg !== 'number';
    });
    if (notAllNumbers) throw new TypeError('Invalid argument type');
    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
        throw new RangeError('Submatrix indices are out of range');
    }
};

exports.getRange = function getRange(from, to) {
    var arr = new Array(to - from + 1);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = from + i;
    }
    return arr;
};

},{}],90:[function(require,module,exports){
'use strict';

var abstractMatrix = require('../abstractMatrix');
var Matrix;

class BaseView extends abstractMatrix() {
    constructor(matrix, rows, columns) {
        super();
        this.matrix = matrix;
        this.rows = rows;
        this.columns = columns;
    }

    static get [Symbol.species]() {
        if (!Matrix) {
            Matrix = require('../matrix');
        }
        return Matrix;
    }
}

module.exports = BaseView;

},{"../abstractMatrix":78,"../matrix":87}],91:[function(require,module,exports){
'use strict';

var BaseView = require('./base');

class MatrixColumnView extends BaseView {
    constructor(matrix, column) {
        super(matrix, matrix.rows, 1);
        this.column = column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.column, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.column);
    }
}

module.exports = MatrixColumnView;

},{"./base":90}],92:[function(require,module,exports){
'use strict';

var BaseView = require('./base');

class MatrixFlipColumnView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
    }
}

module.exports = MatrixFlipColumnView;

},{"./base":90}],93:[function(require,module,exports){
'use strict';

var BaseView = require('./base');

class MatrixFlipRowView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
    }
}

module.exports = MatrixFlipRowView;

},{"./base":90}],94:[function(require,module,exports){
'use strict';

var BaseView = require('./base');

class MatrixRowView extends BaseView {
    constructor(matrix, row) {
        super(matrix, 1, matrix.columns);
        this.row = row;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.row, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.row, columnIndex);
    }
}

module.exports = MatrixRowView;

},{"./base":90}],95:[function(require,module,exports){
'use strict';

var BaseView = require('./base');
var util = require('../util');

class MatrixSelectionView extends BaseView {
    constructor(matrix, rowIndices, columnIndices) {
        var indices = util.checkIndices(matrix, rowIndices, columnIndices);
        super(matrix, indices.row.length, indices.column.length);
        this.rowIndices = indices.row;
        this.columnIndices = indices.column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
    }
}

module.exports = MatrixSelectionView;

},{"../util":89,"./base":90}],96:[function(require,module,exports){
'use strict';

var BaseView = require('./base');
var util = require('../util');

class MatrixSubView extends BaseView {
    constructor(matrix, startRow, endRow, startColumn, endColumn) {
        util.checkRange(matrix, startRow, endRow, startColumn, endColumn);
        super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
        this.startRow = startRow;
        this.startColumn = startColumn;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
    }
}

module.exports = MatrixSubView;

},{"../util":89,"./base":90}],97:[function(require,module,exports){
'use strict';

var BaseView = require('./base');

class MatrixTransposeView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.columns, matrix.rows);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(columnIndex, rowIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(columnIndex, rowIndex);
    }
}

module.exports = MatrixTransposeView;

},{"./base":90}],98:[function(require,module,exports){
'use strict';

exports.SimpleLinearRegression = exports.SLR = require('./regression/simple-linear-regression');
exports.NonLinearRegression = exports.NLR = {
    PolynomialRegression: require('./regression/polynomial-regression'),
    PotentialRegression: require('./regression/potential-regression'),
    ExpRegression: require('./regression/exp-regression'),
    PowerRegression: require('./regression/power-regression')
};
exports.KernelRidgeRegression = exports.KRR = require('./regression/kernel-ridge-regression');
//exports.MultipleLinearRegression = exports.MLR = require('./regression/multiple-linear-regression');
//exports.MultivariateLinearRegression = exports.MVLR = require('./regression/multivariate-linear-regression');
exports.PolinomialFitting2D = require('./regression/poly-fit-regression2d');
exports.TheilSenRegression = require('./regression/theil-sen-regression');

},{"./regression/exp-regression":100,"./regression/kernel-ridge-regression":101,"./regression/poly-fit-regression2d":102,"./regression/polynomial-regression":103,"./regression/potential-regression":104,"./regression/power-regression":105,"./regression/simple-linear-regression":106,"./regression/theil-sen-regression":107}],99:[function(require,module,exports){
'use strict';

class BaseRegression {
    predict(x) {
        var y2;
        if (Array.isArray(x)) {
            y2 = new Array(x.length);
            for (var i = 0; i < x.length; i++) {
                y2[i] = this._predict(x[i]);
            }
        } else if (Number.isFinite(x)) {
            y2 = this._predict(x);
        } else {
            throw new TypeError('x must be a number or array');
        }
        return y2;
    }

    _predict(x) {
        throw new Error('_compute not implemented');
    }

    train(options) {
        //Do nothing for this package
    }

    toString(precision) {
        return '';
    }

    toLaTeX(precision) {
        return '';
    }

    /**
     * Return the correlation coefficient of determination (r) and chi-square.
     * @param x
     * @param y
     * @returns {object}
     */
    modelQuality(x, y) {
        var n = x.length;
        var y2 = new Array(n);
        for (var i = 0; i < n; i++) {
            y2[i] = this._predict(x[i]);
        }
        var xSum = 0;
        var ySum = 0;
        var chi2 = 0;
        var rmsd = 0;
        var xSquared = 0;
        var ySquared = 0;
        var xY = 0;

        for (var _i = 0; _i < n; _i++) {
            xSum += y2[_i];
            ySum += y[_i];
            xSquared += y2[_i] * y2[_i];
            ySquared += y[_i] * y[_i];
            xY += y2[_i] * y[_i];
            if (y[_i] !== 0) chi2 += (y[_i] - y2[_i]) * (y[_i] - y2[_i]) / y[_i];
            rmsd = (y[_i] - y2[_i]) * (y[_i] - y2[_i]);
        }

        var r = (n * xY - xSum * ySum) / Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));

        return {
            r: r,
            r2: r * r,
            chi2: chi2,
            rmsd: rmsd * rmsd / n
        };
    }

}

module.exports = BaseRegression;

},{}],100:[function(require,module,exports){
'use strict';

/*
 * Function that calculate the linear fit in the form f(x) = Ce^(A * x) and
 * return the A and C coefficient of the given formula.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return {Object} coefficients - The A and C coefficients.
 *
 * Created by acastillo on 5/12/16.
 */

var maybeToPrecision = require('./util').maybeToPrecision;
var SimpleLinearRegression = require('./simple-linear-regression');
var BaseRegression = require('./base-regression');

class ExpRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, options) {
        super();
        var opt = options || {};
        if (x === true) {
            // reloading model
            this.A = y.A;
            this.C = y.C;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var yl = new Array(n);
            for (var i = 0; i < n; i++) {
                yl[i] = Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(x, yl, { computeCoefficient: false });
            this.A = linear.slope;
            this.C = Math.exp(linear.intercept);
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(newInputs) {
        return this.C * Math.exp(newInputs * this.A);
    }

    toJSON() {
        var out = { name: 'expRegression', A: this.A, C: this.C };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'y = ' + maybeToPrecision(this.C, precision) + '*exp(' + maybeToPrecision(this.A, precision) + '*x)';
    }

    toLaTeX(precision) {
        if (this.A >= 0) return 'y = ' + maybeToPrecision(this.C, precision) + 'e^{' + maybeToPrecision(this.A, precision) + 'x}';else return 'y = \\frac{' + maybeToPrecision(this.C, precision) + '}{e^{' + maybeToPrecision(-this.A, precision) + 'x}}';
    }

    static load(json) {
        if (json.name !== 'expRegression') {
            throw new TypeError('not a exp regression model');
        }
        return new ExpRegression(true, json);
    }
}

module.exports = ExpRegression;

},{"./base-regression":99,"./simple-linear-regression":106,"./util":108}],101:[function(require,module,exports){
'use strict';

var Matrix = require('ml-matrix');
var Kernel = require('ml-kernel');

var BaseRegression = require('./base-regression');

var defaultOptions = {
    lambda: 0.1,
    kernelType: 'gaussian',
    kernelOptions: {},
    computeCoefficient: false
};

// Implements the Kernel ridge regression algorithm.
// http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
class KernelRidgeRegression extends BaseRegression {
    constructor(inputs, outputs, options) {
        super();
        if (inputs === true) {
            // reloading model
            this.alpha = outputs.alpha;
            this.inputs = outputs.inputs;
            this.kernelType = outputs.kernelType;
            this.kernelOptions = outputs.kernelOptions;
            this.kernel = new Kernel(outputs.kernelType, outputs.kernelOptions);

            if (outputs.quality) {
                this.quality = outputs.quality;
            }
        } else {
            options = Object.assign({}, defaultOptions, options);

            var kernelFunction = new Kernel(options.kernelType, options.kernelOptions);
            var K = kernelFunction.compute(inputs);
            var n = inputs.length;
            K.add(Matrix.eye(n, n).mul(options.lambda));

            this.alpha = K.solve(outputs);
            this.inputs = inputs;
            this.kernelType = options.kernelType;
            this.kernelOptions = options.kernelOptions;
            this.kernel = kernelFunction;

            if (options.computeQuality) {
                this.quality = this.modelQuality(inputs, outputs);
            }
        }
    }

    _predict(newInputs) {
        return this.kernel.compute([newInputs], this.inputs).mmul(this.alpha)[0];
    }

    toJSON() {
        var out = {
            name: 'kernelRidgeRegression',
            alpha: this.alpha,
            inputs: this.inputs,
            kernelType: this.kernelType,
            kernelOptions: this.kernelOptions
        };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    static load(json) {
        if (json.name !== 'kernelRidgeRegression') {
            throw new TypeError('not a KRR model');
        }
        return new KernelRidgeRegression(true, json);
    }
}

module.exports = KernelRidgeRegression;

},{"./base-regression":99,"ml-kernel":69,"ml-matrix":86}],102:[function(require,module,exports){
'use strict';

var Matrix = require('ml-matrix');
var SVD = Matrix.DC.SingularValueDecomposition;
var BaseRegression = require('./base-regression');

var defaultOptions = {
    order: 2
};
// Implements the Kernel ridge regression algorithm.
// http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
class PolynomialFitRegression2D extends BaseRegression {
    /**
     * Constructor for the 2D polynomial fitting
     *
     * @param inputs
     * @param outputs
     * @param options
     * @constructor
     */
    constructor(inputs, outputs, options) {
        super();
        if (inputs === true) {
            // reloading model
            this.coefficients = Matrix.columnVector(outputs.coefficients);
            this.order = outputs.order;
            if (outputs.r) {
                this.r = outputs.r;
                this.r2 = outputs.r2;
            }
            if (outputs.chi2) {
                this.chi2 = outputs.chi2;
            }
        } else {
            options = Object.assign({}, defaultOptions, options);
            this.order = options.order;
            this.coefficients = [];
            this.X = inputs;
            this.y = outputs;

            this.train(this.X, this.y, options);

            if (options.computeQuality) {
                this.quality = this.modelQuality(inputs, outputs);
            }
        }
    }

    /**
     * Function that fits the model given the data(X) and predictions(y).
     * The third argument is an object with the following options:
     * * order: order of the polynomial to fit.
     *
     * @param X - A matrix with n rows and 2 columns.
     * @param y - A vector of the prediction values.
     * @param options
     */
    train(X, y, options) {
        if (!Matrix.isMatrix(X)) X = new Matrix(X);
        if (!Matrix.isMatrix(y)) y = Matrix.columnVector(y);

        if (y.rows !== X.rows) //Perhaps y is transpose
            y = y.transpose();

        if (X.columns !== 2) throw new RangeError('You give X with ' + X.columns + ' columns and it must be 2');
        if (X.rows !== y.rows) throw new RangeError('X and y must have the same rows');

        var examples = X.rows;
        var coefficients = (this.order + 2) * (this.order + 1) / 2;
        this.coefficients = new Array(coefficients);

        var x1 = X.getColumnVector(0);
        var x2 = X.getColumnVector(1);

        var scaleX1 = 1.0 / x1.clone().apply(abs).max();
        var scaleX2 = 1.0 / x2.clone().apply(abs).max();
        var scaleY = 1.0 / y.clone().apply(abs).max();

        x1.mulColumn(0, scaleX1);
        x2.mulColumn(0, scaleX2);
        y.mulColumn(0, scaleY);

        var A = new Matrix(examples, coefficients);
        var col = 0;

        for (var i = 0; i <= this.order; ++i) {
            var limit = this.order - i;
            for (var j = 0; j <= limit; ++j) {
                var result = powColVector(x1, i).mulColumnVector(powColVector(x2, j));
                A.setColumn(col, result);
                col++;
            }
        }

        var svd = new SVD(A.transpose(), {
            computeLeftSingularVectors: true,
            computeRightSingularVectors: true,
            autoTranspose: false
        });

        var qqs = Matrix.rowVector(svd.diagonal);
        qqs = qqs.apply(function (i, j) {
            if (this[i][j] >= 1e-15) this[i][j] = 1 / this[i][j];else this[i][j] = 0;
        });

        var qqs1 = Matrix.zeros(examples, coefficients);
        for (i = 0; i < coefficients; ++i) {
            qqs1[i][i] = qqs[0][i];
        }

        qqs = qqs1;

        var U = svd.rightSingularVectors;
        var V = svd.leftSingularVectors;

        this.coefficients = V.mmul(qqs.transpose()).mmul(U.transpose()).mmul(y);

        col = 0;

        for (i = 0; i <= coefficients; ++i) {
            limit = this.order - i;
            for (j = 0; j <= limit; ++j) {
                this.coefficients[col][0] = this.coefficients[col][0] * Math.pow(scaleX1, i) * Math.pow(scaleX2, j) / scaleY;
                col++;
            }
        }
    }

    _predict(newInputs) {
        var x1 = newInputs[0];
        var x2 = newInputs[1];

        var y = 0;
        var column = 0;

        for (var i = 0; i <= this.order; i++) {
            for (var j = 0; j <= this.order - i; j++) {
                y += Math.pow(x1, i) * Math.pow(x2, j) * this.coefficients[column][0];
                column++;
            }
        }

        return y;
    }

    toJSON() {
        var out = {
            name: 'polyfit2D',
            order: this.order,
            coefficients: this.coefficients
        };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    static load(json) {
        if (json.name !== 'polyfit2D') {
            throw new TypeError('not a polyfit2D model');
        }
        return new PolynomialFitRegression2D(true, json);
    }

}

module.exports = PolynomialFitRegression2D;

/**
 * Function that given a column vector return this: vector^power
 *
 * @param x - Column vector.
 * @param power - Pow number.
 * @returns {Suite|Matrix}
 */
function powColVector(x, power) {
    var result = x.clone();
    for (var i = 0; i < x.rows; ++i) {
        result[i][0] = Math.pow(result[i][0], power);
    }
    return result;
}

/**
 * Function to use in the apply method to get the absolute value
 * of each element of the matrix
 *
 * @param i - current row.
 * @param j - current column.
 */
function abs(i, j) {
    this[i][j] = Math.abs(this[i][j]);
}

},{"./base-regression":99,"ml-matrix":86}],103:[function(require,module,exports){
'use strict';

/**
 * Function that return a constants of the M degree polynomial that
 * fit the given points, this constants is given from lower to higher
 * order of the polynomial.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @param {Number|BigNumber} M - Degree of the polynomial.
 * @param {Vector} constants - Vector of constants of the function.
 * Created by acastillo on 5/12/16.
 */

var maybeToPrecision = require('./util').maybeToPrecision;
var BaseRegression = require('./base-regression');
var Matrix = require('ml-matrix');

class PolynomialRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param M: Maximum degree of the polynomial
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        var opt = options || {};
        if (x === true) {
            // reloading model
            this.coefficients = y.coefficients;
            this.powers = y.powers;
            this.M = y.M;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var powers = void 0;
            if (Array.isArray(M)) {
                powers = M;
                M = powers.length;
            } else {
                M++;
                powers = new Array(M);
                for (k = 0; k < M; k++) {
                    powers[k] = k;
                }
            }
            var F = new Matrix(n, M);
            var Y = new Matrix([y]);
            var k, i;
            for (k = 0; k < M; k++) {
                for (i = 0; i < n; i++) {
                    if (powers[k] === 0) F[i][k] = 1;else {
                        F[i][k] = Math.pow(x[i], powers[k]);
                    }
                }
            }

            var FT = F.transposeView();
            var A = FT.mmul(F);
            var B = FT.mmul(Y.transposeView());

            this.coefficients = A.solve(B).to1DArray();
            this.powers = powers;
            this.M = M - 1;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(x) {
        var y = 0;
        for (var k = 0; k < this.powers.length; k++) {
            y += this.coefficients[k] * Math.pow(x, this.powers[k]);
        }
        return y;
    }

    toJSON() {
        var out = { name: 'polynomialRegression',
            coefficients: this.coefficients,
            powers: this.powers,
            M: this.M
        };

        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return this._toFormula(precision, false);
    }

    toLaTeX(precision) {
        return this._toFormula(precision, true);
    }

    _toFormula(precision, isLaTeX) {
        var sup = '^';
        var closeSup = '';
        var times = '*';
        if (isLaTeX) {
            sup = '^{';
            closeSup = '}';
            times = '';
        }

        var fn = '',
            str;
        for (var k = 0; k < this.coefficients.length; k++) {
            str = '';
            if (this.coefficients[k] !== 0) {
                if (this.powers[k] === 0) str = maybeToPrecision(this.coefficients[k], precision);else {
                    if (this.powers[k] === 1) str = maybeToPrecision(this.coefficients[k], precision) + times + 'x';else {
                        str = maybeToPrecision(this.coefficients[k], precision) + times + 'x' + sup + this.powers[k] + closeSup;
                    }
                }
                if (this.coefficients[k] > 0) str = '+' + str;
            }
            fn = str + fn;
        }
        if (fn.charAt(0) === '+') {
            fn = fn.slice(1);
        }

        return 'y = ' + fn;
    }

    static load(json) {
        if (json.name !== 'polynomialRegression') {
            throw new TypeError('not a polynomial regression model');
        }
        return new PolynomialRegression(true, json);
    }
}

module.exports = PolynomialRegression;

},{"./base-regression":99,"./util":108,"ml-matrix":86}],104:[function(require,module,exports){
'use strict';

/*
 * Function that calculate the potential fit in the form f(x) = A*x^M
 * with a given M and return de A coefficient.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the x positions of the points.
 * @param {Number, BigNumber} M - The exponent of the potential fit.
 * @return {Number|BigNumber} A - The A coefficient of the potential fit.
 * Created by acastillo on 5/12/16.
 */

var maybeToPrecision = require('./util').maybeToPrecision;
var PolynomialRegression = require('./polynomial-regression');
var PowerRegression = require('./power-regression');
var BaseRegression = require('./base-regression');

class PotentialRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        var opt = options || {};
        if (x === true) {
            // reloading model
            this.A = y.A;
            this.M = y.M;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var linear = new PolynomialRegression(x, y, [M], { computeCoefficient: true });
            this.A = linear.coefficients[0];
            this.M = M;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(x) {
        return this.A * Math.pow(x, this.M);
    }

    toJSON() {
        var out = { name: 'potentialRegression', A: this.A, M: this.M };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'y = ' + maybeToPrecision(this.A, precision) + '*x^' + this.M;
    }

    toLaTeX(precision) {

        if (this.M >= 0) return 'y = ' + maybeToPrecision(this.A, precision) + 'x^{' + this.M + '}';else return 'y = \\frac{' + maybeToPrecision(this.A, precision) + '}{x^{' + -this.M + '}}';
    }

    static load(json) {
        if (json.name !== 'potentialRegression') {
            throw new TypeError('not a potential regression model');
        }
        return new PowerRegression(true, json);
    }
}

module.exports = PotentialRegression;

},{"./base-regression":99,"./polynomial-regression":103,"./power-regression":105,"./util":108}],105:[function(require,module,exports){
'use strict';

/**
 * This class implements the power regression f(x)=A*x^B
 * Created by acastillo on 5/12/16.
 */

var maybeToPrecision = require('./util').maybeToPrecision;
var SimpleLinearRegression = require('./simple-linear-regression');
var BaseRegression = require('./base-regression');

class PowerRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, options) {
        super();
        var opt = options || {};
        if (x === true) {
            // reloading model
            this.A = y.A;
            this.B = y.B;
            this.quality = y.quality || {};
            if (y.quality.r) {
                this.quality.r = y.quality.r;
                this.quality.r2 = y.quality.r2;
            }
            if (y.quality.chi2) {
                this.quality.chi2 = y.quality.chi2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var xl = new Array(n),
                yl = new Array(n);
            for (var i = 0; i < n; i++) {
                xl[i] = Math.log(x[i]);
                yl[i] = Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(xl, yl, { computeCoefficient: false });
            this.A = Math.exp(linear.intercept);
            this.B = linear.slope;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(newInputs) {
        return this.A * Math.pow(newInputs, this.B);
    }

    toJSON() {
        var out = { name: 'powerRegression', A: this.A, B: this.B };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'y = ' + maybeToPrecision(this.A, precision) + '*x^' + maybeToPrecision(this.B, precision);
    }

    toLaTeX(precision) {
        if (this.B >= 0) return 'y = ' + maybeToPrecision(this.A, precision) + 'x^{' + maybeToPrecision(this.B, precision) + '}';else return 'y = \\frac{' + maybeToPrecision(this.A, precision) + '}{x^{' + maybeToPrecision(-this.B, precision) + '}}';
    }

    static load(json) {
        if (json.name !== 'powerRegression') {
            throw new TypeError('not a power regression model');
        }
        return new PowerRegression(true, json);
    }
}

module.exports = PowerRegression;

},{"./base-regression":99,"./simple-linear-regression":106,"./util":108}],106:[function(require,module,exports){
'use strict';

var maybeToPrecision = require('./util').maybeToPrecision;
var BaseRegression = require('./base-regression');

class SimpleLinearRegression extends BaseRegression {

    constructor(x, y, options) {
        options = options || {};
        super();
        if (x === true) {
            this.slope = y.slope;
            this.intercept = y.intercept;
            this.quality = y.quality || {};
            if (y.quality.r) {
                this.quality.r = y.quality.r;
                this.quality.r2 = y.quality.r2;
            }
            if (y.quality.chi2) {
                this.quality.chi2 = y.quality.chi2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var xSum = 0;
            var ySum = 0;

            var xSquared = 0;
            var ySquared = 0;
            var xY = 0;

            for (var i = 0; i < n; i++) {
                xSum += x[i];
                ySum += y[i];
                xSquared += x[i] * x[i];
                ySquared += y[i] * y[i];
                xY += x[i] * y[i];
            }

            var numerator = n * xY - xSum * ySum;

            this.slope = numerator / (n * xSquared - xSum * xSum);
            this.intercept = 1 / n * ySum - this.slope * (1 / n) * xSum;
            this.coefficients = [this.intercept, this.slope];
            if (options.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    toJSON() {
        var out = {
            name: 'simpleLinearRegression',
            slope: this.slope,
            intercept: this.intercept
        };
        if (this.quality) {
            out.quality = this.quality;
        }

        return out;
    }

    _predict(input) {
        return this.slope * input + this.intercept;
    }

    computeX(input) {
        return (input - this.intercept) / this.slope;
    }

    toString(precision) {
        var result = 'y = ';
        if (this.slope) {
            var xFactor = maybeToPrecision(this.slope, precision);
            result += (xFactor == 1 ? '' : xFactor) + 'x';
            if (this.intercept) {
                var absIntercept = Math.abs(this.intercept);
                var operator = absIntercept === this.intercept ? '+' : '-';
                result += ' ' + operator + ' ' + maybeToPrecision(absIntercept, precision);
            }
        } else {
            result += maybeToPrecision(this.intercept, precision);
        }
        return result;
    }

    toLaTeX(precision) {
        return this.toString(precision);
    }

    static load(json) {
        if (json.name !== 'simpleLinearRegression') {
            throw new TypeError('not a SLR model');
        }
        return new SimpleLinearRegression(true, json);
    }
}

module.exports = SimpleLinearRegression;

},{"./base-regression":99,"./util":108}],107:[function(require,module,exports){
'use strict';

var BaseRegression = require('./base-regression');
var maybeToPrecision = require('./util').maybeToPrecision;
var median = require('ml-stat/array').median;

/**
 * Theil–Sen estimator
 *
 * https://en.wikipedia.org/wiki/Theil%E2%80%93Sen_estimator
 * @class
 */
class TheilSenRegression extends BaseRegression {

    /**
     *
     * @param x
     * @param y
     * @param options
     * @constructor
     */
    constructor(x, y, options) {
        options = options || {};
        super();
        if (x === true) {
            // loads the model
            this.slope = y.slope;
            this.intercept = y.intercept;
            this.quality = y.quality || {};
            if (y.quality.r) {
                this.quality.r = y.quality.r;
                this.quality.r2 = y.quality.r2;
            }
            if (y.quality.chi2) {
                this.quality.chi2 = y.quality.chi2;
            }
        } else {
            // creates the model
            var len = x.length;
            if (len !== y.length) {
                throw new RangeError('Input and output array have a different length');
            }

            var slopes = new Array(len * len);
            var count = 0;
            for (var i = 0; i < len; ++i) {
                for (var j = i + 1; j < len; ++j) {
                    if (x[i] !== x[j]) {
                        slopes[count++] = (y[j] - y[i]) / (x[j] - x[i]);
                    }
                }
            }
            slopes.length = count;
            var medianSlope = median(slopes);

            var cuts = new Array(len);
            for (var _i = 0; _i < len; ++_i) {
                cuts[_i] = y[_i] - medianSlope * x[_i];
            }

            this.slope = medianSlope;
            this.intercept = median(cuts);
            this.coefficients = [this.intercept, this.slope];
            if (options.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    toJSON() {
        var out = {
            name: 'TheilSenRegression',
            slope: this.slope,
            intercept: this.intercept
        };
        if (this.quality) {
            out.quality = this.quality;
        }

        return out;
    }

    _predict(input) {
        return this.slope * input + this.intercept;
    }

    computeX(input) {
        return (input - this.intercept) / this.slope;
    }

    toString(precision) {
        var result = 'y = ';
        if (this.slope) {
            var xFactor = maybeToPrecision(this.slope, precision);
            result += (Math.abs(xFactor - 1) < 1e-5 ? '' : xFactor) + 'x';
            if (this.intercept) {
                var absIntercept = Math.abs(this.intercept);
                var operator = absIntercept === this.intercept ? '+' : '-';
                result += ' ' + operator + ' ' + maybeToPrecision(absIntercept, precision);
            }
        } else {
            result += maybeToPrecision(this.intercept, precision);
        }
        return result;
    }

    toLaTeX(precision) {
        return this.toString(precision);
    }

    static load(json) {
        if (json.name !== 'TheilSenRegression') {
            throw new TypeError('not a Theil-Sen model');
        }
        return new TheilSenRegression(true, json);
    }
}

module.exports = TheilSenRegression;

},{"./base-regression":99,"./util":108,"ml-stat/array":109}],108:[function(require,module,exports){
'use strict';

exports.maybeToPrecision = function maybeToPrecision(value, digits) {
    if (digits) return value.toPrecision(digits);else return value.toString();
};

},{}],109:[function(require,module,exports){
'use strict';

function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = values[0];
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < l - k; i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

/**
 * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
 * Calculate the standard deviation via the Median of the absolute deviation
 *  The formula for the standard deviation only holds for Gaussian random variables.
 * @returns {{mean: number, stdev: number}}
 */
exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
    var mean = 0,
        stdev = 0;
    var length = y.length,
        i = 0;
    for (i = 0; i < length; i++) {
        mean += y[i];
    }
    mean /= length;
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++) {
        averageDeviations[i] = Math.abs(y[i] - mean);
    }averageDeviations.sort(compareNumbers);
    if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
    } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
    }

    return {
        mean: mean,
        stdev: stdev
    };
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof alreadySorted === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return { q1: q1, q2: q2, q3: q3 };
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof unbiased === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0,
        l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased) length += values.length - 1;else length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0) itemCount[index]++;else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0,
        maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof unbiased === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length) throw 'Vectors do not have the same dimensions';

    var cov = 0,
        l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased) return cov / (l - 1);else return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof unbiased === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0,
        s3 = 0,
        l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / Math.pow(m2, 3 / 2.0);
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return a / b * g;
    } else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof unbiased === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length,
        s2 = 0,
        s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    } else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof eps === 'undefined') eps = 0;
    var sum = 0,
        l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i] * Math.log(values[i] + eps);
    }return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0,
        l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i] * weights[i];
    }return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0,
        l = values.length;
    var a = 0,
        b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof inPlace === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace) result = [].concat(values);

    var theMean = exports.mean(result),
        l = result.length;
    for (var i = 0; i < l; i++) {
        result[i] -= theMean;
    }
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof standardDev === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof inPlace === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = values[i] / standardDev;
    }return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++) {
        result[i] = result[i - 1] + array[i];
    }return result;
};

},{}],110:[function(require,module,exports){
'use strict';

exports.array = require('./array');
exports.matrix = require('./matrix');

},{"./array":109,"./matrix":111}],111:[function(require,module,exports){
'use strict';

var arrayStat = require('./array');

function compareNumbers(a, b) {
    return a - b;
}

exports.max = function max(matrix) {
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return max;
};

exports.min = function min(matrix) {
    var min = Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
        }
    }
    return min;
};

exports.minMax = function minMax(matrix) {
    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return {
        min: min,
        max: max
    };
};

exports.entropy = function entropy(matrix, eps) {
    if (typeof eps === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
};

exports.mean = function mean(matrix, dimension) {
    if (typeof dimension === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean,
        N,
        i,
        j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
};

exports.sum = function sum(matrix, dimension) {
    if (typeof dimension === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theSum,
        i,
        j;

    if (dimension === -1) {
        theSum = [0];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theSum[0] += matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theSum = new Array(cols);
        for (j = 0; j < cols; j++) {
            theSum[j] = 0;
            for (i = 0; i < rows; i++) {
                theSum[j] += matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theSum = new Array(rows);
        for (j = 0; j < rows; j++) {
            theSum[j] = 0;
            for (i = 0; i < cols; i++) {
                theSum[j] += matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theSum;
};

exports.product = function product(matrix, dimension) {
    if (typeof dimension === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theProduct,
        i,
        j;

    if (dimension === -1) {
        theProduct = [1];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theProduct[0] *= matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theProduct = new Array(cols);
        for (j = 0; j < cols; j++) {
            theProduct[j] = 1;
            for (i = 0; i < rows; i++) {
                theProduct[j] *= matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theProduct = new Array(rows);
        for (j = 0; j < rows; j++) {
            theProduct[j] = 1;
            for (i = 0; i < cols; i++) {
                theProduct[j] *= matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theProduct;
};

exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
    var vari = exports.variance(matrix, means, unbiased),
        l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
};

exports.variance = function variance(matrix, means, unbiased) {
    if (typeof unbiased === 'undefined') {
        unbiased = true;
    }
    means = means || exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0,
            sum2 = 0,
            x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - sum1 * sum1 / rows) / (rows - 1);
        } else {
            vari[j] = (sum2 - sum1 * sum1 / rows) / rows;
        }
    }
    return vari;
};

exports.median = function median(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort(compareNumbers);
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[N / 2 - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
};

exports.mode = function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i,
        j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0,
            maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
};

exports.skewness = function skewness(matrix, unbiased) {
    if (typeof unbiased === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length,
        l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0,
            s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = a / b * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
};

exports.kurtosis = function kurtosis(matrix, unbiased) {
    if (typeof unbiased === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length,
        m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0,
            s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
};

exports.standardError = function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = exports.standardDeviation(matrix);
    var l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
};

exports.covariance = function covariance(matrix, dimension) {
    return exports.scatter(matrix, undefined, dimension);
};

exports.scatter = function scatter(matrix, divisor, dimension) {
    if (typeof dimension === 'undefined') {
        dimension = 0;
    }
    if (typeof divisor === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = exports.mean(matrix, dimension);
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov,
        i,
        j,
        s,
        k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};

exports.correlation = function correlation(matrix) {
    var means = exports.mean(matrix),
        standardDeviations = exports.standardDeviation(matrix, true, means),
        scores = exports.zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i,
        j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
};

exports.zScores = function zScores(matrix, means, standardDeviations) {
    means = means || exports.mean(matrix);
    if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
    return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
};

exports.center = function center(matrix, means, inPlace) {
    means = means || exports.mean(matrix);
    var result = matrix,
        l = matrix.length,
        i,
        j,
        jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
};

exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
    if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i,
        j,
        jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
};

exports.weightedVariance = function weightedVariance(matrix, weights) {
    var means = exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0,
            b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
};

exports.weightedMean = function weightedMean(matrix, weights, dimension) {
    if (typeof dimension === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means,
        i,
        ii,
        j,
        w,
        row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
};

exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    var s1 = 0,
        s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return exports.weightedScatter(matrix, weights, means, factor, dimension);
};

exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    if (typeof factor === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov,
        i,
        j,
        k,
        s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};

},{"./array":109}],112:[function(require,module,exports){
'use strict';

module.exports = typeof Promise === 'function' ? Promise : require('lie');

},{"lie":57}],113:[function(require,module,exports){
"use strict";

module.exports = newArray;

function newArray(n, value) {
  n = n || 0;
  var array = new Array(n);
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}

},{}],114:[function(require,module,exports){
'use strict';

var numberIsNan = require('number-is-nan');

function assertNum(x) {
	if (typeof x !== 'number' || numberIsNan(x)) {
		throw new TypeError('Expected a number');
	}
}

exports.asc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return a - b;
};

exports.desc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return b - a;
};

},{"number-is-nan":115}],115:[function(require,module,exports){
'use strict';

module.exports = Number.isNaN || function (x) {
	return x !== x;
};

},{}],116:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim

var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = function () {
	/* global window */
	if (typeof window === 'undefined') {
		return false;
	}
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}();
var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2);
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":117}],117:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],118:[function(require,module,exports){
// Top level file is just a mixin of submodules & constants
'use strict';

var assign = require('./lib/utils/common').assign;

var deflate = require('./lib/deflate');
var inflate = require('./lib/inflate');
var constants = require('./lib/zlib/constants');

var pako = {};

assign(pako, deflate, inflate, constants);

module.exports = pako;

},{"./lib/deflate":119,"./lib/inflate":120,"./lib/utils/common":121,"./lib/zlib/constants":124}],119:[function(require,module,exports){
'use strict';

var zlib_deflate = require('./zlib/deflate');
var utils = require('./utils/common');
var strings = require('./utils/strings');
var msg = require('./zlib/messages');
var ZStream = require('./zlib/zstream');

var toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

var Z_NO_FLUSH = 0;
var Z_FINISH = 4;

var Z_OK = 0;
var Z_STREAM_END = 1;
var Z_SYNC_FLUSH = 2;

var Z_DEFAULT_COMPRESSION = -1;

var Z_DEFAULT_STRATEGY = 0;

var Z_DEFLATED = 8;

/* ===========================================================================*/

/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overriden.
 **/

/**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/

/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  if (!(this instanceof Deflate)) return new Deflate(options);

  this.options = utils.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ''
  }, options || {});

  var opt = this.options;

  if (opt.raw && opt.windowBits > 0) {
    opt.windowBits = -opt.windowBits;
  } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
    opt.windowBits += 16;
  }

  this.err = 0; // error code, if happens (0 = Z_OK)
  this.msg = ''; // error message
  this.ended = false; // used to avoid multiple onEnd() calls
  this.chunks = []; // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  var status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  if (opt.header) {
    zlib_deflate.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    var dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;

  if (this.ended) {
    return false;
  }

  _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = zlib_deflate.deflate(strm, _mode); /* no bad return value */

    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
      if (this.options.to === 'string') {
        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

  // Finalize on the last chunk.
  if (_mode === Z_FINISH) {
    status = zlib_deflate.deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};

/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};

/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};

/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  var deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) {
    throw deflator.msg;
  }

  return deflator.result;
}

/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}

/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}

exports.Deflate = Deflate;
exports.deflate = deflate;
exports.deflateRaw = deflateRaw;
exports.gzip = gzip;

},{"./utils/common":121,"./utils/strings":122,"./zlib/deflate":126,"./zlib/messages":131,"./zlib/zstream":133}],120:[function(require,module,exports){
'use strict';

var zlib_inflate = require('./zlib/inflate');
var utils = require('./utils/common');
var strings = require('./utils/strings');
var c = require('./zlib/constants');
var msg = require('./zlib/messages');
var ZStream = require('./zlib/zstream');
var GZheader = require('./zlib/gzheader');

var toString = Object.prototype.toString;

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overriden.
 **/

/**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/

/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  if (!(this instanceof Inflate)) return new Inflate(options);

  this.options = utils.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ''
  }, options || {});

  var opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) {
      opt.windowBits = -15;
    }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if (opt.windowBits > 15 && opt.windowBits < 48) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err = 0; // error code, if happens (0 = Z_OK)
  this.msg = ''; // error message
  this.ended = false; // used to avoid multiple onEnd() calls
  this.chunks = []; // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);

  if (status !== c.Z_OK) {
    throw new Error(msg[status]);
  }

  this.header = new GZheader();

  zlib_inflate.inflateGetHeader(this.strm, this.header);
}

/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;
  var dict;

  // Flag to properly process Z_BUF_ERROR on testing inflate call
  // when we check that all output data was flushed.
  var allowBufError = false;

  if (this.ended) {
    return false;
  }
  _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;

  // Convert data if needed
  if (typeof data === 'string') {
    // Only binary strings can be decompressed on practice
    strm.input = strings.binstring2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH); /* no bad return value */

    if (status === c.Z_NEED_DICT && dictionary) {
      // Convert data if needed
      if (typeof dictionary === 'string') {
        dict = strings.string2buf(dictionary);
      } else if (toString.call(dictionary) === '[object ArrayBuffer]') {
        dict = new Uint8Array(dictionary);
      } else {
        dict = dictionary;
      }

      status = zlib_inflate.inflateSetDictionary(this.strm, dict);
    }

    if (status === c.Z_BUF_ERROR && allowBufError === true) {
      status = c.Z_OK;
      allowBufError = false;
    }

    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {

        if (this.options.to === 'string') {

          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          tail = strm.next_out - next_out_utf8;
          utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) {
            utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
          }

          this.onData(utf8str);
        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    }

    // When no more input data, we should check that internal inflate buffers
    // are flushed. The only way to do it when avail_out = 0 - run one more
    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
    // Here we set flag to process this error properly.
    //
    // NOTE. Deflate does not return error in this case and does not needs such
    // logic.
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

  if (status === c.Z_STREAM_END) {
    _mode = c.Z_FINISH;
  }

  // Finalize on the last chunk.
  if (_mode === c.Z_FINISH) {
    status = zlib_inflate.inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === c.Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === c.Z_SYNC_FLUSH) {
    this.onEnd(c.Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};

/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};

/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === c.Z_OK) {
    if (this.options.to === 'string') {
      // Glue & convert here, until we teach pako to send
      // utf8 alligned strings to onData
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};

/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  var inflator = new Inflate(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) {
    throw inflator.msg;
  }

  return inflator.result;
}

/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}

/**
 * ungzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/

exports.Inflate = Inflate;
exports.inflate = inflate;
exports.inflateRaw = inflateRaw;
exports.ungzip = inflate;

},{"./utils/common":121,"./utils/strings":122,"./zlib/constants":124,"./zlib/gzheader":127,"./zlib/inflate":129,"./zlib/messages":131,"./zlib/zstream":133}],121:[function(require,module,exports){
'use strict';

var TYPED_OK = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Int32Array !== 'undefined';

exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) {
      continue;
    }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (source.hasOwnProperty(p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};

// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) {
    return buf;
  }
  if (buf.subarray) {
    return buf.subarray(0, size);
  }
  buf.length = size;
  return buf;
};

var fnTyped = {
  arraySet: function arraySet(dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function flattenChunks(chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function arraySet(dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function flattenChunks(chunks) {
    return [].concat.apply([], chunks);
  }
};

// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8 = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8 = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);

},{}],122:[function(require,module,exports){
// String encode/decode helpers
'use strict';

var utils = require('./common');

// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safary
//
var STR_APPLY_OK = true;
var STR_APPLY_UIA_OK = true;

try {
  String.fromCharCode.apply(null, [0]);
} catch (__) {
  STR_APPLY_OK = false;
}
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch (__) {
  STR_APPLY_UIA_OK = false;
}

// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new utils.Buf8(256);
for (var q = 0; q < 256; q++) {
  _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
exports.string2buf = function (str) {
  var buf,
      c,
      c2,
      m_pos,
      i,
      str_len = str.length,
      buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new utils.Buf8(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | c >>> 6;
      buf[i++] = 0x80 | c & 0x3f;
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | c >>> 12;
      buf[i++] = 0x80 | c >>> 6 & 0x3f;
      buf[i++] = 0x80 | c & 0x3f;
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | c >>> 18;
      buf[i++] = 0x80 | c >>> 12 & 0x3f;
      buf[i++] = 0x80 | c >>> 6 & 0x3f;
      buf[i++] = 0x80 | c & 0x3f;
    }
  }

  return buf;
};

// Helper (used in 2 places)
function buf2binstring(buf, len) {
  // use fallback for big arrays to avoid stack overflow
  if (len < 65537) {
    if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
    }
  }

  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}

// Convert byte array to binary string
exports.buf2binstring = function (buf) {
  return buf2binstring(buf, buf.length);
};

// Convert binary string (typed, when possible)
exports.binstring2buf = function (str) {
  var buf = new utils.Buf8(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};

// convert array to string
exports.buf2string = function (buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  var utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    c = buf[i++];
    // quick process ascii
    if (c < 0x80) {
      utf16buf[out++] = c;continue;
    }

    c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) {
      utf16buf[out++] = 0xfffd;i += c_len - 1;continue;
    }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = c << 6 | buf[i++] & 0x3f;
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) {
      utf16buf[out++] = 0xfffd;continue;
    }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | c >> 10 & 0x3ff;
      utf16buf[out++] = 0xdc00 | c & 0x3ff;
    }
  }

  return buf2binstring(utf16buf, out);
};

// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
exports.utf8border = function (buf, max) {
  var pos;

  max = max || buf.length;
  if (max > buf.length) {
    max = buf.length;
  }

  // go back from last position, until start of sequence found
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) {
    pos--;
  }

  // Fuckup - very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) {
    return max;
  }

  // If we came to start of buffer - that means vuffer is too small,
  // return max too.
  if (pos === 0) {
    return max;
  }

  return pos + _utf8len[buf[pos]] > max ? pos : max;
};

},{"./common":121}],123:[function(require,module,exports){
'use strict';

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.

function adler32(adler, buf, len, pos) {
  var s1 = adler & 0xffff | 0,
      s2 = adler >>> 16 & 0xffff | 0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = s1 + buf[pos++] | 0;
      s2 = s2 + s1 | 0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return s1 | s2 << 16 | 0;
}

module.exports = adler32;

},{}],124:[function(require,module,exports){
'use strict';

module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,

  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,

  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

},{}],125:[function(require,module,exports){
'use strict';

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.


// Use ordinary array, since untyped makes no boost here

function makeTable() {
  var c,
      table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();

function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return crc ^ -1; // >>> 0;
}

module.exports = crc32;

},{}],126:[function(require,module,exports){
'use strict';

var utils = require('../utils/common');
var trees = require('./trees');
var adler32 = require('./adler32');
var crc32 = require('./crc32');
var msg = require('./messages');

/* Public constants ==========================================================*/
/* ===========================================================================*/

/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH = 3;
var Z_FINISH = 4;
var Z_BLOCK = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK = 0;
var Z_STREAM_END = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR = -2;
var Z_DATA_ERROR = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;

var Z_FILTERED = 1;
var Z_HUFFMAN_ONLY = 2;
var Z_RLE = 3;
var Z_FIXED = 4;
var Z_DEFAULT_STRATEGY = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN = 2;

/* The deflate compression method */
var Z_DEFLATED = 8;

/*============================================================================*/

var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;

var LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS = 256;
/* number of literal bytes 0..255 */
var L_CODES = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES = 30;
/* number of distance codes */
var BL_CODES = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return (f << 1) - (f > 4 ? 9 : 0);
}

function zero(buf) {
  var len = buf.length;while (--len >= 0) {
    buf[len] = 0;
  }
}

/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) {
    return;
  }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}

function flush_block_only(s, last) {
  trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}

function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}

/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
  //  put_byte(s, (Byte)(b >> 8));
  //  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = b >>> 8 & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}

/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) {
    len = size;
  }
  if (len === 0) {
    return 0;
  }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  } else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}

/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length; /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match; /* matched string */
  var len; /* length of current match */
  var best_len = s.prev_length; /* best match length so far */
  var nice_match = s.nice_match; /* stop if match long enough */
  var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0 /*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1 = _win[scan + best_len - 1];
  var scan_end = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) {
    nice_match = s.lookahead;
  }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1 = _win[scan + best_len - 1];
      scan_end = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}

/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = m >= _w_size ? m - _w_size : 0;
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = m >= _w_size ? m - _w_size : 0;
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
      //#if MIN_MATCH != 3
      //        Call update_hash() MIN_MATCH-3 more times
      //#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */
  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
  //  if (s.high_water < s.window_size) {
  //    var curr = s.strstart + s.lookahead;
  //    var init = 0;
  //
  //    if (s.high_water < curr) {
  //      /* Previous high water mark below current data -- zero WIN_INIT
  //       * bytes or up to end of window, whichever is less.
  //       */
  //      init = s.window_size - curr;
  //      if (init > WIN_INIT)
  //        init = WIN_INIT;
  //      zmemzero(s->window + curr, (unsigned)init);
  //      s->high_water = curr + init;
  //    }
  //    else if (s->high_water < (ulg)curr + WIN_INIT) {
  //      /* High water mark at or above current data, but below current data
  //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
  //       * to end of window, whichever is less.
  //       */
  //      init = (ulg)curr + WIN_INIT - s->high_water;
  //      if (init > s->window_size - s->high_water)
  //        init = s->window_size - s->high_water;
  //      zmemzero(s->window + s->high_water, (unsigned)init);
  //      s->high_water += init;
  //    }
  //  }
  //
  //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
  //    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
      //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
      //        s.block_start >= s.w_size)) {
      //        throw  new Error("slide too late");
      //      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
    //    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head; /* head of the hash chain */
  var bflush; /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0 /*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0 /*NIL*/ && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match /*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;

        //#if MIN_MATCH != 3
        //                Call UPDATE_HASH() MIN_MATCH-3 more times
        //#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head; /* head of hash chain */
  var bflush; /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0 /*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0 /*NIL*/ && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD /*MAX_DIST(s)*/) {
        /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
        s.match_length = longest_match(s, hash_head);
        /* longest_match() sets match_start */

        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096 /*TOO_FAR*/)) {

          /* If prev_match is also MIN_MATCH, match_start is garbage
           * but we will ignore the current match anyway.
           */
          s.match_length = MIN_MATCH - 1;
        }
      }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush; /* set if current block must be flushed */
  var prev; /* byte at distance one to match */
  var scan, strend; /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush; /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break; /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
/*      good lazy nice chain */
new Config(0, 0, 0, 0, deflate_stored), /* 0 store only */
new Config(4, 4, 8, 4, deflate_fast), /* 1 max speed, no lazy matches */
new Config(4, 5, 16, 8, deflate_fast), /* 2 */
new Config(4, 6, 32, 32, deflate_fast), /* 3 */

new Config(4, 4, 16, 16, deflate_slow), /* 4 lazy matches */
new Config(8, 16, 32, 32, deflate_slow), /* 5 */
new Config(8, 16, 128, 128, deflate_slow), /* 6 */
new Config(8, 32, 128, 256, deflate_slow), /* 7 */
new Config(32, 128, 258, 1024, deflate_slow), /* 8 */
new Config(32, 258, 258, 4096, deflate_slow) /* 9 max compression */
];

/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}

function DeflateState() {
  this.strm = null; /* pointer back to this zlib stream */
  this.status = 0; /* as the name implies */
  this.pending_buf = null; /* output still pending */
  this.pending_buf_size = 0; /* size of pending_buf */
  this.pending_out = 0; /* next pending byte to output to the stream */
  this.pending = 0; /* nb of bytes in the pending buffer */
  this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null; /* gzip header information to write */
  this.gzindex = 0; /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1; /* value of flush param for previous deflate call */

  this.w_size = 0; /* LZ77 window size (32K by default) */
  this.w_bits = 0; /* log2(w_size)  (8..16) */
  this.w_mask = 0; /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null; /* Heads of the hash chains or NIL. */

  this.ins_h = 0; /* hash index of string to be inserted */
  this.hash_size = 0; /* number of elements in hash table */
  this.hash_bits = 0; /* log2(hash_size) */
  this.hash_mask = 0; /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0; /* length of best match */
  this.prev_match = 0; /* previous match */
  this.match_available = 0; /* set if previous match exists */
  this.strstart = 0; /* start of string to insert */
  this.match_start = 0; /* start of matching string */
  this.lookahead = 0; /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0; /* compression level (1..9) */
  this.strategy = 0; /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

  /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc = null; /* desc. for literal tree */
  this.d_desc = null; /* desc. for distance tree */
  this.bl_desc = null; /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1); /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0; /* number of elements in the heap */
  this.heap_max = 0; /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0; /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0; /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0; /* bit length of current block with optimal trees */
  this.static_len = 0; /* bit length of current block with static trees */
  this.matches = 0; /* number of string matches in current block */
  this.insert = 0; /* bytes at end of window left to insert */

  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}

function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = s.wrap === 2 ? 0 // crc32(0, Z_NULL, 0)
  : 1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}

function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}

function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  if (strm.state.wrap !== 2) {
    return Z_STREAM_ERROR;
  }
  strm.state.gzhead = head;
  return Z_OK;
}

function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) {
    // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) {
    /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  } else if (windowBits > 15) {
    wrap = 2; /* write gzip wrapper instead */
    windowBits -= 16;
  }

  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }

  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << memLevel + 6; /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}

function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
    return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) {
      // GZIP header
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      } else {
        put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, s.gzhead.time >> 8 & 0xff);
        put_byte(s, s.gzhead.time >> 16 & 0xff);
        put_byte(s, s.gzhead.time >> 24 & 0xff);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, s.gzhead.extra.length >> 8 & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    } else // DEFLATE header
      {
        var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
        var level_flags = -1;

        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= level_flags << 6;
        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }
        header += 31 - header % 31;

        s.status = BUSY_STATE;
        putShortMSB(s, header);

        /* Save the adler32 of the preset dictionary: */
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 0xffff);
        }
        strm.adler = 1; // adler32(0L, Z_NULL, 0);
      }
  }

  //#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra /* != Z_NULL*/) {
        beg = s.pending; /* start of bytes to update crc */

        while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              break;
            }
          }
          put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
          s.gzindex++;
        }
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (s.gzindex === s.gzhead.extra.length) {
          s.gzindex = 0;
          s.status = NAME_STATE;
        }
      } else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name /* != Z_NULL*/) {
        beg = s.pending; /* start of bytes to update crc */
        //int val;

        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          // JS specific: little magic to add zero terminator to end of string
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.gzindex = 0;
          s.status = COMMENT_STATE;
        }
      } else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment /* != Z_NULL*/) {
        beg = s.pending; /* start of bytes to update crc */
        //int val;

        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          // JS specific: little magic to add zero terminator to end of string
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.status = HCRC_STATE;
        }
      } else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, strm.adler >> 8 & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    } else {
      s.status = BUSY_STATE;
    }
  }
  //#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      } else if (flush !== Z_BLOCK) {
        /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/ /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) {
    return Z_OK;
  }
  if (s.wrap <= 0) {
    return Z_STREAM_END;
  }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, strm.adler >> 8 & 0xff);
    put_byte(s, strm.adler >> 16 & 0xff);
    put_byte(s, strm.adler >> 24 & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, strm.total_in >> 8 & 0xff);
    put_byte(s, strm.total_in >> 16 & 0xff);
    put_byte(s, strm.total_in >> 24 & 0xff);
  } else {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) {
    s.wrap = -s.wrap;
  }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm /*== Z_NULL*/ || !strm.state /*== Z_NULL*/) {
      return Z_STREAM_ERROR;
    }

  status = strm.state.status;
  if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}

/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm /*== Z_NULL*/ || !strm.state /*== Z_NULL*/) {
      return Z_STREAM_ERROR;
    }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0; /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {
      /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}

exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/

},{"../utils/common":121,"./adler32":123,"./crc32":125,"./messages":131,"./trees":132}],127:[function(require,module,exports){
'use strict';

function GZheader() {
  /* true if compressed data believed to be text */
  this.text = 0;
  /* modification time */
  this.time = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags = 0;
  /* operating system */
  this.os = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len = 0; // Actually, we don't need it in JS,
  // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done = false;
}

module.exports = GZheader;

},{}],128:[function(require,module,exports){
'use strict';

// See state defs from inflate.js

var BAD = 30; /* got a data error -- remain here until reset */
var TYPE = 12; /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in; /* local strm.input */
  var last; /* have enough input while in < last */
  var _out; /* local strm.output */
  var beg; /* inflate()'s initial strm.output */
  var end; /* while out < end, enough space available */
  //#ifdef INFLATE_STRICT
  var dmax; /* maximum distance from zlib header */
  //#endif
  var wsize; /* window size or zero if not using window */
  var whave; /* valid bytes in the window */
  var wnext; /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window; /* allocated sliding window, if wsize != 0 */
  var hold; /* local strm.hold */
  var bits; /* local strm.bits */
  var lcode; /* local strm.lencode */
  var dcode; /* local strm.distcode */
  var lmask; /* mask for first level of length codes */
  var dmask; /* mask for first level of distance codes */
  var here; /* retrieved table entry */
  var op; /* code bits, operation, extra bits, or */
  /*  window position, window bytes to copy */
  var len; /* match length, unused bytes */
  var dist; /* match distance */
  var from; /* where to copy match from */
  var from_source;

  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
  //#ifdef INFLATE_STRICT
  dmax = state.dmax;
  //#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;

  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top: do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen: for (;;) {
      // Goto emulation
      op = here >>> 24 /*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = here >>> 16 & 0xff /*here.op*/;
      if (op === 0) {
        /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff /*here.val*/;
      } else if (op & 16) {
        /* length base */
        len = here & 0xffff /*here.val*/;
        op &= 15; /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & (1 << op) - 1;
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist: for (;;) {
          // goto emulation
          op = here >>> 24 /*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = here >>> 16 & 0xff /*here.op*/;

          if (op & 16) {
            /* distance base */
            dist = here & 0xffff /*here.val*/;
            op &= 15; /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & (1 << op) - 1;
            //#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
            //#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg; /* max distance in output */
            if (dist > op) {
              /* see if copy from window */
              op = dist - op; /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

                // (!) This block is disabled in zlib defailts,
                // don't enable it for binary compatibility
                //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                //                if (len <= op - whave) {
                //                  do {
                //                    output[_out++] = 0;
                //                  } while (--len);
                //                  continue top;
                //                }
                //                len -= op - whave;
                //                do {
                //                  output[_out++] = 0;
                //                } while (--op > whave);
                //                if (op === 0) {
                //                  from = _out - dist;
                //                  do {
                //                    output[_out++] = output[from++];
                //                  } while (--len);
                //                  continue top;
                //                }
                //#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {
                /* very common case */
                from += wsize - op;
                if (op < len) {
                  /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist; /* rest from output */
                  from_source = output;
                }
              } else if (wnext < op) {
                /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {
                  /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {
                    /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist; /* rest from output */
                    from_source = output;
                  }
                }
              } else {
                /* contiguous in window */
                from += wnext - op;
                if (op < len) {
                  /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist; /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            } else {
              from = _out - dist; /* copy direct from output */
              do {
                /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          } else if ((op & 64) === 0) {
            /* 2nd level distance code */
            here = dcode[(here & 0xffff) + ( /*here.val*/hold & (1 << op) - 1)];
            continue dodist;
          } else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      } else if ((op & 64) === 0) {
        /* 2nd level length code */
        here = lcode[(here & 0xffff) + ( /*here.val*/hold & (1 << op) - 1)];
        continue dolen;
      } else if (op & 32) {
        /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      } else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
  strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  return;
};

},{}],129:[function(require,module,exports){
'use strict';

var utils = require('../utils/common');
var adler32 = require('./adler32');
var crc32 = require('./crc32');
var inflate_fast = require('./inffast');
var inflate_table = require('./inftrees');

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH = 4;
var Z_BLOCK = 5;
var Z_TREES = 6;

/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK = 0;
var Z_STREAM_END = 1;
var Z_NEED_DICT = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR = -2;
var Z_DATA_ERROR = -3;
var Z_MEM_ERROR = -4;
var Z_BUF_ERROR = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED = 8;

/* STATES ====================================================================*/
/* ===========================================================================*/

var HEAD = 1; /* i: waiting for magic header */
var FLAGS = 2; /* i: waiting for method and flags (gzip) */
var TIME = 3; /* i: waiting for modification time (gzip) */
var OS = 4; /* i: waiting for extra flags and operating system (gzip) */
var EXLEN = 5; /* i: waiting for extra length (gzip) */
var EXTRA = 6; /* i: waiting for extra bytes (gzip) */
var NAME = 7; /* i: waiting for end of file name (gzip) */
var COMMENT = 8; /* i: waiting for end of comment (gzip) */
var HCRC = 9; /* i: waiting for header crc (gzip) */
var DICTID = 10; /* i: waiting for dictionary check value */
var DICT = 11; /* waiting for inflateSetDictionary() call */
var TYPE = 12; /* i: waiting for type bits, including last-flag bit */
var TYPEDO = 13; /* i: same, but skip check to exit inflate on new block */
var STORED = 14; /* i: waiting for stored size (length and complement) */
var COPY_ = 15; /* i/o: same as COPY below, but only first time in */
var COPY = 16; /* i/o: waiting for input or output to copy stored block */
var TABLE = 17; /* i: waiting for dynamic block table lengths */
var LENLENS = 18; /* i: waiting for code length code lengths */
var CODELENS = 19; /* i: waiting for length/lit and distance code lengths */
var LEN_ = 20; /* i: same as LEN below, but only first time in */
var LEN = 21; /* i: waiting for length/lit/eob code */
var LENEXT = 22; /* i: waiting for length extra bits */
var DIST = 23; /* i: waiting for distance code */
var DISTEXT = 24; /* i: waiting for distance extra bits */
var MATCH = 25; /* o: waiting for output space to copy string */
var LIT = 26; /* o: waiting for output space to write literal */
var CHECK = 27; /* i: waiting for 32-bit check value */
var LENGTH = 28; /* i: waiting for 32-bit length (gzip) */
var DONE = 29; /* finished check, done -- remain here until reset */
var BAD = 30; /* got a data error -- remain here until reset */
var MEM = 31; /* got an inflate() memory error -- remain here until reset */
var SYNC = 32; /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/

var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;

function zswap32(q) {
  return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);
}

function InflateState() {
  this.mode = 0; /* current inflate mode */
  this.last = false; /* true if processing last block */
  this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false; /* true if dictionary provided */
  this.flags = 0; /* gzip header method and flags (0 if zlib) */
  this.dmax = 0; /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0; /* protected copy of check value */
  this.total = 0; /* protected copy of output count */
  // TODO: may be {}
  this.head = null; /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0; /* log base 2 of requested window size */
  this.wsize = 0; /* window size or zero if not using window */
  this.whave = 0; /* valid bytes in the window */
  this.wnext = 0; /* window write index */
  this.window = null; /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0; /* input bit accumulator */
  this.bits = 0; /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0; /* literal or length of data to copy */
  this.offset = 0; /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0; /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null; /* starting table for length/literal codes */
  this.distcode = null; /* starting table for distance codes */
  this.lenbits = 0; /* index bits for lencode */
  this.distbits = 0; /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0; /* number of code length code lengths */
  this.nlen = 0; /* number of length code lengths */
  this.ndist = 0; /* number of distance code lengths */
  this.have = 0; /* number of code lengths in lens[] */
  this.next = null; /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null; /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null; /* dynamic table for distance codes (JS specific) */
  this.sane = 0; /* if false, allow invalid distance too far */
  this.back = 0; /* bits back of last unprocessed length/lit */
  this.was = 0; /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {
    /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null /*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) {
    return Z_STREAM_ERROR;
  }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null /*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null /*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}

/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) {
      state.lens[sym++] = 8;
    }
    while (sym < 256) {
      state.lens[sym++] = 9;
    }
    while (sym < 280) {
      state.lens[sym++] = 7;
    }
    while (sym < 288) {
      state.lens[sym++] = 8;
    }

    inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) {
      state.lens[sym++] = 5;
    }

    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}

/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }
      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output; // input/output buffers
  var next; /* next input INDEX */
  var put; /* next output INDEX */
  var have, left; /* available input and output */
  var hold; /* bit buffer */
  var bits; /* bits in bit buffer */
  var _in, _out; /* save starting available input and output */
  var copy; /* number of stored or match bytes to copy */
  var from; /* where to copy match bytes from */
  var from_source;
  var here = 0; /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len; /* length to copy for repeats, bits to drop */
  var ret; /* return code */
  var hbuf = new utils.Buf8(4); /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
  [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) {
    state.mode = TYPEDO;
  } /* skip check */

  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.wrap & 2 && hold === 0x8b1f) {
          /* gzip header */
          state.check = 0 /*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        state.flags = 0; /* expect zlib header */
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) || /* check if zlib header allowed */
        (((hold & 0xff) << /*BITS(8)*/8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f) !== /*BITS(4)*/Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f) + /*BITS(4)*/8;
        if (state.wbits === 0) {
          state.wbits = len;
        } else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = hold >> 8 & 1;
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
      /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          hbuf[2] = hold >>> 16 & 0xff;
          hbuf[3] = hold >>> 24 & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
      /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = hold & 0xff;
          state.head.os = hold >> 8;
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
      /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        } else if (state.head) {
          state.head.extra = null /*Z_NULL*/;
        }
        state.mode = EXTRA;
      /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) {
            copy = have;
          }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more conveniend processing later
                state.head.extra = new Array(state.head.extra_len);
              }
              utils.arraySet(state.head.extra, input, next,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              copy,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              len);
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) {
            break inf_leave;
          }
        }
        state.length = 0;
        state.mode = NAME;
      /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) {
            break inf_leave;
          }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len && state.length < 65536 /*state.head.name_max*/) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) {
            break inf_leave;
          }
        } else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
      /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) {
            break inf_leave;
          }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len && state.length < 65536 /*state.head.comm_max*/) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) {
            break inf_leave;
          }
        } else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
      /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = state.flags >> 9 & 1;
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
      /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
      /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) {
          break inf_leave;
        }
      /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = hold & 0x01 /*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch (hold & 0x03) {/*BITS(2)*/case 0:
            /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:
            /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_; /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:
            /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== (hold >>> 16 ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) {
          break inf_leave;
        }
      /* falls through */
      case COPY_:
        state.mode = COPY;
      /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) {
            copy = have;
          }
          if (copy > left) {
            copy = left;
          }
          if (copy === 0) {
            break inf_leave;
          }
          //--- zmemcpy(put, next, copy); ---
          utils.arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f) + /*BITS(5)*/257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f) + /*BITS(5)*/1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f) + /*BITS(4)*/4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        //#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
        //#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
      /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = hold & 0x07; //BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
      /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;

            if (here_bits <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          } else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03); //BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            } else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07); //BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            } else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f); //BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) {
          break;
        }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) {
          break inf_leave;
        }
      /* falls through */
      case LEN_:
        state.mode = LEN;
      /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inflate_fast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = here >>> 16 & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) {
            break;
          }
          //--- PULLBYTE() ---//
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> /*BITS(last.bits + last.op)*/last_bits)];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;

            if (last_bits + here_bits <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
      /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & (1 << state.extra) - 1 /*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
      /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & (1 << state.distbits) - 1]; /*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = here >>> 16 & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) {
            break;
          }
          //--- PULLBYTE() ---//
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> /*BITS(last.bits + last.op)*/last_bits)];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;

            if (last_bits + here_bits <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = here_op & 15;
        state.mode = DISTEXT;
      /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & (1 << state.extra) - 1 /*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
        //#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
      /* falls through */
      case MATCH:
        if (left === 0) {
          break inf_leave;
        }
        copy = _out - left;
        if (state.offset > copy) {
          /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
            // (!) This block is disabled in zlib defailts,
            // don't enable it for binary compatibility
            //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
            //          Trace((stderr, "inflate.c too far\n"));
            //          copy -= state.whave;
            //          if (copy > state.length) { copy = state.length; }
            //          if (copy > left) { copy = left; }
            //          left -= copy;
            //          state.length -= copy;
            //          do {
            //            output[put++] = 0;
            //          } while (--copy);
            //          if (state.length === 0) { state.mode = LEN; }
            //          break;
            //#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          } else {
            from = state.wnext - copy;
          }
          if (copy > state.length) {
            copy = state.length;
          }
          from_source = state.window;
        } else {
          /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) {
          copy = left;
        }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) {
          state.mode = LEN;
        }
        break;
      case LIT:
        if (left === 0) {
          break inf_leave;
        }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            // Use '|' insdead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out) {
            strm.adler = state.check =
            /*UPDATE(state.check, put - _out, _out);*/
            state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
      /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
      /* falls through */
      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
      /* falls through */
      default:
        return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
      return Z_STREAM_ERROR;
    }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  state = strm.state;
  if ((state.wrap & 2) === 0) {
    return Z_STREAM_ERROR;
  }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) {
      return Z_STREAM_ERROR;
    }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/

},{"../utils/common":121,"./adler32":123,"./crc32":125,"./inffast":128,"./inftrees":130}],130:[function(require,module,exports){
'use strict';

var utils = require('../utils/common');

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [/* Length codes 257..285 base */
3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];

var lext = [/* Length codes 257..285 extra */
16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78];

var dbase = [/* Distance codes 0..29 base */
1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];

var dext = [/* Distance codes 0..29 extra */
16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
  var bits = opts.bits;
  //here = opts.here; /* table entry for duplication */

  var len = 0; /* a code's length in bits */
  var sym = 0; /* index of code symbols */
  var min = 0,
      max = 0; /* minimum and maximum code lengths */
  var root = 0; /* number of index bits for root table */
  var curr = 0; /* number of index bits for current table */
  var drop = 0; /* code bits to drop for sub-table */
  var left = 0; /* number of prefix codes available */
  var used = 0; /* code entries in table used */
  var huff = 0; /* Huffman code */
  var incr; /* for incrementing code, index */
  var fill; /* index for replicating entries */
  var low; /* low bits for current root entry */
  var mask; /* mask for low root bits */
  var next; /* next available space in table */
  var base = null; /* base value table to use */
  var base_index = 0;
  //  var shoextra;    /* extra bits table to use */
  var end; /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.
    This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.
    The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.
    The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break;
    }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {
    /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0;

    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0;

    opts.bits = 1;
    return 0; /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break;
    }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    } /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1; /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.
    root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.
    When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.
    used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.
    sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work; /* dummy value--not used */
    end = 19;
  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;
  } else {
    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0; /* starting code */
  sym = 0; /* starting code symbol */
  len = min; /* starting code length */
  next = table_index; /* current table to fill in */
  curr = root; /* current table index bits */
  drop = 0; /* current bits to drop from code for index */
  low = -1; /* trigger new sub-table when len > root */
  used = 1 << root; /* use root table entries */
  mask = used - 1; /* mask for comparing low */

  /* check available table space */
  if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
    return 1;
  }

  var i = 0;
  /* process all codes and make table entries */
  for (;;) {
    i++;
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    } else {
      here_op = 32 + 64; /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << len - drop;
    fill = 1 << curr;
    min = fill; /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << len - 1;
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) {
        break;
      }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min; /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) {
          break;
        }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = root << 24 | curr << 16 | next - table_index | 0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = len - drop << 24 | 64 << 16 | 0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};

},{"../utils/common":121}],131:[function(require,module,exports){
'use strict';

module.exports = {
  2: 'need dictionary', /* Z_NEED_DICT       2  */
  1: 'stream end', /* Z_STREAM_END      1  */
  0: '', /* Z_OK              0  */
  '-1': 'file error', /* Z_ERRNO         (-1) */
  '-2': 'stream error', /* Z_STREAM_ERROR  (-2) */
  '-3': 'data error', /* Z_DATA_ERROR    (-3) */
  '-4': 'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5': 'buffer error', /* Z_BUF_ERROR     (-5) */
  '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */
};

},{}],132:[function(require,module,exports){
'use strict';

var utils = require('../utils/common');

/* Public constants ==========================================================*/
/* ===========================================================================*/

//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY = 0;
var Z_TEXT = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN = 2;

/*============================================================================*/

function zero(buf) {
  var len = buf.length;while (--len >= 0) {
    buf[len] = 0;
  }
}

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
/* The three kinds of block type */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS = 256;
/* number of literal bytes 0..255 */

var L_CODES = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES = 30;
/* number of distance codes */

var BL_CODES = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size = 16;
/* size of bit buffer in bi_buf */

/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK = 256;
/* end of block literal code */

var REP_3_6 = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10 = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits = /* extra bits for each length code */
[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

var extra_dbits = /* extra bits for each distance code */
[0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

var extra_blbits = /* extra bits for each bit length code */
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];

var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
var static_ltree = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */

function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree = static_tree; /* static tree or NULL */
  this.extra_bits = extra_bits; /* extra bits for each code or NULL */
  this.extra_base = extra_base; /* base index for extra_bits */
  this.elems = elems; /* max number of elements in the tree */
  this.max_length = max_length; /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree = static_tree && static_tree.length;
}

var static_l_desc;
var static_d_desc;
var static_bl_desc;

function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree; /* the dynamic tree */
  this.max_code = 0; /* largest code with non zero frequency */
  this.stat_desc = stat_desc; /* the corresponding static tree */
}

function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}

/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
  //    put_byte(s, (uch)((w) & 0xff));
  //    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = w & 0xff;
  s.pending_buf[s.pending++] = w >>> 8 & 0xff;
}

/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > Buf_size - length) {
    s.bi_buf |= value << s.bi_valid & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> Buf_size - s.bi_valid;
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= value << s.bi_valid & 0xffff;
    s.bi_valid += length;
  }
}

function send_code(s, c, tree) {
  send_bits(s, tree[c * 2] /*.Code*/, tree[c * 2 + 1] /*.Len*/);
}

/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}

/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;
  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}

/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree = desc.dyn_tree;
  var max_code = desc.max_code;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var extra = desc.stat_desc.extra_bits;
  var base = desc.stat_desc.extra_base;
  var max_length = desc.stat_desc.max_length;
  var h; /* heap index */
  var n, m; /* iterate over the tree elements */
  var bits; /* bit length */
  var xbits; /* extra bits */
  var f; /* frequency */
  var overflow = 0; /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1] /*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1] /*.Dad*/ * 2 + 1] /*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1] /*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) {
      continue;
    } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2] /*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1] /*.Len*/ + xbits);
    }
  }
  if (overflow === 0) {
    return;
  }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) {
      bits--;
    }
    s.bl_count[bits]--; /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) {
        continue;
      }
      if (tree[m * 2 + 1] /*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1] /*.Len*/) * tree[m * 2] /*.Freq*/;
        tree[m * 2 + 1] /*.Len*/ = bits;
      }
      n--;
    }
  }
}

/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  var code = 0; /* running code value */
  var bits; /* bit index */
  var n; /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = code + bl_count[bits - 1] << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0; n <= max_code; n++) {
    var len = tree[n * 2 + 1] /*.Len*/;
    if (len === 0) {
      continue;
    }
    /* Now reverse the bits */
    tree[n * 2] /*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}

/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n; /* iterates over tree elements */
  var bits; /* bit counter */
  var length; /* length value */
  var code; /* code value */
  var dist; /* distance index */
  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
  /*#ifdef NO_INIT_GLOBAL_POINTERS
    static_l_desc.static_tree = static_ltree;
    static_l_desc.extra_bits = extra_lbits;
    static_d_desc.static_tree = static_dtree;
    static_d_desc.extra_bits = extra_dbits;
    static_bl_desc.extra_bits = extra_blbits;
  #endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < 1 << extra_lbits[code]; n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < 1 << extra_dbits[code]; n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1] /*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1] /*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1] /*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1] /*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1] /*.Len*/ = 5;
    static_dtree[n * 2] /*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}

/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES; n++) {
    s.dyn_ltree[n * 2] /*.Freq*/ = 0;
  }
  for (n = 0; n < D_CODES; n++) {
    s.dyn_dtree[n * 2] /*.Freq*/ = 0;
  }
  for (n = 0; n < BL_CODES; n++) {
    s.bl_tree[n * 2] /*.Freq*/ = 0;
  }

  s.dyn_ltree[END_BLOCK * 2] /*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}

/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s) {
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s); /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
  //  while (len--) {
  //    put_byte(s, *buf++);
  //  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return tree[_n2] /*.Freq*/ < tree[_m2] /*.Freq*/ || tree[_n2] /*.Freq*/ === tree[_m2] /*.Freq*/ && depth[n] <= depth[m];
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1; /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) {
      break;
    }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}

// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist; /* distance of matched string */
  var lc; /* match length or unmatched char (if dist == 0) */
  var lx = 0; /* running index in l_buf */
  var code; /* the code to send */
  var extra; /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra); /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree); /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra); /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");
    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}

/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree = desc.dyn_tree;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems = desc.stat_desc.elems;
  var n, m; /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node; /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2] /*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;
    } else {
      tree[n * 2 + 1] /*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
    tree[node * 2] /*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1] /*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = s.heap_len >> 1 /*int /2*/; n >= 1; n--) {
    pqdownheap(s, tree, n);
  }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems; /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1 /*SMALLEST*/];
    s.heap[1 /*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1 /*SMALLEST*/);
    /***/

    m = s.heap[1 /*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2] /*.Freq*/ = tree[n * 2] /*.Freq*/ + tree[m * 2] /*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1] /*.Dad*/ = tree[m * 2 + 1] /*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1 /*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1 /*SMALLEST*/);
  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1 /*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}

/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n; /* iterates over all tree elements */
  var prevlen = -1; /* last emitted length */
  var curlen; /* length of current code */

  var nextlen = tree[0 * 2 + 1] /*.Len*/; /* length of next code */

  var count = 0; /* repeat count of the current code */
  var max_count = 7; /* max repeat count */
  var min_count = 4; /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1] /*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1] /*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      s.bl_tree[curlen * 2] /*.Freq*/ += count;
    } else if (curlen !== 0) {

      if (curlen !== prevlen) {
        s.bl_tree[curlen * 2] /*.Freq*/++;
      }
      s.bl_tree[REP_3_6 * 2] /*.Freq*/++;
    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2] /*.Freq*/++;
    } else {
      s.bl_tree[REPZ_11_138 * 2] /*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}

/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n; /* iterates over all tree elements */
  var prevlen = -1; /* last emitted length */
  var curlen; /* length of current code */

  var nextlen = tree[0 * 2 + 1] /*.Len*/; /* length of next code */

  var count = 0; /* repeat count of the current code */
  var max_count = 7; /* max repeat count */
  var min_count = 4; /* min repeat count */

  /* tree[max_code+1].Len = -1; */ /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1] /*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      do {
        send_code(s, curlen, s.bl_tree);
      } while (--count !== 0);
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);
    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);
    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}

/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex; /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1] /*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}

/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank; /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1, 5);
  send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1] /*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}

/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if (black_mask & 1 && s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2] /*.Freq*/ !== 0 || s.dyn_ltree[10 * 2] /*.Freq*/ !== 0 || s.dyn_ltree[13 * 2] /*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}

var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s) {

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}

/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3); /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}

/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}

/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb; /* opt_len and static_len in bytes */
  var max_blindex = 0; /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = s.opt_len + 3 + 7 >>> 3;
    static_lenb = s.static_len + 3 + 7 >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) {
      opt_lenb = static_lenb;
    }
  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if (stored_len + 4 <= opt_lenb && buf !== -1) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);
  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);
  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2] /*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--; /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2] /*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2] /*.Freq*/++;
  }

  // (!) This block is disabled in zlib defailts,
  // don't enable it for binary compatibility

  //#ifdef TRUNCATE_BLOCK
  //  /* Try to guess if it is profitable to stop the current block here */
  //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
  //    /* Compute an upper bound for the compressed length */
  //    out_length = s.last_lit*8;
  //    in_length = s.strstart - s.block_start;
  //
  //    for (dcode = 0; dcode < D_CODES; dcode++) {
  //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
  //    }
  //    out_length >>>= 3;
  //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
  //    //       s->last_lit, in_length, out_length,
  //    //       100L - out_length*100L/in_length));
  //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
  //      return true;
  //    }
  //  }
  //#endif

  return s.last_lit === s.lit_bufsize - 1;
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;

},{"../utils/common":121}],133:[function(require,module,exports){
'use strict';

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = '' /*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2 /*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;

},{}],134:[function(require,module,exports){
'use strict';

var TIFFDecoder = require('./tiffDecoder');

module.exports = function decodeTIFF(data, options) {
    var decoder = new TIFFDecoder(data, options);
    return decoder.decode(options);
};

},{"./tiffDecoder":141}],135:[function(require,module,exports){
'use strict';

var tags = {
    standard: require('./tags/standard'),
    exif: require('./tags/exif'),
    gps: require('./tags/gps')
};

class IFD {
    constructor(kind) {
        if (!kind) {
            throw new Error('missing kind');
        }
        this.data = null;
        this.fields = new Map();
        this.kind = kind;
        this._map = null;
    }

    get(tag) {
        if (typeof tag === 'number') {
            return this.fields.get(tag);
        } else if (typeof tag === 'string') {
            return this.fields.get(tags[this.kind].tagsByName[tag]);
        }
    }

    get map() {
        if (!this._map) {
            this._map = {};
            var taglist = tags[this.kind].tagsById;
            for (var key of this.fields.keys()) {
                if (taglist[key]) {
                    this._map[taglist[key]] = this.fields.get(key);
                }
            }
        }
        return this._map;
    }
}

module.exports = IFD;

},{"./tags/exif":138,"./tags/gps":139,"./tags/standard":140}],136:[function(require,module,exports){
'use strict';

var types = new Map([[1, [1, readByte]], // BYTE
[2, [1, readASCII]], // ASCII
[3, [2, readShort]], // SHORT
[4, [4, readLong]], // LONG
[5, [8, readRational]], // RATIONAL
[6, [1, readSByte]], // SBYTE
[7, [1, readByte]], // UNDEFINED
[8, [2, readSShort]], // SSHORT
[9, [4, readSLong]], // SLONG
[10, [8, readSRational]], // SRATIONAL
[11, [4, readFloat]], // FLOAT
[12, [8, readDouble]] // DOUBLE
]);

exports.getByteLength = function (type, count) {
    return types.get(type)[0] * count;
};

exports.readData = function (decoder, type, count) {
    return types.get(type)[1](decoder, count);
};

function readByte(decoder, count) {
    if (count === 1) return decoder.readUint8();
    var array = new Uint8Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readUint8();
    }
    return array;
}

function readASCII(decoder, count) {
    var strings = [];
    var currentString = '';
    for (var i = 0; i < count; i++) {
        var char = String.fromCharCode(decoder.readUint8());
        if (char === '\0') {
            strings.push(currentString);
            currentString = '';
        } else {
            currentString += char;
        }
    }
    if (strings.length === 1) {
        return strings[0];
    } else {
        return strings;
    }
}

function readShort(decoder, count) {
    if (count === 1) return decoder.readUint16();
    var array = new Uint16Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readUint16();
    }
    return array;
}

function readLong(decoder, count) {
    if (count === 1) return decoder.readUint32();
    var array = new Uint32Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readUint32();
    }
    return array;
}

function readRational(decoder, count) {
    if (count === 1) {
        return decoder.readUint32() / decoder.readUint32();
    }
    var rationals = new Array(count);
    for (var i = 0; i < count; i++) {
        rationals[i] = decoder.readUint32() / decoder.readUint32();
    }
    return rationals;
}

function readSByte(decoder, count) {
    if (count === 1) return decoder.readInt8();
    var array = new Int8Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readInt8();
    }
    return array;
}

function readSShort(decoder, count) {
    if (count === 1) return decoder.readInt16();
    var array = new Int16Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readInt16();
    }
    return array;
}

function readSLong(decoder, count) {
    if (count === 1) return decoder.readInt32();
    var array = new Int32Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readInt32();
    }
    return array;
}

function readSRational(decoder, count) {
    if (count === 1) {
        return decoder.readInt32() / decoder.readInt32();
    }
    var rationals = new Array(count);
    for (var i = 0; i < count; i++) {
        rationals[i] = decoder.readInt32() / decoder.readInt32();
    }
    return rationals;
}

function readFloat(decoder, count) {
    if (count === 1) return decoder.readFloat32();
    var array = new Float32Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readFloat32();
    }
    return array;
}

function readDouble(decoder, count) {
    if (count === 1) return decoder.readFloat64();
    var array = new Float64Array(count);
    for (var i = 0; i < count; i++) {
        array[i] = decoder.readFloat64();
    }
    return array;
}

},{}],137:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./decode":134,"dup":37}],138:[function(require,module,exports){
'use strict';

var tagsById = {
    0x829A: 'ExposureTime',
    0x829D: 'FNumber',
    0x8822: 'ExposureProgram',
    0x8824: 'SpectralSensitivity',
    0x8827: 'ISOSpeedRatings',
    0x8828: 'OECF',
    0x8830: 'SensitivityType',
    0x8831: 'StandardOutputSensitivity',
    0x8832: 'RecommendedExposureIndex',
    0x8833: 'ISOSpeed',
    0x8834: 'ISOSpeedLatitudeyyy',
    0x8835: 'ISOSpeedLatitudezzz',
    0x9000: 'ExifVersion',
    0x9003: 'DateTimeOriginal',
    0x9004: 'DateTimeDigitized',
    0x9101: 'ComponentsConfiguration',
    0x9102: 'CompressedBitsPerPixel',
    0x9201: 'ShutterSpeedValue',
    0x9202: 'ApertureValue',
    0x9203: 'BrightnessValue',
    0x9204: 'ExposureBiasValue',
    0x9205: 'MaxApertureValue',
    0x9206: 'SubjectDistance',
    0x9207: 'MeteringMode',
    0x9208: 'LightSource',
    0x9209: 'Flash',
    0x920A: 'FocalLength',
    0x9214: 'SubjectArea',
    0x927C: 'MakerNote',
    0x9286: 'UserComment',
    0x9290: 'SubsecTime',
    0x9291: 'SubsecTimeOriginal',
    0x9292: 'SubsecTimeDigitized',
    0xA000: 'FlashpixVersion',
    0xA001: 'ColorSpace',
    0xA002: 'PixelXDimension',
    0xA003: 'PixelYDimension',
    0xA004: 'RelatedSoundFile',
    0xA20B: 'FlashEnergy',
    0xA20C: 'SpatialFrequencyResponse',
    0xA20E: 'FocalPlaneXResolution',
    0xA20F: 'FocalPlaneYResolution',
    0xA210: 'FocalPlaneResolutionUnit',
    0xA214: 'SubjectLocation',
    0xA215: 'ExposureIndex',
    0xA217: 'SensingMethod',
    0xA300: 'FileSource',
    0xA301: 'SceneType',
    0xA302: 'CFAPattern',
    0xA401: 'CustomRendered',
    0xA402: 'ExposureMode',
    0xA403: 'WhiteBalance',
    0xA404: 'DigitalZoomRatio',
    0xA405: 'FocalLengthIn35mmFilm',
    0xA406: 'SceneCaptureType',
    0xA407: 'GainControl',
    0xA408: 'Contrast',
    0xA409: 'Saturation',
    0xA40A: 'Sharpness',
    0xA40B: 'DeviceSettingDescription',
    0xA40C: 'SubjectDistanceRange',
    0xA420: 'ImageUniqueID',
    0xA430: 'CameraOwnerName',
    0xA431: 'BodySerialNumber',
    0xA432: 'LensSpecification',
    0xA433: 'LensMake',
    0xA434: 'LensModel',
    0xA435: 'LensSerialNumber',
    0xA500: 'Gamma'
};

var tagsByName = {};
for (var i in tagsById) {
    tagsByName[tagsById[i]] = i;
}

module.exports = {
    tagsById: tagsById,
    tagsByName: tagsByName
};

},{}],139:[function(require,module,exports){
'use strict';

var tagsById = {
    0x0000: 'GPSVersionID',
    0x0001: 'GPSLatitudeRef',
    0x0002: 'GPSLatitude',
    0x0003: 'GPSLongitudeRef',
    0x0004: 'GPSLongitude',
    0x0005: 'GPSAltitudeRef',
    0x0006: 'GPSAltitude',
    0x0007: 'GPSTimeStamp',
    0x0008: 'GPSSatellites',
    0x0009: 'GPSStatus',
    0x000A: 'GPSMeasureMode',
    0x000B: 'GPSDOP',
    0x000C: 'GPSSpeedRef',
    0x000D: 'GPSSpeed',
    0x000E: 'GPSTrackRef',
    0x000F: 'GPSTrack',
    0x0010: 'GPSImgDirectionRef',
    0x0011: 'GPSImgDirection',
    0x0012: 'GPSMapDatum',
    0x0013: 'GPSDestLatitudeRef',
    0x0014: 'GPSDestLatitude',
    0x0015: 'GPSDestLongitudeRef',
    0x0016: 'GPSDestLongitude',
    0x0017: 'GPSDestBearingRef',
    0x0018: 'GPSDestBearing',
    0x0019: 'GPSDestDistanceRef',
    0x001A: 'GPSDestDistance',
    0x001B: 'GPSProcessingMethod',
    0x001C: 'GPSAreaInformation',
    0x001D: 'GPSDateStamp',
    0x001E: 'GPSDifferential',
    0x001F: 'GPSHPositioningError'
};

var tagsByName = {};
for (var i in tagsById) {
    tagsByName[tagsById[i]] = i;
}

module.exports = {
    tagsById: tagsById,
    tagsByName: tagsByName
};

},{}],140:[function(require,module,exports){
'use strict';

var tagsById = {
    // Baseline tags
    0x00FE: 'NewSubfileType',
    0x00FF: 'SubfileType',
    0x0100: 'ImageWidth',
    0x0101: 'ImageLength',
    0x0102: 'BitsPerSample',
    0x0103: 'Compression',
    0x0106: 'PhotometricInterpretation',
    0x0107: 'Threshholding',
    0x0108: 'CellWidth',
    0x0109: 'CellLength',
    0x010A: 'FillOrder',
    0x010E: 'ImageDescription',
    0x010F: 'Make',
    0x0110: 'Model',
    0x0111: 'StripOffsets',
    0x0112: 'Orientation',
    0x0115: 'SamplesPerPixel',
    0x0116: 'RowsPerStrip',
    0x0117: 'StripByteCounts',
    0x0118: 'MinSampleValue',
    0x0119: 'MaxSampleValue',
    0x011A: 'XResolution',
    0x011B: 'YResolution',
    0x011C: 'PlanarConfiguration',
    0x0120: 'FreeOffsets',
    0x0121: 'FreeByteCounts',
    0x0122: 'GrayResponseUnit',
    0x0123: 'GrayResponseCurve',
    0x0128: 'ResolutionUnit',
    0x0131: 'Software',
    0x0132: 'DateTime',
    0x013B: 'Artist',
    0x013C: 'HostComputer',
    0x0140: 'ColorMap',
    0x0152: 'ExtraSamples',
    0x8298: 'Copyright',

    // Extension tags
    0x010D: 'DocumentName',
    0x011D: 'PageName',
    0x011E: 'XPosition',
    0x011F: 'YPosition',
    0x0124: 'T4Options',
    0x0125: 'T6Options',
    0x0129: 'PageNumber',
    0x012D: 'TransferFunction',
    0x013D: 'Predictor',
    0x013E: 'WhitePoint',
    0x013F: 'PrimaryChromaticities',
    0x0141: 'HalftoneHints',
    0x0142: 'TileWidth',
    0x0143: 'TileLength',
    0x0144: 'TileOffsets',
    0x0145: 'TileByteCounts',
    0x0146: 'BadFaxLines',
    0x0147: 'CleanFaxData',
    0x0148: 'ConsecutiveBadFaxLines',
    0x014A: 'SubIFDs',
    0x014C: 'InkSet',
    0x014D: 'InkNames',
    0x014E: 'NumberOfInks',
    0x0150: 'DotRange',
    0x0151: 'TargetPrinter',
    0x0153: 'SampleFormat',
    0x0154: 'SMinSampleValue',
    0x0155: 'SMaxSampleValue',
    0x0156: 'TransferRange',
    0x0157: 'ClipPath',
    0x0158: 'XClipPathUnits',
    0x0159: 'YClipPathUnits',
    0x015A: 'Indexed',
    0x015B: 'JPEGTables',
    0x015F: 'OPIProxy',
    0x0190: 'GlobalParametersIFD',
    0x0191: 'ProfileType',
    0x0192: 'FaxProfile',
    0x0193: 'CodingMethods',
    0x0194: 'VersionYear',
    0x0195: 'ModeNumber',
    0x01B1: 'Decode',
    0x01B2: 'DefaultImageColor',
    0x0200: 'JPEGProc',
    0x0201: 'JPEGInterchangeFormat',
    0x0202: 'JPEGInterchangeFormatLength',
    0x0203: 'JPEGRestartInterval',
    0x0205: 'JPEGLosslessPredictors',
    0x0206: 'JPEGPointTransforms',
    0x0207: 'JPEGQTables',
    0x0208: 'JPEGDCTables',
    0x0209: 'JPEGACTables',
    0x0211: 'YCbCrCoefficients',
    0x0212: 'YCbCrSubSampling',
    0x0213: 'YCbCrPositioning',
    0x0214: 'ReferenceBlackWhite',
    0x022F: 'StripRowCounts',
    0x02BC: 'XMP',
    0x800D: 'ImageID',
    0x87AC: 'ImageLayer',

    // Private tags
    0x80A4: 'WangAnnotatio',
    0x82A5: 'MDFileTag',
    0x82A6: 'MDScalePixel',
    0x82A7: 'MDColorTable',
    0x82A8: 'MDLabName',
    0x82A9: 'MDSampleInfo',
    0x82AA: 'MDPrepDate',
    0x82AB: 'MDPrepTime',
    0x82AC: 'MDFileUnits',
    0x830E: 'ModelPixelScaleTag',
    0x83BB: 'IPTC',
    0x847E: 'INGRPacketDataTag',
    0x847F: 'INGRFlagRegisters',
    0x8480: 'IrasBTransformationMatrix',
    0x8482: 'ModelTiepointTag',
    0x85D8: 'ModelTransformationTag',
    0x8649: 'Photoshop',
    0x8769: 'ExifIFD',
    0x8773: 'ICCProfile',
    0x87AF: 'GeoKeyDirectoryTag',
    0x87B0: 'GeoDoubleParamsTag',
    0x87B1: 'GeoAsciiParamsTag',
    0x8825: 'GPSIFD',
    0x885C: 'HylaFAXFaxRecvParams',
    0x885D: 'HylaFAXFaxSubAddress',
    0x885E: 'HylaFAXFaxRecvTime',
    0x935C: 'ImageSourceData',
    0xA005: 'InteroperabilityIFD',
    0xA480: 'GDAL_METADATA',
    0xA481: 'GDAL_NODATA',
    0xC427: 'OceScanjobDescription',
    0xC428: 'OceApplicationSelector',
    0xC429: 'OceIdentificationNumber',
    0xC42A: 'OceImageLogicCharacteristics',
    0xC612: 'DNGVersion',
    0xC613: 'DNGBackwardVersion',
    0xC614: 'UniqueCameraModel',
    0xC615: 'LocalizedCameraModel',
    0xC616: 'CFAPlaneColor',
    0xC617: 'CFALayout',
    0xC618: 'LinearizationTable',
    0xC619: 'BlackLevelRepeatDim',
    0xC61A: 'BlackLevel',
    0xC61B: 'BlackLevelDeltaH',
    0xC61C: 'BlackLevelDeltaV',
    0xC61D: 'WhiteLevel',
    0xC61E: 'DefaultScale',
    0xC61F: 'DefaultCropOrigin',
    0xC620: 'DefaultCropSize',
    0xC621: 'ColorMatrix1',
    0xC622: 'ColorMatrix2',
    0xC623: 'CameraCalibration1',
    0xC624: 'CameraCalibration2',
    0xC625: 'ReductionMatrix1',
    0xC626: 'ReductionMatrix2',
    0xC627: 'AnalogBalance',
    0xC628: 'AsShotNeutral',
    0xC629: 'AsShotWhiteXY',
    0xC62A: 'BaselineExposure',
    0xC62B: 'BaselineNoise',
    0xC62C: 'BaselineSharpness',
    0xC62D: 'BayerGreenSplit',
    0xC62E: 'LinearResponseLimit',
    0xC62F: 'CameraSerialNumber',
    0xC630: 'LensInfo',
    0xC631: 'ChromaBlurRadius',
    0xC632: 'AntiAliasStrength',
    0xC634: 'DNGPrivateData',
    0xC635: 'MakerNoteSafety',
    0xC65A: 'CalibrationIlluminant1',
    0xC65B: 'CalibrationIlluminant2',
    0xC65C: 'BestQualityScale',
    0xC660: 'AliasLayerMetadata'
};

var tagsByName = {};
for (var i in tagsById) {
    tagsByName[tagsById[i]] = i;
}

module.exports = {
    tagsById: tagsById,
    tagsByName: tagsByName
};

},{}],141:[function(require,module,exports){
'use strict';

var IOBuffer = require('iobuffer');
var IFD = require('./ifd');
var TiffIFD = require('./tiffIfd');
var IFDValue = require('./ifdValue');

var defaultOptions = {
    ignoreImageData: false,
    onlyFirst: false
};

class TIFFDecoder extends IOBuffer {
    constructor(data, options) {
        super(data, options);
        this._nextIFD = 0;
    }

    decode(options) {
        options = Object.assign({}, defaultOptions, options);
        var result = [];
        this.decodeHeader();
        while (this._nextIFD) {
            result.push(this.decodeIFD(options));
            if (options.onlyFirst) {
                return result[0];
            }
        }
        return result;
    }

    decodeHeader() {
        // Byte offset
        var value = this.readUint16();
        if (value === 0x4949) {
            this.setLittleEndian();
        } else if (value === 0x4D4D) {
            this.setBigEndian();
        } else {
            throw new Error('invalid byte order: 0x' + value.toString(16));
        }

        // Magic number
        value = this.readUint16();
        if (value !== 42) {
            throw new Error('not a TIFF file');
        }

        // Offset of the first IFD
        this._nextIFD = this.readUint32();
    }

    decodeIFD(options) {
        this.seek(this._nextIFD);

        var ifd;
        if (!options.kind) {
            ifd = new TiffIFD();
        } else {
            ifd = new IFD(options.kind);
        }

        var numEntries = this.readUint16();
        for (var i = 0; i < numEntries; i++) {
            this.decodeIFDEntry(ifd);
        }
        if (!options.ignoreImageData) {
            this.decodeImageData(ifd);
        }
        this._nextIFD = this.readUint32();
        return ifd;
    }

    decodeIFDEntry(ifd) {
        var offset = this.offset;
        var tag = this.readUint16();
        var type = this.readUint16();
        var numValues = this.readUint32();

        if (type < 1 || type > 12) {
            this.skip(4); // unknown type, skip this value
            return;
        }

        var valueByteLength = IFDValue.getByteLength(type, numValues);
        if (valueByteLength > 4) {
            this.seek(this.readUint32());
        }

        var value = IFDValue.readData(this, type, numValues);
        ifd.fields.set(tag, value);

        // Read sub-IFDs
        if (tag === 0x8769 || tag === 0x8825) {
            var currentOffset = this.offset;
            var kind = void 0;
            if (tag === 0x8769) {
                kind = 'exif';
            } else if (tag === 0x8825) {
                kind = 'gps';
            }
            this._nextIFD = value;
            ifd[kind] = this.decodeIFD({
                kind: kind,
                ignoreImageData: true
            });
            this.offset = currentOffset;
        }

        // go to the next entry
        this.seek(offset);
        this.skip(12);
    }

    decodeImageData(ifd) {
        var orientation = ifd.orientation;
        if (orientation && orientation !== 1) {
            unsupported('orientation', orientation);
        }
        switch (ifd.type) {
            case 1:
                // BlackIsZero
                this.decodeBilevelOrGrey(ifd);
                break;
            default:
                unsupported('image type', ifd.type);
                break;
        }
    }

    decodeBilevelOrGrey(ifd) {
        var width = ifd.width;
        var height = ifd.height;

        var bitDepth = ifd.bitsPerSample;
        var sampleFormat = ifd.sampleFormat;
        var size = width * height;
        var data = getDataArray(size, 1, bitDepth, sampleFormat);

        var compression = ifd.compression;
        var rowsPerStrip = ifd.rowsPerStrip;
        var maxPixels = rowsPerStrip * width;
        var stripOffsets = ifd.stripOffsets;
        var stripByteCounts = ifd.stripByteCounts;

        var pixel = 0;
        for (var i = 0; i < stripOffsets.length; i++) {
            var stripData = this.getStripData(compression, stripOffsets[i], stripByteCounts[i]);
            // Last strip can be smaller
            var length = size > maxPixels ? maxPixels : size;
            size -= length;
            if (bitDepth === 8) {
                pixel = fill8bit(data, stripData, pixel, length);
            } else if (bitDepth === 16) {
                pixel = fill16bit(data, stripData, pixel, length, this.isLittleEndian());
            } else if (bitDepth === 32 && sampleFormat === 3) {
                pixel = fillFloat32(data, stripData, pixel, length, this.isLittleEndian());
            } else {
                unsupported('bitDepth', bitDepth);
            }
        }

        ifd.data = data;
    }

    getStripData(compression, offset, byteCounts) {
        switch (compression) {
            case 1:
                // No compression
                return new DataView(this.buffer, offset, byteCounts);
                break;
            case 2: // CCITT Group 3 1-Dimensional Modified Huffman run length encoding
            case 32773:
                // PackBits compression
                unsupported('Compression', compression);
                break;
            default:
                throw new Error('invalid compression: ' + compression);
        }
    }
}

module.exports = TIFFDecoder;

function getDataArray(size, channels, bitDepth, sampleFormat) {
    if (bitDepth === 8) {
        return new Uint8Array(size * channels);
    } else if (bitDepth === 16) {
        return new Uint16Array(size * channels);
    } else if (bitDepth === 32 && sampleFormat === 3) {
        return new Float32Array(size * channels);
    } else {
        unsupported('bit depth / sample format', bitDepth + ' / ' + sampleFormat);
    }
}

function fill8bit(dataTo, dataFrom, index, length) {
    for (var i = 0; i < length; i++) {
        dataTo[index++] = dataFrom.getUint8(i);
    }
    return index;
}

function fill16bit(dataTo, dataFrom, index, length, littleEndian) {
    for (var i = 0; i < length * 2; i += 2) {
        dataTo[index++] = dataFrom.getUint16(i, littleEndian);
    }
    return index;
}

function fillFloat32(dataTo, dataFrom, index, length, littleEndian) {
    for (var i = 0; i < length * 4; i += 4) {
        dataTo[index++] = dataFrom.getFloat32(i, littleEndian);
    }
    return index;
}

function unsupported(type, value) {
    throw new Error('Unsupported ' + type + ': ' + value);
}

},{"./ifd":135,"./ifdValue":136,"./tiffIfd":142,"iobuffer":48}],142:[function(require,module,exports){
'use strict';

var Ifd = require('./ifd');

var dateTimeRegex = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

class TiffIfd extends Ifd {
    constructor() {
        super('standard');
    }

    // Custom fields
    get size() {
        return this.width * this.height;
    }
    get width() {
        return this.imageWidth;
    }
    get height() {
        return this.imageLength;
    }
    get components() {
        return this.samplesPerPixel;
    }
    get date() {
        var date = new Date();
        var result = dateTimeRegex.exec(this.dateTime);
        date.setFullYear(result[1], result[2] - 1, result[3]);
        date.setHours(result[4], result[5], result[6]);
        return date;
    }

    // IFD fields
    get newSubfileType() {
        return this.fields.get(254);
    }
    get imageWidth() {
        return this.fields.get(256);
    }
    get imageLength() {
        return this.fields.get(257);
    }
    get bitsPerSample() {
        return this.fields.get(258);
    }
    get compression() {
        return this.fields.get(259) || 1;
    }
    get type() {
        return this.fields.get(262);
    }
    get fillOrder() {
        return this.fields.get(266) || 1;
    }
    get documentName() {
        return this.fields.get(269);
    }
    get imageDescription() {
        return this.fields.get(270);
    }
    get stripOffsets() {
        return alwaysArray(this.fields.get(273));
    }
    get orientation() {
        return this.fields.get(274);
    }
    get samplesPerPixel() {
        return this.fields.get(277);
    }
    get rowsPerStrip() {
        return this.fields.get(278);
    }
    get stripByteCounts() {
        return alwaysArray(this.fields.get(279));
    }
    get minSampleValue() {
        return this.fields.get(280) || 0;
    }
    get maxSampleValue() {
        return this.fields.get(281) || Math.pow(2, this.bitsPerSample) - 1;
    }
    get xResolution() {
        return this.fields.get(282);
    }
    get yResolution() {
        return this.fields.get(283);
    }
    get planarConfiguration() {
        return this.fields.get(284) || 1;
    }
    get resolutionUnit() {
        return this.fields.get(296) || 2;
    }
    get dateTime() {
        return this.fields.get(306);
    }
    get predictor() {
        return this.fields.get(317) || 1;
    }
    get sampleFormat() {
        return this.fields.get(339) || 1;
    }
    get sMinSampleValue() {
        return this.fields.get(340) || this.minSampleValue;
    }
    get sMaxSampleValue() {
        return this.fields.get(341) || this.maxSampleValue;
    }
}

function alwaysArray(value) {
    if (typeof value === 'number') return [value];
    return value;
}

module.exports = TiffIfd;

},{"./ifd":135}],143:[function(require,module,exports){
'use strict';

var workerTemplate = require('./workerTemplate');

var CORES = navigator.hardwareConcurrency || 1;

var noop = Function.prototype;

function WorkerManager(func, options) {
    // Check arguments
    if (typeof func !== 'string' && typeof func !== 'function') throw new TypeError('func argument must be a function');
    if (options === undefined) options = {};
    if (typeof options !== 'object' || options === null) throw new TypeError('options argument must be an object');

    this._workerCode = func.toString();

    // Parse options
    if (options.maxWorkers === undefined || options.maxWorkers === 'auto') {
        this._numWorkers = Math.min(CORES - 1, 1);
    } else if (options.maxWorkers > 0) {
        this._numWorkers = Math.min(options.maxWorkers, CORES);
    } else {
        this._numWorkers = CORES;
    }

    this._workers = new Map();
    this._timeout = options.timeout || 0;
    this._terminateOnError = !!options.terminateOnError;

    var deps = options.deps;
    if (typeof deps === 'string') deps = [deps];
    if (!Array.isArray(deps)) deps = undefined;

    this._id = 0;
    this._terminated = false;
    this._working = 0;
    this._waiting = [];

    this._init(deps);
}

WorkerManager.prototype._init = function (deps) {
    var workerURL = workerTemplate.newWorkerURL(this._workerCode, deps);

    for (var i = 0; i < this._numWorkers; i++) {
        var worker = new Worker(workerURL);
        worker.onmessage = this._onmessage.bind(this, worker);
        worker.onerror = this._onerror.bind(this, worker);
        worker.running = false;
        worker.id = i;
        this._workers.set(worker, null);
    }

    URL.revokeObjectURL(workerURL);
};

WorkerManager.prototype._onerror = function (worker, error) {
    if (this._terminated) return;
    this._working--;
    worker.running = false;
    var callback = this._workers.get(worker);
    if (callback) {
        callback[1](error.message);
    }
    this._workers.set(worker, null);
    if (this._terminateOnError) {
        this.terminate();
    } else {
        this._exec();
    }
};

WorkerManager.prototype._onmessage = function (worker, event) {
    if (this._terminated) return;
    this._working--;
    worker.running = false;
    var callback = this._workers.get(worker);
    if (callback) {
        callback[0](event.data.data);
    }
    this._workers.set(worker, null);
    this._exec();
};

WorkerManager.prototype._exec = function () {
    for (var worker of this._workers.keys()) {
        if (this._working === this._numWorkers || this._waiting.length === 0) {
            return;
        }
        if (!worker.running) {
            for (var i = 0; i < this._waiting.length; i++) {
                var execInfo = this._waiting[i];
                if (typeof execInfo[4] === 'number' && execInfo[4] !== worker.id) {
                    // this message is intended to another worker, let's ignore it
                    continue;
                }
                this._waiting.splice(i, 1);
                worker.postMessage({
                    action: 'exec',
                    event: execInfo[0],
                    args: execInfo[1]
                }, execInfo[2]);
                worker.running = true;
                worker.time = Date.now();
                this._workers.set(worker, execInfo[3]);
                this._working++;
                break;
            }
        }
    }
};

WorkerManager.prototype.terminate = function () {
    if (this._terminated) return;
    for (var entry of this._workers) {
        entry[0].terminate();
        if (entry[1]) {
            entry[1][1](new Error('Terminated'));
        }
    }
    this._workers.clear();
    this._waiting = [];
    this._working = 0;
    this._terminated = true;
};

WorkerManager.prototype.postAll = function (event, args) {
    if (this._terminated) throw new Error('Cannot post (terminated)');
    var promises = [];
    for (var worker of this._workers.keys()) {
        promises.push(this.post(event, args, [], worker.id));
    }
    return Promise.all(promises);
};

WorkerManager.prototype.post = function (event, args, transferable, id) {
    if (args === undefined) args = [];
    if (transferable === undefined) transferable = [];
    if (!Array.isArray(args)) {
        args = [args];
    }
    if (!Array.isArray(transferable)) {
        transferable = [transferable];
    }

    var self = this;
    return new Promise(function (resolve, reject) {
        if (self._terminated) throw new Error('Cannot post (terminated)');
        self._waiting.push([event, args, transferable, [resolve, reject], id]);
        self._exec();
    });
};

module.exports = WorkerManager;

},{"./workerTemplate":144}],144:[function(require,module,exports){
'use strict';

var worker = function worker() {
    var window = self.window = self;
    function ManagedWorker() {
        this._listeners = {};
    }
    ManagedWorker.prototype.on = function (event, callback) {
        if (this._listeners[event]) throw new RangeError('there is already a listener for ' + event);
        if (typeof callback !== 'function') throw new TypeError('callback argument must be a function');
        this._listeners[event] = callback;
    };
    ManagedWorker.prototype._send = function (id, data, transferable) {
        if (transferable === undefined) {
            transferable = [];
        } else if (!Array.isArray(transferable)) {
            transferable = [transferable];
        }
        self.postMessage({
            id: id,
            data: data
        }, transferable);
    };
    ManagedWorker.prototype._trigger = function (event, args) {
        if (!this._listeners[event]) throw new Error('event ' + event + ' is not defined');
        this._listeners[event].apply(null, args);
    };
    var worker = new ManagedWorker();
    self.onmessage = function (event) {
        switch (event.data.action) {
            case 'exec':
                event.data.args.unshift(function (data, transferable) {
                    worker._send(event.data.id, data, transferable);
                });
                worker._trigger(event.data.event, event.data.args);
                break;
            case 'ping':
                worker._send(event.data.id, 'pong');
                break;
            default:
                throw new Error('unexpected action: ' + event.data.action);
        }
    };
    "CODE";
};

var workerStr = worker.toString().split('"CODE";');

exports.newWorkerURL = function newWorkerURL(code, deps) {
    var blob = new Blob(['(', workerStr[0], 'importScripts.apply(self, ' + JSON.stringify(deps) + ');\n', '(', code, ')();', workerStr[1], ')();'], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
};

},{}],145:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _kind = require('./kind');

var _kindNames = require('./kindNames');

var _environment = require('./environment');

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

var _bitMethods = require('./bitMethods');

var _bitMethods2 = _interopRequireDefault(_bitMethods);

var _fs = require('fs');

var _model = require('./model/model');

var _manager = require('./roi/manager');

var _manager2 = _interopRequireDefault(_manager);

var _mediaTypes = require('./mediaTypes');

var _extend3 = require('extend');

var _extend4 = _interopRequireDefault(_extend3);

var _load = require('./load');

var _Stack = require('../stack/Stack');

var _Stack2 = _interopRequireDefault(_Stack);

var _blobUtil = require('blob-util');

var _hasOwn = require('has-own');

var _hasOwn2 = _interopRequireDefault(_hasOwn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

/**
 * Class representing an image.
 * This class allows to manipulate easily images directly in the browser or in node.
 *
 * This library is designed to deal with scientific images (8 or 16 bit depth) and will be able to open
 * and process jpeg, png and uncompressed tiff images. It is designed to work in the browser
 * as on the server side in node.
 *
 * An image is characterized by:
 * * width and height
 * * colorModel (RGB, HSL, CMYK, GREY, ...)
 * * components: number of components, Grey scale images will have 1 component while RGB will have 3 and CMYK 4.
 * * alpha: 0 or 1 depending if there is an alpha channel. The
 *      alpha channel define the opacity of each pixel
 * * channels: number of channels (components + alpha)
 * * bitDepth : number of bits to define the intensity of a point.
 *      The values may be 1 for a binary image (mask), 8 for a normal image (each
 *      channel contains values between 0 and 255) and 16 for scientific images
 *      (each channel contains values between 0 and 65535).
 *      The png library and tiff library included in image-js allow to deal correctly with
 *      8 and 16 bit depth images.
 * * position : an array of 2 elements that allows to define a relative position
 *      to a parent image. This will be used in a crop or in the management
 *      of Region Of Interests (Roi) for exmaple
 * * data : an array that contains all the points of the image.
 *      Depending the bitDepth Uint8Array (1 bit), Uint8ClampedArray (8 bits),
 *      Uint16Array (16 bits), Float32Array (32 bits)
 *
 * In an image we have pixels and points:
 * * A pixel is an array that has as size the number of channels
 * and that contains all the values that define a particular pixel of the image.
 * * A point is an array of 2 elements that contains the x / y coordinate
 * of a specific pixel of the image
 *
 *
 * @class Image
 * @param {number} [width=1]
 * @param {number} [height=1]
 * @param {Array} [data] - Image data to load
 * @param {object} options
 *
 * @example
 *
 * In order to run the next examples you will have to install node and
 * create a new project
 *
 * To install node you could use nvm that can be installed from
 * https://github.com/creationix/nvm
 *
 * Once nvm is install:
 * nvm install stable
 * nvm alias default stable
 *
 * You may then create a folder, go in this folder and install image-js
 * mkdir test-image-js
 * cd test-image-js
 * npm install image-js
 *
 * In the test-image-js folder please also store please a test.jpg image like
 * wget https://raw.githubusercontent.com/image-js/core/c44bb2a0a45d95f43f3c1f8ecb58ee7afa752bb9/test/img/cat.jpg


 * @example

 // javascript code using node to get some info about the image

 // we load the library that was install using 'npm install image-js'
 var IJS=require('image-js');

 // now IJS contains all the methods available to create an image

 // loading an image is asynchronous and will return a promise.
 // once the promise has been resolved the function in the 'then' method will
 // be executed

 IJS.load('cat.jpg').then(function(image) {
        console.log('Width',image.width);
        console.log('Height',image.height);
        console.log('colorModel', image.colorModel);
        console.log('components', image.components);
        console.log('alpha', image.alpha);
        console.log('channels', image.channels);
        console.log('bitDepth', image.bitDepth);
});

 @example
// Convert an image to grey scale
var IJS=require('image-js');

IJS.load('cat.jpg').then(function(image) {
    var grey=image.grey();
    grey.save('cat-grey.jpg');
});

 @example
 // Split a RGB image in it's components
 var IJS=require('image-js');

 IJS.load('cat.jpg').then(function(image) {
    var components=image.split();
    components[0].save('cat-red.jpg');
    components[1].save('cat-green.jpg');
    components[2].save('cat-blur.jpg');
});


 @example
 // for this example you will need the picture of an ecstasy pill that is available on
 // wget https://raw.githubusercontent.com/image-js/core/854e70f50d63cc73d2dde1d2020fe61ba1b5ec05/test/img/xtc.png // the goal is to isolate the picture and to get a RGB histogram of the pill.
 // Practically this allows to classify pills based on the histogram similarity
 // This work was published at: http://dx.doi.org/10.1016/j.forsciint.2012.10.004

 var IJS=require('image-js');

 IJS.load('xtc.png').then(function(image) {


    var grey=image.grey({
        algorithm:'lightness'
    });
    // we create a mask, which is basically a binary image
    // a mask has as source a grey image and we will decide how to determine
    // the threshold to define what is white and what is black
    var mask=grey.mask({
        algorithm: 'li'
    });

    // it is possible to create an array of Region Of Interest (Roi) using
    // the RoiManager. A RoiManager will be applied on the original image
    // in order to be able to extract from the original image the regions

    // the result of this console.log result can diretly be pasted
    // in the browser
    // console.log(mask.toDataURL());


    var manager = image.getRoiManager();
    manager.fromMask(mask);
    var rois=manager.getRoi({
        positive: true,
        negative: false,
        minSurface: 100
    });

    // console.log(rois);

    // we can sort teh rois by surface
    // for demonstration we use an arrow function
    rois.sort((a, b) => b.surface-a.surface);

    // the first Roi (the biggest is expected to be the pill)

    var pillMask=rois[0].getMask({
        scale: 0.7   // we will scale down the mask to take just the center of the pill and avoid border effects
    });

    // image-js remembers the parent of the image and the relative
    // position of a derived image. This is the case for a crop as
    // well as for Roi

    var pill=image.extract(pillMask);
    pill.save('pill.jpg');

    var histogram=pill.getHistograms({maxSlots: 16});

    console.log(histogram);
});

 @example
 // Example of use of IJS in the browser

 <sript>
    var canvas = document.getElementById('myCanvasID');
    var image = IJS.fromCanvas(canvas);
 </script>
*/
class Image {
    constructor(width, height, data, options) {
        if (width === undefined) {
            width = 1;
        }
        if (height === undefined) {
            height = 1;
        }

        // copy another image
        if (typeof width === 'object') {
            var otherImage = width;
            var cloneData = height === true;
            width = otherImage.width;
            height = otherImage.height;
            data = cloneData ? otherImage.data.slice() : otherImage.data;
            options = {
                position: otherImage.position,
                components: otherImage.components,
                alpha: otherImage.alpha,
                bitDepth: otherImage.bitDepth,
                colorModel: otherImage.colorModel,
                parent: otherImage,
                meta: otherImage.meta
            };
        }

        if (data && !data.length) {
            options = data;
            data = null;
        }
        if (options === undefined) {
            options = {};
        }

        this.width = width;
        this.height = height;

        if (this.width <= 0) {
            throw new RangeError('width must be greater than 0');
        }
        if (this.height <= 0) {
            throw new RangeError('height must be greater than 0');
        }

        // We will set the parent image for relative position

        Object.defineProperty(this, 'parent', {
            enumerable: false,
            writable: true
        });
        this.parent = options.parent;
        this.position = options.position || [0, 0];

        var theKind = void 0;
        if (typeof options.kind === 'string') {
            theKind = (0, _kind.getKind)(options.kind);
            if (!theKind) {
                throw new RangeError('invalid image kind: ' + options.kind);
            }
        } else {
            theKind = (0, _kind.getKind)(_kindNames.RGBA);
        }

        var kindDefinition = (0, _extend4.default)({}, theKind, options);
        this.components = kindDefinition.components;
        this.alpha = kindDefinition.alpha + 0;
        this.bitDepth = kindDefinition.bitDepth;
        this.colorModel = kindDefinition.colorModel;
        this.meta = options.meta || {};

        this.computed = null;

        this.initialize();

        if (!data) {
            (0, _kind.createPixelArray)(this);
        } else {
            var length = (0, _kind.getTheoreticalPixelArraySize)(this);
            if (length !== data.length) {
                throw new RangeError(`incorrect data size. Should be ${ length } and found ${ data.length }`);
            }
            this.data = data;
        }
    }

    initialize() {
        this.size = this.width * this.height;
        this.sizes = [this.width, this.height];
        this.channels = this.components + this.alpha;
        if (this.bitDepth === 32) {
            this.maxValue = Number.MAX_VALUE;
        } else {
            this.maxValue = Math.pow(2, this.bitDepth) - 1; // we may not use 1 << this.bitDepth for 32 bits images
        }

        this.multiplierX = this.channels;
        this.multiplierY = this.channels * this.width;
        this.isClamped = this.bitDepth < 32;
        this.borderSizes = [0, 0]; // when a filter create a border it may have impact on future processing like Roi
    }

    /**
     * Load an image
     * @param {string} url - URL of the image (browser, can be a dataURL) or path (Node.js)
     * @param {object} [options]
     * @return {Promise<Image>} - Resolves with the Image
     * @example
     *  Image.load('http://xxxx').then(
     *      function(image) {
     *          console.log(image);
     *          // we can display the histogram of the first channel
     *          console.log(image.histograms[0]);
     *      }
     *  )
     */
    static load(url, options) {
        return (0, _load.loadURL)(url, options);
    }

    /**
     * Creates an image from an HTML Canvas object
     * @param {Canvas} canvas
     * @return {Image}
     */
    static fromCanvas(canvas) {
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return new Image(imageData.width, imageData.height, imageData.data);
    }

    static extendMethod(name, method) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var _ref$inPlace = _ref.inPlace;
        var inPlace = _ref$inPlace === undefined ? false : _ref$inPlace;
        var _ref$returnThis = _ref.returnThis;
        var returnThis = _ref$returnThis === undefined ? true : _ref$returnThis;
        var _ref$partialArgs = _ref.partialArgs;
        var partialArgs = _ref$partialArgs === undefined ? [] : _ref$partialArgs;
        var _ref$stack = _ref.stack;
        var stack = _ref$stack === undefined ? false : _ref$stack;

        if (inPlace) {
            Image.prototype[name] = function () {
                // remove computed properties
                this.computed = null;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var result = method.apply(this, [].concat(_toConsumableArray(partialArgs), args));
                if (returnThis) {
                    return this;
                }
                return result;
            };
            if (stack) {
                var stackName = typeof stack === 'string' ? stack : name;
                if (returnThis) {
                    _Stack2.default.prototype[stackName] = function () {
                        for (var image of this) {
                            image[name].apply(image, arguments);
                        }
                        return this;
                    };
                } else {
                    _Stack2.default.prototype[stackName] = function () {
                        var result = new _Stack2.default(this.length);
                        for (var i = 0; i < this.length; i++) {
                            var _i;

                            result[i] = (_i = this[i])[name].apply(_i, arguments);
                        }
                        return result;
                    };
                }
            }
        } else {
            Image.prototype[name] = function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return method.apply(this, [].concat(_toConsumableArray(partialArgs), args));
            };
            if (stack) {
                var _stackName = typeof stack === 'string' ? stack : name;
                _Stack2.default.prototype[_stackName] = function () {
                    var result = new _Stack2.default(this.length);
                    for (var i = 0; i < this.length; i++) {
                        var _i2;

                        result[i] = (_i2 = this[i])[name].apply(_i2, arguments);
                    }
                    return result;
                };
            }
        }
        return Image;
    }

    static extendProperty(name, method) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var _ref2$partialArgs = _ref2.partialArgs;
        var partialArgs = _ref2$partialArgs === undefined ? [] : _ref2$partialArgs;

        computedPropertyDescriptor.get = function () {
            if (this.computed === null) {
                this.computed = {};
            } else if ((0, _hasOwn2.default)(name, this.computed)) {
                return this.computed[name];
            }
            var result = method.apply(this, partialArgs);
            this.computed[name] = result;
            return result;
        };
        Object.defineProperty(Image.prototype, name, computedPropertyDescriptor);
        return Image;
    }

    static createFrom(other, options) {
        var newOptions = {
            width: other.width,
            height: other.height,
            position: other.position,
            components: other.components,
            alpha: other.alpha,
            colorModel: other.colorModel,
            bitDepth: other.bitDepth,
            parent: other
        };
        (0, _extend4.default)(newOptions, options);
        return new Image(newOptions.width, newOptions.height, newOptions);
    }

    static isTypeSupported(type) {
        var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'write';

        if (typeof type !== 'string') {
            throw new TypeError('type argument must be a string');
        }
        type = (0, _mediaTypes.getType)(type);
        if (operation === 'write') {
            return (0, _mediaTypes.canWrite)(type);
        } else {
            throw new TypeError('unknown operation: ' + operation);
        }
    }

    getPixelIndex(indices) {
        var shift = 0;
        for (var i = 0; i < indices.length; i++) {
            shift += this.multipliers[i] * indices[i];
        }
        return shift;
    }

    /**
     * Set the value of specific pixel channel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @param {number} channel
     * @param {number} value - the new value of this pixel channel
     * @return {this}
     */
    setValueXY(x, y, channel, value) {
        this.data[(y * this.width + x) * this.channels + channel] = value;
        this.computed = null;
        return this;
    }

    /**
     * Get the value of specific pixel channel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @param {number} channel
     * @return {number} - the value of this pixel channel
     */
    getValueXY(x, y, channel) {
        return this.data[(y * this.width + x) * this.channels + channel];
    }

    /**
     * Set the value of specific pixel channel
     * @param {number} index - 1D index of the pixel
     * @param {number} channel
     * @param {number} value - the new value of this pixel channel
     * @return {this}
     */
    setValue(index, channel, value) {
        this.data[index * this.channels + channel] = value;
        this.computed = null;
        return this;
    }

    /**
     * Get the value of specific pixel channel
     * @param {number} index - 1D index of the pixel
     * @param {number} channel
     * @return {number} - the value of this pixel channel
     */
    getValue(index, channel) {
        return this.data[index * this.channels + channel];
    }

    /**
     * Set the value of an entire pixel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @param {number[]} value - the new value of this pixel
     * @return {this}
     */
    setPixelXY(x, y, value) {
        return this.setPixel(y * this.width + x, value);
    }

    /**
     * Get the value of an entire pixel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @return {number[]} the value of this pixel
     */
    getPixelXY(x, y) {
        return this.getPixel(y * this.width + x);
    }

    /**
     * Set the value of an entire pixel
     * @param {number} index - 1D index of the pixel
     * @param {number[]} value - the new value of this pixel
     * @return {this}
     */
    setPixel(index, value) {
        var target = index * this.channels;
        for (var i = 0; i < value.length; i++) {
            this.data[target + i] = value[i];
        }
        this.computed = null;
        return this;
    }

    /**
     * Get the value of an entire pixel
     * @param {number} index - 1D index of the pixel
     * @return {number[]} the value of this pixel
     */
    getPixel(index) {
        var value = new Array(this.channels);
        var target = index * this.channels;
        for (var i = 0; i < this.channels; i++) {
            value[i] = this.data[target + i];
        }
        return value;
    }

    /**
     * Creates a dataURL string from the image.
     * @param {string} [type='image/png']
     * @return {string}
     */
    toDataURL() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'image/png';

        return this.getCanvas().toDataURL((0, _mediaTypes.getType)(type));
    }

    /**
     * Creates a blob from the image and return a Promise.
     * @param {string} [type='image/png'] A String indicating the image format. The default type is image/png.
     * @param {string} [quality=0.8] A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
     * @return {Promise}
     */
    toBlob() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'image/png';
        var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.8;

        return (0, _blobUtil.canvasToBlob)(this.getCanvas({ originalData: true }), type, quality);
    }

    /**
     * Creates a new canvas element and draw the image inside it
     * @param {object} [options]
     * @param {boolean} [options.originalData=false]
     * @return {Canvas}
     */
    getCanvas() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$originalData = options.originalData;
        var originalData = _options$originalData === undefined ? false : _options$originalData;

        var data = void 0;
        if (!originalData) {
            data = new _environment.ImageData(this.getRGBAData(), this.width, this.height);
        } else {
            this.checkProcessable('getInPlaceCanvas', {
                channels: [4],
                bitDepth: [8]
            });
            data = new _environment.ImageData(this.data, this.width, this.height);
        }
        var canvas = new _environment.Canvas(this.width, this.height);
        var ctx = canvas.getContext('2d');
        ctx.putImageData(data, 0, 0);
        return canvas;
    }

    /**
     * Retrieve the data of the current image as RGBA 8 bits
     * The source image may be:
     * * a mask (binary image)
     * * a grey image (8 or 16 bits) with or without alpha channel
     * * a color image (8 or 16 bits) with or without alpha channel in with RGB model
     * @instance
     * @return {Uint8ClampedArray} - Array with the data
     * @example
     * var imageData = image.getRGBAData();
     */
    getRGBAData() {
        this.checkProcessable('getRGBAData', {
            components: [1, 3],
            bitDepth: [1, 8, 16]
        });
        var size = this.size;
        var newData = new Uint8ClampedArray(this.width * this.height * 4);
        if (this.bitDepth === 1) {
            for (var i = 0; i < size; i++) {
                var value = this.getBit(i);
                newData[i * 4] = value * 255;
                newData[i * 4 + 1] = value * 255;
                newData[i * 4 + 2] = value * 255;
            }
        } else {
            if (this.components === 1) {
                for (var _i3 = 0; _i3 < size; _i3++) {
                    newData[_i3 * 4] = this.data[_i3 * this.channels] >>> this.bitDepth - 8;
                    newData[_i3 * 4 + 1] = this.data[_i3 * this.channels] >>> this.bitDepth - 8;
                    newData[_i3 * 4 + 2] = this.data[_i3 * this.channels] >>> this.bitDepth - 8;
                }
            } else if (this.components === 3) {
                this.checkProcessable('getRGBAData', { colorModel: [_model.RGB] });
                if (this.colorModel === _model.RGB) {
                    for (var _i4 = 0; _i4 < size; _i4++) {
                        newData[_i4 * 4] = this.data[_i4 * this.channels] >>> this.bitDepth - 8;
                        newData[_i4 * 4 + 1] = this.data[_i4 * this.channels + 1] >>> this.bitDepth - 8;
                        newData[_i4 * 4 + 2] = this.data[_i4 * this.channels + 2] >>> this.bitDepth - 8;
                    }
                }
            }
        }
        if (this.alpha) {
            this.checkProcessable('getRGBAData', { bitDepth: [8, 16] });
            for (var _i5 = 0; _i5 < size; _i5++) {
                newData[_i5 * 4 + 3] = this.data[_i5 * this.channels + this.components] >> this.bitDepth - 8;
            }
        } else {
            for (var _i6 = 0; _i6 < size; _i6++) {
                newData[_i6 * 4 + 3] = 255;
            }
        }
        return newData;
    }

    /**
     * Create a new manager for regions of interest based on the current image.
     * @param {object} [options]
     * @return {RoiManager}
     */
    getRoiManager(options) {
        return new _manager2.default(this, options);
    }

    /**
     * Create a new image based on the current image.
     * By default the method will copy the data
     * @instance
     * @param {object} options
     * @param {boolean} [options.copyData=true] - Specify if we want also to clone
     *          the data or only the image parameters (size, colorModel, ...)
     * @return {Image} - The source image clone
     * @example
     * var emptyImage = image.clone({copyData:false});
     */
    clone() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$copyData = options.copyData;
        var copyData = _options$copyData === undefined ? true : _options$copyData;

        return new Image(this, copyData);
    }

    /**
     * Save the image to disk (Node.js only)
     * @param {string} path
     * @param {object} [options]
     * @param {string} [options.format='png']
     * @return {Promise} - Resolves when the file is fully written
     */
    save(path) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _options$format = options.format;
        var format = _options$format === undefined ? 'png' : _options$format;

        return new Promise((resolve, reject) => {
            var out = (0, _fs.createWriteStream)(path);
            var canvas = this.getCanvas();
            var stream = void 0;
            switch (format.toLowerCase()) {
                case 'png':
                    stream = canvas.pngStream();
                    break;
                case 'jpg':
                case 'jpeg':
                    stream = canvas.jpegStream();
                    break;
                default:
                    throw new RangeError('invalid output format: ' + format);
            }
            out.on('finish', resolve);
            out.on('error', reject);
            stream.pipe(out);
        });
    }

    // this method check if a process can be applied on the current image
    checkProcessable(processName) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var bitDepth = _ref3.bitDepth;
        var alpha = _ref3.alpha;
        var colorModel = _ref3.colorModel;
        var components = _ref3.components;
        var channels = _ref3.channels;

        if (typeof processName !== 'string') {
            throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
        }
        if (bitDepth) {
            if (!Array.isArray(bitDepth)) {
                bitDepth = [bitDepth];
            }
            if (!bitDepth.includes(this.bitDepth)) {
                throw new TypeError('The process: ' + processName + ' can only be applied if bit depth is in: ' + bitDepth);
            }
        }
        if (alpha) {
            if (!Array.isArray(alpha)) {
                alpha = [alpha];
            }
            if (!alpha.includes(this.alpha)) {
                throw new TypeError('The process: ' + processName + ' can only be applied if alpha is in: ' + alpha);
            }
        }
        if (colorModel) {
            if (!Array.isArray(colorModel)) {
                colorModel = [colorModel];
            }
            if (!colorModel.includes(this.colorModel)) {
                throw new TypeError('The process: ' + processName + ' can only be applied if color model is in: ' + colorModel);
            }
        }
        if (components) {
            if (!Array.isArray(components)) {
                components = [components];
            }
            if (!components.includes(this.components)) {
                throw new TypeError('The process: ' + processName + ' can only be applied if the number of channels is in: ' + components);
            }
        }
        if (channels) {
            if (!Array.isArray(channels)) {
                channels = [channels];
            }
            if (!channels.includes(this.channels)) {
                throw new TypeError('The process: ' + processName + ' can only be applied if the number of components is in: ' + channels);
            }
        }
    }

    checkColumn(column) {
        if (column < 0 || column >= this.width) {
            throw new RangeError(`checkColumn: column should be included between 0 and ${ this.width - 1 }. Current value: ${ column }`);
        }
    }

    checkRow(row) {
        if (row < 0 || row >= this.height) {
            throw new RangeError(`checkRow: row should be included between 0 and ${ this.height - 1 }. Current value: ${ row }`);
        }
    }

    checkChannel(channel) {
        if (channel < 0 || channel >= this.channels) {
            throw new RangeError(`checkChannel: channel should be included between 0 and ${ this.channels - 1 }. Current value: ${ channel }`);
        }
    }

    apply(filter) {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var index = (y * this.width + x) * this.channels;
                filter.call(this, index);
            }
        }
    }
}

exports.default = Image;
(0, _extend2.default)(Image);
(0, _bitMethods2.default)(Image);

},{"../stack/Stack":245,"./bitMethods":146,"./environment":159,"./extend":160,"./kind":181,"./kindNames":182,"./load":183,"./mediaTypes":184,"./model/model":185,"./roi/manager":198,"blob-util":6,"extend":35,"fs":8,"has-own":44}],146:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (Image) {
    for (var i in bitMethods) {
        Image.prototype[i] = bitMethods[i];
    }
};

// those methods can only apply on binary images... but we will not lose time to check!
var bitMethods = {

    /**
     * Set a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     */
    setBitXY: function setBitXY(x, y) {
        var target = y * this.width + x;
        var shift = 7 - (target & 0b00000111);
        var slot = target >> 3;
        this.data[slot] |= 1 << shift;
    },


    /**
     * Clear (unset) a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     */
    clearBitXY: function clearBitXY(x, y) {
        var target = y * this.width + x;
        var shift = 7 - (target & 0b00000111);
        var slot = target >> 3;
        this.data[slot] &= ~(1 << shift);
    },


    /**
     * Toggle (invert) a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     */
    toggleBitXY: function toggleBitXY(x, y) {
        var target = y * this.width + x;
        var shift = 7 - (target & 0b00000111);
        var slot = target >> 3;
        this.data[slot] ^= 1 << shift;
    },


    /**
     * Get the state of a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @return {number} 0: bit is unset, 1: bit is set
     */
    getBitXY: function getBitXY(x, y) {
        var target = y * this.width + x;
        var shift = 7 - (target & 0b00000111);
        var slot = target >> 3;
        return this.data[slot] & 1 << shift ? 1 : 0;
    },


    /**
     * Set a specific pixel from a binary image (mask)
     *
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     */
    setBit: function setBit(pixel) {
        var shift = 7 - (pixel & 0b00000111);
        var slot = pixel >> 3;
        this.data[slot] |= 1 << shift;
    },


    /**
     * Clear (unset) a specific pixel from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     */
    clearBit: function clearBit(pixel) {
        var shift = 7 - (pixel & 0b00000111);
        var slot = pixel >> 3;
        this.data[slot] &= ~(1 << shift);
    },


    /**
     * Toggle (invert) a specific pixel from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     */
    toggleBit: function toggleBit(pixel) {
        var shift = 7 - (pixel & 0b00000111);
        var slot = pixel >> 3;
        this.data[slot] ^= 1 << shift;
    },


    /**
     * Get the state of a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     * @return {number} 0: bit is unset, 1: bit is set
     */
    getBit: function getBit(pixel) {
        var shift = 7 - (pixel & 0b00000111);
        var slot = pixel >> 3;
        return this.data[slot] & 1 << shift ? 1 : 0;
    }
};

},{}],147:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getColorHistogram;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 */

function getColorHistogram() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$useAlpha = _ref.useAlpha;
    var useAlpha = _ref$useAlpha === undefined ? true : _ref$useAlpha;
    var _ref$nbSlots = _ref.nbSlots;
    var nbSlots = _ref$nbSlots === undefined ? 512 : _ref$nbSlots;

    this.checkProcessable('getColorHistogram', {
        bitDepth: [8, 16],
        components: [3]
    });

    var nbSlotsCheck = Math.log(nbSlots) / Math.log(8);
    if (nbSlotsCheck !== Math.floor(nbSlotsCheck)) {
        throw new RangeError('nbSlots must be a power of 8. Usually 8, 64, 512 or 4096');
    }

    var bitShift = this.bitDepth - nbSlotsCheck;

    var data = this.data;
    var result = (0, _newArray2.default)(Math.pow(8, nbSlotsCheck), 0);
    var factor2 = Math.pow(2, nbSlotsCheck * 2);
    var factor1 = Math.pow(2, nbSlotsCheck);

    for (var i = 0; i < data.length; i += this.channels) {
        var slot = (data[i] >> bitShift) * factor2 + (data[i + 1] >> bitShift) * factor1 + (data[i + 2] >> bitShift);
        if (useAlpha && this.alpha) {
            result[slot] += data[i + this.channels - 1] / this.maxValue;
        } else {
            result[slot]++;
        }
    }

    return result;
}

},{"new-array":113}],148:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = countAlphaPixels;

// returns the number of transparent

/**
 * Returns the number of transparent pixels
 * @memberof Image
 * @instance
 * @param {number} [$1.alpha=1] - Value of the alpha value to count. By default 1.
 * @returns {number} Number of transparent pixel
 */

function countAlphaPixels() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$alpha = _ref.alpha;
    var alpha = _ref$alpha === undefined ? 1 : _ref$alpha;

    this.checkProcessable('countAlphaPixels', {
        bitDepth: [8, 16],
        alpha: 1
    });

    var count = 0;

    if (alpha !== undefined) {
        for (var i = this.components; i < this.data.length; i += this.channels) {
            if (this.data[i] === alpha) {
                count++;
            }
        }
        return count;
    } else {
        // because there is an alpha channel all the pixels have an alpha
        return this.size;
    }
}

},{}],149:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHistogram = getHistogram;
exports.getHistograms = getHistograms;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

var _isInteger = require('is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a histogram for the specified channel
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.maxSlots=256]
 * @param {number} [options.channel]
 * @param {boolean} [options.useAlpha=true]
 * @return {number[]}
 */
function getHistogram() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$maxSlots = options.maxSlots;
    var maxSlots = _options$maxSlots === undefined ? 256 : _options$maxSlots;
    var channel = options.channel;
    var _options$useAlpha = options.useAlpha;
    var useAlpha = _options$useAlpha === undefined ? true : _options$useAlpha;

    this.checkProcessable('getHistogram', {
        bitDepth: [8, 16]
    });
    if (channel === undefined) {
        if (this.components > 1) {
            throw new RangeError('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }
    return getChannelHistogram.call(this, channel, { useAlpha: useAlpha, maxSlots: maxSlots });
}

/**
 * Returns an array (number of channels) of array (number of slots) containing
 * the number of data of a specific intensity.
 * Intensity may be grouped by the maxSlots parameter.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.maxSlots] - Number of slots in the resulting
 *      array. The intensity will be evently distributed between 0 and
 *      the maxValue allowed for this image (255 for usual images).
 *      If maxSlots = 8, all the intensities between 0 and 31 will be
 *      placed in the slot 0, 32 to 63 in slot 1, ...
 * @return {Array<Array<number>>}
 * @example
 *      image.getHistograms({
 *          maxSlots: 8,
 *          useAlpha: false
 *      });
 */
function getHistograms() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$maxSlots2 = options.maxSlots;
    var maxSlots = _options$maxSlots2 === undefined ? 256 : _options$maxSlots2;
    var _options$useAlpha2 = options.useAlpha;
    var useAlpha = _options$useAlpha2 === undefined ? true : _options$useAlpha2;

    this.checkProcessable('getHistograms', {
        bitDepth: [8, 16]
    });
    var results = new Array(useAlpha ? this.components : this.channels);
    for (var i = 0; i < results.length; i++) {
        results[i] = getChannelHistogram.call(this, i, { useAlpha: useAlpha, maxSlots: maxSlots });
    }
    return results;
}

function getChannelHistogram(channel, options) {
    var useAlpha = options.useAlpha;
    var maxSlots = options.maxSlots;


    var bitSlots = Math.log2(maxSlots);
    if (!(0, _isInteger2.default)(bitSlots)) {
        throw new RangeError('maxSlots must be a power of 2, for example: 64, 256, 1024');
    }
    // we will compare the bitSlots to the bitDepth of the image
    // based on this we will shift the values. This allows to generate a histogram
    // of 16 grey even if the images has 256 shade of grey

    var bitShift = 0;
    if (this.bitDepth > bitSlots) {
        bitShift = this.bitDepth - bitSlots;
    }

    var data = this.data;
    var result = (0, _newArray2.default)(Math.pow(2, Math.min(this.bitDepth, bitSlots)), 0);
    if (useAlpha && this.alpha) {
        var alphaChannelDiff = this.channels - channel - 1;

        for (var i = channel; i < data.length; i += this.channels) {
            result[data[i] >> bitShift] += data[i + alphaChannelDiff] / this.maxValue;
        }
    } else {
        for (var _i = channel; _i < data.length; _i += this.channels) {
            result[data[_i] >> bitShift]++;
        }
    }

    return result;
}

},{"is-integer":53,"new-array":113}],150:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = localMaxima;

/**
 * Returns an array of object with position.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Image} [mask] - region of the image that is analyzed. The rest is omitted.
 * @param {number} [region=3] -  1, 2 or 3. Define the region around each points that is analyzed. 1 corresponds to 4 cross points, 2 to
 *        the 8 points around and 3 to the 12 points around the central pixel
 * @param {number} [removeClosePoints=0] Remove pts which have a distance between them smaller than this param.
 * @param {boolean} [invert=false] Search for minima instead of maxima
 * @param {number} [maxEquals=2] Maximal number of values that may be equal to the maximum
 * @returns {number[]} Array having has size the number of channels
 */

function localMaxima() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$removeClosePoint = _ref.removeClosePoints;
    var removeClosePoints = _ref$removeClosePoint === undefined ? 0 : _ref$removeClosePoint;
    var _ref$region = _ref.region;
    var region = _ref$region === undefined ? 3 : _ref$region;
    var _ref$invert = _ref.invert;
    var invert = _ref$invert === undefined ? false : _ref$invert;
    var mask = _ref.mask;
    var _ref$maxEquals = _ref.maxEquals;
    var maxEquals = _ref$maxEquals === undefined ? 2 : _ref$maxEquals;

    var image = this;
    this.checkProcessable('localMaxima', {
        bitDepth: [8, 16],
        components: 1
    });
    region *= 4;

    var maskExpectedValue = invert ? 0 : 1;

    var dx = [+1, 0, -1, 0, +1, +1, -1, -1, +2, 0, -2, 0, +2, +2, -2, -2];
    var dy = [0, +1, 0, -1, +1, -1, +1, -1, 0, +2, 0, -2, +2, -2, +2, -2];
    var shift = region <= 8 ? 1 : 2;
    var points = [];
    for (var currentY = shift; currentY < image.height - shift; currentY++) {
        for (var currentX = shift; currentX < image.width - shift; currentX++) {
            if (mask && mask.getBitXY(currentX, currentY) !== maskExpectedValue) {
                continue;
            }
            var counter = 0;
            var nbEquals = 0;
            var currentValue = image.data[currentX + currentY * image.width];
            for (var dir = 0; dir < region; dir++) {
                if (invert) {
                    // we search for minima
                    if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] > currentValue) {
                        counter++;
                    }
                } else {
                    if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] < currentValue) {
                        counter++;
                    }
                }
                if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] === currentValue) {
                    nbEquals++;
                }
            }
            if (counter + nbEquals === region && nbEquals <= maxEquals) {
                points.push([currentX, currentY]);
            }
        }
    }
    // TODO How to make a more performant and general way
    // we don't deal correctly here with groups of points that should be grouped if at the
    // beginning one of them is closer to another
    // Seems that we would ened to calculate a matrix and then split this matrix in 'independant matrices'
    // Or to assign a cluster to each point and regroup them if 2 clusters are close to each other
    // later approach seems much better
    if (removeClosePoints > 0) {
        for (var i = 0; i < points.length; i++) {
            for (var j = i + 1; j < points.length; j++) {
                if (Math.sqrt(Math.pow(points[i][0] - points[j][0], 2) + Math.pow(points[i][1] - points[j][1], 2)) < removeClosePoints) {
                    points[i][0] = points[i][0] + points[j][0] >> 1;
                    points[i][1] = points[i][1] + points[j][1] >> 1;
                    points.splice(j, 1);
                    j--;
                }
            }
        }
    }
    return points;
}

},{}],151:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = max;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an array with the maximal value of each channel
 * @memberof Image
 * @instance
 * @returns {number[]} Array having has size the number of channels
 */

function max() {
    this.checkProcessable('max', {
        bitDepth: [8, 16]
    });

    var result = (0, _newArray2.default)(this.channels, -Infinity);

    for (var i = 0; i < this.data.length; i += this.channels) {
        for (var c = 0; c < this.channels; c++) {
            if (this.data[i + c] > result[c]) {
                result[c] = this.data[i + c];
            }
        }
    }
    return result;
}

},{"new-array":113}],152:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mean;

var _histogram = require('../../util/histogram');

/**
 * Returns an array with the average value of each channel
 * @memberof Image
 * @instance
 * @returns {number[]} Array having has size the number of channels
 */

function mean() {
    var histograms = this.getHistograms({ maxSlots: this.maxValue + 1 });
    var result = new Array(histograms.length);
    for (var c = 0; c < histograms.length; c++) {
        var histogram = histograms[c];
        result[c] = (0, _histogram.mean)(histogram);
    }
    return result;
}

},{"../../util/histogram":258}],153:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = median;

var _histogram = require('../../util/histogram');

/**
 * Returns an array with the median value of each channel
 * @memberof Image
 * @instance
 * @returns {number[]} Array having has size the number of channels
 */

function median() {
    var histograms = this.getHistograms({ maxSlots: this.maxValue + 1 });
    var result = new Array(histograms.length);
    for (var c = 0; c < histograms.length; c++) {
        var histogram = histograms[c];
        result[c] = (0, _histogram.median)(histogram);
    }
    return result;
}

},{"../../util/histogram":258}],154:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = min;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an array with the minimal value of each channel
 * @memberof Image
 * @instance
 * @returns {number[]} Array having has size the number of channels
 */

function min() {
    this.checkProcessable('min', {
        bitDepth: [8, 16]
    });

    var result = (0, _newArray2.default)(this.channels, +Infinity);

    for (var i = 0; i < this.data.length; i += this.channels) {
        for (var c = 0; c < this.channels; c++) {
            if (this.data[i + c] < result[c]) {
                result[c] = this.data[i + c];
            }
        }
    }
    return result;
}

},{"new-array":113}],155:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = points;
/**
 * Allows to generate an array of points for a binary image (bit depth = 1)
 * @memberof Image
 * @instance
 * @returns {number[][]} - an array of [x,y] corresponding to the set pixels in the binary image
 */

function points() {
    this.checkProcessable('points', {
        bitDepth: [1]
    });

    var pixels = new Array(this.size);
    var counter = 0;
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            if (this.getBitXY(x, y) === 1) {
                pixels[counter++] = [x, y];
            }
        }
    }
    pixels.length = counter;
    return pixels;
}

},{}],156:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getRelativePosition;
/*
 An image may be derived from another image either by a crop
 or because it is a ROI (region of interest)
 Also a region of interest can be reprocessed to generated another
 set of region of interests.
 It is therefore important to keep the hierarchy of images to know
 which image is derived from which one and be able to get the
 relative position of one image in another
 This methods takes care of this.
 */

/**
 * @memberof Image
 * @instance
 */

function getRelativePosition(targetImage) {
    if (this === targetImage) {
        return [0, 0];
    }
    var position = [0, 0];

    var currentImage = this;
    while (currentImage) {
        if (currentImage === targetImage) {
            return position;
        }
        if (currentImage.position) {
            position[0] += currentImage.position[0];
            position[1] += currentImage.position[1];
        }
        currentImage = currentImage.parent;
    }
    // we should never reach this place, this means we could not find the parent
    // throw Error('Parent image was not found, can not get relative position.')
    return false;
}

},{}],157:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = sum;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an array with the sum of the values of each channel
 * @memberof Image
 * @instance
 * @returns {number[]} Array having has size the number of channels
 */

function sum() {
    this.checkProcessable('sum', {
        bitDepth: [8, 16]
    });

    var result = (0, _newArray2.default)(this.channels, 0);

    for (var i = 0; i < this.data.length; i += this.channels) {
        for (var c = 0; c < this.channels; c++) {
            result[c] += this.data[i + c];
        }
    }
    return result;
}

},{"new-array":113}],158:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getSvd;

var _mlMatrix = require('ml-matrix');

/**
 * TODO would be suprised if this stuff works
 * @memberof Image
 * @instance
 */

function getSvd() {
    this.checkProcessable('getSvd', {
        bitDepth: [1]
    });

    return _mlMatrix.DC.SVD(this.points);
}

},{"ml-matrix":86}],159:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var loadBinary = void 0,
    DOMImage = void 0,
    Canvas = void 0,
    ImageData = void 0,
    isDifferentOrigin = void 0,
    env = void 0;

if (typeof self !== 'undefined') {
    (function () {
        // Browser
        exports.env = env = 'browser';
        var origin = self.location.origin;
        exports.isDifferentOrigin = isDifferentOrigin = function isDifferentOrigin(url) {
            try {
                var parsedURL = new self.URL(url);
                return parsedURL.origin !== origin;
            } catch (e) {
                // may be a relative URL. In this case, it cannot be parsed but is effectively from same origin
                return false;
            }
        };

        exports.ImageData = ImageData = self.ImageData;

        exports.DOMImage = DOMImage = self.Image;
        exports.Canvas = Canvas = function Canvas(width, height) {
            var canvas = self.document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };

        exports.loadBinary = loadBinary = function loadBinary(url) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref$withCredentials = _ref.withCredentials;
            var withCredentials = _ref$withCredentials === undefined ? false : _ref$withCredentials;

            return new Promise(function (resolve, reject) {
                var xhr = new self.XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.withCredentials = withCredentials;

                xhr.onload = function (e) {
                    if (this.status !== 200) reject(e);else resolve(this.response);
                };
                xhr.onerror = reject;
                xhr.send();
            });
        };
    })();
} else if (typeof module !== 'undefined' && module.exports) {
    (function () {
        // Node.js
        exports.env = env = 'node';
        exports.isDifferentOrigin = isDifferentOrigin = () => false;

        var canvas = require('canvas');
        exports.DOMImage = DOMImage = canvas.Image;
        exports.Canvas = Canvas = canvas;
        exports.ImageData = ImageData = canvas.ImageData;

        var fs = require('fs');
        exports.loadBinary = loadBinary = function loadBinary(path) {
            return new Promise(function (resolve, reject) {
                fs.readFile(path, function (err, data) {
                    if (err) reject(err);else resolve(data.buffer);
                });
            });
        };
    })();
}

exports.loadBinary = loadBinary;
exports.DOMImage = DOMImage;
exports.Canvas = Canvas;
exports.ImageData = ImageData;
exports.isDifferentOrigin = isDifferentOrigin;
exports.env = env;

},{"canvas":undefined,"fs":8}],160:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extend;

var _invertGetSet = require('./filter/invertGetSet');

var _invertGetSet2 = _interopRequireDefault(_invertGetSet);

var _invertIterator = require('./filter/invertIterator');

var _invertIterator2 = _interopRequireDefault(_invertIterator);

var _invertOneLoop = require('./filter/invertOneLoop');

var _invertOneLoop2 = _interopRequireDefault(_invertOneLoop);

var _invertPixel = require('./filter/invertPixel');

var _invertPixel2 = _interopRequireDefault(_invertPixel);

var _invertApply = require('./filter/invertApply');

var _invertApply2 = _interopRequireDefault(_invertApply);

var _invertBinaryLoop = require('./filter/invertBinaryLoop');

var _invertBinaryLoop2 = _interopRequireDefault(_invertBinaryLoop);

var _invert = require('./filter/invert');

var _invert2 = _interopRequireDefault(_invert);

var _flipX = require('./filter/flipX');

var _flipX2 = _interopRequireDefault(_flipX);

var _flipY = require('./filter/flipY');

var _flipY2 = _interopRequireDefault(_flipY);

var _blurFilter = require('./filter/blurFilter');

var _blurFilter2 = _interopRequireDefault(_blurFilter);

var _medianFilter = require('./filter/medianFilter');

var _medianFilter2 = _interopRequireDefault(_medianFilter);

var _gaussianFilter = require('./filter/gaussianFilter');

var _gaussianFilter2 = _interopRequireDefault(_gaussianFilter);

var _sobelFilter = require('./filter/sobelFilter');

var _sobelFilter2 = _interopRequireDefault(_sobelFilter);

var _level = require('./filter/level');

var _level2 = _interopRequireDefault(_level);

var _add = require('./filter/add');

var _add2 = _interopRequireDefault(_add);

var _subtract = require('./filter/subtract');

var _subtract2 = _interopRequireDefault(_subtract);

var _hypotenuse = require('./filter/hypotenuse');

var _hypotenuse2 = _interopRequireDefault(_hypotenuse);

var _multiply = require('./filter/multiply');

var _multiply2 = _interopRequireDefault(_multiply);

var _divide = require('./filter/divide');

var _divide2 = _interopRequireDefault(_divide);

var _background = require('./filter/background');

var _background2 = _interopRequireDefault(_background);

var _crop = require('./transform/crop');

var _crop2 = _interopRequireDefault(_crop);

var _scale = require('./transform/scale/scale');

var _scale2 = _interopRequireDefault(_scale);

var _hsv = require('./transform/hsv');

var _hsv2 = _interopRequireDefault(_hsv);

var _hsl = require('./transform/hsl');

var _hsl2 = _interopRequireDefault(_hsl);

var _cmyk = require('./transform/cmyk');

var _cmyk2 = _interopRequireDefault(_cmyk);

var _rgba = require('./transform/rgba8');

var _rgba2 = _interopRequireDefault(_rgba);

var _grey = require('./transform/grey');

var _grey2 = _interopRequireDefault(_grey);

var _mask = require('./transform/mask/mask');

var _mask2 = _interopRequireDefault(_mask);

var _pad = require('./transform/pad');

var _pad2 = _interopRequireDefault(_pad);

var _resizeBinary = require('./transform/resizeBinary');

var _resizeBinary2 = _interopRequireDefault(_resizeBinary);

var _colorDepth = require('./transform/colorDepth');

var _colorDepth2 = _interopRequireDefault(_colorDepth);

var _setBorder = require('./utility/setBorder');

var _setBorder2 = _interopRequireDefault(_setBorder);

var _split = require('./utility/split');

var _split2 = _interopRequireDefault(_split);

var _getChannel = require('./utility/getChannel');

var _getChannel2 = _interopRequireDefault(_getChannel);

var _combineChannels = require('./utility/combineChannels');

var _combineChannels2 = _interopRequireDefault(_combineChannels);

var _setChannel = require('./utility/setChannel');

var _setChannel2 = _interopRequireDefault(_setChannel);

var _getSimilarity = require('./utility/getSimilarity');

var _getSimilarity2 = _interopRequireDefault(_getSimilarity);

var _getPixelsGrid = require('./utility/getPixelsGrid');

var _getPixelsGrid2 = _interopRequireDefault(_getPixelsGrid);

var _getBestMatch = require('./utility/getBestMatch');

var _getBestMatch2 = _interopRequireDefault(_getBestMatch);

var _getRow = require('./utility/getRow');

var _getRow2 = _interopRequireDefault(_getRow);

var _getColumn = require('./utility/getColumn');

var _getColumn2 = _interopRequireDefault(_getColumn);

var _getMatrix = require('./utility/getMatrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

var _setMatrix = require('./utility/setMatrix');

var _setMatrix2 = _interopRequireDefault(_setMatrix);

var _getPixelsArray = require('./utility/getPixelsArray');

var _getPixelsArray2 = _interopRequireDefault(_getPixelsArray);

var _paintMasks = require('./operator/paintMasks');

var _paintMasks2 = _interopRequireDefault(_paintMasks);

var _paintPoints = require('./operator/paintPoints');

var _paintPoints2 = _interopRequireDefault(_paintPoints);

var _extract = require('./operator/extract');

var _extract2 = _interopRequireDefault(_extract);

var _convolution = require('./operator/convolution');

var _convolution2 = _interopRequireDefault(_convolution);

var _convolutionFft = require('./operator/convolutionFft');

var _convolutionFft2 = _interopRequireDefault(_convolutionFft);

var _histogram = require('./compute/histogram');

var _colorHistogram = require('./compute/colorHistogram');

var _colorHistogram2 = _interopRequireDefault(_colorHistogram);

var _min = require('./compute/min');

var _min2 = _interopRequireDefault(_min);

var _max = require('./compute/max');

var _max2 = _interopRequireDefault(_max);

var _sum = require('./compute/sum');

var _sum2 = _interopRequireDefault(_sum);

var _localMaxima = require('./compute/localMaxima');

var _localMaxima2 = _interopRequireDefault(_localMaxima);

var _mean = require('./compute/mean');

var _mean2 = _interopRequireDefault(_mean);

var _median = require('./compute/median');

var _median2 = _interopRequireDefault(_median);

var _points = require('./compute/points');

var _points2 = _interopRequireDefault(_points);

var _relativePosition = require('./compute/relativePosition');

var _relativePosition2 = _interopRequireDefault(_relativePosition);

var _svd = require('./compute/svd');

var _svd2 = _interopRequireDefault(_svd);

var _countAlphaPixels = require('./compute/countAlphaPixels');

var _countAlphaPixels2 = _interopRequireDefault(_countAlphaPixels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// computers


// utility
function extend(Image) {
    var inPlace = { inPlace: true };
    var inPlaceStack = { inPlace: true, stack: true };
    var stack = { stack: true };

    Image.extendMethod('invertGetSet', _invertGetSet2.default, inPlace);
    Image.extendMethod('invertIterator', _invertIterator2.default, inPlace);
    Image.extendMethod('invertPixel', _invertPixel2.default, inPlace);
    Image.extendMethod('invertOneLoop', _invertOneLoop2.default, inPlace);
    Image.extendMethod('invertApply', _invertApply2.default, inPlace);
    Image.extendMethod('invert', _invert2.default, inPlaceStack);
    Image.extendMethod('invertBinaryLoop', _invertBinaryLoop2.default, inPlace);
    Image.extendMethod('level', _level2.default, inPlace);
    Image.extendMethod('add', _add2.default, inPlace);
    Image.extendMethod('subtract', _subtract2.default, inPlace);
    Image.extendMethod('multiply', _multiply2.default, inPlace);
    Image.extendMethod('divide', _divide2.default, inPlace);
    Image.extendMethod('hypotenuse', _hypotenuse2.default);
    Image.extendMethod('background', _background2.default);
    Image.extendMethod('flipX', _flipX2.default);
    Image.extendMethod('flipY', _flipY2.default);

    Image.extendMethod('blurFilter', _blurFilter2.default);
    Image.extendMethod('medianFilter', _medianFilter2.default);
    Image.extendMethod('gaussianFilter', _gaussianFilter2.default);
    Image.extendMethod('sobelFilter', _sobelFilter2.default);

    Image.extendMethod('crop', _crop2.default, stack);
    Image.extendMethod('scale', _scale2.default, stack);
    Image.extendMethod('hsv', _hsv2.default);
    Image.extendMethod('hsl', _hsl2.default);
    Image.extendMethod('cmyk', _cmyk2.default);
    Image.extendMethod('rgba8', _rgba2.default);
    Image.extendMethod('grey', _grey2.default).extendMethod('gray', _grey2.default);
    Image.extendMethod('mask', _mask2.default);
    Image.extendMethod('pad', _pad2.default);
    Image.extendMethod('resizeBinary', _resizeBinary2.default);
    Image.extendMethod('colorDepth', _colorDepth2.default);
    Image.extendMethod('setBorder', _setBorder2.default, inPlace);

    Image.extendMethod('getRow', _getRow2.default);
    Image.extendMethod('getColumn', _getColumn2.default);
    Image.extendMethod('getMatrix', _getMatrix2.default);
    Image.extendMethod('setMatrix', _setMatrix2.default);
    Image.extendMethod('getPixelsArray', _getPixelsArray2.default);

    Image.extendMethod('split', _split2.default);
    Image.extendMethod('getChannel', _getChannel2.default);
    Image.extendMethod('combineChannels', _combineChannels2.default);
    Image.extendMethod('setChannel', _setChannel2.default);
    Image.extendMethod('getSimilarity', _getSimilarity2.default);
    Image.extendMethod('getPixelsGrid', _getPixelsGrid2.default);
    Image.extendMethod('getBestMatch', _getBestMatch2.default);

    Image.extendMethod('paintMasks', _paintMasks2.default, inPlace);
    Image.extendMethod('paintPoints', _paintPoints2.default, inPlace);
    Image.extendMethod('extract', _extract2.default);
    Image.extendMethod('convolution', _convolution2.default);
    Image.extendMethod('convolutionFft', _convolutionFft2.default);

    Image.extendMethod('countAlphaPixels', _countAlphaPixels2.default);
    Image.extendMethod('getHistogram', _histogram.getHistogram).extendProperty('histogram', _histogram.getHistogram);
    Image.extendMethod('getHistograms', _histogram.getHistograms).extendProperty('histograms', _histogram.getHistograms);
    Image.extendMethod('getColorHistogram', _colorHistogram2.default).extendProperty('colorHistogram', _colorHistogram2.default);
    Image.extendMethod('getMin', _min2.default).extendProperty('min', _min2.default);
    Image.extendMethod('getMax', _max2.default).extendProperty('max', _max2.default);
    Image.extendMethod('getSum', _sum2.default).extendProperty('sum', _sum2.default);
    Image.extendMethod('getLocalMaxima', _localMaxima2.default);
    Image.extendMethod('getMedian', _median2.default).extendProperty('median', _median2.default);
    Image.extendMethod('getMean', _mean2.default).extendProperty('mean', _mean2.default);
    Image.extendMethod('getPoints', _points2.default).extendProperty('points', _points2.default);
    Image.extendMethod('getRelativePosition', _relativePosition2.default);
    Image.extendMethod('getSvd', _svd2.default).extendProperty('svd', _svd2.default);
}

// operators


// transforms
// filters

},{"./compute/colorHistogram":147,"./compute/countAlphaPixels":148,"./compute/histogram":149,"./compute/localMaxima":150,"./compute/max":151,"./compute/mean":152,"./compute/median":153,"./compute/min":154,"./compute/points":155,"./compute/relativePosition":156,"./compute/sum":157,"./compute/svd":158,"./filter/add":161,"./filter/background":162,"./filter/blurFilter":163,"./filter/divide":164,"./filter/flipX":165,"./filter/flipY":166,"./filter/gaussianFilter":167,"./filter/hypotenuse":168,"./filter/invert":169,"./filter/invertApply":170,"./filter/invertBinaryLoop":171,"./filter/invertGetSet":172,"./filter/invertIterator":173,"./filter/invertOneLoop":174,"./filter/invertPixel":175,"./filter/level":176,"./filter/medianFilter":177,"./filter/multiply":178,"./filter/sobelFilter":179,"./filter/subtract":180,"./operator/convolution":186,"./operator/convolutionFft":187,"./operator/extract":188,"./operator/paintMasks":189,"./operator/paintPoints":190,"./transform/cmyk":199,"./transform/colorDepth":200,"./transform/crop":201,"./transform/grey":202,"./transform/hsl":204,"./transform/hsv":205,"./transform/mask/mask":210,"./transform/pad":223,"./transform/resizeBinary":224,"./transform/rgba8":225,"./transform/scale/scale":227,"./utility/combineChannels":228,"./utility/getBestMatch":230,"./utility/getChannel":231,"./utility/getColumn":232,"./utility/getMatrix":233,"./utility/getPixelsArray":234,"./utility/getPixelsGrid":235,"./utility/getRow":236,"./utility/getSimilarity":237,"./utility/setBorder":238,"./utility/setChannel":239,"./utility/setMatrix":240,"./utility/split":241}],161:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = add;

var _channel = require('../../util/channel');

var _value = require('../../util/value');

/**
 * Add a specific integer on the specified points of the specified channels
 * @memberof Image
 * @instance
 * @returns {Image} Modified current image
 */

function add(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channels = options.channels;

    this.checkProcessable('add', {
        bitDepth: [8, 16]
    });

    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });
    value = (0, _value.checkNumberArray)(value);

    // we allow 3 cases, the value may be an array (1D), an image or a single value
    if (!isNaN(value)) {
        for (var j = 0; j < channels.length; j++) {
            var c = channels[j];
            for (var i = 0; i < this.data.length; i += this.channels) {
                this.data[i + c] = Math.min(this.maxValue, this.data[i + c] + value >> 0);
            }
        }
    } else {
        if (this.data.length !== value.length) {
            throw new Error('add: the data size is different');
        }
        for (var _j = 0; _j < channels.length; _j++) {
            var _c = channels[_j];
            for (var _i = 0; _i < this.data.length; _i += this.channels) {
                this.data[_i + _c] = Math.max(0, Math.min(this.maxValue, this.data[_i + _c] + value[_i + _c] >> 0));
            }
        }
    }
}

},{"../../util/channel":254,"../../util/value":263}],162:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = background;

var _mlRegression = require('ml-regression');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

function background(coordinates, values, options) {
    var model = new _mlRegression.KernelRidgeRegression(coordinates, values, options);
    var allCoordinates = new Array(this.size);
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            allCoordinates[j * this.width + i] = [i, j];
        }
    }
    var result = model.predict(allCoordinates);
    var background = _Image2.default.createFrom(this);
    for (var _i = 0; _i < this.size; _i++) {
        background.data[_i] = Math.min(this.maxValue, Math.max(0, result[_i][0]));
    }
    return background;
}

},{"../Image":145,"ml-regression":98}],163:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = blurFilter;

var _convolutionFft = require('../operator/convolutionFft');

var _convolutionFft2 = _interopRequireDefault(_convolutionFft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply a filter to blur the image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {number} [options.radius=1] : number of pixels around the current pixel to average
 * @returns {Image}
 */

// first release of mean filter
function blurFilter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$radius = options.radius;
    var radius = _options$radius === undefined ? 1 : _options$radius;

    this.checkProcessable('meanFilter', {
        components: [1],
        bitDepth: [8, 16]
    });

    if (radius < 1) {
        throw new Error('Number of neighbors should be grater than 0');
    }

    var n = 2 * radius + 1;
    var size = n * n;
    var kernel = new Array(size);

    for (var i = 0; i < kernel.length; i++) {
        kernel[i] = 1;
    }

    return _convolutionFft2.default.call(this, kernel);
}

},{"../operator/convolutionFft":187}],164:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = divide;

var _channel = require('../../util/channel');

var _value = require('../../util/value');

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

function divide(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channels = options.channels;

    this.checkProcessable('divide', {
        bitDepth: [8, 16]
    });

    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });
    value = (0, _value.checkNumberArray)(value);

    if (!isNaN(value)) {
        for (var j = 0; j < channels.length; j++) {
            var c = channels[j];
            for (var i = 0; i < this.data.length; i += this.channels) {
                this.data[i + c] = Math.min(this.maxValue, this.data[i + c] / value >> 0);
            }
        }
    } else {
        if (this.data.length !== value.length) {
            throw new Error('divide: the: the data size is different');
        }
        for (var _j = 0; _j < channels.length; _j++) {
            var _c = channels[_j];
            for (var _i = 0; _i < this.data.length; _i += this.channels) {
                this.data[_i + _c] = Math.max(0, Math.min(this.maxValue, this.data[_i + _c] / value[_i + _c] >> 0));
            }
        }
    }
}

},{"../../util/channel":254,"../../util/value":263}],165:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = flipX;
/**
 * Flip an image horizontally.
 * @memberof Image
 * @instance
 * @returns {this}
 */

function flipX() {
    this.checkProcessable('flipX', {
        bitDepth: [8, 16]
    });

    for (var i = 0; i < this.height; i++) {

        var offsetY = i * this.width * this.channels;

        for (var j = 0; j < Math.floor(this.width / 2); j++) {

            var posCurrent = j * this.channels + offsetY;
            var posOpposite = (this.width - j - 1) * this.channels + offsetY;

            for (var k = 0; k < this.channels; k++) {
                var tmp = this.data[posCurrent + k];
                this.data[posCurrent + k] = this.data[posOpposite + k];
                this.data[posOpposite + k] = tmp;
            }
        }
    }

    return this;
}

},{}],166:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = flipY;
/**
 * Flip an image vertically. The image
 * @memberof Image
 * @instance
 * @returns {this}
 */

function flipY() {
    this.checkProcessable('flipY', {
        bitDepth: [8, 16]
    });

    for (var i = 0; i < Math.floor(this.height / 2); i++) {

        for (var j = 0; j < this.width; j++) {
            var posCurrent = j * this.channels + i * this.width * this.channels;
            var posOpposite = j * this.channels + (this.height - 1 - i) * this.channels * this.width;

            for (var k = 0; k < this.channels; k++) {
                var tmp = this.data[posCurrent + k];
                this.data[posCurrent + k] = this.data[posOpposite + k];
                this.data[posOpposite + k] = tmp;
            }
        }
    }

    return this;
}

},{}],167:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = gaussianFilter;

var _convolution = require('../operator/convolution');

var _convolution2 = _interopRequireDefault(_convolution);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply a gaussian filter to the image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {number} [options.radius=1] : number of pixels around the current pixel
 * @param {number} [options.sigma]
 * @param {number[]|string[]} [options.channels] : to which channel to apply the filter. By default all but alpha.
 * @param {string} [options.border='copy']
 * @param {boolean} [options.algorithm='auto'] : Algorithm for convolution {@link Image#convolution}
 * @returns {Image}
 */

function gaussianFilter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$radius = options.radius;
    var radius = _options$radius === undefined ? 1 : _options$radius;
    var sigma = options.sigma;
    var channels = options.channels;
    var _options$border = options.border;
    var border = _options$border === undefined ? 'copy' : _options$border;
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'auto' : _options$algorithm;

    this.checkProcessable('gaussian', {
        bitDepth: [8, 16]
    });

    var kernel = void 0;
    if (sigma) {
        kernel = getSigmaKernel(sigma);
    } else {
        // sigma approximation using radius
        sigma = 0.3 * (radius - 1) + 0.8;
        kernel = getKernel(radius, sigma);
    }

    return _convolution2.default.call(this, kernel, {
        border: border,
        channels: channels,
        algorithm: algorithm
    });
}

function getKernel(radius, sigma) {
    if (radius < 1) {
        throw new RangeError('Radius should be grater than 0');
    }
    var n = 2 * radius + 1;

    var kernel = new Array(n * n);

    //gaussian kernel is calculated
    var sigma2 = 2 * (sigma * sigma); //2*sigma^2
    var PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2

    for (var i = 0; i <= radius; i++) {
        for (var j = i; j <= radius; j++) {
            var value = Math.exp(-(i * i + j * j) / sigma2) / PI2sigma2;
            kernel[(i + radius) * n + (j + radius)] = value;
            kernel[(i + radius) * n + (-j + radius)] = value;
            kernel[(-i + radius) * n + (j + radius)] = value;
            kernel[(-i + radius) * n + (-j + radius)] = value;
            kernel[(j + radius) * n + (i + radius)] = value;
            kernel[(j + radius) * n + (-i + radius)] = value;
            kernel[(-j + radius) * n + (i + radius)] = value;
            kernel[(-j + radius) * n + (-i + radius)] = value;
        }
    }
    return kernel;
}

function getSigmaKernel(sigma) {
    if (sigma <= 0) {
        throw new RangeError('Sigma should be grater than 0');
    }
    var sigma2 = 2 * (sigma * sigma); //2*sigma^2
    var PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2
    var value = 1 / PI2sigma2;
    var sum = value;
    var neighbors = 0;

    while (sum < 0.99) {
        neighbors++;
        value = Math.exp(-(neighbors * neighbors) / sigma2) / PI2sigma2;
        sum += 4 * value;
        for (var i = 1; i < neighbors; i++) {
            value = Math.exp(-(i * i + neighbors * neighbors) / sigma2) / PI2sigma2;
            sum += 8 * value;
        }
        value = 4 * Math.exp(-(2 * neighbors * neighbors) / sigma2) / PI2sigma2;
        sum += value;
    }

    // What does this case mean ?
    if (sum > 1) {
        throw new Error('unexpected sum over 1');
    }

    return getKernel(neighbors, sigma);
}

},{"../operator/convolution":186}],168:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hypotenuse;

var _channel = require('../../util/channel');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calculate a new image that is the hypotenuse between the current image and the otherImage.
 * @memberof Image
 * @instance
 * @param {Image} otherImage
 * @param {object} [options={}]
 * @param {number} [options.bitDepth=this.bitDepth]
 * @param {number[]|string[]} [options.channels] : to which channel to apply the filter. By default all but alpha.
 * @return {Image}
 */
function hypotenuse(otherImage) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$bitDepth = options.bitDepth;
    var bitDepth = _options$bitDepth === undefined ? this.bitDepth : _options$bitDepth;
    var channels = options.channels;

    this.checkProcessable('hypotenuse', {
        bitDepth: [8, 16, 32]
    });
    if (this.width !== otherImage.width || this.height !== otherImage.height) {
        throw new Error('hypotenuse: both images must have the same size');
    }
    if (this.alpha !== otherImage.alpha || this.bitDepth !== otherImage.bitDepth) {
        throw new Error('hypotenuse: both images must have the same alpha and bitDepth');
    }
    if (this.channels !== otherImage.channels) {
        throw new Error('hypotenuse: both images must have the same number of channels');
    }

    var newImage = _Image2.default.createFrom(this, { bitDepth: bitDepth });

    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });

    var clamped = newImage.isClamped;

    for (var j = 0; j < channels.length; j++) {
        var c = channels[j];
        for (var i = c; i < this.data.length; i += this.channels) {
            var value = Math.sqrt(this.data[i] * this.data[i] + otherImage.data[i] * otherImage.data[i]);
            if (clamped) {
                // we calculate the clamped result
                newImage.data[i] = Math.min(Math.max(Math.round(value), 0), newImage.maxValue);
            } else {
                newImage.data[i] = value;
            }
        }
    }

    return newImage;
}

},{"../../util/channel":254,"../Image":145}],169:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invert;

var _channel = require('../../util/channel');

/**
 * Invert an image. The image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {(undefined|number|string|[number]|[string])} [options.channels=undefined] Specify which channels should be processed
 *      * undefined : we take all the channels but alpha
 *      * number : this specific channel
 *      * string : converted to a channel based on rgb, cmyk, hsl or hsv (one letter code)
 *      * [number] : array of channels as numbers
 *      * [string] : array of channels as one letter string
 * @returns {this}
 */

function invert() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var channels = options.channels;


    this.checkProcessable('invertOneLoop', {
        bitDepth: [1, 8, 16]
    });

    if (this.bitDepth === 1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            data[i] = ~data[i];
        }
    } else {
        channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });

        for (var c = 0; c < channels.length; c++) {
            var j = channels[c];
            for (var _i = j; _i < this.data.length; _i += this.channels) {
                this.data[_i] = this.maxValue - this.data[_i];
            }
        }
    }
} // we try the faster methods

},{"../../util/channel":254}],170:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invertApply;
// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

function invertApply() {

    if (this.bitDepth === 1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            data[i] = ~data[i];
        }
    } else {
        this.checkProcessable('invertApply', {
            bitDepth: [8, 16]
        });
        this.apply(function (index) {
            for (var k = 0; k < this.components; k++) {
                this.data[index + k] = this.maxValue - this.data[index + k];
            }
        });
    }
}

},{}],171:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invertBinaryLoop;
function invertBinaryLoop() {
    this.checkProcessable('invertBinaryLoop', {
        bitDepth: [1]
    });

    for (var i = 0; i < this.size; i++) {
        this.toggleBit(i);
    }
}

},{}],172:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invert;
function invert() {
    this.checkProcessable('invert', {
        bitDepth: [1, 8, 16]
    });

    if (this.bitDepth === 1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            data[i] = ~data[i];
        }
    } else {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                for (var k = 0; k < this.components; k++) {
                    var value = this.getValueXY(x, y, k);
                    this.setValueXY(x, y, k, this.maxValue - value);
                }
            }
        }
    }
}

},{}],173:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invertIterator;
function invertIterator() {
    this.checkProcessable('invert', {
        bitDepth: [1, 8, 16]
    });

    if (this.bitDepth === 1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            data[i] = ~data[i];
        }
    } else {
        for (var _ref of this.pixels()) {
            var index = _ref.index;
            var pixel = _ref.pixel;

            for (var k = 0; k < this.components; k++) {
                this.setValue(index, k, this.maxValue - pixel[k]);
            }
        }
    }
}

},{}],174:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invertOneLoop;
function invertOneLoop() {
    this.checkProcessable('invertOneLoop', {
        bitDepth: [8, 16]
    });

    var data = this.data;
    for (var i = 0; i < data.length; i += this.channels) {
        for (var j = 0; j < this.components; j++) {
            data[i + j] = this.maxValue - data[i + j];
        }
    }
}

},{}],175:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = invertPixel;
// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

function invertPixel() {
    this.checkProcessable('invertPixel', {
        bitDepth: [8, 16]
    });

    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var value = this.getPixelXY(x, y);
            for (var k = 0; k < this.components; k++) {
                value[k] = this.maxValue - value[k];
            }
            this.setPixelXY(x, y, value);
        }
    }
}

},{}],176:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = level;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

var _channel = require('../../util/channel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Level the image for by default have the minimal and maximal values.
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {(undefined|number|string|[number]|[string])} [options.channels=undefined] Specify which channels should be processed
 *      * undefined : we take all the channels but alpha
 *      * number : this specific channel
 *      * string : converted to a channel based on rgb, cmyk, hsl or hsv (one letter code)
 *      * [number] : array of channels as numbers
 *      * [string] : array of channels as one letter string
 * @param {number} [options.min=this.min] minimal value after levelling
 * @param {number} [options.max=this.max] maximal value after levelling
 * @returns {Image}
 */

function level() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'range' : _options$algorithm;
    var channels = options.channels;
    var _options$min = options.min;
    var min = _options$min === undefined ? this.min : _options$min;
    var _options$max = options.max;
    var max = _options$max === undefined ? this.max : _options$max;


    this.checkProcessable('level', {
        bitDepth: [8, 16]
    });

    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });

    switch (algorithm) {

        case 'range':
            if (min < 0) {
                min = 0;
            }
            if (max > this.maxValue) {
                max = this.maxValue;
            }

            if (!Array.isArray(min)) {
                min = (0, _newArray2.default)(channels.length, min);
            }
            if (!Array.isArray(max)) {
                max = (0, _newArray2.default)(channels.length, max);
            }

            processImage(this, min, max, channels);
            break;

        default:
            throw new Error('level: algorithm not implement: ' + algorithm);
    }
}

function processImage(image, min, max, channels) {
    var delta = 1e-5; // sorry no better value that this "best guess"
    var factor = new Array(image.channels);

    for (var c of channels) {
        if (min[c] === 0 && max[c] === image.maxValue) {
            factor[c] = 0;
        } else if (max[c] === min[c]) {
            factor[c] = 0;
        } else {
            factor[c] = (image.maxValue + 1 - delta) / (max[c] - min[c]);
        }
        min[c] += (0.5 - delta / 2) / factor[c];
    }

    /*
     Note on border effect
     For 8 bits images we should calculate for the space between -0.5 and 255.5
     so that after ronding the first and last points still have the same population
     But doing this we need to deal with Math.round that gives 256 if the value is 255.5
     */

    for (var j = 0; j < channels.length; j++) {
        var _c = channels[j];
        if (factor[_c] !== 0) {
            for (var i = 0; i < image.data.length; i += image.channels) {
                image.data[i + _c] = Math.min(Math.max(0, (image.data[i + _c] - min[_c]) * factor[_c] + 0.5 | 0), image.maxValue);
            }
        }
    }
}

},{"../../util/channel":254,"new-array":113}],177:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = medianFilter;

var _channel = require('../../util/channel');

var _numSort = require('num-sort');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Each pixel of the image becomes the median of the neightbour
 * pixels.
 * @memberof Image
* @instance
* @param {object} options
* @param {(undefined|number|string|[number]|[string])} [options.channels=undefined] Specify which channels should be processed
*      * undefined : we take all the channels but alpha
*      * number : this specific channel
*      * string : converted to a channel based on rgb, cmyk, hsl or hsv (one letter code)
*      * [number] : array of channels as numbers
*      * [string] : array of channels as one letter string
* @param {number} [options.radius=1] distance of the square to take the mean of.
* @param {string} [options.border='copy'] algorithm that will be applied after to deal with borders
* @return {Image}
*/
function medianFilter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$radius = options.radius;
    var radius = _options$radius === undefined ? 1 : _options$radius;
    var channels = options.channels;
    var _options$border = options.border;
    var border = _options$border === undefined ? 'copy' : _options$border;


    this.checkProcessable('median', {
        bitDepth: [8, 16]
    });

    if (radius < 1) {
        throw new Error('Kernel radius should be greater than 0');
    }

    channels = (0, _channel.validateArrayOfChannels)(this, channels, true);

    var kWidth = radius;
    var kHeight = radius;
    var newImage = _Image2.default.createFrom(this);

    var size = (kWidth * 2 + 1) * (kHeight * 2 + 1);
    var middle = Math.floor(size / 2);
    var kernel = new Array(size);

    for (var channel = 0; channel < channels.length; channel++) {
        var c = channels[channel];
        for (var y = kHeight; y < this.height - kHeight; y++) {
            for (var x = kWidth; x < this.width - kWidth; x++) {
                var n = 0;
                for (var j = -kHeight; j <= kHeight; j++) {
                    for (var i = -kWidth; i <= kWidth; i++) {
                        var _index = ((y + j) * this.width + x + i) * this.channels + c;
                        kernel[n++] = this.data[_index];
                    }
                }
                var index = (y * this.width + x) * this.channels + c;
                var newValue = kernel.sort(_numSort.asc)[middle];

                newImage.data[index] = newValue;
            }
        }
    }
    if (this.alpha && !channels.includes(this.channels)) {
        for (var _i = this.components; _i < this.data.length; _i = _i + this.channels) {
            newImage.data[_i] = this.data[_i];
        }
    }

    newImage.setBorder({ size: [kWidth, kHeight], algorithm: border });

    return newImage;
} //End median function

},{"../../util/channel":254,"../Image":145,"num-sort":114}],178:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = multiply;

var _channel = require('../../util/channel');

var _value = require('../../util/value');

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

function multiply(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channels = options.channels;

    this.checkProcessable('multiply', {
        bitDepth: [8, 16]
    });
    if (value <= 0) {
        throw new Error('multiply: the value must be greater than 0');
    }

    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });
    value = (0, _value.checkNumberArray)(value);

    if (!isNaN(value)) {
        for (var j = 0; j < channels.length; j++) {
            var c = channels[j];
            for (var i = 0; i < this.data.length; i += this.channels) {
                this.data[i + c] = Math.min(this.maxValue, this.data[i + c] * value >> 0);
            }
        }
    } else {
        if (this.data.length !== value.length) {
            throw new Error('multiply: the data size is different');
        }
        for (var _j = 0; _j < channels.length; _j++) {
            var _c = channels[_j];
            for (var _i = 0; _i < this.data.length; _i += this.channels) {
                this.data[_i + _c] = Math.max(0, Math.min(this.maxValue, this.data[_i + _c] * value[_i + _c] >> 0));
            }
        }
    }
}

},{"../../util/channel":254,"../../util/value":263}],179:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = sobelFilter;

var _convolution = require('../operator/convolution');

var _convolution2 = _interopRequireDefault(_convolution);

var _kernels = require('../../util/kernels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

function sobelFilter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$kernelX = options.kernelX;
    var kernelX = _options$kernelX === undefined ? _kernels.GRADIENT_X : _options$kernelX;
    var _options$kernelY = options.kernelY;
    var kernelY = _options$kernelY === undefined ? _kernels.GRADIENT_Y : _options$kernelY;
    var _options$border = options.border;
    var border = _options$border === undefined ? 'copy' : _options$border;
    var channels = options.channels;


    this.checkProcessable('sobel', {
        bitDepth: [8, 16]
    });

    var gX = _convolution2.default.call(this, kernelX, {
        channels: channels,
        border: border,
        bitDepth: 32
    });

    var gY = _convolution2.default.call(this, kernelY, {
        channels: channels,
        border: border,
        bitDepth: 32
    });

    return gX.hypotenuse(gY, { bitDepth: this.bitDepth, channels: channels });
}

},{"../../util/kernels":260,"../operator/convolution":186}],180:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = subtract;

var _channel = require('../../util/channel');

var _value = require('../../util/value');

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

function subtract(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channels = options.channels;

    this.checkProcessable('subtract', {
        bitDepth: [8, 16]
    });

    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });
    value = (0, _value.checkNumberArray)(value);

    if (!isNaN(value)) {
        for (var j = 0; j < channels.length; j++) {
            var c = channels[j];
            for (var i = 0; i < this.data.length; i += this.channels) {
                this.data[i + c] = Math.max(0, this.data[i + c] - value >> 0);
            }
        }
    } else {
        if (this.data.length !== value.length) {
            throw new Error('substract: the data size is different');
        }
        for (var _j = 0; _j < channels.length; _j++) {
            var _c = channels[_j];
            for (var _i = 0; _i < this.data.length; _i += this.channels) {
                this.data[_i + _c] = Math.max(0, Math.min(this.maxValue, this.data[_i + _c] - value[_i + _c] >> 0));
            }
        }
    }
}

},{"../../util/channel":254,"../../util/value":263}],181:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getKind = getKind;
exports.getTheoreticalPixelArraySize = getTheoreticalPixelArraySize;
exports.createPixelArray = createPixelArray;

var _kindNames = require('./kindNames');

var Kind = _interopRequireWildcard(_kindNames);

var _model = require('./model/model');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var kinds = {};

kinds[Kind.BINARY] = {
    components: 1,
    alpha: 0,
    bitDepth: 1,
    colorModel: _model.GREY
};

kinds[Kind.GREYA] = {
    components: 1,
    alpha: 1,
    bitDepth: 8,
    colorModel: _model.GREY
};

kinds[Kind.GREY] = {
    components: 1,
    alpha: 0,
    bitDepth: 8,
    colorModel: _model.GREY
};

kinds[Kind.RGBA] = {
    components: 3,
    alpha: 1,
    bitDepth: 8,
    colorModel: _model.RGB
};

kinds[Kind.RGB] = {
    components: 3,
    alpha: 0,
    bitDepth: 8,
    colorModel: _model.RGB
};

kinds[Kind.CMYK] = {
    components: 4,
    alpha: 0,
    bitDepth: 8,
    colorModel: _model.CMYK
};

kinds[Kind.CMYKA] = {
    components: 4,
    alpha: 1,
    bitDepth: 8,
    colorModel: _model.CMYK
};

function getKind(kind) {
    return kinds[kind];
}

function getTheoreticalPixelArraySize(image) {
    var length = image.channels * image.size;
    if (image.bitDepth === 1) {
        length = Math.ceil(length / 8);
    }
    return length;
}

function createPixelArray(image) {
    var length = image.channels * image.size;
    var arr = void 0;
    switch (image.bitDepth) {
        case 1:
            arr = new Uint8Array(Math.ceil(length / 8));
            break;
        case 8:
            arr = new Uint8ClampedArray(length);
            break;
        case 16:
            arr = new Uint16Array(length);
            break;
        case 32:
            arr = new Float32Array(length);
            break;
        default:
            throw new Error('Cannot create pixel array for bit depth ' + image.bitDepth);
    }

    // alpha channel is 100% by default
    if (image.alpha) {
        for (var i = image.components; i < arr.length; i += image.channels) {
            arr[i] = image.maxValue;
        }
    }
    image.data = arr;
}

},{"./kindNames":182,"./model/model":185}],182:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Shortcuts for common image kinds

var BINARY = exports.BINARY = 'BINARY';
var GREY = exports.GREY = 'GREY';
var GREYA = exports.GREYA = 'GREYA';
var RGB = exports.RGB = 'RGB';
var RGBA = exports.RGBA = 'RGBA';
var CMYK = exports.CMYK = 'CMYK';
var CMYKA = exports.CMYKA = 'CMYKA';

},{}],183:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadURL = loadURL;

var _Image = require('./Image');

var _Image2 = _interopRequireDefault(_Image);

var _Stack = require('../stack/Stack');

var _Stack2 = _interopRequireDefault(_Stack);

var _environment = require('./environment');

var _fastPng = require('fast-png');

var _fastJpeg = require('fast-jpeg');

var _tiff = require('tiff');

var _atobLite = require('atob-lite');

var _atobLite2 = _interopRequireDefault(_atobLite);

var _imageType = require('image-type');

var _imageType2 = _interopRequireDefault(_imageType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDataURL = /^data:[a-z]+\/([a-z]+);base64,/;

function str2ab(str) {
    var arr = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

function swap16(val) {
    return (val & 0xFF) << 8 | val >> 8 & 0xFF;
}

function loadURL(url, options) {
    var dataURL = url.slice(0, 64).match(isDataURL);
    var binaryDataP = void 0;
    if (dataURL) {
        binaryDataP = Promise.resolve(str2ab((0, _atobLite2.default)(url.slice(dataURL[0].length))));
    } else {
        binaryDataP = (0, _environment.loadBinary)(url, options);
    }
    return binaryDataP.then(function (binaryData) {
        var uint8 = new Uint8Array(binaryData);
        var type = (0, _imageType2.default)(uint8);
        if (type) {
            switch (type.ext) {
                case 'png':
                    return loadPNG(binaryData);
                case 'jpg':
                    {
                        var decoded = (0, _fastJpeg.decode)(binaryData);
                        var meta = void 0;
                        if (decoded.exif) {
                            meta = getMetadata(decoded.exif);
                        }
                        return loadGeneric(url, { meta: meta });
                    }
                case 'tif':
                    return loadTIFF(binaryData);
                // no default
            }
        }
        return loadGeneric(url);
    });
}

function loadPNG(data) {
    var decoder = new _fastPng.PNGDecoder(data);
    var png = decoder.decode();
    var bitDepth = png.bitDepth;
    var buffer = png.data.buffer;
    var bitmap = void 0;
    if (bitDepth === 8) {
        bitmap = new Uint8ClampedArray(buffer);
    } else if (bitDepth === 16) {
        bitmap = new Uint16Array(buffer);
        for (var i = 0; i < bitmap.length; i++) {
            bitmap[i] = swap16(bitmap[i]);
        }
    }

    var type = png.colourType;
    var components = void 0,
        alpha = 0;
    switch (type) {
        case 0:
            components = 1;break;
        case 2:
            components = 3;break;
        case 4:
            components = 1;alpha = 1;break;
        case 6:
            components = 3;alpha = 1;break;
        default:
            throw new Error(`Unexpected colourType: ${ type }`);
    }

    return new _Image2.default(png.width, png.height, bitmap, { components: components, alpha: alpha, bitDepth: bitDepth });
}

function loadTIFF(data) {
    var result = (0, _tiff.decode)(data);
    if (result.length === 1) {
        return getImageFromIFD(result[0]);
    } else {
        return new _Stack2.default(result.map(getImageFromIFD));
    }
}

function getMetadata(image) {
    var metadata = {
        tiff: image
    };
    if (image.exif) {
        metadata.exif = image.exif;
    }
    if (image.gps) {
        metadata.gps = image.gps;
    }
    return metadata;
}

function getImageFromIFD(image) {
    return new _Image2.default(image.width, image.height, image.data, {
        components: 1,
        alpha: 0,
        colorModel: null,
        bitDepth: image.bitsPerSample,
        meta: getMetadata(image)
    });
}

function loadGeneric(url, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
        var image = new _environment.DOMImage();

        if ((0, _environment.isDifferentOrigin)(url)) {
            // see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            image.crossOrigin = 'Anonymous';
        }

        image.onload = function () {
            var w = image.width,
                h = image.height;
            var canvas = new _environment.Canvas(w, h);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, w, h);
            var data = ctx.getImageData(0, 0, w, h).data;
            resolve(new _Image2.default(w, h, data, options));
        };
        image.onerror = function () {
            reject(new Error('Could not load ' + url));
        };
        image.src = url;
    });
}

},{"../stack/Stack":245,"./Image":145,"./environment":159,"atob-lite":5,"fast-jpeg":37,"fast-png":39,"image-type":46,"tiff":137}],184:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.canWrite = canWrite;
exports.getType = getType;

var _Image = require('./Image');

var _Image2 = _interopRequireDefault(_Image);

var _environment = require('./environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var types = new Map();
var image = void 0;

function getMediaType(type) {
    if (!image) {
        image = new _Image2.default(1, 1);
    }
    var theType = types.get(type);
    if (!theType) {
        theType = new MediaType(type);
        types.set(type, theType);
    }
    return theType;
}

function canWrite(type) {
    if (_environment.env === 'node' && type !== 'image/png') {
        return false; // node-canvas throws for other types
    } else {
        return getMediaType(type).canWrite();
    }
}

class MediaType {
    constructor(type) {
        this.type = type;
        this._canWrite = null;
    }

    canWrite() {
        if (this._canWrite === null) {
            this._canWrite = image.toDataURL(this.type).startsWith('data:' + this.type);
        }
        return this._canWrite;
    }
}

function getType(type) {
    if (!type.includes('/')) {
        type = 'image/' + type;
    }
    return type;
}

},{"./Image":145,"./environment":159}],185:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RGB = exports.RGB = 'RGB';
var HSL = exports.HSL = 'HSL';
var HSV = exports.HSV = 'HSV';
var CMYK = exports.CMYK = 'CMYK';
var GREY = exports.GREY = 'GREY';

},{}],186:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = convolution;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _channel = require('../../util/channel');

var _kernel = require('../../util/kernel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conv = require('ml-matrix-convolution');

/**
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} kernel
 * @param {object} [options] - options
 * @param {Array} [options.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [options.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [options.normalize=false]
 * @param {number} [options.divisor=1]
 * @param {string} [options.border='copy']
 * @param {string} [options.algorithm='auto'] - Either 'auto', 'direct' or 'fft'. fft is much faster for large kernel.
 * @return {Image}
 */
function convolution(kernel) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channels = options.channels;
    var bitDepth = options.bitDepth;
    var _options$normalize = options.normalize;
    var normalize = _options$normalize === undefined ? false : _options$normalize;
    var _options$divisor = options.divisor;
    var divisor = _options$divisor === undefined ? 1 : _options$divisor;
    var _options$border = options.border;
    var border = _options$border === undefined ? 'copy' : _options$border;
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'auto' : _options$algorithm;


    var newImage = _Image2.default.createFrom(this, { bitDepth: bitDepth });

    channels = (0, _channel.validateArrayOfChannels)(this, channels, true);
    //let kWidth, kHeight;
    //Very mysterious function. If the kernel is an array only one quadrant is copied to the output matrix,
    //but if the kernel is already a matrix, nothing is done.
    //On the other hand, it only consider odd, squared and symmetric kernels. A too restrictive
    //({kWidth, kHeight, kernel} = validateKernel(kernel));

    var _validateKernel = (0, _kernel.validateKernel)(kernel);

    kernel = _validateKernel.kernel;


    if (algorithm === 'auto') {
        if (kernel.length > 9 || kernel[0].length > 9) {
            algorithm = 'fft';
        } else {
            algorithm = 'direct';
        }
    }
    if (this.width > 4096 || this.height > 4096) {
        algorithm = 'direct';
    }

    var halfHeight = Math.floor(kernel.length / 2);
    var halfWidth = Math.floor(kernel[0].length / 2);
    var clamped = newImage.isClamped;

    var tmpData = new Array(this.height * this.width);
    var index = void 0,
        x = void 0,
        y = void 0,
        channel = void 0,
        c = void 0,
        tmpResult = void 0;
    for (channel = 0; channel < channels.length; channel++) {
        c = channels[channel];
        //Copy the channel in a single array
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                index = y * this.width + x;
                tmpData[index] = this.data[index * this.channels + c];
            }
        }
        if (algorithm === 'direct') {
            tmpResult = conv.direct(tmpData, kernel, {
                rows: this.height,
                cols: this.width,
                normalize: normalize,
                divisor: divisor
            });
        } else {
            tmpResult = conv.fft(tmpData, kernel, {
                rows: this.height,
                cols: this.width,
                normalize: normalize,
                divisor: divisor
            });
        }

        //Copy the result to the output image
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                index = y * this.width + x;
                if (clamped) {
                    newImage.data[index * this.channels + c] = Math.min(Math.max(tmpResult[index], 0), newImage.maxValue);
                } else {
                    newImage.data[index * this.channels + c] = tmpResult[index];
                }
            }
        }
    }
    // if the kernel was not applied on the alpha channel we just copy it
    // TODO: in general we should copy the channels that where not changed
    // TODO: probably we should just copy the image at the beginning ?
    if (this.alpha && !channels.includes(this.channels)) {
        for (x = this.components; x < this.data.length; x = x + this.channels) {
            newImage.data[x] = this.data[x];
        }
    }

    //I only can have 3 types of borders:
    //  1. Considering the image as periodic: periodic
    //  2. Extend the interior borders: copy
    //  3. fill with a color: set
    if (border !== 'periodic') {
        newImage.setBorder({ size: [halfWidth, halfHeight], algorithm: border });
    }

    return newImage;
}

},{"../../util/channel":254,"../../util/kernel":259,"../Image":145,"ml-matrix-convolution":77}],187:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convolutionFft;
/**
 * @memberof Image
 * @instance
 * @param {[[number]]} kernel
 * @param {object} [$1] - options
 * @param {array} [$1.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [$1.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [$1.normalize=false]
 * @param {number} [$1.divisor=1]
 * @param {string} [$1.border='copy']
 * @returns {Image}
 */

function convolutionFft(kernel) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.algorithm = 'fft';
  return this.convolution(kernel, options);
}

},{}],188:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extract;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extracts a part of an original image based on a mask. By default the mask may contain
 * a relative position and this part of the original image will be extracted.
 * @memberof Image
 * @instance
 * @param {Image} mask - Image containing a binary mask
 * @param {object} [options]
 * @param {number[]} [options.position] - Array of 2 elements to force the x,y coordinates
 * @return {Image} A new image
 */
function extract(mask) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var position = options.position;

    this.checkProcessable('extract', {
        bitDepth: [8, 16]
    });

    // we need to find the relative position to the parent
    if (!position) {
        position = mask.getRelativePosition(this);
        if (!position) {
            throw new Error('extract : can not extract an image because the relative position can not be ' + 'determined, try to specify manually the position as an array of 2 elements [x,y].');
        }
    }

    var extract = _Image2.default.createFrom(this, {
        width: mask.width,
        height: mask.height,
        alpha: 1, // we force the alpha, otherwise difficult to extract a mask ...
        position: position,
        parent: this
    });

    for (var x = 0; x < mask.width; x++) {
        for (var y = 0; y < mask.height; y++) {
            // we copy the point
            for (var channel = 0; channel < this.channels; channel++) {
                var value = this.getValueXY(x + position[0], y + position[1], channel);
                extract.setValueXY(x, y, channel, value);
            }
            // we make it transparent in case it is not in the mask
            if (!mask.getBitXY(x, y)) {
                extract.setValueXY(x, y, this.components, 0);
            }
        }
    }

    return extract;
}

},{"../Image":145}],189:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = paintMasks;

var _model = require('../model/model');

var _color = require('../../util/color');

/**
 * Paint a mask or masks on the current image.
 * @memberof Image
 * @instance
 * @param {(Image|Image[])}     masks - Image containing a binary mask
 * @param {object}              [options]
 * @param {[number]|string}     [options.color='red'] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {number[][]} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
 * @param {number}              [options.alpha=255\ - Value from 0 to 255 to specify the alpha.
 * @param {boolean}             [options.randomColors=false] - To paint each mask with a random color
 * @param {boolean}             [options.distinctColors=false] - To paint each mask with a different color
 * @param {string[]}       [options.labels] - Array of labels to display. Should the the same size as masks.
 * @param {number[][]} [options.labelsPosition] - Array of points [x,y] where the labels should be displayed.
 *                                      By default it is the 0,0 position of the correesponding mask.
 * @param {string}              [options.labelColor='blue'] - Define the color to paint the labels
 * @param {string}              [options.labelFont='12px Helvetica'] - Paint the labels in a different CSS style

 *
 * @returns {Image} The original painted image
 */

function paintMasks(masks) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$color = options.color;
    var color = _options$color === undefined ? 'red' : _options$color;
    var colors = options.colors;
    var _options$alpha = options.alpha;
    var alpha = _options$alpha === undefined ? 255 : _options$alpha;
    var _options$randomColors = options.randomColors;
    var randomColors = _options$randomColors === undefined ? false : _options$randomColors;
    var _options$distinctColo = options.distinctColors;
    var distinctColors = _options$distinctColo === undefined ? false : _options$distinctColo;
    var _options$labels = options.labels;
    var labels = _options$labels === undefined ? [] : _options$labels;
    var _options$labelsPositi = options.labelsPosition;
    var labelsPosition = _options$labelsPositi === undefined ? [] : _options$labelsPositi;
    var _options$labelColor = options.labelColor;
    var labelColor = _options$labelColor === undefined ? 'blue' : _options$labelColor;
    var _options$labelFont = options.labelFont;
    var labelFont = _options$labelFont === undefined ? '12px Helvetica' : _options$labelFont;


    this.checkProcessable('paintMasks', {
        channels: 4,
        bitDepth: [8, 16],
        colorModel: _model.RGB
    });

    if (color && !Array.isArray(color)) {
        color = (0, _color.css2array)(color);
    }

    if (colors) {
        colors = colors.map(function (color) {
            if (!Array.isArray(color)) {
                return (0, _color.css2array)(color);
            }
            return color;
        });
    }

    if (!Array.isArray(masks)) {
        masks = [masks];
    }

    if (distinctColors) {
        colors = (0, _color.getDistinctColors)(masks.length);
    }

    for (var i = 0; i < masks.length; i++) {
        var mask = masks[i];
        // we need to find the parent image to calculate the relative position

        if (colors) {
            color = colors[i % colors.length];
        } else if (randomColors) {
            color = (0, _color.getRandomColor)();
        }

        for (var x = 0; x < mask.width; x++) {
            for (var y = 0; y < mask.height; y++) {
                if (mask.getBitXY(x, y)) {
                    for (var component = 0; component < Math.min(this.components, color.length); component++) {
                        if (alpha === 255) {
                            this.setValueXY(x + mask.position[0], y + mask.position[1], component, color[component]);
                        } else {
                            var value = this.getValueXY(x + mask.position[0], y + mask.position[1], component);
                            value = Math.round((value * (255 - alpha) + color[component] * alpha) / 255);
                            this.setValueXY(x + mask.position[0], y + mask.position[1], component, value);
                        }
                    }
                }
            }
        }
    }

    if (Array.isArray(labels) && labels.length > 0) {
        var canvas = this.getCanvas({ originalData: true });
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = labelColor;
        ctx.font = labelFont;
        for (var _i = 0; _i < Math.min(masks.length, labels.length); _i++) {
            var position = labelsPosition[_i] ? labelsPosition[_i] : masks[_i].position;
            ctx.fillText(labels[_i], position[0], position[1]);
        }
        this.data = ctx.getImageData(0, 0, this.width, this.height).data;
    }
}

},{"../../util/color":255,"../model/model":185}],190:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = paintPoints;

var _model = require('../model/model');

var _shape = require('../../util/shape');

var _shape2 = _interopRequireDefault(_shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Paint pixels on the current image.
 * @memberof Image
 * @instance
 * @param {[[pixels]]} points - Array of [x,y] points
 * @param {array} [$1.color=[max,0,0]] - Array of 3 elements (R, G, B), default is red.
 * @param {array} [$1.shape] - Array of 3 elements (R, G, B), default is red.
 * @returns {Image} The original painted image
 */

function paintPoints(points) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref$color = _ref.color;
    var color = _ref$color === undefined ? [this.maxValue, 0, 0] : _ref$color;
    var shape = _ref.shape;


    this.checkProcessable('paintPoints', {
        components: 3,
        bitDepth: [8, 16],
        colorModel: _model.RGB
    });

    var shapePixels = new _shape2.default(shape).getPoints();

    var numberChannels = Math.min(this.channels, color.length);

    for (var i = 0; i < points.length; i++) {
        var xP = points[i][0];
        var yP = points[i][1];
        for (var j = 0; j < shapePixels.length; j++) {
            var xS = shapePixels[j][0];
            var yS = shapePixels[j][1];
            if (xP + xS >= 0 && yP + yS >= 0 && xP + xS < this.width && yP + yS < this.height) {
                var position = (xP + xS + (yP + yS) * this.width) * this.channels;
                for (var channel = 0; channel < numberChannels; channel++) {
                    this.data[position + channel] = color[channel];
                }
            }
        }
    }
}

},{"../../util/shape":262,"../model/model":185}],191:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _kindNames = require('../kindNames');

var KindNames = _interopRequireWildcard(_kindNames);

var _shape = require('../../util/shape');

var _shape2 = _interopRequireDefault(_shape);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class to manage Region Of Interests
 * @class Roi
 */
class Roi {

    constructor(map, id) {
        this.map = map;
        this.id = id;
        this.minX = Number.POSITIVE_INFINITY;
        this.maxX = Number.NEGATIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
        this.meanX = 0;
        this.meanY = 0;
        this.surface = 0;
        this.computed = {};
    }

    /**
     * Returns a binary image (mask) for the corresponding ROI
     * @param {object} [options]
     * @param {number} [options.scale=1] - Scaling factor to apply to the mask
     * @param {string} [options.kind='normal'] - 'contour', 'box', 'filled', 'center' or 'normal'
     * @return {Image} - Returns a mask (1 bit Image)
     */
    getMask() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$scale = options.scale;
        var scale = _options$scale === undefined ? 1 : _options$scale;
        var _options$kind = options.kind;
        var kind = _options$kind === undefined ? '' : _options$kind;

        var mask = void 0;
        switch (kind) {
            case 'contour':
                mask = this.contourMask;
                break;
            case 'box':
                mask = this.boxMask;
                break;
            case 'filled':
                mask = this.filledMask;
                break;
            case 'center':
                mask = this.centerMask;
                break;
            default:
                mask = this.mask;
        }

        if (scale < 1) {
            // by reassigning the mask we loose the parent and therefore the position
            // we will have to force it back
            mask = mask.resizeBinary(scale);
            mask.parent = this.mask.parent;
            mask.position[0] += this.minX;
            mask.position[1] += this.minY;
        }

        return mask;
    }

    get mean() {
        throw new Error('Roi mean not implemented yet');
        // return [this.meanX,this.meanY];
    }

    get center() {
        if (this.computed.center) {
            return this.computed.center;
        }
        return this.computed.center = [this.width / 2 >> 0, this.height / 2 >> 0];
    }

    get width() {
        return this.maxX - this.minX + 1;
    }

    get height() {
        return this.maxY - this.minY + 1;
    }

    _computExternalIDs() {
        // take all the borders and remove the internal one ...
        var borders = this.borderIDs;
        var lengths = this.borderLengths;

        this.computed.externalIDs = [];
        this.computed.externalLengths = [];

        var internals = this.internalIDs;

        for (var i = 0; i < borders.length; i++) {
            if (!internals.includes(borders[i])) {
                this.computed.externalIDs.push(borders[i]);
                this.computed.externalLengths.push(lengths[i]);
            }
        }
    }

    get externalIDs() {
        if (this.computed.externalIDs) {
            return this.computed.externalIDs;
        }
        this._computExternalIDs();
        return this.computed.externalIDs;
    }

    get externalLengths() {
        if (this.computed.externalLengths) {
            return this.computed.externalLengths;
        }
        this._computExternalIDs();
        return this.computed.externalLengths;
    }

    _computeBorderIDs() {
        var borders = getBorders(this);
        this.computed.borderIDs = borders.ids;
        this.computed.borderLengths = borders.lengths;
    }

    /**
     Retrieve all the IDs (array of number) of the regions that are in contact with this
     specific region. It may be external or internal
     */
    get borderIDs() {
        if (this.computed.borderIDs) {
            return this.computed.borderIDs;
        }
        this._computeBorderIDs();
        return this.computed.borderIDs;
    }

    /**
     Retrieve all the length (array of number) of the contacts with this
     specific region. It may be external or internal
     */
    get borderLengths() {
        if (this.computed.borderLengths) {
            return this.computed.borderLengths;
        }
        this._computeBorderIDs();
        return this.computed.borderLengths;
    }

    /**
     Retrieve all the IDs or the Roi touching the box surrouding the region
      It should really be an array to solve complex cases related to border effect
      Like the image
     <pre>
     0000
     1111
     0000
     1111
     </pre>
      The first row of 1 will be surrouned by 2 differents zones
      Or even worse
     <pre>
     010
     111
     010
     </pre>
     The cross will be surrouned by 4 differents zones
      However in most of the cases it will be an array of one element
     */

    get boxIDs() {
        if (this.computed.boxIDs) {
            return this.computed.boxIDs;
        }
        return this.computed.boxIDs = getBoxIDs(this);
    }

    get internalIDs() {
        if (this.computed.internalIDs) {
            return this.computed.internalIDs;
        }
        return this.computed.internalIDs = getInternalIDs(this);
    }

    /**
     Number of pixels of the Roi that touch the rectangle
     This is useful for the calculation of the border
     because we will ignore those special pixels of the rectangle
     border that don't have neighbours all around them.
     */
    get box() {
        // points of the Roi that touch the rectangular shape
        if (this.computed.box) {
            return this.computed.box;
        }
        return this.computed.box = getBox(this);
    }

    /**
     Calculates the number of pixels that are in the external border of the Roi
     Contour are all the pixels that touch an external "zone".
     All the pixels that touch the box are part of the border and
     are calculated in the getBoxPixels procedure
     */
    get external() {
        if (this.computed.external) {
            return this.computed.external;
        }
        return this.computed.external = getExternal(this);
    }

    /**
     Calculates the number of pixels that are involved in border
     Border are all the pixels that touch another "zone". It could be external
     or internal. If there is a hole in the zone it will be counted as a border.
     All the pixels that touch the box are part of the border and
     are calculated in the getBoxPixels procedure
     */
    get border() {
        if (this.computed.border) {
            return this.computed.border;
        }
        return this.computed.border = getBorder(this);
    }

    /**
        Returns a binary image (mask) containing only the border of the mask
     */
    get contourMask() {
        if (this.computed.contourMask) {
            return this.computed.contourMask;
        }

        var img = new _Image2.default(this.width, this.height, {
            kind: KindNames.BINARY,
            position: [this.minX, this.minY],
            parent: this.map.parent
        });

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.map.data[x + this.minX + (y + this.minY) * this.map.width] === this.id) {
                    // it also has to be on a border ...
                    if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
                        if (this.map.data[x - 1 + this.minX + (y + this.minY) * this.map.width] !== this.id || this.map.data[x + 1 + this.minX + (y + this.minY) * this.map.width] !== this.id || this.map.data[x + this.minX + (y - 1 + this.minY) * this.map.width] !== this.id || this.map.data[x + this.minX + (y + 1 + this.minY) * this.map.width] !== this.id) {
                            img.setBitXY(x, y);
                        }
                    } else {
                        img.setBitXY(x, y);
                    }
                }
            }
        }
        return this.computed.contour = img;
    }

    get boxMask() {
        if (this.computed.boxMask) {
            return this.computed.boxMask;
        }

        var img = new _Image2.default(this.width, this.height, {
            kind: KindNames.BINARY,
            position: [this.minX, this.minY],
            parent: this.map.parent
        });

        for (var x = 0; x < this.width; x++) {
            img.setBitXY(x, 0);
            img.setBitXY(x, this.height - 1);
        }
        for (var y = 0; y < this.height; y++) {
            img.setBitXY(0, y);
            img.setBitXY(this.width - 1, y);
        }
        return this.computed.boxMask = img;
    }

    /**
     Returns a binary image containing the mask
     */
    get mask() {
        if (this.computed.mask) {
            return this.computed.mask;
        }

        var img = new _Image2.default(this.width, this.height, {
            kind: KindNames.BINARY,
            position: [this.minX, this.minY],
            parent: this.map.parent
        });

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.map.data[x + this.minX + (y + this.minY) * this.map.width] === this.id) {
                    img.setBitXY(x, y);
                }
            }
        }
        return this.computed.mask = img;
    }

    get filledMask() {
        if (this.computed.filledMask) {
            return this.computed.filledMask;
        }

        var img = new _Image2.default(this.width, this.height, {
            kind: KindNames.BINARY,
            position: [this.minX, this.minY],
            parent: this.map.parent
        });

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var target = x + this.minX + (y + this.minY) * this.map.width;
                if (this.internalIDs.includes(this.map.data[target])) {
                    img.setBitXY(x, y);
                } // by default a pixel is to 0 so no problems, it will be transparent
            }
        }
        return this.computed.filledMask = img;
    }

    get centerMask() {
        if (this.computed.centerMask) {
            return this.computed.centerMask;
        }

        var img = new _shape2.default({ kind: 'smallCross' }).getMask();

        img.parent = this.map.parent;
        img.position = [this.minX + this.center[0] - 1, this.minY + this.center[1] - 1];

        return this.computed.centerMask = img;
    }

    get points() {
        if (this.computed.points) {
            return this.computed.points;
        }
        var points = [];
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var target = (y + this.minY) * this.map.width + x + this.minX;
                if (this.map.data[target] === this.id) {
                    points.push([x, y]);
                }
            }
        }
        return this.computed.points = points;
    }

    get maxLengthPoints() {
        if (this.computed.maxLengthPoints) {
            return this.computed.maxLengthPoints;
        }
        var maxLength = 0;
        var maxLengthPoints = void 0;
        var points = this.points;

        for (var i = 0; i < points.length; i++) {
            for (var j = i + 1; j < points.length; j++) {
                var currentML = Math.pow(points[i][0] - points[j][0], 2) + Math.pow(points[i][1] - points[j][1], 2);
                if (currentML >= maxLength) {
                    maxLength = currentML;
                    maxLengthPoints = [points[i], points[j]];
                }
            }
        }
        return this.computed.maxLengthPoints = maxLengthPoints;
    }

    /**
        Calculates the maximum length between two pixels of the Roi.
     */
    get maxLength() {
        if (this.computed.maxLength) {
            return this.computed.maxLength;
        }
        var maxLength = Math.sqrt(Math.pow(this.maxLengthPoints[0][0] - this.maxLengthPoints[1][0], 2) + Math.pow(this.maxLengthPoints[0][1] - this.maxLengthPoints[1][1], 2));
        return this.computed.maxLength = maxLength;
    }

    get angle() {
        if (this.computed.angle) {
            return this.computed.angle;
        }
        var points = this.maxLengthPoints;
        var angle = -Math.atan2(points[0][1] - points[1][1], points[0][0] - points[1][0]) * 180 / Math.PI;

        return this.computed.angle = angle;
    }
}

exports.default = Roi; // TODO we should follow the region in order to increase the speed

function getBorders(roi) {
    var roiMap = roi.map;
    var data = roiMap.data;
    var surroudingIDs = new Set(); // allows to get a unique list without indexOf
    var surroundingBorders = new Map();
    var visitedData = new Set();
    var dx = [+1, 0, -1, 0];
    var dy = [0, +1, 0, -1];

    for (var x = roi.minX; x <= roi.maxX; x++) {
        for (var y = roi.minY; y <= roi.maxY; y++) {
            var target = x + y * roiMap.width;
            if (data[target] === roi.id) {
                for (var dir = 0; dir < 4; dir++) {
                    var newX = x + dx[dir];
                    var newY = y + dy[dir];
                    if (newX >= 0 && newY >= 0 && newX < roiMap.width && newY < roiMap.height) {
                        var neighbour = newX + newY * roiMap.width;

                        if (data[neighbour] !== roi.id && !visitedData.has(neighbour)) {
                            visitedData.add(neighbour);
                            surroudingIDs.add(data[neighbour]);
                            var surroundingBorder = surroundingBorders.get(data[neighbour]);
                            if (!surroundingBorder) {
                                surroundingBorders.set(data[neighbour], 1);
                            } else {
                                surroundingBorders.set(data[neighbour], ++surroundingBorder);
                            }
                        }
                    }
                }
            }
        }
    }
    var ids = Array.from(surroudingIDs);
    var borderLengths = ids.map(function (id) {
        return surroundingBorders.get(id);
    });
    return {
        ids: ids,
        lengths: borderLengths
    };
}

function getBoxIDs(roi) {
    var surroundingIDs = new Set(); // allows to get a unique list without indexOf

    var roiMap = roi.map;
    var data = roiMap.data;

    // we check the first line and the last line
    for (var y of [0, roi.height - 1]) {
        for (var x = 0; x < roi.width; x++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (x - roi.minX > 0 && data[target] === roi.id && data[target - 1] !== roi.id) {
                var value = data[target - 1];
                surroundingIDs.add(value);
            }
            if (roiMap.width - x - roi.minX > 1 && data[target] === roi.id && data[target + 1] !== roi.id) {
                var _value = data[target + 1];
                surroundingIDs.add(_value);
            }
        }
    }

    // we check the first column and the last column
    for (var _x2 of [0, roi.width - 1]) {
        for (var _y = 0; _y < roi.height; _y++) {
            var _target = (_y + roi.minY) * roiMap.width + _x2 + roi.minX;
            if (_y - roi.minY > 0 && data[_target] === roi.id && data[_target - roiMap.width] !== roi.id) {
                var _value2 = data[_target - roiMap.width];
                surroundingIDs.add(_value2);
            }
            if (roiMap.height - _y - roi.minY > 1 && data[_target] === roi.id && data[_target + roiMap.width] !== roi.id) {
                var _value3 = data[_target + roiMap.width];
                surroundingIDs.add(_value3);
            }
        }
    }

    return Array.from(surroundingIDs); // the selection takes the whole rectangle
}

function getBox(roi) {
    var total = 0;
    var roiMap = roi.map;
    var data = roiMap.data;

    var topBottom = [0];
    if (roi.height > 1) {
        topBottom[1] = roi.height - 1;
    }
    for (var y of topBottom) {
        for (var x = 1; x < roi.width - 1; x++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (data[target] === roi.id) {
                total++;
            }
        }
    }

    var leftRight = [0];
    if (roi.width > 1) {
        leftRight[1] = roi.width - 1;
    }
    for (var _x3 of leftRight) {
        for (var _y2 = 0; _y2 < roi.height; _y2++) {
            var _target2 = (_y2 + roi.minY) * roiMap.width + _x3 + roi.minX;
            if (data[_target2] === roi.id) {
                total++;
            }
        }
    }
    return total;
}

function getBorder(roi) {
    var total = 0;
    var roiMap = roi.map;
    var data = roiMap.data;

    for (var x = 1; x < roi.width - 1; x++) {
        for (var y = 1; y < roi.height - 1; y++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (data[target] === roi.id) {
                // if a point around is not roi.id it is a border
                if (data[target - 1] !== roi.id || data[target + 1] !== roi.id || data[target - roiMap.width] !== roi.id || data[target + roiMap.width] !== roi.id) {
                    total++;
                }
            }
        }
    }
    return total + roi.box;
}

function getExternal(roi) {
    var total = 0;
    var roiMap = roi.map;
    var data = roiMap.data;

    for (var x = 1; x < roi.width - 1; x++) {
        for (var y = 1; y < roi.height - 1; y++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (data[target] === roi.id) {
                // if a point around is not roi.id it is a border
                if (roi.externalIDs.includes(data[target - 1]) || roi.externalIDs.includes(data[target + 1]) || roi.externalIDs.includes(data[target - roiMap.width]) || roi.externalIDs.includes(data[target + roiMap.width])) {
                    total++;
                }
            }
        }
    }
    return total + roi.box;
}

/*
We will calculate all the ids of the map that are "internal"
This will allow to extract the 'plain' image
 */
function getInternalIDs(roi) {
    var internal = [roi.id];
    var roiMap = roi.map;
    var data = roiMap.data;

    if (roi.height > 2) {
        for (var x = 0; x < roi.width; x++) {
            var target = roi.minY * roiMap.width + x + roi.minX;
            if (internal.includes(data[target])) {
                var id = data[target + roiMap.width];
                if (!internal.includes(id) && !roi.boxIDs.includes(id)) {
                    internal.push(id);
                }
            }
        }
    }

    var array = new Array(4);
    for (var _x4 = 1; _x4 < roi.width - 1; _x4++) {
        for (var y = 1; y < roi.height - 1; y++) {
            var _target3 = (y + roi.minY) * roiMap.width + _x4 + roi.minX;
            if (internal.includes(data[_target3])) {
                // we check if one of the neighbour is not yet in

                array[0] = data[_target3 - 1];
                array[1] = data[_target3 + 1];
                array[2] = data[_target3 - roiMap.width];
                array[3] = data[_target3 + roiMap.width];

                for (var i = 0; i < 4; i++) {
                    var _id = array[i];
                    if (!internal.includes(_id) && !roi.boxIDs.includes(_id)) {
                        internal.push(_id);
                    }
                }
            }
        }
    }

    return internal;
}

},{"../../util/shape":262,"../Image":145,"../kindNames":182}],192:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Roi = require('./Roi');

var _Roi2 = _interopRequireDefault(_Roi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO check the links for the reference in the docs (@see)

/**
 * A layer that is caracterised by a RoiMap (@see RoiMap) and that will
 * generated automatically the corresponding ROI.
 * ROI should be a continuous
 * surface (it is not tested when it is not continous ...)
 * From the roiMap, the RoiLayer will create the corresponding
 * ROI (@see Roi).
 *
 * @class RoiLayer
 * @private
 * @param {Image} image
 * @param {object} [options]
 */
class RoiLayer {
    constructor(roiMap, options) {
        this.roiMap = roiMap;
        this.options = options;
        this.roi = this.createRoi();
    }

    /**
     * Roi are created from a roiMap
     * The roiMap contains mainty an array of identifiers that define
     * for each data to which Roi it belongs
     * @memberof RoiManager
     * @instance
     */

    createRoi() {
        // we need to find all all the different IDs there is in the data
        var data = this.roiMap.data;
        var mapIDs = {};
        this.roiMap.positive = 0;
        this.roiMap.negative = 0;

        for (var i = 0; i < data.length; i++) {
            if (data[i] && !mapIDs[data[i]]) {
                mapIDs[data[i]] = true;
                if (data[i] > 0) {
                    this.roiMap.positive++;
                } else {
                    this.roiMap.negative++;
                }
            }
        }

        var rois = {};

        for (var mapID in mapIDs) {
            rois[mapID] = new _Roi2.default(this.roiMap, mapID * 1);
        }

        var width = this.roiMap.width;
        var height = this.roiMap.height;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var target = y * width + x;
                if (data[target] !== 0) {
                    var _mapID = data[target];
                    if (x < rois[_mapID].minX) {
                        rois[_mapID].minX = x;
                    }
                    if (x > rois[_mapID].maxX) {
                        rois[_mapID].maxX = x;
                    }
                    if (y < rois[_mapID].minY) {
                        rois[_mapID].minY = y;
                    }
                    if (y > rois[_mapID].maxY) {
                        rois[_mapID].maxY = y;
                    }
                    rois[_mapID].meanX += x;
                    rois[_mapID].meanY += y;
                    rois[_mapID].surface++;
                }
            }
        }

        var roiArray = [];
        for (var _mapID2 in mapIDs) {
            rois[_mapID2].meanX /= rois[_mapID2].surface;
            rois[_mapID2].meanY /= rois[_mapID2].surface;
            roiArray.push(rois[_mapID2]);
        }

        return roiArray;
    }

}
exports.default = RoiLayer;

},{"./Roi":191}],193:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * The roiMap is an array of the size of the original image data that contains
 * positive and negative numbers. When the number is common, it corresponds
 * to one region of interest (ROI)
 *
 * @class RoiMap
 * @private
 */

class RoiMap {
    constructor(parent, data) {
        this.parent = parent;
        this.width = parent.width;
        this.height = parent.height;
        this.data = data;
        this.negative = 0;
        this.positive = 0;
    }

    get total() {
        return this.negative + this.positive;
    }
}
exports.default = RoiMap;

},{}],194:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fromMask;

var _RoiMap = require('../RoiMap');

var _RoiMap2 = _interopRequireDefault(_RoiMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof RoiManager
 * @instance
 * @param {Image} mask
 * @param {object} [options]
 * @returns {RoiMap}
 */

function fromMask(mask) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$allowCorners = options.allowCorners;
    var allowCorners = _options$allowCorners === undefined ? false : _options$allowCorners;

    // based on a binary image we will create plenty of small images

    var data = new Int16Array(mask.size); // maxValue: 32767, minValue: -32768

    // split will always return an array of images
    var positiveID = 0;
    var negativeID = 0;

    var MAX_ARRAY = 0x00ffff; // should be enough for most of the cases
    var xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
    var yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!


    for (var x = 0; x < mask.width; x++) {
        for (var y = 0; y < mask.height; y++) {
            if (data[y * mask.width + x] === 0) {
                // need to process the whole surface
                analyseSurface(x, y);
            }
        }
    }

    function analyseSurface(x, y) {
        var from = 0;
        var to = 0;
        var targetState = mask.getBitXY(x, y);
        var id = targetState ? ++positiveID : --negativeID;
        xToProcess[0] = x;
        yToProcess[0] = y;
        while (from <= to) {
            var currentX = xToProcess[from & MAX_ARRAY];
            var currentY = yToProcess[from & MAX_ARRAY];
            data[currentY * mask.width + currentX] = id;
            // need to check all around mask pixel
            if (currentX > 0 && data[currentY * mask.width + currentX - 1] === 0 && mask.getBitXY(currentX - 1, currentY) === targetState) {
                // LEFT
                to++;
                xToProcess[to & MAX_ARRAY] = currentX - 1;
                yToProcess[to & MAX_ARRAY] = currentY;
                data[currentY * mask.width + currentX - 1] = -32768;
            }
            if (currentY > 0 && data[(currentY - 1) * mask.width + currentX] === 0 && mask.getBitXY(currentX, currentY - 1) === targetState) {
                // TOP
                to++;
                xToProcess[to & MAX_ARRAY] = currentX;
                yToProcess[to & MAX_ARRAY] = currentY - 1;
                data[(currentY - 1) * mask.width + currentX] = -32768;
            }
            if (currentX < mask.width - 1 && data[currentY * mask.width + currentX + 1] === 0 && mask.getBitXY(currentX + 1, currentY) === targetState) {
                // RIGHT
                to++;
                xToProcess[to & MAX_ARRAY] = currentX + 1;
                yToProcess[to & MAX_ARRAY] = currentY;
                data[currentY * mask.width + currentX + 1] = -32768;
            }
            if (currentY < mask.height - 1 && data[(currentY + 1) * mask.width + currentX] === 0 && mask.getBitXY(currentX, currentY + 1) === targetState) {
                // BOTTOM
                to++;
                xToProcess[to & MAX_ARRAY] = currentX;
                yToProcess[to & MAX_ARRAY] = currentY + 1;
                data[(currentY + 1) * mask.width + currentX] = -32768;
            }
            if (allowCorners) {
                if (currentX > 0 && currentY > 0 && data[(currentY - 1) * mask.width + currentX - 1] === 0 && mask.getBitXY(currentX - 1, currentY - 1) === targetState) {
                    // TOP LEFT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX - 1;
                    yToProcess[to & MAX_ARRAY] = currentY - 1;
                    data[(currentY - 1) * mask.width + currentX - 1] = -32768;
                }
                if (currentX < mask.width - 1 && currentY > 0 && data[(currentY - 1) * mask.width + currentX + 1] === 0 && mask.getBitXY(currentX + 1, currentY - 1) === targetState) {
                    // TOP RIGHT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX + 1;
                    yToProcess[to & MAX_ARRAY] = currentY - 1;
                    data[(currentY - 1) * mask.width + currentX + 1] = -32768;
                }
                if (currentX > 0 && currentY < mask.height - 1 && data[(currentY + 1) * mask.width + currentX - 1] === 0 && mask.getBitXY(currentX - 1, currentY + 1) === targetState) {
                    // BOTTOM LEFT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX - 1;
                    yToProcess[to & MAX_ARRAY] = currentY + 1;
                    data[(currentY + 1) * mask.width + currentX - 1] = -32768;
                }
                if (currentX < mask.width - 1 && currentY < mask.height - 1 && data[(currentY + 1) * mask.width + currentX + 1] === 0 && mask.getBitXY(currentX + 1, currentY + 1) === targetState) {
                    // BOTTOM RIGHT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX + 1;
                    yToProcess[to & MAX_ARRAY] = currentY + 1;
                    data[(currentY + 1) * mask.width + currentX + 1] = -32768;
                }
            }

            from++;

            if (to - from > MAX_ARRAY) {
                throw new Error('analyseMask can not finish, the array to manage internal data is not big enough.' + 'You could improve mask by changing MAX_ARRAY');
            }
        }
    }
    return new _RoiMap2.default(mask, data);
}

},{"../RoiMap":193}],195:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fromMaxima;

var _RoiMap = require('../RoiMap');

var _RoiMap2 = _interopRequireDefault(_RoiMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof RoiManager
 * @instance
 * @param {object} [options]
 * @param {boolean} [options.allowCorner=true]
 * @param {boolean} [options.onlyTop=false]
 * @param {boolean} [options.invert=false]
 * @return {RoiMap}
 */

function fromMaxima() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$allowCorner = options.allowCorner;
    var allowCorner = _options$allowCorner === undefined ? true : _options$allowCorner;
    var _options$onlyTop = options.onlyTop;
    var onlyTop = _options$onlyTop === undefined ? false : _options$onlyTop;
    var _options$invert = options.invert;
    var invert = _options$invert === undefined ? false : _options$invert;


    var image = this;
    image.checkProcessable('fromMaxima', { components: [1] });

    var PROCESS_TOP = 1;
    var PROCESS_NORMAL = 2;

    // split will always return an array of images
    var positiveID = 0;
    var negativeID = 0;

    var data = new Int16Array(image.size); // maxValue: 32767, minValue: -32768
    var processed = new Int8Array(image.size);
    var variations = new Float32Array(image.size);

    var MAX_ARRAY = 0x0fffff; // should be enough for most of the cases
    var xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
    var yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!


    var from = 0;
    var to = 0;

    var xToProcessTop = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
    var yToProcessTop = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

    var fromTop = 0;
    var toTop = 0;

    appendMaxima(image, { maxima: !invert });

    while (from < to) {
        var currentX = xToProcess[from & MAX_ARRAY];
        var currentY = yToProcess[from & MAX_ARRAY];
        process(currentX, currentY, PROCESS_NORMAL);
        from++;
    }

    return new _RoiMap2.default(image, data);

    // we will look for the maxima (or minima) that is present in the picture
    // a maxima is a point that is surrounded by lower values
    // should deal with allowCorner and invert
    function appendMaxima(_ref) {
        var _ref$maxima = _ref.maxima;
        var maxima = _ref$maxima === undefined ? true : _ref$maxima;

        for (var y = 1; y < image.height - 1; y++) {
            for (var x = 1; x < image.width - 1; x++) {
                var index = x + y * image.width;
                if (processed[index] === 0) {
                    var currentValue = maxima ? image.data[index] : -image.data[x + y * image.width];
                    if (image.data[y * image.width + x - 1] > currentValue) {
                        // LEFT
                        continue;
                    }
                    if (image.data[y * image.width + x + 1] > currentValue) {
                        // RIGHT
                        continue;
                    }
                    if (image.data[(y - 1) * image.width + x] > currentValue) {
                        // TOP
                        continue;
                    }
                    if (image.data[(y + 1) * image.width + x] > currentValue) {
                        // BOTTOM
                        continue;
                    }
                    if (allowCorner) {
                        if (image.data[(y - 1) * image.width + x - 1] > currentValue) {
                            // LEFT TOP
                            continue;
                        }
                        if (image.data[(y - 1) * image.width + x + 1] > currentValue) {
                            // RIGHT TOP
                            continue;
                        }
                        if (image.data[(y + 1) * image.width + x - 1] > currentValue) {
                            // LEFT BOTTOM
                            continue;
                        }
                        if (image.data[(y + 1) * image.width + x + 1] > currentValue) {
                            // RIGHT BOTTOM
                            continue;
                        }
                    }

                    data[index] = maxima ? ++positiveID : --negativeID;

                    var valid = processTop(x, y, PROCESS_TOP);
                    if (!valid) {
                        if (maxima) {
                            --positiveID;
                        } else {
                            ++negativeID;
                        }
                    }
                }
            }
        }
    }

    // we will try to get all the points of the top (same value)
    // and to check if the whole group is surrounded by lower value
    // as soon as one of them if not part we need to reverse the process
    // and just for get those points
    function processTop(xToProcess, yToProcess) {
        // console.log('process top');
        var currentTo = to; // in case if fails we come back
        fromTop = 0;
        toTop = 1;
        xToProcessTop[0] = xToProcess;
        yToProcessTop[0] = yToProcess;
        var valid = true;
        while (fromTop < toTop) {
            var _currentX = xToProcessTop[fromTop & MAX_ARRAY];
            var _currentY = yToProcessTop[fromTop & MAX_ARRAY];
            valid &= process(_currentX, _currentY, PROCESS_TOP);
            fromTop++;
        }
        if (!valid) {
            // console.log('REVERT');
            // need to clear all the calculated data because the top is not surrounded by negative values
            for (var i = 0; i < toTop; i++) {
                var _currentX2 = xToProcessTop[i & MAX_ARRAY];
                var _currentY2 = yToProcessTop[i & MAX_ARRAY];
                var index = _currentY2 * image.width + _currentX2;
                data[index] = 0;
            }
            to = currentTo;
        }
        return valid;
    }

    /*
     For a specific point we will check the points around, increase the area of interests and add
     them to the processing list
     type=0 : top
     type=1 : normal
     */
    function process(xCenter, yCenter, type) {
        // console.log('PROCESS', xCenter, yCenter);
        var currentID = data[yCenter * image.width + xCenter];
        var currentValue = image.data[yCenter * image.width + xCenter];
        //let currentVariation = variations[yCenter * image.width + xCenter];
        for (var y = yCenter - 1; y <= yCenter + 1; y++) {
            for (var x = xCenter - 1; x <= xCenter + 1; x++) {
                var index = y * image.width + x;
                if (processed[index] === 0) {
                    processed[index] = 1;
                    // we store the variation compare to the parent pixel
                    variations[index] = image.data[index] - currentValue;
                    switch (type) {
                        case PROCESS_TOP:
                            // console.log(x, y, variations[index]);
                            if (variations[index] === 0) {
                                // we look for maxima
                                // console.log('ZERO', currentID, x, y);
                                // if we are next to a border ... it is not surrounded !
                                if (x === 0 || y === 0 || x === image.width - 1 || y === image.height - 1) {
                                    return false;
                                }
                                data[index] = currentID;
                                xToProcessTop[toTop & MAX_ARRAY] = x;
                                yToProcessTop[toTop & MAX_ARRAY] = y;
                                toTop++;
                            } else if (variations[index] > 0) {
                                // not a global maximum
                                // console.log('LARGER');
                                return false;
                            } else {
                                // a point we will have to process
                                if (!onlyTop) {
                                    data[index] = currentID;
                                    xToProcess[to & MAX_ARRAY] = x;
                                    yToProcess[to & MAX_ARRAY] = y;
                                    to++;
                                }
                            }
                            break;
                        case PROCESS_NORMAL:
                            if (variations[index] <= 0) {
                                // we look for maxima
                                data[index] = currentID;
                                xToProcess[to & MAX_ARRAY] = x;
                                yToProcess[to & MAX_ARRAY] = y;
                                to++;
                            }
                            break;
                        default:
                            throw new Error('unreachable');
                    }
                }
            }
        }
        return true;
    }
}

},{"../RoiMap":193}],196:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fromPoints;

var _RoiMap = require('../RoiMap');

var _RoiMap2 = _interopRequireDefault(_RoiMap);

var _shape = require('./../../../util/shape');

var _shape2 = _interopRequireDefault(_shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof RoiManager
 * @instance
 * @param {number[][]} points - an array of points
 * @param {object} [options]
 * @returns {RoiMap}
 */

function fromPoints(pointsToPaint) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var shape = new _shape2.default(options);

    // based on a binary image we will create plenty of small images
    var data = new Int16Array(this.size); // maxValue: 32767, minValue: -32768
    var positiveID = 0;
    var shapePoints = shape.getPoints();
    for (var i = 0; i < pointsToPaint.length; i++) {
        positiveID++;
        var xP = pointsToPaint[i][0];
        var yP = pointsToPaint[i][1];
        for (var j = 0; j < shapePoints.length; j++) {
            var xS = shapePoints[j][0];
            var yS = shapePoints[j][1];
            if (xP + xS >= 0 && yP + yS >= 0 && xP + xS < this.width && yP + yS < this.height) {
                data[xP + xS + (yP + yS) * this.width] = positiveID;
            }
        }
    }

    return new _RoiMap2.default(this, data);
}

},{"../RoiMap":193,"./../../../util/shape":262}],197:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fromWaterShed;

var _RoiMap = require('../RoiMap');

var _RoiMap2 = _interopRequireDefault(_RoiMap);

var _jsPriorityQueue = require('js-priority-queue');

var _jsPriorityQueue2 = _interopRequireDefault(_jsPriorityQueue);

var _dxdy = require('./../../../util/dxdy.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This method allows to create a ROIMap using the water shed algorithm. By default this algorithm
 * will fill the holes and therefore the lowest value of the image (black zones).
 * If no points are given, the function will look for all the minimal points.
 * If no mask is given the algorithm will completely fill the image.
 * Please take care about the value that has be in the mask ! In order to be coherent with the expected mask,
 * meaning that if it is a dark zone, the mask will be dark the normal behaviour to fill a zone
 * is that the mask pixel is clear (value of 0) !
 * However if you work in the 'invert' mode, the mask value has to be 'set' and the method will look for
 * maxima.
 * @memberof RoiManager
 * @instance
 * @param {Object} [options={}]
 * @param {number[][]} [options.points[ - Array of points [[x1,y1], [x2,y2], ...].
 * @param {number} [options.fillMaxValue] - Limit of filling. By example, we can fill to a maximum value 32000 of a 16 bitDepth image.
 *          If invert this will corresponds to the minimal value
 * @param {Image} [options.image=this] - By default the waterShed will be applied on the current image. However waterShed can only be applied
 *                              on 1 component image. This allows to specify a grey scale image on which to apply waterShed..
 * @param {Image} [options.mask] - A binary image, the same size as the image. The algorithm will fill only if the current pixel in the binary mask is true.
 * @param {boolean} [options.invert = false] - By default we fill the minima
 * @returns {RoiMap}
 */

function fromWaterShed() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var points = options.points;
    var mask = options.mask;
    var image = options.image;
    var _options$fillMaxValue = options.fillMaxValue;
    var fillMaxValue = _options$fillMaxValue === undefined ? this.maxValue : _options$fillMaxValue;
    var _options$invert = options.invert;
    var invert = _options$invert === undefined ? false : _options$invert;

    var currentImage = image || this;
    currentImage.checkProcessable('fromWaterShed', {
        bitDepth: [8, 16],
        components: 1
    });

    /*
     We need to invert the logic because we are always using method to look for maxima and not minima and
     here water is expected to fill the minima first ...
    */

    invert = !invert;

    //WaterShed is done from points in the image. We can either specify those points in options,
    // or it is gonna take the minimum locals of the image by default.
    if (!points) {
        points = currentImage.getLocalMaxima({
            invert: invert,
            mask: mask
        });
    }

    var maskExpectedValue = invert ? 0 : 1;

    var data = new Int16Array(currentImage.size);
    var width = currentImage.width;
    var height = currentImage.height;
    var toProcess = new _jsPriorityQueue2.default({
        comparator: (a, b) => a[2] - b[2],
        strategy: _jsPriorityQueue2.default.BinaryHeapStrategy
    });
    for (var i = 0; i < points.length; i++) {
        var index = points[i][0] + points[i][1] * width;
        data[index] = i + 1;
        var intensity = currentImage.data[index];
        if (invert && intensity <= fillMaxValue || !invert && intensity >= fillMaxValue) {
            toProcess.queue([points[i][0], points[i][1], intensity]);
        }
    }

    //Then we iterate through each points
    while (toProcess.length > 0) {
        var currentPoint = toProcess.dequeue();
        var currentValueIndex = currentPoint[0] + currentPoint[1] * width;

        for (var dir = 0; dir < 4; dir++) {
            var newX = currentPoint[0] + _dxdy.dxs[dir];
            var newY = currentPoint[1] + _dxdy.dys[dir];
            if (newX >= 0 && newY >= 0 && newX < width && newY < height) {
                var currentNeighbourIndex = newX + newY * width;
                if (!mask || mask.getBit(currentNeighbourIndex) === maskExpectedValue) {
                    var _intensity = currentImage.data[currentNeighbourIndex];
                    if (invert && _intensity <= fillMaxValue || !invert && _intensity >= fillMaxValue) {
                        if (data[currentNeighbourIndex] === 0) {
                            data[currentNeighbourIndex] = data[currentValueIndex];
                            toProcess.queue([currentPoint[0] + _dxdy.dxs[dir], currentPoint[1] + _dxdy.dys[dir], _intensity]);
                        }
                    }
                }
            }
        }
    }

    return new _RoiMap2.default(currentImage, data);
}

},{"../RoiMap":193,"./../../../util/dxdy.js":257,"js-priority-queue":56}],198:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fromMask = require('./creator/fromMask');

var _fromMask2 = _interopRequireDefault(_fromMask);

var _fromMaxima = require('./creator/fromMaxima');

var _fromMaxima2 = _interopRequireDefault(_fromMaxima);

var _fromWaterShed = require('./creator/fromWaterShed');

var _fromWaterShed2 = _interopRequireDefault(_fromWaterShed);

var _fromPoints = require('./creator/fromPoints');

var _fromPoints2 = _interopRequireDefault(_fromPoints);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _RoiMap = require('./RoiMap');

var _RoiMap2 = _interopRequireDefault(_RoiMap);

var _RoiLayer = require('./RoiLayer');

var _RoiLayer2 = _interopRequireDefault(_RoiLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A manager of Regions of Interest. A RoiManager is related to a specific Image
 * and may contain multiple layers. Each layer is characterized by a label whose is
 * name by default 'default'
 * @class RoiManager
 * @param {Image} image
 * @param {object} [options]
 */
class RoiManager {
    constructor(image) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this._image = image;
        this._options = options;
        if (!this._options.label) {
            this._options.label = 'default';
        }
        this._layers = {};
        this._painted = null;
    }

    // docs is in the corresponding file
    fromMaxima() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        var roiMap = _fromMaxima2.default.call(this._image, options);
        this._layers[opt.label] = new _RoiLayer2.default(roiMap, opt);
    }

    // docs is in the corresponding file
    fromPoints(points) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        var roiMap = _fromPoints2.default.call(this._image, points, options);
        this._layers[opt.label] = new _RoiLayer2.default(roiMap, opt);
        return this;
    }

    /**
     * @param {number[]} roiMap
     * @param {object} [options]
     * @return {this}
     */
    putMap(roiMap) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var map = new _RoiMap2.default(this._image, roiMap);
        var opt = (0, _extend2.default)({}, this._options, options);
        this._layers[opt.label] = new _RoiLayer2.default(map, opt);
        return this;
    }

    // docs is in the corresponding file
    fromWaterShed() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        var roiMap = _fromWaterShed2.default.call(this._image, options);
        this._layers[opt.label] = new _RoiLayer2.default(roiMap, opt);
    }

    // docs is in the corresponding file
    fromMask(mask) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        var roiMap = _fromMask2.default.call(this._image, mask, options);
        this._layers[opt.label] = new _RoiLayer2.default(roiMap, opt);
        return this;
    }

    /* Seems slower and less general (only provides positive Roi)
    fromMaskConnectedComponentLabelingAlgorithm(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMask2.call(this._image, mask, options);
        this._layers[opt.label] = new RoiLayer(roiMap, opt);
        return this;
    }
     */

    /**
     *
     * @param {object} [options]
     * @return {RoiMap}
     */
    getMap() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        this._assertLayerWithLabel(opt.label);
        return this._layers[opt.label].roiMap;
    }

    /**
     * Return the IDs of the Regions Of Interest (Roi) as an array of number
     * @param {object} [options]
     * @return {number[]}
     */
    getRoiIds() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var rois = this.getRois(options);
        if (rois) {
            var ids = new Array(rois.length);
            for (var i = 0; i < rois.length; i++) {
                ids[i] = rois[i].id;
            }
            return ids;
        }
        throw new Error('ROIs not found');
    }

    /**
     * Allows to select ROI based on size, label and sign.
     * @param {object} [options={}]
     * @param {string} [options.label='default'] Label of the layer containing the ROI
     * @param {boolean} [options.positive=true] Select the positive region of interest
     * @param {boolean} [options.negative=true] Select he negative region of interest
     * @param {number} [options.minSurface=0]
     * @param {number} [options.maxSurface=Number.POSITIVE_INFINITY]
     * @param {number} [options.minWidth=0]
     * @param {number} [options.minHeight=Number.POSITIVE_INFINITY]
     * @param {number} [options.maxWidth=0]
     * @param {number} [options.maxHeight=Number.POSITIVE_INFINITY]
     * @returns {Roi[]}
     */

    getRois() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$label = options.label;
        var label = _options$label === undefined ? this._options.label : _options$label;
        var _options$positive = options.positive;
        var positive = _options$positive === undefined ? true : _options$positive;
        var _options$negative = options.negative;
        var negative = _options$negative === undefined ? true : _options$negative;
        var _options$minSurface = options.minSurface;
        var minSurface = _options$minSurface === undefined ? 0 : _options$minSurface;
        var _options$maxSurface = options.maxSurface;
        var maxSurface = _options$maxSurface === undefined ? Number.POSITIVE_INFINITY : _options$maxSurface;
        var _options$minWidth = options.minWidth;
        var minWidth = _options$minWidth === undefined ? 0 : _options$minWidth;
        var _options$maxWidth = options.maxWidth;
        var maxWidth = _options$maxWidth === undefined ? Number.POSITIVE_INFINITY : _options$maxWidth;
        var _options$minHeight = options.minHeight;
        var minHeight = _options$minHeight === undefined ? 0 : _options$minHeight;
        var _options$maxHeight = options.maxHeight;
        var maxHeight = _options$maxHeight === undefined ? Number.POSITIVE_INFINITY : _options$maxHeight;


        if (!this._layers[label]) {
            throw new Error('getRoi: This Roi layer (' + label + ') does not exists.');
        }

        var allRois = this._layers[label].roi;

        // todo Is this old way to change the array size still faster ?
        var rois = new Array(allRois.length);
        var ptr = 0;
        for (var i = 0; i < allRois.length; i++) {
            var roi = allRois[i];
            if ((roi.id < 0 && negative || roi.id > 0 && positive) && roi.surface >= minSurface && roi.surface <= maxSurface && roi.width >= minWidth && roi.width <= maxWidth && roi.height >= minHeight && roi.height <= maxHeight) {
                rois[ptr++] = roi;
            }
        }
        rois.length = ptr;
        return rois;
    }

    /**
     * Returns an array of masks
     * See @links Roi.getMask for the options
     * @param {object} [options]
     * @return {Image[]} Retuns an array of masks (1 bit Image)
     */
    getMasks() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var rois = this.getRois(options);

        var masks = new Array(rois.length);
        for (var i = 0; i < rois.length; i++) {
            masks[i] = rois[i].getMask(options);
        }
        return masks;
    }

    /**
     *
     * @param {object} [options]
     * @return {number[]}
     */
    getData() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        this._assertLayerWithLabel(opt.label);
        return this._layers[opt.label].roiMap.data;
    }

    /**
     * Paint the ROI on a copy of the image adn return this image.
     * For painting options @links Image.paintMasks
     * For ROI selection options @links RoiManager.getMasks
     * @param {object} [options] - all the options to select ROIs
     * @param {string} [options.labelProperty] - Paint a mask property on the image.
     *                                  May be any property of the ROI like
     *                                  for example id, surface, width, height, meanX, meanY.
     * @returns {Image} - The painted RGBA 8 bits image
     */

    paint() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var labelProperty = options.labelProperty;

        if (!this._painted) {
            this._painted = this._image.rgba8();
        }
        var masks = this.getMasks(options);

        if (labelProperty) {
            var rois = this.getRois(options);
            options.labels = rois.map(roi => roi[labelProperty]);
            options.labelsPosition = rois.map(roi => [roi.meanX, roi.meanY]);
        }

        this._painted.paintMasks(masks, options);
        return this._painted;
    }

    // return a mask corresponding to all the selected masks
    getMask() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var mask = new _Image2.default(this._image.width, this._image.height, { kind: 'BINARY' });
        var masks = this.getMasks(options);

        for (var i = 0; i < masks.length; i++) {
            var roi = masks[i];
            // we need to find the parent image to calculate the relative position

            for (var x = 0; x < roi.width; x++) {
                for (var y = 0; y < roi.height; y++) {
                    if (roi.getBitXY(x, y)) {
                        mask.setBitXY(x + roi.position[0], y + roi.position[1]);
                    }
                }
            }
        }
        return mask;
    }

    /**
     * Reset the changes to the current painted iamge to the image that was
     * used during the creation of the RoiManager except if a new image is
     * specified as parameter;
     * @param {object} [options]
     * @param {Image} [options.image] A new iamge that you would like to sue for painting over
     */
    resetPainted() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var image = options.image;

        if (image) {
            this._painted = this.image.rgba8();
        } else {
            this._painted = this._image.rgba8();
        }
    }

    /**
     *  Return a new roiMAP changed with the fusion of certain ROIs.
     * @param {object} [options]
     * @param {string} [options.algorithm='commonBorder'] ; algorithm used to decide which ROIs are merged.
     * @param {number} [options.minCommonBorderLength=5] is an integer, determine the strength of the merging.
     * @return {this}
     */

    mergeRoi() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var opt = (0, _extend2.default)({}, this._options, options);
        var _options$algorithm = options.algorithm;
        var algorithm = _options$algorithm === undefined ? 'commonBorder' : _options$algorithm;
        var _options$minCommonBor = options.minCommonBorderLength;
        var minCommonBorderLength = _options$minCommonBor === undefined ? 5 : _options$minCommonBor;

        var rois = this.getRois(opt);
        var toMerge = new Set();
        switch (algorithm.toLowerCase()) {
            //Algorithms. We can add more algorithm to create other types of merging.
            case 'commonborder':
                for (var i = 0; i < rois.length; i++) {
                    for (var k = 0; k < rois[i].borderIDs.length; k++) {
                        //If the length of wall of the current region and his neighbour is big enough, we join the rois.
                        if (rois[i].borderIDs[k] !== 0 && rois[i].borderIDs[k] < rois[i].id && rois[i].borderLengths[k] * minCommonBorderLength >= rois[i].border) {
                            toMerge.add([rois[i].id, rois[i].borderIDs[k]]);
                        }
                    }
                }
                break;
            default:
                throw new Error(`Unexpected algorithm: ${ algorithm }`);
        }

        //Now we can modify the roiMap by merging each region determined before
        var data = this.getMap(opt).data;
        for (var index = 0; index < data.length; index++) {
            if (data[index] !== 0) {
                for (var array of toMerge) {
                    if (data[index] === array[0]) {
                        data[index] = array[1];
                    }
                }
            }
        }
        this.putMap(data, opt);
    }

    _assertLayerWithLabel(label) {
        if (!this._layers[label]) {
            throw new Error(`no layer with label ${ label }`);
        }
    }
}
exports.default = RoiManager;

},{"../Image":145,"./RoiLayer":192,"./RoiMap":193,"./creator/fromMask":194,"./creator/fromMaxima":195,"./creator/fromPoints":196,"./creator/fromWaterShed":197,"extend":35}],199:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = cmyk;

var _model = require('../model/model');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make a copy of the current image and convert the color model to CMYK
 * The source image has to be RGB !
 * @memberof Image
 * @instance
 * @returns {Image} - New image in CMYK color model
 * @example
 * var cmykImage = image.cmyk();
 * // we can create one image per channel
 * var channels = cmykImage.split();
 */

// http://www.easyrgb.com/index.php?X=MATH&H=18#text18
// check rgbToHsl : https://bgrins.github.io/TinyColor/docs/tinycolor.html

function cmyk() {
    this.checkProcessable('cmyk', {
        bitDepth: [8, 16],
        alpha: [0, 1],
        colorModel: [_model.RGB]
    });

    var newImage = _Image2.default.createFrom(this, {
        components: 4,
        colorModel: _model.CMYK
    });

    var ptr = 0;
    var data = this.data;
    for (var i = 0; i < data.length; i += this.channels) {
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];

        var black = Math.min(this.maxValue - red, this.maxValue - green, this.maxValue - blue);
        var cyan = (this.maxValue - red - black) / (1 - black / this.maxValue);
        var magenta = (this.maxValue - green - black) / (1 - black / this.maxValue);
        var yellow = (this.maxValue - blue - black) / (1 - black / this.maxValue);

        newImage.data[ptr++] = cyan;
        newImage.data[ptr++] = magenta;
        newImage.data[ptr++] = yellow;
        newImage.data[ptr++] = black;
        if (this.alpha) {
            newImage.data[ptr++] = data[i + 3];
        }
    }

    return newImage;
}

},{"../Image":145,"../model/model":185}],200:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = colorDepth;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Change the image color depth.
 * The color depth is the number of bits that is assigned to each point of a channel.
 * For normal images it is 8 bits meaning the value is between 0 and 255.
 * Currently only conversion from 8 to 16 bits and 16 to 8 bits is allowed.
 * @memberof Image
 * @instance
 * @param {number} [newColorDepth=8]
 * @return {Image} The new image
 * @example
 * var newImage = image.colorDepth({
 *   newColorDepth:8
 * });
 */

function colorDepth() {
    var newColorDepth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;


    this.checkProcessable('colorDepth', {
        bitDepth: [8, 16]
    });

    if (![8, 16].includes(newColorDepth)) {
        throw Error('You need to specify the new colorDepth as 8 or 16');
    }

    if (this.bitDepth === newColorDepth) {
        return this.clone();
    }

    var newImage = _Image2.default.createFrom(this, { bitDepth: newColorDepth });

    if (newColorDepth === 8) {
        for (var i = 0; i < this.data.length; i++) {
            newImage.data[i] = this.data[i] >> 8;
        }
    } else {
        for (var _i = 0; _i < this.data.length; _i++) {
            newImage.data[_i] = this.data[_i] << 8 | this.data[_i];
        }
    }

    return newImage;
}

},{"../Image":145}],201:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = crop;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Crops the image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {number} [options.x=0] - x coordinate to place the zero of the new image
 * @param {number} [options.y=0] - y coordinate to place the zero of the new image
 * @param {number} [options.width=this.width-x] - width of the new image
 * @param {number} [options.height=this.height-y] - height of the new image
 * @return {Image} The new cropped image
 * @example
 * var cropped = image.crop({
 *   x:0,
 *   y:0
 * });
 */
function crop() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$x = options.x;
    var x = _options$x === undefined ? 0 : _options$x;
    var _options$y = options.y;
    var y = _options$y === undefined ? 0 : _options$y;
    var _options$width = options.width;
    var width = _options$width === undefined ? this.width - x : _options$width;
    var _options$height = options.height;
    var height = _options$height === undefined ? this.height - y : _options$height;


    if (x > this.width - 1 || y > this.height - 1) {
        throw new RangeError(`crop: origin (x:${ x }, y:${ y }) out of range (${ this.width - 1 }; ${ this.height - 1 })`);
    }
    if (width <= 0 || height <= 0) {
        throw new RangeError(`crop: width and height (width:${ width }; height:${ height }) must be positive numbers`);
    }
    if (x < 0 || y < 0) {
        throw new RangeError(`crop: x and y (x:${ x }, y:${ y }) must be positive numbers`);
    }
    if (width > this.width - x || height > this.height - y) {
        throw new RangeError(`crop: (x: ${ x }, y:${ y }, width:${ width }, height:${ height }) size is out of range`);
    }

    var newImage = _Image2.default.createFrom(this, { width: width, height: height });

    var xWidth = width * this.channels;
    var y1 = y + height;

    var ptr = 0; // pointer for new array

    var jLeft = x * this.channels;

    for (var i = y; i < y1; i++) {
        var j = i * this.width * this.channels + jLeft;
        var jL = j + xWidth;
        for (; j < jL; j++) {
            newImage.data[ptr++] = this.data[j];
        }
    }

    return newImage;
}

},{"../Image":145}],202:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = grey;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _model = require('../model/model');

var _greyAlgorithms = require('./greyAlgorithms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Converts the current image to grey scale
 * The source image has to be RGB !
 * If there is an alpha channel we need to decide what to do:
 * * keepAlpha : we will keep the alpha channel and you will get a GREY / A image
 * * mergeAlpha : we will multiply each pixel of the image by the alpha
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {string} [options.algorithm='luma709'] - Algorithm to get the grey image
 * @param {boolean} [options.keepAlpha=false] - If true the RGB values are treated
 *          separately from the alpha channel and the method returns a GREYA image.
 * @param {boolean} [options.mergeAlpha=true] - If true the alpha channel will be applied on each pixel.
 *          This means that if for an 8bits RGBA image we have an alpha channel value of 0,
 *          this grey scale value will always be 0 (black pixel)
 * @param {boolean} [options.allowGrey=false] - By default only RGB images are allowed.
 *          If true grey images are also allowed and will either return a copy or
 *          apply the alpha channel depending the options
 * @returns {Image} - Grey scale image (with or without alpha depending the options)
 * @example
 * var grey = image.grey();
 */

function grey() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'luma709' : _options$algorithm;
    var _options$keepAlpha = options.keepAlpha;
    var keepAlpha = _options$keepAlpha === undefined ? false : _options$keepAlpha;
    var _options$mergeAlpha = options.mergeAlpha;
    var mergeAlpha = _options$mergeAlpha === undefined ? true : _options$mergeAlpha;
    var _options$allowGrey = options.allowGrey;
    var allowGrey = _options$allowGrey === undefined ? false : _options$allowGrey;


    var valid = {
        bitDepth: [8, 16],
        alpha: [0, 1]
    };

    if (!allowGrey) {
        valid.colorModel = [_model.RGB];
        valid.components = [3];
    }

    this.checkProcessable('grey', valid);

    if (this.components === 1) {
        algorithm = 'red'; // actually we just take the first channel if it is a grey image
    }

    keepAlpha &= this.alpha;
    mergeAlpha &= this.alpha;
    if (keepAlpha) {
        mergeAlpha = false;
    }

    var newImage = _Image2.default.createFrom(this, {
        components: 1,
        alpha: keepAlpha,
        colorModel: null
    });

    var method = _greyAlgorithms.methods[algorithm.toLowerCase()];
    if (!method) {
        throw new Error('Unsupported grey algorithm: ' + algorithm);
    }

    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        if (mergeAlpha) {
            newImage.data[ptr++] = method(this.data, i, this) * this.data[i + this.components] / this.maxValue;
        } else {
            newImage.data[ptr++] = method(this.data, i, this);
            if (newImage.alpha) {
                newImage.data[ptr++] = this.data[i + this.components];
            }
        }
    }

    return newImage;
}

},{"../Image":145,"../model/model":185,"./greyAlgorithms":203}],203:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var methods = exports.methods = {
    luma709: function luma709(data, i) {
        // sRGB
        // return data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        // Let's do a little trick ... in order not convert the integer to a double we do
        // the multiplication with integer to reach a total of 32768 and then shift the bits
        // of 15 to the right
        // This does a Math.floor and may lead to small (max 1) difference
        // Same result, > 10% faster on the full grey conversion
        return data[i] * 6966 + data[i + 1] * 23436 + data[i + 2] * 2366 >> 15;
    },
    luma601: function luma601(data, i) {
        // NTSC
        // return this.data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        return data[i] * 9798 + data[i + 1] * 19235 + data[i + 2] * 3735 >> 15;
    },
    maximum: function maximum(data, i) {
        return Math.max(data[i], data[i + 1], data[i + 2]);
    },
    minimum: function minimum(data, i) {
        return Math.min(data[i], data[i + 1], data[i + 2]);
    },
    average: function average(data, i) {
        return (data[i] + data[i + 1] + data[i + 2]) / 3 >> 0;
    },
    minmax: function minmax(data, i) {
        return (Math.max(data[i], data[i + 1], data[i + 2]) + Math.min(data[i], data[i + 1], data[i + 2])) / 2;
    },
    red: function red(data, i) {
        return data[i];
    },
    green: function green(data, i) {
        return data[i + 1];
    },
    blue: function blue(data, i) {
        return data[i + 2];
    },
    cyan: function cyan(data, i, image) {
        var black = methods.black(data, i, image);
        return (image.maxValue - data[0] - black) / (1 - black / image.maxValue) >> 0;
    },
    magenta: function magenta(data, i, image) {
        var black = methods.black(data, i, image);
        return (image.maxValue - data[1] - black) / (1 - black / image.maxValue) >> 0;
    },
    yellow: function yellow(data, i, image) {
        var black = methods.black(data, i, image);
        return (image.maxValue - data[2] - black) / (1 - black / image.maxValue) >> 0;
    },
    black: function black(data, i, image) {
        return Math.min(image.maxValue - data[i], image.maxValue - data[i + 1], image.maxValue - data[i + 2]);
    },
    hue: function hue(data, i, image) {
        var min = methods.min(data, i);
        var max = methods.max(data, i);
        if (max === min) {
            return 0;
        }
        var hue = 0;
        var delta = max - min;

        switch (max) {
            case data[i]:
                hue = (data[i + 1] - data[i + 2]) / delta + (data[i + 1] < data[i + 2] ? 6 : 0);
                break;
            case data[i + 1]:
                hue = (data[i + 2] - data[i]) / delta + 2;
                break;
            case data[i + 2]:
                hue = (data[i] - data[i + 1]) / delta + 4;
                break;
            default:
                throw new Error('unreachable');
        }
        return hue / 6 * image.maxValue >> 0;
    },
    saturation: function saturation(data, i, image) {
        // from HSV model
        var min = methods.min(data, i);
        var max = methods.max(data, i);
        var delta = max - min;
        return max === 0 ? 0 : delta / max * image.maxValue;
    },
    lightness: function lightness(data, i) {
        var min = methods.min(data, i);
        var max = methods.max(data, i);
        return (max + min) / 2;
    }
};

Object.defineProperty(methods, 'luminosity', { enumerable: false, value: methods.lightness });
Object.defineProperty(methods, 'luminance', { enumerable: false, value: methods.lightness });
Object.defineProperty(methods, 'min', { enumerable: false, value: methods.minimum });
Object.defineProperty(methods, 'max', { enumerable: false, value: methods.maximum });
Object.defineProperty(methods, 'brightness', { enumerable: false, value: methods.maximum });

var names = exports.names = Object.keys(methods);

},{}],204:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hsl;

var _model = require('../model/model');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make a copy of the current image and convert the color model to HSL
 * The source image has to be RGB !
 * @memberof Image
 * @instance
  * @returns {Image} - New image in HSL color model
 * @example
 * var hslImage = image.hsl();
 * // we can create one image per channel
 * var channels = hslImage.split();
 */

// http://www.easyrgb.com/index.php?X=MATH&H=18#text18
// check rgbToHsl : https://bgrins.github.io/TinyColor/docs/tinycolor.html

function hsl() {
    this.checkProcessable('hsl', {
        bitDepth: [8, 16],
        alpha: [0, 1],
        colorModel: [_model.RGB]
    });

    var newImage = _Image2.default.createFrom(this, {
        colorModel: _model.HSL
    });

    var threshold = Math.floor(this.maxValue / 2);
    var ptr = 0;
    var data = this.data;
    for (var i = 0; i < data.length; i += this.channels) {
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];

        var max = Math.max(red, green, blue);
        var min = Math.min(red, green, blue);
        var hue = 0;
        var saturation = 0;
        var luminance = (max + min) / 2;
        if (max !== min) {
            var delta = max - min;
            saturation = luminance > threshold ? delta / (2 - max - min) : delta / (max + min);
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
                default:
                    throw new Error('unreachable');
            }
            hue /= 6;
        }

        newImage.data[ptr++] = hue * this.maxValue;
        newImage.data[ptr++] = saturation * this.maxValue;
        newImage.data[ptr++] = luminance;
        if (this.alpha) {
            newImage.data[ptr++] = data[i + 3];
        }
    }

    return newImage;
}

},{"../Image":145,"../model/model":185}],205:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hsv;

var _model = require('../model/model');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make a copy of the current image and convert the color model to HSV
 * The source image has to be RGB !
 * @memberof Image
 * @instance
 * @returns {Image} - New image in HSV color model
 * @example
 * var hsvImage = image.hsv();
 * // we can create one image per channel
 * var channels = hsvImage.split();
 */

// based on https://bgrins.github.io/TinyColor/docs/tinycolor.html

function hsv() {
    this.checkProcessable('hsv', {
        bitDepth: [8, 16],
        alpha: [0, 1],
        colorModel: [_model.RGB]
    });

    var newImage = _Image2.default.createFrom(this, {
        colorModel: _model.HSV
    });

    var ptr = 0;
    var data = this.data;
    for (var i = 0; i < data.length; i += this.channels) {
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];

        var min = Math.min(red, green, blue);
        var max = Math.max(red, green, blue);
        var delta = max - min;
        var hue = 0;
        var saturation = max === 0 ? 0 : delta / max;
        var value = max;

        if (max !== min) {
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
                default:
                    throw new Error('unreachable');
            }
            hue /= 6;
        }

        newImage.data[ptr++] = hue * this.maxValue;
        newImage.data[ptr++] = saturation * this.maxValue;
        newImage.data[ptr++] = value;
        if (this.alpha) {
            newImage.data[ptr++] = data[i + 3];
        }
    }

    return newImage;
}

},{"../Image":145,"../model/model":185}],206:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = huang;
/*
 *
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html.
 * Huang: Implements Huang's fuzzy thresholding method: Huang, L-K & Wang, M-J J (1995),
 * "Image thresholding by minimizing the measure of fuzziness", Pattern Recognition 28(1): 41-51
 *
 */

function huang(histogram) {
    /* Determine the first non-zero bin */
    var firstBin = 0;
    for (var ih = 0; ih < histogram.length; ih++) {
        if (histogram[ih] !== 0) {
            firstBin = ih;
            break;
        }
    }

    /* Determine the last non-zero bin */
    var lastBin = histogram.length - 1;
    for (var _ih = histogram.length - 1; _ih >= firstBin; _ih--) {
        if (histogram[_ih] !== 0) {
            lastBin = _ih;
            break;
        }
    }

    var term = 1.0 / (lastBin - firstBin);
    var mu0 = new Array(histogram.length);
    var sumPix = 0;
    var numPix = 0;
    for (var _ih2 = firstBin; _ih2 < histogram.length; _ih2++) {
        sumPix += _ih2 * histogram[_ih2];
        numPix += histogram[_ih2];
        mu0[_ih2] = sumPix / numPix;
    }

    var mu1 = new Array(histogram.length);
    sumPix = numPix = 0;
    for (var _ih3 = lastBin; _ih3 > 0; _ih3--) {
        sumPix += _ih3 * histogram[_ih3];
        numPix += histogram[_ih3];
        mu1[_ih3 - 1] = sumPix / numPix;
    }

    /* Determine the threshold that minimizes the fuzzy entropy*/
    var threshold = -1;
    var minEnt = Number.MAX_VALUE;
    for (var it = 0; it < histogram.length; it++) {
        var ent = 0;
        var muX = void 0;
        for (var _ih4 = 0; _ih4 <= it; _ih4++) {
            /* Equation (4) in Ref. 1 */
            muX = 1 / (1 + term * Math.abs(_ih4 - mu0[it]));
            if (!(muX < 1e-06 || muX > 0.999999)) {
                /* Equation (6) & (8) in Ref. 1 */
                ent += histogram[_ih4] * (-muX * Math.log(muX) - (1 - muX) * Math.log(1 - muX));
            }
        }

        for (var _ih5 = it + 1; _ih5 < histogram.length; _ih5++) {
            /* Equation (4) in Ref. 1 */
            muX = 1 / (1 + term * Math.abs(_ih5 - mu1[it]));
            if (!(muX < 1e-06 || muX > 0.999999)) {
                /* Equation (6) & (8) in Ref. 1 */
                ent += histogram[_ih5] * (-muX * Math.log(muX) - (1 - muX) * Math.log(1 - muX));
            }
        }

        if (ent < minEnt) {
            minEnt = ent;
            threshold = it;
        }
    }
    return threshold;
}

},{}],207:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = intermodes;
/*
 *
 * see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
 * Intermodes: This assumes a bimodal histogram. Implements the thresholding Prewitt, JMS & Mendelsohn, ML (1966),
 * "The analysis of cell images", Annals of the NewYork Academy of Sciences 128: 1035-1053
 *
 */

function intermodes(histogram) {
    var iHisto = histogram.slice();
    var iter = 0;
    while (!bimodalTest(iHisto)) {
        //smooth with a 3 point running mean filter
        var previous = 0,
            current = 0,
            next = iHisto[0];
        for (var i = 0; i < histogram.length - 1; i++) {
            previous = current;
            current = next;
            next = iHisto[i + 1];
            iHisto[i] = (previous + current + next) / 3;
        }
        iHisto[histogram.length - 1] = (current + next) / 3;
        iter++;
        if (iter > 10000) {
            throw new Error('Intermodes Threshold not found after 10000 iterations');
        }
    }

    // The threshold is the mean between the two peaks.
    var tt = 0;
    for (var _i = 1; _i < histogram.length - 1; _i++) {
        if (iHisto[_i - 1] < iHisto[_i] && iHisto[_i + 1] < iHisto[_i]) {
            tt += _i;
        }
    }
    return Math.floor(tt / 2.0);
}

function bimodalTest(iHisto) {
    var b = false;
    var modes = 0;

    for (var k = 1; k < iHisto.length - 1; k++) {
        if (iHisto[k - 1] < iHisto[k] && iHisto[k + 1] < iHisto[k]) {
            modes++;
            if (modes > 2) {
                return false;
            }
        }
    }
    if (modes === 2) {
        b = true;
    }
    return b;
}

},{}],208:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isodata;
/*
 * see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
 * Isodata: Ridler, TW & Calvard, S (1978), "Picture thresholding using an iterative selection method"
 * IEEE Transactions on Systems, Man and Cybernetics 8: 630-632.
 *
 */
function isodata(histogram) {

    var l = void 0; //the average grey value of pixels with intensities < g
    var toth = void 0; //the the average grey value of pixels with intensities > g
    var totl = void 0; //the total the average grey value of pixels with intensities < g
    var h = void 0; //the average grey value of pixels with intensities > g
    var g = 0; //threshold value

    for (var i = 1; i < histogram.length; i++) {
        if (histogram[i] > 0) {
            g = i + 1;
            break;
        }
    }

    while (true) {
        l = 0;
        totl = 0;
        for (var _i = 0; _i < g; _i++) {
            totl = totl + histogram[_i];
            l = l + histogram[_i] * _i;
        }
        h = 0;
        toth = 0;
        for (var _i2 = g + 1; _i2 < histogram.length; _i2++) {
            toth += histogram[_i2];
            h += histogram[_i2] * _i2;
        }
        if (totl > 0 && toth > 0) {
            l /= totl;
            h /= toth;
            if (g === Math.round((l + h) / 2.0)) {
                break;
            }
        }
        g++;
        if (g > histogram.length - 2) {
            throw new Error('Threshold not found');
        }
    }
    return g;
}

},{}],209:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = li;
/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: Implements Li's Minimum Cross Entropy thresholding method
 * This implementation is based on the iterative version (Ref. 2nd reference below) of the algorithm.
 *  1) Li, CH & Lee, CK (1993), "Minimum Cross 	Entropy Thresholding", Pattern Recognition 26(4): 61 625
 *  2) Li, CH & Tam, PKS (1998), "An Iterative 	Algorithm for Minimum Cross Entropy Thresholding",
 *     Pattern 	Recognition Letters 18(8): 771-776
 *  3) Sezgin, M & Sankur, B (2004), "Survey 	over Image Thresholding Techniques and Quantitative Performance
 *     Evaluation",Journal of Electronic Imaging 13(1): 146-165
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

function li(histogram, total) {

    var threshold = void 0;
    var sumBack = void 0; /* sum of the background pixels at a given threshold */
    var sumObj = void 0; /* sum of the object pixels at a given threshold */
    var numBack = void 0; /* number of background pixels at a given threshold */
    var numObj = void 0; /* number of object pixels at a given threshold */
    var oldThresh = void 0;
    var newThresh = void 0;
    var meanBack = void 0; /* mean of the background pixels at a given threshold */
    var meanObj = void 0; /* mean of the object pixels at a given threshold */
    var mean = void 0; /* mean gray-level in the image */
    var tolerance = void 0; /* threshold tolerance */
    var temp = void 0;
    tolerance = 0.5;

    /* Calculate the mean gray-level */
    mean = 0.0;
    for (var ih = 0; ih < histogram.length; ih++) {
        mean += ih * histogram[ih];
    }

    mean /= total;
    /* Initial estimate */
    newThresh = mean;

    do {
        oldThresh = newThresh;
        threshold = oldThresh + 0.5 | 0; /* range */

        /* Calculate the means of background and object pixels */
        /* Background */
        sumBack = 0;
        numBack = 0;

        for (var _ih = 0; _ih <= threshold; _ih++) {
            sumBack += _ih * histogram[_ih];
            numBack += histogram[_ih];
        }
        meanBack = numBack === 0 ? 0.0 : sumBack / numBack;

        /* Object */
        sumObj = 0;
        numObj = 0;
        for (var _ih2 = threshold + 1; _ih2 < histogram.length; _ih2++) {
            sumObj += _ih2 * histogram[_ih2];
            numObj += histogram[_ih2];
        }
        meanObj = numObj === 0 ? 0.0 : sumObj / numObj;
        temp = (meanBack - meanObj) / (Math.log(meanBack) - Math.log(meanObj));

        if (temp < -Number.EPSILON) {
            newThresh = temp - 0.5 | 0;
        } else {
            newThresh = temp + 0.5 | 0;
        }
        /*  Stop the iterations when the difference between the
         new and old threshold values is less than the tolerance */
    } while (Math.abs(newThresh - oldThresh) > tolerance);

    return threshold;
}

},{}],210:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mask;

var _Image = require('../../Image');

var _Image2 = _interopRequireDefault(_Image);

var _maskAlgorithms = require('./maskAlgorithms');

var _converter = require('../../../util/converter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creation of binary mask is based on the determination of a threshold
 * You may either choose among the provided algorithm or just specify a threshold value
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {string} [options.algorithm='threshold']
 * @param {number} [options.threshold=0.5] - If the algorithm is 'threshold' specify here the value (0 to 1).
 * @param {boolean} [options.useAlpha=true] - Apply the alpha channel to determine the intensity of the pixel.
 * @param {boolean} [options.invert=false] - Invert the resulting image
 * @return {Image} - Binary image containing the mask
 */
function mask() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'threshold' : _options$algorithm;
    var _options$threshold = options.threshold;
    var threshold = _options$threshold === undefined ? 0.5 : _options$threshold;
    var _options$useAlpha = options.useAlpha;
    var useAlpha = _options$useAlpha === undefined ? true : _options$useAlpha;
    var _options$invert = options.invert;
    var invert = _options$invert === undefined ? false : _options$invert;


    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8, 16]
    });

    if (algorithm === 'threshold') {
        threshold = (0, _converter.getThreshold)(threshold, this.maxValue);
    } else {
        var method = _maskAlgorithms.methods[algorithm.toLowerCase()];
        if (method) {
            var histogram = this.getHistogram();
            threshold = method(histogram, this.size);
        } else {
            throw new Error('mask transform unknown algorithm: ' + algorithm);
        }
    }

    var newImage = new _Image2.default(this.width, this.height, {
        kind: 'BINARY',
        parent: this
    });

    var ptr = 0;
    if (this.alpha && useAlpha) {
        for (var i = 0; i < this.data.length; i += this.channels) {
            var value = this.data[i] + (this.maxValue - this.data[i]) * (this.maxValue - this.data[i + 1]) / this.maxValue;
            if (invert && value <= threshold || !invert && value >= threshold) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    } else {
        for (var _i = 0; _i < this.data.length; _i += this.channels) {
            if (invert && this.data[_i] <= threshold || !invert && this.data[_i] >= threshold) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    }

    return newImage;
}

},{"../../../util/converter":256,"../../Image":145,"./maskAlgorithms":211}],211:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.names = exports.methods = undefined;

var _huang = require('./huang');

var _huang2 = _interopRequireDefault(_huang);

var _intermodes = require('./intermodes');

var _intermodes2 = _interopRequireDefault(_intermodes);

var _isodata = require('./isodata');

var _isodata2 = _interopRequireDefault(_isodata);

var _li = require('./li');

var _li2 = _interopRequireDefault(_li);

var _maxEntropy = require('./maxEntropy');

var _maxEntropy2 = _interopRequireDefault(_maxEntropy);

var _mean = require('./mean');

var _mean2 = _interopRequireDefault(_mean);

var _minError = require('./minError');

var _minError2 = _interopRequireDefault(_minError);

var _minimum = require('./minimum');

var _minimum2 = _interopRequireDefault(_minimum);

var _moments = require('./moments');

var _moments2 = _interopRequireDefault(_moments);

var _otsu = require('./otsu');

var _otsu2 = _interopRequireDefault(_otsu);

var _percentile = require('./percentile');

var _percentile2 = _interopRequireDefault(_percentile);

var _renyiEntropy = require('./renyiEntropy.js');

var _renyiEntropy2 = _interopRequireDefault(_renyiEntropy);

var _shanbhag = require('./shanbhag');

var _shanbhag2 = _interopRequireDefault(_shanbhag);

var _triangle = require('./triangle');

var _triangle2 = _interopRequireDefault(_triangle);

var _yen = require('./yen');

var _yen2 = _interopRequireDefault(_yen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = exports.methods = {
    huang: _huang2.default,
    intermodes: _intermodes2.default,
    isodata: _isodata2.default,
    li: _li2.default,
    maxentropy: _maxEntropy2.default,
    mean: _mean2.default,
    minerror: _minError2.default,
    minimum: _minimum2.default,
    moments: _moments2.default,
    otsu: _otsu2.default,
    percentile: _percentile2.default,
    renyientropy: _renyiEntropy2.default,
    shanbhag: _shanbhag2.default,
    triangle: _triangle2.default,
    yen: _yen2.default
};

var names = exports.names = ['threshold'].concat(Object.keys(methods));

},{"./huang":206,"./intermodes":207,"./isodata":208,"./li":209,"./maxEntropy":212,"./mean":213,"./minError":214,"./minimum":215,"./moments":216,"./otsu":217,"./percentile":218,"./renyiEntropy.js":219,"./shanbhag":220,"./triangle":221,"./yen":222}],212:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maxEntropy;
/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: Implements Kapur-Sahoo-Wong (Maximum Entropy) thresholding method:
 * Kapur, JN; Sahoo, PK & Wong, ACK (1985), "A New Method for Gray-Level Picture Thresholding Using the Entropy of the Histogram",
 * Graphical Models and Image Processing 29(3): 273-285
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

function maxEntropy(histogram, total) {
    var normHisto = new Array(histogram.length); // normalized histogram
    for (var ih = 0; ih < histogram.length; ih++) {
        normHisto[ih] = histogram[ih] / total;
    }

    var P1 = new Array(histogram.length); // cumulative normalized histogram
    var P2 = new Array(histogram.length);
    P1[0] = normHisto[0];
    P2[0] = 1.0 - P1[0];

    for (var _ih = 1; _ih < histogram.length; _ih++) {
        P1[_ih] = P1[_ih - 1] + normHisto[_ih];
        P2[_ih] = 1.0 - P1[_ih];
    }

    /* Determine the first non-zero bin */
    var firstBin = 0;
    for (var _ih2 = 0; _ih2 < histogram.length; _ih2++) {
        if (Math.abs(P1[_ih2]) >= Number.EPSILON) {
            firstBin = _ih2;
            break;
        }
    }

    /* Determine the last non-zero bin */
    var lastBin = histogram.length - 1;
    for (var _ih3 = histogram.length - 1; _ih3 >= firstBin; _ih3--) {
        if (Math.abs(P2[_ih3]) >= Number.EPSILON) {
            lastBin = _ih3;
            break;
        }
    }

    // Calculate the total entropy each gray-level
    // and find the threshold that maximizes it
    var threshold = -1;
    var totEnt = void 0; // total entropy
    var maxEnt = Number.MIN_VALUE; // max entropy
    var entBack = void 0; // entropy of the background pixels at a given threshold
    var entObj = void 0; // entropy of the object pixels at a given threshold

    for (var it = firstBin; it <= lastBin; it++) {
        /* Entropy of the background pixels */
        entBack = 0.0;
        for (var _ih4 = 0; _ih4 <= it; _ih4++) {
            if (histogram[_ih4] !== 0) {
                entBack -= normHisto[_ih4] / P1[it] * Math.log(normHisto[_ih4] / P1[it]);
            }
        }

        /* Entropy of the object pixels */
        entObj = 0.0;
        for (var _ih5 = it + 1; _ih5 < histogram.length; _ih5++) {
            if (histogram[_ih5] !== 0) {
                entObj -= normHisto[_ih5] / P2[it] * Math.log(normHisto[_ih5] / P2[it]);
            }
        }

        /* Total entropy */
        totEnt = entBack + entObj;

        if (maxEnt < totEnt) {
            maxEnt = totEnt;
            threshold = it;
        }
    }
    return threshold;
}

},{}],213:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mean;
/*
 * The method is present in: Uses the 	mean of grey levels as the threshold. It is described in:
 * Glasbey, CA (1993), "An analysis of histogram-based thresholding algorithms",
 * CVGIP: Graphical Models and Image Processing 55: 532-537
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

function mean(histogram, total) {
    var sum = 0;
    for (var i = 0; i < histogram.length; i++) {
        sum += i * histogram[i];
    }
    return Math.floor(sum / total);
}

},{}],214:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = minError;
/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: An 	iterative implementation of Kittler and Illingworth's Minimum Error
 * thresholding:Kittler, J & Illingworth, J (1986), "Minimum error thresholding", Pattern Recognition 19: 41-47
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

function minError(histogram, total) {

    var threshold = void 0;
    var Tprev = -2;
    var mu = void 0,
        nu = void 0,
        p = void 0,
        q = void 0,
        sigma2 = void 0,
        tau2 = void 0,
        w0 = void 0,
        w1 = void 0,
        w2 = void 0,
        sqterm = void 0,
        temp = void 0;

    /* Calculate the mean gray-level */
    var mean = 0.0;
    for (var ih = 0; ih < histogram.length; ih++) {
        mean += ih * histogram[ih];
    }

    mean /= total;

    threshold = mean;

    while (threshold !== Tprev) {
        //Calculate some statistics.
        var sumA1 = sumA(histogram, threshold);
        var sumA2 = sumA(histogram, histogram.length - 1);
        var sumB1 = sumB(histogram, threshold);
        var sumB2 = sumB(histogram, histogram.length - 1);
        var sumC1 = sumC(histogram, threshold);
        var sumC2 = sumC(histogram, histogram.length - 1);

        mu = sumB1 / sumA1;
        nu = (sumB2 - sumB1) / (sumA2 - sumA1);
        p = sumA1 / sumA2;
        q = (sumA2 - sumA1) / sumA2;
        sigma2 = sumC1 / sumA1 - mu * mu;
        tau2 = (sumC2 - sumC1) / (sumA2 - sumA1) - nu * nu;

        //The terms of the quadratic equation to be solved.
        w0 = 1.0 / sigma2 - 1.0 / tau2;
        w1 = mu / sigma2 - nu / tau2;
        w2 = mu * mu / sigma2 - nu * nu / tau2 + Math.log10(sigma2 * (q * q) / (tau2 * (p * p)));

        //If the next threshold would be imaginary, return with the current one.
        sqterm = w1 * w1 - w0 * w2;
        if (sqterm < 0) {
            return threshold;
        }

        //The updated threshold is the integer part of the solution of the quadratic equation.
        Tprev = threshold;
        temp = (w1 + Math.sqrt(sqterm)) / w0;

        if (isNaN(temp)) {
            threshold = Tprev;
        } else {
            threshold = Math.floor(temp);
        }
    }
    return threshold;
}

//aux func

function sumA(y, j) {
    var x = 0;
    for (var i = 0; i <= j; i++) {
        x += y[i];
    }
    return x;
}

function sumB(y, j) {
    var x = 0;
    for (var i = 0; i <= j; i++) {
        x += i * y[i];
    }
    return x;
}

function sumC(y, j) {
    var x = 0;
    for (var i = 0; i <= j; i++) {
        x += i * i * y[i];
    }
    return x;
}

},{}],215:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = minimum;
//see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// J. M. S. Prewitt and M. L. Mendelsohn, "The analysis of cell images," in
// Annals of the New York Academy of Sciences, vol. 128, pp. 1035-1053, 1966.
// ported to ImageJ plugin by G.Landini from Antti Niemisto's Matlab code (GPL)
// Original Matlab code Copyright (C) 2004 Antti Niemisto
// See http://www.cs.tut.fi/~ant/histthresh/ for an excellent slide presentation
// and the original Matlab code
function minimum(histogram) {
    if (histogram.length < 2) {
        //validate that the histogram has at least two color values
        return 0;
    }
    var iterations = 0; //number of iterations of the smoothing process
    var threshold = -1;
    var max = -1; // maximum color value with a greater number of pixels to 0
    var histogramCopy = new Array(histogram.length); //a copy of the histogram
    for (var i = 0; i < histogram.length; i++) {
        histogramCopy[i] = histogram[i];
        if (histogram[i] > 0) {
            max = i;
        }
    }
    while (!bimodalTest(histogramCopy)) {
        histogramCopy = smoothed(histogramCopy);
        iterations++;
        if (iterations > 10000) {
            //if they occur more than 10000 iterations it returns -1
            return threshold;
        }
    }
    threshold = minimumBetweenPeeks(histogramCopy, max);
    return threshold;
}
function smoothed(histogram) {
    //Smooth with a 3 point running mean filter
    var auHistogram = new Array(histogram.length); // a copy of the histograma for the smoothing process
    for (var i = 1; i < histogram.length - 1; i++) {
        auHistogram[i] = (histogram[i - 1] + histogram[i] + histogram[i + 1]) / 3;
    }
    auHistogram[0] = (histogram[0] + histogram[1]) / 3;
    auHistogram[histogram.length - 1] = (histogram[histogram.length - 2] + histogram[histogram.length - 1]) / 3;
    return auHistogram;
}
function minimumBetweenPeeks(histogramBimodal, max) {
    var threshold = void 0;
    for (var i = 1; i < max; i++) {
        if (histogramBimodal[i - 1] > histogramBimodal[i] && histogramBimodal[i + 1] >= histogramBimodal[i]) {
            threshold = i;
            break;
        }
    }
    return threshold;
}
function bimodalTest(histogram) {
    //It is responsible for determining if a histogram is bimodal
    var len = histogram.length;
    var isBimodal = false;
    var peaks = 0;
    for (var k = 1; k < len - 1; k++) {
        if (histogram[k - 1] < histogram[k] && histogram[k + 1] < histogram[k]) {
            peaks++;
            if (peaks > 2) {
                return false;
            }
        }
    }
    if (peaks === 2) {
        isBimodal = true;
    }
    return isBimodal;
}

},{}],216:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = moments;
//see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// W. Tsai, "Moment-preserving thresholding: a new approach," Computer Vision,
// Graphics, and Image Processing, vol. 29, pp. 377-393, 1985.
// Ported to ImageJ plugin by G.Landini from the the open source project FOURIER 0.8
// by M. Emre Celebi , Department of Computer Science, Louisiana State University in Shreveport
// Shreveport, LA 71115, USA
// http://sourceforge.net/projects/fourier-ipal
// http://www.lsus.edu/faculty/~ecelebi/fourier.htm
function moments(histogram, total) {
    //moments
    var m0 = 1.0;
    var m1 = 0.0;
    var m2 = 0.0;
    var m3 = 0.0;
    var sum = 0.0;
    var p0 = void 0;
    var cd = void 0,
        c0 = void 0,
        c1 = void 0,
        z0 = void 0,
        z1 = void 0; /* auxiliary variables */
    var threshold = -1;
    var histogramLength = histogram.length;
    var normalizedHistogram = new Array(histogramLength);
    for (var i = 0; i < histogramLength; i++) {
        normalizedHistogram[i] = histogram[i] / total;
    }
    /* Calculate the first, second, and third order moments */
    for (var _i = 0; _i < histogramLength; _i++) {
        m1 += _i * normalizedHistogram[_i];
        m2 += _i * _i * normalizedHistogram[_i];
        m3 += _i * _i * _i * normalizedHistogram[_i];
    }
    /*
     First 4 moments of the gray-level image should match the first 4 moments
     of the target binary image. This leads to 4 equalities whose solutions
     are given in the Appendix of Ref. 1
     */
    cd = m0 * m2 - m1 * m1; //determinant of the matriz of hankel for moments 2x2
    c0 = (-m2 * m2 + m1 * m3) / cd;
    c1 = (m0 * -m3 + m2 * m1) / cd;
    //new two gray values where z0<z1
    z0 = 0.5 * (-c1 - Math.sqrt(c1 * c1 - 4.0 * c0));
    z1 = 0.5 * (-c1 + Math.sqrt(c1 * c1 - 4.0 * c0));
    p0 = (z1 - m1) / (z1 - z0); /* Fraction of the object pixels in the target binary image (p0z0+p1z1=m1) */
    // The threshold is the gray-level closest to the p0-tile of the normalized histogram
    for (var _i2 = 0; _i2 < histogramLength; _i2++) {
        sum += normalizedHistogram[_i2];
        if (sum > p0) {
            threshold = _i2;
            break;
        }
    }
    return threshold;
}

},{}],217:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = otsu;
/*
 * The method is present in: Otsu, N (1979), "A threshold selection method from gray-level histograms", IEEE Trans. Sys., Man., Cyber. 9: 62-66
 * The Otsu implementation is based on: https://en.wikipedia.org/wiki/Otsu's_method
 * @param histogram - the histogram of the image
 * @returns {number} - the threshold
 */

function otsu(histogram, total) {

    var sum = 0; //Total Intensities of the histogram
    var sumB = 0; //Total intensities in the 1-class histogram
    var wB = 0; //Total pixels in the 1-class histogram
    var wF = 0; //Total pixels in the 2-class histogram
    var mB = void 0; //Mean of 1-class intensities
    var mF = void 0; //Mean of 2-class intensities
    var max = 0.0; //Auxiliary variable to save temporarily the max variance
    var between = 0.0; //To save the current variance
    var threshold = 0.0;

    for (var i = 1; i < histogram.length; ++i) {
        sum += i * histogram[i];
    }

    for (var _i = 1; _i < histogram.length; ++_i) {
        wB += histogram[_i];

        if (wB === 0) {
            continue;
        }
        wF = total - wB;
        if (wF === 0) {
            break;
        }

        sumB += _i * histogram[_i];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;
        between = wB * wF * (mB - mF) * (mB - mF);

        if (between >= max) {
            threshold = _i;
            max = between;
        }
    }
    return threshold;
}

},{}],218:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = percentile;
// See http://imagej.nih.gov/ij/download/tools/source/ij/process/AutoThresholder.java
// W. Doyle, "Operation useful for similarity-invariant pattern recognition,"
// Journal of the Association for Computing Machinery, vol. 9,pp. 259-267, 1962.
// ported to ImageJ plugin by G.Landini from Antti Niemisto's Matlab code (GPL)
// Original Matlab code Copyright (C) 2004 Antti Niemisto
// See http://www.cs.tut.fi/~ant/histthresh/ for an excellent slide presentation
// and the original Matlab code.
function percentile(histogram) {
    var threshold = -1;
    var percentile = 0.5; // default fraction of foreground pixels
    var avec = new Array(histogram.length);

    var total = partialSum(histogram, histogram.length - 1);
    var temp = 1.0;

    for (var i = 0; i < histogram.length; i++) {
        avec[i] = Math.abs(partialSum(histogram, i) / total - percentile);
        if (avec[i] < temp) {
            temp = avec[i];
            threshold = i;
        }
    }

    return threshold;
}

function partialSum(histogram, endIndex) {
    var x = 0;
    for (var i = 0; i <= endIndex; i++) {
        x += histogram[i];
    }
    return x;
}

},{}],219:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = renyiEntropy;

var _numSort = require('num-sort');

function renyiEntropy(histogram, total) {
    var optThreshold = void 0; //Optimal threshold
    var firstBin = void 0; //First non-zero bin
    var lastBin = void 0; //last non-zero bin

    var normHisto = new Array(histogram.length); //normalized histogram
    var P1 = new Array(histogram.length); //acumulative normalized histogram
    var P2 = new Array(histogram.length); //acumulative normalized histogram

    //Entropy Variables
    var threshold1 = 0;
    var threshold2 = 0;
    var threshold3 = 0;
    var maxEnt1 = 0.0;
    var maxEnt2 = 0.0;
    var maxEnt3 = 0.0;
    var alpha2 = 0.5;
    var term2 = 1.0 / (1.0 - alpha2);
    var alpha3 = 2.0;
    var term3 = 1.0 / (1.0 - alpha3);

    for (var ih = 0; ih < histogram.length; ih++) {
        normHisto[ih] = histogram[ih] / total;
    }

    P1[0] = normHisto[0];
    P2[0] = 1.0 - P1[0];
    for (var _ih = 1; _ih < histogram.length; _ih++) {
        P1[_ih] = P1[_ih - 1] + normHisto[_ih];
        P2[_ih] = 1.0 - P1[_ih];
    }

    /* Determine the first non-zero bin */
    firstBin = 0;
    for (var _ih2 = 0; _ih2 < histogram.length; _ih2++) {
        if (Math.abs(P1[_ih2]) >= Number.EPSILON) {
            firstBin = _ih2;
            break;
        }
    }

    /* Determine the last non-zero bin */
    lastBin = histogram.length - 1;
    for (var _ih3 = histogram.length - 1; _ih3 >= firstBin; _ih3--) {
        if (Math.abs(P2[_ih3]) >= Number.EPSILON) {
            lastBin = _ih3;
            break;
        }
    }

    /* Maximum Entropy Thresholding - BEGIN */
    /* ALPHA = 1.0 */
    /* Calculate the total entropy each gray-level
     and find the threshold that maximizes it
     */
    for (var it = firstBin; it <= lastBin; it++) {
        /* Entropy of the background pixels */
        var entBack1 = 0.0;
        var entBack2 = 0.0;
        var entBack3 = 0.0;
        for (var _ih4 = 0; _ih4 <= it; _ih4++) {
            if (histogram[_ih4] !== 0) {
                entBack1 -= normHisto[_ih4] / P1[it] * Math.log(normHisto[_ih4] / P1[it]);
            }
            entBack2 += Math.sqrt(normHisto[_ih4] / P1[it]);
            entBack3 += normHisto[_ih4] * normHisto[_ih4] / (P1[it] * P1[it]);
        }

        /* Entropy of the object pixels */
        var entObj1 = 0.0;
        var entObj2 = 0.0;
        var entObj3 = 0.0;
        for (var _ih5 = it + 1; _ih5 < histogram.length; _ih5++) {
            if (histogram[_ih5] !== 0) {
                entObj1 -= normHisto[_ih5] / P2[it] * Math.log(normHisto[_ih5] / P2[it]);
            }
            entObj2 += Math.sqrt(normHisto[_ih5] / P2[it]);
            entObj3 += normHisto[_ih5] * normHisto[_ih5] / (P2[it] * P2[it]);
        }

        /* Total entropy */
        var totEnt1 = entBack1 + entObj1;
        var totEnt2 = term2 * (entBack2 * entObj2 > 0.0 ? Math.log(entBack2 * entObj2) : 0.0);
        var totEnt3 = term3 * (entBack3 * entObj3 > 0.0 ? Math.log(entBack3 * entObj3) : 0.0);

        if (totEnt1 > maxEnt1) {
            maxEnt1 = totEnt1;
            threshold1 = it;
        }

        if (totEnt2 > maxEnt2) {
            maxEnt2 = totEnt2;
            threshold2 = it;
        }

        if (totEnt3 > maxEnt3) {
            maxEnt3 = totEnt3;
            threshold3 = it;
        }
    }
    /* End Maximum Entropy Thresholding */

    var tStars = [threshold1, threshold2, threshold3];
    tStars.sort(_numSort.asc);

    var betas = void 0;

    /* Adjust beta values */
    if (Math.abs(tStars[0] - tStars[1]) <= 5) {
        if (Math.abs(tStars[1] - tStars[2]) <= 5) {
            betas = [1, 2, 1];
        } else {
            betas = [0, 1, 3];
        }
    } else {
        if (Math.abs(tStars[1] - tStars[2]) <= 5) {
            betas = [3, 1, 0];
        } else {
            betas = [1, 2, 1];
        }
    }

    /* Determine the optimal threshold value */
    var omega = P1[tStars[2]] - P1[tStars[0]];
    optThreshold = Math.round(tStars[0] * (P1[tStars[0]] + 0.25 * omega * betas[0]) + 0.25 * tStars[1] * omega * betas[1] + tStars[2] * (P2[tStars[2]] + 0.25 * omega * betas[2]));

    return optThreshold;
} // see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Kapur J.N., Sahoo P.K., and Wong A.K.C. (1985) "A New Method for
// Gray-Level Picture Thresholding Using the Entropy of the Histogram"
// Graphical Models and Image Processing, 29(3): 273-285
// M. Emre Celebi
// 06.15.2007
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

},{"num-sort":114}],220:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = shanbhag;
// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Shanhbag A.G. (1994) "Utilization of Information Measure as a Means of
// Image Thresholding" Graphical Models and Image Processing, 56(5): 414-419
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

function shanbhag(histogram, total) {
    var normHisto = new Array(histogram.length); // normalized histogram
    for (var ih = 0; ih < histogram.length; ih++) {
        normHisto[ih] = histogram[ih] / total;
    }

    var P1 = new Array(histogram.length); // cumulative normalized histogram
    var P2 = new Array(histogram.length);
    P1[0] = normHisto[0];
    P2[0] = 1.0 - P1[0];
    for (var _ih = 1; _ih < histogram.length; _ih++) {
        P1[_ih] = P1[_ih - 1] + normHisto[_ih];
        P2[_ih] = 1.0 - P1[_ih];
    }

    /* Determine the first non-zero bin */
    var firstBin = 0;
    for (var _ih2 = 0; _ih2 < histogram.length; _ih2++) {
        if (Math.abs(P1[_ih2]) >= Number.EPSILON) {
            firstBin = _ih2;
            break;
        }
    }

    /* Determine the last non-zero bin */
    var lastBin = histogram.length - 1;
    for (var _ih3 = histogram.length - 1; _ih3 >= firstBin; _ih3--) {
        if (Math.abs(P2[_ih3]) >= Number.EPSILON) {
            lastBin = _ih3;
            break;
        }
    }

    // Calculate the total entropy each gray-level
    // and find the threshold that maximizes it
    var threshold = -1;
    var minEnt = Number.MAX_VALUE; // min entropy

    var term = void 0;
    var totEnt = void 0; // total entropy
    var entBack = void 0; // entropy of the background pixels at a given threshold
    var entObj = void 0; // entropy of the object pixels at a given threshold
    for (var it = firstBin; it <= lastBin; it++) {
        /* Entropy of the background pixels */
        entBack = 0.0;
        term = 0.5 / P1[it];
        for (var _ih4 = 1; _ih4 <= it; _ih4++) {
            entBack -= normHisto[_ih4] * Math.log(1.0 - term * P1[_ih4 - 1]);
        }
        entBack *= term;

        /* Entropy of the object pixels */
        entObj = 0.0;
        term = 0.5 / P2[it];
        for (var _ih5 = it + 1; _ih5 < histogram.length; _ih5++) {
            entObj -= normHisto[_ih5] * Math.log(1.0 - term * P2[_ih5]);
        }
        entObj *= term;

        /* Total entropy */
        totEnt = Math.abs(entBack - entObj);

        if (totEnt < minEnt) {
            minEnt = totEnt;
            threshold = it;
        }
    }
    return threshold;
}

},{}],221:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = triangle;
// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Zack, G. W., Rogers, W. E. and Latt, S. A., 1977,
// Automatic Measurement of Sister Chromatid Exchange Frequency,
// Journal of Histochemistry and Cytochemistry 25 (7), pp. 741-753
//
//  modified from Johannes Schindelin plugin
function triangle(histogram) {

    // find min and max
    var min = 0,
        dmax = 0,
        max = 0,
        min2 = 0;
    for (var i = 0; i < histogram.length; i++) {
        if (histogram[i] > 0) {
            min = i;
            break;
        }
    }
    if (min > 0) {
        // line to the (p==0) point, not to histogram[min]
        min--;
    }

    // The Triangle algorithm cannot tell whether the data is skewed to one side or another.
    // This causes a problem as there are 2 possible thresholds between the max and the 2 extremes
    // of the histogram.
    // Here I propose to find out to which side of the max point the data is furthest, and use that as
    //  the other extreme.
    for (var _i = histogram.length - 1; _i > 0; _i--) {
        if (histogram[_i] > 0) {
            min2 = _i;
            break;
        }
    }
    if (min2 < histogram.length - 1) {
        // line to the (p==0) point, not to data[min]
        min2++;
    }

    for (var _i2 = 0; _i2 < histogram.length; _i2++) {
        if (histogram[_i2] > dmax) {
            max = _i2;
            dmax = histogram[_i2];
        }
    }

    // find which is the furthest side
    var inverted = false;
    if (max - min < min2 - max) {
        // reverse the histogram
        inverted = true;
        var left = 0; // index of leftmost element
        var right = histogram.length - 1; // index of rightmost element
        while (left < right) {
            // exchange the left and right elements
            var temp = histogram[left];
            histogram[left] = histogram[right];
            histogram[right] = temp;
            // move the bounds toward the center
            left++;
            right--;
        }
        min = histogram.length - 1 - min2;
        max = histogram.length - 1 - max;
    }

    if (min === max) {
        return min;
    }

    // describe line by nx * x + ny * y - d = 0
    var nx = void 0,
        ny = void 0,
        d = void 0;
    // nx is just the max frequency as the other point has freq=0
    nx = histogram[max]; //-min; // data[min]; //  lowest value bmin = (p=0)% in the image
    ny = min - max;
    d = Math.sqrt(nx * nx + ny * ny);
    nx /= d;
    ny /= d;
    d = nx * min + ny * histogram[min];

    // find split point
    var split = min;
    var splitDistance = 0;
    for (var _i3 = min + 1; _i3 <= max; _i3++) {
        var newDistance = nx * _i3 + ny * histogram[_i3] - d;
        if (newDistance > splitDistance) {
            split = _i3;
            splitDistance = newDistance;
        }
    }
    split--;

    if (inverted) {
        // The histogram might be used for something else, so let's reverse it back
        var _left = 0;
        var _right = histogram.length - 1;
        while (_left < _right) {
            var _temp = histogram[_left];
            histogram[_left] = histogram[_right];
            histogram[_right] = _temp;
            _left++;
            _right--;
        }
        return histogram.length - 1 - split;
    } else {
        return split;
    }
}

},{}],222:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = yen;
// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Implements Yen  thresholding method
// 1) Yen J.C., Chang F.J., and Chang S. (1995) "A New Criterion
//    for Automatic Multilevel Thresholding" IEEE Trans. on Image
//    Processing, 4(3): 370-378
// 2) Sezgin M. and Sankur B. (2004) "Survey over Image Thresholding
//    Techniques and Quantitative Performance Evaluation" Journal of
//    Electronic Imaging, 13(1): 146-165
//    http://citeseer.ist.psu.edu/sezgin04survey.html
//
// M. Emre Celebi
// 06.15.2007
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

function yen(histogram, total) {
    var normHisto = new Array(histogram.length); // normalized histogram
    for (var ih = 0; ih < histogram.length; ih++) {
        normHisto[ih] = histogram[ih] / total;
    }

    var P1 = new Array(histogram.length); // cumulative normalized histogram
    P1[0] = normHisto[0];
    for (var _ih = 1; _ih < histogram.length; _ih++) {
        P1[_ih] = P1[_ih - 1] + normHisto[_ih];
    }

    var P1Sq = new Array(histogram.length);
    P1Sq[0] = normHisto[0] * normHisto[0];
    for (var _ih2 = 1; _ih2 < histogram.length; _ih2++) {
        P1Sq[_ih2] = P1Sq[_ih2 - 1] + normHisto[_ih2] * normHisto[_ih2];
    }

    var P2Sq = new Array(histogram.length);
    P2Sq[histogram.length - 1] = 0.0;
    for (var _ih3 = histogram.length - 2; _ih3 >= 0; _ih3--) {
        P2Sq[_ih3] = P2Sq[_ih3 + 1] + normHisto[_ih3 + 1] * normHisto[_ih3 + 1];
    }

    /* Find the threshold that maximizes the criterion */
    var threshold = -1;
    var maxCrit = Number.MIN_VALUE;
    var crit = void 0;
    for (var it = 0; it < histogram.length; it++) {
        crit = -1.0 * (P1Sq[it] * P2Sq[it] > 0.0 ? Math.log(P1Sq[it] * P2Sq[it]) : 0.0) + 2 * (P1[it] * (1.0 - P1[it]) > 0.0 ? Math.log(P1[it] * (1.0 - P1[it])) : 0.0);
        if (crit > maxCrit) {
            maxCrit = crit;
            threshold = it;
        }
    }
    return threshold;
}

},{}],223:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pad;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

var _copy = require('../utility/copy');

var _copy2 = _interopRequireDefault(_copy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 * @param {number} [options.size=0]
 * @param {string} [options.algorithm='copy']
 * @param {array<number>} [options.color]
 */

function pad() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$size = options.size;
    var size = _options$size === undefined ? 0 : _options$size;
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'copy' : _options$algorithm;
    var color = options.color;


    this.checkProcessable('pad', {
        bitDepth: [8, 16]
    });

    if (algorithm === 'set') {
        if (color.length !== this.channels) {
            throw new Error('pad: the color array must have the same length as the number of channels. Here: ' + this.channels);
        }
        for (var i = 0; i < color.length; i++) {
            if (color[i] === 0) {
                color[i] = 0.001;
            }
        }
    } else {
        color = (0, _newArray2.default)(this.channels, null);
    }

    if (!Array.isArray(size)) {
        size = [size, size];
    }

    var newWidth = this.width + size[0] * 2;
    var newHeight = this.height + size[1] * 2;
    var channels = this.channels;

    var newImage = _Image2.default.createFrom(this, { width: newWidth, height: newHeight });

    (0, _copy2.default)(this, newImage, size[0], size[1]);

    for (var _i = size[0]; _i < newWidth - size[0]; _i++) {
        for (var k = 0; k < channels; k++) {
            var value = color[k] || newImage.data[(size[1] * newWidth + _i) * channels + k];
            for (var j = 0; j < size[1]; j++) {
                newImage.data[(j * newWidth + _i) * channels + k] = value;
            }
            value = color[k] || newImage.data[((newHeight - size[1] - 1) * newWidth + _i) * channels + k];
            for (var _j = newHeight - size[1]; _j < newHeight; _j++) {
                newImage.data[(_j * newWidth + _i) * channels + k] = value;
            }
        }
    }

    for (var _j2 = 0; _j2 < newHeight; _j2++) {
        for (var _k = 0; _k < channels; _k++) {
            var _value = color[_k] || newImage.data[(_j2 * newWidth + size[0]) * channels + _k];
            for (var _i2 = 0; _i2 < size[0]; _i2++) {
                newImage.data[(_j2 * newWidth + _i2) * channels + _k] = _value;
            }
            _value = color[_k] || newImage.data[(_j2 * newWidth + newWidth - size[0] - 1) * channels + _k];
            for (var _i3 = newWidth - size[0]; _i3 < newWidth; _i3++) {
                newImage.data[(_j2 * newWidth + _i3) * channels + _k] = _value;
            }
        }
    }

    return newImage;
}

},{"../Image":145,"../utility/copy":229,"new-array":113}],224:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = resizeBinary;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _kindNames = require('../kindNames');

var KindNames = _interopRequireWildcard(_kindNames);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is a temporary code that should be placed in the more general resize method
 * it only works for scaled down !
 * @memberof Image
 * @instance
 */

function resizeBinary() {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

    this.checkProcessable('resizeBinary', {
        bitDepth: [1]
    });

    var width = Math.floor(this.width * scale);
    var height = Math.floor(this.height * scale);
    var shiftX = Math.round((this.width - width) / 2);
    var shiftY = Math.round((this.height - height) / 2);

    var newImage = _Image2.default.createFrom(this, {
        kind: KindNames.BINARY,
        width: width,
        height: height,
        position: [shiftX, shiftY],
        parent: this
    });

    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            if (this.getBitXY(x, y)) {
                newImage.setBitXY(Math.floor(x * scale), Math.floor(y * scale));
            }
        }
    }

    return newImage;
}

},{"../Image":145,"../kindNames":182}],225:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rgba8;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make a copy of the current image and convert to RGBA 8 bits
 * Those images are the one that are displayed in a canvas.
 * RGB model in 8 bits per channel and containing as well an alpha channel.
 * The source image may be:
 * * a mask (binary image)
 * * a grey image (8 or 16 bits) with or without alpha channel
 * * a color image (8 or 16 bits) with or without alpha channel in with RGB model
 * The conversion is based on {@link Image#getRGBAData}.
 * @memberof Image
 * @instance
 * @returns {Image} - New image in RGB color model with alpha channel
 * @example
 * var rgbaImage = image.rgba8();
 */

function rgba8() {
    var newImage = new _Image2.default(this.width, this.height, {
        kind: 'RGBA'
    });

    newImage.data = this.getRGBAData();
    return newImage;
}

},{"../Image":145}],226:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = nearestNeighbor;
/**
 * Nearest neighbor scaling algorithm
 * @private
 * @param {Image} newImage
 * @param {number} newWidth
 * @param {number} newHeight
 */
function nearestNeighbor(newImage, newWidth, newHeight) {
    var wRatio = this.width / newWidth;
    var hRatio = this.height / newHeight;
    for (var i = 0; i < newWidth; i++) {
        var w = Math.floor((i + 0.5) * wRatio);
        for (var j = 0; j < newHeight; j++) {
            var h = Math.floor((j + 0.5) * hRatio);
            for (var c = 0; c < this.channels; c++) {
                newImage.setValueXY(i, j, c, this.getValueXY(w, h, c));
            }
        }
    }
}

},{}],227:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = scale;

var _Image = require('../../Image');

var _Image2 = _interopRequireDefault(_Image);

var _nearestNeighbor = require('./nearestNeighbor');

var _nearestNeighbor2 = _interopRequireDefault(_nearestNeighbor);

var _converter = require('../../../util/converter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Rescale an image
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.width=this.width] - new width
 * @param {number} [options.height=this.height] - new height
 * @param {number} [options.factor=1] - scaling factor (applied to the new width and height values)
 * @param {string} [options.algorithm='nearestNeighbor']
 * @return {Image}
 */
function scale() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$width = options.width;
    var width = _options$width === undefined ? this.width : _options$width;
    var _options$height = options.height;
    var height = _options$height === undefined ? this.height : _options$height;
    var _options$factor = options.factor;
    var factor = _options$factor === undefined ? 1 : _options$factor;
    var _options$algorithm = options.algorithm;
    var algorithm = _options$algorithm === undefined ? 'nearestNeighbor' : _options$algorithm;

    var _factorDimensions = (0, _converter.factorDimensions)(factor, width, height);

    var newWidth = _factorDimensions.width;
    var newHeight = _factorDimensions.height;


    if (width === this.width && height === this.height) {
        return this.clone();
    }

    var newImage = _Image2.default.createFrom(this, { width: newWidth, height: newHeight });

    switch (algorithm.toLowerCase()) {
        case 'nearestneighbor':
        case 'nearestneighbour':
            _nearestNeighbor2.default.call(this, newImage, newWidth, newHeight);
            break;
        default:
            throw new Error('Unsupported scale algorithm: ' + algorithm);
    }

    return newImage;
}

},{"../../../util/converter":256,"../../Image":145,"./nearestNeighbor":226}],228:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = combineChannels;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a new grey Image by combining the channels of the current image.
 * @memberof Image
 * @instance
 * @param {function} method
 * @param {object} [options]
 * @param {boolean} [options.mergeAlpha=false]
 * @param {boolean} [options.keepAlpha=false]
 * @return {Image}
 */
function combineChannels() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultCombineMethod;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$mergeAlpha = options.mergeAlpha;
    var mergeAlpha = _options$mergeAlpha === undefined ? false : _options$mergeAlpha;
    var _options$keepAlpha = options.keepAlpha;
    var keepAlpha = _options$keepAlpha === undefined ? false : _options$keepAlpha;


    mergeAlpha &= this.alpha;
    keepAlpha &= this.alpha;

    this.checkProcessable('combineChannels', {
        bitDepth: [8, 16]
    });

    var newImage = _Image2.default.createFrom(this, {
        components: 1,
        alpha: keepAlpha,
        colorModel: null
    });

    var ptr = 0;
    for (var i = 0; i < this.size; i++) {
        // TODO quite slow because we create a new pixel each time
        var value = method(this.getPixel(i));
        if (mergeAlpha) {
            newImage.data[ptr++] = value * this.data[i * this.channels + this.components] / this.maxValue;
        } else {
            newImage.data[ptr++] = value;
            if (keepAlpha) {
                newImage.data[ptr++] = this.data[i * this.channels + this.components];
            }
        }
    }

    return newImage;
}

function defaultCombineMethod(pixel) {
    return (pixel[0] + pixel[1] + pixel[2]) / 3;
}

},{"../Image":145}],229:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = copyImage;
/**
 * Make a copy of the current image
 * @memberof Image
 * @instance
 */

function copyImage(fromImage, toImage, x, y) {
    var fromWidth = fromImage.width;
    var fromHeight = fromImage.height;
    var toWidth = toImage.width;
    var channels = fromImage.channels;
    for (var i = 0; i < fromWidth; i++) {
        for (var j = 0; j < fromHeight; j++) {
            for (var k = 0; k < channels; k++) {
                var source = (j * fromWidth + i) * channels + k;
                var target = ((y + j) * toWidth + x + i) * channels + k;
                toImage.data[target] = fromImage.data[source];
            }
        }
    }
}

},{}],230:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = match;

var _matrix = require('../../util/matrix');

var _matrix2 = _interopRequireDefault(_matrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Try to match the current pictures with another one

/**
 * @memberof Image
 * @instance
 */

function match(image) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var border = _ref.border;


    this.checkProcessable('getChannel', {
        bitDepth: [8, 16]
    });

    if (this.bitDepth !== image.bitDepth) {
        throw new Error('Both images must have the same bitDepth');
    }
    if (this.channels !== image.channels) {
        throw new Error('Both images must have the same number of channels');
    }
    if (this.colorModel !== image.colorModel) {
        throw new Error('Both images must have the same colorModel');
    }

    // there could be many names
    var similarityMatrix = new _matrix2.default(image.width, image.height, -Infinity);

    var currentX = Math.floor(image.width / 2);
    var currentY = Math.floor(image.height / 2);
    var middleX = currentX;
    var middleY = currentY;
    var theEnd = false;

    while (!theEnd) {
        var toCalculatePositions = similarityMatrix.localSearch(currentX, currentY, -Infinity);
        for (var i = 0; i < toCalculatePositions.length; i++) {
            var position = toCalculatePositions[i];
            var similarity = this.getSimilarity(image, { border: border, shift: [middleX - position[0], middleY - position[1]] });
            similarityMatrix[position[0]][position[1]] = similarity;
        }

        var max = similarityMatrix.localMax(currentX, currentY);
        if (max.position[0] !== currentX || max.position[1] !== currentY) {
            currentX = max.position[0];
            currentY = max.position[1];
        } else {
            theEnd = true;
        }
    }

    /*
    for (let i=0; i<similarityMatrix.length; i++) {
        let line=[];
        for (let j=0; j<similarityMatrix[i].length; j++) {
            line.push(similarityMatrix[i][j]);
        }
        console.log(line.join(" "));
    }
    console.log(currentX, middleX, currentY, middleY);
    */

    return [currentX - middleX, currentY - middleY];
}

},{"../../util/matrix":261}],231:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getChannel;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _channel = require('./../../util/channel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a grey image based on the selected channel
 * @memberof Image
 * @instance
 * @param {number|string} channel
 * @param {object} [options]
 * @param {boolean} [options.keepAlpha]
 * @param {boolean} [options.mergeAlpha]
 * @return {Image} A grey image with the extracted channel
 */
function getChannel(channel) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$keepAlpha = options.keepAlpha;
    var keepAlpha = _options$keepAlpha === undefined ? false : _options$keepAlpha;
    var _options$mergeAlpha = options.mergeAlpha;
    var mergeAlpha = _options$mergeAlpha === undefined ? false : _options$mergeAlpha;


    keepAlpha &= this.alpha;
    mergeAlpha &= this.alpha;

    this.checkProcessable('getChannel', {
        bitDepth: [8, 16]
    });

    channel = (0, _channel.validateChannel)(this, channel);

    var newImage = _Image2.default.createFrom(this, {
        components: 1,
        alpha: keepAlpha,
        colorModel: null
    });
    var ptr = 0;
    for (var j = 0; j < this.data.length; j += this.channels) {
        if (mergeAlpha) {
            newImage.data[ptr++] = this.data[j + channel] * this.data[j + this.components] / this.maxValue;
        } else {
            newImage.data[ptr++] = this.data[j + channel];
            if (keepAlpha) {
                newImage.data[ptr++] = this.data[j + this.components];
            }
        }
    }

    return newImage;
}

},{"../Image":145,"./../../util/channel":254}],232:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getColumn;
/**
 * @memberof Image
 * @instance
 */

function getColumn(column) {
    var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    this.checkProcessable('getColumn', {
        bitDepth: [8, 16]
    });

    this.checkColumn(column);
    this.checkChannel(channel);

    var array = new Array(this.height);
    var ptr = 0;
    var step = this.width * this.channels;
    for (var j = channel + column * this.channels; j < this.data.length; j += step) {
        array[ptr++] = this.data[j];
    }
    return array;
}

},{}],233:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getMatrix;

var _mlMatrix = require('ml-matrix');

var _mlMatrix2 = _interopRequireDefault(_mlMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.channel]
 * @return {Matrix}
 */
function getMatrix() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var channel = options.channel;

    this.checkProcessable('getMatrix', {
        bitDepth: [8, 16]
    });

    if (channel === undefined) {
        if (this.components > 1) {
            throw new RangeError('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }

    var matrix = new _mlMatrix2.default(this.height, this.width);
    for (var x = 0; x < this.height; x++) {
        for (var y = 0; y < this.width; y++) {
            matrix.set(x, y, this.getValueXY(y, x, channel));
        }
    }

    return matrix;
}

},{"ml-matrix":86}],234:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getPixelsArray;
/**
 * Returns an array of arrays containing the pixel values in the form
 * [[R1, G1, B1], [R2, G2, B2], ...]
 * @memberof Image
 * @instance
 * @returns {number[][]}
 */

function getPixelsArray() {
    this.checkProcessable('getPixelsArray', {
        bitDepth: [8, 16, 32]
    });

    var array = new Array(this.size);
    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        var pixel = new Array(this.components);
        for (var j = 0; j < this.components; j++) {
            pixel[j] = this.data[i + j];
        }
        array[ptr++] = pixel;
    }

    return array;
}

},{}],235:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getPixelsGrid;
/**
 * @memberof Image
 * @instance
 */

function getPixelsGrid() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$sampling = _ref.sampling;
    var sampling = _ref$sampling === undefined ? [10, 10] : _ref$sampling;
    var _ref$painted = _ref.painted;
    var painted = _ref$painted === undefined ? false : _ref$painted;
    var mask = _ref.mask;


    this.checkProcessable('getPixelsGrid', {
        bitDepth: [8, 16],
        channels: 1
    });

    if (!Array.isArray(sampling)) {
        sampling = [sampling, sampling];
    }

    var xSampling = sampling[0];
    var ySampling = sampling[1];
    var nbSamples = xSampling * ySampling;

    var xyS = new Array(nbSamples);
    var zS = new Array(nbSamples);

    var xStep = this.width / xSampling;
    var yStep = this.height / ySampling;
    var currentX = Math.floor(xStep / 2);

    var position = 0;
    for (var i = 0; i < xSampling; i++) {
        var currentY = Math.floor(yStep / 2);
        for (var j = 0; j < ySampling; j++) {
            var x = Math.round(currentX);
            var y = Math.round(currentY);
            if (!mask || mask.getBitXY(x, y)) {
                xyS[position] = [x, y];
                zS[position] = this.getPixelXY(x, y);
                position++;
            }
            currentY += yStep;
        }
        currentX += xStep;
    }

    // resize arrays if needed
    xyS.length = position;
    zS.length = position;

    var toReturn = { xyS: xyS, zS: zS };

    if (painted) {
        toReturn.painted = this.rgba8().paintPoints(xyS);
    }

    return toReturn;
}

},{}],236:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getRow;
/**
 * @memberof Image
 * @instance
 */

function getRow(row) {
    var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    this.checkProcessable('getRow', {
        bitDepth: [8, 16]
    });

    this.checkRow(row);
    this.checkChannel(channel);

    var array = new Array(this.width);
    var ptr = 0;
    var begin = row * this.width * this.channels + channel;
    var end = begin + this.width * this.channels;
    for (var j = begin; j < end; j += this.channels) {
        array[ptr++] = this.data[j];
    }

    return array;
}

},{}],237:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getSimilarity;

var _channel = require('./../../util/channel');

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Try to match the current pictures with another one

// if normalize we normalize separately the 2 images

/**
 * @memberof Image
 * @instance
 */

function getSimilarity(image) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref$shift = _ref.shift;
    var shift = _ref$shift === undefined ? [0, 0] : _ref$shift;
    var average = _ref.average;
    var channels = _ref.channels;
    var defaultAlpha = _ref.defaultAlpha;
    var normalize = _ref.normalize;
    var _ref$border = _ref.border;
    var border = _ref$border === undefined ? [0, 0] : _ref$border;


    this.checkProcessable('getSimilarity', {
        bitDepth: [8, 16]
    });

    if (!Array.isArray(border)) {
        border = [border, border];
    }
    channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels, defaultAlpha: defaultAlpha });

    if (this.bitDepth !== image.bitDepth) {
        throw new Error('Both images must have the same bitDepth');
    }
    if (this.channels !== image.channels) {
        throw new Error('Both images must have the same number of channels');
    }
    if (this.colorModel !== image.colorModel) {
        throw new Error('Both images must have the same colorModel');
    }

    if (typeof average === 'undefined') {
        average = true;
    }

    // we allow a shift
    // we need to find the minX, maxX, minY, maxY
    var minX = Math.max(border[0], -shift[0]);
    var maxX = Math.min(this.width - border[0], this.width - shift[0]);
    var minY = Math.max(border[1], -shift[1]);
    var maxY = Math.min(this.height - border[1], this.height - shift[1]);

    var results = (0, _newArray2.default)(channels.length, 0);
    for (var i = 0; i < channels.length; i++) {
        var c = channels[i];
        var sumThis = normalize ? this.sum[c] : Math.max(this.sum[c], image.sum[c]);
        var sumImage = normalize ? image.sum[c] : Math.max(this.sum[c], image.sum[c]);

        if (sumThis !== 0 && sumImage !== 0) {
            for (var x = minX; x < maxX; x++) {
                for (var y = minY; y < maxY; y++) {
                    var indexThis = x * this.multiplierX + y * this.multiplierY + c;
                    var indexImage = indexThis + shift[0] * this.multiplierX + shift[1] * this.multiplierY;
                    results[i] += Math.min(this.data[indexThis] / sumThis, image.data[indexImage] / sumImage);
                }
            }
        }
    }

    if (average) {
        return results.reduce((sum, x) => sum + x) / results.length;
    }
    return results;
}

},{"./../../util/channel":254,"new-array":113}],238:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setBorder;

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this method will change the border
// that may not be calculated

/**
 * @memberof Image
 * @instance
 */

function setBorder() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$size = _ref.size;
    var size = _ref$size === undefined ? 0 : _ref$size;
    var _ref$algorithm = _ref.algorithm;
    var algorithm = _ref$algorithm === undefined ? 'copy' : _ref$algorithm;
    var color = _ref.color;


    this.checkProcessable('setBorder', {
        bitDepth: [8, 16, 32, 64]
    });

    if (algorithm === 'set') {
        if (color.length !== this.channels) {
            throw new Error('setBorder: the color array must have the same length as the number of channels. Here: ' + this.channels);
        }
        for (var i = 0; i < color.length; i++) {
            if (color[i] === 0) {
                color[i] = 0.001;
            }
        }
    } else {
        color = (0, _newArray2.default)(this.channels, null);
    }

    if (!Array.isArray(size)) {
        size = [size, size];
    }

    var leftRightSize = size[0];
    var topBottomSize = size[1];
    var channels = this.channels;

    for (var _i = leftRightSize; _i < this.width - leftRightSize; _i++) {
        for (var k = 0; k < channels; k++) {
            var value = color[k] || this.data[(_i + this.width * topBottomSize) * channels + k];
            for (var j = 0; j < topBottomSize; j++) {
                this.data[(j * this.width + _i) * channels + k] = value;
            }
            value = color[k] || this.data[(_i + this.width * (this.height - topBottomSize - 1)) * channels + k];
            for (var _j = this.height - topBottomSize; _j < this.height; _j++) {
                this.data[(_j * this.width + _i) * channels + k] = value;
            }
        }
    }

    for (var _j2 = 0; _j2 < this.height; _j2++) {
        for (var _k = 0; _k < channels; _k++) {
            var _value = color[_k] || this.data[(_j2 * this.width + leftRightSize) * channels + _k];
            for (var _i2 = 0; _i2 < leftRightSize; _i2++) {
                this.data[(_j2 * this.width + _i2) * channels + _k] = _value;
            }
            _value = color[_k] || this.data[(_j2 * this.width + this.width - leftRightSize - 1) * channels + _k];
            for (var _i3 = this.width - leftRightSize; _i3 < this.width; _i3++) {
                this.data[(_j2 * this.width + _i3) * channels + _k] = _value;
            }
        }
    }
}

},{"new-array":113}],239:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setChannel;

var _channel = require('./../../util/channel');

/**
 * @memberof Image
 * @instance
 */

function setChannel(channel, image) {

    this.checkProcessable('setChannel', {
        bitDepth: [8, 16]
    });

    image.checkProcessable('setChannel (image parameter check)', {
        bitDepth: [this.bitDepth],
        alpha: [0],
        components: [1]
    });

    if (image.width !== this.width || image.height !== this.height) {
        throw new Error('Images must have exactly the same width and height');
    }

    channel = (0, _channel.validateChannel)(this, channel);

    var ptr = channel;
    for (var i = 0; i < image.data.length; i++) {
        this.data[ptr] = image.data[i];
        ptr += this.channels;
    }
}

},{"./../../util/channel":254}],240:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setMatrix;
/**
 * We set the data of the image from a matrix. The size of the matrix and the data have to be the same.
 * @memberof Image
 * @instance
 * @param {Matrix} matrix
 * @param {object} [options]
 * @param {number} [options.channel]
 */
function setMatrix(matrix) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channel = options.channel;

    this.checkProcessable('getMatrix', {
        bitDepth: [8, 16]
    });

    if (channel === undefined) {
        if (this.components > 1) {
            throw new RangeError('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }

    if (!matrix.length || !matrix[0].length || this.width !== matrix.columns || this.height !== matrix.rows) {
        throw new RangeError('The size of the matrix must be equal to the size of the image');
    }

    for (var x = 0; x < this.height; x++) {
        for (var y = 0; y < this.width; y++) {
            this.setValueXY(y, x, channel, matrix.get(x, y));
        }
    }
}

},{}],241:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = split;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 */

function split() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$preserveAlpha = _ref.preserveAlpha;
    var preserveAlpha = _ref$preserveAlpha === undefined ? true : _ref$preserveAlpha;


    this.checkProcessable('split', {
        bitDepth: [8, 16]
    });

    // split will always return an array of images
    if (this.components === 1) {
        return [this.clone()];
    }

    var images = [];

    var data = this.data;
    if (this.alpha && preserveAlpha) {
        for (var i = 0; i < this.components; i++) {
            var newImage = _Image2.default.createFrom(this, {
                components: 1,
                alpha: true,
                colorModel: null
            });
            var ptr = 0;
            for (var j = 0; j < data.length; j += this.channels) {
                newImage.data[ptr++] = data[j + i];
                newImage.data[ptr++] = data[j + this.components];
            }
            images.push(newImage);
        }
    } else {
        for (var _i = 0; _i < this.channels; _i++) {
            var _newImage = _Image2.default.createFrom(this, {
                components: 1,
                alpha: false,
                colorModel: null
            });
            var _ptr = 0;
            for (var _j = 0; _j < data.length; _j += this.channels) {
                _newImage.data[_ptr++] = data[_j + _i];
            }
            images.push(_newImage);
        }
    }

    return images;
}

},{"../Image":145}],242:[function(require,module,exports){
'use strict';

var _environment = require('./image/environment');

var _arrayIncludes = require('array-includes');

var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_arrayIncludes2.default.shim();

// Shim support for Array.prototype.includes


module.exports = exports = require('./image/Image').default;
exports.Stack = require('./stack/Stack').default;
exports.Shape = require('./util/shape').default;
exports.Kernel = require('./kernel/kernel');

exports.Static = {
    grey: require('./image/transform/greyAlgorithms').names,
    mask: require('./image/transform/mask/maskAlgorithms').names
};

if (_environment.env === 'browser') {
    exports.Worker = require('./worker/worker').default;
}

},{"./image/Image":145,"./image/environment":159,"./image/transform/greyAlgorithms":203,"./image/transform/mask/maskAlgorithms":211,"./kernel/kernel":243,"./stack/Stack":245,"./util/shape":262,"./worker/worker":266,"array-includes":2}],243:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kernels = require('../util/kernels');

Object.keys(_kernels).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _kernels[key];
    }
  });
});

var _laplacianOfGaussian = require('./laplacianOfGaussian');

Object.defineProperty(exports, 'laplacianOfGaussian', {
  enumerable: true,
  get: function get() {
    return _laplacianOfGaussian.laplacianOfGaussian;
  }
});

},{"../util/kernels":260,"./laplacianOfGaussian":244}],244:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.laplacianOfGaussian = laplacianOfGaussian;
// http://homepages.inf.ed.ac.uk/rbf/HIPR2/log.htm

function laplacianOfGaussian(sigma, nPoints, factor) {
    var kernel = new Array(nPoints);
    var i = void 0,
        j = void 0,
        x2 = void 0,
        y2 = void 0;
    if (!factor) {
        factor = 100;
    }
    factor *= -1; //-480/(Math.PI*Math.pow(sigma,4));
    var center = (nPoints - 1) / 2;
    var sigma2 = 2 * sigma * sigma;
    for (i = 0; i < nPoints; i++) {
        kernel[i] = new Array(nPoints);
        y2 = (i - center) * (i - center);
        for (j = 0; j < nPoints; j++) {
            x2 = (j - center) * (j - center);
            kernel[i][j] = Math.round(factor * (1 - (x2 + y2) / sigma2) * Math.exp(-(x2 + y2) / sigma2));
        }
    }

    return kernel;
}

},{}],245:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

var _Image = require('../image/Image');

var _Image2 = _interopRequireDefault(_Image);

var _hasOwn = require('has-own');

var _hasOwn2 = _interopRequireDefault(_hasOwn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

/**
 * Class representing stack of images
 * @class Stack
 */
class Stack extends Array {
    constructor(images) {
        if (Array.isArray(images)) {
            super(images.length);
            for (var i = 0; i < images.length; i++) {
                this[i] = images[i];
            }
        } else if (typeof images === 'number') {
            super(images);
        } else {
            super();
        }
        this.computed = null;
    }

    static load(urls) {
        return Promise.all(urls.map(_Image2.default.load)).then(images => new Stack(images));
    }

    static extendMethod(name, method) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var _ref$inPlace = _ref.inPlace;
        var inPlace = _ref$inPlace === undefined ? false : _ref$inPlace;
        var _ref$returnThis = _ref.returnThis;
        var returnThis = _ref$returnThis === undefined ? true : _ref$returnThis;
        var _ref$partialArgs = _ref.partialArgs;
        var partialArgs = _ref$partialArgs === undefined ? [] : _ref$partialArgs;

        if (inPlace) {
            Stack.prototype[name] = function () {
                // remove computed properties
                this.computed = null;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var result = method.apply(this, [].concat(_toConsumableArray(partialArgs), args));
                if (returnThis) {
                    return this;
                }
                return result;
            };
        } else {
            Stack.prototype[name] = function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return method.apply(this, [].concat(_toConsumableArray(partialArgs), args));
            };
        }
        return Stack;
    }

    static extendProperty(name, method) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var _ref2$partialArgs = _ref2.partialArgs;
        var partialArgs = _ref2$partialArgs === undefined ? [] : _ref2$partialArgs;

        computedPropertyDescriptor.get = function () {
            if (this.computed === null) {
                this.computed = {};
            } else if ((0, _hasOwn2.default)(name, this.computed)) {
                return this.computed[name];
            }
            var result = method.apply(this, partialArgs);
            this.computed[name] = result;
            return result;
        };
        Object.defineProperty(Stack.prototype, name, computedPropertyDescriptor);
        return Stack;
    }

    /**
     * Check if a process can be applied on the stack
     * @param {string} processName
     * @param {object} [options]
     * @private
     */
    checkProcessable(processName) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (typeof processName !== 'string') {
            throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
        }
        if (this.size === 0) {
            throw new TypeError('The process: ' + processName + ' can not be applied on an empty stack');
        }
        this[0].checkProcessable(processName, options);
        for (var i = 1; i < this.length; i++) {
            if ((options.sameSize === undefined || options.sameSize) && this[0].width !== this[i].width) {
                throw new TypeError('The process: ' + processName + ' can not be applied if width is not identical in all images');
            }
            if ((options.sameSize === undefined || options.sameSize) && this[0].height !== this[i].height) {
                throw new TypeError('The process: ' + processName + ' can not be applied if height is not identical in all images');
            }
            if ((options.sameAlpha === undefined || options.sameAlpha) && this[0].alpha !== this[i].alpha) {
                throw new TypeError('The process: ' + processName + ' can not be applied if alpha is not identical in all images');
            }
            if ((options.sameBitDepth === undefined || options.sameBitDepth) && this[0].bitDepth !== this[i].bitDepth) {
                throw new TypeError('The process: ' + processName + ' can not be applied if bitDepth is not identical in all images');
            }
            if ((options.sameColorModel === undefined || options.sameColorModel) && this[0].colorModel !== this[i].colorModel) {
                throw new TypeError('The process: ' + processName + ' can not be applied if colorModel is not identical in all images');
            }
            if ((options.sameNumberChannels === undefined || options.sameNumberChannels) && this[0].channels !== this[i].channels) {
                throw new TypeError('The process: ' + processName + ' can not be applied if channels is not identical in all images');
            }
        }
    }
}

exports.default = Stack;
if (!Array[Symbol.species]) {
    // support old engines
    Stack.prototype.map = function (cb, thisArg) {
        if (typeof cb !== 'function') {
            throw new TypeError(cb + ' is not a function');
        }
        var newStack = new Stack(this.length);
        for (var i = 0; i < this.length; i++) {
            newStack[i] = cb.call(thisArg, this[i], i, this);
        }
        return newStack;
    };
}

(0, _extend2.default)(Stack);

},{"../image/Image":145,"./extend":251,"has-own":44}],246:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = histogram;
/**
 * @memberof Stack
 * @instance
 */

function histogram(options) {

    this.checkProcessable('min', {
        bitDepth: [8, 16]
    });

    var histogram = this[0].getHistogram(options);
    for (var i = 1; i < this.length; i++) {
        var secondHistogram = this[i].getHistogram(options);
        for (var j = 0; j < histogram.length; j++) {
            histogram[j] += secondHistogram[j];
        }
    }
    return histogram;
}

},{}],247:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = histograms;
/**
 * @memberof Stack
 * @instance
 */

function histograms(options) {

    this.checkProcessable('min', {
        bitDepth: [8, 16]
    });

    var histograms = this[0].getHistograms(options);
    var histogramLength = histograms[0].length;
    for (var i = 1; i < this.length; i++) {
        var secondHistograms = this[i].getHistograms(options);
        for (var c = 0; c < histograms.length; c++) {
            for (var j = 0; j < histogramLength; j++) {
                histograms[c][j] += secondHistograms[c][j];
            }
        }
    }
    return histograms;
}

},{}],248:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = max;
/**
 * @memberof Stack
 * @instance
 */

function max() {

    this.checkProcessable('min', {
        bitDepth: [8, 16]
    });

    var max = this[0].max;
    for (var i = 1; i < this.length; i++) {
        for (var j = 0; j < max.length; j++) {
            max[j] = Math.max(max[j], this[i].max[j]);
        }
    }
    return max;
}

},{}],249:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = median;

var _histogram = require('../../util/histogram');

/**
 * @memberof Stack
 * @instance
 */

function median() {

    this.checkProcessable('median', {
        bitDepth: [8, 16]
    });

    var histograms = this.getHistograms({ maxSlots: this[0].maxValue + 1 });
    var result = new Array(histograms.length);
    for (var c = 0; c < histograms.length; c++) {
        var histogram = histograms[c];
        result[c] = (0, _histogram.median)(histogram);
    }
    return result;
}

},{"../../util/histogram":258}],250:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = min;
/**
 * @memberof Stack
 * @instance
 */

function min() {
    this.checkProcessable('min', {
        bitDepth: [8, 16]
    });

    var min = this[0].min;
    for (var i = 1; i < this.length; i++) {
        for (var j = 0; j < min.length; j++) {
            min[j] = Math.min(min[j], this[i].min[j]);
        }
    }
    return min;
}

},{}],251:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extend;

var _matchAndCrop = require('./transform/matchAndCrop');

var _matchAndCrop2 = _interopRequireDefault(_matchAndCrop);

var _min = require('./compute/min');

var _min2 = _interopRequireDefault(_min);

var _max = require('./compute/max');

var _max2 = _interopRequireDefault(_max);

var _median = require('./compute/median');

var _median2 = _interopRequireDefault(_median);

var _histogram = require('./compute/histogram');

var _histogram2 = _interopRequireDefault(_histogram);

var _histograms = require('./compute/histograms');

var _histograms2 = _interopRequireDefault(_histograms);

var _average = require('./utility/average');

var _average2 = _interopRequireDefault(_average);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(Stack) {
    // let inPlace = {inPlace: true};
    Stack.extendMethod('matchAndCrop', _matchAndCrop2.default);

    Stack.extendMethod('getMin', _min2.default);
    Stack.extendMethod('getMax', _max2.default);
    Stack.extendMethod('getMedian', _median2.default);
    Stack.extendMethod('getHistogram', _histogram2.default);
    Stack.extendMethod('getHistograms', _histograms2.default);

    Stack.extendMethod('getAverage', _average2.default);
}

},{"./compute/histogram":246,"./compute/histograms":247,"./compute/max":248,"./compute/median":249,"./compute/min":250,"./transform/matchAndCrop":252,"./utility/average":253}],252:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = matchAndCrop;

var _Stack = require('../Stack');

var _Stack2 = _interopRequireDefault(_Stack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// in a stack we compare 2 consecutive images
// or directly to a parent

// algorithm: matchToPrevious || matchToFirst

// Ignoring border may be dangerous ! Is there is a shape on the side of the image there will be a
// continuous shift if you ignore border. By default it is better to leave it to 0,0
// Now if the background is not black there will also be no way to shift ...
// It may therefore be much better to make a background correction before trying to match and crop
// TODO this code seems also buggy if it is not 0,0

/**
 * @memberof Stack
 * @instance
 */

function matchAndCrop() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$algorithm = _ref.algorithm;
    var algorithm = _ref$algorithm === undefined ? 'matchToPrevious' : _ref$algorithm;
    var _ref$ignoreBorder = _ref.ignoreBorder;
    var ignoreBorder = _ref$ignoreBorder === undefined ? [0, 0] : _ref$ignoreBorder;

    this.checkProcessable('matchAndCrop', {
        bitDepth: [8, 16]
    });

    var matchToPrevious = algorithm === 'matchToPrevious' ? true : false;

    var parent = this[0];
    var results = [];
    results[0] = {
        position: [0, 0],
        image: this[0]
    };

    var relativePosition = [0, 0];

    // we calculate the best relative position to the parent image
    for (var i = 1; i < this.length; i++) {

        var position = parent.getBestMatch(this[i], { border: ignoreBorder });

        results[i] = {
            position: [position[0] + relativePosition[0], position[1] + relativePosition[1]],
            image: this[i]
        };
        if (matchToPrevious) {
            relativePosition[0] += position[0];
            relativePosition[1] += position[1];
            parent = this[i];
        }
    }
    // now we can calculate the cropping that we need to do

    var leftShift = 0;
    var rightShift = 0;
    var topShift = 0;
    var bottomShift = 0;

    for (var _i = 0; _i < results.length; _i++) {
        var result = results[_i];
        if (result.position[0] > leftShift) {
            leftShift = result.position[0];
        }
        if (result.position[0] < rightShift) {
            rightShift = result.position[0];
        }
        if (result.position[1] > topShift) {
            topShift = result.position[1];
        }
        if (result.position[1] < bottomShift) {
            bottomShift = result.position[1];
        }
    }
    rightShift *= -1;
    bottomShift *= -1;

    for (var _i2 = 0; _i2 < results.length; _i2++) {
        var _result = results[_i2];

        /*
        console.log("CROP",
            leftShift - result.position[0],
            topShift - result.position[1],
            parent.width - rightShift - leftShift,
            parent.height - bottomShift - topShift
        )
        */

        _result.crop = _result.image.crop({
            x: leftShift - _result.position[0],
            y: topShift - _result.position[1],
            width: parent.width - rightShift - leftShift,
            height: parent.height - bottomShift - topShift
        });
    }

    // finally we crop and create a new array of images
    var newImages = [];
    for (var _i3 = 0; _i3 < results.length; _i3++) {
        newImages[_i3] = results[_i3].crop;
    }

    return new _Stack2.default(newImages);
} /*
   We will try to move a set of images in order to get only the best common part of them
   The match is always done on the first image ?
  */

},{"../Stack":245}],253:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = average;

var _Image = require('../../image/Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Stack
 * @instance
 */

function average() {
    this.checkProcessable('average', {
        bitDepth: [8, 16]
    });

    var data = new Uint32Array(this[0].data.length);
    for (var i = 0; i < this.length; i++) {
        var current = this[i];
        for (var j = 0; j < this[0].data.length; j++) {
            data[j] += current.data[j];
        }
    }

    var image = _Image2.default.createFrom(this[0]);
    var newData = image.data;

    for (var _i = 0; _i < this[0].data.length; _i++) {
        newData[_i] = data[_i] / this.length;
    }

    return image;
}

},{"../../image/Image":145}],254:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateArrayOfChannels = validateArrayOfChannels;
exports.validateChannel = validateChannel;

var _model = require('../image/model/model');

var Model = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function validateArrayOfChannels(image) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var channels = options.channels;
    var allowAlpha = options.allowAlpha;
    var defaultAlpha = options.defaultAlpha;


    if (typeof allowAlpha !== 'boolean') {
        allowAlpha = true;
    }

    if (typeof channels === 'undefined') {
        return allChannels(image, defaultAlpha);
    } else {
        return validateChannels(image, channels, allowAlpha);
    }
}

function allChannels(image, defaultAlpha) {
    var length = defaultAlpha ? image.channels : image.components;
    var array = new Array(length);
    for (var i = 0; i < length; i++) {
        array[i] = i;
    }
    return array;
}

function validateChannels(image, channels, allowAlpha) {
    if (!Array.isArray(channels)) {
        channels = [channels];
    }
    for (var c = 0; c < channels.length; c++) {
        channels[c] = validateChannel(image, channels[c], allowAlpha);
    }
    return channels;
}

function validateChannel(image, channel) {
    var allowAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (channel === undefined) {
        throw new RangeError('validateChannel : the channel has to be >=0 and <' + image.channels);
    }

    if (typeof channel === 'string') {
        switch (image.colorModel) {
            case Model.GREY:
                break;
            case Model.RGB:
                if ('rgb'.includes(channel)) {
                    switch (channel) {
                        case 'r':
                            channel = 0;
                            break;
                        case 'g':
                            channel = 1;
                            break;
                        case 'b':
                            channel = 2;
                            break;
                        // no default
                    }
                }
                break;
            case Model.HSL:
                if ('hsl'.includes(channel)) {
                    switch (channel) {
                        case 'h':
                            channel = 0;
                            break;
                        case 's':
                            channel = 1;
                            break;
                        case 'l':
                            channel = 2;
                            break;
                        // no default
                    }
                }
                break;
            case Model.HSV:
                if ('hsv'.includes(channel)) {
                    switch (channel) {
                        case 'h':
                            channel = 0;
                            break;
                        case 's':
                            channel = 1;
                            break;
                        case 'v':
                            channel = 2;
                            break;
                        // no default
                    }
                }
                break;
            case Model.CMYK:
                if ('cmyk'.includes(channel)) {
                    switch (channel) {
                        case 'c':
                            channel = 0;
                            break;
                        case 'm':
                            channel = 1;
                            break;
                        case 'y':
                            channel = 2;
                            break;
                        case 'k':
                            channel = 3;
                            break;
                        // no default
                    }
                }
                break;
            default:
                throw new Error(`Unexpected color model: ${ image.colorModel }`);
        }

        if (channel === 'a') {
            if (!image.alpha) {
                throw new Error('validateChannel : the image does not contain alpha channel');
            }
            channel = image.components;
        }

        if (typeof channel === 'string') {
            throw new Error('validateChannel : undefined channel: ' + channel);
        }
    }

    if (channel >= image.channels) {
        throw new RangeError('validateChannel : the channel has to be >=0 and <' + image.channels);
    }

    if (!allowAlpha && channel >= image.components) {
        throw new RangeError('validateChannel : alpha channel may not be selected');
    }

    return channel;
}

},{"../image/model/model":185}],255:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.css2array = css2array;
exports.getDistinctColors = getDistinctColors;
exports.getRandomColor = getRandomColor;

var _colorFunctions = require('color-functions');

function css2array(string) {
    var color = (0, _colorFunctions.cssColor)(string);
    return [color.r, color.g, color.b, Math.round(color.a * 255 / 100)];
}

function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}

function hsl2rgb(h, s, l) {
    var m1 = void 0,
        m2 = void 0,
        hue = void 0,
        r = void 0,
        g = void 0,
        b = void 0;
    s /= 100;
    l /= 100;

    if (s === 0) {
        r = g = b = l * 255;
    } else {
        if (l <= 0.5) {
            m2 = l * (s + 1);
        } else {
            m2 = l + s - l * s;
        }

        m1 = l * 2 - m2;
        hue = h / 360;
        r = hue2rgb(m1, m2, hue + 1 / 3);
        g = hue2rgb(m1, m2, hue);
        b = hue2rgb(m1, m2, hue - 1 / 3);
    }
    return { r: r, g: g, b: b };
}

function getDistinctColors(numColors) {
    var colors = new Array(numColors);
    var j = 0;
    for (var i = 0; i < 360; i += 360 / numColors) {
        j++;
        var color = hsl2rgb(i, 100, 30 + j % 4 * 15);
        colors[j - 1] = [Math.round(color.r * 255), Math.round(color.g * 255), Math.round(color.b * 255)];
    }
    return colors;
}

function getRandomColor() {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}

},{"color-functions":9}],256:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFactor = getFactor;
exports.getThreshold = getThreshold;
exports.factorDimensions = factorDimensions;
/**
 * @private
 * Converts a factor value to a number between 0 and 1
 * @param {string|number} value
 * @return {number}
 */
function getFactor(value) {
    if (typeof value === 'string') {
        var last = value[value.length - 1];
        value = parseFloat(value);
        if (last === '%') {
            value /= 100;
        }
    }
    return value;
}

/**
 * @private
 * We can specify a threshold as "0.4", "40%" or 123
 * @param {string|number} value
 * @param {number} maxValue
 * @return {number}
 */
function getThreshold(value, maxValue) {
    if (!maxValue) {
        throw Error('getThreshold : the maxValue should be specified');
    }
    if (typeof value === 'string') {
        var last = value[value.length - 1];
        if (last !== '%') {
            throw Error('getThreshold : if the value is a string it must finish by %');
        }
        return parseFloat(value) / 100 * maxValue;
    } else if (typeof value === 'number') {
        if (value < 1) {
            return value * maxValue;
        }
        return value;
    } else {
        throw Error('getThreshold : the value is not valid');
    }
}

function factorDimensions(factor, width, height) {
    factor = getFactor(factor);
    return {
        width: Math.round(factor * width),
        height: Math.round(factor * height)
    };
}

},{}],257:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dxs = exports.dxs = [+1, 0, -1, 0, +1, +1, -1, -1];
var dys = exports.dys = [0, +1, 0, -1, +1, -1, +1, -1];

},{}],258:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.median = median;
exports.mean = mean;
/**
 * Returns the median of an histogram
 * @param {number[]} histogram
 * @return {number}
 * @private
 */
function median(histogram) {
    var total = histogram.reduce((sum, x) => sum + x);

    if (total === 0) {
        throw new Error('unreachable');
    }

    var position = 0;
    var currentTotal = 0;
    var middle = total / 2;
    var previous = void 0;

    while (true) {
        if (histogram[position] > 0) {
            if (previous !== undefined) {
                return (previous + position) / 2;
            }
            currentTotal += histogram[position];
            if (currentTotal > middle) {
                return position;
            } else if (currentTotal === middle) {
                previous = position;
            }
        }
        position++;
    }
}

/**
 * Retuns the mean of an histogram
 * @param {number[]} histogram
 * @return {number}
 * @private
 */
function mean(histogram) {
    var total = 0;
    var sum = 0;

    for (var i = 0; i < histogram.length; i++) {
        total += histogram[i];
        sum += histogram[i] * i;
    }

    if (total === 0) {
        return 0;
    }

    return sum / total;
}

},{}],259:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateKernel = validateKernel;

var _isInteger = require('is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateKernel(kernel) {
    var kHeight = void 0,
        kWidth = void 0;
    if (Array.isArray(kernel)) {
        if (Array.isArray(kernel[0])) {
            // 2D array
            if ((kernel.length & 1) === 0 || (kernel[0].length & 1) === 0) {
                throw new RangeError('validateKernel: Kernel rows and columns should be odd numbers');
            } else {
                kHeight = Math.floor(kernel.length / 2);
                kWidth = Math.floor(kernel[0].length / 2);
            }
        } else {
            var kernelWidth = Math.sqrt(kernel.length);
            if ((0, _isInteger2.default)(kernelWidth)) {
                kWidth = kHeight = Math.floor(Math.sqrt(kernel.length) / 2);
            } else {
                throw new RangeError('validateKernel: Kernel array should be a square');
            }
            // we convert the array to a matrix
            var newKernel = new Array(kernelWidth);
            for (var i = 0; i < kernelWidth; i++) {
                newKernel[i] = new Array(kernelWidth);
                for (var j = 0; j < kernelWidth; j++) {
                    newKernel[i][j] = kernel[i * kernelWidth + j];
                }
            }
            kernel = newKernel;
        }
    } else {
        throw new Error('validateKernel: Invalid Kernel: ' + kernel);
    }
    return { kernel: kernel, kWidth: kWidth, kHeight: kHeight };
}

},{"is-integer":53}],260:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DISCRETE_LAPLACE_4 = exports.DISCRETE_LAPLACE_4 = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];

var DISCRETE_LAPLACE_8 = exports.DISCRETE_LAPLACE_8 = [[1, 1, 1], [1, -8, 1], [1, 1, 1]];

var GRADIENT_X = exports.GRADIENT_X = [[-1, 0, +1], [-2, 0, +2], [-1, 0, +1]];

var GRADIENT_Y = exports.GRADIENT_Y = [[-1, -2, -1], [0, 0, 0], [+1, +2, +1]];

var SECOND_DERIVATIVE = exports.SECOND_DERIVATIVE = [[-1, -2, 0, 2, 1], [-2, -4, 0, 4, 2], [0, 0, 0, 0, 0], [1, 2, 0, -2, -1], [2, 4, 0, -4, -2]];

var SECOND_DERIVATIVE_INV = exports.SECOND_DERIVATIVE_INV = [[1, 2, 0, -2, -1], [2, 4, 0, -4, -2], [0, 0, 0, 0, 0], [-2, -4, 0, 4, 2], [-1, -2, 0, 2, 1]];

},{}],261:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Matrix;
function Matrix(width, height, defaultValue) {
    var matrix = new Array(width);
    for (var x = 0; x < width; x++) {
        matrix[x] = new Array(height);
    }
    if (defaultValue) {
        for (var _x = 0; _x < width; _x++) {
            for (var y = 0; y < height; y++) {
                matrix[_x][y] = defaultValue;
            }
        }
    }
    matrix.width = width;
    matrix.height = height;
    matrix.__proto__ = Matrix.prototype;
    return matrix;
}

Matrix.prototype.localMin = function (x, y) {
    var min = this[x][y];
    var position = [x, y];
    for (var i = Math.max(0, x - 1); i < Math.min(this.length, x + 2); i++) {
        for (var j = Math.max(0, y - 1); j < Math.min(this[0].length, y + 2); j++) {
            if (this[i][j] < min) {
                min = this[i][j];
                position = [i, j];
            }
        }
    }
    return {
        position: position,
        value: min
    };
};

Matrix.prototype.localMax = function (x, y) {
    var max = this[x][y];
    var position = [x, y];
    for (var i = Math.max(0, x - 1); i < Math.min(this.length, x + 2); i++) {
        for (var j = Math.max(0, y - 1); j < Math.min(this[0].length, y + 2); j++) {
            if (this[i][j] > max) {
                max = this[i][j];
                position = [i, j];
            }
        }
    }
    return {
        position: position,
        value: max
    };
};

Matrix.prototype.localSearch = function (x, y, value) {
    var results = [];
    for (var i = Math.max(0, x - 1); i < Math.min(this.length, x + 2); i++) {
        for (var j = Math.max(0, y - 1); j < Math.min(this[0].length, y + 2); j++) {
            if (this[i][j] === value) {
                results.push([i, j]);
            }
        }
    }
    return results;
};

},{}],262:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mlMatrix = require('ml-matrix');

var _mlMatrix2 = _interopRequireDefault(_mlMatrix);

var _Image = require('../image/Image');

var _Image2 = _interopRequireDefault(_Image);

var _kindNames = require('../image/kindNames');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cross = [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]];

var smallCross = [[0, 1, 0], [1, 1, 1], [0, 1, 0]];

/**
 * Class representing a shape
 * @class Shape
 * @param {object} [options]
 * @param {string} [options.kind='cross'] - Predefined matrix shape, 'cross' or 'smallCross'
 * @param {string} [options.shape] - Value may be 'square', 'rectangle', 'circle', 'ellipse' or 'triangle'
 *                                  The size of the shape will be determined by the size, width and height.
 *                                  A Shape is by default filled.
 *
 * @param {number} [options.size]
 * @param {number} [options.width=options.size] - width of the shape. Must be odd.
 * @param {number} [options.height=options.size] - width of the shape. Must be odd.
 * @param {boolean} [options.filled=true] - If false only the border ot the shape is taken into account.
 */

class Shape {
    constructor() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$kind = options.kind;
        var kind = _options$kind === undefined ? 'cross' : _options$kind;
        var shape = options.shape;
        var size = options.size;
        var width = options.width;
        var height = options.height;
        var _options$filled = options.filled;
        var filled = _options$filled === undefined ? true : _options$filled;

        if (size) {
            width = size;
            height = size;
        }
        if (width && 1 !== 1 || height && 1 !== 1) {
            throw Error('Shape: The width and height has to be odd numbers.');
        }
        if (shape) {
            switch (shape.toLowerCase()) {
                case 'square':
                case 'rectangle':
                    this.matrix = rectangle(width, height, { filled: filled });
                    break;
                case 'circle':
                case 'ellipse':
                    this.matrix = ellipse(width, height, { filled: filled });
                    break;
                case 'triangle':
                    this.matrix = triangle(width, height, { filled: filled });
                    break;
                default:
                    throw new Error(`Shape: unexpected shape: ${ shape }`);
            }
        } else if (kind) {
            switch (kind.toLowerCase()) {
                case 'cross':
                    this.matrix = cross;
                    break;
                case 'smallcross':
                    this.matrix = smallCross;
                    break;
                default:
                    throw new Error(`Shape: unexpected kind: ${ kind }`);
            }
        } else {
            throw new Error('Shape: expected a kind or a shape option');
        }
        this.height = this.matrix.length;
        this.width = this.matrix[0].length;
        this.halfHeight = this.height / 2 >> 0;
        this.halfWidth = this.width / 2 >> 0;
    }

    /**
     * Returns an array of [x,y] points
     * @returns {number[][]} - Array of [x,y] points
     */

    getPoints() {
        var matrix = this.matrix;
        var points = [];
        for (var y = 0; y < matrix.length; y++) {
            for (var x = 0; x < matrix[0].length; x++) {
                if (matrix[y][x]) {
                    points.push([x - this.halfWidth, y - this.halfHeight]);
                }
            }
        }
        return points;
    }

    /**
     * Returns a Mask (1 bit Image) corresponding to this shape.
     * @return {Image}
     */
    getMask() {
        var img = new _Image2.default(this.width, this.height, {
            kind: _kindNames.BINARY
        });
        for (var y = 0; y < this.matrix.length; y++) {
            for (var x = 0; x < this.matrix[0].length; x++) {
                if (this.matrix[y][x]) {
                    img.setBitXY(x, y);
                }
            }
        }
        return img;
    }
}

exports.default = Shape;
function rectangle(width, height, options) {
    var matrix = _mlMatrix2.default.zeros(height, width);
    if (options.filled) {
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                matrix.set(y, x, 1);
            }
        }
    } else {
        for (var _y of [0, height - 1]) {
            for (var _x2 = 0; _x2 < width; _x2++) {
                matrix.set(_y, _x2, 1);
            }
        }
        for (var _y2 = 0; _y2 < height; _y2++) {
            for (var _x3 of [0, width - 1]) {
                matrix.set(_y2, _x3, 1);
            }
        }
    }

    return matrix;
}

function ellipse(width, height, options) {
    var matrix = _mlMatrix2.default.zeros(height, width, options);
    var yEven = 1 - height % 2;
    var xEven = 1 - width % 2;
    var a = Math.floor((width - 1) / 2); // horizontal ellipse axe
    var b = Math.floor((height - 1) / 2); // vertical ellipse axe
    var a2 = a * a;
    var b2 = b * b;
    if (options.filled) {
        for (var y = 0; y <= b; y++) {
            var shift = Math.floor(Math.sqrt(a2 - a2 * y * y / b2));
            for (var x = a - shift; x <= a; x++) {
                matrix.set(b - y, x, 1);
                matrix.set(b + y + yEven, x, 1);
                matrix.set(b - y, width - x - 1, 1);
                matrix.set(b + y + yEven, width - x - 1, 1);
            }
        }
    } else {
        for (var _y3 = 0; _y3 <= b; _y3++) {
            var _shift = Math.floor(Math.sqrt(a2 - a2 * _y3 * _y3 / b2));
            var _x4 = a - _shift;
            matrix.set(b - _y3, _x4, 1);
            matrix.set(b + _y3 + yEven, _x4, 1);
            matrix.set(b - _y3, width - _x4 - 1, 1);
            matrix.set(b + _y3 + yEven, width - _x4 - 1, 1);
        }

        for (var _x5 = 0; _x5 <= a; _x5++) {
            var _shift2 = Math.floor(Math.sqrt(b2 - b2 * _x5 * _x5 / a2));
            var _y4 = b - _shift2;
            matrix.set(_y4, a - _x5, 1);
            matrix.set(_y4, a + _x5 + xEven, 1);
            matrix.set(height - _y4 - 1, a - _x5, 1);
            matrix.set(height - _y4 - 1, a + _x5 + xEven, 1);
        }
    }
    return matrix;
}

function triangle(width, height, options) {
    if (!options.filled) {
        throw new Error('Non filled triangle is not implemented');
    }
    var matrix = _mlMatrix2.default.zeros(height, width, options);
    for (var y = 0; y < height; y++) {
        var shift = Math.floor((1 - y / height) * width / 2);
        for (var x = shift; x < width - shift; x++) {
            matrix.set(y, x, 1);
        }
    }
    return matrix;
}

},{"../image/Image":145,"../image/kindNames":182,"ml-matrix":86}],263:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkNumberArray = checkNumberArray;

var _Image = require('../image/Image');

var _Image2 = _interopRequireDefault(_Image);

var _isArrayType = require('is-array-type');

var _isArrayType2 = _interopRequireDefault(_isArrayType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkNumberArray(value) {
    if (!isNaN(value)) {
        if (value <= 0) {
            throw new Error('checkNumberArray: the value must be greater than 0');
        }
        return value;
    } else {
        if (value instanceof _Image2.default) {
            return value.data;
        }
        if (!(0, _isArrayType2.default)(value)) {
            throw new Error('checkNumberArray: the value should be either a number, array or Image');
        }
        return value;
    }
}

},{"../image/Image":145,"is-array-type":49}],264:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extend;

var _background = require('./process/background');

var _background2 = _interopRequireDefault(_background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(Worker) {
    Worker.extendMethod('background', _background2.default);
}

},{"./process/background":265}],265:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _Image = require('../../image/Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
    regression: {
        kernelType: 'polynomial',
        kernelOptions: { degree: 2, constant: 1 }
    },
    threshold: 0.02,
    roi: {
        minSurface: 100,
        positive: false
    },
    sampling: 20,
    include: []
};

function run(image, options, onStep) {
    options = (0, _extend2.default)({}, defaultOptions, options);
    var manager = this.manager;
    if (Array.isArray(image)) {
        return Promise.all(image.map(function (img) {
            var run = runOnce(manager, img, options);
            if (typeof onStep === 'function') {
                run.then(onStep);
            }
            return run;
        }));
    } else {
        return runOnce(manager, image, options);
    }
}

function runOnce(manager, image, options) {
    return manager.post('data', [image, options]).then(function (response) {
        for (var i in response) {
            response[i] = new _Image2.default(response[i]);
        }
        return response;
    });
}

function work() {
    worker.on('data', function (send, image, options) {
        image = new IJS(image);
        var result = {};
        var toTransfer = [];

        var grey = image.grey();

        var sobel = grey.sobelFilter();
        maybeInclude('sobel', sobel);

        var mask = sobel.level().mask({ threshold: options.threshold });
        maybeInclude('mask', mask);

        var roiManager = sobel.getRoiManager();
        roiManager.fromMask(mask);
        var realMask = roiManager.getMask(options.roi);
        maybeInclude('realMask', realMask);

        var pixels = grey.getPixelsGrid({
            sampling: options.sampling,
            mask: realMask
        });

        var background = image.getBackground(pixels.xyS, pixels.zS, options.regression);
        maybeInclude('background', background);

        var corrected = image.subtract(background);

        result.result = corrected;
        toTransfer.push(corrected.data.buffer);
        send(result, toTransfer);

        function maybeInclude(name, image) {
            if (options.include.includes(name)) {
                result[name] = image;
                toTransfer.push(image.data.buffer);
            }
        }
    });
}

exports.default = { run: run, work: work };

},{"../../image/Image":145,"extend":35}],266:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webWorkerManager = require('web-worker-manager');

var _webWorkerManager2 = _interopRequireDefault(_webWorkerManager);

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Worker {
    constructor() {
        this._url = null;
        this._deps = [null];
    }
    checkUrl() {
        if (this._url === null) {
            throw new Error('image worker must be initialized with an URL');
        }
    }
    get url() {
        return this._url;
    }
    set url(value) {
        if (typeof value !== 'string') {
            throw new TypeError('worker URL must be a string');
        }
        this._url = value;
        this._deps[0] = value;
    }
    static extendMethod(name, method) {
        var manager = void 0;
        var url = void 0;
        var runner = {};
        function run() {
            var _method$run;

            if (!manager) {
                this.checkUrl();
                url = this.url;
                manager = new _webWorkerManager2.default(method.work, { deps: url });
                runner.manager = manager;
            }

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return (_method$run = method.run).call.apply(_method$run, [runner].concat(args));
        }
        run.reset = function () {
            if (manager) {
                manager.terminate();
                manager = new _webWorkerManager2.default(method.work, { deps: url });
                runner.manager = manager;
            }
        };
        Worker.prototype[name] = run;
    }
}

(0, _extend2.default)(Worker);

exports.default = new Worker();

},{"./extend":264,"web-worker-manager":143}]},{},[242])(242)
});