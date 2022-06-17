import { IJS } from '../../src';

import CameraSelector from './CameraSelector';
import CameraTransform from './CameraTransform';
import Container from './Container';
import { testCorrectColor } from './testFunctions/testCorrectColor';

function testTransform(image: IJS) {
  return testCorrectColor(image);
}

export default function Home() {
  return (
    <Container title="Home">
      <CameraSelector />
      <CameraTransform transform={testTransform} />
    </Container>
  );
}
