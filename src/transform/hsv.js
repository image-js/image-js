import Image from '../image';

export default function hsv() {
    this.checkProcessable('hsv', {
        bitDepth: [8, 16],
        dimension: 2,
        alpha: [0,1],
        colorModel: [0]

    });

    let newImage = Image.createFrom(this, {
        colorModel:'HSV'
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        let red=data[i];
        let green=data[i+1];
        let blue=data[i+2];

        let min = Math.min( red, green, blue );
        let max = Math.max( red, green, blue );
        let value = max;
        let delta = max - min;
        let saturation = 0;
        let hue = 0;
        if (max != 0 ) {
            saturation = delta / max;
            if( red == max ) {
                hue = ( green - blue ) / delta;		// between yellow & magenta
            } else if ( green == max ) {
                hue = 2 + ( blue - red ) / delta;	// between cyan & yellow
            } else {
                hue = 4 + ( red - green ) / delta;	// between magenta & cyan
            }

            hue *= 60;				// degrees
            if( hue < 0 ) hue += 360;
        } else {
                // red = green = blue = 0		// s = 0, v is undefined
            saturation = 0;
            hue = 0;
        }

        newImage.data[ptr++] = hue/360*255;
        newImage.data[ptr++] = saturation*255;
        newImage.data[ptr++] = value*255;
        if (this.alpha) {
            newImage.data[ptr++] = data[i+3];
        }
    }

    return newImage;
}
