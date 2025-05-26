import CardImage from './CardComponent/CardImage';
import { cardBackPaths, createChangeDeckAction } from './config';
function CardBackSelectionWindow({ dispatch, cardBack, onCloseModal }) {
  function handleClick() {
    onCloseModal();
  }
  const active = 'border-[2px] border-red-500  ';
  return (
    <div className="w-[330px] px-3 py-2">
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(cardBackPaths).map(([key, path]) => (
          <div
            onClick={() => dispatch(createChangeDeckAction(key))}
            key={key}
            className={`w-full ${cardBack === Number(key) && active}`}
          >
            <CardImage cardPath={path} />
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-3">
        <button onClick={handleClick}>Ok</button>
      </div>
    </div>
  );
}

export default CardBackSelectionWindow;
