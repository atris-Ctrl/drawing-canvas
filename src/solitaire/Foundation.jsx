import Card from './Card';
import { cardSlotPaths, LOCATIONS } from './config';
import Droppable from './Droppable';

function Foundation({ foundation, dispatch }) {
  return (
    <div className="flex flex-shrink-0 gap-4">
      {foundation.map((pile, i) => (
        <div
          key={i}
          className="flex h-[90px] w-[60px] flex-shrink-0 items-center justify-center rounded"
        >
          <Droppable id={i} data={{ index: i, location: LOCATIONS.FOUNDATION }}>
            {pile.length === 0 ? (
              <img
                className="select-none"
                src={cardSlotPaths[2]}
                draggable={false}
              ></img>
            ) : (
              <Card
                dispatch={dispatch}
                card={pile[pile.length - 1]}
                location={LOCATIONS.FOUNDATION}
                pileIndex={i}
                cardIndex={pile.length - 1}
              />
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
}
export default Foundation;
