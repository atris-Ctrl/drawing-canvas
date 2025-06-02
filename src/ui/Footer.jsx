import XPTab from '../desktop/XPTab';
import Timer from './Timer';

function Footer() {
  return (
    <footer className="flex h-12 w-full max-w-full justify-between border-t border-[#0e2f66] bg-gradient-to-t from-[#316ac5] to-[#1c4fa1] text-white shadow-inner">
      <div className="flex items-center overflow-x-auto scrollbar-hide">
        <div className="border-3 flex h-full flex-row rounded-sm rounded-br-2xl rounded-tr-2xl border-[#0f6c0c] bg-gradient-to-br from-[#0f6c0c] to-[#289332] p-[2px] px-2 sm:px-3 py-2">
          <img className="h-6 w-6 sm:h-8 sm:w-8" src="/assets/XPlogo.png" alt="Windows XP Logo" />
          <div className="mx-2 sm:mx-3 h-full w-full border-[#188912] bg-[#188912] py-1 text-base sm:text-xl font-semibold italic">
            Start
          </div>
        </div>

        <div className="ml-2 flex gap-1 bg-[#1c53a4] p-1 overflow-x-auto scrollbar-hide">
          <XPTab icon="/chrome-icon.png" label="Google Chrome" active />
          <XPTab icon="/paint-icon.png" label="Paint ₊✩‧₊˚౨ৎ˚₊✩‧₊" />
          <XPTab
            icon="/assets/icons/user_account.ico"
            label="New Text Document.txt"
          />
          <XPTab icon="/textdoc-icon.png" label="New Text Document.txt" />
        </div>
      </div>
      {/* Right Side: Timer */}
      <div className="ml-auto flex h-full gap-2 border-4 border-[#1ea3f0] bg-[#148ee8] px-2 sm:px-3 py-2 font-mono text-xs tracking-wide whitespace-nowrap">
        <img src="/assets/chicken_crown.png" className="h-[25px] sm:h-[35px] w-auto" alt="Chicken Crown" />
        <Timer />
      </div>
    </footer>
  );
}
export default Footer;
