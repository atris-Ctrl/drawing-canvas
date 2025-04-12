function Stickers() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 border rounded-md">
      <Sticker></Sticker>
      <Sticker></Sticker>
      <Sticker></Sticker>
      <Sticker></Sticker>
      <Sticker></Sticker>
    </div>
  );
}

function Sticker({ imgSrc }) {
  return (
    <div className="flex flex-col text-center">
      <img src="/stickers/chicken_crown.png"></img>
    </div>
  );
}

export default Stickers;
