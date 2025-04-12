function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-100 flex flex-col items-center justify-center text-gray-800">
      <h1 className="text-5xl font-extrabold mb-4">🎨 Drawing Canvas</h1>
      <p className="text-xl mb-8 text-center max-w-lg">
        Welcome to your creative space! Start sketching your imagination, save
        your artworks, and share them with others.
      </p>
      <div className="flex gap-4">
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow">
          Start Drawing
        </button>
        <button className="bg-white hover:bg-gray-100 text-purple-600 font-semibold py-2 px-6 rounded-lg shadow border border-purple-300">
          View Gallery
        </button>
      </div>
    </div>
  );
}

export default HomePage;
