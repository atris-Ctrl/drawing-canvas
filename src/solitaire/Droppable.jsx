import { useDroppable } from '@dnd-kit/core';

function Droppable({ children, id, data }) {
  const { setNodeRef } = useDroppable({
    id,
    data,
  });

  return (
    <div className="h-full w-full" ref={setNodeRef}>
      {children}
    </div>
  );
}

export default Droppable;
