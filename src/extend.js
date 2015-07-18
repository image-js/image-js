// filters
import invert from './filter/invert';
import invertMatrix from './filter/invertMatrix';
import invertOneLoop from './filter/invertOneLoop';
import invertBinaryLoop from './filter/invertBinaryLoop';
import meanFilter from './filter/blur';
import medianFilter from './filter/median';

// transformers
import crop from './transform/crop';
import grey from './transform/grey/grey';
import mask from './transform/mask/mask';

import split from './utility/split';
import paintMasks from './operator/paintMasks';

// computers
import {getHistogram, getHistograms} from './compute/histogram';
import getColorHistogram from './compute/colorHistogram';

export default function extend(Image) {
    Image.extendMethod('invert', invert, true); // true means the process is in-place
    Image.extendMethod('invertMatrix', invertMatrix, true);
    Image.extendMethod('invertOneLoop', invertOneLoop, true);
    Image.extendMethod('invertBinaryLoop', invertBinaryLoop, true);
    Image.extendMethod('meanFilter', meanFilter);
    Image.extendMethod('medianFilter', medianFilter);

    Image.extendMethod('crop', crop); // last parameter is "false" because it creates a new image
    Image.extendMethod('grey', grey).extendMethod('gray', grey);
    Image.extendMethod('mask', mask);

    Image.extendMethod('split', split);

    Image.extendMethod('paintMasks', paintMasks);

    Image.extendMethod('getHistogram', getHistogram).extendProperty('histogram', getHistogram);
    Image.extendMethod('getHistograms', getHistograms).extendProperty('histograms', getHistograms);
    Image.extendMethod('getColorHistogram', getColorHistogram).extendProperty('colorHistogram', getColorHistogram);
}
