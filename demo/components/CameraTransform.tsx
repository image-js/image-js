import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { Image } from '../../src/index.js';
import { readCanvas, writeCanvas } from '../../src/index.js';
import { convertColor } from '../../src/operations/convertColor.js';
import { useCameraContext } from '../contexts/cameraContext.js';

import ErrorAlert from './ErrorAlert.js';
import SnapshotImage from './SnapshotImage.js';
import UnavailableCamera from './UnavailableCamera.js';

export type TransformFunction =
  | ((image: Image) => Image)
  | ((image: Image, snapshot: Image | null) => Image);

interface CameraTransformProps {
  transform: TransformFunction;
  canvasInputRef: RefObject<HTMLCanvasElement | null>;
  snapshotUrl: string;
  snapshotImageRef: RefObject<Image | null>;
}

export default function CameraTransform(props: CameraTransformProps) {
  const { canvasInputRef, transform, snapshotUrl, snapshotImageRef } = props;
  const [{ selectedCamera }] = useCameraContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasOutputRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<TransformFunction>(transform);
  const [error, setError] = useState<string>('');
  transformRef.current = transform;
  useEffect(() => {
    // Reset error if transform is changed.
    setError('');
  }, [transform]);
  useEffect(() => {
    if (!selectedCamera || error) return;
    const video = videoRef.current as HTMLVideoElement;
    let nextFrameRequest: number;
    video.srcObject = selectedCamera.stream;
    const onLoadedMetadata = () => {
      video
        .play()
        .then(() => {
          const canvasInput = canvasInputRef.current as HTMLCanvasElement;
          const canvasOutput = canvasOutputRef.current as HTMLCanvasElement;
          if (!canvasInput || !canvasOutput) return;
          // eslint-disable-next-line react-hooks/react-compiler
          canvasInput.height = video.videoHeight;
          canvasInput.width = video.videoWidth;
          const inputContext = canvasInput.getContext(
            '2d',
          ) as CanvasRenderingContext2D;
          function nextFrame() {
            inputContext.drawImage(video, 0, 0);
            const image = readCanvas(canvasInput);
            try {
              let result = transformRef.current(
                image,
                snapshotImageRef.current,
              );
              if (result.colorModel !== 'RGBA') {
                result = convertColor(result, 'RGBA');
              }
              writeCanvas(result, canvasOutput);
            } catch (error_) {
              setError((error_ as Error).stack as string);
              console.error(error_);
            }
            nextFrameRequest = requestAnimationFrame(nextFrame);
          }
          nextFrameRequest = requestAnimationFrame(nextFrame);
        })
        .catch((error_: unknown) => console.error(error_));
    };
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      if (nextFrameRequest) {
        cancelAnimationFrame(nextFrameRequest);
      }
    };
  }, [canvasInputRef, snapshotImageRef, error, selectedCamera]);
  if (!selectedCamera) {
    return <UnavailableCamera />;
  }

  return (
    <>
      <div className="flex gap-1">
        <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
        <SnapshotImage snapshotUrl={snapshotUrl} />
      </div>
      {error ? (
        <ErrorAlert>
          <code>{error}</code>
        </ErrorAlert>
      ) : null}

      <canvas
        style={{ transform: 'scaleX(-1)', display: error ? 'block' : 'none' }}
        ref={canvasInputRef}
      />

      <canvas
        style={{ transform: 'scaleX(-1)', display: error ? 'none' : 'block' }}
        ref={canvasOutputRef}
      />
    </>
  );
}
