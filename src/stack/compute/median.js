
import getHistograms from './histograms';
import medianFromHistogram from '../../util/medianFromHistogram'

export default function median(images) {

    // TODO check all the images are the same kind
    if (images.length===0) return;

    let result=new Array(images[0].channels);
    let histograms = getHistograms(images, {maxSlots: images[0].maxValue + 1});
    for (let c = 0; c < histograms.length; c++) {
        let histogram = histograms[c];
        result[c] = medianFromHistogram(histogram);
    }
    return result;
}