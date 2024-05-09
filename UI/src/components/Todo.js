import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  return (
    <div className="Todo" style={!task.IsCompleted ? { borderLeft: "5px solid blue" } : { borderLeft: "5px solid green" }}>
      <p className={`${task.IsCompleted ? "completed" : "incompleted"}`} onClick={() => toggleComplete(task.Id)}>{task.Todo}</p>
      <div>
        {!task.IsCompleted ? (
          <>
            <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => editTodo(task.Id)} />
            <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => deleteTodo(task.Id)} />
            <FontAwesomeIcon className="complete-icon" icon={faCheckCircle} onClick={() => toggleComplete(task.Id)} />
          </>
        ) : (
          <FontAwesomeIcon style={{ color: "green" }} icon={faCheckCircle} onClick={() => toggleComplete(task.Id)} />
        )}
      </div>
    </div>
  )
}
