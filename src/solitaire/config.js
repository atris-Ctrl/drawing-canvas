const suits = ['♠', '♥', '♦', '♣'];
export const numPiles = 7;
const numCards = 52;
const cardPath = 'assets/solitaire/cards';
export const cardPaths = {};
export const cardBackPaths = {};
export const cardSlotPaths = {};

////////////////////
for (let i = 0; i <= 11; i++) {
  cardBackPaths[i] = `${cardPath}/Back/CardBack_${i}.png`;
}
for (let i = 0; i < 3; i++) {
  cardSlotPaths[i] = `${cardPath}/Slot/CardSlot_${i}.png`;
}

suits.forEach((suit) => {
  for (let val = 0; val < 13; val++) {
    const suitName =
      suit === '♠'
        ? 'Spade'
        : suit === '♥'
          ? 'Heart'
          : suit === '♦'
            ? 'Diamond'
            : 'Club';
    const cardName = `${suitName}_${val}`;
    cardPaths[`${suit}-${val}`] = `${cardPath}/${suitName}/${cardName}.png`;
  }
});

//////////////////////////////
export const ACTIONS = {
  DRAW: 'draw',
  MOVE_CARD: 'move_card',
  FLIP_CARD: 'flip_card',
  DRAG_CARD: 'drag_card',
  TICK: 'tick',
  RESET: 'reset',
  UNDO: 'undo',
  DEAL_NUM: 'deal_num',
  CHANGE_CARD: 'change_card',
};

export const createMoveAction = (location, card, pileIndex, cardIndex) => ({
  type: ACTIONS.MOVE_CARD,
  payload: { from: location, card, pileIndex, cardIndex },
});
export const createChangeDeckAction = (key) => ({ type: ACTIONS.CHANGE_CARD, payload: Number(key) })
export const createDrawAction = () => ({ type: ACTIONS.DRAW });
export const createDragAction = (
  fromLocation,
  pileIndex,
  cardIndex,
  card,
  toIndex,
  toLocation,
) => ({
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
export const createFlipAction = (pileIndex, cardIndex, location) => ({
  type: ACTIONS.FLIP_CARD,
  payload: { pileIndex, cardIndex, location },
});
export const createResetAction = () => ({ type: ACTIONS.RESET });
export const createDealAction = (number) => ({
  type: ACTIONS.DEAL_NUM,
  payload: number,
});

////////////////////////////////////////
export const scoreMap = {
  MOVE_CARD: {
    WASTE_TO_TABLEAU: 5,
    WASTE_TO_FOUNDATION: 10,
    TABLEAU_TO_FOUNDATION: 10,
    FOUNDATION_TO_TABLEAU: -15,
  },
  FLIP_CARD: 10,
  DRAW_FINISH: -100,
};

export function calculateScore(from, to) {
  const key = `${from}_TO_${to}`;
  return scoreMap.MOVE_CARD[key] ?? 0;
}

export const LOCATIONS = {
  TABLEAU: 'TABLEAU',
  FOUNDATION: 'FOUNDATION',
  WASTE: 'WASTE',
};

export const GAME_STATE = {
  IDLE: 'idle',
  RUNNING: 'running',
  WIN: 'win',
};

export const ItemTypes = {
  CARD: 'card',
  LIST: 'list',
};

export function restoreStock(drawWaste, drawNum) {
  const restored = [];
  for (let i = 0; i < drawWaste.length; i += drawNum) {
    const group = drawWaste.slice(i, i + drawNum);
    restored.push(...group.reverse());
  }

  const resetStock = restored.map((card) => ({
    ...card,
    faceUp: false,
  }));
  return resetStock;
}

export function isBlack(suit) {
  if (suit === '♥' || suit === '♦') return false;
  return true;
}
export function isFaceUp(card) {
  return card.isFaceUp;
}

function canMoveCard(card, topCard) {
  if (!card.faceUp || !topCard.faceUp) return false;
  const isDifferent = isBlack(card.suit) !== isBlack(topCard.suit);
  const isNextNumber = card.value === topCard.value - 1;
  return isDifferent && isNextNumber;
}

export function findValidSpot(card, tableau, foundation) {
  const validSpots = findAllValidSpots(card, tableau, foundation);
  return validSpots?.[0] ?? null;
}

export function findAllValidSpots(card, tableau, foundation) {
  if (!card.faceUp) return;
  const allValidSpot = [];
  // MOVE TO FOUNDATION
  for (let col = 0; col < foundation.length; col++) {
    const deck = foundation[col];
    if (canMoveFoundation(card, deck)) {
      allValidSpot.push({ location: LOCATIONS.FOUNDATION, index: col });
    }
  }
  // MOVE TO ANOTHER PILE
  for (let col = 0; col < tableau.length; col++) {
    const currentPile = tableau[col];
    if (canMovePile(card, currentPile))
      allValidSpot.push({
        location: LOCATIONS.TABLEAU,
        index: col,
      });
  }
  return allValidSpot;
}

export function canMovePile(card, pile) {
  const { value } = card;

  if (pile.length === 0)
    if (value === 12) return true;
    else return false;

  const topCard = pile[pile.length - 1];
  return canMoveCard(card, topCard);
}

export function canMoveFoundation(card, pile) {
  const { value, suit } = card;
  if (pile.length === 0) {
    return value === 0;
  }
  const topCard = pile[pile.length - 1];

  return suit === topCard.suit && value === topCard.value + 1;
}

export function checkWin(foundation) {
  const cardsInFoundation = foundation.reduce(
    (acc, pile) => acc + pile.length,
    0,
  );
  return numCards === cardsInFoundation;
}

export function getFinalScore(score, time) {
  return (score * 700000) / time;
}

export function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const deck = [];

  suits.forEach((suit) => {
    for (let val = 0; val < 13; val++) {
      deck.push({
        suit,
        value: val,
        faceUp: false,
        id: `${suit}-${val}`,
      });
    }
  });
  return deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function init() {
  const deck = createDeck();
  const tableau = Array(numPiles)
    .fill(null)
    .map(() => []);
  for (let i = 0; i < numPiles; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      card.faceUp = i === j;
      tableau[i].push(card);
    }
  }

  return {
    stock: deck,
    tableau,
    foundation: [[], [], [], []],
    waste: [],
    gameState: GAME_STATE.IDLE,
    score: 0,
    time: 0,
    drawNum: 1,
    cardBack: 0,
  };
}
// export const initialState = {
//   stock: [],
//   waste: [],
//   foundation: [[], [], [], []],
//   tableau: [[], [], [], [], [], [], []],
//   score: 0,
//   time: 0,
//   drawNum: 1,
//   gameState: GAME_STATE.RUNNING,
// };

export function getValidMoves(gameState) {
  // for all top cards in tableau and foundation and waste and stock
  const allMoves = [];
  const { stock, foundation, waste, tableau } = gameState;

  for (let pile of foundation) {
    if (pile.length === 0) continue;

    const topCard = pile[pile.length - 1];
    const validSpots = findAllValidSpots(topCard, tableau, foundation);
  }

  return allMoves;
}

function serializeGameState(state) {
  return JSON.stringify({
    tableau: state.tableau.map(
      (card) => `${card.suit}${card.value}${card.faceUp ? 'U' : 'D'}`,
    ),
    stock: state.stock.map((card) => `${card.suit}${card.value}`),
    waste: state.waste.map((card) => `${card.suit}${card.value}`),
  });
}
function isWinning(gameState) {
  return checkWin(gameState.foundation);
}

function simulateMove(gameState, move) {}

export function isWinnable(gameState, visitedStates = new Set()) {
  if (isWinning(gameState)) return true;
  const key = serializeGameState(gameState);
  if (visitedStates.has(key)) return false;

  visitedStates.add(key);
  const possibleMoves = getValidMoves(gameState);

  for (let move of possibleMoves) {
    const nextState = simulateMove(gameState, move);
    if (isWinnable(nextState, visitedStates)) return true;
  }
  return false;
}
