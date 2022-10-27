import { Image } from '../../src';

import CameraSelector from './CameraSelector';
import CameraSnapshotButton from './CameraSnapshotButton';
import CameraTransform from './CameraTransform';
import Container from './Container';
import { testLevel } from './testFunctions/testLevel';

function testTransform(image: Image) {
  image.flip({ out: image });
  return testLevel(image);
}

export default function Home() {
  return (
    <Container title="Home">
      <div className="space-y-1">
        <CameraSelector />
        <CameraSnapshotButton />
        <CameraTransform transform={testTransform} />
      </div>
    </Container>
  );
}
