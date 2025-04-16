function GradientDiv({ children }) {
  return (
    <div className="bg-gradient-to-r from-customWhite via-customWhite to-customBlue w-full">
      {children}
    </div>
  );
}

export default GradientDiv;
