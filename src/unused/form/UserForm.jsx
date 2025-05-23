import React, { useState } from "react";
import "xp.css/dist/XP.css";
import Button from "../../ui/Button";
function UserForm({
  title,
  onSubmit,
  children,
  buttonText = "Submit",
  showConfirmPassword = false,
}) {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  function handleLogin(e) {
    e.preventDefault();
    if (!userEmail || !userPassword) return;
    if (showConfirmPassword && userPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (showConfirmPassword) {
      onSubmit(userEmail, userPassword, userName);
      return;
    }
    onSubmit(userEmail, userPassword);
  }

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">
          {showConfirmPassword
            ? "Sign up for Drawing Canvas"
            : "Log in to Drawing Canvas"}
        </div>
      </div>
      <div className="window-body">
        <img></img>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          {title && (
            <h1 className="text-2xl font-semibold text-center">{title}</h1>
          )}
          <div>
            {showConfirmPassword && (
              <>
                <label className="block text-base font-medium text-gray-700">
                  User Name
                </label>
                <input
                  type="text"
                  placeholder="username"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </>
            )}
            <label className="block text-base font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="me@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          {showConfirmPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <Button onClick={handleLogin}>{buttonText}</Button>
          {children}
        </form>
      </div>
    </div>
  );
}

export default UserForm;
