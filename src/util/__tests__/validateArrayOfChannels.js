import { Image } from 'test/common';

import { validateArrayOfChannels } from '../channel';

describe('we check the validateArrayOfChannels method', function () {
  it('check for a RGB image', function () {
    let image = new Image(2, 2, {
      kind: 'RGB'
    });

    expect(validateArrayOfChannels(image, {
      channels: ['r', 'g', 'b'] })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { channels: 'r' })).toStrictEqual([0]);
    expect(validateArrayOfChannels(image, { channels: 'b' })).toStrictEqual([2]);
    expect(validateArrayOfChannels(image, { channels: 1 })).toStrictEqual([1]);
    expect(validateArrayOfChannels(image, { channels: [0, 1, 2] })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image)).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: true })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: false })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { defaultAlpha: true })).toStrictEqual([0, 1, 2]);
    expect(function () {
      validateArrayOfChannels(image, { channels: 'a' });
    }).toThrow(/does not contain alpha/);
    expect(function () {
      validateArrayOfChannels(image, { channels: ['r', 'a'] });
    }).toThrow(/does not contain alpha/);
  });

  it('check for a RGBA image', function () {
    let image = new Image(2, 2, {
      kind: 'RGBA'
    });

    expect(validateArrayOfChannels(image, { channels: ['r', 'g', 'b'] })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { channels: 'r' })).toStrictEqual([0]);
    expect(validateArrayOfChannels(image, { channels: 'b' })).toStrictEqual([2]);
    expect(validateArrayOfChannels(image, { channels: 1 })).toStrictEqual([1]);
    expect(validateArrayOfChannels(image, { channels: [0, 1, 2] })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image)).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { defaultAlpha: true })).toStrictEqual([0, 1, 2, 3]);
    expect(validateArrayOfChannels(image, { defaultAlpha: false })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: true, defaultAlpha: false })).toStrictEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: true, defaultAlpha: true })).toStrictEqual([0, 1, 2, 3]);
    expect(validateArrayOfChannels(image, { channels: 'a' })).toStrictEqual([3]);
    expect(validateArrayOfChannels(image, { channels: ['r', 'a'] })).toStrictEqual([0, 3]);
    expect(function () {
      validateArrayOfChannels(image, { channels: 'a', allowAlpha: false });
    }).toThrow(/alpha channel may not be selected/);
  });

  it('check for a GreyA image', function () {
    let image = new Image(2, 2, {
      kind: 'GREYA'
    });

    expect(validateArrayOfChannels(image, { channels: 'a' })).toStrictEqual([1]);
    expect(validateArrayOfChannels(image, { channels: 1 })).toStrictEqual([1]);
    expect(validateArrayOfChannels(image)).toStrictEqual([0]);
    expect(validateArrayOfChannels(image, { defaultAlpha: true })).toStrictEqual([0, 1]);
    expect(validateArrayOfChannels(image, { defaultAlpha: false })).toStrictEqual([0]);
    expect(function () {
      validateArrayOfChannels(image, { channels: ['r'] });
    }).toThrow(/undefined channel/);
    expect(function () {
      validateArrayOfChannels(image, { allowAlpha: false, channels: ['a'] });
    }).toThrow(/alpha channel may not be selected/);
  });
});

