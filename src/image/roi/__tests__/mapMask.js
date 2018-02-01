import { Image } from 'test/common';

import { desc as sortDesc } from 'num-sort';

describe('map a binary image (mask) 2 x 2', function () {
  let imageData = new Uint8Array(1);
  imageData[0] = 192;

  let img = new Image(2, 2, imageData, {
    kind: 'BINARY'
  });

  let roiManager = img.getRoiManager();
  roiManager.fromMask(img);
  let data = roiManager.getData();
  let result = roiManager.getMap();

  data.sort(sortDesc);

  it('should have 4 data in 2 zones', function () {
    expect(data).toBeInstanceOf(Int16Array);
    expect(data).toHaveLength(4);
    expect(data[0]).toBe(1);
    expect(data[1]).toBe(1);
    expect(data[2]).toBe(-1);
    expect(data[3]).toBe(-1);
  });

  it('should have 2 zones, one positive, one negative', function () {
    expect(result.total).toBe(2);
    expect(result.negative).toBe(1);
    expect(result.positive).toBe(1);
  });
});

describe('map a binary image 4 x 4 in 2 zones', function () {
  let imageData = new Uint8Array(2);
  imageData[0] = 255;
  imageData[1] = 0;

  let img = new Image(4, 4, imageData, {
    kind: 'BINARY'
  });

  let roiManager = img.getRoiManager();
  roiManager.fromMask(img);
  let data = roiManager.getData();
  let result = roiManager.getMap();

  it('should have 16 data in 2 zones', function () {
    expect(data).toBeInstanceOf(Int16Array);
    expect(data).toHaveLength(16);
    expect(data[0]).toBe(1);
    expect(data[7]).toBe(1);
    expect(data[8]).toBe(-1);
    expect(data[15]).toBe(-1);
  });

  it('should have 2 zones, one positive, one negative', function () {
    expect(result.total).toBe(2);
    expect(result.negative).toBe(1);
    expect(result.positive).toBe(1);
  });
});

describe('map a binary image 4 x 4 in 3 zones', function () {
  let imageData = new Uint8Array(2);
  imageData[0] = 63;
  imageData[1] = 192;

  let img = new Image(4, 4, imageData, {
    kind: 'BINARY'
  });

  let roiManager = img.getRoiManager();
  roiManager.fromMask(img);
  let data = roiManager.getData();
  let result = roiManager.getMap();

  it('should have 16 data in 3 zones', function () {
    expect(data).toBeInstanceOf(Int16Array);
    expect(data).toHaveLength(16);
    expect(data[0]).toBe(-1);
    expect(data[1]).toBe(-1);
    expect(data[2]).toBe(1);
    expect(data[9]).toBe(1);
    expect(data[10]).toBe(-2);
    expect(data[15]).toBe(-2);
  });

  it('should have 3 zones, one positive, two negative', function () {
    expect(result.total).toBe(3);
    expect(result.negative).toBe(2);
    expect(result.positive).toBe(1);
  });
});
