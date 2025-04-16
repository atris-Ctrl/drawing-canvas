import "../index.css";
import { Link, useNavigate } from "react-router";
import UserForm from "../components/UserForm";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";

function RegisterPage() {
  const { createNewUser, user, isLoading } = useAuth();
  const navigate = useNavigate();
  function handleSignUp(userEmail, userPassword, displayName) {
    if (userEmail === "" || (userPassword === "") | (displayName === ""))
      return;
    createNewUser(userEmail, userPassword, displayName);
  }

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);
  return (
    <>
      {isLoading ? (
        <p>Creating account for you ~</p>
      ) : (
        <UserForm
          title="Register"
          onSubmit={handleSignUp}
          buttonText="Register"
          showConfirmPassword={true}
        >
          <Link to="/login">Have account already? Click here</Link>
        </UserForm>
      )}
    </>
  );
}

export default RegisterPage;
