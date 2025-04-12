import "../index.css";
import { Link } from "react-router";
import UserForm from "../components/UserForm";

function RegisterPage() {
  function handleSignUp(userEmail, userPassword) {
    createNewUser(userEmail, userPassword);
    if (user) {
      navigate("/");
    }
  }
  return (
    <>
      <UserForm
        title="Register"
        onSubmit={handleSignUp}
        buttonText="Register"
        showConfirmPassword={true}
      >
        <Link to="/login">Have account already? Click here</Link>
      </UserForm>
    </>
  );
}

export default RegisterPage;
