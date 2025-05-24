function StartMenu() {
  return (
    <div className="w-64 rounded-md border border-gray-400 bg-gradient-to-br from-blue-500 to-blue-700 font-sans text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center border-b px-3 py-2">
        <img
          src="/assets/vice_leader_circus.png"
          className="mr-2 h-8 w-8 rounded-full border border-white"
          alt="User Icon"
        />
        <span className="text-sm font-bold">User</span>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Left side */}
        <div className="flex-1 bg-white text-black">
          <div className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100">
            Programs
          </div>
          <div className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100">
            Documents
          </div>
          <div className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100">
            Settings
          </div>
          <div className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100">
            Search
          </div>
          <div className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100">
            Help
          </div>
          <div className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100">
            Run...
          </div>
        </div>

        {/* Right side */}
        <div className="flex w-16 flex-col justify-center border-l border-gray-300 bg-blue-100 text-center text-xs text-blue-800">
          <div className="border-b border-gray-300 py-2">My Computer</div>
          <div className="py-2">My Network</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t border-gray-300 bg-gray-100 px-3 py-2 text-xs text-black">
        <div className="cursor-pointer hover:underline">Log Off</div>
        <div className="cursor-pointer hover:underline">Shut Down</div>
      </div>
    </div>
  );
}

export default StartMenu;
