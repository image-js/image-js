import { Roi } from './Roi.js';
import type { RoiMapManager } from './RoiMapManager.js';

/**
 * Generate an array of ROIs based on an ROI map manager.
 * @param roiMapManager - Roi map manager to use.
 */
export function computeRois(roiMapManager: RoiMapManager): void {
  const map = roiMapManager.getMap();

  const whites = new Array(map.nbPositive);
  const blacks = new Array(map.nbNegative);
  for (let i = 0; i < map.nbPositive; i++) {
    whites[i] = {
      minRow: map.height,
      minColumn: map.width,
      maxRow: -1,
      maxColumn: -1,
      surface: 0,
      id: i + 1,
    };
  }

  for (let i = 0; i < map.nbNegative; i++) {
    blacks[i] = {
      borderLengths: [],
      borderIDs: [],
      minRow: map.height,
      minColumn: map.width,
      maxRow: -1,
      maxColumn: -1,
      surface: 0,
      id: -i - 1,
    };
  }

  for (let row = 0; row < map.height; row++) {
    for (let column = 0; column < map.width; column++) {
      const currentIndex = roiMapManager.getMapValue(column, row);
      if (currentIndex === 0) {
        continue;
      }
      let currentRoi;
      if (currentIndex < 0) {
        currentRoi = blacks[-currentIndex - 1];
      } else {
        currentRoi = whites[currentIndex - 1];
      }

      currentRoi.surface++;

      if (row < currentRoi.minRow) {
        currentRoi.minRow = row;
      }
      if (row > currentRoi.maxRow) {
        currentRoi.maxRow = row;
      }
      if (column < currentRoi.minColumn) {
        currentRoi.minColumn = column;
      }
      if (column > currentRoi.maxColumn) {
        currentRoi.maxColumn = column;
      }
    }
  }

  roiMapManager.whiteRois = new Array<Roi>(map.nbPositive);
  roiMapManager.blackRois = new Array<Roi>(map.nbNegative);

  for (let i = 0; i < map.nbNegative; i++) {
    const width = blacks[i].maxColumn - blacks[i].minColumn + 1;
    const height = blacks[i].maxRow - blacks[i].minRow + 1;
    const origin = { row: blacks[i].minRow, column: blacks[i].minColumn };
    const id = blacks[i].id;
    const surface = blacks[i].surface;
    const blackRoi = new Roi(map, id, width, height, origin, surface);
    roiMapManager.blackRois[i] = blackRoi;
  }

  for (let i = 0; i < map.nbPositive; i++) {
    const width = whites[i].maxColumn - whites[i].minColumn + 1;
    const height = whites[i].maxRow - whites[i].minRow + 1;
    const origin = { row: whites[i].minRow, column: whites[i].minColumn };
    const id = whites[i].id;
    const surface = whites[i].surface;
    const whiteRoi = new Roi(map, id, width, height, origin, surface);

    roiMapManager.whiteRois[i] = whiteRoi;
  }
}
