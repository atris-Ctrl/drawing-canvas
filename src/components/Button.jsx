function Button({ children, onClick }) {
  function handleClick(e) {
    e.preventDefault();
    onClick?.(e);
  }
  return (
    <button className="btn btn-blue" onClick={handleClick}>
      {children}
    </button>
  );
}

export default Button;
