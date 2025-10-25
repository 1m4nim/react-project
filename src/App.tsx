import "antd/dist/reset.css";
import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";
import { Input, Button, List, Card, Typography, Space, message } from "antd";
import { DeleteOutlined, RollbackOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Todo {
  id: string;
  text: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [trash, setTrash] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("todo-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("todos")) {
            db.createObjectStore("todos", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("trash")) {
            db.createObjectStore("trash", { keyPath: "id" });
          }
        },
      });

      const todosData = await db.getAll("todos");
      const trashData = await db.getAll("trash");
      setTodos(todosData);
      setTrash(trashData);
    };
    initDB();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const db = await openDB("todo-db", 1);
    const newTodo = { id: uuidv4(), text: input };
    await db.put("todos", newTodo);
    setTodos([...todos, newTodo]);
    setInput("");
    message.success("🎀 タスクを追加しました！");
  };

  const moveToTrash = async (id: string) => {
    const db = await openDB("todo-db", 1);
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await db.put("trash", todo);
      await db.delete("todos", id);
      setTodos(todos.filter((t) => t.id !== id));
      setTrash([...trash, todo]);
      message.info("🗑️ ゴミ箱へ移動しました");
    }
  };

  const restoreTodo = async (id: string) => {
    const db = await openDB("todo-db", 1);
    const item = trash.find((t) => t.id === id);
    if (item) {
      await db.put("todos", item);
      await db.delete("trash", id);
      setTrash(trash.filter((t) => t.id !== id));
      setTodos([...todos, item]);
      message.success("🌸 復元しました！");
    }
  };

  const deletePermanently = async (id: string) => {
    const db = await openDB("todo-db", 1);
    await db.delete("trash", id);
    setTrash(trash.filter((t) => t.id !== id));
    message.warning("💔 完全に削除しました");
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} variant="outlined" body-Style={{ padding: "24px 28px" }}>
        <Title level={2} style={styles.title}>
          🎀 やることリスト 🎀
        </Title>

        <Space.Compact style={{ width: "100%", marginBottom: "20px" }}>
          <Input
            value={input}
            placeholder="やることを入力してください"
            onChange={(e) => setInput(e.target.value)}
            style={{ borderRadius: "8px 0 0 8px" }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addTodo}
            style={{
              backgroundColor: "#ffadd2",
              borderColor: "#ffadd2",
              borderRadius: "0 8px 8px 0",
            }}
          >
            追加
          </Button>
        </Space.Compact>

        <Title level={4} style={{ color: "#73d13d" }}>
          🌷 やること
        </Title>
        <List
          bordered
          dataSource={todos}
          locale={{ emptyText: "✨ まだやることはありません ✨" }}
          renderItem={(item) => (
            <List.Item
              style={styles.listItem}
              actions={[
                <Button icon={<DeleteOutlined />} danger onClick={() => moveToTrash(item.id)}>
                  ゴミ箱へ
                </Button>,
              ]}
            >
              {item.text}
            </List.Item>
          )}
        />

        <Title level={4} style={{ color: "#ff7875", marginTop: "32px" }}>
          🗑️ ゴミ箱
        </Title>
        <List
          bordered
          dataSource={trash}
          locale={{ emptyText: "💫 ゴミ箱は空です 💫" }}
          renderItem={(item) => (
            <List.Item
              style={styles.trashItem}
              actions={[
                <Button
                  icon={<RollbackOutlined />}
                  type="default"
                  onClick={() => restoreTodo(item.id)}
                >
                  復元
                </Button>,
                <Button
                  icon={<CloseOutlined />}
                  type="primary"
                  danger
                  onClick={() => deletePermanently(item.id)}
                >
                  削除
                </Button>,
              ]}
            >
              {item.text}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff0f6 0%, #e6f7ff 100%)",
    padding: "50px",
  },
  card: {
    width: "100%",
    maxWidth: "640px",
    backgroundColor: "#fffafc",
    borderRadius: "20px",
    boxShadow: "0 6px 20px rgba(255, 182, 193, 0.3)",
  },
  title: {
    textAlign: "center",
    color: "#ff85c0",
    marginBottom: "24px",
  },
  listItem: {
    backgroundColor: "#fff0f6",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  trashItem: {
    backgroundColor: "#fff2e8",
    borderRadius: "8px",
    marginBottom: "8px",
  },
};

export default App;
