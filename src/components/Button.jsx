function Button({ children, onClick }) {
  return (
    <button className="btn btn-blue" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
