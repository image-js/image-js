import medianFromHistogram from '../../util/medianFromHistogram';
// returns an array with the median value of each component

export default function median() {
    let result=new Array(this.channels);
    let histograms=this.getHistograms({maxSlots:this.maxValue+1});
    for (let c=0; c<histograms.length; c++) {
        let histogram=histograms[c];
        result[c]=medianFromHistogram(histogram);
    }
    return result;
}
