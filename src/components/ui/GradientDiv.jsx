function GradientDiv({ children }) {
  return (
    <div className="rounded-tl rounded-tr bg-gradient-to-r from-customWhite via-customWhite to-customBlue w-full p-1">
      {children}
    </div>
  );
}

export default GradientDiv;
