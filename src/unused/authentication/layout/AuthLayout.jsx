import { Outlet } from "react-router";
// import "./authstyle.css";
function AuthLayout() {
  return (
    <div className="bg-[#004e98] min-h-screen w-2xl h-2xl flex flex-col justify-center items-center p-3">
      <div className="w-full max-w-2xl">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
