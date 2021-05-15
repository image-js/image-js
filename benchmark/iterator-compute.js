/* eslint-disable */
'use strict';

class Standard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  computeSum() {
    let sum = 0;
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        sum += x * y;
      }
    }
    return sum;
  }
}

class Iterator {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  computeSum() {
    let sum = 0;
    for (const { x, y } of this.keys()) {
      sum += x * y;
    }
    return sum;
  }

  *keys() {
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        yield { x, y };
      }
    }
  }
}

class Iterator2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  computeSum() {
    let sum = 0;
    for (const { x, y } of this.keys()) {
      sum += x * y;
    }
    return sum;
  }

  keys() {
    return {
      [Symbol.iterator]: () => {
        let x = 0,
          y = 0;
        return {
          next: () => {
            if (y === this.y) {
              y = 0;
              x++;
            }
            if (x === this.x) return { done: true };
            return { done: false, value: { x, y: y++ } };
          },
        };
      },
    };
  }
}

const standard = new Standard(10, 15);
const iterator = new Iterator(10, 15);
const iterator2 = new Iterator2(10, 15);

// warm up
for (let i = 0; i < 1000; i++) {
  standard.computeSum();
  iterator.computeSum();
  iterator2.computeSum();
}

// check result
if (standard.computeSum() !== 4725)
  throw new Error('wrong value: ' + standard.computeSum());
if (iterator.computeSum() !== 4725)
  throw new Error('wrong value: ' + iterator.computeSum());
if (iterator2.computeSum() !== 4725)
  throw new Error('wrong value: ' + iterator2.computeSum());

test('standard', standard);
test('iterator', iterator);
test('iterator2', iterator2);

function test(name, fun) {
  console.time(name);
  for (let i = 0; i < 1e6; i++) {
    fun.computeSum();
  }
  console.timeEnd(name);
}
