import Card from './CardComponent/Card';
import CardImage from './CardComponent/CardImage';
import { cardSlotPaths, LOCATIONS } from './config';
import Droppable from './Droppable';

function Foundation({ foundation, dispatch }) {
  return (
    <div className="flex gap-4">
      {foundation.map((pile, i) => (
        <div key={i} className="flex items-center justify-center">
          <Droppable id={i} data={{ index: i, location: LOCATIONS.FOUNDATION }}>
            <div className="relative h-[80px] w-[60px]">
              <CardImage
                cardPath={cardSlotPaths[2]}
                className="absolute left-0 top-0 z-0 h-full w-full"
              />

              {pile.length > 0 && (
                <div className="absolute left-0 top-0 z-10 h-full w-full">
                  <Card
                    dispatch={dispatch}
                    card={pile[pile.length - 1]}
                    location={LOCATIONS.FOUNDATION}
                    pileIndex={i}
                    cardIndex={pile.length - 1}
                  />
                </div>
              )}
            </div>
          </Droppable>
        </div>
      ))}
    </div>
  );
}

export default Foundation;
