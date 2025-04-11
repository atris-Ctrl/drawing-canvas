function Register() {
  return (
    <div>
      <form>
        <label>Register</label>
        <input
          type="email"
          label="Email Address"
          placeholder="me@example.com"
        ></input>
        <label>
          <input type="password" name="password" placeholder="password"></input>
        </label>
      </form>
    </div>
  );
}

export default Register;
