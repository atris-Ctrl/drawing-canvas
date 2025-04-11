import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import DrawApp from "./DrawApp";
import AuthLayout from "./AuthLayout";
import { AuthProvider } from "./contexts/AuthProvider";
import Login from "./LoginPage";
import Register from "./RegisterPage";
function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<DrawApp />} />
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
