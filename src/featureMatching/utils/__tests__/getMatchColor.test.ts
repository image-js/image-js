import { Image } from '../../../Image';
import { Match } from '../../matching/bruteForceMatch';
import { getColors } from '../getColors';
import { getMatchColor } from '../getMatchColor';

test('matches should all have a different color', () => {
  const image = new Image(5, 5);
  const matches: Match[] = [
    { sourceIndex: 0, destinationIndex: 0, distance: 0 },
    { sourceIndex: 0, destinationIndex: 0, distance: 1 },
    { sourceIndex: 0, destinationIndex: 0, distance: 2 },
    { sourceIndex: 0, destinationIndex: 0, distance: 3 },
    { sourceIndex: 0, destinationIndex: 0, distance: 4 },
  ];

  const colors = getColors(image, [255, 0, 0], { nbShades: 5 });

  let result = [];
  for (let i = 0; i < matches.length; i++) {
    result.push(getMatchColor(matches, i, colors));
  }
  expect(result).toStrictEqual(colors);
});
