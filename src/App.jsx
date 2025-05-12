import { BrowserRouter, Route, Routes } from 'react-router';
import DrawApp from './pages/DrawPage';

import HomePage from './pages/HomePage';

import MineSweeper from './minesweeper/MineSweeper';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="canvas" element={<DrawApp />} />
          <Route path="mine" element={<MineSweeper />}></Route>
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
