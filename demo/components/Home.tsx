import { useRef, useState } from 'react';

import type { Image } from '../../src/index.js';

import CameraSelector from './CameraSelector.js';
import CameraSnapshotButton from './CameraSnapshotButton.js';
import type { TransformFunction } from './CameraTransform.js';
import CameraTransform from './CameraTransform.js';
import Container from './Container.js';
import { testGetFastKeypoints } from './testFunctions/testGetFastKeypoints.js';

const testTransform: TransformFunction = testGetFastKeypoints;

export default function Home() {
  const snapshotImageRef = useRef<Image>(null);
  const canvasInputRef = useRef<HTMLCanvasElement>(null);
  const [snapshotUrl, setSnapshotUrl] = useState('');
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
