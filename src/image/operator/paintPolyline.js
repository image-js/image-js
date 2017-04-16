
/**
 * Paint pixels on the current image.
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} points - Array of [x,y] points
 * @param {object} [options]
 * @param {Array<number>} [options.color=[max,0,0]] - Array of 3 elements (R, G, B), default is red.
 * @return {this} The original painted image
 */
export default function paintPolyline(points, options = {}) {
    let {
        color = [this.maxValue, 0, 0]
    } = options;

    this.checkProcessable('paintPoints', {
        bitDepth: [8, 16]
    });

    let numberChannels = Math.min(this.channels, color.length);

    for (let i = 0; i < points.length; i++) {
        let from = points[i];
        let to = points[(i + 1) % points.length];

        let dx = to[0] - from[0];
        let dy = to[1] - from[1];
        let steps = Math.max(Math.abs(dx), Math.abs(dy));

        let xIncrement = dx / steps;
        let yIncrement = dy / steps;

        let x = from[0];
        let y = from[1];

        // console.log(from, to, 'Steps',steps,'xIncrement',xIncrement, 'yIncrement',yIncrement, x, y)

        for (let j = 0; j <= steps; j++) {
            let xPoint = Math.round(x);
            let yPoint = Math.round(y);

            if (
                (xPoint >= 0) &&
                (yPoint >= 0) &&
                (xPoint < this.width) &&
                (yPoint < this.height)
            ) {
                let position = (xPoint + yPoint * this.width) * this.channels;
                for (let channel = 0; channel < numberChannels; channel++) {
                    this.data[position + channel] = color[channel];
                }
            }

            x = x + xIncrement;
            y = y + yIncrement;
        }
    }

    return this;
}
