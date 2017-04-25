"use strict";

// We calculate all the border length with the neighbours

export default function borderInfo(roiMap) {
    let data = roiMap.data;
    let dx = [+1, 0, -1, 0];
    let dy = [0, +1, 0, -1];
    let borderInfo = {};

    for (let x = 0; x <= this.width; x++) {
        for (let y = 0; y <= this.height; y++) {
            let target = x + y * roiMap.width;
            let currentRoiID = data[target];
            for (let dir = 0; dir < 4; dir++) {
                let newX = x + dx[dir];
                let newY = y + dy[dir];
                if (newX >= 0 && newY >= 0 && newX < roiMap.width && newY < roiMap.height) {
                    let neighbourRoiID = data[newX + newY * roiMap.width];
                    if (currentRoiID !== neighbourRoiID) {
                        if (! borderInfo[neighbourRoiID]) {
                            borderInfo[neighbourRoiID] = {};
                        }
                        if (! borderInfo[neighbourRoiID][currentRoiID]) {
                            borderInfo[neighbourRoiID][currentRoiID]=1;
                        } else {
                            borderInfo[neighbourRoiID][currentRoiID]++;
                        }
                    }
                }
            }
        }
    }
}

