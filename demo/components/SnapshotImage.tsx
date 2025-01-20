interface SnapshotImageProps {
  snapshotUrl: string;
}

export default function SnapshotImage(props: SnapshotImageProps) {
  const { snapshotUrl: snapshot } = props;
  return snapshot ? (
    <img alt="snapshot" style={{ transform: 'scaleX(-1)' }} src={snapshot} />
  ) : null;
}
