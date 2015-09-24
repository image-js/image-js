import matchAndCrop from './transform/matchAndCrop';

export default function extend(Stack) {
    let inPlace = {inPlace: true};
    Stack.extendMethod('matchAndCrop', matchAndCrop);
}
