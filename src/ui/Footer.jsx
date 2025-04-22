import XPTab from "../components/desktop/XPTab";
import Timer from "./Timer";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-[#316ac5] to-[#1c4fa1] text-white shadow-inner border-t border-[#0e2f66]">
      <div className="max-w-7xl flex h-12">
        <div className="left-0 flex flex-row py-2 px-3 rounded-tr-2xl rounded-br-2xl h-full p-[2px] bg-gradient-to-br from-[#0f6c0c] border-3 border-[#0f6c0c] to-[#289332] rounded-sm">
          <img className="w-8 h-8" src="/assets/XPlogo.png"></img>
          <button className="italic h-full text-xl font-semibold bg-[#188912] border-[#188912]  hover:bg-[#0f6c0c] w-full">
            Start
          </button>
        </div>
        <div className="flex gap-1 bg-[#1c53a4] p-1">
          <XPTab icon="/chrome-icon.png" label="Google Chrome" active />
          <XPTab icon="/paint-icon.png" label="Paint ₊✩‧₊˚౨ৎ˚₊✩‧₊" />
          <XPTab
            icon="/assets/icons/user_account.ico"
            label="New Text Document.txt"
          />
          <XPTab icon="/textdoc-icon.png" label="New Text Document.txt" />
        </div>

        <div className="flex gap-2 fixed right-0 h-full bg-[#148ee8] border-4 border-[#1ea3f0] py-2 px-3 text-xs font-mono tracking-wide">
          <img
            src="/assets/chicken_crown.png"
            className="w-auto h-[35px] "
          ></img>
          <Timer />
        </div>
      </div>
    </footer>
  );
}
export default Footer;
