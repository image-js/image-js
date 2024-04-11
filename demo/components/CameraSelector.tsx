import { useCameraContext } from '../contexts/cameraContext';

export default function CameraSelector() {
  const [{ cameras, selectedCamera }, dispatch] = useCameraContext();
  if (cameras.length === 0) return null;
  return (
    <div>
      <label
        htmlFor="camera"
        className="block text-sm font-medium text-gray-700"
      >
        Camera
      </label>
      <select
        id="camera"
        name="camera"
        className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedCamera?.device.label}
        onChange={(event) => {
          const device = cameras.find(
            (cam) => cam.label === event.currentTarget.value,
          );
          if (device) {
            navigator.mediaDevices
              .getUserMedia({ video: { deviceId: device.deviceId } })
              .then((stream) => {
                dispatch({
                  type: 'SELECT_CAMERA',
                  camera: { device, stream },
                });
              })
              .catch((err: unknown) => console.error(err));
          }
        }}
      >
        {cameras.map((camera) => (
          <option key={camera.deviceId}>{camera.label}</option>
        ))}
      </select>
    </div>
  );
}
