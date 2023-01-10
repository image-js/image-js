import { Image } from '../../../Image';
import { getScoreColors } from '../getScoreColors';

test('generate 10 blue shades', () => {
  const side = 100;
  const image = new Image(side, side);

  const nbShades = 10;
  const colors = getScoreColors(image, [0, 0, 255], { nbShades });

  for (let i = 0; i < nbShades; i++) {
    image.drawRectangle({
      origin: { column: (i * side) / nbShades, row: 0 },
      width: side / nbShades,
      height: side,
      fillColor: colors[i],
      strokeColor: colors[i],
      out: image,
    });
  }

  expect(image).toMatchImageSnapshot();
});

test('generate 5 yellow shades', () => {
  const side = 100;
  const image = new Image(side, side);

  const nbShades = 5;
  const colors = getScoreColors(image, [255, 255, 0], { nbShades });

  for (let i = 0; i < nbShades; i++) {
    image.drawRectangle({
      origin: { column: (i * side) / nbShades, row: 0 },
      width: side / nbShades,
      height: side,
      fillColor: colors[i],
      strokeColor: colors[i],
      out: image,
    });
  }

  expect(image).toMatchImageSnapshot();
});
