function Button({ children, onClick, styleClass }) {
  function handleClick(e) {
    e.preventDefault();
    onClick?.(e);
  }

  return (
    <button onClick={handleClick} className={styleClass}>
      {children}
    </button>
  );
}

export default Button;
