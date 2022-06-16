/**
 * The QP card reference values in the L*a*b* format
 */

import { LabColor } from 'colord';

export interface QpCardColor {
  name: string;
  lab: LabColor;
  row: number;
  column: number;
}

export type QpCard = QpCardColor[];

export const ReferenceQpCard = [
  { name: 'Cyan', lab: { l: 51.9, a: -31.8, b: -50.4 }, row: 0, column: 0 },
  { name: 'P.485', lab: { l: 54.2, a: 67.5, b: 40.3 }, row: 0, column: 1 },
  { name: 'P.130', lab: { l: 79.1, a: 20.0, b: 69.1 }, row: 0, column: 2 },
  { name: 'P.477', lab: { l: 33.5, a: 15.2, b: 12.5 }, row: 0, column: 3 },
  { name: 'P.7451', lab: { l: 64.7, a: -4.7, b: -28.0 }, row: 0, column: 4 },
  { name: 'Magenta', lab: { l: 50.0, a: 73.8, b: 4.1 }, row: 1, column: 0 },
  { name: 'P.361', lab: { l: 56.4, a: -48.2, b: 41.8 }, row: 1, column: 1 },
  { name: 'P.520', lab: { l: 29.5, a: 28.2, b: -18.4 }, row: 1, column: 2 },
  { name: 'P.575', lab: { l: 48.3, a: -11.0, b: 30.9 }, row: 1, column: 3 },
  { name: 'P.710', lab: { l: 56.3, a: 56.6, b: 27.2 }, row: 1, column: 4 },
  { name: 'Yellow', lab: { l: 91.7, a: -5.4, b: 80.6 }, row: 2, column: 0 },
  {
    name: 'Reflex Blue',
    lab: { l: 23.3, a: 24.2, b: -68.1 },
    row: 2,
    column: 1,
  },
  { name: 'P.646', lab: { l: 54.7, a: -7.3, b: -24.2 }, row: 2, column: 2 },
  { name: 'P.151', lab: { l: 72.6, a: 44.7, b: 64.0 }, row: 2, column: 3 },
  { name: 'White', lab: { l: 97.7, a: -1.0, b: 0.1 }, row: 2, column: 4 },
  { name: 'Black', lab: { l: 16.7, a: -2.2, b: 2.0 }, row: 3, column: 0 },
  { name: 'P.CG 10', lab: { l: 43.8, a: -0.8, b: -0.8 }, row: 3, column: 1 },
  { name: 'P.CG 8', lab: { l: 60.6, a: -0.5, b: -2.0 }, row: 3, column: 2 },
  { name: 'P.CG 5', lab: { l: 72.6, a: -1.0, b: 0.6 }, row: 3, column: 3 },
  { name: 'P.CG 2', lab: { l: 86.1, a: -1.7, b: 3.0 }, row: 3, column: 4 },
];
