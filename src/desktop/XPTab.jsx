function XPTab({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center px-3 py-1 h-10 w-fit min-w-[120px] border border-blue-800 
        ${active ? "bg-[#3d7cd4]" : "bg-[#4d89f9] hover:bg-[#6fa3ff]"} 
        text-white rounded-l-md rounded-tr-md shadow-sm cursor-pointer`}
    >
      <img src={icon} alt="" className="w-4 h-4 mr-2" />
      <span className="select-none truncate text-sm font-semibold">
        {label}
      </span>
    </div>
  );
}
export default XPTab;
