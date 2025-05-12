import { BrowserRouter, Route, Routes } from 'react-router';
import DrawApp from './pages/DrawPage';
import AuthLayout from './layout/AuthLayout';
import { AuthProvider } from './contexts/AuthProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ToDoListPage from './pages/ToDoListPage';
import ProtectedRoute from './components/ProtectedRoute';
import MineSweeper from './MineSweeper';

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="canvas" element={<DrawApp />} />
            <Route path="mine" element={<MineSweeper />}></Route>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
