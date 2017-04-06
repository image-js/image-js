/*
Computes the convex hull of a binary image using Andrew's Monotone Chain Algorithm
 http://www.algorithmist.com/index.php/Monotone_Chain_Convex_Hull
 Returns an array of coordinates, in clockwise order
 */
export default function monotoneChainConvexHull() {
    const image = this;
    image.checkProcessable('monotoneChainConvexHull', {bitDepth: 1});

    const points = [];
    for (let i = 0; i < image.width; i++) {
        for (let j = 0; j < image.height; j++) {
            if (image.getBitXY(i, j)) {
                points.push([i, j]);
            }
        }
    }

    const n = points.length;
    const ans = new Array(n * 2);
    let k = 0;
    let start = 0;

    for (let i = 0; i < n; i++) {
        const point = points[i];
        while (k - start >= 2 && ccw(ans[k - 2], ans[k - 1], point) <= 0) {
            k--;
        }
        ans[k++] = point;
    }

    k--;
    start = k;

    for (let i = n - 1; i >= 0; i--) {
        const point = points[i];
        while (k - start >= 2 && ccw(ans[k - 2], ans[k - 1], point) <= 0) {
            k--;
        }
        ans[k++] = point;
    }

    k--;

    return ans.slice(0, k);
}

function ccw(p1, p2, p3) {
    return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
}
