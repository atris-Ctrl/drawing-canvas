import { useEffect, useReducer, useState } from 'react';
import {
  ItemTypes,
  ACTIONS,
  GAME_STATE,
  init,
  isBlack,
  initialState,
} from './config';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function reducer(state, action) {
  switch (action.type) {
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
      return state;
    case ACTIONS.MOVE_TO_FOUNDATION:
      console.log('move to foundation');
      const { foundation, tableau, waste } = state;
      const { index, card, from, pileIndex, cardIndex } = action.payload;

      if (!card?.faceUp) return state;
      const newFoundation = [...foundation];
      const newTableau = [...tableau];
      const newWaste = [...waste];

      if (from === 'tableau') {
        const newPile = [...newTableau[pileIndex]];
        newTableau[pileIndex] = newPile.slice(0, cardIndex);
      } else if (from === 'waste') {
        newWaste.shift();
      } else {
        return state;
      }
      newFoundation[index].unshift(card);
      console.log(newFoundation);
      return {
        ...state,
        foundation: newFoundation,
        tableau: newTableau,
        waste: newWaste,
      };
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
          <div className="flex gap-4">
            <Stock stock={stock} waste={waste} dispatch={dispatch} />
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
            location="tableau"
          />
        </div>
      ))}
    </div>
  );
}

function Stock({ stock, dispatch, waste }) {
  function handleClick() {
    dispatch({ type: ACTIONS.DRAW });
  }

  return (
    <div
      onClick={handleClick}
      className="flex h-[90px] w-[60px] items-center justify-center rounded border border-white bg-blue-900 shadow-md"
    ></div>
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
        location="waste"
        className="absolute transition-all duration-200"
      />
    </div>
  );
}

function Foundation({ foundation, key, dispatch }) {
  //   const [{ canDrop }, drop] = useDrop(
  //     () => ({
  //       accept: ItemTypes.CARD,
  //     }),
  //     [],
  //   );

  console.log('FOUNDATION', foundation);
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
            <Card dispatch={dispatch} card={pile[0]} location="foundation" />
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ card, dispatch, location, pileIndex, cardIndex }) {
  const { value, suit, faceUp } = card;
  //   const [{ isDragging }, drag] = useDrag(() => ({
  //     type: ItemTypes.CARD,
  //     collect: (monitor) => ({
  //       isDragging: !!monitor.isDragging(),
  //     }),
  //   }));

  function handleClick(e) {
    e.preventDefault();
    dispatch({
      type: ACTIONS.MOVE_TO_FOUNDATION,
      payload: { index: 0, from: location, card, pileIndex, cardIndex },
    });
  }
  const color = isBlack(suit) ? 'text-black' : 'text-red-600';

  return (
    <div
      //   ref={drag}
      onClick={(e) => handleClick(e)}
      className={`flex h-[90px] w-[60px] items-center justify-center rounded border border-black bg-white shadow-md ${
        faceUp ? color : 'bg-blue-800'
      } ${true ? 'opacity-50' : 'opacity-100'} `}
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
