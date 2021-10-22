import { useEffect, useRef, useState } from 'react';

import { IJS, ImageColorModel, readCanvas, writeCanvas } from '../../src';
import { convertColor } from '../../src/operations/convertColor';
import { useCameraContext } from '../contexts/cameraContext';

import ErrorAlert from './ErrorAlert';
import UnavailableCamera from './UnavailableCamera';

type TransformFunction = (image: IJS) => IJS;

interface CameraTransformProps {
  transform: TransformFunction;
}

export default function CameraTransform(props: CameraTransformProps) {
  const [{ selectedCamera }] = useCameraContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
          const canvas = canvasRef.current as HTMLCanvasElement;
          if (!canvas) return;
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          const context = canvas.getContext('2d') as CanvasRenderingContext2D;
          function nextFrame() {
            context.drawImage(video, 0, 0);
            const image = readCanvas(canvas);
            try {
              let result = transformRef.current(image);
              if (result.colorModel !== ImageColorModel.RGBA) {
                result = convertColor(result, ImageColorModel.RGBA);
              }
              writeCanvas(result, canvas);
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
      <video ref={videoRef} />
      {error ? (
        <ErrorAlert>
          <code>{error}</code>
        </ErrorAlert>
      ) : (
        <canvas ref={canvasRef} />
      )}
    </>
  );
}
