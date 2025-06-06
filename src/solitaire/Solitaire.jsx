import { useReducer, useRef, useState, useEffect } from 'react';
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
  createResetAction,
  createDealAction,
  restoreStock,
  calculateScore,
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
import Draggable from './Draggable';
// import Draggable from 'react-draggable';
import Modal from '../ui/Modal';
import { FaGithubAlt } from 'react-icons/fa';
import CardBackSelectionWindow from './CardSelection';
import ClosableWindow from '../ui/ClosableWindow';
import {
  restrictToFirstScrollableAncestor,
  restrictToParentElement,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { Draggable as ReactDraggable } from 'react-draggable';

//TODO:
// FIND THE POSSIBLE WINNABLE ARRANGEMENT
// UNDO

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
        score: state.score + scoreMap.FLIP_CARD,
      };

    case ACTIONS.DRAW:
      const { stock: drawStock, waste: drawWaste, drawNum } = state;
      if (drawStock.length === 0 && drawWaste.length > 0) {
        // Recycle waste back to stock (face down)
        const resetStock = restoreStock(drawWaste, drawNum);
        return {
          ...state,
          stock: resetStock,
          waste: [],
          score: state.score + scoreMap.DRAW_FINISH,
        };
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
      const totalScore = calculateScore(fromLocation, toLocation);

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
        gameState: currentGameState,
        foundation: dragFoundation,
        tableau: dragTableau,
        waste: dragWaste,
        score: state.score + totalScore,
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

      const addScore = calculateScore(from, to);
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
        score: state.score + addScore,
      };
    case ACTIONS.RESET:
      const resetState = init();
      return resetState;

    case ACTIONS.UNDO:
      return state;

    case ACTIONS.CHANGE_CARD:
      return { ...state, cardBack: action.payload };
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
  const overlayContainerRef = useRef();
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
  const {
    stock,
    tableau,
    foundation,
    waste,
    gameState,
    score,
    drawNum,
    cardBack,
  } = state;

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
    <>
      <Modal>
        <div style={{ position: 'relative' }}>
          <ClosableWindow
            icon="assets/solitaire/icon/sol.ico"
            menuItems={menuItems(dispatch)}
            title="Solitaire"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <DndContext
                autoScroll={false}
                onDragStart={(e) => handleDragStart(e)}
                onDragEnd={(e) => handleDrag(e)}
                sensors={sensors}
                modifiers={[]}
              >
                <div
                  ref={overlayContainerRef}
                  className="relative inline-block bg-[#007f00] font-mono text-white"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <div className="p-3">
                    <div className="mb-5 flex justify-between">
                      <div className="flex gap-4">
                        <Stock
                          stock={stock}
                          dispatch={dispatch}
                          cardBack={cardBack}
                        />
                        <Waste
                          cards={waste}
                          dispatch={dispatch}
                          drawNum={drawNum}
                        />
                      </div>
                      <Foundation foundation={foundation} dispatch={dispatch} />
                    </div>

                    <DragOverlay
                      container={overlayContainerRef.current}
                      dropAnimation={{
                        duration: 200,
                        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                      }}
                      style={{
                        zIndex: 900,
                      }}
                    >
                      {activeId.length > 0 && (
                        <Pile cards={activeId} pileIndex={0} />
                      )}
                    </DragOverlay>
                    <Tableau
                      cardBack={cardBack}
                      activeId={activeId}
                      tableau={tableau}
                      dispatch={dispatch}
                    />
                  </div>

                  <ScoreAndTime
                    score={score}
                    dispatch={dispatch}
                    gameState={gameState}
                    cardBack={cardBack}
                  />
                </div>
              </DndContext>
            </div>
          </ClosableWindow>
        </div>
      </Modal>
    </>
  );
}

const menuItems = (dispatch) => {
  return [
    {
      label: 'Game',
      underline: 'G',
      items: [
        {
          label: 'Reset',
          action: () => dispatch(createResetAction()),
        },
        {
          label: 'Draw 1',
          action: () => dispatch(createDealAction(1)),
        },
        {
          label: 'Draw 3',
          action: () => dispatch(createDealAction(3)),
        },
      ],
    },
    {
      label: 'Help',
      underline: 'H',
      items: [
        {
          label: 'Deck',
          action: () => <Modal.Open opens="settings"></Modal.Open>,
        },
        {
          label: (
            <span className="flex items-center gap-1">
              Github <FaGithubAlt />
            </span>
          ),
          href: 'https://github.com/atris-Ctrl',
        },
      ],
    },
  ];
};

export default Solitaire;
