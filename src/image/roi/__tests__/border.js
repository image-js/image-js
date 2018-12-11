import { load } from 'test/common';

/* Image to test:
0011
1111
1100
0000
 */
describe('we check that each Roi is surrounded by the expected border', function () {
  it('should yield the right contours size', async () => {
    const img = await load('BW11x11.png');
    expect(img.width).toBe(11);
    expect(img.height).toBe(11);

    let roiManager = img.getRoiManager();
    let mask = img.grey().mask({ invert: true });
    roiManager.fromMask(mask);

    let rois = roiManager.getRois();

    rois.sort((a, b) => a.border - b.border);

    expect(rois).toBeInstanceOf(Array);
    expect(rois).toHaveLength(4);

    check(rois[0], { externalIDs: [-1], surface: 1, external: 1, box: 1, border: 1 });
    check(rois[1], { externalIDs: [1], surface: 9, external: 8, box: 8, border: 8 });
    check(rois[2], { externalIDs: [2], surface: 39, external: 39, box: 39, border: 39 });
    check(rois[3], { externalIDs: [-1], surface: 72, external: 32, box: 32, border: 44 });
  });
});

function check(roi, values) {
  for (let prop in values) {
    expect(roi[prop]).toStrictEqual(values[prop]);
  }
}
