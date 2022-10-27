import { MutableRefObject, RefObject } from 'react';

import { readCanvas, Image } from '../../src';

interface CameraSnapshotButtonProps {
  snapshotImageRef: MutableRefObject<Image | null>;
  setSnapshotUrl: (snapshotUrl: string) => void;
  canvasInputRef: RefObject<HTMLCanvasElement>;
}

export default function CameraSnapshotButton(props: CameraSnapshotButtonProps) {
  const { setSnapshotUrl, snapshotImageRef, canvasInputRef } = props;
  function handleClick() {
    if (canvasInputRef.current) {
      const url = canvasInputRef.current.toDataURL();
      const image = readCanvas(canvasInputRef.current);
      setSnapshotUrl(url);
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
