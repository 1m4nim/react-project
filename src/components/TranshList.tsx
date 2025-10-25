import React from "react";
import { Todo } from "./types";

interface Props {
  trash: Todo[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const TrashList: React.FC<Props> = ({ trash, onRestore, onDelete }) => {
  return (
    <div className="trash-list-container">
      <h2>🗑️ ゴミ箱</h2>
      {trash.length === 0 ? (
        <p className="empty">ゴミ箱は空です。</p>
      ) : (
        <ul>
          {trash.map((todo) => (
            <li key={todo.id} className="slide-in">
              <span>{todo.text}</span>
              <div className="trash-buttons">
                <button onClick={() => onRestore(todo.id)}>復元</button>
                <button onClick={() => onDelete(todo.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrashList;
