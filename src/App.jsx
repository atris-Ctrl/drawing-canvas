import { BrowserRouter, Route, Routes } from 'react-router';
import DrawApp from './pages/DrawPage';

import HomePage from './pages/HomePage';

import MineSweeper from './minesweeper/MineSweeper';
import { BiSolidCircleThreeQuarter } from 'react-icons/bi';
import StartPlane from './components/desktop/StartPlane';
import Solitaire from './solitaire/Solitaire';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="canvas" element={<DrawApp />} />

          <Route path="game" element={<Solitaire />}></Route>

          <Route path="mine" element={<StartPlane />}></Route>
          {/* <Route element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
