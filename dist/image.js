(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.IJ = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function _atob(str) {
  return atob(str);
};

},{}],2:[function(require,module,exports){
"use strict";

},{}],3:[function(require,module,exports){
// shim for using process in browser

'use strict';

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
// https://github.com/paulmillr/es6-shim
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isinteger
"use strict";

var isFinite = require("is-finite");
module.exports = Number.isInteger || function (val) {
  return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
};

},{"is-finite":6}],6:[function(require,module,exports){
'use strict';
var numberIsNan = require('number-is-nan');

module.exports = Number.isFinite || function (val) {
	return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
};

},{"number-is-nan":7}],7:[function(require,module,exports){
'use strict';
module.exports = Number.isNaN || function (x) {
	return x !== x;
};

},{}],8:[function(require,module,exports){
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

CholeskyDecomposition.prototype = Object.defineProperties({
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
}, {
    leftTriangularFactor: {
        get: function get() {
            return this.L;
        },
        configurable: true,
        enumerable: true
    }
});

module.exports = CholeskyDecomposition;

},{"../matrix":16}],9:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');
var hypotenuse = require('./util').hypotenuse;

// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
function EigenvalueDecomposition(matrix) {
    if (!(this instanceof EigenvalueDecomposition)) {
        return new EigenvalueDecomposition(matrix);
    }
    matrix = Matrix.checkMatrix(matrix);
    if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns,
        V = Matrix.zeros(n, n),
        d = new Array(n),
        e = new Array(n),
        value = matrix,
        i,
        j;

    if (matrix.isSymmetric()) {
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                V[i][j] = value[i][j];
            }
        }
        tred2(n, e, d, V);
        tql2(n, e, d, V);
    } else {
        var H = Matrix.zeros(n, n),
            ort = new Array(n);
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                H[i][j] = value[i][j];
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

EigenvalueDecomposition.prototype = Object.defineProperties({}, {
    realEigenvalues: {
        get: function get() {
            return this.d;
        },
        configurable: true,
        enumerable: true
    },
    imaginaryEigenvalues: {
        get: function get() {
            return this.e;
        },
        configurable: true,
        enumerable: true
    },
    eigenvectorMatrix: {
        get: function get() {
            return this.V;
        },
        configurable: true,
        enumerable: true
    },
    diagonalMatrix: {
        get: function get() {
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
        },
        configurable: true,
        enumerable: true
    }
});

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

},{"../matrix":16,"./util":13}],10:[function(require,module,exports){
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

LuDecomposition.prototype = Object.defineProperties({
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
}, {
    determinant: {
        get: function get() {
            var data = this.LU;
            if (!data.isSquare()) throw new Error('Matrix must be square');
            var determinant = this.pivotSign,
                col = data.columns;
            for (var j = 0; j < col; j++) determinant *= data[j][j];
            return determinant;
        },
        configurable: true,
        enumerable: true
    },
    lowerTriangularFactor: {
        get: function get() {
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
        configurable: true,
        enumerable: true
    },
    upperTriangularFactor: {
        get: function get() {
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
        configurable: true,
        enumerable: true
    },
    pivotPermutationVector: {
        get: function get() {
            return this.pivotVector.slice();
        },
        configurable: true,
        enumerable: true
    }
});

module.exports = LuDecomposition;

},{"../matrix":16}],11:[function(require,module,exports){
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

QrDecomposition.prototype = Object.defineProperties({
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
    }
}, {
    upperTriangularFactor: {
        get: function get() {
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
        configurable: true,
        enumerable: true
    },
    orthogonalFactor: {
        get: function get() {
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
        },
        configurable: true,
        enumerable: true
    }
});

module.exports = QrDecomposition;

},{"../matrix":16,"./util":13}],12:[function(require,module,exports){
'use strict';

var Matrix = require('../matrix');
var hypotenuse = require('./util').hypotenuse;

// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
function SingularValueDecomposition(value, options) {
    if (!(this instanceof SingularValueDecomposition)) {
        return new SingularValueDecomposition(value, options);
    }
    value = Matrix.checkMatrix(value);

    options = options || {};

    var a = value.clone(),
        m = value.rows,
        n = value.columns,
        nu = Math.min(m, n);

    var wantu = true,
        wantv = true;
    if (options.computeLeftSingularVectors === false) wantu = false;
    if (options.computeRightSingularVectors === false) wantv = false;
    var autoTranspose = options.autoTranspose === true;

    var swapped = false;
    if (m < n) {
        if (!autoTranspose) {
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
            a = a.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            var aux = wantu;
            wantu = wantv;
            wantv = aux;
        }
    }

    var s = new Array(Math.min(m + 1, n)),
        U = Matrix.zeros(m, nu),
        V = Matrix.zeros(n, n),
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

SingularValueDecomposition.prototype = Object.defineProperties({
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

        var VL = this.V.mmul(Ls),
            vrows = this.V.rows,
            urows = this.U.rows,
            VLU = Matrix.zeros(vrows, urows),
            j,
            k,
            sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < scols; k++) {
                    sum += VL[i][k] * this.U[j][k];
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
        var e = this.threshold,
            vrows = this.V.rows,
            vcols = this.V.columns,
            X = new Matrix(vrows, this.s.length),
            i,
            j;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < vcols; j++) {
                if (Math.abs(this.s[j]) > e) {
                    X[i][j] = this.V[i][j] / this.s[j];
                } else {
                    X[i][j] = 0;
                }
            }
        }

        var urows = this.U.rows,
            ucols = this.U.columns,
            Y = new Matrix(vrows, urows),
            k,
            sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < ucols; k++) {
                    sum += X[i][k] * this.U[j][k];
                }
                Y[i][j] = sum;
            }
        }

        return Y;
    }
}, {
    condition: {
        get: function get() {
            return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
        },
        configurable: true,
        enumerable: true
    },
    norm2: {
        get: function get() {
            return this.s[0];
        },
        configurable: true,
        enumerable: true
    },
    rank: {
        get: function get() {
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
        configurable: true,
        enumerable: true
    },
    diagonal: {
        get: function get() {
            return this.s;
        },
        configurable: true,
        enumerable: true
    },
    threshold: {
        // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs

        get: function get() {
            return Math.pow(2, -52) / 2 * Math.max(this.m, this.n) * this.s[0];
        },
        configurable: true,
        enumerable: true
    },
    leftSingularVectors: {
        get: function get() {
            return this.U;
        },
        configurable: true,
        enumerable: true
    },
    rightSingularVectors: {
        get: function get() {
            return this.V;
        },
        configurable: true,
        enumerable: true
    },
    diagonalMatrix: {
        get: function get() {
            return Matrix.diag(this.s);
        },
        configurable: true,
        enumerable: true
    }
});

module.exports = SingularValueDecomposition;

},{"../matrix":16,"./util":13}],13:[function(require,module,exports){
'use strict';

exports.hypotenuse = function hypotenuse(a, b) {
    var r;
    if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
    }
    if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
    }
    return 0;
};

},{}],14:[function(require,module,exports){
'use strict';

var Matrix = require('./matrix');

var SingularValueDecomposition = require('./dc/svd');
var EigenvalueDecomposition = require('./dc/evd');
var LuDecomposition = require('./dc/lu');
var QrDecomposition = require('./dc/qr');
var CholeskyDecomposition = require('./dc/cholesky');

function inverse(matrix) {
    return solve(matrix, Matrix.eye(matrix.rows));
}

Matrix.prototype.inverse = function () {
    return inverse(this);
};

function solve(leftHandSide, rightHandSide) {
    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
}

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

},{"./dc/cholesky":8,"./dc/evd":9,"./dc/lu":10,"./dc/qr":11,"./dc/svd":12,"./matrix":16}],15:[function(require,module,exports){
'use strict';

module.exports = require('./matrix');
module.exports.Decompositions = module.exports.DC = require('./decompositions');

},{"./decompositions":14,"./matrix":16}],16:[function(require,module,exports){
'use strict';

var Asplice = Array.prototype.splice,
    Aconcat = Array.prototype.concat;

// For performance : http://jsperf.com/clone-array-slice-vs-while-vs-for
function slice(arr) {
    var i = 0,
        ii = arr.length,
        result = new Array(ii);
    for (; i < ii; i++) {
        result[i] = arr[i];
    }
    return result;
}

/**
 * Real matrix.
 * @constructor
 * @param {number|Array} nRows - Number of rows of the new matrix or a 2D array containing the data.
 * @param {number|boolean} [nColumns] - Number of columns of the new matrix or a boolean specifying if the input array should be cloned
 */
function Matrix(nRows, nColumns) {
    var i = 0,
        rows,
        columns,
        matrix,
        newInstance;
    if (Array.isArray(nRows)) {
        newInstance = nColumns;
        matrix = newInstance ? slice(nRows) : nRows;
        nRows = matrix.length;
        nColumns = matrix[0].length;
        if (typeof nColumns === 'undefined') {
            throw new TypeError('Data must be a 2D array');
        }
        if (nRows > 0 && nColumns > 0) {
            for (; i < nRows; i++) {
                if (matrix[i].length !== nColumns) {
                    throw new RangeError('Inconsistent array dimensions');
                } else if (newInstance) {
                    matrix[i] = slice(matrix[i]);
                }
            }
        } else {
            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
        }
    } else if (typeof nRows === 'number') {
        // Create empty matrix
        if (nRows > 0 && nColumns > 0) {
            matrix = new Array(nRows);
            for (; i < nRows; i++) {
                matrix[i] = new Array(nColumns);
            }
        } else {
            throw new RangeError('Invalid dimensions: ' + nRows + 'x' + nColumns);
        }
    } else {
        throw new TypeError('Invalid arguments');
    }

    Object.defineProperty(matrix, 'rows', { writable: true, value: nRows });
    Object.defineProperty(matrix, 'columns', { writable: true, value: nColumns });

    matrix.__proto__ = Matrix.prototype;

    return matrix;
}

/**
 * Constructs a Matrix with the chosen dimensions from a 1D array.
 * @param {number} newRows - Number of rows
 * @param {number} newColumns - Number of columns
 * @param {Array} newData - A 1D array containing data for the matrix
 * @returns {Matrix} - The new matrix
 */
Matrix.from1DArray = function from1DArray(newRows, newColumns, newData) {
    var length,
        data,
        i = 0;

    length = newRows * newColumns;
    if (length !== newData.length) throw new RangeError('Data length does not match given dimensions');

    data = new Array(newRows);
    for (; i < newRows; i++) {
        data[i] = newData.slice(i * newColumns, (i + 1) * newColumns);
    }
    return new Matrix(data);
};

/**
 * Creates a row vector, a matrix with only one row.
 * @param {Array} newData - A 1D array containing data for the vector
 * @returns {Matrix} - The new matrix
 */
Matrix.rowVector = function rowVector(newData) {
    return new Matrix([newData]);
};

/**
 * Creates a column vector, a matrix with only one column.
 * @param {Array} newData - A 1D array containing data for the vector
 * @returns {Matrix} - The new matrix
 */
Matrix.columnVector = function columnVector(newData) {
    var l = newData.length,
        vector = new Array(l);
    for (var i = 0; i < l; i++) vector[i] = [newData[i]];
    return new Matrix(vector);
};

/**
 * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} - The new matrix
 */
Matrix.empty = function empty(rows, columns) {
    return new Matrix(rows, columns);
};

/**
 * Creates a matrix with the given dimensions. Values will be set to zero.
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} - The new matrix
 */
Matrix.zeros = function zeros(rows, columns) {
    return Matrix.empty(rows, columns).fill(0);
};

/**
 * Creates a matrix with the given dimensions. Values will be set to one.
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} - The new matrix
 */
Matrix.ones = function ones(rows, columns) {
    return Matrix.empty(rows, columns).fill(1);
};

/**
 * Creates a matrix with the given dimensions. Values will be randomly set using Math.random().
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {Matrix} The new matrix
 */
Matrix.rand = function rand(rows, columns) {
    var matrix = Matrix.empty(rows, columns);
    for (var i = 0, ii = matrix.rows; i < ii; i++) {
        for (var j = 0, jj = matrix.columns; j < jj; j++) {
            matrix[i][j] = Math.random();
        }
    }
    return matrix;
};

/**
 * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and other will be 0.
 * @param {number} n - Number of rows and columns
 * @returns {Matrix} - The new matrix
 */
Matrix.eye = function eye(n) {
    var matrix = Matrix.zeros(n, n),
        l = matrix.rows;
    for (var i = 0; i < l; i++) {
        matrix[i][i] = 1;
    }
    return matrix;
};

/**
 * Creates a diagonal matrix based on the given array.
 * @param {Array} data - Array containing the data for the diagonal
 * @returns {Matrix} - The new matrix
 */
Matrix.diag = function diag(data) {
    var l = data.length,
        matrix = Matrix.zeros(l, l);
    for (var i = 0; i < l; i++) {
        matrix[i][i] = data[i];
    }
    return matrix;
};

/**
 * Creates an array of indices between two values
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
Matrix.indices = function indices(from, to) {
    var vector = new Array(to - from);
    for (var i = 0; i < vector.length; i++) vector[i] = from++;
    return vector;
};

// TODO DOC
Matrix.stack = function stack(arg1) {
    var i, j, k;
    if (Matrix.isMatrix(arg1)) {
        var rows = 0,
            cols = 0;
        for (i = 0; i < arguments.length; i++) {
            rows += arguments[i].rows;
            if (arguments[i].columns > cols) cols = arguments[i].columns;
        }

        var r = Matrix.zeros(rows, cols);
        var c = 0;
        for (i = 0; i < arguments.length; i++) {
            var current = arguments[i];
            for (j = 0; j < current.rows; j++) {
                for (k = 0; k < current.columns; k++) r[c][k] = current[j][k];
                c++;
            }
        }
        return r;
    } else if (Array.isArray(arg1)) {
        var matrix = Matrix.empty(arguments.length, arg1.length);
        for (i = 0; i < arguments.length; i++) matrix.setRow(i, arguments[i]);
        return matrix;
    }
};

// TODO DOC
Matrix.expand = function expand(base, count) {
    var expansion = [];
    for (var i = 0; i < count.length; i++) for (var j = 0; j < count[i]; j++) expansion.push(base[i]);
    return new Matrix(expansion);
};

/**
 * Check that the provided value is a Matrix and tries to instantiate one if not
 * @param value - The value to check
 * @returns {Matrix}
 * @throws {TypeError}
 */
Matrix.checkMatrix = function checkMatrix(value) {
    if (!value) {
        throw new TypeError('Argument has to be a matrix');
    }
    if (value.klass !== 'Matrix') {
        value = new Matrix(value);
    }
    return value;
};

/**
 * Returns true if the argument is a Matrix, false otherwise
 * @param value - The value to check
 * @returns {boolean}
 */
Matrix.isMatrix = function isMatrix(value) {
    return value ? value.klass === 'Matrix' : false;
};

/**
 * @property {string} - The name of this class.
 */
Object.defineProperty(Matrix.prototype, 'klass', {
    get: function klass() {
        return 'Matrix';
    }
});

/**
 * @property {number} - The number of elements in the matrix.
 */
Object.defineProperty(Matrix.prototype, 'size', {
    get: function size() {
        return this.rows * this.columns;
    }
});

/**
 * @private
 * Internal check that a row index is not out of bounds
 * @param {number} index
 */
Matrix.prototype.checkRowIndex = function checkRowIndex(index) {
    if (index < 0 || index > this.rows - 1) throw new RangeError('Row index out of range.');
};

/**
 * @private
 * Internal check that a column index is not out of bounds
 * @param {number} index
 */
Matrix.prototype.checkColumnIndex = function checkColumnIndex(index) {
    if (index < 0 || index > this.columns - 1) throw new RangeError('Column index out of range.');
};

/**
 * @private
 * Internal check that two matrices have the same dimensions
 * @param {Matrix} otherMatrix
 */
Matrix.prototype.checkDimensions = function checkDimensions(otherMatrix) {
    if (this.rows !== otherMatrix.rows || this.columns !== otherMatrix.columns) throw new RangeError('Matrices dimensions must be equal.');
};

/**
 * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
 * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
 * @returns {Matrix} this
 */
Matrix.prototype.apply = function apply(callback) {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            callback.call(this, i, j);
        }
    }
    return this;
};

/**
 * Creates an exact and independent copy of the matrix
 * @returns {Matrix}
 */
Matrix.prototype.clone = function clone() {
    return new Matrix(this.to2DArray());
};

/**
 * Returns a new 1D array filled row by row with the matrix values
 * @returns {Array}
 */
Matrix.prototype.to1DArray = function to1DArray() {
    return Aconcat.apply([], this);
};

/**
 * Returns a 2D array containing a copy of the data
 * @returns {Array}
 */
Matrix.prototype.to2DArray = function to2DArray() {
    var l = this.rows,
        copy = new Array(l);
    for (var i = 0; i < l; i++) {
        copy[i] = slice(this[i]);
    }
    return copy;
};

/**
 * @returns {boolean} true if the matrix has one row
 */
Matrix.prototype.isRowVector = function isRowVector() {
    return this.rows === 1;
};

/**
 * @returns {boolean} true if the matrix has one column
 */
Matrix.prototype.isColumnVector = function isColumnVector() {
    return this.columns === 1;
};

/**
 * @returns {boolean} true if the matrix has one row or one column
 */
Matrix.prototype.isVector = function isVector() {
    return this.rows === 1 || this.columns === 1;
};

/**
 * @returns {boolean} true if the matrix has the same number of rows and columns
 */
Matrix.prototype.isSquare = function isSquare() {
    return this.rows === this.columns;
};

/**
 * @returns {boolean} true if the matrix is square and has the same values on both sides of the diagonal
 */
Matrix.prototype.isSymmetric = function isSymmetric() {
    if (this.isSquare()) {
        var l = this.rows;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j <= i; j++) {
                if (this[i][j] !== this[j][i]) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
};

/**
 * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
 * @param {number} rowIndex - Index of the row
 * @param {number} columnIndex - Index of the column
 * @param {number} value - The new value for the element
 * @returns {Matrix} this
 */
Matrix.prototype.set = function set(rowIndex, columnIndex, value) {
    this[rowIndex][columnIndex] = value;
    return this;
};

/**
 * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
 * @param {number} rowIndex - Index of the row
 * @param {number} columnIndex - Index of the column
 * @returns {number}
 */
Matrix.prototype.get = function get(rowIndex, columnIndex) {
    return this[rowIndex][columnIndex];
};

/**
 * Fills the matrix with a given value. All elements will be set to this value.
 * @param {number} value - New value
 * @returns {Matrix} this
 */
Matrix.prototype.fill = function fill(value) {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] = value;
        }
    }
    return this;
};

/**
 * Negates the matrix. All elements will be multiplied by (-1)
 * @returns {Matrix} this
 */
Matrix.prototype.neg = function neg() {
    return this.mulS(-1);
};

/**
 * Adds a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.add = function add(value) {
    if (typeof value === 'number') return this.addS(value);
    value = Matrix.checkMatrix(value);
    return this.addM(value);
};

/**
 * Adds a scalar to each element of the matrix
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.addS = function addS(value) {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += value;
        }
    }
    return this;
};

/**
 * Adds the value of each element of matrix to the corresponding element of this
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.addM = function addM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += matrix[i][j];
        }
    }
    return this;
};

/**
 * Subtracts a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.sub = function sub(value) {
    if (typeof value === 'number') return this.subS(value);
    value = Matrix.checkMatrix(value);
    return this.subM(value);
};

/**
 * Subtracts a scalar from each element of the matrix
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.subS = function subS(value) {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= value;
        }
    }
    return this;
};

/**
 * Subtracts the value of each element of matrix from the corresponding element of this
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.subM = function subM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= matrix[i][j];
        }
    }
    return this;
};

/**
 * Multiplies a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.mul = function mul(value) {
    if (typeof value === 'number') return this.mulS(value);
    value = Matrix.checkMatrix(value);
    return this.mulM(value);
};

/**
 * Multiplies a scalar with each element of the matrix
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.mulS = function mulS(value) {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= value;
        }
    }
    return this;
};

/**
 * Multiplies the value of each element of matrix with the corresponding element of this
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.mulM = function mulM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= matrix[i][j];
        }
    }
    return this;
};

/**
 * Divides by a scalar or values from another matrix (in place)
 * @param {number|Matrix} value
 * @returns {Matrix} this
 */
Matrix.prototype.div = function div(value) {
    if (typeof value === 'number') return this.divS(value);
    value = Matrix.checkMatrix(value);
    return this.divM(value);
};

/**
 * Divides each element of the matrix by a scalar
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.divS = function divS(value) {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= value;
        }
    }
    return this;
};

/**
 * Divides each element of this by the corresponding element of matrix
 * @param {Matrix} matrix
 * @returns {Matrix} this
 */
Matrix.prototype.divM = function divM(matrix) {
    this.checkDimensions(matrix);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= matrix[i][j];
        }
    }
    return this;
};

/**
 * Returns a new array from the given row index
 * @param {number} index - Row index
 * @returns {Array}
 */
Matrix.prototype.getRow = function getRow(index) {
    this.checkRowIndex(index);
    return slice(this[index]);
};

/**
 * Returns a new row vector from the given row index
 * @param {number} index - Row index
 * @returns {Matrix}
 */
Matrix.prototype.getRowVector = function getRowVector(index) {
    return Matrix.rowVector(this.getRow(index));
};

/**
 * Sets a row at the given index
 * @param {number} index - Row index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.setRow = function setRow(index, array) {
    this.checkRowIndex(index);
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    if (array.length !== this.columns) throw new RangeError('Invalid row size');
    this[index] = slice(array);
    return this;
};

/**
 * Removes a row from the given index
 * @param {number} index - Row index
 * @returns {Matrix} this
 */
Matrix.prototype.removeRow = function removeRow(index) {
    this.checkRowIndex(index);
    if (this.rows === 1) throw new RangeError('A matrix cannot have less than one row');
    Asplice.call(this, index, 1);
    this.rows -= 1;
    return this;
};

/**
 * Adds a row at the given index
 * @param {number} [index = this.rows] - Row index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addRow = function addRow(index, array) {
    if (typeof array === 'undefined') {
        array = index;
        index = this.rows;
    }
    if (index < 0 || index > this.rows) throw new RangeError('Row index out of range.');
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    if (array.length !== this.columns) throw new RangeError('Invalid row size');
    Asplice.call(this, index, 0, slice(array));
    this.rows += 1;
    return this;
};

/**
 * Swaps two rows
 * @param {number} row1 - First row index
 * @param {number} row2 - Second row index
 * @returns {Matrix} this
 */
Matrix.prototype.swapRows = function swapRows(row1, row2) {
    this.checkRowIndex(row1);
    this.checkRowIndex(row2);
    var temp = this[row1];
    this[row1] = this[row2];
    this[row2] = temp;
    return this;
};

/**
 * Returns a new array from the given column index
 * @param {number} index - Column index
 * @returns {Array}
 */
Matrix.prototype.getColumn = function getColumn(index) {
    this.checkColumnIndex(index);
    var l = this.rows,
        column = new Array(l);
    for (var i = 0; i < l; i++) {
        column[i] = this[i][index];
    }
    return column;
};

/**
 * Returns a new column vector from the given column index
 * @param {number} index - Column index
 * @returns {Matrix}
 */
Matrix.prototype.getColumnVector = function getColumnVector(index) {
    return Matrix.columnVector(this.getColumn(index));
};

/**
 * Sets a column at the given index
 * @param {number} index - Column index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.setColumn = function setColumn(index, array) {
    this.checkColumnIndex(index);
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    var l = this.rows;
    if (array.length !== l) throw new RangeError('Invalid column size');
    for (var i = 0; i < l; i++) {
        this[i][index] = array[i];
    }
    return this;
};

/**
 * Removes a column from the given index
 * @param {number} index - Column index
 * @returns {Matrix} this
 */
Matrix.prototype.removeColumn = function removeColumn(index) {
    this.checkColumnIndex(index);
    if (this.columns === 1) throw new RangeError('A matrix cannot have less than one column');
    for (var i = 0, ii = this.rows; i < ii; i++) {
        this[i].splice(index, 1);
    }
    this.columns -= 1;
    return this;
};

/**
 * Adds a column at the given index
 * @param {number} [index = this.columns] - Column index
 * @param {Array|Matrix} array - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addColumn = function addColumn(index, array) {
    if (typeof array === 'undefined') {
        array = index;
        index = this.columns;
    }
    if (index < 0 || index > this.columns) throw new RangeError('Column index out of range.');
    if (Matrix.isMatrix(array)) array = array.to1DArray();
    var l = this.rows;
    if (array.length !== l) throw new RangeError('Invalid column size');
    for (var i = 0; i < l; i++) {
        this[i].splice(index, 0, array[i]);
    }
    this.columns += 1;
    return this;
};

/**
 * Swaps two columns
 * @param {number} column1 - First column index
 * @param {number} column2 - Second column index
 * @returns {Matrix} this
 */
Matrix.prototype.swapColumns = function swapColumns(column1, column2) {
    this.checkRowIndex(column1);
    this.checkRowIndex(column2);
    var l = this.rows,
        temp,
        row;
    for (var i = 0; i < l; i++) {
        row = this[i];
        temp = row[column1];
        row[column1] = row[column2];
        row[column2] = temp;
    }
    return this;
};

/**
 * @private
 * Internal check that the provided vector is an array with the right length
 * @param {Array|Matrix} vector
 * @returns {Array}
 * @throws {RangeError}
 */
Matrix.prototype.checkRowVector = function checkRowVector(vector) {
    if (Matrix.isMatrix(vector)) vector = vector.to1DArray();
    if (vector.length !== this.columns) throw new RangeError('vector size must be the same as the number of columns');
    return vector;
};

/**
 * @private
 * Internal check that the provided vector is an array with the right length
 * @param {Array|Matrix} vector
 * @returns {Array}
 * @throws {RangeError}
 */
Matrix.prototype.checkColumnVector = function checkColumnVector(vector) {
    if (Matrix.isMatrix(vector)) vector = vector.to1DArray();
    if (vector.length !== this.rows) throw new RangeError('vector size must be the same as the number of rows');
    return vector;
};

/**
 * Adds the values of a vector to each row
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addRowVector = function addRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += vector[j];
        }
    }
    return this;
};

/**
 * Subtracts the values of a vector from each row
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.subRowVector = function subRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= vector[j];
        }
    }
    return this;
};

/**
 * Multiplies the values of a vector with each row
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.mulRowVector = function mulRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= vector[j];
        }
    }
    return this;
};

/**
 * Divides the values of each row by those of a vector
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.divRowVector = function divRowVector(vector) {
    vector = this.checkRowVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= vector[j];
        }
    }
    return this;
};

/**
 * Adds the values of a vector to each column
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.addColumnVector = function addColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] += vector[i];
        }
    }
    return this;
};

/**
 * Subtracts the values of a vector from each column
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.subColumnVector = function subColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] -= vector[i];
        }
    }
    return this;
};

/**
 * Multiplies the values of a vector with each column
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.mulColumnVector = function mulColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] *= vector[i];
        }
    }
    return this;
};

/**
 * Divides the values of each column by those of a vector
 * @param {Array|Matrix} vector - Array or vector
 * @returns {Matrix} this
 */
Matrix.prototype.divColumnVector = function divColumnVector(vector) {
    vector = this.checkColumnVector(vector);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] /= vector[i];
        }
    }
    return this;
};

/**
 * Multiplies the values of a row with a scalar
 * @param {number} index - Row index
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.mulRow = function mulRow(index, value) {
    this.checkRowIndex(index);
    var i = 0,
        l = this.columns;
    for (; i < l; i++) {
        this[index][i] *= value;
    }
    return this;
};

/**
 * Multiplies the values of a column with a scalar
 * @param {number} index - Column index
 * @param {number} value
 * @returns {Matrix} this
 */
Matrix.prototype.mulColumn = function mulColumn(index, value) {
    this.checkColumnIndex(index);
    var i = 0,
        l = this.rows;
    for (; i < l; i++) {
        this[i][index] *= value;
    }
};

/**
 * A matrix index
 * @typedef {Object} MatrixIndex
 * @property {number} row
 * @property {number} column
 */

/**
 * Returns the maximum value of the matrix
 * @returns {number}
 */
Matrix.prototype.max = function max() {
    var v = -Infinity;
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] > v) {
                v = this[i][j];
            }
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value
 * @returns {MatrixIndex}
 */
Matrix.prototype.maxIndex = function maxIndex() {
    var v = -Infinity;
    var idx = {};
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] > v) {
                v = this[i][j];
                idx.row = i;
                idx.column = j;
            }
        }
    }
    return idx;
};

/**
 * Returns the minimum value of the matrix
 * @returns {number}
 */
Matrix.prototype.min = function min() {
    var v = Infinity;
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] < v) {
                v = this[i][j];
            }
        }
    }
    return v;
};

/**
 * Returns the index of the minimum value
 * @returns {MatrixIndex}
 */
Matrix.prototype.minIndex = function minIndex() {
    var v = Infinity;
    var idx = {};
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (this[i][j] < v) {
                v = this[i][j];
                idx.row = i;
                idx.column = j;
            }
        }
    }
    return idx;
};

/**
 * Returns the maximum value of one row
 * @param {number} index - Row index
 * @returns {number}
 */
Matrix.prototype.maxRow = function maxRow(index) {
    this.checkRowIndex(index);
    var v = -Infinity;
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] > v) {
            v = this[index][i];
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value of one row
 * @param {number} index - Row index
 * @returns {MatrixIndex}
 */
Matrix.prototype.maxRowIndex = function maxRowIndex(index) {
    this.checkRowIndex(index);
    var v = -Infinity;
    var idx = {
        row: index
    };
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] > v) {
            v = this[index][i];
            idx.column = i;
        }
    }
    return idx;
};

/**
 * Returns the minimum value of one row
 * @param {number} index - Row index
 * @returns {number}
 */
Matrix.prototype.minRow = function minRow(index) {
    this.checkRowIndex(index);
    var v = Infinity;
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] < v) {
            v = this[index][i];
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value of one row
 * @param {number} index - Row index
 * @returns {MatrixIndex}
 */
Matrix.prototype.minRowIndex = function minRowIndex(index) {
    this.checkRowIndex(index);
    var v = Infinity;
    var idx = {
        row: index,
        column: 0
    };
    for (var i = 0, ii = this.columns; i < ii; i++) {
        if (this[index][i] < v) {
            v = this[index][i];
            idx.column = i;
        }
    }
    return idx;
};

/**
 * Returns the maximum value of one column
 * @param {number} index - Column index
 * @returns {number}
 */
Matrix.prototype.maxColumn = function maxColumn(index) {
    this.checkColumnIndex(index);
    var v = -Infinity;
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] > v) {
            v = this[i][index];
        }
    }
    return v;
};

/**
 * Returns the index of the maximum value of one column
 * @param {number} index - Column index
 * @returns {MatrixIndex}
 */
Matrix.prototype.maxColumnIndex = function maxColumnIndex(index) {
    this.checkColumnIndex(index);
    var v = -Infinity;
    var idx = {
        row: 0,
        column: index
    };
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] > v) {
            v = this[i][index];
            idx.row = i;
        }
    }
    return idx;
};

/**
 * Returns the minimum value of one column
 * @param {number} index - Column index
 * @returns {number}
 */
Matrix.prototype.minColumn = function minColumn(index) {
    this.checkColumnIndex(index);
    var v = Infinity;
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] < v) {
            v = this[i][index];
        }
    }
    return v;
};

/**
 * Returns the index of the minimum value of one column
 * @param {number} index - Column index
 * @returns {MatrixIndex}
 */
Matrix.prototype.minColumnIndex = function minColumnIndex(index) {
    this.checkColumnIndex(index);
    var v = Infinity;
    var idx = {
        row: 0,
        column: index
    };
    for (var i = 0, ii = this.rows; i < ii; i++) {
        if (this[i][index] < v) {
            v = this[i][index];
            idx.row = i;
        }
    }
    return idx;
};

/**
 * Returns an array containing the diagonal values of the matrix
 * @returns {Array}
 */
Matrix.prototype.diag = function diag() {
    if (!this.isSquare()) throw new TypeError('Only square matrices have a diagonal.');
    var diag = new Array(this.rows);
    for (var i = 0, ii = this.rows; i < ii; i++) {
        diag[i] = this[i][i];
    }
    return diag;
};

/**
 * Returns the sum of all elements of the matrix
 * @returns {number}
 */
Matrix.prototype.sum = function sum() {
    var v = 0;
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            v += this[i][j];
        }
    }
    return v;
};

/**
 * Returns the mean of all elements of the matrix
 * @returns {number}
 */
Matrix.prototype.mean = function mean() {
    return this.sum() / this.size;
};

/**
 * Returns the product of all elements of the matrix
 * @returns {number}
 */
Matrix.prototype.prod = function prod() {
    var prod = 1;
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            prod *= this[i][j];
        }
    }
    return prod;
};

/**
 * Computes the cumulative sum of the matrix elements (in place, row by row)
 * @returns {Matrix} this
 */
Matrix.prototype.cumulativeSum = function cumulativeSum() {
    var sum = 0;
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            sum += this[i][j];
            this[i][j] = sum;
        }
    }
    return this;
};

/**
 * Computes the dot (scalar) product between the matrix and another
 * @param {Matrix} other vector
 * @returns {number}
 */
Matrix.prototype.dot = function dot(other) {
    if (this.size !== other.size) throw new RangeError('vectors do not have the same size');
    var vector1 = this.to1DArray();
    var vector2 = other.to1DArray();
    var dot = 0,
        l = vector1.length;
    for (var i = 0; i < l; i++) {
        dot += vector1[i] * vector2[i];
    }
    return dot;
};

/**
 * Returns the matrix product between this and other
 * @returns {Matrix}
 */
Matrix.prototype.mmul = function mmul(other) {
    if (!Matrix.isMatrix(other)) throw new TypeError('parameter "other" must be a matrix');
    if (this.columns !== other.rows) console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');

    var m = this.rows,
        n = this.columns,
        p = other.columns;
    var result = new Matrix(m, p);

    var Bcolj = new Array(n);
    var i, j, k;
    for (j = 0; j < p; j++) {
        for (k = 0; k < n; k++) Bcolj[k] = other[k][j];

        for (i = 0; i < m; i++) {
            var Arowi = this[i];

            var s = 0;
            for (k = 0; k < n; k++) s += Arowi[k] * Bcolj[k];

            result[i][j] = s;
        }
    }
    return result;
};

/**
 * Sorts the rows (in place)
 * @param {function} compareFunction - usual Array.prototype.sort comparison function
 * @returns {Matrix} this
 */
Matrix.prototype.sortRows = function sortRows(compareFunction) {
    for (var i = 0, ii = this.rows; i < ii; i++) {
        this[i].sort(compareFunction);
    }
    return this;
};

/**
 * Sorts the columns (in place)
 * @param {function} compareFunction - usual Array.prototype.sort comparison function
 * @returns {Matrix} this
 */
Matrix.prototype.sortColumns = function sortColumns(compareFunction) {
    for (var i = 0, ii = this.columns; i < ii; i++) {
        this.setColumn(i, this.getColumn(i).sort(compareFunction));
    }
    return this;
};

/**
 * Transposes the matrix and returns a new one containing the result
 * @returns {Matrix}
 */
Matrix.prototype.transpose = function transpose() {
    var result = new Matrix(this.columns, this.rows);
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[j][i] = this[i][j];
        }
    }
    return result;
};

/**
 * Returns a subset of the matrix
 * @param {number} startRow - First row index
 * @param {number} endRow - Last row index
 * @param {number} startColumn - First column index
 * @param {number} endColumn - Last column index
 * @returns {Matrix}
 */
Matrix.prototype.subMatrix = function subMatrix(startRow, endRow, startColumn, endColumn) {
    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) throw new RangeError('Argument out of range');
    var newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);
    for (var i = startRow; i <= endRow; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
            newMatrix[i - startRow][j - startColumn] = this[i][j];
        }
    }
    return newMatrix;
};

/**
 * Returns a subset of the matrix based on an array of row indices
 * @param {Array} indices - Array containing the row indices
 * @param {number} [startColumn = 0] - First column index
 * @param {number} [endColumn = this.columns-1] - Last column index
 * @returns {Matrix}
 */
Matrix.prototype.subMatrixRow = function subMatrixRow(indices, startColumn, endColumn) {
    if (typeof startColumn === 'undefined') {
        startColumn = 0;
        endColumn = this.columns - 1;
    } else if (typeof endColumn === 'undefined') {
        endColumn = this.columns - 1;
    }
    if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) throw new RangeError('Argument out of range.');
    var l = indices.length,
        rows = this.rows,
        X = new Matrix(l, endColumn - startColumn + 1);
    for (var i = 0; i < l; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
            if (indices[i] < 0 || indices[i] >= rows) throw new RangeError('Argument out of range.');
            X[i][j - startColumn] = this[indices[i]][j];
        }
    }
    return X;
};

/**
 * Returns a subset of the matrix based on an array of column indices
 * @param {Array} indices - Array containing the column indices
 * @param {number} [startRow = 0] - First row index
 * @param {number} [endRow = this.rows-1] - Last row index
 * @returns {Matrix}
 */
Matrix.prototype.subMatrixColumn = function subMatrixColumn(indices, startRow, endRow) {
    if (typeof startRow === 'undefined') {
        startRow = 0;
        endRow = this.rows - 1;
    } else if (typeof endRow === 'undefined') {
        endRow = this.rows - 1;
    }
    if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) throw new RangeError('Argument out of range.');
    var l = indices.length,
        columns = this.columns,
        X = new Matrix(endRow - startRow + 1, l);
    for (var i = 0; i < l; i++) {
        for (var j = startRow; j <= endRow; j++) {
            if (indices[i] < 0 || indices[i] >= columns) throw new RangeError('Argument out of range.');
            X[j - startRow][i] = this[j][indices[i]];
        }
    }
    return X;
};

/**
 * Returns the trace of the matrix (sum of the diagonal elements)
 * @returns {number}
 */
Matrix.prototype.trace = function trace() {
    if (!this.isSquare()) throw new TypeError('The matrix is not square');
    var trace = 0,
        i = 0,
        l = this.rows;
    for (; i < l; i++) {
        trace += this[i][i];
    }
    return trace;
};

/**
 * Sets each element of the matrix to its absolute value
 * @returns {Matrix} this
 */
Matrix.prototype.abs = function abs() {
    var ii = this.rows,
        jj = this.columns;
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            this[i][j] = Math.abs(this[i][j]);
        }
    }
};

module.exports = Matrix;

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
"use strict";

var PNG = function PNG() {

	// initialize all members to keep the same hidden class
	this.width = 0;
	this.height = 0;
	this.bitDepth = 0;
	this.colorType = 0;
	this.compressionMethod = 0;
	this.filterMethod = 0;
	this.interlaceMethod = 0;

	this.colors = 0;
	this.alpha = false;
	this.pixelBits = 0;

	this.palette = null;
	this.pixels = null;
};

PNG.prototype.getWidth = function () {
	return this.width;
};

PNG.prototype.setWidth = function (width) {
	this.width = width;
};

PNG.prototype.getHeight = function () {
	return this.height;
};

PNG.prototype.setHeight = function (height) {
	this.height = height;
};

PNG.prototype.getBitDepth = function () {
	return this.bitDepth;
};

PNG.prototype.setBitDepth = function (bitDepth) {
	if ([2, 4, 8, 16].indexOf(bitDepth) === -1) {
		throw new Error("invalid bith depth " + bitDepth);
	}
	this.bitDepth = bitDepth;
};

PNG.prototype.getColorType = function () {
	return this.colorType;
};

PNG.prototype.setColorType = function (colorType) {

	//   Color    Allowed    Interpretation
	//   Type    Bit Depths
	//
	//   0       1,2,4,8,16  Each pixel is a grayscale sample.
	//
	//   2       8,16        Each pixel is an R,G,B triple.
	//
	//   3       1,2,4,8     Each pixel is a palette index;
	//                       a PLTE chunk must appear.
	//
	//   4       8,16        Each pixel is a grayscale sample,
	//                       followed by an alpha sample.
	//
	//   6       8,16        Each pixel is an R,G,B triple,
	//                       followed by an alpha sample.

	var colors = 0,
	    alpha = false;

	switch (colorType) {
		case 0:
			colors = 1;break;
		case 2:
			colors = 3;break;
		case 3:
			colors = 1;break;
		case 4:
			colors = 2;alpha = true;break;
		case 6:
			colors = 4;alpha = true;break;
		default:
			throw new Error("invalid color type");
	}

	this.colors = colors;
	this.alpha = alpha;
	this.colorType = colorType;
};

PNG.prototype.getCompressionMethod = function () {
	return this.compressionMethod;
};

PNG.prototype.setCompressionMethod = function (compressionMethod) {
	if (compressionMethod !== 0) {
		throw new Error("invalid compression method " + compressionMethod);
	}
	this.compressionMethod = compressionMethod;
};

PNG.prototype.getFilterMethod = function () {
	return this.filterMethod;
};

PNG.prototype.setFilterMethod = function (filterMethod) {
	if (filterMethod !== 0) {
		throw new Error("invalid filter method " + filterMethod);
	}
	this.filterMethod = filterMethod;
};

PNG.prototype.getInterlaceMethod = function () {
	return this.interlaceMethod;
};

PNG.prototype.setInterlaceMethod = function (interlaceMethod) {
	if (interlaceMethod !== 0 && interlaceMethod !== 1) {
		throw new Error("invalid interlace method " + interlaceMethod);
	}
	this.interlaceMethod = interlaceMethod;
};

PNG.prototype.setPalette = function (palette) {
	if (palette.length % 3 !== 0) {
		throw new Error("incorrect PLTE chunk length");
	}
	if (palette.length > Math.pow(2, this.bitDepth) * 3) {
		throw new Error("palette has more colors than 2^bitdepth");
	}
	this.palette = palette;
};

PNG.prototype.getPalette = function () {
	return this.palette;
};

/**
 * get the pixel color on a certain location in a normalized way
 * result is an array: [red, green, blue, alpha]
 */
PNG.prototype.getPixel = function (x, y) {
	if (!this.pixels) throw new Error("pixel data is empty");
	if (x >= this.width || y >= this.height) {
		throw new Error("x,y position out of bound");
	}
	var i = this.colors * this.bitDepth / 8 * (y * this.width + x);
	var pixels = this.pixels;

	switch (this.colorType) {
		case 0:
			return [pixels[i], pixels[i], pixels[i], 255];
		case 2:
			return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
		case 3:
			return [this.palette[pixels[i] * 3 + 0], this.palette[pixels[i] * 3 + 1], this.palette[pixels[i] * 3 + 2], 255];
		case 4:
			return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
		case 6:
			return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
	}
};

module.exports = PNG;

},{}],19:[function(require,module,exports){
(function (process,Buffer){
/*global Uint8Array:true ArrayBuffer:true */
"use strict";

var PNG = require('./PNG');

var isNode = typeof process !== 'undefined' && !process.browser;

var inflate = (function () {
	if (isNode) {
		var zlib = require('zlib');
		return function (data, callback) {
			return zlib.inflate(new Buffer(data), callback);
		};
	} else {
		var stream = require('./stream');
		return function (data, callback) {
			data = new stream.FlateStream(new stream.Stream(data));
			callback(null, data.getBytes());
		};
	}
})();

var ByteBuffer = isNode ? Buffer : (function () {
	if (typeof ArrayBuffer == 'function') {
		return function (length) {
			return new Uint8Array(new ArrayBuffer(length));
		};
	} else {
		return function (length) {
			return new Array(length);
		};
	}
})();

var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

function equalBytes(a, b) {
	if (a.length != b.length) return false;
	for (var l = a.length; l--;) if (a[l] != b[l]) return false;
	return true;
}

function readUInt32(buffer, offset) {
	return (buffer[offset] << 24) + (buffer[offset + 1] << 16) + (buffer[offset + 2] << 8) + (buffer[offset + 3] << 0);
}

function readUInt16(buffer, offset) {
	return (buffer[offset + 1] << 8) + (buffer[offset] << 0);
}

function readUInt8(buffer, offset) {
	return buffer[offset] << 0;
}

function bufferToString(buffer) {
	var str = '';
	for (var i = 0; i < buffer.length; i++) {
		str += String.fromCharCode(buffer[i]);
	}
	return str;
}

var PNGReader = function PNGReader(bytes) {

	if (typeof bytes == 'string') {
		var bts = bytes;
		bytes = new Array(bts.length);
		for (var i = 0, l = bts.length; i < l; i++) {
			bytes[i] = bts[i].charCodeAt(0);
		}
	} else {
		var type = toString.call(bytes).slice(8, -1);
		if (type == 'ArrayBuffer') bytes = new Uint8Array(bytes);
	}

	// current pointer
	this.i = 0;
	// bytes buffer
	this.bytes = bytes;
	// Output object
	this.png = new PNG();

	this.dataChunks = [];
};

PNGReader.prototype.readBytes = function (length) {
	var end = this.i + length;
	if (end > this.bytes.length) {
		throw new Error('Unexpectedly reached end of file');
	}
	var bytes = slice.call(this.bytes, this.i, end);
	this.i = end;
	return bytes;
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature
 */
PNGReader.prototype.decodeHeader = function () {

	if (this.i !== 0) {
		throw new Error('file pointer should be at 0 to read the header');
	}

	var header = this.readBytes(8);

	if (!equalBytes(header, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
		throw new Error('invalid PNGReader file (bad signature)');
	}

	this.header = header;
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout
 *
 * length =  4      bytes
 * type   =  4      bytes (IHDR, PLTE, IDAT, IEND or others)
 * chunk  =  length bytes
 * crc    =  4      bytes
 */
PNGReader.prototype.decodeChunk = function () {

	var length = readUInt32(this.readBytes(4), 0);

	if (length < 0) {
		throw new Error('Bad chunk length ' + (0xFFFFFFFF & length));
	}

	var type = bufferToString(this.readBytes(4));
	var chunk = this.readBytes(length);
	var crc = this.readBytes(4);

	switch (type) {
		case 'IHDR':
			this.decodeIHDR(chunk);break;
		case 'PLTE':
			this.decodePLTE(chunk);break;
		case 'IDAT':
			this.decodeIDAT(chunk);break;
		case 'IEND':
			this.decodeIEND(chunk);break;
	}

	return type;
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR
 * http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html#C.IHDR
 *
 * Width               4 bytes
 * Height              4 bytes
 * Bit depth           1 byte
 * Colour type         1 byte
 * Compression method  1 byte
 * Filter method       1 byte
 * Interlace method    1 byte
 */
PNGReader.prototype.decodeIHDR = function (chunk) {
	var png = this.png;

	png.setWidth(readUInt32(chunk, 0));
	png.setHeight(readUInt32(chunk, 4));
	png.setBitDepth(readUInt8(chunk, 8));
	png.setColorType(readUInt8(chunk, 9));
	png.setCompressionMethod(readUInt8(chunk, 10));
	png.setFilterMethod(readUInt8(chunk, 11));
	png.setInterlaceMethod(readUInt8(chunk, 12));
};

/**
 *
 * http://www.w3.org/TR/PNG/#11PLTE
 */
PNGReader.prototype.decodePLTE = function (chunk) {
	this.png.setPalette(chunk);
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT
 */
PNGReader.prototype.decodeIDAT = function (chunk) {
	// multiple IDAT chunks will concatenated
	this.dataChunks.push(chunk);
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND
 */
PNGReader.prototype.decodeIEND = function () {};

/**
 * Uncompress IDAT chunks
 */
PNGReader.prototype.decodePixels = function (callback) {
	var png = this.png;
	var reader = this;
	var length = 0;
	var i, j, k, l;
	for (l = this.dataChunks.length; l--;) length += this.dataChunks[l].length;
	var data = new ByteBuffer(length);
	for (i = 0, k = 0, l = this.dataChunks.length; i < l; i++) {
		var chunk = this.dataChunks[i];
		for (j = 0; j < chunk.length; j++) data[k++] = chunk[j];
	}
	inflate(data, function (err, data) {
		if (err) return callback(err);

		try {
			if (png.getInterlaceMethod() === 0) {
				reader.interlaceNone(data);
			} else {
				reader.interlaceAdam7(data);
			}
		} catch (e) {
			return callback(e);
		}

		callback();
	});
};

// Different interlace methods

PNGReader.prototype.interlaceNone = function (data) {

	var png = this.png;

	// bytes per pixel
	var bpp = Math.max(1, png.colors * png.bitDepth / 8);

	// color bytes per row
	var cpr = bpp * png.width;

	var pixels = new ByteBuffer(bpp * png.width * png.height);
	var scanline;
	var offset = 0;

	for (var i = 0; i < data.length; i += cpr + 1) {

		scanline = slice.call(data, i + 1, i + cpr + 1);

		switch (readUInt8(data, i)) {
			case 0:
				this.unFilterNone(scanline, pixels, bpp, offset, cpr);break;
			case 1:
				this.unFilterSub(scanline, pixels, bpp, offset, cpr);break;
			case 2:
				this.unFilterUp(scanline, pixels, bpp, offset, cpr);break;
			case 3:
				this.unFilterAverage(scanline, pixels, bpp, offset, cpr);break;
			case 4:
				this.unFilterPaeth(scanline, pixels, bpp, offset, cpr);break;
			default:
				throw new Error("unkown filtered scanline");
		}

		offset += cpr;
	}

	png.pixels = pixels;
};

PNGReader.prototype.interlaceAdam7 = function (data) {
	throw new Error("Adam7 interlacing is not implemented yet");
};

// Unfiltering

/**
 * No filtering, direct copy
 */
PNGReader.prototype.unFilterNone = function (scanline, pixels, bpp, of, length) {
	for (var i = 0, to = length; i < to; i++) {
		pixels[of + i] = scanline[i];
	}
};

/**
 * The Sub() filter transmits the difference between each byte and the value
 * of the corresponding byte of the prior pixel.
 * Sub(x) = Raw(x) + Raw(x - bpp)
 */
PNGReader.prototype.unFilterSub = function (scanline, pixels, bpp, of, length) {
	var i = 0;
	for (; i < bpp; i++) pixels[of + i] = scanline[i];
	for (; i < length; i++) {
		// Raw(x) + Raw(x - bpp)
		pixels[of + i] = scanline[i] + pixels[of + i - bpp] & 0xFF;
	}
};

/**
 * The Up() filter is just like the Sub() filter except that the pixel
 * immediately above the current pixel, rather than just to its left, is used
 * as the predictor.
 * Up(x) = Raw(x) + Prior(x)
 */
PNGReader.prototype.unFilterUp = function (scanline, pixels, bpp, of, length) {
	var i = 0,
	    byte,
	    prev;
	// Prior(x) is 0 for all x on the first scanline
	if (of - length < 0) for (; i < length; i++) {
		pixels[of + i] = scanline[i];
	} else for (; i < length; i++) {
		// Raw(x)
		byte = scanline[i];
		// Prior(x)
		prev = pixels[of + i - length];
		pixels[of + i] = byte + prev & 0xFF;
	}
};

/**
 * The Average() filter uses the average of the two neighboring pixels (left
 * and above) to predict the value of a pixel.
 * Average(x) = Raw(x) + floor((Raw(x-bpp)+Prior(x))/2)
 */
PNGReader.prototype.unFilterAverage = function (scanline, pixels, bpp, of, length) {
	var i = 0,
	    byte,
	    prev,
	    prior;
	if (of - length < 0) {
		// Prior(x) == 0 && Raw(x - bpp) == 0
		for (; i < bpp; i++) {
			pixels[of + i] = scanline[i];
		}
		// Prior(x) == 0 && Raw(x - bpp) != 0 (right shift, prevent doubles)
		for (; i < length; i++) {
			pixels[of + i] = scanline[i] + (pixels[of + i - bpp] >> 1) & 0xFF;
		}
	} else {
		// Prior(x) != 0 && Raw(x - bpp) == 0
		for (; i < bpp; i++) {
			pixels[of + i] = scanline[i] + (pixels[of - length + i] >> 1) & 0xFF;
		}
		// Prior(x) != 0 && Raw(x - bpp) != 0
		for (; i < length; i++) {
			byte = scanline[i];
			prev = pixels[of + i - bpp];
			prior = pixels[of + i - length];
			pixels[of + i] = byte + (prev + prior >> 1) & 0xFF;
		}
	}
};

/**
 * The Paeth() filter computes a simple linear function of the three
 * neighboring pixels (left, above, upper left), then chooses as predictor
 * the neighboring pixel closest to the computed value. This technique is due
 * to Alan W. Paeth.
 * Paeth(x) = Raw(x) +
 *            PaethPredictor(Raw(x-bpp), Prior(x), Prior(x-bpp))
 *  function PaethPredictor (a, b, c)
 *  begin
 *       ; a = left, b = above, c = upper left
 *       p := a + b - c        ; initial estimate
 *       pa := abs(p - a)      ; distances to a, b, c
 *       pb := abs(p - b)
 *       pc := abs(p - c)
 *       ; return nearest of a,b,c,
 *       ; breaking ties in order a,b,c.
 *       if pa <= pb AND pa <= pc then return a
 *       else if pb <= pc then return b
 *       else return c
 *  end
 */
PNGReader.prototype.unFilterPaeth = function (scanline, pixels, bpp, of, length) {
	var i = 0,
	    raw,
	    a,
	    b,
	    c,
	    p,
	    pa,
	    pb,
	    pc,
	    pr;
	if (of - length < 0) {
		// Prior(x) == 0 && Raw(x - bpp) == 0
		for (; i < bpp; i++) {
			pixels[of + i] = scanline[i];
		}
		// Prior(x) == 0 && Raw(x - bpp) != 0
		// paethPredictor(x, 0, 0) is always x
		for (; i < length; i++) {
			pixels[of + i] = scanline[i] + pixels[of + i - bpp] & 0xFF;
		}
	} else {
		// Prior(x) != 0 && Raw(x - bpp) == 0
		// paethPredictor(x, 0, 0) is always x
		for (; i < bpp; i++) {
			pixels[of + i] = scanline[i] + pixels[of + i - length] & 0xFF;
		}
		// Prior(x) != 0 && Raw(x - bpp) != 0
		for (; i < length; i++) {
			raw = scanline[i];
			a = pixels[of + i - bpp];
			b = pixels[of + i - length];
			c = pixels[of + i - length - bpp];
			p = a + b - c;
			pa = Math.abs(p - a);
			pb = Math.abs(p - b);
			pc = Math.abs(p - c);
			if (pa <= pb && pa <= pc) pr = a;else if (pb <= pc) pr = b;else pr = c;
			pixels[of + i] = raw + pr & 0xFF;
		}
	}
};

/**
 * Parse the PNG file
 *
 * reader.parse(options, callback)
 * OR
 * reader.parse(callback)
 *
 * OPTIONS:
 *    option  | type     | default
 *    ----------------------------
 *    data      boolean    true    should it read the pixel data
 */
PNGReader.prototype.parse = function (options, callback) {

	if (typeof options == 'function') callback = options;
	if (typeof options != 'object') options = {};

	try {

		this.decodeHeader();

		while (this.i < this.bytes.length) {
			var type = this.decodeChunk();
			// stop after IHDR chunk, or after IEND
			if (type == 'IHDR' && options.data === false || type == 'IEND') break;
		}

		var png = this.png;

		this.decodePixels(function (err) {
			callback(err, png);
		});
	} catch (e) {
		callback(e);
	}
};

module.exports = PNGReader;

}).call(this,require('_process'),require("buffer").Buffer)
},{"./PNG":18,"./stream":20,"_process":3,"buffer":2,"zlib":2}],20:[function(require,module,exports){
/**
 * Extract from pdf.js
 * https://github.com/mozilla/pdf.js
 *
 *
 *    Copyright (c) 2011 Mozilla Foundation
 *
 *    Contributors: Andreas Gal <gal@mozilla.com>
 *                  Chris G Jones <cjones@mozilla.com>
 *                  Shaon Barman <shaon.barman@gmail.com>
 *                  Vivien Nicolas <21@vingtetun.org>
 *                  Justin D'Arcangelo <justindarc@gmail.com>
 *                  Yury Delendik
 *                  Kalervo Kujala
 *                  Adil Allawi <@ironymark>
 *                  Jakob Miland <saebekassebil@gmail.com>
 *                  Artur Adib <aadib@mozilla.com>
 *                  Brendan Dahl <bdahl@mozilla.com>
 *                  David Quintana <gigaherz@gmail.com>
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in
 *    all copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 */

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var Stream = (function StreamClosure() {
  function Stream(arrayBuffer, start, length, dict) {
    this.bytes = new Uint8Array(arrayBuffer);
    this.start = start || 0;
    this.pos = this.start;
    this.end = start + length || this.bytes.length;
    this.dict = dict;
  }

  // required methods for a stream. if a particular stream does not
  // implement these, an error should be thrown
  Stream.prototype = Object.defineProperties({
    getByte: function Stream_getByte() {
      if (this.pos >= this.end) return null;
      return this.bytes[this.pos++];
    },
    // returns subarray of original buffer
    // should only be read
    getBytes: function Stream_getBytes(length) {
      var bytes = this.bytes;
      var pos = this.pos;
      var strEnd = this.end;

      if (!length) return bytes.subarray(pos, strEnd);

      var end = pos + length;
      if (end > strEnd) end = strEnd;

      this.pos = end;
      return bytes.subarray(pos, end);
    },
    lookChar: function Stream_lookChar() {
      if (this.pos >= this.end) return null;
      return String.fromCharCode(this.bytes[this.pos]);
    },
    getChar: function Stream_getChar() {
      if (this.pos >= this.end) return null;
      return String.fromCharCode(this.bytes[this.pos++]);
    },
    skip: function Stream_skip(n) {
      if (!n) n = 1;
      this.pos += n;
    },
    reset: function Stream_reset() {
      this.pos = this.start;
    },
    moveStart: function Stream_moveStart() {
      this.start = this.pos;
    },
    makeSubStream: function Stream_makeSubStream(start, length, dict) {
      return new Stream(this.bytes.buffer, start, length, dict);
    },
    isStream: true
  }, {
    length: {
      get: function get() {
        return this.end - this.start;
      },
      configurable: true,
      enumerable: true
    }
  });

  return Stream;
})();

// super class for the decoding streams
var DecodeStream = (function DecodeStreamClosure() {
  function DecodeStream() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  DecodeStream.prototype = {
    ensureBuffer: function DecodeStream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current) return buffer;
      var size = 512;
      while (size < requested) size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i) buffer2[i] = buffer[i];
      return this.buffer = buffer2;
    },
    getByte: function DecodeStream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof) return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function DecodeStream_getBytes(length) {
      var end,
          pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        end = pos + length;

        while (!this.eof && this.bufferLength < end) this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd) end = bufEnd;
      } else {
        while (!this.eof) this.readBlock();

        end = this.bufferLength;

        // checking if bufferLength is still 0 then
        // the buffer has to be initialized
        if (!end) this.buffer = new Uint8Array(0);
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function DecodeStream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof) return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function DecodeStream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof) return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function DecodeStream_makeSubStream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof) this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function DecodeStream_skip(n) {
      if (!n) n = 1;
      this.pos += n;
    },
    reset: function DecodeStream_reset() {
      this.pos = 0;
    }
  };

  return DecodeStream;
})();

var FlateStream = (function FlateStreamClosure() {
  var codeLenCodeMap = new Uint32Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

  var lengthDecode = new Uint32Array([0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a, 0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f, 0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073, 0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102]);

  var distDecode = new Uint32Array([0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d, 0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1, 0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01, 0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001]);

  var fixedLitCodeTab = [new Uint32Array([0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0, 0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0, 0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0, 0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0, 0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8, 0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8, 0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8, 0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8, 0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4, 0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4, 0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4, 0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4, 0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc, 0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec, 0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc, 0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc, 0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2, 0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2, 0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2, 0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2, 0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca, 0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea, 0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da, 0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa, 0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6, 0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6, 0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6, 0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6, 0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce, 0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee, 0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de, 0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe, 0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1, 0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1, 0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1, 0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1, 0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9, 0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9, 0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9, 0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9, 0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5, 0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5, 0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5, 0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5, 0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd, 0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed, 0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd, 0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd, 0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3, 0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3, 0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3, 0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3, 0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb, 0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb, 0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db, 0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb, 0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7, 0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7, 0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7, 0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7, 0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf, 0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef, 0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df, 0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff]), 9];

  var fixedDistCodeTab = [new Uint32Array([0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c, 0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000, 0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d, 0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000]), 5];

  function FlateStream(stream) {
    var bytes = stream.getBytes();
    var bytesPos = 0;

    this.dict = stream.dict;
    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1) error('Invalid header in flate stream: ' + cmf + ', ' + flg);
    if ((cmf & 0x0f) != 0x08) error('Unknown compression method in flate stream: ' + cmf + ', ' + flg);
    if (((cmf << 8) + flg) % 31 != 0) error('Bad FCHECK in flate stream: ' + cmf + ', ' + flg);
    if (flg & 0x20) error('FDICT bit set in flate stream: ' + cmf + ', ' + flg);

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  FlateStream.prototype = Object.create(DecodeStream.prototype);

  FlateStream.prototype.getBits = function FlateStream_getBits(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined') error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & (1 << bits) - 1;
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  FlateStream.prototype.getCode = function FlateStream_getCode(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined') error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    var code = codes[codeBuf & (1 << maxLen) - 1];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0) error('Bad encoding in flate stream');
    this.codeBuf = codeBuf >> codeLen;
    this.codeSize = codeSize - codeLen;
    this.bytesPos = bytesPos;
    return codeVal;
  };

  FlateStream.prototype.generateHuffmanTable = function flateStreamGenerateHuffmanTable(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen) maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2; len <= maxLen; ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = code2 << 1 | t & 1;
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip) codes[i] = len << 16 | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  FlateStream.prototype.readBlock = function FlateStream_readBlock() {
    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1) this.eof = true;
    hdr >>= 1;

    if (hdr == 0) {
      // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined') error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined') error('Bad block header in flate stream');
      blockLen |= b << 8;
      if (typeof (b = bytes[bytesPos++]) == 'undefined') error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined') error('Bad block header in flate stream');
      check |= b << 8;
      if (check != (~blockLen & 0xffff)) error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) {
      // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) {
      // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);

      for (var i = 0; i < numCodeLenCodes; ++i) codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Uint8Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          var bitsLength = 2,
              bitsOffset = 3,
              what = len;
        } else if (code == 17) {
          var bitsLength = 3,
              bitsOffset = 3,
              what = len = 0;
        } else if (code == 18) {
          var bitsLength = 7,
              bitsOffset = 11,
              what = len = 0;
        } else {
          codeLengths[i++] = len = code;
          continue;
        }

        var repeatLength = this.getBits(bitsLength) + bitsOffset;
        while (repeatLength-- > 0) codeLengths[i++] = what;
      }

      litCodeTable = this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
      distCodeTable = this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0) code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0) code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos) buffer[pos] = buffer[pos - dist];
    }
  };

  return FlateStream;
})();

exports.Stream = Stream;
exports.FlateStream = FlateStream;

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function (str, search, pos) {
	pos = typeof pos === 'number' ? pos : 0;

	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.indexOf(search, pos) !== -1;
};

},{}],22:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BinaryReader = (function () {
    function BinaryReader(imageData) {
        _classCallCheck(this, BinaryReader);

        if (imageData.buffer) {
            imageData = imageData.buffer;
        }
        this.data = new DataView(imageData);
        this.offset = 0;
        this.littleEndian = true;
    }

    _createClass(BinaryReader, [{
        key: 'readInt8',
        value: function readInt8() {
            return this.data.getInt8(this.offset++);
        }
    }, {
        key: 'readUint8',
        value: function readUint8() {
            return this.data.getUint8(this.offset++);
        }
    }, {
        key: 'readInt16',
        value: function readInt16() {
            var value = this.data.getInt16(this.offset, this.littleEndian);
            this.offset += 2;
            return value;
        }
    }, {
        key: 'readUint16',
        value: function readUint16() {
            var value = this.data.getUint16(this.offset, this.littleEndian);
            this.offset += 2;
            return value;
        }
    }, {
        key: 'readInt32',
        value: function readInt32() {
            var value = this.data.getInt32(this.offset, this.littleEndian);
            this.offset += 4;
            return value;
        }
    }, {
        key: 'readUint32',
        value: function readUint32() {
            var value = this.data.getUint32(this.offset, this.littleEndian);
            this.offset += 4;
            return value;
        }
    }, {
        key: 'readFloat32',
        value: function readFloat32() {
            var value = this.data.getFloat32(this.offset, this.littleEndian);
            this.offset += 4;
            return value;
        }
    }, {
        key: 'readFloat64',
        value: function readFloat64() {
            var value = this.data.getFloat64(this.offset, this.littleEndian);
            this.offset += 8;
            return value;
        }
    }, {
        key: 'setBigEndian',
        value: function setBigEndian() {
            this.littleEndian = false;
        }
    }, {
        key: 'setLittleEndian',
        value: function setLittleEndian() {
            this.littleEndian = true;
        }
    }, {
        key: 'forward',
        value: function forward(n) {
            this.offset += n;
        }
    }, {
        key: 'goto',
        value: function goto(offset) {
            this.offset = offset;
        }
    }]);

    return BinaryReader;
})();

module.exports = BinaryReader;

},{}],23:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var dateTimeRegex = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

var IFD = (function () {
    function IFD() {
        _classCallCheck(this, IFD);

        this.fields = new Map();
    }

    // Custom fields

    _createClass(IFD, [{
        key: 'size',
        get: function get() {
            return this.width * this.height;
        }
    }, {
        key: 'width',
        get: function get() {
            return this.imageWidth;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.imageLength;
        }
    }, {
        key: 'components',
        get: function get() {
            return this.samplesPerPixel;
        }
    }, {
        key: 'date',
        get: function get() {
            var date = new Date();
            var result = dateTimeRegex.exec(this.dateTime);
            date.setFullYear(result[1], result[2] - 1, result[3]);
            date.setHours(result[4], result[5], result[6]);
            return date;
        }

        // IFD fields
    }, {
        key: 'newSubfileType',
        get: function get() {
            return this.fields.get(254);
        }
    }, {
        key: 'imageWidth',
        get: function get() {
            return this.fields.get(256);
        }
    }, {
        key: 'imageLength',
        get: function get() {
            return this.fields.get(257);
        }
    }, {
        key: 'bitsPerSample',
        get: function get() {
            return this.fields.get(258);
        }
    }, {
        key: 'compression',
        get: function get() {
            return this.fields.get(259);
        }
    }, {
        key: 'type',
        get: function get() {
            return this.fields.get(262);
        }
    }, {
        key: 'fillOrder',
        get: function get() {
            return this.fields.get(266) || 1;
        }
    }, {
        key: 'documentName',
        get: function get() {
            return this.fields.get(269);
        }
    }, {
        key: 'imageDescription',
        get: function get() {
            return this.fields.get(270);
        }
    }, {
        key: 'stripOffsets',
        get: function get() {
            return alwaysArray(this.fields.get(273));
        }
    }, {
        key: 'orientation',
        get: function get() {
            return this.fields.get(274);
        }
    }, {
        key: 'samplesPerPixel',
        get: function get() {
            return this.fields.get(277);
        }
    }, {
        key: 'rowsPerStrip',
        get: function get() {
            return this.fields.get(278);
        }
    }, {
        key: 'stripByteCounts',
        get: function get() {
            return alwaysArray(this.fields.get(279));
        }
    }, {
        key: 'minSampleValue',
        get: function get() {
            return this.fields.get(280) || 0;
        }
    }, {
        key: 'maxSampleValue',
        get: function get() {
            return this.fields.get(281) || (1 << this.bitsPerSample) - 1;
        }
    }, {
        key: 'xResolution',
        get: function get() {
            return this.fields.get(282);
        }
    }, {
        key: 'yResolution',
        get: function get() {
            return this.fields.get(283);
        }
    }, {
        key: 'planarConfiguration',
        get: function get() {
            return this.fields.get(284) || 1;
        }
    }, {
        key: 'resolutionUnit',
        get: function get() {
            return this.fields.get(296) || 2;
        }
    }, {
        key: 'dateTime',
        get: function get() {
            return this.fields.get(306);
        }
    }, {
        key: 'predictor',
        get: function get() {
            return this.fields.get(317) || 1;
        }
    }, {
        key: 'sampleFormat',
        get: function get() {
            return this.fields.get(339) || 1;
        }
    }, {
        key: 'sMinSampleValue',
        get: function get() {
            return this.fields.get(340) || this.minSampleValue;
        }
    }, {
        key: 'sMaxSampleValue',
        get: function get() {
            return this.fields.get(341) || this.maxSampleValue;
        }
    }]);

    return IFD;
})();

module.exports = IFD;

function alwaysArray(value) {
    if (typeof value === 'number') return [value];
    return value;
}

},{}],24:[function(require,module,exports){
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
        return [decoder.readUint32(), decoder.readUint32()];
    }
    var rationals = new Array(count);
    for (var i = 0; i < count; i++) {
        rationals[i] = [decoder.readUint32(), decoder.readUint32()];
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
        return [decoder.readInt32(), decoder.readInt32()];
    }
    var rationals = new Array(count);
    for (var i = 0; i < count; i++) {
        rationals[i] = [decoder.readInt32(), decoder.readInt32()];
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

},{}],25:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TIFF = function TIFF() {
    _classCallCheck(this, TIFF);

    this.ifd = [];
};

module.exports = TIFF;

},{}],26:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BinaryReader = require('./BinaryReader');
var IFD = require('./IFD');
var IFDValue = require('./IFDValue');
var TIFF = require('./TIFF');

var TIFFDecoder = (function (_BinaryReader) {
    _inherits(TIFFDecoder, _BinaryReader);

    function TIFFDecoder(data) {
        _classCallCheck(this, TIFFDecoder);

        _get(Object.getPrototypeOf(TIFFDecoder.prototype), 'constructor', this).call(this, data);
        this.decoded = false;
        this.tiff = null;
        this.nextIFD = 0;
    }

    _createClass(TIFFDecoder, [{
        key: 'decode',
        value: function decode() {
            if (this.decoded) return this.tiff;
            this.tiff = new TIFF();
            this.decodeHeader();
            while (this.nextIFD) {
                this.decodeIFD();
            }
            return this.tiff;
        }
    }, {
        key: 'decodeHeader',
        value: function decodeHeader() {
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
            this.nextIFD = this.readUint32();
        }
    }, {
        key: 'decodeIFD',
        value: function decodeIFD() {
            this.goto(this.nextIFD);
            var ifd = new IFD();
            this.tiff.ifd.push(ifd);
            var numEntries = this.readUint16();
            for (var i = 0; i < numEntries; i++) {
                this.decodeIFDEntry(ifd);
            }
            this.decodeImageData(ifd);
            this.nextIFD = this.readUint32();
        }
    }, {
        key: 'decodeIFDEntry',
        value: function decodeIFDEntry(ifd) {
            var offset = this.offset;
            var tag = this.readUint16();
            var type = this.readUint16();
            var numValues = this.readUint32();

            if (type < 1 || type > 12) {
                this.forward(4); // unknown type, skip this value
                return;
            }

            var valueByteLength = IFDValue.getByteLength(type, numValues);
            if (valueByteLength > 4) {
                this.goto(this.readUint32());
            }

            var value = IFDValue.readData(this, type, numValues);
            ifd.fields.set(tag, value);

            // goto offset of next entry
            this.goto(offset + 12);
        }
    }, {
        key: 'decodeImageData',
        value: function decodeImageData(ifd) {
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
    }, {
        key: 'decodeBilevelOrGrey',
        value: function decodeBilevelOrGrey(ifd) {
            var width = ifd.width;
            var height = ifd.height;

            var bitDepth = ifd.bitsPerSample;
            var size = width * height;
            var data = getDataArray(size, 1, bitDepth);

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
                    pixel = fill16bit(data, stripData, pixel, length, this.littleEndian);
                } else {
                    unsupported('bitDepth: ', bitDepth);
                }
            }

            ifd.data = data;
        }
    }, {
        key: 'getStripData',
        value: function getStripData(compression, offset, byteCounts) {
            switch (compression) {
                case 1:
                    // No compression
                    return new DataView(this.data.buffer, offset, byteCounts);
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
    }]);

    return TIFFDecoder;
})(BinaryReader);

module.exports = TIFFDecoder;

function getDataArray(size, channels, bitDepth) {
    if (bitDepth === 8) {
        return new Uint8Array(size * channels);
    } else if (bitDepth === 16) {
        return new Uint16Array(size * channels);
    } else {
        unsupported('bit depth', bitDepth);
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

function unsupported(type, value) {
    throw new Error('Unsupported ' + type + ': ' + value);
}

},{"./BinaryReader":22,"./IFD":23,"./IFDValue":24,"./TIFF":25}],27:[function(require,module,exports){
'use strict';

exports.TIFFDecoder = require('./TIFFDecoder');

},{"./TIFFDecoder":26}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = getColorHistogram;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

function getColorHistogram() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
    var result = (0, _newArray2['default'])(Math.pow(8, nbSlotsCheck), 0);
    var factor2 = Math.pow(2, nbSlotsCheck * 2);
    var factor1 = Math.pow(2, nbSlotsCheck);

    if (useAlpha && this.alpha) {
        for (var i = 0; i < data.length; i += this.channels) {
            var slot = (data[i] >> bitShift) * factor2 + (data[i + 1] >> bitShift) * factor1 + (data[i + 2] >> bitShift);
            result[slot] += data[i + this.channels - 1] / this.maxValue;
        }
    } else {
        for (var i = 0; i < data.length; i += this.channels) {
            var slot = (data[i] >> bitShift) * 64 + (data[i + 1] >> bitShift) * 8 + (data[i + 2] >> bitShift);
            result[slot]++;
        }
    }

    return result;
}

module.exports = exports['default'];

},{"new-array":17}],29:[function(require,module,exports){

// returns the number of transparent

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = countAlphaPixels;

function countAlphaPixels() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var alpha = _ref.alpha;

    this.checkProcessable('countAlphaPixels', {
        bitDepth: [8, 16],
        alpha: 1
    });

    var count = 0;

    if (alpha !== undefined) {
        for (var i = this.components; i < this.data.length; i += this.channels) {
            if (this.data[i] === alpha) count++;
        }
        return count;
    } else {
        // because there is an alpha channel all the pixels have an alpha
        return this.size;
    }
}

module.exports = exports['default'];

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getHistogram = getHistogram;
exports.getHistograms = getHistograms;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

var _isInteger = require('is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

function getHistogram() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$maxSlots = _ref.maxSlots;
    var maxSlots = _ref$maxSlots === undefined ? 256 : _ref$maxSlots;
    var channel = _ref.channel;
    var _ref$useAlpha = _ref.useAlpha;
    var useAlpha = _ref$useAlpha === undefined ? true : _ref$useAlpha;

    this.checkProcessable('getHistogram', {
        bitDepth: [8, 16]
    });
    if (channel === undefined) {
        if (this.components > 1) {
            throw new RangeError('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }
    return getChannelHistogram.call(this, channel, useAlpha, maxSlots);
}

function getHistograms() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref2$maxSlots = _ref2.maxSlots;
    var maxSlots = _ref2$maxSlots === undefined ? 256 : _ref2$maxSlots;
    var _ref2$useAlpha = _ref2.useAlpha;
    var useAlpha = _ref2$useAlpha === undefined ? true : _ref2$useAlpha;

    this.checkProcessable('getHistograms', {
        bitDepth: [8, 16]
    });

    var results = new Array(this.channels);
    for (var i = 0; i < this.channels; i++) {
        results[i] = getChannelHistogram.call(this, i, useAlpha, maxSlots);
    }
    return results;
}

function getChannelHistogram(channel, useAlpha, maxSlots) {
    var bitSlots = Math.log2(maxSlots);
    if (!(0, _isInteger2['default'])(bitSlots)) {
        throw new RangeError('maxSlots must be a power of 2, for example: 64, 256, 1024');
    }
    // we will compare the bitSlots to the bitDepth of the image
    // based on this we will shift the values. This allows to generate a histogram
    // of 16 grey even if the images has 256 shade of grey

    var bitShift = 0;
    if (this.bitDepth > bitSlots) bitShift = this.bitDepth - bitSlots;

    var data = this.data;
    var result = (0, _newArray2['default'])(Math.pow(2, Math.min(this.bitDepth, bitSlots)), 0);
    if (useAlpha && this.alpha) {
        var alphaChannelDiff = this.channels - channel - 1;

        for (var i = channel; i < data.length; i += this.channels) {
            result[data[i] >> bitShift] += data[i + alphaChannelDiff] / this.maxValue;
        }
    } else {
        for (var i = channel; i < data.length; i += this.channels) {
            result[data[i] >> bitShift]++;
        }
    }

    return result;
}

},{"is-integer":5,"new-array":17}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = max;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

// returns an array with the minimal value of each component

function max() {
    this.checkProcessable('max', {
        bitDepth: [8, 16]
    });

    var result = (0, _newArray2['default'])(this.channels, -Infinity);

    for (var i = 0; i < this.data.length; i += this.channels) {
        for (var c = 0; c < this.channels; c++) {
            if (this.data[i + c] > result[c]) result[c] = this.data[i + c];
        }
    }
    return result;
}

module.exports = exports['default'];

},{"new-array":17}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = min;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

// returns an array with the minimal value of each component

function min() {
    this.checkProcessable('min', {
        bitDepth: [8, 16]
    });

    var result = (0, _newArray2['default'])(this.channels, +Infinity);

    for (var i = 0; i < this.data.length; i += this.channels) {
        for (var c = 0; c < this.channels; c++) {
            if (this.data[i + c] < result[c]) result[c] = this.data[i + c];
        }
    }
    return result;
}

module.exports = exports['default'];

},{"new-array":17}],33:[function(require,module,exports){
// this function will return an array containing an array of XY

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = getPixelsArray;

function getPixelsArray() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var threshold = _ref.threshold;
    var channel = _ref.channel;
    var _ref$useAlpha = _ref.useAlpha;
    var useAlpha = _ref$useAlpha === undefined ? true : _ref$useAlpha;

    this.checkProcessable('getPixelsArray', {
        bitDepth: [1]
    });

    if (this.bitDepth === 1) {
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
}

module.exports = exports['default'];

},{}],34:[function(require,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = getRelativePosition;

function getRelativePosition(targetImage) {
    if (this === targetImage) return [0, 0];
    var position = [0, 0];

    var currentImage = this;
    while (currentImage) {
        if (currentImage === targetImage) return position;
        if (currentImage.position) {
            position[0] += currentImage.position[0];
            position[1] += currentImage.position[1];
        }
        currentImage = currentImage.parent;
    }
    // we should never reach this place, this means we could not find the parent
    return undefined;
    // throw Error('Parent image was not found, can not get relative position.')
}

module.exports = exports["default"];

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = sum;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

// returns an array with the minimal value of each component

function sum() {
    this.checkProcessable('sum', {
        bitDepth: [8, 16]
    });

    var result = (0, _newArray2['default'])(this.channels, 0);

    for (var i = 0; i < this.data.length; i += this.channels) {
        for (var c = 0; c < this.channels; c++) {
            result[c] += this.data[i + c];
        }
    }
    return result;
}

module.exports = exports['default'];

},{"new-array":17}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = getSVD;
var Matrix = require('ml-matrix');

function getSVD() {
    this.checkProcessable('getSVD', {
        bitDepth: [1]
    });

    return Matrix.DC.SVD(this.pixelsArray);
}

module.exports = exports['default'];

},{"ml-matrix":15}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var loadBinary = undefined,
    DOMImage = undefined,
    Canvas = undefined,
    ImageData = undefined,
    isDifferentOrigin = undefined,
    env = undefined;

if (typeof self !== 'undefined') {
    (function () {
        // Browser
        exports.env = env = 'browser';
        var origin = self.location.origin;
        exports.isDifferentOrigin = isDifferentOrigin = function (url) {
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

        exports.loadBinary = loadBinary = function (url) {
            return new Promise(function (resolve, reject) {
                var xhr = new self.XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';

                xhr.onload = function (e) {
                    this.status === 200 ? resolve(this.response) : reject('wrong status', e);
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
        exports.isDifferentOrigin = isDifferentOrigin = function (url) {
            return false;
        };

        exports.ImageData = ImageData = require('canvas/lib/bindings').ImageData;

        var canvas = require('canvas');
        exports.DOMImage = DOMImage = canvas.Image;
        exports.Canvas = Canvas = canvas;

        var fs = require('fs');
        exports.loadBinary = loadBinary = function (path) {
            return new Promise(function (resolve, reject) {
                fs.readFile(path, function (err, data) {
                    err ? reject(err) : resolve(data.buffer);
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

},{"canvas":undefined,"canvas/lib/bindings":undefined,"fs":2}],38:[function(require,module,exports){
// filters
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = extend;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _filterInvertGetSet = require('./filter/invertGetSet');

var _filterInvertGetSet2 = _interopRequireDefault(_filterInvertGetSet);

var _filterInvertIterator = require('./filter/invertIterator');

var _filterInvertIterator2 = _interopRequireDefault(_filterInvertIterator);

var _filterInvertMatrix = require('./filter/invertMatrix');

var _filterInvertMatrix2 = _interopRequireDefault(_filterInvertMatrix);

var _filterInvertOneLoop = require('./filter/invertOneLoop');

var _filterInvertOneLoop2 = _interopRequireDefault(_filterInvertOneLoop);

var _filterInvertPixel = require('./filter/invertPixel');

var _filterInvertPixel2 = _interopRequireDefault(_filterInvertPixel);

var _filterInvertApply = require('./filter/invertApply');

var _filterInvertApply2 = _interopRequireDefault(_filterInvertApply);

var _filterInvertApplyAll = require('./filter/invertApplyAll');

var _filterInvertApplyAll2 = _interopRequireDefault(_filterInvertApplyAll);

var _filterInvertBinaryLoop = require('./filter/invertBinaryLoop');

var _filterInvertBinaryLoop2 = _interopRequireDefault(_filterInvertBinaryLoop);

var _filterInvert = require('./filter/invert');

var _filterInvert2 = _interopRequireDefault(_filterInvert);

var _filterBlur = require('./filter/blur');

var _filterBlur2 = _interopRequireDefault(_filterBlur);

var _filterMedian = require('./filter/median');

var _filterMedian2 = _interopRequireDefault(_filterMedian);

var _filterGaussian = require('./filter/gaussian');

var _filterGaussian2 = _interopRequireDefault(_filterGaussian);

var _filterLevel = require('./filter/level');

var _filterLevel2 = _interopRequireDefault(_filterLevel);

// transformers

var _transformCrop = require('./transform/crop');

var _transformCrop2 = _interopRequireDefault(_transformCrop);

var _transformScaleScale = require('./transform/scale/scale');

var _transformScaleScale2 = _interopRequireDefault(_transformScaleScale);

var _transformHsv = require('./transform/hsv');

var _transformHsv2 = _interopRequireDefault(_transformHsv);

var _transformHsl = require('./transform/hsl');

var _transformHsl2 = _interopRequireDefault(_transformHsl);

var _transformGreyGrey = require('./transform/grey/grey');

var _transformGreyGrey2 = _interopRequireDefault(_transformGreyGrey);

var _transformMaskMask = require('./transform/mask/mask');

var _transformMaskMask2 = _interopRequireDefault(_transformMaskMask);

var _transformPad = require('./transform/pad');

var _transformPad2 = _interopRequireDefault(_transformPad);

var _transformResizeBinary = require('./transform/resizeBinary');

var _transformResizeBinary2 = _interopRequireDefault(_transformResizeBinary);

var _utilitySplit = require('./utility/split');

var _utilitySplit2 = _interopRequireDefault(_utilitySplit);

var _utilityGetChannel = require('./utility/getChannel');

var _utilityGetChannel2 = _interopRequireDefault(_utilityGetChannel);

var _utilitySetChannel = require('./utility/setChannel');

var _utilitySetChannel2 = _interopRequireDefault(_utilitySetChannel);

var _utilityGetSimilarity = require('./utility/getSimilarity');

var _utilityGetSimilarity2 = _interopRequireDefault(_utilityGetSimilarity);

var _utilityGetBestMatch = require('./utility/getBestMatch');

var _utilityGetBestMatch2 = _interopRequireDefault(_utilityGetBestMatch);

var _operatorPaintMasks = require('./operator/paintMasks');

var _operatorPaintMasks2 = _interopRequireDefault(_operatorPaintMasks);

var _operatorExtract = require('./operator/extract');

var _operatorExtract2 = _interopRequireDefault(_operatorExtract);

var _operatorConvolutionApply = require('./operator/convolutionApply');

var _operatorConvolutionApply2 = _interopRequireDefault(_operatorConvolutionApply);

// computers

var _computeHistogram = require('./compute/histogram');

var _computeColorHistogram = require('./compute/colorHistogram');

var _computeColorHistogram2 = _interopRequireDefault(_computeColorHistogram);

var _computeMin = require('./compute/min');

var _computeMin2 = _interopRequireDefault(_computeMin);

var _computeMax = require('./compute/max');

var _computeMax2 = _interopRequireDefault(_computeMax);

var _computeSum = require('./compute/sum');

var _computeSum2 = _interopRequireDefault(_computeSum);

var _computePixelsArray = require('./compute/pixelsArray');

var _computePixelsArray2 = _interopRequireDefault(_computePixelsArray);

var _computeRelativePosition = require('./compute/relativePosition');

var _computeRelativePosition2 = _interopRequireDefault(_computeRelativePosition);

var _computeSvd = require('./compute/svd');

var _computeSvd2 = _interopRequireDefault(_computeSvd);

var _computeCountAlphaPixels = require('./compute/countAlphaPixels');

var _computeCountAlphaPixels2 = _interopRequireDefault(_computeCountAlphaPixels);

function extend(Image) {
    var inPlace = { inPlace: true };
    Image.extendMethod('invertGetSet', _filterInvertGetSet2['default'], inPlace);
    Image.extendMethod('invertIterator', _filterInvertIterator2['default'], inPlace);
    Image.extendMethod('invertMatrix', _filterInvertMatrix2['default'], inPlace);
    Image.extendMethod('invertPixel', _filterInvertPixel2['default'], inPlace);
    Image.extendMethod('invertOneLoop', _filterInvertOneLoop2['default'], inPlace);
    Image.extendMethod('invertApply', _filterInvertApply2['default'], inPlace);
    Image.extendMethod('invertApplyAll', _filterInvertApplyAll2['default'], inPlace);
    Image.extendMethod('invert', _filterInvert2['default'], inPlace);
    Image.extendMethod('invertBinaryLoop', _filterInvertBinaryLoop2['default'], inPlace);
    Image.extendMethod('level', _filterLevel2['default'], inPlace);

    Image.extendMethod('meanFilter', _filterBlur2['default']);
    Image.extendMethod('medianFilter', _filterMedian2['default']);
    Image.extendMethod('gaussianFilter', _filterGaussian2['default']);

    Image.extendMethod('crop', _transformCrop2['default']);
    Image.extendMethod('scale', _transformScaleScale2['default']);
    Image.extendMethod('hsv', _transformHsv2['default']);
    Image.extendMethod('hsl', _transformHsl2['default']);
    Image.extendMethod('grey', _transformGreyGrey2['default']).extendMethod('gray', _transformGreyGrey2['default']);
    Image.extendMethod('mask', _transformMaskMask2['default']);
    Image.extendMethod('pad', _transformPad2['default']);
    Image.extendMethod('resizeBinary', _transformResizeBinary2['default']);

    Image.extendMethod('split', _utilitySplit2['default']);
    Image.extendMethod('getChannel', _utilityGetChannel2['default']);
    Image.extendMethod('setChannel', _utilitySetChannel2['default']);
    Image.extendMethod('getSimilarity', _utilityGetSimilarity2['default']);
    Image.extendMethod('getBestMatch', _utilityGetBestMatch2['default']);

    Image.extendMethod('paintMasks', _operatorPaintMasks2['default']);
    Image.extendMethod('extract', _operatorExtract2['default']);
    Image.extendMethod('convolution', _operatorConvolutionApply2['default']);

    Image.extendMethod('countAlphaPixels', _computeCountAlphaPixels2['default']);
    Image.extendMethod('getHistogram', _computeHistogram.getHistogram).extendProperty('histogram', _computeHistogram.getHistogram);
    Image.extendMethod('getHistograms', _computeHistogram.getHistograms).extendProperty('histograms', _computeHistogram.getHistograms);
    Image.extendMethod('getColorHistogram', _computeColorHistogram2['default']).extendProperty('colorHistogram', _computeColorHistogram2['default']);
    Image.extendMethod('getMin', _computeMin2['default']).extendProperty('min', _computeMin2['default']);
    Image.extendMethod('getMax', _computeMax2['default']).extendProperty('max', _computeMax2['default']);
    Image.extendMethod('getSum', _computeSum2['default']).extendProperty('sum', _computeSum2['default']);
    Image.extendMethod('getPixelsArray', _computePixelsArray2['default']).extendProperty('pixelsArray', _computePixelsArray2['default']);
    Image.extendMethod('getRelativePosition', _computeRelativePosition2['default']);
    Image.extendMethod('getSVD', _computeSvd2['default']).extendProperty('svd', _computeSvd2['default']);
}

module.exports = exports['default'];

},{"./compute/colorHistogram":28,"./compute/countAlphaPixels":29,"./compute/histogram":30,"./compute/max":31,"./compute/min":32,"./compute/pixelsArray":33,"./compute/relativePosition":34,"./compute/sum":35,"./compute/svd":36,"./filter/blur":39,"./filter/gaussian":40,"./filter/invert":41,"./filter/invertApply":42,"./filter/invertApplyAll":43,"./filter/invertBinaryLoop":44,"./filter/invertGetSet":45,"./filter/invertIterator":46,"./filter/invertMatrix":47,"./filter/invertOneLoop":48,"./filter/invertPixel":49,"./filter/level":50,"./filter/median":51,"./operator/convolutionApply":61,"./operator/extract":62,"./operator/paintMasks":63,"./transform/crop":68,"./transform/grey/grey":70,"./transform/hsl":75,"./transform/hsv":76,"./transform/mask/mask":77,"./transform/pad":79,"./transform/resizeBinary":80,"./transform/scale/scale":82,"./utility/getBestMatch":85,"./utility/getChannel":86,"./utility/getSimilarity":87,"./utility/setChannel":89,"./utility/split":90}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = meanFilter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _operatorConvolution = require('../operator/convolution');

var _operatorConvolution2 = _interopRequireDefault(_operatorConvolution);

// first release of mean filter

function meanFilter(k) {

    this.checkProcessable('meanFilter', {
        components: [1],
        bitDepth: [8, 16]
    });

    if (k < 1) {
        throw new Error('Number of neighbors should be grater than 0');
    }

    //mean filter do not is in place
    var newImage = _image2['default'].createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    var n = 2 * k + 1;
    var size = n * n;
    var kernel = new Array(size);

    for (var i = 0; i < kernel.length; i++) {
        kernel[i] = 1;
    }
    _operatorConvolution2['default'].call(this, newImage, kernel);

    return newImage;
}

module.exports = exports['default'];

},{"../image":52,"../operator/convolution":60}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = gaussianFilter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _operatorConvolution = require('../operator/convolution');

var _operatorConvolution2 = _interopRequireDefault(_operatorConvolution);

function gaussianFilter() {
	var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var _ref$neighbors = _ref.neighbors;
	var neighbors = _ref$neighbors === undefined ? 1 : _ref$neighbors;
	var sigma = _ref.sigma;
	var _ref$boundary = _ref.boundary;
	var boundary = _ref$boundary === undefined ? 'copy' : _ref$boundary;

	this.checkProcessable('gaussianFilter', {
		components: [1],
		bitDepth: [8, 16]
	});

	var kernel = undefined;
	if (sigma) {
		kernel = getSigmaKernel(sigma);
	} else {
		// sigma approximation using neighbors
		sigma = 0.3 * (neighbors - 1) + 0.8;
		kernel = getKernel(neighbors, sigma);
	}

	//gaussian filter do not is in place
	var newImage = _image2['default'].createFrom(this, {
		kind: {
			components: 1,
			alpha: this.alpha,
			bitDepth: this.bitDepth,
			colorModel: null
		}
	});

	_operatorConvolution2['default'].call(this, newImage, kernel, boundary);

	return newImage;
}

function getKernel(neighbors, sigma) {
	if (neighbors < 1) {
		throw new RangeError('Number of neighbors should be grater than 0');
	}
	var n = 2 * neighbors + 1;

	var kernel = new Array(n * n);

	//gaussian kernel is calculated
	var sigma2 = 2 * (sigma * sigma); //2*sigma^2
	var PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2

	for (var i = 0; i <= neighbors; i++) {
		for (var j = i; j <= neighbors; j++) {
			var value = Math.exp(-(i * i + j * j) / sigma2) / PI2sigma2;
			kernel[(i + neighbors) * n + (j + neighbors)] = value;
			kernel[(i + neighbors) * n + (-j + neighbors)] = value;
			kernel[(-i + neighbors) * n + (j + neighbors)] = value;
			kernel[(-i + neighbors) * n + (-j + neighbors)] = value;
			kernel[(j + neighbors) * n + (i + neighbors)] = value;
			kernel[(j + neighbors) * n + (-i + neighbors)] = value;
			kernel[(-j + neighbors) * n + (i + neighbors)] = value;
			kernel[(-j + neighbors) * n + (-i + neighbors)] = value;
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
module.exports = exports['default'];

},{"../image":52,"../operator/convolution":60}],41:[function(require,module,exports){
// we try the faster methods

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invert;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _miscValidateArrayOfChannels = require('../misc/validateArrayOfChannels');

var _miscValidateArrayOfChannels2 = _interopRequireDefault(_miscValidateArrayOfChannels);

function invert() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var channels = _ref.channels;

    this.checkProcessable('invertOneLoop', {
        bitDepth: [1, 8, 16],
        dimension: 2
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
        var _channels = (0, _miscValidateArrayOfChannels2['default'])(this, _channels, true);

        var data = this.data;

        // for (let j of channels) { WOULD SLOW DO OF A FACTOR 10 !

        for (var c = 0; c < _channels.length; c++) {
            var j = _channels[c];
            for (var i = j; i < data.length; i += this.channels) {
                data[i] = this.maxValue - data[i];
            }
        }
    }
}

module.exports = exports['default'];

},{"../misc/validateArrayOfChannels":57}],42:[function(require,module,exports){
// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertApply;

function invertApply() {

    if (this.bitDepth === 1) {
        this.checkProcessable('invertApply', {
            dimension: 2
        });
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

module.exports = exports['default'];

},{}],43:[function(require,module,exports){
// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertApplyAll;

function invertApplyAll() {

    this.checkProcessable('invertApplyAll', {
        bitDepth: [8, 16]
    });
    this.applyAll(function (index) {
        for (var k = 0; k < this.components; k++) {
            this.data[index + k] = this.maxValue - this.data[index + k];
        }
    });
}

module.exports = exports['default'];

},{}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertBinaryLoop;

function invertBinaryLoop() {
    this.checkProcessable('invertBinaryLoop', {
        bitDepth: [1],
        dimension: 2
    });

    for (var i = 0; i < this.size; i++) {
        this.toggleBit(i);
    }
}

module.exports = exports['default'];

},{}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invert;

function invert() {
    this.checkProcessable('invert', {
        bitDepth: [1, 8, 16],
        dimension: 2
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

module.exports = exports['default'];

},{}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertIterator;

function invertIterator() {
    this.checkProcessable('invert', {
        bitDepth: [1, 8, 16],
        dimension: 2
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
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.pixels()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _step.value;
                var index = _step$value.index;
                var pixel = _step$value.pixel;

                for (var k = 0; k < this.components; k++) {
                    this.setValue(index, k, this.maxValue - pixel[k]);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}

module.exports = exports['default'];

},{}],47:[function(require,module,exports){
// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertMatrix;

function invertMatrix() {
    this.checkProcessable('invertMatrix', {
        bitDepth: [8, 16],
        dimension: 2
    });
    var matrix = this.getMatrix();
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            for (var k = 0; k < this.components; k++) {
                matrix[x][y][k] = this.maxValue - matrix[x][y][k];
            }
        }
    }
    this.setMatrix(matrix);
}

module.exports = exports['default'];

},{}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertOneLoop;

function invertOneLoop() {
    this.checkProcessable('invertOneLoop', {
        bitDepth: [8, 16],
        dimension: 2
    });

    var data = this.data;
    for (var i = 0; i < data.length; i += this.channels) {
        for (var j = 0; j < this.components; j++) {
            data[i + j] = this.maxValue - data[i + j];
        }
    }
}

module.exports = exports['default'];

},{}],49:[function(require,module,exports){
// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = invertPixel;

function invertPixel() {
    this.checkProcessable('invertPixel', {
        bitDepth: [8, 16],
        dimension: 2
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

module.exports = exports['default'];

},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = level;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _miscValidateArrayOfChannels = require('../misc/validateArrayOfChannels');

var _miscValidateArrayOfChannels2 = _interopRequireDefault(_miscValidateArrayOfChannels);

function level() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$algorithm = _ref.algorithm;
    var algorithm = _ref$algorithm === undefined ? 'full' : _ref$algorithm;
    var channels = _ref.channels;

    this.checkProcessable('level', {
        bitDepth: [8, 16],
        dimension: 2
    });

    channels = (0, _miscValidateArrayOfChannels2['default'])(this, { channels: channels });

    switch (algorithm) {
        case 'full':
            var delta = 1e-5; // sorry no better value that this "best guess"
            var min = this.min;
            var max = this.max;
            var factor = new Array(this.channels);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var c = _step.value;

                    if (min[c] === 0 && max[c] === this.maxValue) {
                        factor[c] = 0;
                    } else if (max[c] === min[c]) {
                        factor[c] = 0;
                    } else {
                        factor[c] = (this.maxValue + 1 - delta) / (max[c] - min[c]);
                    }
                    min[c] += (0.5 - delta / 2) / factor[c];
                }

                /*
                 Note on border effect
                 For 8 bits images we should calculate for the space between -0.5 and 255.5
                 so that after ronding the first and last points still have the same population
                 But doing this we need to deal with Math.round that gives 256 if the value is 255.5
                  */
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            for (var j = 0; j < channels.length; j++) {
                var c = channels[j];
                if (factor[c] !== 0) {
                    for (var i = 0; i < this.data.length; i += this.channels) {
                        this.data[i + c] = (this.data[i + c] - min[c]) * factor[c] + 0.5 | 0;
                    }
                }
            }

            break;
        default:
            throw new Error('level: algorithm not implement: ' + algorithm);
    }
}

module.exports = exports['default'];

},{"../misc/validateArrayOfChannels":57}],51:[function(require,module,exports){
/**
 * Created by Cristian on 18/07/2015.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = medianFilter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

//k: size of kernel (k*k)

function medianFilter(k) {
    this.checkProcessable('medianFilter', {
        components: [1],
        bitDepth: [8, 16]
    });

    if (k < 1) {
        throw new Error('Kernel size should be grater than 0');
    }

    var newImage = _image2['default'].createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    var size = k * k;
    var kernel = new Array(size);

    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var n = 0;
            for (var i = -k; i <= k; i++) {
                for (var j = -k; j <= k; j++) {
                    var val = isOutSidePixel(x + i, y + j, this) ? mirrorValue(x, y, i, j, this) : this.getValueXY(x + i, y + j, 0);
                    kernel[n] = val;
                    n++;
                }
            }
            var newValue = kernel.sort()[Math.floor(kernel.length / 2)];
            newImage.setValueXY(x, y, 0, newValue);
            if (this.alpha) {
                newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
            }
        }
    }

    return newImage;
}

//End medianFilter function

function isOutSidePixel(x, y, im) {
    return x > im.width || x < 0 || y > im.height || y < 0;
}

function mirrorValue(x, y, i, j, im) {
    if (!isOutSidePixel(x + i, y + j, im)) {
        return im.getValueXY(x + i, y + j, 0);
    } else if (!isOutSidePixel(x - i, y + j, im)) {
        return im.getValueXY(x - i, y + j, 0);
    } else if (!isOutSidePixel(x + i, y - j, im)) {
        return im.getValueXY(x + i, y - j, 0);
    } else if (!isOutSidePixel(x - i, y - j, im)) {
        return im.getValueXY(x - i, y - j, 0);
    } else {
        return 0;
    }
}
module.exports = exports['default'];

},{"../image":52}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _kind = require('./kind');

var _kindNames = require('./kindNames');

var _environment = require('./environment');

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

var _fs = require('fs');

var _modelModel = require('./model/model');

var _roiManager = require('./roi/manager');

var _roiManager2 = _interopRequireDefault(_roiManager);

var _mediaTypes = require('./mediaTypes');

var _extend3 = require('extend');

var _extend4 = _interopRequireDefault(_extend3);

var _load = require('./load');

var computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

var Image = (function () {
    function Image(width, height, data, options) {
        _classCallCheck(this, Image);

        // or (sizes, data, options)
        if (Array.isArray(width)) {
            // we need to give an array with ALL the dimensions
            options = data;
            data = height;
            this.sizes = width;
        } else {
            if (width === undefined) width = 1;
            if (height === undefined) height = 1;
            this.sizes = [width, height];
        }
        if (data && !data.length) {
            options = data;
            data = null;
        }
        if (options === undefined) options = {};

        if (!(this.sizes[0] > 0)) {
            throw new RangeError('width must be greater than 0');
        }
        if (!(this.sizes[1] > 0)) {
            throw new RangeError('height must be greater than 0');
        }

        // We will set the parent image for relative position

        Object.defineProperty(this, 'parent', { enumerable: false, writable: true });
        this.parent = options.parent;
        this.position = options.position || [0, 0];

        var theKind = undefined;
        if (typeof options.kind === 'string') {
            theKind = (0, _kind.getKind)(options.kind);
            if (!theKind) throw new RangeError('invalid image kind: ' + options.kind);
        } else {
            theKind = (0, _kind.getKind)(_kindNames.RGBA);
        }

        var kindDefinition = (0, _extend4['default'])({}, theKind, options);

        this.components = kindDefinition.components;
        this.alpha = kindDefinition.alpha;
        this.bitDepth = kindDefinition.bitDepth;
        this.colorModel = kindDefinition.colorModel;

        this.computed = {};

        this.initialize();

        if (!data) data = (0, _kind.getPixelArray)(kindDefinition, this.size);else {
            var theoreticalSize = (0, _kind.getPixelArraySize)(kindDefinition, this.size);
            if (theoreticalSize !== data.length) {
                throw new RangeError('incorrect data size. Should be ' + theoreticalSize + ' and found ' + data.length);
            }
        }

        this.data = data;
    }

    _createClass(Image, [{
        key: 'initialize',
        value: function initialize() {
            this.dimension = this.sizes.length;
            this.width = this.sizes[0];
            this.height = this.sizes[1];

            var size = 1;
            for (var i = 0; i < this.sizes.length; i++) {
                size *= this.sizes[i];
            }
            this.size = size; // the number of pixels

            this.channels = this.components + this.alpha;
            this.maxValue = (1 << this.bitDepth) - 1;

            var multipliers = [this.dimension];
            multipliers[0] = this.channels;
            for (var i = 1; i < this.dimension; i++) {
                multipliers[i] = multipliers[i - 1] * this.sizes[i - 1];
            }
            this.multipliers = multipliers;
        }
    }, {
        key: 'getPixelIndex',
        value: function getPixelIndex(indices) {
            var shift = 0;
            for (var i = 0; i < indices.length; i++) {
                shift += this.multipliers[i] * indices[i];
            }
            return shift;
        }
    }, {
        key: 'setValueXY',
        value: function setValueXY(x, y, channel, value) {
            this.data[(y * this.width + x) * this.channels + channel] = value;
        }
    }, {
        key: 'getValueXY',
        value: function getValueXY(x, y, channel) {
            return this.data[(y * this.width + x) * this.channels + channel];
        }
    }, {
        key: 'setValue',
        value: function setValue(pixel, channel, value) {
            this.data[pixel * this.channels + channel] = value;
        }
    }, {
        key: 'getValue',
        value: function getValue(pixel, channel) {
            return this.data[pixel * this.channels + channel];
        }
    }, {
        key: 'setPixelXY',
        value: function setPixelXY(x, y, value) {
            this.setPixel(y * this.width + x, value);
        }
    }, {
        key: 'getPixelXY',
        value: function getPixelXY(x, y) {
            return this.getPixel(y * this.width + x);
        }
    }, {
        key: 'setPixel',
        value: function setPixel(pixel, value) {
            var target = pixel * this.channels;
            for (var i = 0; i < value.length; i++) {
                this.data[target + i] = value[i];
            }
        }
    }, {
        key: 'getPixel',
        value: function getPixel(pixel) {
            var value = new Array(this.channels);
            var target = pixel * this.channels;
            for (var i = 0; i < this.channels; i++) {
                value[i] = this.data[target + i];
            }
            return value;
        }
    }, {
        key: 'setMatrix',
        value: function setMatrix(matrix, channel) {
            // the user is expected to know what he is doing !
            // we blinding put the matrix result
            for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height; j++) {
                    for (var k = 0; k < this.channels; k++) {
                        if (channel) {
                            this.data[(j * this.width + i) * this.channels + channel] = matrix[i][j];
                        } else {
                            this.data[(j * this.width + i) * this.channels + k] = matrix[i][j][k];
                        }
                    }
                }
            }
        }
    }, {
        key: 'getMatrix',
        value: function getMatrix(channel) {
            var matrix = new Array(this.width);
            for (var i = 0; i < this.width; i++) {
                matrix[i] = new Array(this.height);
                for (var j = 0; j < this.height; j++) {
                    if (channel) {
                        matrix[i][j] = this.data[(j * this.width + i) * this.channels + channel];
                    } else {
                        matrix[i][j] = new Array(this.channels);
                        for (var k = 0; k < this.channels; k++) {
                            matrix[i][j][k] = this.data[(j * this.width + i) * this.channels + k];
                        }
                    }
                }
            }
            return matrix;
        }
    }, {
        key: 'toDataURL',
        value: function toDataURL() {
            var type = arguments.length <= 0 || arguments[0] === undefined ? 'image/png' : arguments[0];

            return this.getCanvas().toDataURL((0, _mediaTypes.getType)(type));
        }
    }, {
        key: 'getCanvas',
        value: function getCanvas() {
            var data = new _environment.ImageData(this.getRGBAData(), this.width, this.height);
            var canvas = new _environment.Canvas(this.width, this.height);
            var ctx = canvas.getContext('2d');
            ctx.putImageData(data, 0, 0);
            return canvas;
        }
    }, {
        key: 'getRGBAData',
        value: function getRGBAData() {
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
                    for (var i = 0; i < size; i++) {
                        newData[i * 4] = this.data[i * this.channels] >>> this.bitDepth - 8;
                        newData[i * 4 + 1] = this.data[i * this.channels] >>> this.bitDepth - 8;
                        newData[i * 4 + 2] = this.data[i * this.channels] >>> this.bitDepth - 8;
                    }
                } else if (this.components === 3) {
                    this.checkProcessable('getRGBAData', { colorModel: [_modelModel.RGB] });
                    if (this.colorModel === _modelModel.RGB) {
                        for (var i = 0; i < size; i++) {
                            newData[i * 4] = this.data[i * this.channels] >>> this.bitDepth - 8;
                            newData[i * 4 + 1] = this.data[i * this.channels + 1] >>> this.bitDepth - 8;
                            newData[i * 4 + 2] = this.data[i * this.channels + 2] >>> this.bitDepth - 8;
                        }
                    }
                }
            }
            if (this.alpha) {
                this.checkProcessable('getRGBAData', { bitDepth: [8, 16] });
                for (var i = 0; i < size; i++) {
                    newData[i * 4 + 3] = this.data[i * this.channels + this.components] >> this.bitDepth - 8;
                }
            } else {
                for (var i = 0; i < size; i++) {
                    newData[i * 4 + 3] = 255;
                }
            }
            return newData;
        }

        // those methods can only apply on binary images ... but we will not loose time to check !
    }, {
        key: 'setBitXY',
        value: function setBitXY(x, y) {
            var target = y * this.width + x;
            var shift = 7 - (target & 7);
            var slot = target >> 3;
            this.data[slot] |= 1 << shift;
        }
    }, {
        key: 'clearBitXY',
        value: function clearBitXY(x, y) {
            var target = y * this.width + x;
            var shift = 7 - (target & 7);
            var slot = target >> 3;
            this.data[slot] &= ~(1 << shift);
        }
    }, {
        key: 'toggleBitXY',
        value: function toggleBitXY(x, y) {
            var target = y * this.width + x;
            var shift = 7 - (target & 7);
            var slot = target >> 3;
            this.data[slot] ^= 1 << shift;
        }
    }, {
        key: 'getBitXY',
        value: function getBitXY(x, y) {
            var target = y * this.width + x;
            var shift = 7 - (target & 7);
            var slot = target >> 3;
            return this.data[slot] & 1 << shift ? 1 : 0;
        }
    }, {
        key: 'setBit',
        value: function setBit(pixel) {
            var shift = 7 - (pixel & 7);
            var slot = pixel >> 3;
            this.data[slot] |= 1 << shift;
        }
    }, {
        key: 'clearBit',
        value: function clearBit(pixel) {
            var shift = 7 - (pixel & 7);
            var slot = pixel >> 3;
            this.data[slot] &= ~(1 << shift);
        }
    }, {
        key: 'toggleBit',
        value: function toggleBit(pixel) {
            var shift = 7 - (pixel & 7);
            var slot = pixel >> 3;
            this.data[slot] ^= 1 << shift;
        }
    }, {
        key: 'getBit',
        value: function getBit(pixel) {
            var shift = 7 - (pixel & 7);
            var slot = pixel >> 3;
            return this.data[slot] & 1 << shift ? 1 : 0;
        }
    }, {
        key: 'getROIManager',
        value: function getROIManager(mask, options) {
            return new _roiManager2['default'](this, options);
        }
    }, {
        key: 'clone',
        value: function clone() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref$copyData = _ref.copyData;
            var copyData = _ref$copyData === undefined ? true : _ref$copyData;

            var nemImage = Image.createFrom(this);
            if (copyData) {
                var data = this.data;
                var newData = nemImage.data;
                for (var i = 0; i < newData.length; i++) {
                    newData[i] = data[i];
                }
            }
            return nemImage;
        }
    }, {
        key: 'save',
        value: function save(path) {
            var _this = this;

            var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref2$format = _ref2.format;
            var format = _ref2$format === undefined ? 'png' : _ref2$format;
            // Node.JS only
            return new Promise(function (resolve, reject) {
                var out = (0, _fs.createWriteStream)(path);
                var canvas = _this.getCanvas();
                var stream = undefined;
                switch (format.toLowerCase()) {
                    case 'png':
                        stream = canvas.pngStream();
                        break;
                    case 'jpg':
                    case 'jpeg':
                        stream = canvas.jpegStream();
                        break;
                    default:
                        return reject(new RangeError('invalid output format: ' + format));
                }
                out.on('finish', resolve);
                out.on('error', reject);
                stream.pipe(out);
            });
        }

        // this method check if a process can be applied on the current image
    }, {
        key: 'checkProcessable',
        value: function checkProcessable(processName) {
            var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var bitDepth = _ref3.bitDepth;
            var alpha = _ref3.alpha;
            var colorModel = _ref3.colorModel;
            var components = _ref3.components;
            var dimension = _ref3.dimension;

            if (typeof processName !== 'string') {
                throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
            }
            if (bitDepth) {
                if (!Array.isArray(bitDepth)) bitDepth = [bitDepth];
                if (bitDepth.indexOf(this.bitDepth) === -1) {
                    throw new TypeError('The process: ' + processName + ' can only be applied if bit depth is in: ' + bitDepth);
                }
            }
            if (dimension) {
                if (!Array.isArray(dimension)) dimension = [dimension];
                if (dimension.indexOf(this.dimension) === -1) {
                    throw new TypeError('The process: ' + processName + ' can only be applied if the image has as dimension: ' + dimension);
                }
            }
            if (alpha) {
                if (!Array.isArray(alpha)) alpha = [alpha];
                if (alpha.indexOf(this.alpha) === -1) {
                    throw new TypeError('The process: ' + processName + ' can only be applied if alpha is in: ' + alpha);
                }
            }
            if (colorModel) {
                if (!Array.isArray(colorModel)) colorModel = [colorModel];
                if (colorModel.indexOf(this.colorModel) === -1) {
                    throw new TypeError('The process: ' + processName + ' can only be applied if color model is in: ' + colorModel);
                }
            }
            if (components) {
                if (!Array.isArray(components)) components = [components];
                if (components.indexOf(this.components) === -1) {
                    throw new TypeError('The process: ' + processName + ' can only be applied if the number of channels is in: ' + components);
                }
            }
        }
    }, {
        key: 'apply',
        value: function apply(filter) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var index = (y * this.width + x) * this.channels;
                    filter.call(this, index);
                }
            }
        }
    }, {
        key: 'applyAll',
        value: function applyAll(filter) {
            var maxValue = new Array(this.sizes.length);
            for (var i = 0; i < this.sizes.length; i++) {
                maxValue[i] = this.sizes[i] - 1;
            }
            var currents = new Uint16Array(this.dimension);
            var position = 0;
            while (true) {
                // TODO this may be quite the limiting step and inline does not help
                // we could optimize it by keeping track of previously partical
                // calculated indices
                var index = this.getPixelIndex(currents);
                filter.call(this, index);
                if (currents[position] === maxValue[position]) {
                    while (position < currents.length && currents[position] === maxValue[position]) {
                        currents[position] = 0;
                        position++;
                    }
                    if (position === currents.length) {
                        break;
                    }
                    currents[position]++;
                    position = 0;
                } else {
                    currents[position]++;
                }
            }
        }

        // This approach is SOOOO slow .... for now just forget about it !
        /**pixels() {
            let toYield = {x: 0, y: 0, index: 0, pixel: new Array(this.channels)};
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    toYield.x = x;
                    toYield.y = y;
                    toYield.index = y * this.width + x;
                    for (let c = 0; c < this.channels; c++) {
                        toYield.pixel[c] = this.data[toYield.index * this.channels + c];
                    }
                    yield toYield;
                }
            }
        }*/
    }], [{
        key: 'load',
        value: function load(url) {
            return (0, _load.loadURL)(url);
        }
    }, {
        key: 'extendMethod',
        value: function extendMethod(name, method) {
            var _ref4 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var _ref4$inPlace = _ref4.inPlace;
            var inPlace = _ref4$inPlace === undefined ? false : _ref4$inPlace;
            var _ref4$returnThis = _ref4.returnThis;
            var returnThis = _ref4$returnThis === undefined ? true : _ref4$returnThis;
            var _ref4$partialArgs = _ref4.partialArgs;
            var partialArgs = _ref4$partialArgs === undefined ? [] : _ref4$partialArgs;

            if (inPlace) {
                Image.prototype[name] = function () {
                    // reset computed properties
                    this.computed = {};

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var result = method.apply(this, [].concat(_toConsumableArray(partialArgs), args));
                    if (returnThis) return this;
                    return result;
                };
            } else {
                Image.prototype[name] = function () {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    return method.apply(this, [].concat(_toConsumableArray(partialArgs), args));
                };
            }
            return Image;
        }
    }, {
        key: 'extendProperty',
        value: function extendProperty(name, method) {
            var _ref5 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var _ref5$partialArgs = _ref5.partialArgs;
            var partialArgs = _ref5$partialArgs === undefined ? [] : _ref5$partialArgs;

            computedPropertyDescriptor.get = function () {
                if (this.computed.hasOwnProperty(name)) {
                    return this.computed[name];
                } else {
                    var result = method.apply(this, partialArgs);
                    this.computed[name] = result;
                    return result;
                }
            };
            Object.defineProperty(Image.prototype, name, computedPropertyDescriptor);
            return Image;
        }
    }, {
        key: 'createFrom',
        value: function createFrom(other, options) {
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
            (0, _extend4['default'])(newOptions, options);
            return new Image(newOptions.width, newOptions.height, newOptions);
        }
    }, {
        key: 'isTypeSupported',
        value: function isTypeSupported(type) {
            var operation = arguments.length <= 1 || arguments[1] === undefined ? 'write' : arguments[1];

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
    }]);

    return Image;
})();

exports['default'] = Image;

(0, _extend2['default'])(Image);
module.exports = exports['default'];

},{"./environment":37,"./extend":38,"./kind":53,"./kindNames":54,"./load":55,"./mediaTypes":56,"./model/model":59,"./roi/manager":66,"extend":4,"fs":2}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getKind = getKind;
exports.getPixelArraySize = getPixelArraySize;
exports.getPixelArray = getPixelArray;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _kindNames = require('./kindNames');

var Kind = _interopRequireWildcard(_kindNames);

var _modelModel = require('./model/model');

var kinds = {};

kinds[Kind.BINARY] = {
    components: 1,
    alpha: 0,
    bitDepth: 1
};

kinds[Kind.GREYA] = {
    components: 1,
    alpha: 1,
    bitDepth: 8
};

kinds[Kind.GREY] = {
    components: 1,
    alpha: 0,
    bitDepth: 8
};

kinds[Kind.RGBA] = {
    components: 3,
    alpha: 1,
    bitDepth: 8,
    colorModel: _modelModel.RGB
};

kinds[Kind.RGB] = {
    components: 3,
    alpha: 0,
    bitDepth: 8,
    colorModel: _modelModel.RGB
};

function getKind(kind) {
    return kinds[kind];
}

function getPixelArraySize(kind, numberPixels) {
    var length = (kind.components + kind.alpha) * numberPixels;
    if (kind.bitDepth === 1) {
        length = Math.ceil(length / 8);
    }
    return length;
}

function getPixelArray(kind, numberPixels) {
    var length = (kind.components + kind.alpha) * numberPixels;
    var arr = undefined;
    switch (kind.bitDepth) {
        case 1:
            arr = new Uint8Array(Math.ceil(length / 8));
            break;
        case 8:
            arr = new Uint8ClampedArray(length);
            break;
        case 16:
            arr = new Uint16Array(length);
            break;
        default:
            throw new Error('Cannot create pixel array for bit depth ' + kind.bitDepth);
    }

    // alpha channel is 100% by default
    if (kind.alpha) {
        for (var i = kind.components; i < arr.length; i += kind.channels) {
            arr[i] = kind.maxValue;
        }
    }

    return arr;
}

},{"./kindNames":54,"./model/model":59}],54:[function(require,module,exports){
// Shortcuts for common image kinds

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var BINARY = 'BINARY';
exports.BINARY = BINARY;
var GREYA = 'GREYA';
exports.GREYA = GREYA;
var RGBA = 'RGBA';
exports.RGBA = RGBA;
var RGB = 'RGB';
exports.RGB = RGB;
var GREY = 'GREY';
exports.GREY = GREY;

},{}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.loadURL = loadURL;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var _environment = require('./environment');

var _pngJs = require('png.js');

var _pngJs2 = _interopRequireDefault(_pngJs);

var _tiff = require('tiff');

var _atobLite = require('atob-lite');

var _atobLite2 = _interopRequireDefault(_atobLite);

var isDataURL = /data:[a-z]+\/([a-z]+);base64,(.+)/;
var isPNG = /\.png$/i;
var isTIFF = /\.tiff?$/i;

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

function loadURL(url) {
    var dataURL = isDataURL.exec(url);
    if (dataURL) {
        var mimetype = dataURL[1];
        if (mimetype === 'png') {
            return Promise.resolve(str2ab((0, _atobLite2['default'])(dataURL[2]))).then(loadPNG);
        } else if (mimetype === 'tiff') {
            return Promise.resolve(str2ab((0, _atobLite2['default'])(dataURL[2]))).then(loadTIFF);
        }
    }

    if (isPNG.test(url)) {
        return (0, _environment.loadBinary)(url).then(loadPNG);
    } else if (isTIFF.test(url)) {
        return (0, _environment.loadBinary)(url).then(loadTIFF);
    }

    return loadGeneric(url);
}

function loadPNG(data) {
    return new Promise(function (resolve, reject) {
        var reader = new _pngJs2['default'](data);
        reader.parse(function (err, png) {
            if (err) return reject(err);
            var bitDepth = png.getBitDepth();
            var buffer = png.pixels.buffer;
            var offset = png.pixels.byteOffset;
            var length = png.pixels.length;
            var data = undefined;
            if (bitDepth === 8) {
                data = new Uint8ClampedArray(buffer, offset, length);
            } else if (bitDepth === 16) {
                data = new Uint16Array(buffer, offset, length / 2);
                for (var i = 0; i < data.length; i++) {
                    data[i] = swap16(data[i]);
                }
            }

            resolve(new _image2['default'](png.width, png.height, data, {
                components: png.colors - png.alpha,
                alpha: png.alpha,
                bitDepth: bitDepth
            }));
        });
    });
}

function loadTIFF(data) {
    var decoder = new _tiff.TIFFDecoder(data);
    var result = decoder.decode();
    var image = result.ifd[0];
    return new _image2['default'](image.width, image.height, image.data, {
        components: 1,
        alpha: 0,
        colorModel: null,
        bitDepth: image.bitsPerSample
    });
}

function loadGeneric(url) {
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
            resolve(new _image2['default'](w, h, data));
        };
        image.onerror = function () {
            reject(new Error('Could not load ' + url));
        };
        image.src = url;
    });
}

},{"./environment":37,"./image":52,"atob-lite":1,"png.js":19,"tiff":27}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.canWrite = canWrite;
exports.getType = getType;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var _environment = require('./environment');

var _stringIncludes = require('string-includes');

var _stringIncludes2 = _interopRequireDefault(_stringIncludes);

var types = new Map();
var image = undefined;

function getMediaType(type) {
    if (!image) {
        image = new _image2['default'](1, 1);
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

var MediaType = (function () {
    function MediaType(type) {
        _classCallCheck(this, MediaType);

        this.type = type;
        this._canWrite = null;
    }

    _createClass(MediaType, [{
        key: 'canWrite',
        value: function canWrite() {
            if (this._canWrite === null) {
                this._canWrite = image.toDataURL(this.type).startsWith('data:' + this.type);
            }
            return this._canWrite;
        }
    }]);

    return MediaType;
})();

function getType(type) {
    if (!(0, _stringIncludes2['default'])(type, '/')) {
        type = 'image/' + type;
    }
    return type;
}

},{"./environment":37,"./image":52,"string-includes":21}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = arrayOfChannels;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _validateChannel = require('./validateChannel');

var _validateChannel2 = _interopRequireDefault(_validateChannel);

function arrayOfChannels(image) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? // are we allowing the selection of an alpha channel ?
    // if no channels are selected should we take the alpha channel ?
    {} : arguments[1];

    var channels = _ref.channels;
    var allowAlpha = _ref.allowAlpha;
    var defaultAlpha = _ref.defaultAlpha;

    if (typeof allowAlpha !== 'boolean') allowAlpha = true;

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
    if (!Array.isArray(channels)) channels = [channels];
    for (var c = 0; c < channels.length; c++) {
        channels[c] = (0, _validateChannel2['default'])(image, channels[c], allowAlpha);
    }
    return channels;
}
module.exports = exports['default'];

},{"./validateChannel":58}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = validateChannel;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _modelModel = require('../model/model');

var Model = _interopRequireWildcard(_modelModel);

function validateChannel(image, channel) {
    var allowAlpha = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    if (channel === undefined) {
        throw new RangeError('validateChannel : the channel has to be >=0 and <' + image.channels);
    }

    if (typeof channel === 'string') {
        if ('rgb'.indexOf(channel) > -1) {
            if (image.colorModel !== Model.RGB) throw new Error('getChannel : not a RGB image');
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
            }
        }

        if (channel === 'a') {
            if (!image.alpha) throw new Error('validateChannel : the image does not contain alpha channel');
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

module.exports = exports['default'];

},{"../model/model":59}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var RGB = 'RGB';
exports.RGB = RGB;
var HSL = 'HSL';
exports.HSL = HSL;
var HSV = 'HSV';
exports.HSV = HSV;

},{}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = convolution;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isInteger = require('is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

function convolution(newImage, kernel) {
    var kernelWidth = undefined,
        kWidth = undefined,
        kHeight = undefined;
    var div = 0,
        sum = 0,
        newValue = 0;
    var twoDim = Array.isArray(kernel[0]);

    if (Array.isArray(kernel) && !twoDim) {
        if ((0, _isInteger2['default'])(Math.sqrt(kernel.length))) {
            kernelWidth = Math.sqrt(kernel.length);
            kWidth = kHeight = Math.floor(kernelWidth / 2);
        } else {
            throw new RangeError('Number of neighbors should be grater than 0');
        }
        //calculate div
        for (var i = 0; i < kernel.length; i++) {
            div += kernel[i];
        }
    } else if (twoDim) {
        if (kernel.width & 1 === 0 || kernel.height & 1 === 0) throw new RangeError('Kernel rows and columns should be odd numbers');else {
            kWidth = Math.floor(kernel.length / 2);
            kHeight = Math.floor(kernel[0].length / 2);
        }
        //calculate div
        for (var i = 0; i < kernel.length; i++) {
            for (var j = 0; j < kernel[0].length; j++) {
                div += kernel[i][j];
            }
        }
    } else {
        throw new Error('Invalid Kernel: ' + kernel);
    }

    for (var x = kWidth; x < this.width - kWidth; x++) {
        for (var y = kHeight; y < this.height - kHeight; y++) {
            sum = 0;
            for (var i = -kWidth; i <= kWidth; i++) {
                for (var j = -kHeight; j <= kHeight; j++) {
                    var kVal = !twoDim ? kernel[(i + kWidth) * kernelWidth + (j + kWidth)] : kernel[kWidth + i][kHeight + j];
                    sum += this.getValueXY(x + i, y + j, 0) * kVal;
                }
            }
            if (div >= 1) newValue = Math.floor(sum / div);else newValue = sum;

            newImage.setValueXY(x, y, 0, newValue);
            if (this.alpha) newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
        }
    }
}

module.exports = exports['default'];

},{"is-integer":5}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = convolutionApply;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _operatorConvolution = require('../operator/convolution');

var _operatorConvolution2 = _interopRequireDefault(_operatorConvolution);

/*
 example of 1x1 kernel:
 kernel = [1];
 example of 2x2 kernel:
 kernel = [1,1,1,1];
 example of 3x3 kernel:
 kernel = [1,1,1,1,-9,1,1,1,1];
 example of 1x3 Kernel:
 kernel = [[-1],[0],[1]];
 example of 3x1 Kernel:
 kernel = [[-1,0,1]];
 example of 3x5 kernel:
 kernel = [[1,1,1],[1,1,1],[1,-15,1],[1,1,1],[1,1,1]];
 example of 5x3 kernel:
 kernel = [[1,1,1,1,1],[1,1,-15,1,1],[1,1,1,1,1]];
 */

function convolutionApply(kernel) {

    this.checkProcessable('convolutionApply', {
        components: [1],
        bitDepth: [8]
    });

    var newImage = _image2['default'].createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    _operatorConvolution2['default'].call(this, newImage, kernel);

    return newImage;
}

module.exports = exports['default'];

},{"../image":52,"../operator/convolution":60}],62:[function(require,module,exports){
// we will create a small image from a mask

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = extract;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

function extract(mask) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$scale = _ref.scale;
    var scale = _ref$scale === undefined ? 1 : _ref$scale;
    var position = _ref.position;

    this.checkProcessable('extract', {
        bitDepth: [8, 16]
    });

    // we need to find the relative position to the parent
    if (!position) {
        position = mask.getRelativePosition(this);
        if (!position) {
            throw new Error('extract : can not extract an image because the relative position can not be' + 'determined, try to specify manualy the position as an array of 2 elements [x,y].');
        }
    }
    var extract = _image2['default'].createFrom(this, {
        width: mask.width,
        height: mask.height,
        alpha: 1, // we force the alpha, otherwise dificult to extract a mask ...
        position: position,
        parent: this
    });

    for (var x = 0; x < mask.width; x++) {
        for (var y = 0; y < mask.height; y++) {
            if (mask.getBitXY(x, y)) {
                for (var channel = 0; channel < this.channels; channel++) {
                    var value = this.getValueXY(x + position[0], y + position[1], channel);
                    extract.setValueXY(x, y, channel, value);
                }
            } else {
                // no match, we make a white transparent
                for (var component = 0; component < this.components; component++) {
                    extract.setValueXY(x, y, component, this.maxValue);
                }
                if (this.alpha) {
                    extract.setValueXY(x, y, this.components, 0);
                }
            }
        }
    }

    return extract;
}

module.exports = exports['default'];

},{"../image":52}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = paintMasks;

var _modelModel = require('../model/model');

function paintMasks(masks) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$color = _ref.color;
    var color = _ref$color === undefined ? [this.maxValue, 0, 0] : _ref$color;

    this.checkProcessable('paintMasks', {
        components: 3,
        bitDepth: [8, 16],
        colorModel: _modelModel.RGB
    });

    if (!Array.isArray(masks)) masks = [masks];

    var numberChannels = Math.min(this.channels, color.length);

    for (var i = 0; i < masks.length; i++) {
        var roi = masks[i];
        // we need to find the parent image to calculate the relative position

        for (var x = 0; x < roi.width; x++) {
            for (var y = 0; y < roi.height; y++) {
                if (roi.getBitXY(x, y)) {
                    for (var channel = 0; channel < numberChannels; channel++) {
                        this.setValueXY(x + roi.position[0], y + roi.position[1], channel, color[channel]);
                    }
                }
            }
        }
    }
}

module.exports = exports['default'];

},{"../model/model":59}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = createROI;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _roi = require('./roi');

var _roi2 = _interopRequireDefault(_roi);

/*
ROI are created from a roiMap
The roiMap contains mainty an array of identifiers that define
for each pixels to which ROI it belongs
 */

function createROI(roiMap) {

    var size = roiMap.total;
    var rois = new Array(size);
    for (var i = 0; i < size; i++) {
        var mapID = -roiMap.negative + i;
        if (i >= roiMap.negative) mapID++;
        rois[i] = new _roi2['default'](roiMap, mapID);
    }
    var pixels = roiMap.pixels;

    var width = roiMap.parent.width;
    var height = roiMap.parent.height;

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var target = y * width + x;
            var mapID = pixels[target] + roiMap.negative;
            if (mapID > roiMap.negative) mapID--;
            if (x < rois[mapID].minX) rois[mapID].minX = x;
            if (x > rois[mapID].maxX) rois[mapID].maxX = x;
            if (y < rois[mapID].minY) rois[mapID].minY = y;
            if (y > rois[mapID].maxY) rois[mapID].maxY = y;
            rois[mapID].meanX += x;
            rois[mapID].meanY += y;
            rois[mapID].surface++;
        }
    }
    for (var i = 0; i < size; i++) {
        var mapID = -roiMap.negative + i;
        if (i >= roiMap.negative) mapID++;
        rois[i].meanX /= rois[i].surface;
        rois[i].meanY /= rois[i].surface;
    }
    return rois;
}

module.exports = exports['default'];

},{"./roi":67}],65:[function(require,module,exports){
/*
We will annotate each point to define to which area it belongs
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = createROIMap;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function createROIMap(mask) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$allowCorner = _ref.allowCorner;
    var allowCorner = _ref$allowCorner === undefined ? false : _ref$allowCorner;

    // based on a binary image we will create plenty of small images
    var pixels = new Int16Array(mask.size); // maxValue: 32767, minValue: -32768

    // split will always return an array of images
    var positiveID = 0;
    var negativeID = 0;

    var MAX_ARRAY = 0x00ffff; // should be enough for most of the cases
    var xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
    var yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

    for (var x = 0; x < mask.width; x++) {
        for (var y = 0; y < mask.height; y++) {
            if (pixels[y * mask.width + x] === 0) {
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
            pixels[currentY * mask.width + currentX] = id;
            // need to check all around mask pixel
            if (currentX > 0 && pixels[currentY * mask.width + currentX - 1] === 0 && mask.getBitXY(currentX - 1, currentY) === targetState) {
                // LEFT
                to++;
                xToProcess[to & MAX_ARRAY] = currentX - 1;
                yToProcess[to & MAX_ARRAY] = currentY;
                pixels[currentY * mask.width + currentX - 1] = -32768;
            }
            if (currentY > 0 && pixels[(currentY - 1) * mask.width + currentX] === 0 && mask.getBitXY(currentX, currentY - 1) === targetState) {
                // TOP
                to++;
                xToProcess[to & MAX_ARRAY] = currentX;
                yToProcess[to & MAX_ARRAY] = currentY - 1;
                pixels[(currentY - 1) * mask.width + currentX] = -32768;
            }
            if (currentX < mask.width - 1 && pixels[currentY * mask.width + currentX + 1] === 0 && mask.getBitXY(currentX + 1, currentY) === targetState) {
                // RIGHT
                to++;
                xToProcess[to & MAX_ARRAY] = currentX + 1;
                yToProcess[to & MAX_ARRAY] = currentY;
                pixels[currentY * mask.width + currentX + 1] = -32768;
            }
            if (currentY < mask.height - 1 && pixels[(currentY + 1) * mask.width + currentX] === 0 && mask.getBitXY(currentX, currentY + 1) === targetState) {
                // BOTTOM
                to++;
                xToProcess[to & MAX_ARRAY] = currentX;
                yToProcess[to & MAX_ARRAY] = currentY + 1;
                pixels[(currentY + 1) * mask.width + currentX] = -32768;
            }
            if (allowCorner) {
                if (currentX > 0 && currentY > 0 && pixels[(currentY - 1) * mask.width + currentX - 1] === 0 && mask.getBitXY(currentX - 1, currentY - 1) === targetState) {
                    // TOP LEFT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX - 1;
                    yToProcess[to & MAX_ARRAY] = currentY - 1;
                    pixels[(currentY - 1) * mask.width + currentX - 1] = -32768;
                }
                if (currentX < mask.width - 1 && currentY > 0 && pixels[(currentY - 1) * mask.width + currentX + 1] === 0 && mask.getBitXY(currentX + 1, currentY - 1) === targetState) {
                    // TOP RIGHT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX + 1;
                    yToProcess[to & MAX_ARRAY] = currentY - 1;
                    pixels[(currentY - 1) * mask.width + currentX + 1] = -32768;
                }
                if (currentX > 0 && currentY < mask.height - 1 && pixels[(currentY + 1) * mask.width + currentX - 1] === 0 && mask.getBitXY(currentX - 1, currentY + 1) === targetState) {
                    // BOTTOM LEFT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX - 1;
                    yToProcess[to & MAX_ARRAY] = currentY + 1;
                    pixels[(currentY + 1) * mask.width + currentX - 1] = -32768;
                }
                if (currentX < mask.width - 1 && currentY < mask.height - 1 && pixels[(currentY + 1) * mask.width + currentX + 1] === 0 && mask.getBitXY(currentX + 1, currentY + 1) === targetState) {
                    // BOTTOM RIGHT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX + 1;
                    yToProcess[to & MAX_ARRAY] = currentY + 1;
                    pixels[(currentY + 1) * mask.width + currentX + 1] = -32768;
                }
            }

            from++;

            if (to - from > MAX_ARRAY) {
                throw new Error('analyseMask can not finish, the array to manage internal data is not big enough.' + 'You could improve mask by changing MAX_ARRAY');
            }
        }
    }

    return new ROIMap(mask, pixels, negativeID, positiveID);
}

var ROIMap = function ROIMap(parent, pixels, negativeID, positiveID) {
    _classCallCheck(this, ROIMap);

    this.parent = parent;
    this.width = parent.width;
    this.height = parent.height;
    this.pixels = pixels; // pixels containing the annotations
    this.negative = -negativeID; // number of negative zones
    this.positive = positiveID; // number of positivie zones
    this.total = positiveID - negativeID; // total number of zones
};

module.exports = exports['default'];

},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _createROIMap = require('./createROIMap');

var _createROIMap2 = _interopRequireDefault(_createROIMap);

var _createROI = require('./createROI');

var _createROI2 = _interopRequireDefault(_createROI);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var ROIManager = (function () {
    function ROIManager(image) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, ROIManager);

        this._image = image;
        this._options = options;
        this._layers = {};
        this._painted = null;
    }

    _createClass(ROIManager, [{
        key: 'putMask',
        value: function putMask(mask) {
            var maskLabel = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var opt = (0, _extend2['default'])({}, this._options, options);
            this._layers[maskLabel] = new ROILayer(mask, opt);
        }
    }, {
        key: 'getROIMap',
        value: function getROIMap() {
            var maskLabel = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];

            if (!this._layers[maskLabel]) return;
            return this._layers[maskLabel].roiMap;
        }
    }, {
        key: 'getROI',
        value: function getROI() {
            var maskLabel = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];

            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref$positive = _ref.positive;
            var positive = _ref$positive === undefined ? true : _ref$positive;
            var _ref$negative = _ref.negative;
            var negative = _ref$negative === undefined ? true : _ref$negative;
            var _ref$minSurface = _ref.minSurface;
            var minSurface = _ref$minSurface === undefined ? 0 : _ref$minSurface;
            var _ref$maxSurface = _ref.maxSurface;
            var maxSurface = _ref$maxSurface === undefined ? Number.POSITIVE_INFINITY : _ref$maxSurface;

            var allROIs = this._layers[maskLabel].roi;
            var rois = new Array(allROIs.length);
            var ptr = 0;
            for (var i = 0; i < allROIs.length; i++) {
                var roi = allROIs[i];
                if ((roi.id < 0 && negative || roi.id > 0 && positive) && roi.surface > minSurface && roi.surface < maxSurface) {
                    rois[ptr++] = roi;
                }
            }
            rois.length = ptr;
            return rois;
        }
    }, {
        key: 'getROIMasks',
        value: function getROIMasks() {
            var maskLabel = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var rois = this.getROI(maskLabel, options);
            var masks = new Array(rois.length);
            for (var i = 0; i < rois.length; i++) {
                masks[i] = rois[i].mask;
            }
            return masks;
        }
    }, {
        key: 'getPixels',
        value: function getPixels() {
            var maskLabel = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (this._layers[maskLabel]) {
                return this._layers[maskLabel].roiMap.pixels;
            }
        }
    }, {
        key: 'paint',
        value: function paint() {
            var maskLabel = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (!this._painted) this._painted = this._image.clone();
            var masks = this.getROIMasks(maskLabel, options);
            this._painted.paintMasks(masks, options);
            return this._painted;
        }
    }, {
        key: 'resetPainted',
        value: function resetPainted() {
            this._painted = undefined;
        }
    }]);

    return ROIManager;
})();

exports['default'] = ROIManager;

var ROILayer = function ROILayer(mask, options) {
    _classCallCheck(this, ROILayer);

    this.mask = mask;
    this.options = options;
    this.roiMap = (0, _createROIMap2['default'])(this.mask, options);
    this.roi = (0, _createROI2['default'])(this.roiMap);
};

module.exports = exports['default'];

},{"./createROI":64,"./createROIMap":65,"extend":4}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _kindNames = require('../kindNames');

var KindNames = _interopRequireWildcard(_kindNames);

var ROI = (function () {
    function ROI(map, id) {
        _classCallCheck(this, ROI);

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

    /* it should really be an array to solve complex cases related to border effect
     Like the image
     0000
     1111
     0000
     1111
    
     The first row of 1 will be surrouned by 2 differents zones
    
     Or even worse
     010
     111
     010
     The cross will be surrouned by 4 differents zones
    
     However in most of the cases it will be an array of one element
     */

    _createClass(ROI, [{
        key: 'extract',
        value: function extract(image) {
            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref$fill = _ref.fill;
            var fill = _ref$fill === undefined ? false : _ref$fill;
            var _ref$scale = _ref.scale;
            var scale = _ref$scale === undefined ? 1 : _ref$scale;

            // we use a slow way

            var mask = undefined;
            if (fill) {
                mask = this.filledMask;
            } else {
                mask = this.mask;
            }

            if (scale < 1) {
                mask = mask.resizeBinary(scale);
            }

            return image.extract(mask);
        }
    }, {
        key: 'width',
        get: function get() {
            return this.maxX - this.minX + 1;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.maxY - this.minY + 1;
        }
    }, {
        key: 'surround',
        get: function get() {
            if (this.computed.surround) return this.computed.surround;
            return this.computed.surround = getSurroundingIDs(this);
        }
    }, {
        key: 'internalMapIDs',
        get: function get() {
            if (this.computed.internalMapIDs) return this.computed.internalMapIDs;
            return this.computed.internalMapIDs = getInternalMapIDs(this);
        }
    }, {
        key: 'external',
        get: function get() {
            // points of the ROI that touch the rectangular shape
            if (this.computed.external) return this.computed.external;
            return this.computed.external = getExternal(this);
        }
    }, {
        key: 'contour',
        get: function get() {
            if (this.computed.contour) return this.computed.contour;
            return this.computed.contour = getContour(this);
        }
    }, {
        key: 'border',
        get: function get() {
            if (this.computed.border) return this.computed.border;
            return this.computed.border = getBorder(this);
        }
    }, {
        key: 'mask',
        get: function get() {
            if (this.computed.mask) return this.computed.mask;

            var img = new _image2['default'](this.width, this.height, {
                kind: KindNames.BINARY,
                position: [this.minX, this.minY],
                parent: this.map.parent
            });

            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    if (this.map.pixels[x + this.minX + (y + this.minY) * this.map.width] === this.id) {
                        img.setBitXY(x, y);
                    }
                }
            }
            return this.computed.mask = img;
        }
    }, {
        key: 'filledMask',
        get: function get() {
            if (this.computed.filledMask) return this.computed.filledMask;

            var img = new _image2['default'](this.width, this.height, {
                kind: KindNames.BINARY,
                position: [this.minX, this.minY],
                parent: this.map.parent
            });

            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var target = x + this.minX + (y + this.minY) * this.map.width;
                    if (this.internalMapIDs.indexOf(this.map.pixels[target]) >= 0) {
                        img.setBitXY(x, y);
                    } // by default a pixel is to 0 so no problems, it will be transparent
                }
            }

            return this.computed.filledMask = img;
        }
    }]);

    return ROI;
})();

exports['default'] = ROI;
function getSurroundingIDs(roi) {
    var surrounding = new Array(1);

    var ptr = 0;
    var roiMap = roi.map;
    var pixels = roiMap.pixels;
    // we check the first line and the last line
    var fromX = Math.max(roi.minX, 1);
    var toX = Math.min(roi.width, roiMap.width - 2);

    // not optimized  if height=1 !
    var _arr = [0, roi.height - 1];
    for (var _i = 0; _i < _arr.length; _i++) {
        var y = _arr[_i];
        for (var x = 0; x < roi.width; x++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (x - roi.minX > 0 && pixels[target] === roi.id && pixels[target - 1] !== roi.id) {
                var value = pixels[target - 1];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
            if (roiMap.width - x - roi.minX > 1 && pixels[target] === roi.id && pixels[target + 1] !== roi.id) {
                var value = pixels[target + 1];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
        }
    }

    // we check the first column and the last column
    var fromY = Math.max(roi.minY, 1);
    var toY = Math.min(roi.height, roiMap.height - 2);
    // not optimized  if width=1 !
    var _arr2 = [0, roi.width - 1];
    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var x = _arr2[_i2];
        for (var y = 0; y < roi.height; y++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (y - roi.minY > 0 && pixels[target] === roi.id && pixels[target - roiMap.width] !== roi.id) {
                var value = pixels[target - roiMap.width];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
            if (roiMap.height - y - roi.minY > 1 && pixels[target] === roi.id && pixels[target + roiMap.width] !== roi.id) {
                var value = pixels[target + roiMap.width];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
        }
    }
    if (surrounding[0] === undefined) return [0];
    return surrounding; // the selection takes the whole rectangle
}

/*
 We get the number of pixels of the ROI that touch the rectangle
 This is useful for the calculation of the border
 because we will ignore those special pixels of the rectangle
 border that don't have neighbourgs all around them.
 */

function getExternal(roi) {
    var total = 0;
    var roiMap = roi.map;
    var pixels = roiMap.pixels;

    var topBottom = [0];
    if (roi.height > 1) topBottom[1] = roi.height - 1;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = topBottom[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var y = _step.value;

            for (var x = 1; x < roi.width - 1; x++) {
                var target = (y + roi.minY) * roiMap.width + x + roi.minX;
                if (pixels[target] === roi.id) {
                    total++;
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var leftRight = [0];
    if (roi.width > 1) leftRight[1] = roi.width - 1;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = leftRight[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var x = _step2.value;

            for (var y = 0; y < roi.height; y++) {
                var target = (y + roi.minY) * roiMap.width + x + roi.minX;
                if (pixels[target] === roi.id) {
                    total++;
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return total;
}

/*
 We will calculate the number of pixels that are involved in border
 Border are all the pixels that touch another "zone". It could be external
 or internal
 All the pixels that touch the box are part of the border and
 are calculated in the getBoxPixels procedure
 */
function getBorder(roi) {
    var total = 0;
    var roiMap = roi.map;
    var pixels = roiMap.pixels;

    for (var x = 1; x < roi.width - 1; x++) {
        for (var y = 1; y < roi.height - 1; y++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] === roi.id) {
                // if a pixel around is not roi.id it is a border
                if (pixels[target - 1] !== roi.id || pixels[target + 1] !== roi.id || pixels[target - roiMap.width] !== roi.id || pixels[target + roiMap.width] !== roi.id) {
                    total++;
                }
            }
        }
    }
    return total + roi.external;
}

/*
 We will calculate the number of pixels that are in the external border
 Contour are all the pixels that touch an external "zone".
 All the pixels that touch the box are part of the border and
 are calculated in the getBoxPixels procedure
 */
function getContour(roi) {
    var total = 0;
    var roiMap = roi.map;
    var pixels = roiMap.pixels;

    for (var x = 1; x < roi.width - 1; x++) {
        for (var y = 1; y < roi.height - 1; y++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] === roi.id) {
                // if a pixel around is not roi.id it is a border
                if (roi.surround.indexOf(pixels[target - 1]) !== -1 || roi.surround.indexOf(pixels[target + 1]) !== -1 || roi.surround.indexOf(pixels[target - roiMap.width]) !== -1 || roi.surround.indexOf(pixels[target + roiMap.width]) !== -1) {
                    total++;
                }
            }
        }
    }
    return total + roi.external;
}

/*
We will calculate all the ids of the map that are "internal"
This will allow to extract the 'plain' image
 */
function getInternalMapIDs(roi) {
    var internal = [roi.id];
    var roiMap = roi.map;
    var pixels = roiMap.pixels;

    if (roi.height > 2) {
        for (var x = 0; x < roi.width; x++) {
            var target = roi.minY * roiMap.width + x + roi.minX;
            if (internal.indexOf(pixels[target]) >= 0) {
                var id = pixels[target + roiMap.width];
                if (internal.indexOf(id) === -1 && roi.surround.indexOf(id) === -1) {
                    internal.push(id);
                }
            }
        }
    }

    var array = new Array(4);
    for (var x = 1; x < roi.width - 1; x++) {
        for (var y = 1; y < roi.height - 1; y++) {
            var target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (internal.indexOf(pixels[target]) >= 0) {
                // we check if one of the neighbour is not yet in

                array[0] = pixels[target - 1];
                array[1] = pixels[target + 1];
                array[2] = pixels[target - roiMap.width];
                array[3] = pixels[target + roiMap.width];

                for (var i = 0; i < 4; i++) {
                    var id = array[i];
                    if (internal.indexOf(id) === -1 && roi.surround.indexOf(id) === -1) {
                        internal.push(id);
                    }
                }
            }
        }
    }

    return internal;
}
module.exports = exports['default'];

},{"../image":52,"../kindNames":54}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = crop;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

function crop() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$x = _ref.x;
    var x = _ref$x === undefined ? 0 : _ref$x;
    var _ref$y = _ref.y;
    var y = _ref$y === undefined ? 0 : _ref$y;
    var _ref$width = _ref.width;
    var width = _ref$width === undefined ? this.width - x : _ref$width;
    var _ref$height = _ref.height;
    var height = _ref$height === undefined ? this.height - y : _ref$height;

    if (x > this.width - 1 || y > this.height - 1) throw new RangeError('origin (' + x + '; ' + y + ') out of range (' + (this.width - 1) + '; ' + (this.height - 1) + ')');
    if (width <= 0 || height <= 0) throw new RangeError('width and height must be positive numbers');
    if (width > this.width - x || height > this.height - y) throw new RangeError('size is out of range');

    var newImage = _image2['default'].createFrom(this, { width: width, height: height });

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

module.exports = exports['default'];

},{"../image":52}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = average;

function average(newImage) {
    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}

module.exports = exports["default"];

},{}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = grey;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../../image');

var _image2 = _interopRequireDefault(_image);

var _modelModel = require('../../model/model');

var _luma709 = require('./luma709');

var _luma7092 = _interopRequireDefault(_luma709);

var _luma601 = require('./luma601');

var _luma6012 = _interopRequireDefault(_luma601);

var _minmax = require('./minmax');

var _minmax2 = _interopRequireDefault(_minmax);

var _maximum = require('./maximum');

var _maximum2 = _interopRequireDefault(_maximum);

var _average = require('./average');

var _average2 = _interopRequireDefault(_average);

function grey() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$algorithm = _ref.algorithm;
    var algorithm = _ref$algorithm === undefined ? 'luma709' : _ref$algorithm;

    if (this.components === 1) {
        return this.clone();
    }

    this.checkProcessable('grey', { colorModel: _modelModel.RGB });

    var newImage = _image2['default'].createFrom(this, {
        components: 1,
        colorModel: null
    });

    switch (algorithm.toLowerCase()) {
        case 'luma709':
            // sRGB
            _luma7092['default'].call(this, newImage);
            break;
        case 'luma601':
            // NTSC
            _luma6012['default'].call(this, newImage);
            break;
        case 'minmax':
            // used in HSL color model
            _minmax2['default'].call(this, newImage);
            break;
        case 'maximum':
            _maximum2['default'].call(this, newImage);
            break;
        case 'average':
            // used in HSI color model
            _average2['default'].call(this, newImage);
            break;
        default:
            throw new Error('Unsupported grey algorithm: ' + algorithm);
    }

    return newImage;
}

module.exports = exports['default'];

},{"../../image":52,"../../model/model":59,"./average":69,"./luma601":71,"./luma709":72,"./maximum":73,"./minmax":74}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = luma601;

function luma601(newImage) {
    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = this.data[i] * 0.299 + this.data[i + 1] * 0.587 + this.data[i + 2] * 0.114;
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}

module.exports = exports["default"];

},{}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = luma709;

function luma709(newImage) {
    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = this.data[i] * 0.2126 + this.data[i + 1] * 0.7152 + this.data[i + 2] * 0.0722;
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}

module.exports = exports["default"];

},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = maximum;

function maximum(newImage) {
    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = Math.max(this.data[i], this.data[i + 1], this.data[i + 2]);
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}

module.exports = exports["default"];

},{}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = minmax;

function minmax(newImage) {
    var ptr = 0;
    for (var i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = (Math.max(this.data[i], this.data[i + 1], this.data[i + 2]) + Math.min(this.data[i], this.data[i + 1], this.data[i + 2])) / 2;
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}

module.exports = exports["default"];

},{}],75:[function(require,module,exports){
// http://www.easyrgb.com/index.php?X=MATH&H=18#text18
// check rgbToHsl : https://bgrins.github.io/TinyColor/docs/tinycolor.html

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = hsv;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelModel = require('../model/model');

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

function hsv() {
    this.checkProcessable('hsv', {
        bitDepth: [8, 16],
        dimension: 2,
        alpha: [0, 1],
        colorModel: [_modelModel.RGB]

    });

    var newImage = _image2['default'].createFrom(this, {
        colorModel: _modelModel.HSL
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

module.exports = exports['default'];

},{"../image":52,"../model/model":59}],76:[function(require,module,exports){
// based on https://bgrins.github.io/TinyColor/docs/tinycolor.html

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = hsv;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelModel = require('../model/model');

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

function hsv() {
    this.checkProcessable('hsv', {
        bitDepth: [8, 16],
        dimension: 2,
        alpha: [0, 1],
        colorModel: [_modelModel.RGB]

    });

    var newImage = _image2['default'].createFrom(this, {
        colorModel: _modelModel.HSV
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

module.exports = exports['default'];

},{"../image":52,"../model/model":59}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mask;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../../image');

var _image2 = _interopRequireDefault(_image);

var _percentile = require('./percentile');

var _percentile2 = _interopRequireDefault(_percentile);

/*
 Creation of binary mask is based on the determination of a threshold
 You may either choose among the provided algorithm or just specify a threshold value
 If the algorithm is a number, it is the threshold value
 */

function mask() {
    var algorithm = arguments.length <= 0 || arguments[0] === undefined ? 0.5 : arguments[0];

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$useAlpha = _ref.useAlpha;
    var useAlpha = _ref$useAlpha === undefined ? true : _ref$useAlpha;
    var _ref$invert = _ref.invert;
    var invert = _ref$invert === undefined ? false : _ref$invert;

    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8]
    });

    var threshold = 0;

    if (typeof algorithm === 'number') {
        threshold = algorithm * this.maxValue;
    } else {
        var histogram = this.getHistogram();
        switch (algorithm.toLowerCase()) {
            case 'percentile':
                threshold = (0, _percentile2['default'])(histogram);
                break;
            default:
                throw new Error('mask transform unknown algorithm: ' + algorithm);
        }
    }

    var newImage = new _image2['default'](this.width, this.height, {
        kind: 'BINARY',
        parent: this
    });

    var ptr = 0;
    if (this.alpha && useAlpha) {
        for (var i = 0; i < this.data.length; i += this.channels) {
            var value = this.data[i] + (this.maxValue - this.data[i]) * (this.maxValue - this.data[i + 1]) / this.maxValue;
            if (invert && value >= threshold || !invert && value <= threshold) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    } else {
        for (var i = 0; i < this.data.length; i += this.channels) {
            if (invert && this.data[i] <= threshold || !invert && this.data[i] >= threshold) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    }

    return newImage;
}

module.exports = exports['default'];

},{"../../image":52,"./percentile":78}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = percentile;

function percentile(histogram) {
    // See http://imagej.nih.gov/ij/download/tools/source/ij/process/AutoThresholder.java
    // W. Doyle, "Operation useful for similarity-invariant pattern recognition,"
    // Journal of the Association for Computing Machinery, vol. 9,pp. 259-267, 1962.
    // ported to ImageJ plugin by G.Landini from Antti Niemisto's Matlab code (GPL)
    // Original Matlab code Copyright (C) 2004 Antti Niemisto
    // See http://www.cs.tut.fi/~ant/histthresh/ for an excellent slide presentation
    // and the original Matlab code.

    var threshold = -1;
    var percentile = 0.5; // default fraction of foreground pixels
    var avec = new Float32Array(256);

    var total = partialSum(histogram, histogram.lengh);
    var temp = 1.0;
    for (var i = 1; i < histogram.length; i++) {
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
    for (var i = 0; i < endIndex; i++) {
        x += histogram[i];
    }
    return x;
}
module.exports = exports["default"];

},{}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = pad;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

var _utilityCopy = require('../utility/copy');

var _utilityCopy2 = _interopRequireDefault(_utilityCopy);

function pad() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$size = _ref.size;
    var size = _ref$size === undefined ? 0 : _ref$size;
    var _ref$algorithm = _ref.algorithm;
    var algorithm = _ref$algorithm === undefined ? 'copy' : _ref$algorithm;
    var color = _ref.color;

    this.checkProcessable('pad', {
        bitDepth: [8, 16],
        dimension: 2
    });

    if (algorithm === 'set') {
        if (color.length !== this.channels) {
            throw new Error('pad: the color array must have the same length as the number of channels. Here: ' + this.channels);
        }
        for (var i = 0; i < color.length; i++) {
            if (color[i] === 0) color[i] = 0.001;
        }
    } else {
        color = (0, _newArray2['default'])(this.channels, null);
    }

    if (!Array.isArray(size)) {
        size = [size, size];
    }

    var newWidth = this.width + size[0] * 2;
    var newHeight = this.height + size[1] * 2;
    var channels = this.channels;

    var newImage = _image2['default'].createFrom(this, { width: newWidth, height: newHeight });

    (0, _utilityCopy2['default'])(this, newImage, size[0], size[1]);

    for (var i = size[0]; i < newWidth - size[0]; i++) {
        for (var k = 0; k < channels; k++) {
            var value = color[k] || newImage.data[(size[1] * newWidth + i) * channels + k];
            for (var j = 0; j < size[1]; j++) {
                newImage.data[(j * newWidth + i) * channels + k] = value;
            }
            value = color[k] || newImage.data[((newHeight - size[1] - 1) * newWidth + i) * channels + k];
            for (var j = newHeight - size[1]; j < newHeight; j++) {
                newImage.data[(j * newWidth + i) * channels + k] = value;
            }
        }
    }

    for (var j = 0; j < newHeight; j++) {
        for (var k = 0; k < channels; k++) {
            var value = color[k] || newImage.data[(j * newWidth + size[0]) * channels + k];
            for (var i = 0; i < size[0]; i++) {
                newImage.data[(j * newWidth + i) * channels + k] = value;
            }
            value = color[k] || newImage.data[(j * newWidth + newWidth - size[0] - 1) * channels + k];
            for (var i = newWidth - size[0]; i < newWidth; i++) {
                newImage.data[(j * newWidth + i) * channels + k] = value;
            }
        }
    }

    return newImage;
}

module.exports = exports['default'];

},{"../image":52,"../utility/copy":84,"new-array":17}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = resizeBinary;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _kindNames = require('../kindNames');

var KindNames = _interopRequireWildcard(_kindNames);

// This is a temporary code that should be placed in the more generate resize method
// it only works for scaled down !

function resizeBinary() {
    var scale = arguments.length <= 0 || arguments[0] === undefined ? 0.5 : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.checkProcessable('resizeBinary', {
        bitDepth: [1],
        dimension: 2
    });

    var width = Math.floor(this.width * scale);
    var height = Math.floor(this.height * scale);
    var shiftX = Math.round((this.width - width) / 2);
    var shiftY = Math.round((this.height - height) / 2);

    var newImage = _image2['default'].createFrom(this, {
        kind: KindNames.BINARY,
        width: width,
        height: height,
        position: [shiftX, shiftY]
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

module.exports = exports['default'];

},{"../image":52,"../kindNames":54}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = nearestNeighbor;

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

module.exports = exports["default"];

},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = scale;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../../image');

var _image2 = _interopRequireDefault(_image);

var _nearestNeighbor = require('./nearestNeighbor');

var _nearestNeighbor2 = _interopRequireDefault(_nearestNeighbor);

var _utilityConverter = require('../../utility/converter');

function scale() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$width = _ref.width;
    var width = _ref$width === undefined ? this.width : _ref$width;
    var _ref$height = _ref.height;
    var height = _ref$height === undefined ? this.height : _ref$height;
    var _ref$factor = _ref.factor;
    var factor = _ref$factor === undefined ? 1 : _ref$factor;
    var _ref$algorithm = _ref.algorithm;
    var algorithm = _ref$algorithm === undefined ? 'nearestNeighbor' : _ref$algorithm;

    var _factorDimensions = (0, _utilityConverter.factorDimensions)(factor, width, height);

    var newWidth = _factorDimensions.width;
    var newHeight = _factorDimensions.height;

    var newImage = _image2['default'].createFrom(this, { width: newWidth, height: newHeight });

    switch (algorithm.toLowerCase()) {
        case 'nearestneighbor':
        case 'nearestneighbour':
            _nearestNeighbor2['default'].call(this, newImage, newWidth, newHeight);
            break;
        default:
            throw new Error('Unsupported scale algorithm: ' + algorithm);
    }

    return newImage;
}

module.exports = exports['default'];

},{"../../image":52,"../../utility/converter":83,"./nearestNeighbor":81}],83:[function(require,module,exports){
/**
 * Converts a factor value to a number between 0 and 1
 * @param value
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getFactor = getFactor;
exports.factorDimensions = factorDimensions;

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

function factorDimensions(factor, width, height) {
    factor = getFactor(factor);
    return {
        width: Math.round(factor * width),
        height: Math.round(factor * height)
    };
}

},{}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = copyImage;

function copyImage(fromImage, toImage, x, y) {
    var fromWidth = fromImage.width;
    var fromHeight = fromImage.height;
    var toWidth = toImage.width;
    var toHeight = toImage.height;
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

module.exports = exports["default"];

},{}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = match;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError('Cannot destructure undefined'); }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

var _matrix = require('./matrix');

var _matrix2 = _interopRequireDefault(_matrix);

// Try to match the current pictures with another one

function match(image) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _objectDestructuringEmpty(_ref);

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

    // there could be many algorithms
    var similarityMatrix = new _matrix2['default'](image.width, image.height, -Infinity);

    var currentX = Math.floor(image.width / 2);
    var currentY = Math.floor(image.height / 2);
    var middleX = currentX;
    var middleY = currentY;
    var theEnd = false;

    while (!theEnd) {
        var toCalculatePositions = similarityMatrix.localSearch(currentX, currentY, -Infinity);
        for (var i = 0; i < toCalculatePositions.length; i++) {
            var position = toCalculatePositions[i];
            var similarity = this.getSimilarity(image, { shift: [middleX - position[0], middleY - position[1]] });
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

    return [currentX - middleX, currentY - middleY];
}

module.exports = exports['default'];

},{"../image":52,"./matrix":88,"new-array":17}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = getChannel;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _miscValidateChannel = require('../misc/validateChannel');

var _miscValidateChannel2 = _interopRequireDefault(_miscValidateChannel);

function getChannel(channel) {

    this.checkProcessable('getChannel', {
        bitDepth: [8, 16]
    });

    channel = (0, _miscValidateChannel2['default'])(this, channel);

    var newImage = _image2['default'].createFrom(this, {
        components: 1,
        alpha: false,
        colorModel: null
    });
    var ptr = 0;
    for (var j = channel; j < this.data.length; j += this.channels) {
        newImage.data[ptr++] = this.data[j];
    }

    return newImage;
}

module.exports = exports['default'];

},{"../image":52,"../misc/validateChannel":58}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = overlap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _miscValidateArrayOfChannels = require('../misc/validateArrayOfChannels');

var _miscValidateArrayOfChannels2 = _interopRequireDefault(_miscValidateArrayOfChannels);

var _newArray = require('new-array');

var _newArray2 = _interopRequireDefault(_newArray);

// Try to match the current pictures with another one

// if normalize we normalize separately the 2 images

function overlap(image) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$shift = _ref.shift;
    var shift = _ref$shift === undefined ? [0, 0] : _ref$shift;
    var average = _ref.average;
    var channels = _ref.channels;
    var defaultAlpha = _ref.defaultAlpha;
    var normalize = _ref.normalize;

    this.checkProcessable('overlap', {
        bitDepth: [8, 16]
    });

    channels = (0, _miscValidateArrayOfChannels2['default'])(this, { channels: channels, defaultAlpha: defaultAlpha });

    if (this.bitDepth !== image.bitDepth) {
        throw new Error('Both images must have the same bitDepth');
    }
    if (this.channels !== image.channels) {
        throw new Error('Both images must have the same number of channels');
    }
    if (this.colorModel !== image.colorModel) {
        throw new Error('Both images must have the same colorModel');
    }

    if (typeof average === 'undefined') average = true;

    // we allow a shift
    // we need to find the minX, maxX, minY, maxY
    var minX = Math.max(0, -shift[0]);
    var maxX = Math.min(this.width, this.width - shift[0]);
    var minY = Math.max(0, -shift[1]);
    var maxY = Math.min(this.height, this.height - shift[1]);

    var results = (0, _newArray2['default'])(channels.length, 0);
    for (var i = 0; i < channels.length; i++) {
        var c = channels[i];
        var sumThis = normalize ? this.sum[c] : Math.max(this.sum[c], image.sum[c]);
        var sumImage = normalize ? image.sum[c] : Math.max(this.sum[c], image.sum[c]);

        if (sumThis !== 0 && sumImage !== 0) {
            for (var x = minX; x < maxX; x++) {
                for (var y = minY; y < maxY; y++) {
                    var indexThis = x * this.multipliers[0] + y * this.multipliers[1] + c;
                    var indexImage = indexThis + shift[0] * this.multipliers[0] + shift[1] * this.multipliers[1];
                    results[i] += Math.min(this.data[indexThis] / sumThis, image.data[indexImage] / sumImage);
                }
            }
        }
    }

    if (average) {
        return results.reduce(function (sum, x) {
            return sum + x;
        }) / results.length;
    }

    return results;
}

module.exports = exports['default'];

},{"../image":52,"../misc/validateArrayOfChannels":57,"new-array":17}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = Matrix;

function Matrix(width, height, defaultValue) {
    var matrix = new Array(width);
    for (var x = 0; x < width; x++) {
        matrix[x] = new Array(height);
    }
    if (defaultValue) {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                matrix[x][y] = defaultValue;
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
module.exports = exports["default"];

},{}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = setChannel;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

var _miscValidateChannel = require('../misc/validateChannel');

var _miscValidateChannel2 = _interopRequireDefault(_miscValidateChannel);

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

    channel = (0, _miscValidateChannel2['default'])(this, channel);

    var ptr = channel;
    for (var i = 0; i < image.data.length; i++) {
        this.data[ptr] = image.data[i];
        ptr += this.channels;
    }
}

module.exports = exports['default'];

},{"../image":52,"../misc/validateChannel":58}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = split;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _image = require('../image');

var _image2 = _interopRequireDefault(_image);

function split() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
            var newImage = _image2['default'].createFrom(this, {
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
        for (var i = 0; i < this.channels; i++) {
            var newImage = _image2['default'].createFrom(this, {
                components: 1,
                alpha: false,
                colorModel: null
            });
            var ptr = 0;
            for (var j = 0; j < data.length; j += this.channels) {
                newImage.data[ptr++] = data[j + i];
            }
            images.push(newImage);
        }
    }

    return images;
}

module.exports = exports['default'];

},{"../image":52}]},{},[52])(52)
});