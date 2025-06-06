import { useDroppable } from '@dnd-kit/core';

function Droppable({ children, id, data }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
  });

  return (
    <div 
      className="h-[90px] w-[60px] border-2 border-red-500"
      ref={setNodeRef}
      style={{
        position: 'relative',
        zIndex: isOver ? 100 : 1,
        pointerEvents: 'auto',
      }}
    >
      {children}
    </div>
  );
}

export default Droppable;
