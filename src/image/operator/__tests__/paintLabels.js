import { Image } from 'test/common';

describe.skip('paintLabels', function () {
  it('should yield the painted image', function () {
    let image = new Image(150, 150, { kind: 'RGBA' });
    let labels = ['1', '2'];
    let positions = [[20, 20], [40, 20]];
    image.paintLabels(labels, positions);

    labels = ['A', 'B', 'C', 'D', 'E'];
    positions = [[20, 50], [40, 50], [60, 50], [80, 50], [100, 50]];
    let options = {
      font: ['20px helvetica', '18px times', '26px arial'],
      colors: ['red', 'pink', [0, 255, 0, 255], 'blue', 'orange'],
      rotate: [0, 90, -90, 60, -60]
    };
    image.paintLabels(labels, positions, options);

    labels = ['H', 'I', 'J', 'K', 'L'];
    positions = [[20, 100], [45, 100], [70, 100], [95, 100], [120, 100]];
    options = {
      font: '26px arial',
      rotate: [0, 3, -3, 6, -6]
    };
    image.paintLabels(labels, positions, options);

    // how to have any test that can work on travis ?
    let means = image.mean;
    expect(means[0]).toBeGreaterThan(0);
    expect(means[1]).toBeGreaterThan(0);
    expect(means[2]).toBeGreaterThan(0);
    // image.save('test.png');
  });
});

