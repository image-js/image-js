import { IJS } from '../../src';

import CameraSelector from './CameraSelector';
import CameraTransform from './CameraTransform';
import Container from './Container';
import { testGetContourMask } from './testFunctions/testGetContourMask';

function testTransform(image: IJS) {
  return testGetContourMask(image);
}

export default function Home() {
  return (
    <Container title="Home">
      <CameraSelector />
      <CameraTransform transform={testTransform} />
    </Container>
  );
}
