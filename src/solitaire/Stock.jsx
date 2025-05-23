import { cardBackPaths, cardSlotPaths, createDrawAction } from './config';

function Stock({ dispatch, stock }) {
  return (
    <div
      onClick={() => dispatch(createDrawAction())}
      className="flex h-[90px] w-[60px] items-center justify-center rounded shadow-md"
    >
      {stock.length === 0 ? (
        <img className="select-none" src={cardSlotPaths[0]}></img>
      ) : (
        <img className="select-none" src={cardBackPaths[0]}></img>
      )}
    </div>
  );
}

export default Stock;
