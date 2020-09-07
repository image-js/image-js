import binary from 'test/binary';

describe('Roi fillRatio', function () {
  it('no holes', function () {
    const mask = binary`
    00000
    01110
    01110
    01110
    00000
  `;

    let roiManager = mask.getRoiManager();
    roiManager.fromMask(mask);
    let firstRoi = roiManager.getRois()[0];

    expect(firstRoi.fillRatio).toBe(1);
  });

  it('one hole', function () {
    const mask = binary`
    00000
    01110
    01010
    01110
    00000
  `;

    let roiManager = mask.getRoiManager();
    roiManager.fromMask(mask);
    let firstRoi = roiManager.getRois()[0];

    expect(firstRoi.fillRatio).toBe(8 / 9);
  });

  it('two holes', function () {
    const mask = binary`
    01111
    01001
    01111
    01011
    01111
  `;

    let roiManager = mask.getRoiManager();
    roiManager.fromMask(mask);
    let firstRoi = roiManager.getRois()[0];

    expect(firstRoi.fillRatio).toBe(17 / 20);
  });
});
