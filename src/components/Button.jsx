function Button({ children, onClick, styleClass }) {
  function handleClick(e) {
    e.preventDefault();
    onClick?.(e);
  }

  return (
    <button
      onClick={handleClick}
      className={`mx-2 px-3 py-2 rounded-2xl bg-pink-400 text-white font-semibold shadow-md hover:bg-pink-300 transition-all duration-300 ease-in-out active:scale-95 ${styleClass}`}
    >
      {children}
    </button>
  );
}

export default Button;
