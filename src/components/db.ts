import { openDB } from "idb";
import { Todo } from "./types";

export const dbPromise = openDB("todo-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("todos")) {
      db.createObjectStore("todos", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("trash")) {
      db.createObjectStore("trash", { keyPath: "id" });
    }
  },
});

export const dbActions = {
  addTodo: async (todo: Todo) => (await dbPromise).put("todos", todo),
  getTodos: async () => (await dbPromise).getAll("todos"),
  deleteTodo: async (id: string) => (await dbPromise).delete("todos", id),

  moveToTrash: async (todo: Todo) => {
    const db = await dbPromise;
    await db.put("trash", todo);
    await db.delete("todos", todo.id);
  },
  restoreTodo: async (todo: Todo) => {
    const db = await dbPromise;
    await db.put("todos", todo);
    await db.delete("trash", todo.id);
  },
  getTrash: async () => (await dbPromise).getAll("trash"),
  deleteFromTrash: async (id: string) => (await dbPromise).delete("trash", id),
};
