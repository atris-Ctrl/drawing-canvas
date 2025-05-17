import { useEffect, useReducer, useState } from 'react';
import {
  ItemTypes,
  ACTIONS,
  GAME_STATE,
  init,
  isBlack,
  initialState,
  LOCATIONS,
  findValidSpot,
  checkWin,
} from './config';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

//TODO: FIX TOPCARD IN FOUNDATION
// ADD FUNCTION TO MOVE CARD(S)TO VALID PLACE IF POSSIBLE
// DRAG AND DROP FUNCTION
// DRAW THREE / ONE IN DEAL
// CALCULATE WIN
// RESET FUNCTION
// SCORE FUNCTION, STOPWATCH FUNCTION

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FLIP_CARD:
      // WHAT IS THIS SO MESSY !!!
      const {
        pileIndex: flipPileIndex,
        cardIndex: flipCardIndex,
        location: flipLocation,
      } = action.payload;

      if (flipLocation !== LOCATIONS.TABLEAU) return;
      const { tableau: flipTableau } = state;

      const newFlipTableau = [...flipTableau];
      const flipPile = [...flipTableau[flipPileIndex]];

      const flipCard = { ...flipPile[flipCardIndex], faceUp: true };
      if (flipCardIndex !== flipPile.length - 1) return state;
      flipPile[flipCardIndex] = flipCard;
      newFlipTableau[flipPileIndex] = flipPile;
      return { ...state, tableau: newFlipTableau };

    case ACTIONS.DRAW:
      const { stock: drawStock, waste: drawWaste } = state;
      if (drawStock.length === 0 && drawWaste.length > 0) {
        // Recycle waste back to stock (face down)
        const resetStock = drawWaste.map((card) => ({
          ...card,
          faceUp: false,
        }));
        return { ...state, stock: resetStock, waste: [] };
      }

      if (drawStock.length > 0) {
        const newStock = [...drawStock];
        const newCard = newStock.pop();
        newCard.faceUp = true;
        return { ...state, stock: newStock, waste: [newCard, ...drawWaste] };
      }
      return state;

    case ACTIONS.MOVE_CARD:
      const {
        tableau: currentTableau,
        foundation: currentFoundation,
        waste: currentWaste,
      } = state;
      const {
        card: currentCard,
        from,
        pileIndex: fromIndex,
        cardIndex,
      } = action.payload;
      const validSpot = findValidSpot(
        currentCard,
        currentTableau,
        currentFoundation,
      );
      if (!validSpot) return state;
      const { location: to, index: toIndex } = validSpot;

      if (!currentCard?.faceUp) return state;
      const newFoundation = [...currentFoundation];
      const newTableau = [...currentTableau];
      const newWaste = [...currentWaste];
      let moveCards = [currentCard];
      // one card in tableau => waste
      if (from === LOCATIONS.TABLEAU) {
        const newPile = [...newTableau[fromIndex]];

        const remainingPile = newPile.slice(0, cardIndex);
        moveCards = newPile.slice(cardIndex);
        newTableau[fromIndex] = remainingPile;
      } else if (from === LOCATIONS.WASTE) newWaste.shift();
      else if (from === LOCATIONS.FOUNDATION) {
        newFoundation[fromIndex].pop();
      }

      if (to === LOCATIONS.FOUNDATION)
        newFoundation[toIndex].push(...moveCards);
      else if (to === LOCATIONS.TABLEAU) newTableau[toIndex].push(...moveCards);

      const isWin = checkWin(newFoundation);
      const newGameState = isWin ? GAME_STATE.WIN : state.gameState;
      return {
        ...state,
        gameState: newGameState,
        foundation: newFoundation,
        tableau: newTableau,
        waste: newWaste,
      };
    case ACTIONS.RESET:
      const resetState = init(initialState);
      return resetState;
    case ACTIONS.TICK:
      if (state.gameState !== GAME_STATE.RUNNING) return state;
      return { ...state, time: state.time + 1 };
    default:
      throw new Error('Unknown action type');
  }
}

function Solitaire() {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const { stock, tableau, foundation, waste, time, gameState, score } = state;
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="inline-block w-full bg-green-800 p-6 font-mono text-white">
        <div className="mb-8 flex justify-between">
          {/* <button onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Reset
          </button> */}
          <div className="flex gap-4">
            <Stock stock={stock} dispatch={dispatch} />
            <Waste cards={waste} dispatch={dispatch} />
          </div>
          <Foundation foundation={foundation} dispatch={dispatch} />
        </div>

        <Tableau tableau={tableau} dispatch={dispatch} />

        <div className="mt-8">
          <div>Score: {score} &nbsp;&nbsp;</div>
          <StopWatch time={time} dispatch={dispatch} gameState={gameState} />
        </div>
      </div>
    </DndProvider>
  );
}

function Tableau({ tableau, dispatch }) {
  return (
    <div className="flex justify-start gap-4">
      {tableau.map((cardPile, i) => (
        <Pile dispatch={dispatch} key={i} pileIndex={i} cards={cardPile} />
      ))}
    </div>
  );
}

function Pile({ cards, dispatch, pileIndex }) {
  return (
    <div className="relative min-h-[300px] w-[60px]">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute left-0"
          style={{
            top: `${index * 15}px`,
            zIndex: index,
          }}
        >
          <Card
            dispatch={dispatch}
            pileIndex={pileIndex}
            cardIndex={index}
            card={card}
            location={LOCATIONS.TABLEAU}
          />
        </div>
      ))}
    </div>
  );
}

function Stock({ dispatch, stock }) {
  function handleClick() {
    dispatch({ type: ACTIONS.DRAW });
  }

  return (
    <div
      onClick={handleClick}
      className="flex h-[90px] w-[60px] items-center justify-center rounded border border-white bg-blue-900 shadow-md"
    >
      {stock.length === 0 && 'X'}
    </div>
  );
}

function Waste({ cards, dispatch }) {
  if (cards.length === 0) return null;
  const card = cards[0];

  return (
    <div className="relative h-[90px] w-[120px]">
      <Card
        key={card.id}
        dispatch={dispatch}
        card={card}
        location={LOCATIONS.WASTE}
        pileIndex={0}
        cardIndex={0}
        className="absolute transition-all duration-200"
      />
    </div>
  );
}

function Foundation({ foundation, dispatch }) {
  //   const [{ canDrop }, drop] = useDrop(
  //     () => ({
  //       accept: ItemTypes.CARD,
  //     }),
  //     [],
  //   );

  return (
    <div className="flex gap-4">
      {foundation.map((pile, i) => (
        <div
          key={i}
          className="flex h-[90px] w-[60px] items-center justify-center rounded border border-white bg-gray-500 shadow-inner"
        >
          {pile.length === 0 ? (
            '♢'
          ) : (
            <Card
              dispatch={dispatch}
              card={pile[pile.length - 1]}
              location={LOCATIONS.FOUNDATION}
              pileIndex={i}
              cardIndex={pile.length - 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ card, dispatch, location, pileIndex, cardIndex }) {
  const { value, suit, faceUp } = card;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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
  const color = isBlack(suit) ? 'text-black' : 'text-red-600';

  return (
    <div
      ref={drag}
      onClick={(e) => handleClick(e)}
      className={`flex h-[90px] w-[60px] items-center justify-center rounded border border-black bg-white shadow-md ${
        faceUp ? color : 'bg-blue-800'
      } ${isDragging ? 'opacity-50' : 'opacity-100'} `}
    >
      {faceUp ? (
        <span>
          {suit} {value}
        </span>
      ) : (
        '?'
      )}
    </div>
  );
}

function StopWatch({ gameState, dispatch, time }) {
  useEffect(() => {
    let timer;
    if (gameState === GAME_STATE.RUNNING)
      timer = setInterval(() => dispatch({ type: ACTIONS.TICK }), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  return <div>Time : {time}</div>;
}

export default Solitaire;
