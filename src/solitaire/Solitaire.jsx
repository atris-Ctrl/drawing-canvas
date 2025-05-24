import { useReducer, useState } from 'react';
import {
  ACTIONS,
  GAME_STATE,
  init,
  LOCATIONS,
  findValidSpot,
  checkWin,
  canMoveFoundation,
  canMovePile,
  scoreMap,
  createDragAction,
} from './config';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import ScoreAndTime from './ScoreAndTime';
import Pile from './Pile';
import Waste from './Waste';
import Foundation from './Foundation';
import Stock from './Stock';
import Tableau from './Tableau';
import Window from '../components/desktop/Window';
import Draggable from 'react-draggable';

//TODO:
// DRAG AND DROP FUNCTION
// DEAL THREE FUNCTION WEIRD ARRANGEMNET
// FIND THE POSSIBLE WINNABLE ARRANGEMENT
// UNDO
// drag multiple
// SCORE FUNCTION

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
      return {
        ...state,
        tableau: newFlipTableau,
        gameState: GAME_STATE.RUNNING,
      };

    case ACTIONS.DRAW:
      const { stock: drawStock, waste: drawWaste, drawNum } = state;
      if (drawStock.length === 0 && drawWaste.length > 0) {
        // Recycle waste back to stock (face down)
        const resetStock = drawWaste.map((card) => ({
          ...card,
          faceUp: false,
        }));
        return { ...state, stock: resetStock, waste: [] };
      }

      if (drawStock.length > 0) {
        const numToDraw = Math.min(drawNum, drawStock.length);
        const newStock = [...drawStock];
        const drawnCards = newStock
          .splice(-numToDraw)
          .map((card) => ({ ...card, faceUp: true }))
          .reverse();

        return {
          ...state,
          stock: newStock,
          waste: [...drawnCards, ...drawWaste],
          gameState: GAME_STATE.RUNNING,
        };
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
      let totalScore = 0;

      if (toLocation === LOCATIONS.FOUNDATION) {
        if (!canMoveFoundation(card, dragFoundation[toDestIndex])) return state;
      } else if (toLocation === LOCATIONS.TABLEAU) {
        const currentPile = dragTableau[toDestIndex];
        if (!canMovePile(card, currentPile)) return state;
      }

      if (fromLocation === LOCATIONS.TABLEAU) {
        const newPile = [...dragTableau[pileIndex]];

        dragMoveCards = newPile.splice(fromCardIndex);

        dragTableau[pileIndex] = newPile;
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
        // gameState: currentGameState,
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
      else if (from === LOCATIONS.FOUNDATION) newFoundation[fromIndex].pop();

      if (to === LOCATIONS.FOUNDATION) {
        // so if the card we click is what the foundation want then there is should not add the whole deck to foundation
        if (moveCards.length > 1) return state;
        newFoundation[toIndex].push(...moveCards);
      } else if (to === LOCATIONS.TABLEAU)
        newTableau[toIndex].push(...moveCards);
      const isWin = checkWin(newFoundation);

      const newGameState = isWin ? GAME_STATE.WIN : GAME_STATE.RUNNING;
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

    case ACTIONS.DEAL_NUM:
      const deal = action.payload;
      const reset = init();
      return { ...reset, drawNum: deal };
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
        distance: 5,
      },
    }),
  );

  const [activeId, setActiveId] = useState([]);
  const { stock, tableau, foundation, waste, time, gameState, score, drawNum } =
    state;
  function handleDragStart({ active }) {
    if (!active) return;
    const { card, cardIndex, location, pileIndex } = active.data.current;
    if (location === LOCATIONS.TABLEAU) {
      const currentPile = tableau[pileIndex];
      const selectedCard = currentPile.slice(cardIndex, currentPile.length);
      setActiveId((ids) => [...ids, ...selectedCard]);
    }

    if (location === LOCATIONS.FOUNDATION || location === LOCATIONS.WASTE) {
      setActiveId([card]);
    }
  }

  function handleDrag({ active, over }) {
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
      dispatch(
        createDragAction(
          fromLocation,
          pileIndex,
          cardIndex,
          card,
          toIndex,
          toLocation,
        ),
      );
    }
    setTimeout(() => setActiveId([]), 200);
  }

  return (
    <Window title="Solitaire">
      <DndContext
        autoScroll={false}
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={(e) => handleDrag(e)}
        sensors={sensors}
      >
        <div>
          <ScoreAndTime
            score={score}
            dispatch={dispatch}
            gameState={gameState}
          />
        </div>
        <div className="inline-block bg-[#007f00] p-6 font-mono text-white">
          <div className="mb-8 flex justify-between">
            <div className="flex gap-4">
              <Stock stock={stock} dispatch={dispatch} />
              <Waste cards={waste} dispatch={dispatch} drawNum={drawNum} />
            </div>
            <Foundation foundation={foundation} dispatch={dispatch} />
          </div>

          <DragOverlay>
            {activeId.length > 0 && <Pile cards={activeId} pileIndex={0} />}
          </DragOverlay>
          <Tableau activeId={activeId} tableau={tableau} dispatch={dispatch} />
        </div>
      </DndContext>
    </Window>
  );
}

export default Solitaire;
