import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router";
import UserForm from "../components/UserForm";
import Button from "../components/Button";

function LoginPage() {
  const { user, userLogin, userGoogleSignIn } = useAuth();
  const navigate = useNavigate();
  function handleLogin(userEmail, userPassword) {
    if (userEmail === "" || userPassword === "") return;
    userLogin(userEmail, userPassword);
    if (user) {
      navigate("/");
    }
  }
  function handleGoogleLogin() {
    userGoogleSignIn();
    if (user) {
      navigate("/");
    }
  }
  return (
    <div>
      <UserForm title="Log In" buttonText="Log In" onSubmit={handleLogin}>
        <Button onClick={handleGoogleLogin} type="button">
          Sign in with Google
        </Button>
        <Link to="/register">Create your account here</Link>
      </UserForm>
    </div>
  );
}

export default LoginPage;
