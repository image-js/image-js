
export const DISCRETE_LAPLACE_4 = [
  [0,  1, 0],
  [1, -4, 1],
  [0,  1, 0]
];

export const DISCRETE_LAPLACE_8 = [
  [1,  1, 1],
  [1, -8, 1],
  [1,  1, 1]
];


export const SOBEL_X = [
  [-1, 0, +1],
  [-2, 0, +2],
  [-1, 0, +1]
];

export const SOBEL_Y = [
  [-1, -2, -1],
  [0,  0,  0],
  [+1, +2, +1]
];

export const SCHARR_X = [
  [3, 0, -3],
  [10, 0, -10],
  [3, 0, -3]
];

export const SCHARR_Y = [
  [3, 10, 3],
  [0, 0, 0],
  [-3, -10, -3]
];

export const SECOND_DERIVATIVE = [
  [-1, -2,  0,  2,  1],
  [-2, -4,  0,  4,  2],
  [0,  0,  0,  0,  0],
  [1,  2,  0, -2, -1],
  [2,  4,  0, -4, -2]
];

export const SECOND_DERIVATIVE_INV = [
  [1,  2,  0, -2, -1],
  [2,  4,  0, -4, -2],
  [0,  0,  0,  0,  0],
  [-2, -4,  0,  4,  2],
  [-1, -2,  0,  2,  1]
];
