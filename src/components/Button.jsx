function Button({ children, onClick }) {
  function handleClick(e) {
    e.preventDefault();
    onClick?.(e);
  }
  return (
    <button
      className="rounded font-bold text-white bg-blue-500 mx-10"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
