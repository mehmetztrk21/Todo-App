import React, { useState } from 'react'

export const EditTodo = ({ editTodo, task }) => {
  const [value, setValue] = useState(task.Todo);

  const handleSubmit = (e) => {
    e.preventDefault();
    editTodo(value, task.Id,task.IsCompleted);
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder='İş Güncelleme' />
      <button type="submit" className='todo-btn'>Güncelle</button>
    </form>
  )
}
