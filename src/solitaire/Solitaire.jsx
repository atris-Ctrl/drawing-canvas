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
  canMoveFoundation,
  canMoveCard,
} from './config';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

//TODO:
// DRAG AND DROP FUNCTION
// DRAW THREE / ONE IN DEAL
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

    case ACTIONS.DRAG_CARD:
      const {
        fromLocation,
        toLocation,
        pileIndex,
        card,
        cardIndex: fromCardIndex,
        toIndex: toDestIndex,
      } = action.payload;

      const dragFoundation = [...state.foundation];
      const dragTableau = [...state.tableau];
      const dragWaste = [...state.waste];
      let dragMoveCards = [card];

      if (toLocation === LOCATIONS.FOUNDATION) {
        if (!canMoveFoundation(card, dragFoundation[toDestIndex])) return state;
      } else if (toLocation === LOCATIONS.TABLEAU) {
        const currentPile = dragTableau[toDestIndex];
        if (!canMoveCard(card, currentPile[currentPile.length - 1]))
          return state;
      }

      if (fromLocation === LOCATIONS.TABLEAU) {
        const newPile = [...dragTableau[pileIndex]];
        const remainingPile = newPile.slice(0, fromCardIndex);
        dragMoveCards = newPile.slice(fromCardIndex);
        dragTableau[pileIndex] = remainingPile;
      } else if (fromLocation === LOCATIONS.WASTE) {
        dragWaste.shift();
      } else if (fromLocation === LOCATIONS.FOUNDATION) {
        dragFoundation[pileIndex].pop();
      }

      if (toLocation === LOCATIONS.FOUNDATION) {
        // so if the card we click is what the foundation want then there is should not add the whole deck to foundation
        if (dragMoveCards.length > 1) return state;
        dragFoundation[toDestIndex].push(...dragMoveCards);
      } else if (toLocation === LOCATIONS.TABLEAU)
        dragTableau[toDestIndex].push(...dragMoveCards);
      const isWinning = checkWin(dragFoundation);
      const currentGameState = isWinning ? GAME_STATE.WIN : state.gameState;
      return {
        ...state,
        gameState: currentGameState,
        foundation: dragFoundation,
        tableau: dragTableau,
        waste: dragWaste,
      };
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

      if (to === LOCATIONS.FOUNDATION) {
        // so if the card we click is what the foundation want then there is should not add the whole deck to foundation
        if (moveCards.length > 1) return state;
        newFoundation[toIndex].push(...moveCards);
      } else if (to === LOCATIONS.TABLEAU)
        newTableau[toIndex].push(...moveCards);
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
  function handleDrag(e) {
    const cardDragged = e.active.data.current;
    const droppable = e.over.data.current;
    if (droppable && cardDragged) {
      const {
        location: fromLocation,
        pileIndex,
        cardIndex,
        card,
      } = cardDragged;
      const { index: toIndex, location: toLocation } = droppable;

      dispatch({
        type: ACTIONS.DRAG_CARD,
        payload: {
          fromLocation,
          pileIndex,
          cardIndex,
          card,
          toIndex,
          toLocation,
        },
      });
    }
  }
  return (
    <DndContext autoScroll={false} onDragEnd={(e) => handleDrag(e)}>
      <div className="inline-block w-full bg-green-800 p-6 font-mono text-white">
        <div className="mb-8 flex justify-between">
          <button onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Reset
          </button>
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
    </DndContext>
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

function Droppable({ children, id, data }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data,
  });

  const style = {
    color: isOver ? 'red' : undefined,
  };

  return (
    <div
      className="h-full w-full border border-red-400"
      ref={setNodeRef}
      style={style}
    >
      {children}
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
          {index === cards.length - 1 ? (
            <Droppable
              id={card.id}
              data={{ index: index, location: 'tableau' }}
            >
              <Card
                dispatch={dispatch}
                pileIndex={pileIndex}
                cardIndex={index}
                card={card}
                location={LOCATIONS.TABLEAU}
              />
            </Droppable>
          ) : (
            <Card
              dispatch={dispatch}
              pileIndex={pileIndex}
              cardIndex={index}
              card={card}
              location={LOCATIONS.TABLEAU}
            />
          )}
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
  return (
    <div className="flex gap-4">
      {foundation.map((pile, i) => (
        <div
          key={i}
          className="flex h-[90px] w-[60px] items-center justify-center rounded border border-white bg-gray-500 shadow-inner"
        >
          <Droppable id={i} data={{ index: i, location: 'foundation' }}>
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
          </Droppable>
        </div>
      ))}
    </div>
  );
}

function Draggable({ children, id, data, disabled = false }) {
  if (disabled) return children;

  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } =
    useDraggable({
      id,
      data,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        style={{ width: '20px', height: '20px', cursor: 'grab' }}
      >
        ⠿
      </div>
      {children}
    </div>
  );
}

function Card({ card, dispatch, location, pileIndex, cardIndex }) {
  const { value, suit, faceUp } = card;

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

  const data = { location, pileIndex, cardIndex, card };
  return (
    <Draggable id={card.id} data={data} disabled={!card.faceUp}>
      <div
        onClick={(e) => handleClick(e)}
        className={`flex h-[90px] w-[60px] items-center justify-center rounded border border-black bg-white shadow-md ${
          faceUp ? color : 'bg-blue-800'
        }`}
      >
        {faceUp ? (
          <span>
            {suit} {value}
          </span>
        ) : (
          '?'
        )}
      </div>
    </Draggable>
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
