
/**
 * Returns an array of object with position.
 * @memberof Image
 * @param mask region of the image that is analyzed. The rest is omitted.
 * @param region 1, 2 or 3. Define the region around each points that is analyzed.
 * @param removeClosePts Remove pts which have a distance between them smaller than this param.
 * @param algorithm chose between min or max local.
 * @returns {[number]} Array having has size the number of channels
 */


export default function localExtrema(
    {
        removeClosePts = 0,
        region = 3,
        algorithm = 'max',
        mask
    } = {}
) {
    let image = this;
    this.checkProcessable('localExtrema', {
        bitDepth: [8, 16],
        components: 1
    });
    region *= 4;

    let dx = [+1, 0, -1, 0, +1, +1, -1, -1, +2, 0, -2, 0, +2, +2, -2, -2];
    let dy = [0, +1, 0, -1, +1, -1, +1, -1, 0, +2, 0, -2, +2, -2, +2, -2];
    let pts = [];
    for (let currentY = 2; currentY < image.height - 2; currentY++) {
        for (let currentX = 2; currentX < image.width - 2; currentX++) {
            if (mask && !mask.getBitXY(currentX, currentY)) {
                continue;
            }
            let min = 0;
            let currentValue = image.data[currentX + currentY * image.width];
            for (let dir = 0; dir < region; dir++) {
                if (algorithm === 'min') {
                    if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] > currentValue) {
                        min++;
                    }

                } else if (algorithm === 'max') {
                    if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] < currentValue) {
                        min++;
                    }
                }
            }
            if (min >= region) {
                pts.push({x: currentX, y: currentY});
            }

        }
    }
    if (removeClosePts > 0) {
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                if (Math.sqrt(Math.pow(pts[i].x - pts[j].x, 2) + Math.pow(pts[i].y - pts[j].y, 2)) < removeClosePts) {
                    pts.splice(j, 1);
                    j--;
                }
            }
        }
    }
    let uniqueId = 1;
    for (let i = 0; i < pts.length; i++) {
        pts[i].id = uniqueId;
        uniqueId++;
    }

    return pts;
}

