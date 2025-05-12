import XPTab from '../components/desktop/XPTab';
import Timer from './Timer';

function Footer() {
  return (
    <footer className="flex h-12 w-full max-w-full justify-between border-t border-[#0e2f66] bg-gradient-to-t from-[#316ac5] to-[#1c4fa1] text-white shadow-inner">
      {/* Left Side: Start Button + Tabs */}
      <div className="flex items-center">
        {/* Start Button */}
        <div className="border-3 flex h-full flex-row rounded-sm rounded-br-2xl rounded-tr-2xl border-[#0f6c0c] bg-gradient-to-br from-[#0f6c0c] to-[#289332] p-[2px] px-3 py-2">
          <img className="h-8 w-8" src="/assets/XPlogo.png" />
          <button className="h-full w-full border-[#188912] bg-[#188912] text-xl font-semibold italic hover:bg-[#0f6c0c]">
            Start
          </button>
        </div>

        {/* Tabs */}
        <div className="ml-2 flex gap-1 bg-[#1c53a4] p-1">
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
      <div className="ml-auto flex h-full gap-2 border-4 border-[#1ea3f0] bg-[#148ee8] px-3 py-2 font-mono text-xs tracking-wide">
        <img src="/assets/chicken_crown.png" className="h-[35px] w-auto" />
        <Timer />
      </div>
    </footer>
  );
}
export default Footer;
