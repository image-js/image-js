import { describe, expect, it } from 'vitest';

import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors.js';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints.js';
import { bruteForceOneMatch } from '../../matching/bruteForceMatch.js';
import { Montage } from '../Montage.js';

const source = testUtils.load('featureMatching/alphabet.jpg');
const grey = source.convertColor('GREY');
const sourceKeypoints = getOrientedFastKeypoints(grey);

describe('constructor', () => {
  it('default options', () => {
    expect(new Montage(source, source).width).toBe(2 * source.width);
  });

  it('should error when scale is not an integer', () => {
    expect(() => {
      return new Montage(source, source, { scale: 1.5 });
    }).toThrow('scale must be an integer');
  });

  it('invalid disposition type', () => {
    expect(() => {
      // @ts-expect-error: invalid disposition type
      return new Montage(source, source, { disposition: 'test' });
    }).toThrow('invalid disposition type: test');
  });
});

describe('drawKeypoints', () => {
  it('scale = 2', { timeout: 20_000 }, () => {
    const montage = new Montage(source, source, { scale: 2 });
    montage.drawKeypoints(sourceKeypoints);

    expect(montage.image).toMatchImageSnapshot();
  });

  it('disposition vertical', () => {
    const montage = new Montage(source, source, {
      disposition: 'vertical',
    });
    montage.drawKeypoints(sourceKeypoints, {
      origin: montage.destinationOrigin,
    });

    expect(montage.image).toMatchImageSnapshot();
  });
});

describe('drawMatches', () => {
  it('scale = 2', { timeout: 20_000 }, () => {
    const brief = getBriefDescriptors(grey, sourceKeypoints);

    const matches = bruteForceOneMatch(brief.descriptors, brief.descriptors);

    const montage = new Montage(source, source, { scale: 2 });
    montage.drawMatches(matches, brief.keypoints, brief.keypoints);

    expect(montage.image).toMatchImageSnapshot();
    expect(montage.height).toBe(2 * source.height);
  });

  it('disposition vertical', () => {
    const brief = getBriefDescriptors(grey, sourceKeypoints);
    const matches = bruteForceOneMatch(brief.descriptors, brief.descriptors);

    const montage = new Montage(source, source, {
      disposition: 'vertical',
    });
    montage.drawMatches(matches, brief.keypoints, brief.keypoints);

    expect(montage.image).toMatchImageSnapshot();
  });
});
