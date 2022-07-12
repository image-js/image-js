import { Roi } from './Roi';
import { RoiMapManager } from './RoiMapManager';

/**
 * Generate an array of ROIs based on an ROI map manager.
 *
 * @param roiMapManager - Roi map manager to use
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
      let currentIndex = roiMapManager.getMapValue(column, row);

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

  for (let i = 0; i < map.nbPositive; i++) {
    let whiteRoi = new Roi(map, i);
    whiteRoi.origin = { row: whites[i].minRow, column: whites[i].minColumn };
    whiteRoi.width = whites[i].maxColumn - whites[i].minColumn + 1;
    whiteRoi.height = whites[i].maxRow - whites[i].minRow + 1;
    whiteRoi.surface = whites[i].surface;
    whiteRoi.id = whites[i].id;

    roiMapManager.whiteRois[i] = whiteRoi;
  }
  for (let i = 0; i < map.nbNegative; i++) {
    let blackRoi = new Roi(map, i);
    blackRoi.origin = { row: blacks[i].minRow, column: blacks[i].minColumn };
    blackRoi.width = blacks[i].maxColumn - blacks[i].minColumn + 1;
    blackRoi.height = blacks[i].maxRow - blacks[i].minRow + 1;
    blackRoi.surface = blacks[i].surface;
    blackRoi.id = blacks[i].id;

    roiMapManager.blackRois[i] = blackRoi;
  }
}
