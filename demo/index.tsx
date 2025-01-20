import { createRoot } from 'react-dom/client';

import './index.css';

import App from './components/App.js';

const root = createRoot(document.querySelector('#root') as HTMLElement);

root.render(<App />);
