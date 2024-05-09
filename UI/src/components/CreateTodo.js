import React, { useState } from 'react'

export const CreateTodo = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value) {
      addTodo(value);
      setValue('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder='Bir iş gir...' />
      <button type="submit" style={
        !value.length ? { backgroundColor: 'gray' } :{}
      } disabled={!value.length} className='todo-btn'>Ekle</button>
    </form>
  )
}
