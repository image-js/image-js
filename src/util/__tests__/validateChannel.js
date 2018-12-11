import { Image } from 'test/common';

import { validateChannel } from '../channel';

describe('we check the validateChannel method', function () {
  it('check for a RGB image', function () {
    let image = new Image(2, 2, {
      kind: 'RGB'
    });

    expect(validateChannel(image, 'r')).toBe(0);
    expect(validateChannel(image, 'g')).toBe(1);
    expect(validateChannel(image, 'b')).toBe(2);
    expect(function () {
      validateChannel(image, 'a');
    }).toThrow(/does not contain alpha/);
    expect(function () {
      validateChannel(image);
    }).toThrow(/the channel has to be/);
    expect(function () {
      validateChannel(image, 3, false);
    }).toThrow(/the channel has to be/);
  });

  it('check for a RGBA image', function () {
    let image = new Image(2, 2, {
      kind: 'RGBA'
    });

    expect(validateChannel(image, 'r')).toBe(0);
    expect(validateChannel(image, 'g')).toBe(1);
    expect(validateChannel(image, 'b')).toBe(2);
    expect(validateChannel(image, 'a')).toBe(3);
    expect(function () {
      validateChannel(image);
    }).toThrow(/the channel has to be/);
    expect(function () {
      validateChannel(image, 3, false);
    }).toThrow(/alpha channel may not be/);
  });

  it('check for a GreyA image', function () {
    let image = new Image(2, 2, {
      kind: 'GREYA'
    });

    expect(validateChannel(image, 0)).toBe(0);
    expect(validateChannel(image, 1)).toBe(1);
    expect(validateChannel(image, 'a')).toBe(1);
    expect(validateChannel(image, 'a', true)).toBe(1);
    expect(function () {
      validateChannel(image, 'r');
    }).toThrow(/undefined channel/);
    expect(function () {
      validateChannel(image, 1, false);
    }).toThrow(/alpha channel may not/);
    expect(function () {
      validateChannel(image, 'a', false);
    }).toThrow(/alpha channel may not/);
  });
});

