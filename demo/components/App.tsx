import { HashRouter, Route, Switch } from 'react-router-dom';

import { CameraProvider } from '../contexts/cameraContext';

import Filters from './Filters';
import Home from './Home';

export default function App() {
  return (
    <CameraProvider>
      <HashRouter>
        <Switch>
          <Route path="/filters">
            <Filters />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </HashRouter>
    </CameraProvider>
  );
}
