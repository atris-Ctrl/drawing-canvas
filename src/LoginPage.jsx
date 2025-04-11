import { useState } from "react";
import Button from "./components/Button";
import { useAuth } from "./contexts/AuthProvider";
import "./index.css";

function Login() {
  const { userLogin, userGoogleSignIn, createNewUser } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setPassword] = useState("");

  function handleSignUp() {
    if (userEmail === "" || userPassword === "") return;
    createNewUser(userEmail, userPassword);
  }
  function handleLogin() {
    if (userEmail === "" || userPassword === "") return;
    userLogin(userEmail, userPassword);
  }

  function handleGoogleLogin() {
    userGoogleSignIn();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Log In
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="me@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleSignUp}>Sign Up</Button>

          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleGoogleLogin} type="button">
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
