import { ACTIONS, cardBackPaths, cardPaths } from './config';
import Draggable from './Draggable';

function Card({ card, dispatch, location, pileIndex, cardIndex }) {
  const { faceUp } = card;

  function handleClick(e) {
    e.preventDefault();
    if (!faceUp) {
      dispatch({
        type: ACTIONS.FLIP_CARD,
        payload: { pileIndex, cardIndex, location },
      });
      return;
    }
    dispatch({
      type: ACTIONS.MOVE_CARD,
      payload: { from: location, card, pileIndex, cardIndex },
    });
  }

  const data = { location, pileIndex, cardIndex, card };
  const cardPath = faceUp ? cardPaths[card.id] : cardBackPaths['CardBack_0'];
  return (
    <Draggable id={card.id} data={data} disabled={!card.faceUp}>
      <div
        onClick={(e) => handleClick(e)}
        className="flex h-[90px] w-[60px] items-center justify-center rounded shadow-md"
      >
        <img src={cardPath} />
      </div>
    </Draggable>
  );
}

export default Card;
