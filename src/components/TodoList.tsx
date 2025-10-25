import React from "react";
import { Todo } from "../types";

interface Props {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  moveToTrash: (id: string) => void;
}

const TodoList: React.FC<Props> = ({ todos, toggleTodo, moveToTrash }) => {
  return (
    <div className="todo-list-container">
      <h2>📝 タスク一覧</h2>
      {todos.length === 0 ? (
        <p className="empty">タスクはありません。</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="slide-in">
              <span
                onClick={() => toggleTodo(todo.id)}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#999" : "#333",
                  cursor: "pointer",
                }}
              >
                {todo.text}
              </span>
              <button onClick={() => moveToTrash(todo.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
