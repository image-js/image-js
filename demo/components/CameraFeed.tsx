import { useEffect, useRef } from 'react';

import { useCameraContext } from '../contexts/cameraContext.js';

import UnavailableCamera from './UnavailableCamera.js';

export default function CameraFeed() {
  const [{ selectedCamera }] = useCameraContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedCamera) return;
    video.srcObject = selectedCamera.stream;
    const onLoadedMetadata = () => {
      video.play().catch((error: unknown) => console.error(error));
    };
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [selectedCamera]);
  if (!selectedCamera) {
    return <UnavailableCamera />;
  }

  return <video ref={videoRef} />;
}
