import { memo } from 'react';
import Card from './CardComponent/Card';
import { LOCATIONS } from './config';
import Droppable from './Droppable';
const Pile = function Pile({
  cardBack,
  cards,
  dispatch,
  pileIndex,
  activeId = [],
}) {
  const cardHeight = 90;
  const cardWidth = 60;
  const faceUpOffset = 13;
  const faceDownOffset = 5;

  const cardOffsets = [];
  let offset = 0;
  cards.forEach((card) => {
    cardOffsets.push(offset);
    offset += card.faceUp ? faceUpOffset : faceDownOffset;
  });

  return (
    <div className="relative min-h-[300px] w-[60px]">
      {cards.map((card, index) => {
        const isHidden =
          activeId.length > 0 && activeId.some((c) => c.id === card.id);
        const cardComponent = (
          <Card
            cardBack={cardBack}
            dispatch={dispatch}
            pileIndex={pileIndex}
            cardIndex={index}
            card={card}
            location={LOCATIONS.TABLEAU}
            hide={isHidden}
          />
        );

        return (
          <div
            key={card.id}
            className="absolute left-0"
            style={{
              top: `${cardOffsets[index]}px`,
              zIndex: index,
            }}
          >
            {index === cards.length - 1 ? (
              <Droppable
                id={`pile-${pileIndex}`}
                data={{ index: pileIndex, location: LOCATIONS.TABLEAU }}
              >
                {cardComponent}
              </Droppable>
            ) : (
              cardComponent
            )}
          </div>
        );
      })}

      {cards.length === 0 && (
        <div
          className="absolute left-0"
          style={{
            top: `0px`,
            height: `${cardHeight}px`,
            width: `${cardWidth}px`,
          }}
        >
          <Droppable
            id={`pile-${pileIndex}`}
            data={{ index: pileIndex, location: LOCATIONS.TABLEAU }}
          />
        </div>
      )}
    </div>
  );
};
export default Pile;
