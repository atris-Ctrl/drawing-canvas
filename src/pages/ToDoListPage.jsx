import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthProvider";
import Window from "../components/desktop/Window";
import Draggable, { DraggableCore } from "react-draggable";

function ToDoListPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const userTodosRef = collection(db, "todos", user.uid, "items");
      const querySnapshot = await getDocs(userTodosRef);
      const todosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return;

    try {
      const userTodosRef = collection(db, "todos", user.uid, "items");
      await addDoc(userTodosRef, {
        text: newTodo,
        completed: false,
      });
      setNewTodo("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleComplete = async (todoId, completed) => {
    try {
      const userTodoRef = doc(db, "todos", user.uid, "items", todoId);
      await updateDoc(userTodoRef, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const userTodoRef = doc(db, "todos", user.uid, "items", todoId);
      await deleteDoc(userTodoRef);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (!user) {
    return <div>Please log in to see your to-do list.</div>;
  }

  return (
    <Draggable>
      <div>
        <Window title="Your To-Do List">
          <h1>Your To-Do List</h1>
          <div>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
            />
            <button onClick={handleAddTodo}>Add</button>
          </div>
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                />
                {todo.text}
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </Window>
      </div>
    </Draggable>
  );
}

export default ToDoListPage;
