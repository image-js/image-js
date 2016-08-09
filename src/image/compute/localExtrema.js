
/**
 * Returns an array of object with position.
 * @memberof Image
 * @param mask region of the image that is analyzed. The rest is omitted.
 * @param region 1, 2 or 3. Define the region around each points that is analyzed.
 * @param removeClosePoints Remove pts which have a distance between them smaller than this param.
 * @param algorithm chose between min or max local.
 * @returns {[number]} Array having has size the number of channels
 */


export default function localExtrema (
    {
        removeClosePoints = 0,
        region = 3,
        algorithm = 'max',
        mask
    } = {}
) {
    let searchMaxima=true;
    if (algorithm.toLowerCase() === 'min') {
        searchMaxima=false;
    }

    let image = this;
    this.checkProcessable('localExtrema', {
        bitDepth: [8, 16],
        components: 1
    });
    region *= 4;

    let dx = [+1, 0, -1, 0, +1, +1, -1, -1, +2, 0, -2, 0, +2, +2, -2, -2];
    let dy = [0, +1, 0, -1, +1, -1, +1, -1, 0, +2, 0, -2, +2, -2, +2, -2];
    let points = [];
    for (let currentY = 2; currentY < image.height - 2; currentY++) {
        for (let currentX = 2; currentX < image.width - 2; currentX++) {
            if (mask && !mask.getBitXY(currentX, currentY)) {
                continue;
            }
            let counter = 0;
            let currentValue = image.data[currentX + currentY * image.width];
            for (let dir = 0; dir < region; dir++) {
                if (searchMaxima) {
                    if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] < currentValue) {
                        counter++;
                    }
                } else {
                    if (image.data[currentX + dx[dir] + (currentY + dy[dir]) * image.width] > currentValue) {
                        counter++;
                    }
                }
            }
            if (counter === region) {
                points.push({x: currentX, y: currentY, z: image.data[currentX + currentY * image.width]});
            }
        }
    }
    if (removeClosePoints > 0) {
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2)) < removeClosePoints) {
                    points[i].x=(points[i].x+points[j].x)>>1;
                    points[i].y=(points[i].y+points[j].y)>>1;
                    points[i].z=(points[i].z+points[j].z)>>1;
                    points.splice(j, 1);
                    j--;
                }
            }
        }
    }
    return points;
}

