import { BrowserRouter, Route, Routes } from 'react-router';
import DrawApp from './components/drawingCanvas/DrawPage';
import HomePage from './desktop/HomePage';
import StartPlane from './desktop/StartPlane';
import Solitaire from './solitaire/Solitaire';
import './winxp/skins/default.css';
import './winxp/theme.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="canvas" element={<DrawApp />} />
          <Route path="game" element={<Solitaire />}></Route>
          <Route path="mine" element={<StartPlane />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
