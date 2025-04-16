import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthProvider";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
