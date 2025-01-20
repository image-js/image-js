import type { ReactNode } from 'react';
import { useEffect, useMemo, useReducer } from 'react';

import type { CameraContext } from './cameraContext.js';
import {
  cameraContext,
  cameraStateReducer,
  defaultCameraState,
} from './cameraContext.js';

export function CameraProvider(props: { children: ReactNode }) {
  const [cameraState, dispatch] = useReducer(
    cameraStateReducer,
    defaultCameraState,
  );
  const value = useMemo<CameraContext>(
    () => [cameraState, dispatch],
    [cameraState],
  );
  useEffect(() => {
    async function getCameras() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      if (cameras.length > 0) {
        // TODO: handle denied permission
        const firstCameraStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: cameras[0].deviceId },
        });
        dispatch({
          type: 'SET_CAMERAS',
          cameras,
          firstCamera: { device: cameras[0], stream: firstCameraStream },
        });
      }
    }

    function handleDeviceChange() {
      getCameras().catch((error: unknown) => console.error(error));
    }

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    handleDeviceChange();
    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        handleDeviceChange,
      );
    };
  }, []);

  return (
    <cameraContext.Provider value={value}>
      {props.children}
    </cameraContext.Provider>
  );
}
