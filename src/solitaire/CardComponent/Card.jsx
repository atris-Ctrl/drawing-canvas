import CardImage from './CardImage';
import {
  cardBackPaths,
  cardPaths,
  createFlipAction,
  createMoveAction,
} from '../config';
import Draggable from '../Draggable';

function Card({
  card,
  dispatch,
  location,
  pileIndex,
  cardIndex,
  hide = false,
  disabledClick = false,
}) {
  const { faceUp } = card;

  function handleClick(e) {
    e.preventDefault();
    if (disabledClick) return;
    if (!faceUp) {
      dispatch(createFlipAction(pileIndex, cardIndex, location));
      return;
    }
    dispatch(createMoveAction(location, card, pileIndex, cardIndex));
  }

  const data = { location, pileIndex, cardIndex, card };
  const cardPath = faceUp ? cardPaths[card.id] : cardBackPaths[0];
  return (
    <Draggable
      id={card.id}
      data={data}
      disabled={disabledClick || !card.faceUp}
    >
      <div
        onClick={(e) => handleClick(e)}
        className="flex h-[90px] w-[60px] items-center justify-center"
      >
        {!hide && <CardImage cardPath={cardPath} />}
      </div>
    </Draggable>
  );
}

export default Card;
