/* eslint-disable */
'use strict';

class Standard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.array = new Uint32Array(x * y);
  }

  addOne() {
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        this.array[y + x * this.y]++;
      }
    }
  }
}

class Iterator {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.array = new Uint32Array(x * y);
  }

  addOne() {
    for (const { x, y } of this.keys()) {
      this.array[y + x * this.y]++;
    }
  }

  *keys() {
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        yield { x, y };
      }
    }
  }
}

const standard = new Standard(10, 15);
const iterator = new Iterator(10, 15);

// warm up
for (let i = 0; i < 1000; i++) {
  standard.addOne();
  // iterator.addOne();
}
return;
test('standard', standard);
test('iterator', iterator);

function test(name, fun) {
  console.time(name);
  for (let i = 0; i < 1e6; i++) {
    fun.addOne();
  }
  console.timeEnd(name);
}
