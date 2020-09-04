import binary from 'test/binary';

describe('Roi holes', function () {
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

    expect(firstRoi.holesInfo).toStrictEqual({ number: 0, surface: 0 });
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

    expect(firstRoi.holesInfo).toStrictEqual({ number: 1, surface: 1 });
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

    expect(firstRoi.holesInfo).toStrictEqual({ number: 2, surface: 3 });
  });
});
