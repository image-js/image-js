import { useEffect, useRef } from 'react';

import { useCameraContext } from '../contexts/cameraContext';

import UnavailableCamera from './UnavailableCamera';

export default function CameraFeed() {
  const [{ selectedCamera }] = useCameraContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedCamera) return;
    video.srcObject = selectedCamera.stream;
    video.onloadedmetadata = () => {
      video.play().catch((err: unknown) => console.error(err));
    };
  }, [selectedCamera]);
  if (!selectedCamera) {
    return <UnavailableCamera />;
  }

  return <video ref={videoRef} />;
}
