import getHistograms from './histograms';
import medianFromHistogram from '../../util/medianFromHistogram';

export default function median() {

    this.checkProcessable('median', {
        bitDepth: [8, 16]
    });

    let result = new Array(this[0].channels);
    let histograms = this.getHistograms({maxSlots: this[0].maxValue + 1});
    for (let c = 0; c < histograms.length; c++) {
        let histogram = histograms[c];
        result[c] = medianFromHistogram(histogram);
    }
    return result;
}
