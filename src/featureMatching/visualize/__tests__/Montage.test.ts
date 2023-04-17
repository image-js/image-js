import { Image } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { FastKeypoint } from '../../keypoints/getFastKeypoints';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { bruteForceOneMatch, Match } from '../../matching/bruteForceMatch';
import { Montage } from '../Montage';

const source = testUtils.load('featureMatching/alphabet.jpg');
const grey = source.convertColor('GREY');
const sourceKeypoints = getOrientedFastKeypoints(grey);

describe('constructor', () => {
  it(' scale = 3', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const montage = new Montage(source, source, { scale: 3 });
    expect(montage.height).toBe(3 * source.height);
  });
  it('disposition vertical', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const montage = new Montage(source, source, {
      disposition: 'vertical',
    });
    expect(montage.image).toMatchImageSnapshot();
  });
  it('should error when scale is not an integer', () => {
    expect(() => {
      new Montage(source, source, { scale: 1.5 });
    }).toThrow('scale must be an integer');
  });
  it('invalid disposition type', () => {
    expect(() => {
      // @ts-expect-error: invalid disposition type
      new Montage(source, source, { disposition: 'test' });
    }).toThrow('invalid disposition type: test');
  });
});

describe('drawKeypoints', () => {
  it('default options', () => {
    const montage = new Montage(source, source);
    montage.drawKeypoints(sourceKeypoints);

    expect(montage.image).toMatchImageSnapshot();
  });
  it('scale = 2', () => {
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
  it('simple test', () => {
    const image = new Image(100, 50, { colorModel: 'GREY' });
    const keypoint: FastKeypoint[] = [
      { origin: { column: 20, row: 10 }, score: 0 },
    ];
    const matches: Match[] = [
      { sourceIndex: 0, destinationIndex: 0, distance: 0 },
    ];

    const montage = new Montage(image, image, {
      disposition: 'vertical',
    });
    montage.drawMatches(matches, keypoint, keypoint);

    expect(montage.image).toMatchImageSnapshot();
  });
  it('scale = 2', () => {
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
