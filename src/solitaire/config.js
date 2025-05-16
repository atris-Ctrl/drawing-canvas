const suits = ['♠', '♥', '♦', '♣'];
export const numPiles = 7;
const numCards = 52;

export const ACTIONS = {
  DEAL: 'deal',
  DRAW: 'draw',
  MOVE_TO_FOUNDATION: 'move_to_foundation',
  MOVE_CARD: 'move_card',
  TICK: 'tick',
};

export const GAME_STATE = {
  IDLE: 'idle',
  RUNNING: 'running',
  WIN: 'win',
};

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

export function canMoveCard(card, topCard) {
  const isDifferent = isBlack(card.suit) !== isBlack(topCard.suit);
  const isNextNumber = card.value === topCard.value - 1;
  return isDifferent && isNextNumber;
}

function canMovePile(card, pile) {
  const { value } = card;

  if (pile.length === 0 && value === 13) return true;

  const topCard = pile[pile.length - 1];
  return canMoveCard(card, topCard);
}

export function canMoveFoundation(card, pile) {
  const { value, suit } = card;
  if (pile.length === 0) {
    return value === 1;
  }
  const topCard = pile[pile.length - 1];
  return canMoveCard(card, topCard);
}

export function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const deck = [];

  suits.forEach((suit) => {
    for (let val = 1; val <= 13; val++) {
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

export function init(initialState) {
  const deck = createDeck();
  const tableau = Array(numPiles)
    .fill(null)
    .map(() => []);
  for (let i = 0; i < numPiles; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      card.faceUp = i === j; // only top card face up
      tableau[i].push(card);
    }
  }

  return { ...initialState, stock: deck, tableau };
}
