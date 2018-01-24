
// We calculate all the border length with the neighbours

export default function commonBorderLength(roiMap) {
  let data = roiMap.data;
  let dx = [+1, 0, -1, 0];
  let dy = [0, +1, 0, -1];

  let minMax = roiMap.minMax;
  let shift = -minMax.min;
  let max = minMax.max + shift;
  let borderInfo = [];
  for (let i = 0; i <= max; i++) {
    borderInfo.push(Object.create(null));
  }

  for (let x = 0; x < roiMap.width; x++) {
    for (let y = 0; y < roiMap.height; y++) {
      let target = x + y * roiMap.width;
      let currentRoiID = data[target];
      if (currentRoiID !== 0) {
        // each pixel may only contribute one time to a border
        let used = Object.create(null);
        let isBorder = false;
        for (let dir = 0; dir < 4; dir++) {
          let newX = x + dx[dir];
          let newY = y + dy[dir];
          if (newX >= 0 && newY >= 0 && newX < roiMap.width && newY < roiMap.height) {
            let neighbourRoiID = data[newX + newY * roiMap.width];
            if (currentRoiID !== neighbourRoiID) {
              isBorder = true;
              if (neighbourRoiID !== 0 && used[neighbourRoiID] === undefined) {
                used[neighbourRoiID] = true;
                if (!borderInfo[neighbourRoiID + shift][currentRoiID]) {
                  borderInfo[neighbourRoiID + shift][currentRoiID] = 1;
                } else {
                  borderInfo[neighbourRoiID + shift][currentRoiID]++;
                }
              }
            }
          } else {
            isBorder = true;
          }
        }
        // we will also add an information to specify the border length
        if (isBorder) {
          if (!borderInfo[currentRoiID + shift][currentRoiID]) {
            borderInfo[currentRoiID + shift][currentRoiID] = 1;
          } else {
            borderInfo[currentRoiID + shift][currentRoiID]++;
          }
        }
      }
    }
  }

  // we convert now the result to an object for fast lookup and we will reshift the result
  let result = {};
  for (let i = 0; i < borderInfo.length; i++) {
    if (Object.keys(borderInfo[i]).length > 0) {
      result[i - shift] = borderInfo[i];
    }
  }
  return result;
}
