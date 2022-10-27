import { RefObject, useEffect, useRef, useState } from 'react';

import { Image, ImageColorModel, readCanvas, writeCanvas } from '../../src';
import { convertColor } from '../../src/operations/convertColor';
import { useCameraContext } from '../contexts/cameraContext';

import ErrorAlert from './ErrorAlert';
import SnapshotImage from './SnapshotImage';
import UnavailableCamera from './UnavailableCamera';

type TransformFunction =
  | ((image: Image) => Image)
  | ((image: Image, snapshot: Image | null) => Image);

interface CameraTransformProps {
  transform: TransformFunction;
  canvasInputRef: RefObject<HTMLCanvasElement>;
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
    video.onloadedmetadata = () => {
      video
        .play()
        .then(() => {
          const canvasInput = canvasInputRef.current as HTMLCanvasElement;
          const canvasOutput = canvasOutputRef.current as HTMLCanvasElement;
          if (!canvasInput || !canvasOutput) return;
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
              if (result.colorModel !== ImageColorModel.RGBA) {
                result = convertColor(result, ImageColorModel.RGBA);
              }
              writeCanvas(result, canvasOutput);
            } catch (err) {
              setError(err.stack);
              console.error(err);
            }
            nextFrameRequest = requestAnimationFrame(nextFrame);
          }
          nextFrameRequest = requestAnimationFrame(nextFrame);
        })
        .catch(console.error);
    };

    return () => {
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
