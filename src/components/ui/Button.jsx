import "xp.css/dist/XP.css";

function Button({ children, onClick, styleClass }) {
  function handleClick(e) {
    e.preventDefault();
    onClick?.(e);
  }

  return (
    <button
      onClick={handleClick}
      className={styleClass}
      // className={`mx-2 px-3 py-2 rounded-2xl bg-[#d5dff4] text-[#2d607d] font-semibold shadow-md hover:bg-pink-300 transition-all duration-300 ease-in-out active:scale-95 ${styleClass}`}
    >
      {children}
    </button>
  );
}

export default Button;
