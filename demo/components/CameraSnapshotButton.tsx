import type { RefObject } from 'react';

import type { Image } from '../../src/index.js';
import { readCanvas } from '../../src/index.js';

interface CameraSnapshotButtonProps {
  snapshotImageRef: RefObject<Image | null>;
  setSnapshotUrl: (snapshotUrl: string) => void;
  canvasInputRef: RefObject<HTMLCanvasElement | null>;
}

export default function CameraSnapshotButton(props: CameraSnapshotButtonProps) {
  const { setSnapshotUrl, snapshotImageRef, canvasInputRef } = props;
  function handleClick() {
    if (canvasInputRef.current) {
      const url = canvasInputRef.current.toDataURL();
      const image = readCanvas(canvasInputRef.current);
      setSnapshotUrl(url);
      // eslint-disable-next-line react-hooks/react-compiler
      snapshotImageRef.current = image;
    }
  }
  return (
    <div>
      <button
        className="border p-1 rounded hover:bg-green-300 hover:font-bold"
        type="button"
        onClick={handleClick}
      >
        Take snapshot
      </button>
    </div>
  );
}
