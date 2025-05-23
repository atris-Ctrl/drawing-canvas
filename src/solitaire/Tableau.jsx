import Pile from './Pile';

function Tableau({ tableau, dispatch }) {
  return (
    <div className="flex justify-start gap-4">
      {tableau.map((cardPile, i) => (
        <Pile dispatch={dispatch} key={i} pileIndex={i} cards={cardPile} />
      ))}
    </div>
  );
}

export default Tableau;
