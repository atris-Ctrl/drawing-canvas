import { useEffect, useReducer, useState } from 'react';
import {
  ACTIONS,
  GAME_STATE,
  init,
  LOCATIONS,
  findValidSpot,
  checkWin,
  canMoveFoundation,
  canMoveCard,
  cardSlotPaths,
  cardBackPaths,
  canMovePile,
} from './config';
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import Droppable from './Droppable';
import StopWatch from './StopWatch';
import Card from './Card';

//TODO:
// DRAG AND DROP FUNCTION
// drag multiple
// DRAW THREE / ONE IN DEAL
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
      console.log(action.payload);
      if (toLocation === LOCATIONS.FOUNDATION) {
        if (!canMoveFoundation(card, dragFoundation[toDestIndex])) return state;
      } else if (toLocation === LOCATIONS.TABLEAU) {
        const currentPile = dragTableau[toDestIndex];
        if (!canMovePile(card, currentPile)) return state;
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
      const resetState = init();
      return resetState;
    case ACTIONS.TICK:
      if (state.gameState !== GAME_STATE.RUNNING) return state;
      return { ...state, time: state.time + 1 };
    default:
      throw new Error('Unknown action type');
  }
}

function Solitaire() {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const { stock, tableau, foundation, waste, time, gameState, score } = state;
  function handleDrag({ active, over }) {
    console.log(active, over);
    if (active && over) {
      const cardDragged = active.data.current;
      const droppable = over.data.current;
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
    <DndContext
      autoScroll={false}
      onDragEnd={(e) => handleDrag(e)}
      sensors={sensors}
    >
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

        <ScoreAndTime
          score={score}
          time={time}
          dispatch={dispatch}
          gameState={gameState}
        />
      </div>
    </DndContext>
  );
}

function ScoreAndTime({ score, time, dispatch, gameState }) {
  return (
    <div className="mt-8 flex">
      <div>Score: {score} &nbsp;&nbsp;</div>
      <StopWatch time={time} dispatch={dispatch} gameState={gameState} />
    </div>
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
        const cardComponent = (
          <Card
            dispatch={dispatch}
            pileIndex={pileIndex}
            cardIndex={index}
            card={card}
            location={LOCATIONS.TABLEAU}
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
}

function Stock({ dispatch, stock }) {
  return (
    <div
      onClick={() => dispatch({ type: ACTIONS.DRAW })}
      className="flex h-[90px] w-[60px] items-center justify-center rounded shadow-md"
    >
      {stock.length === 0 ? (
        <img src={cardSlotPaths[0]}></img>
      ) : (
        <img src={cardBackPaths[0]}></img>
      )}
    </div>
  );
}

function Waste({ cards, dispatch }) {
  if (cards.length === 0) return null;
  const card = cards[0];

  return (
    <div className="relative h-[90px] w-[60px]">
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
    <div className="flex flex-shrink-0 gap-4">
      {foundation.map((pile, i) => (
        <div
          key={i}
          className="flex h-[90px] w-[60px] flex-shrink-0 items-center justify-center rounded shadow-inner"
        >
          <Droppable id={i} data={{ index: i, location: LOCATIONS.FOUNDATION }}>
            {pile.length === 0 ? (
              <img src={cardSlotPaths[2]}></img>
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

export default Solitaire;
