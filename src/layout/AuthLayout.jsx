import { Outlet } from "react-router";
function AuthLayout() {
  return (
    <div className="min-h-screen from-gray-100 to-gray-200 flex flex-col justify-center items-center px-3">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome to Drawing Canvas
        </h1>
        <h2 className="text-lg text-gray-600">
          Please log in or register to start
        </h2>
      </div>
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
