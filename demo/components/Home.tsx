import { IJS } from '../../src';

import CameraSelector from './CameraSelector';
import CameraTransform from './CameraTransform';
import Container from './Container';
import { testGetMbrMask } from './testFunctions/testGetMbrMask';

function testTransform(image: IJS) {
  image.flip({ out: image });
  return testGetMbrMask(image);
}

export default function Home() {
  return (
    <Container title="Home">
      <CameraSelector />
      <CameraTransform transform={testTransform} />
    </Container>
  );
}
