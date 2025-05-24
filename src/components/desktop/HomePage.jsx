import { useNavigate } from 'react-router';
import Chicken from '../chicken/Chicken';
import Footer from '../../ui/Footer';
import DesktopIcon from './DesktopIcon';
import CommandPrompt from './CommandPrompt';
import MineSweeper from '../../minesweeper/MineSweeper';

function HomePage() {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden bg-[url('/assets/windowXP-bliss.jpg')] bg-cover bg-center">
        <div className="flex-1 overflow-auto p-3">
          <DesktopApps />
        </div>
        <MineSweeper />
        <CommandPrompt />
        <Chicken />
        {/* <ToDoListPage /> */}
        <Footer />
      </div>
    </>
  );
}

function DesktopApps() {
  const navigate = useNavigate();

  function handleDoubleClick() {
    navigate('/canvas');
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
        <DesktopIcon
          iconSrc="/assets/icons/user_account.ico"
          label="User Account"
        />
      </div>
      <DesktopIcon iconSrc="/assets/vice_leader_circus.png" label="Mouse" />
    </div>
  );
}
export default HomePage;
