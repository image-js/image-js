import { produce } from 'immer';
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

interface Camera {
  device: MediaDeviceInfo;
  stream: MediaStream;
}

interface CameraState {
  cameras: MediaDeviceInfo[];
  selectedCamera: Camera | null;
}

const defaultCameraState: CameraState = { cameras: [], selectedCamera: null };

type CameraContext = [state: CameraState, dispatch: Dispatch<CameraAction>];

const cameraContext = createContext<CameraContext>([
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

const cameraStateReducer = produce(
  (state: CameraState, action: CameraAction) => {
    switch (action.type) {
      case 'SET_CAMERAS': {
        state.cameras = action.cameras;
        if (action.cameras.length === 0) {
          state.selectedCamera = null;
        } else if (state.selectedCamera === null) {
          state.selectedCamera = action.firstCamera;
        } else if (
          !state.cameras.find(
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
      getCameras().catch((err: unknown) => console.error(err));
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
