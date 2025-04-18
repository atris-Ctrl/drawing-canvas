import { useNavigate } from "react-router";
import Chicken from "../components/chicken/Chicken";
import Footer from "../components/ui/Footer";
import DesktopIcon from "../components/desktop/DesktopIcon";
import ToDoListPage from "./ToDoListPage";
import CommandPrompt from "../components/desktop/CommandPrompt";

function HomePage() {
  return (
    <>
      <div className="overflow-hidden min-h-screen flex flex-col bg-[url('/assets/windowXP-bliss.jpg')] bg-cover bg-center">
        <div className="p-3 flex-1 overflow-auto">
          <DesktopApps />
        </div>
        <CommandPrompt />
        <Chicken />
        <ToDoListPage />
        <Footer />
      </div>
    </>
  );
}

function DesktopApps() {
  const navigate = useNavigate();

  function handleDoubleClick() {
    navigate("/canvas");
  }
  return (
    <div className="flex gap-10 p-4">
      <div className="flex flex-col gap-10">
        <DesktopIcon
          iconSrc="/assets/palette.png"
          label="Canvas"
          onDoubleClick={handleDoubleClick}
        />
        <DesktopIcon iconSrc="/assets/vice_leader_circus.png" label="Mouse" />
      </div>
      <div className="flex flex-col gap-10">
        <DesktopIcon iconSrc="/assets/vice_leader_circus.png" label="Mouse" />
        <DesktopIcon iconSrc="/assets/vice_leader_circus.png" label="Mouse" />
      </div>
      <DesktopIcon iconSrc="/assets/vice_leader_circus.png" label="Mouse" />
    </div>
  );
}
export default HomePage;
