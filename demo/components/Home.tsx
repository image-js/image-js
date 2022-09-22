import { Image } from '../../src';

import CameraSelector from './CameraSelector';
import CameraTransform from './CameraTransform';
import Container from './Container';
import { testGetFeret } from './testFunctions/testGetFeret';

function testTransform(image: Image) {
  image.flip({ out: image });
  return testGetFeret(image);
}

export default function Home() {
  return (
    <Container title="Home">
      <CameraSelector />
      <CameraTransform transform={testTransform} />
    </Container>
  );
}
