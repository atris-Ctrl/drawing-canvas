function Color({ colorCode, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.(e);
  };
  return (
    <div
      id={colorCode}
      style={{ backgroundColor: colorCode }}
      onClick={handleClick}
      className="w-6 h-6 border-2 border-white rounded-md shadow-md"
    ></div>
  );
}

export default Color;
