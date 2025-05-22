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
  DEAL_NUM: 'deal_num',
};

export const createMoveAction = (location, card, pileIndex, cardIndex) => ({
  type: ACTIONS.MOVE_CARD,
  payload: { from: location, card, pileIndex, cardIndex },
});
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

export const LOCATIONS = {
  TABLEAU: 'tableau',
  FOUNDATION: 'foundation',
  WASTE: 'waste',
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
  if (!card.faceUp) return;
  // MOVE TO FOUNDATION
  for (let col = 0; col < foundation.length; col++) {
    const deck = foundation[col];
    if (canMoveFoundation(card, deck)) {
      return { location: LOCATIONS.FOUNDATION, index: col };
    }
  }
  // MOVE TO ANOTHER PILE
  for (let col = 0; col < tableau.length; col++) {
    const currentPile = tableau[col];
    if (canMovePile(card, currentPile))
      return {
        location: LOCATIONS.TABLEAU,
        index: col,
      };
  }
  return null;
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
    gameState: GAME_STATE.READY,
    score: 0,
    time: 0,
    drawNum: 1,
  };
}
export const initialState = {
  stock: [],
  waste: [],
  foundation: [[], [], [], []],
  tableau: [[], [], [], [], [], [], []],
  score: 0,
  time: 0,
  drawNum: 1,
  gameState: GAME_STATE.IDLE,
};
