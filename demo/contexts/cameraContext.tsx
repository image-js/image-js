import { produce } from 'immer';
import type { Dispatch } from 'react';
import { createContext, useContext } from 'react';

interface Camera {
  device: MediaDeviceInfo;
  stream: MediaStream;
}

interface CameraState {
  cameras: MediaDeviceInfo[];
  selectedCamera: Camera | null;
}

export const defaultCameraState: CameraState = {
  cameras: [],
  selectedCamera: null,
};

export type CameraContext = [
  state: CameraState,
  dispatch: Dispatch<CameraAction>,
];

export const cameraContext = createContext<CameraContext>([
  defaultCameraState,
  () => {
    // Empty
  },
]);

export function useCameraContext(): CameraContext {
  return useContext(cameraContext);
}

type CameraAction =
  | {
      type: 'SET_CAMERAS';
      cameras: MediaDeviceInfo[];
      firstCamera: Camera;
    }
  | {
      type: 'SELECT_CAMERA';
      camera: Camera;
    };

export const cameraStateReducer = produce(
  (state: CameraState, action: CameraAction) => {
    switch (action.type) {
      case 'SET_CAMERAS': {
        state.cameras = action.cameras;
        if (action.cameras.length === 0) {
          state.selectedCamera = null;
        } else if (state.selectedCamera === null) {
          state.selectedCamera = action.firstCamera;
        } else if (
          !state.cameras.some(
            (camera) => camera.deviceId === action.firstCamera.device.deviceId,
          )
        ) {
          // The selected camera disappeared. Use another one.
          state.selectedCamera = action.firstCamera;
        }
        break;
      }
      case 'SELECT_CAMERA': {
        state.selectedCamera = action.camera;
        break;
      }
      default:
        throw new Error('unknown action');
    }
  },
);
