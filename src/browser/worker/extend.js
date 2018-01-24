import background from './process/background';

export default function extend(Worker) {
  Worker.extendMethod('background', background);
}
