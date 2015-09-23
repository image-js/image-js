'use strict';

const ITER = 10000;

var height = 4000;
var width = 4000;
var pixels = width * height;
var channels = 4;
var data8 = new Uint8Array(pixels * channels);
var data16 = new Uint16Array(pixels * channels);

var newWidth = 30;
var newHeight = 30;
var newPixels = newWidth * newHeight;
var x = 1000;
var y = 1000;

var dataUint8 = new Array(channels);

for (var i = 0; i < channels; i++) {
    var arr = new Uint8Array(pixels);
    dataUint8[i] = arr;
    for (var j = 0; j < pixels; j++) {
        arr[j] = data8[j * channels + i];
    }
}

var dataUint16 = new Array(channels);

for (var i = 0; i < channels; i++) {
    var arr = new Uint16Array(pixels);
    dataUint16[i] = arr;
    for (var j = 0; j < pixels; j++) {
        arr[j] = data16[j * channels + i];
    }
}

var matrixA8 = new Array(channels);

for (var i = 0; i < channels; i++) {
    var matrix = new Array(width);
    matrixA8[i] = matrix;
    for (var j = 0; j < width; j++) {
        var col = new Array(height);
        matrix[j] = col;
        for (var k = 0; k < height; k++) {
            col[k] = data8[(width * j + k) * channels + i];
        }
    }
}

var matrixA16 = new Array(channels);

for (var i = 0; i < channels; i++) {
    var matrix = new Array(width);
    matrixA16[i] = matrix;
    for (var j = 0; j < width; j++) {
        var col = new Array(height);
        matrix[j] = col;
        for (var k = 0; k < height; k++) {
            col[k] = data16[(width * j + k) * channels + i];
        }
    }
}

var matrixU8 = new Array(channels);

for (var i = 0; i < channels; i++) {
    var matrix = new Array(width);
    matrixU8[i] = matrix;
    for (var j = 0; j < width; j++) {
        var col = new Uint8Array(height);
        matrix[j] = col;
        for (var k = 0; k < height; k++) {
            col[k] = data8[(width * j + k) * channels + i];
        }
    }
}

var matrixU16 = new Array(channels);

for (var i = 0; i < channels; i++) {
    var matrix = new Array(width);
    matrixU16[i] = matrix;
    for (var j = 0; j < width; j++) {
        var col = new Uint16Array(height);
        matrix[j] = col;
        for (var k = 0; k < height; k++) {
            col[k] = data16[(width * j + k) * channels + i];
        }
    }
}


test('Uint8Array', function() {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }

    var y1 = y + newHeight;

    var ptr = 0;
    for (var i = y; i < y1; i++) {
        var j = i * width + x;
        var jL = j + newWidth;
        for (; j < jL; j++) {
            for (var c = 0; c < channels; c++){
                newData[c][ptr] = dataUint8[c][j];
                ptr++;
            }
        }
    }
});

test('Uint16Array', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint16Array(newPixels);
    }

    var y1 = y + newHeight;

    var ptr = 0;
    for (var i = y; i < y1; i++) {
        var j = i * width + x;
        var jL = j + newWidth;
        for (; j < jL; j++) {
            for (var c = 0; c < channels; c++){
                newData[c][ptr] = dataUint16[c][j];
                ptr++;
            }
        }
    }
});

//test('Matrix of Uint8Arrays', function () {
//    var newData = new Array(channels);
//
//    for (var i = 0; i < channels; i++) {
//        var matrix = new Array(width);
//        newData[i] = matrix;
//        for (var j = 0; j < width; j++) {
//            matrix[j] = new Uint8Array(height);
//        }
//    }
//
//    var ptrX = 0;
//    for (var i = x; i < (x + newWidth); i++) {
//        var ptrY = 0;
//        for (var j = y; j < (y + newHeight); j++) {
//            for (var c = 0; c < channels; c++) {
//                newData[c][ptrX][ptrY] = matrixU8[c][i][j];
//            }
//            ptrY++;
//        }
//        ptrX++;
//    }
//})
//
//test('Matrix of Uint16Arrays', function () {
//    var newData = new Array(channels);
//
//    for (var i = 0; i < channels; i++) {
//        var matrix = new Array(width);
//        newData[i] = matrix;
//        for (var j = 0; j < width; j++) {
//            matrix[j] = new Uint16Array(height);
//        }
//    }
//
//    var ptrX = 0;
//    for (var i = x; i < (x + newWidth); i++) {
//        var ptrY = 0;
//        for (var j = y; j < (y + newHeight); j++) {
//            for (var c = 0; c < channels; c++) {
//                newData[c][ptrX][ptrY] = matrixU16[c][i][j];
//            }
//            ptrY++;
//        }
//        ptrX++;
//    }
//});
//
//test('Matrix of Uint8Arrays iter on newArray', function () {
//    var newData = new Array(channels);
//
//    for (var i = 0; i < channels; i++) {
//        var matrix = new Array(width);
//        newData[i] = matrix;
//        for (var j = 0; j < width; j++) {
//            matrix[j] = new Uint8Array(height);
//        }
//    }
//
//
//    for (var i = 0; i < newWidth; i++) {
//        for (var j = 0; j < newHeight; j++) {
//            for (var c = 0; c < channels; c++) {
//                newData[c][i][j] = matrixU8[c][x+i][y+j];
//            }
//        }
//    }
//});

test('Matrix of Uint8Arrays outer channel loop', function () {
    var newData = new Array(channels);

    for (var i = 0; i < channels; i++) {
        var matrix = new Array(newWidth);
        newData[i] = matrix;
        for (var j = 0; j < newWidth; j++) {
            matrix[j] = new Uint8Array(newHeight);
        }
    }

    for (var c = 0; c < channels; c++) {
        for (var i = 0; i < newWidth; i++) {
            for (var j = 0; j < newHeight; j++) {
                newData[c][i][j] = matrixU8[c][x+i][y+j];
            }
        }
    }
})

test('Uint8Array outer channel loop', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }

    var y1 = y + newHeight;

    for (var c = 0; c < channels; c++){
        var ptr = 0;
        for (var i = y; i < y1; i++) {
            var j = i * width + x;
            var jL = j + newWidth;
            for (; j < jL; j++) {
                newData[c][ptr++] = dataUint8[c][j];
            }
        }
    }
})

test('Uint8ClampedArray outer channel loop', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8ClampedArray(newPixels);
    }

    var y1 = y + newHeight;

    for (var c = 0; c < channels; c++){
        var ptr = 0;
        for (var i = y; i < y1; i++) {
            var j = i * width + x;
            var jL = j + newWidth;
            for (; j < jL; j++) {
                newData[c][ptr++] = dataUint16[c][j];
            }
        }
    }
})

test('Uint16Array outer channel loop', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint16Array(newPixels);
    }

    var y1 = y + newHeight;

    for (var c = 0; c < channels; c++){
        var ptr = 0;
        for (var i = y; i < y1; i++) {
            var j = i * width + x;
            var jL = j + newWidth;
            for (; j < jL; j++) {
                newData[c][ptr++] = dataUint16[c][j];
            }
        }
    }
})

test('Array outer channel loop', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Array(newPixels);
    }

    var y1 = y + newHeight;

    for (var c = 0; c < channels; c++){
        var ptr = 0;
        for (var i = y; i < y1; i++) {
            var j = i * width + x;
            var jL = j + newWidth;
            for (; j < jL; j++) {
                newData[c][ptr++] = dataUint8[c][j];
            }
        }
    }
})

test('Uint8Array outer channel loop more complex', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }

    for (var c = 0; c < channels; c++) {
        var ptr=0;
        for (var i = 0; i < newWidth; i++) {
            for (var j = 0; j < newHeight; j++) {
                newData[c][ptr++] = dataUint8[c][(i+y) * width + x + j];
            }
        }
    }
})

test('Uint8Array outer channel loop with definition', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }

    var y1 = y + newHeight;

    for (var c = 0; c < channels; c++){
        var ptr = 0;
        var channel=newData[c];
        var dataChannel=dataUint8[c];
        for (var i = y; i < y1; i++) {
            var j = i * width + x;
            var jL = j + newWidth;
            for (; j < jL; j++) {
                channel[ptr++] = dataChannel[j];
            }
        }
    }
})

test('Uint8Array outer channel loop more complex with definition', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }

    for (var c = 0; c < channels; c++) {
        var ptr=0;
        var channel=newData[c];
        var dataChannel=dataUint8[c];
        for (var i = 0; i < newWidth; i++) {
            for (var j = 0; j < newHeight; j++) {
                channel[ptr++] = dataChannel[(i+y) * width + x + j];
            }
        }
    }
})

test('matrix outer channel uint8', function () {
    var newData = new Array(channels);

    for (var i = 0; i < channels; i++) {
        var matrix = new Array(newWidth);
        newData[i] = matrix;
        for (var j = 0; j < newWidth; j++) {
            matrix[j] = new Uint8Array(newHeight);
        }
    }

    for (var c = 0; c < channels; c++) {
        var newDataChannel=newData[c];
        var matrixChannel=matrixU8[c];
        for (var i = 0; i < newWidth; i++) {
            var newDataRow=newDataChannel[i];
            var matrixRow=matrixChannel[x+i];
            for (var j = 0; j < newHeight; j++) {
                newDataRow[j] = matrixRow[y+j];
            }
        }
    }
})

test('getValue / setValue', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }
    for (var c = 0; c < channels; c++) {
        for (var i = 0; i < newWidth; i++) {
            for (var j = 0; j < newHeight; j++) {
                setValue(newData[c], i, j, getValue(dataUint8[c], x+i, y+j));
            }
        }
    }
})

test('getValue / setValue cached channel', function () {
    var newData = new Array(channels);
    for (var i = 0; i < channels; i++) {
        newData[i] = new Uint8Array(newPixels);
    }
    for (var c = 0; c < channels; c++) {
        var nC = newData[c];
        var oC = dataUint8[c];
        for (var i = 0; i < newWidth; i++) {
            for (var j = 0; j < newHeight; j++) {
                setValue(nC, i, j, getValue(oC, x+i, y+j));
            }
        }
    }
})

test('Uint8Array original', function() {
    var newData = new Uint8Array(newPixels * channels);

    var xWidth = newWidth * channels;
    var y1 = y + newHeight;

    var ptr = 0; // pointer for new array

    var jLeft = x * channels;

    for (var i = y; i < y1; i++) {
        var j = (i * width * channels) + jLeft;
        var jL = j + xWidth;
        for (; j < jL; j++) {
            newData[ptr++] = data8[j];
        }
    }
});

function setValue(data, i, j, value) {
    data[j * newWidth + i] = value;
}

function getValue(data, i, j) {
    return data[j * newWidth + i];
}

function test(name, func) {
    func();func();func();
    var start = process.hrtime();
    for (var i = 0; i < ITER; i++) {
        func();
    }
    var result = process.hrtime(start);
 //   console.log('\n');
    console.log(`${name} took ${result[0]}s and ${result[1]/1000/1000}ms`);
}
