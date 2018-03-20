import { Image } from 'test/common';

import { validateArrayOfChannels } from '../channel';

describe('we check the validateArrayOfChannels method', function () {
  it('check for a RGB image', function () {
    let image = new Image(2, 2, {
      kind: 'RGB'
    });

    expect(validateArrayOfChannels(image, {
      channels: ['r', 'g', 'b'] })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { channels: 'r' })).toEqual([0]);
    expect(validateArrayOfChannels(image, { channels: 'b' })).toEqual([2]);
    expect(validateArrayOfChannels(image, { channels: 1 })).toEqual([1]);
    expect(validateArrayOfChannels(image, { channels: [0, 1, 2] })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image)).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: true })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: false })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { defaultAlpha: true })).toEqual([0, 1, 2]);
    expect(function () {
      validateArrayOfChannels(image, { channels: 'a' });
    }).toThrowError(/does not contain alpha/);
    expect(function () {
      validateArrayOfChannels(image, { channels: ['r', 'a'] });
    }).toThrowError(/does not contain alpha/);
  });

  it('check for a RGBA image', function () {
    let image = new Image(2, 2, {
      kind: 'RGBA'
    });

    expect(validateArrayOfChannels(image, { channels: ['r', 'g', 'b'] })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { channels: 'r' })).toEqual([0]);
    expect(validateArrayOfChannels(image, { channels: 'b' })).toEqual([2]);
    expect(validateArrayOfChannels(image, { channels: 1 })).toEqual([1]);
    expect(validateArrayOfChannels(image, { channels: [0, 1, 2] })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image)).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { defaultAlpha: true })).toEqual([0, 1, 2, 3]);
    expect(validateArrayOfChannels(image, { defaultAlpha: false })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: true, defaultAlpha: false })).toEqual([0, 1, 2]);
    expect(validateArrayOfChannels(image, { allowAlpha: true, defaultAlpha: true })).toEqual([0, 1, 2, 3]);
    expect(validateArrayOfChannels(image, { channels: 'a' })).toEqual([3]);
    expect(validateArrayOfChannels(image, { channels: ['r', 'a'] })).toEqual([0, 3]);
    expect(function () {
      validateArrayOfChannels(image, { channels: 'a', allowAlpha: false });
    }).toThrowError(/alpha channel may not be selected/);
  });

  it('check for a GreyA image', function () {
    let image = new Image(2, 2, {
      kind: 'GREYA'
    });

    expect(validateArrayOfChannels(image, { channels: 'a' })).toEqual([1]);
    expect(validateArrayOfChannels(image, { channels: 1 })).toEqual([1]);
    expect(validateArrayOfChannels(image)).toEqual([0]);
    expect(validateArrayOfChannels(image, { defaultAlpha: true })).toEqual([0, 1]);
    expect(validateArrayOfChannels(image, { defaultAlpha: false })).toEqual([0]);
    expect(function () {
      validateArrayOfChannels(image, { channels: ['r'] });
    }).toThrowError(/undefined channel/);
    expect(function () {
      validateArrayOfChannels(image, { allowAlpha: false, channels: ['a'] });
    }).toThrowError(/alpha channel may not be selected/);
  });
});

