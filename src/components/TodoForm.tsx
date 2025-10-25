import React, { useState } from 'react';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="やることを入力"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        追加
      </button>
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '2px solid #555', 
    borderRadius: '4px', 
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    padding: '10px 16px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default TodoForm;
