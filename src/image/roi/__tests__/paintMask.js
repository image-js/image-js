import { Image } from 'test/common';

describe('we check paint mask', function () {
  const data = [
    0, 0, 0, 0, 0,
    0, 1, 1, 1, 0,
    0, 1, 1, 1, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 0
  ];
  let image = new Image(5, 5, data, { kind: 'GREY' });

  let mask = image.mask({ threshold: 1, algorithm: 'threshold' });
  let roiManager = image.getRoiManager();
  roiManager.fromMask(mask, { positive: true, negative: false });

  it('should yield the right painted images for box', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({ color: 'red', kind: 'box', positive: true, negative: false });
    expect(Array.from(painted.getChannel(0).data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 255, 255, 255, 0,
      0, 255, 1, 255, 0,
      0, 255, 255, 255, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right painted images for filled', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({ color: 'red', kind: 'filled', positive: true, negative: false });
    expect(Array.from(painted.getChannel(0).data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 255, 255, 255, 0,
      0, 255, 255, 255, 0,
      0, 255, 255, 255, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right painted images for contour', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({ color: 'red', kind: 'contour', positive: true, negative: false });
    expect(Array.from(painted.getChannel(0).data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 255, 255, 255, 0,
      0, 255, 1, 255, 0,
      0, 255, 255, 255, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right painted images for center', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({ color: 'red', kind: 'center', positive: true, negative: false });
    expect(Array.from(painted.getChannel(0).data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 1, 255, 1, 0,
      0, 255, 255, 255, 0,
      0, 1, 255, 1, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right painted images for normal', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({ color: 'red', positive: true, negative: false });
    expect(Array.from(painted.getChannel(0).data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 255, 255, 255, 0,
      0, 255, 255, 255, 0,
      0, 255, 255, 255, 0,
      0, 0, 0, 0, 0
    ]);
  });
});

describe.skip('we check paint mask and draw label', function () {
  // Only run on macOS. Other platforms don't have the Georgia font.
  const _it = process.platform === 'darwin' ? it : it.skip;

  let image = new Image(100, 100, { kind: 'GREY' });
  image.setPixelXY(10, 50, [1]);
  image.setPixelXY(50, 50, [1]);
  image.setPixelXY(80, 50, [1]);

  let mask = image.mask({ threshold: 1, algorithm: 'threshold' });
  let roiManager = image.getRoiManager();
  roiManager.fromMask(mask, { positive: true, negative: false });

  _it('should yield the right painted images with label', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({
      positive: true,
      negative: false,
      labelProperty: 'id',
      labelFont: '1pt Georgia'
    });

    expect(painted.toDataURL()).toBe(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAACxklEQVR4nO3XwYtNYRzG8e+5GcRmklJqdgopY0ySotmxkKLYKOUfGBtWs1BWFpJYUChTQhllMSsLxUJKNuMPsGCUFVGDpPuzOO/UmWtk3mPOvc/cnk+9NfdtzvueOd9pzjsFEJiMVq9vwBZyEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHETMqnqXHQcKYGo572WZjADHgI3AO+Au8KEL++4GjgCb0743gE+1VoqljwcBMwERcDHjum6N8YBXAdsDBgOuBHwL2NvwvmcDngQMBWwKmA6YTV9nr5d7wdoU5IJAgOpoBXwJmKrMrQtoBzxscN81AT8CblbmDqRnNJG9Xs0/WaTrlbSBx8Dzytz8Pa5ucN+fwDTwdJF929mr/UcQRac7Pp+ifDi3G9wzgBMdc0cp3yOT2av1WZB564EJ4BBwkIW/vU26DuwCvgL7gI/ZK/ThsfckcA94AeyhezEA7gOXgM/AS2A0e4WC7JfBYNrwMnAue8PmDAC3gG3AHf78sR5R9xiarwW8BeaAHdlXZ5wCrga8TieI7+lEMyxwwiJgS7qvv42dDe27IeBwQNEx/yzg1yLz/xxL+8bo+QPXvL9rjKfgI5X5VsD7gDd11uz9w1zZYzjKfz5H0+ci4HzAXMBY9np9esrqphlgP3CG8pU8QHm62grMZq9W46VuTerDY+/K5iBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIuY38OBJEXqeWI0AAAAASUVORK5CYII='
    );
  });

  _it('should yield the right painted images with surface', function () {
    roiManager.resetPainted();
    let painted = roiManager.paint({
      positive: true,
      negative: false,
      labelProperty: 'surface',
      labelColor: 'red',
      labelFont: '1pt Georgia'
    });

    expect(painted.toDataURL()).toBe(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAABiklEQVR4nO3cMUrEcBBG8S+yxRbeRfAsa+GxPIXFXsVmT7NgMzY2dslmwjzw/SCkSZiBV/xTZUlSEcbT9AL6yyAwBoExCIxBYAwCYxAYg8AYBMYgMAaBMQiMQWAMAmMQGIPAGATGIDAGgTEIjEFgDAJjEBiDwBgExiAwBoExCIxBYAwCYxAYg8AYBMYgMAaBMQiMQWAMAmMQGIPAPBTkkuSteZFOU/t1zN0U5DPJLck1yevOwUeY2q9z7mnLw+9JzknuSb53Dj7C1H6dcx8+Q+g/SJnab+9cD3UYg8AYBGZzkPPv/bl5kS5T+3XOrbXXR1JfSVVS96SuSb1seP/oa2q/zrmrP3srybL24QFT+3XPXcL/gv1XPNRhDAJjEBiDwBgExiAwBoExCIxBYAwCYxAYg8AYBMYgMAaBMQiMQWAMAmMQGIPAGATGIDAGgTEIjEFgDAJjEBiDwBgExiAwBoExCIxBYAwCYxAYg8AYBMYgMAaBMQiMQWAMAmMQGIPAGATGIDAGgTEIzA8y4okT4WIwMwAAAABJRU5ErkJggg=='
    );
  });
});
