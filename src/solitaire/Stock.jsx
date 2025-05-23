import CardImage from './CardComponent/CardImage';
import { cardBackPaths, cardSlotPaths, createDrawAction } from './config';

function Stock({ dispatch, stock }) {
  const cardPath = stock.length == 0 ? cardSlotPaths[0] : cardBackPaths[0];
  return (
    <div
      onClick={() => dispatch(createDrawAction())}
      className="flex h-[90px] w-[60px] items-center justify-center rounded shadow-md"
    >
      <CardImage cardPath={cardPath} />
    </div>
  );
}

export default Stock;
