import { createAffineTransformModel } from '../createAffineTransformModel';

test('wrong nb of parameters', () => {
  expect(() => {
    createAffineTransformModel([1, 1, 1, 1, 1]);
  }).toThrow('Transform had wrong number of parameters');
});
