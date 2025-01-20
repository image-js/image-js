import type { ReactNode } from 'react';

import Navbar from './Navbar.js';

interface ContainerProps {
  title: string;
  children: ReactNode;
}
export default function Container(props: ContainerProps) {
  return (
    <div>
      <Navbar />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{props.title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {props.children}
        </div>
      </main>
    </div>
  );
}
