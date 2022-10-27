import { useRef, useState } from 'react';

import { Image } from '../../src';

import CameraSelector from './CameraSelector';
import CameraSnapshotButton from './CameraSnapshotButton';
import CameraTransform from './CameraTransform';
import Container from './Container';
import { testLevel } from './testFunctions/testLevel';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testTransform(image: Image, snapshot: Image | null) {
  return testLevel(image);
}

export default function Home() {
  const snapshotImageRef = useRef<Image>(null);
  const canvasInputRef = useRef<HTMLCanvasElement>(null);
  const [snapshotUrl, setSnapshotUrl] = useState('');
  console.log(snapshotUrl);
  return (
    <Container title="Home">
      <div className="space-y-1">
        <CameraSelector />
        <CameraSnapshotButton
          setSnapshotUrl={setSnapshotUrl}
          canvasInputRef={canvasInputRef}
          snapshotImageRef={snapshotImageRef}
        />
        <CameraTransform
          transform={testTransform}
          snapshotUrl={snapshotUrl}
          snapshotImageRef={snapshotImageRef}
          canvasInputRef={canvasInputRef}
        />
      </div>
    </Container>
  );
}
