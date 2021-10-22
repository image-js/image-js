import { ReactNode } from 'react';

export default function ErrorAlert(props: { children: ReactNode }) {
  return (
    <div className="p-4 text-red-800 bg-red-200 rounded">{props.children}</div>
  );
}
