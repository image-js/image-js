import { useRef, useState } from 'react';

import { Image } from '../../src';

import CameraSelector from './CameraSelector';
import CameraSnapshotButton from './CameraSnapshotButton';
import CameraTransform, { TransformFunction } from './CameraTransform';
import Container from './Container';
import { testGetFastKeypoints } from './testFunctions/testGetFastKeypoints';

const testTransform: TransformFunction = testGetFastKeypoints;

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
