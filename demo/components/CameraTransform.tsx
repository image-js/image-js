import { useEffect, useRef, useState } from 'react';

import { Image, ImageColorModel, readCanvas, writeCanvas } from '../../src';
import { convertColor } from '../../src/operations/convertColor';
import { useCameraContext } from '../contexts/cameraContext';

import ErrorAlert from './ErrorAlert';
import UnavailableCamera from './UnavailableCamera';

type TransformFunction = (image: Image) => Image;

interface CameraTransformProps {
  transform: TransformFunction;
}

export default function CameraTransform(props: CameraTransformProps) {
  const [{ selectedCamera }] = useCameraContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasInputRef = useRef<HTMLCanvasElement>(null);
  const canvasOutputRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<TransformFunction>(props.transform);
  const [error, setError] = useState<string>('');
  transformRef.current = props.transform;
  useEffect(() => {
    // Reset error if transform is changed.
    setError('');
  }, [props.transform]);
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
              let result = transformRef.current(image);
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
  }, [error, selectedCamera]);
  if (!selectedCamera) {
    return <UnavailableCamera />;
  }

  return (
    <>
      <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
      {error ? (
        <ErrorAlert>
          <code>{error}</code>
        </ErrorAlert>
      ) : null}
      <canvas
        style={{ display: error ? 'block' : 'none' }}
        ref={canvasInputRef}
      />
      <canvas
        style={{ display: error ? 'none' : 'block' }}
        ref={canvasOutputRef}
      />
    </>
  );
}
