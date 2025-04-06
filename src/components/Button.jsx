function Button({ children, onClick }) {
  return (
    <button class="btn btn-blue" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
