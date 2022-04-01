import { RoiKind } from '../../RoiManager';
import { RoisColorMode } from '../../colorRois';
import { maxNumberRois, colorMapCenter } from '../constants';
import { getColorMap } from '../getColorMap';

describe('getBinaryMap', () => {
  it('binary, BW', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
    });

    expect(colorMap).toHaveLength(maxNumberRois);
    expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff); // red
    expect(colorMap[colorMapCenter + 1]).toBe(0xff00ff00); // green
  });

  it('binary, WHITE', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap[colorMapCenter - 1]).toBe(0);
    expect(colorMap[colorMapCenter + 1]).toBe(0xff00ff00);
  });
  it('binary, BLACK', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.BLACK,
    });

    expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff);
    expect(colorMap[colorMapCenter + 1]).toBe(0);
  });

  it('SATURATION, 1 negative and 1 positive ROIs', () => {
    const colorMap = getColorMap({
      mode: RoisColorMode.SATURATION,
      nbNegative: 1,
      nbPositive: 1,
    });

    expect(colorMap[colorMapCenter - 1]).toBe(0xffff0000); // blue
    expect(colorMap[colorMapCenter + 1]).toBe(0xff0000ff); // red
  });
  it('RAINBOW, 1 negative and 2 positive ROIs, WHITE', () => {
    const colorMap = getColorMap({
      mode: RoisColorMode.RAINBOW,
      nbNegative: 1,
      nbPositive: 2,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap[colorMapCenter - 1]).toBe(0); // transparent
    expect(colorMap[colorMapCenter + 1]).toBe(0xff0000ff); // red
    expect(colorMap[colorMapCenter + 2]).toBe(0xffffff00); // turquoise
  });
  it('RAINBOW, 1 negative and 2 positive ROIs, BLACK', () => {
    const colorMap = getColorMap({
      mode: RoisColorMode.RAINBOW,
      nbNegative: 1,
      nbPositive: 2,
      roiKind: RoiKind.BLACK,
    });

    expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff);
    expect(colorMap[colorMapCenter + 1]).toBe(0);
    expect(colorMap[colorMapCenter + 2]).toBe(0);
  });
  it('RAINBOW, 1 negative and 1 positive ROIs, BW', () => {
    const colorMap = getColorMap({
      mode: RoisColorMode.RAINBOW,
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.BW,
    });

    expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff);
    expect(colorMap[colorMapCenter + 1]).toBe(0xffffff00);
    expect(colorMap[colorMapCenter + 2]).toBe(0);
  });
});
