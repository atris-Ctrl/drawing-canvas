import { useNavigate } from 'react-router';
import Chicken from '../components/chicken/Chicken';
import Footer from '../ui/Footer';
import DesktopIcon from './DesktopIcon';
import CommandPrompt from './CommandPrompt';
import MineSweeper from './MineSweeper';
import { desktopApps } from '../config/desktopApps';

function HomePage() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 -z-10 h-screen w-full">
          <img
            src="/assets/windowXP-bliss.jpg"
            alt="Windows XP Background"
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden p-2 sm:p-3 md:p-4">
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

  const handleAppClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4">
        {desktopApps
          .filter(app => app.enabled)
          .map(app => (
            <DesktopIcon
              key={app.id}
              iconSrc={app.iconSrc}
              label={app.label}
              onDoubleClick={() => handleAppClick(app.route)}
            />
          ))}
      </div>
    </div>
  );
}

export default HomePage;
