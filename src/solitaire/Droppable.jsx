import { useDroppable } from '@dnd-kit/core';

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
      className="h-full w-full border"
      ref={setNodeRef}
      //   style={style}
    >
      {children}
    </div>
  );
}

export default Droppable;
