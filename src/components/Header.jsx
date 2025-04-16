import "../index.css";
import "xp.css/dist/XP.css";

function Header() {
  return (
    <>
      <div className="title-bar header p-5">
        <div className="title-bar-text text-lg">A Title Bar</div>
        <div className="title-bar-controls">
          <button aria-label="Close"></button>
        </div>
      </div>
    </>
  );
}

export default Header;
