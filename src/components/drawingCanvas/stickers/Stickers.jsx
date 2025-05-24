import { useDraw } from '../DrawProvider';

function Stickers() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-md border p-4">
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
    setSticker('hello');
  }
  return (
    <div onClick={handleClick} className="flex flex-col text-center">
      <img src="/assets/chicken_crown.png"></img>
    </div>
  );
}

export default Stickers;
