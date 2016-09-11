import {cssColor} from 'color-functions';

export function css2array(string) {
    let color = cssColor(string);
    return [color.r, color.g, color.b, Math.round(color.a * 255 / 100)];
}

function hex2rgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)

    ] : [0, 0, 0];
}

function array2rgba(arr) {
    if (!Array.isArray(arr)) return;
    if (arr.length === 3) {
        return 'rgba(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',1)';
    } else if (arr.length === 4) {
        return 'rgba(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',' + arr[3] + ')';
    } else {
        return 'rgba(0,0,0,1)';
    }
}

function rgb2hex(r, g, b) {
    if (arguments.length === 1) {
        let x = r.match(/rgba?\(([^\(]*)\)/, 'i');
        if (!x) return null;
        let rgb = x[1].split(',');
        if (rgb.length >= 3) {
            r = +rgb[0];
            g = +rgb[1];
            b = +rgb[2];
        }
    }
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hue2rgb(p, q, t) {
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1 / 6)
        return p + (q - p) * 6 * t;
    if (t < 1 / 2)
        return q;
    if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function hsl2rgb(h, s, l) {
    let m1, m2, hue, r, g, b;
    s /= 100;
    l /= 100;

    if (s === 0)
        r = g = b = (l * 255);
    else {
        if (l <= 0.5)
            m2 = l * (s + 1);
        else
            m2 = l + s - l * s;

        m1 = l * 2 - m2;
        hue = h / 360;
        r = hue2rgb(m1, m2, hue + 1 / 3);
        g = hue2rgb(m1, m2, hue);
        b = hue2rgb(m1, m2, hue - 1 / 3);
    }
    return {r: r, g: g, b: b};
}

export function getDistinctColors(numColors) {
    let colors = new Array(numColors);
    let j = 0;
    for (let i = 0; i < 360; i += 360 / numColors) {
        j++;
        let color = hsl2rgb(i, 100, 30 + j % 4 * 15);
        colors[j - 1] = [Math.round(color.r * 255), Math.round(color.g * 255), Math.round(color.b * 255)];
    }
    return colors;
}

export function getRandomColor() {
    return [(Math.floor(Math.random() * 256)), (Math.floor(Math.random() * 256)), (Math.floor(Math.random() * 256))];
}


function getDistinctColorsAsString(numColors) {
    let colors = getDistinctColors(numColors);
    let colorsString = new Array(numColors);
    for (let i = 0; i < numColors; i++) {
        colorsString[i] = getColor(colors[i]);
    }
    return colorsString;
}

function getNextColorRGB(colorNumber, numColors) {
    return getDistinctColors(numColors)[colorNumber];
}

function getColor(color) {
    if (Array.isArray(color)) {
        if (color.length >= 3) {
            for (let i = 0; i < 3; i++) color[i] = Math.round(color[i]);
        }
        switch (color.length) {
            case 3:
                return 'rgb(' + color.join(',') + ')';
            case 4:
                return 'rgba(' + color.join(',') + ')';
        }
    } else if (typeof color === 'object') {
        return 'rgb(' + Math.round(color.r * 255) + ', ' + Math.round(color.g * 255) + ', ' + Math.round(color.b * 255) + ')';
    }

    return color;
}

function getBrightness(color) {
    // from http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
    return ((color[0] / 255 * 299) + (color[1] / 255 * 587) + (color[2] / 255 * 114)) / (color[3] || 1);
}

