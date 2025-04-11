import { Outlet } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider";

function AuthLayout() {
  return (
    <div>
      <header>Welcome to Drawing Canvas</header>
      <h2>Please log in or register to start</h2>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
