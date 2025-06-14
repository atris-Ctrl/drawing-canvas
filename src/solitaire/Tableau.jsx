import Pile from './Pile';

function Tableau({ cardBack, tableau, dispatch, activeId }) {
  return (
    <div className="flex justify-start gap-4">
      {tableau.map((cardPile, i) => (
        <Pile
          cardBack={cardBack}
          dispatch={dispatch}
          key={i}
          pileIndex={i}
          cards={cardPile}
          activeId={activeId}
        />
      ))}
    </div>
  );
}

export default Tableau;
