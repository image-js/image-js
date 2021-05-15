'use strict';

const ITER = 10000;

let height = 4000;
let width = 4000;
let pixels = width * height;
let channels = 4;
let data8 = new Uint8Array(pixels * channels);
let data16 = new Uint16Array(pixels * channels);

let newWidth = 30;
let newHeight = 30;
let newPixels = newWidth * newHeight;
let x = 1000;
let y = 1000;

let dataUint8 = new Array(channels);

for (var i = 0; i < channels; i++) {
  var arr = new Uint8Array(pixels);
  dataUint8[i] = arr;
  for (var j = 0; j < pixels; j++) {
    arr[j] = data8[j * channels + i];
  }
}

let dataUint16 = new Array(channels);

for (var i = 0; i < channels; i++) {
  var arr = new Uint16Array(pixels);
  dataUint16[i] = arr;
  for (var j = 0; j < pixels; j++) {
    arr[j] = data16[j * channels + i];
  }
}

let matrixA8 = new Array(channels);

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

let matrixA16 = new Array(channels);

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

let matrixU8 = new Array(channels);

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

let matrixU16 = new Array(channels);

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

test('Uint8Array', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }

  let y1 = y + newHeight;

  let ptr = 0;
  for (var i = y; i < y1; i++) {
    let j = i * width + x;
    let jL = j + newWidth;
    for (; j < jL; j++) {
      for (let c = 0; c < channels; c++) {
        newData[c][ptr] = dataUint8[c][j];
        ptr++;
      }
    }
  }
});

test('Uint16Array', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint16Array(newPixels);
  }

  let y1 = y + newHeight;

  let ptr = 0;
  for (var i = y; i < y1; i++) {
    let j = i * width + x;
    let jL = j + newWidth;
    for (; j < jL; j++) {
      for (let c = 0; c < channels; c++) {
        newData[c][ptr] = dataUint16[c][j];
        ptr++;
      }
    }
  }
});

// test('Matrix of Uint8Arrays', function () {
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
// })
//
// test('Matrix of Uint16Arrays', function () {
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
// });
//
// test('Matrix of Uint8Arrays iter on newArray', function () {
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
// });

test('Matrix of Uint8Arrays outer channel loop', function () {
  let newData = new Array(channels);

  for (var i = 0; i < channels; i++) {
    let matrix = new Array(newWidth);
    newData[i] = matrix;
    for (var j = 0; j < newWidth; j++) {
      matrix[j] = new Uint8Array(newHeight);
    }
  }

  for (let c = 0; c < channels; c++) {
    for (var i = 0; i < newWidth; i++) {
      for (var j = 0; j < newHeight; j++) {
        newData[c][i][j] = matrixU8[c][x + i][y + j];
      }
    }
  }
});

test('Uint8Array outer channel loop', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }

  let y1 = y + newHeight;

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    for (var i = y; i < y1; i++) {
      let j = i * width + x;
      let jL = j + newWidth;
      for (; j < jL; j++) {
        newData[c][ptr++] = dataUint8[c][j];
      }
    }
  }
});

test('Uint8ClampedArray outer channel loop', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8ClampedArray(newPixels);
  }

  let y1 = y + newHeight;

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    for (var i = y; i < y1; i++) {
      let j = i * width + x;
      let jL = j + newWidth;
      for (; j < jL; j++) {
        newData[c][ptr++] = dataUint16[c][j];
      }
    }
  }
});

test('Uint16Array outer channel loop', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint16Array(newPixels);
  }

  let y1 = y + newHeight;

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    for (var i = y; i < y1; i++) {
      let j = i * width + x;
      let jL = j + newWidth;
      for (; j < jL; j++) {
        newData[c][ptr++] = dataUint16[c][j];
      }
    }
  }
});

test('Array outer channel loop', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Array(newPixels);
  }

  let y1 = y + newHeight;

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    for (var i = y; i < y1; i++) {
      let j = i * width + x;
      let jL = j + newWidth;
      for (; j < jL; j++) {
        newData[c][ptr++] = dataUint8[c][j];
      }
    }
  }
});

test('Uint8Array outer channel loop more complex', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    for (var i = 0; i < newWidth; i++) {
      for (let j = 0; j < newHeight; j++) {
        newData[c][ptr++] = dataUint8[c][(i + y) * width + x + j];
      }
    }
  }
});

test('Uint8Array outer channel loop with definition', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }

  let y1 = y + newHeight;

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    let channel = newData[c];
    let dataChannel = dataUint8[c];
    for (var i = y; i < y1; i++) {
      let j = i * width + x;
      let jL = j + newWidth;
      for (; j < jL; j++) {
        channel[ptr++] = dataChannel[j];
      }
    }
  }
});

test('Uint8Array outer channel loop more complex with definition', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }

  for (let c = 0; c < channels; c++) {
    let ptr = 0;
    let channel = newData[c];
    let dataChannel = dataUint8[c];
    for (var i = 0; i < newWidth; i++) {
      for (let j = 0; j < newHeight; j++) {
        channel[ptr++] = dataChannel[(i + y) * width + x + j];
      }
    }
  }
});

test('matrix outer channel uint8', function () {
  let newData = new Array(channels);

  for (var i = 0; i < channels; i++) {
    let matrix = new Array(newWidth);
    newData[i] = matrix;
    for (var j = 0; j < newWidth; j++) {
      matrix[j] = new Uint8Array(newHeight);
    }
  }

  for (let c = 0; c < channels; c++) {
    let newDataChannel = newData[c];
    let matrixChannel = matrixU8[c];
    for (var i = 0; i < newWidth; i++) {
      let newDataRow = newDataChannel[i];
      let matrixRow = matrixChannel[x + i];
      for (var j = 0; j < newHeight; j++) {
        newDataRow[j] = matrixRow[y + j];
      }
    }
  }
});

test('getValue / setValue', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }
  for (let c = 0; c < channels; c++) {
    for (var i = 0; i < newWidth; i++) {
      for (let j = 0; j < newHeight; j++) {
        setValue(newData[c], i, j, getValue(dataUint8[c], x + i, y + j));
      }
    }
  }
});

test('getValue / setValue cached channel', function () {
  let newData = new Array(channels);
  for (var i = 0; i < channels; i++) {
    newData[i] = new Uint8Array(newPixels);
  }
  for (let c = 0; c < channels; c++) {
    let nC = newData[c];
    let oC = dataUint8[c];
    for (var i = 0; i < newWidth; i++) {
      for (let j = 0; j < newHeight; j++) {
        setValue(nC, i, j, getValue(oC, x + i, y + j));
      }
    }
  }
});

test('Uint8Array original', function () {
  let newData = new Uint8Array(newPixels * channels);

  let xWidth = newWidth * channels;
  let y1 = y + newHeight;

  let ptr = 0; // pointer for new array

  let jLeft = x * channels;

  for (let i = y; i < y1; i++) {
    let j = i * width * channels + jLeft;
    let jL = j + xWidth;
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
  func();
  func();
  func();
  let start = process.hrtime();
  for (let i = 0; i < ITER; i++) {
    func();
  }
  let result = process.hrtime(start);
  //   console.log('\n');
  console.log(`${name} took ${result[0]}s and ${result[1] / 1000 / 1000}ms`);
}
