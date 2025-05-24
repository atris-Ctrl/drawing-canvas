import CardImage from './CardComponent/CardImage';
import { cardBackPaths } from './config';

function CardBackSelectionWindow() {
  const array = [0, 1, 2, 3];
  return (
    <div>
      {array.map((path) => (
        <>
          <input type="radio" name="fd" value={path} /> {path}
          {/* <CardImage></CardImage> */}
        </>
      ))}
    </div>
  );
}

export default CardBackSelectionWindow;
