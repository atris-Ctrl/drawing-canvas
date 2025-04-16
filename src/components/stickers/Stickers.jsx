import { useDraw } from "../../contexts/DrawProvider";

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
  const { setSticker } = useDraw();
  function handleClick() {
    console.log("hello");
    setSticker("hello");
  }
  return (
    <div onClick={handleClick} className="flex flex-col text-center">
      <img src="/stickers/chicken_crown.png"></img>
    </div>
  );
}

export default Stickers;
