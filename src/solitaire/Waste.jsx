import Card from './CardComponent/Card';
import { LOCATIONS } from './config';

function Waste({ cards, dispatch, drawNum }) {
  if (cards.length === 0) return null;
  const currentDraw = Math.min(cards.length, drawNum);
  const currentWaste = cards.slice(0, currentDraw).reverse();
  return (
    <div className="relative h-[90px] w-[60px]">
      {currentWaste.map((card, index) => (
        <div
          key={card.id}
          className="absolute"
          style={{
            left: `${index * 10}px`,
            zIndex: index,
          }}
        >
          <Card
            dispatch={dispatch}
            card={card}
            location={LOCATIONS.WASTE}
            pileIndex={0}
            cardIndex={index}
            className="transition-all duration-200"
            disabled={!(index === currentWaste.length - 1)}
          />
        </div>
      ))}
    </div>
  );
}

export default Waste;
