interface SnapshotImageProps {
  snapshotUrl: string;
}

export default function SnapshotImage(props: SnapshotImageProps) {
  const { snapshotUrl: snapshot } = props;
  return <img style={{ transform: 'scaleX(-1)' }} src={snapshot} />;
}
