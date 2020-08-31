import binary from 'test/binary';

describe('Roi external', function () {
  it('should yield the right boxIDs', function () {
    const mask = binary`
    00000
    01110
    01100
    00010
    00000
  `;

    let roiManager = mask.getRoiManager();
    roiManager.fromMask(mask);

    let firstRoi = roiManager.getRois()[0];
    expect(firstRoi.external).toBe(5);

    let secondRoi = roiManager.getRois()[1];
    expect(secondRoi.external).toBe(1);
  });
});
