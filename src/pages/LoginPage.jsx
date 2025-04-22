import { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router";
import UserForm from "../components/form/UserForm";
import Button from "../ui/Button";

function LoginPage() {
  const { user, isLoading, userLogin, userGoogleSignIn } = useAuth();
  const navigate = useNavigate();
  function handleLogin(userEmail, userPassword) {
    if (userEmail === "" || userPassword === "") return;
    userLogin(userEmail, userPassword);
  }
  function handleGoogleLogin() {
    userGoogleSignIn();
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      {isLoading ? (
        <p>Logging you in ~</p>
      ) : (
        <UserForm title="Log In" buttonText="Log In" onSubmit={handleLogin}>
          <Button onClick={handleGoogleLogin} type="button">
            Sign in with Google
          </Button>
          <Link to="/register">Create your account here</Link>
        </UserForm>
      )}
    </>
  );
}

export default LoginPage;
