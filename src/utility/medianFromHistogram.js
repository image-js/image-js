export default function medianFromHistogram(histogram) {
    let total=histogram.reduce((sum, x) => sum + x);
    // 2 cases, odd or even number

    let position=0;
    let currentTotal=0;
    if (total & 1 === 1) { // odd number
        let middle=Math.floor(total/2);
        while(true){
            currentTotal+=histogram[position];
            if (currentTotal>=middle) {
                return position;
            }
            position++;
        }
    } else { // even number
        let middle=total>>1;
        while(true){
            currentTotal+=histogram[position];
            if (currentTotal>=middle) {
                return position;
            }
            position++;
        }
    }
}

