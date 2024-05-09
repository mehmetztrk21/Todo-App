import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CreateTodo } from "./CreateTodo";
import { EditTodo } from "./EditTodo";
import { Todo } from "./Todo";
export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  const getTodos = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    }
    await api.get("/todos", {
      params: {
        userId: userId
      }
    }).then((response) => {
      if (response.status == 200) {
        setTodos(response.data);
      }
      else setTodos([]);
    }).catch((error) => {
      alert('Hata oluştu!');
      alert(error.response?.data || 'Hata oluştu!');
    });
  }
  const addTodo = async (todo) => {
    await api.post("/todos", {
      userId: localStorage.getItem('userId'),
      todo: todo
    }).then(async (response) => {
      if (response.status == 201) {
        await getTodos();
      }
      else alert('Hata oluştu!');
    }).catch((error) => {
      console.log(error);
      alert(error.response?.data || 'Hata oluştu!');
    });
  }

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`).then(async (response) => {
      if (response.status == 200) {
        await getTodos();
      }
      else alert('Hata oluştu!');
    }).catch((error) => {
      console.log(error);
      alert(error.response?.data || 'Hata oluştu!');
    });
  }

  const toggleComplete = async (id) => {
    let todo = todos.find((todo) => todo.Id === id);
    if (!todo) return;
    await api.put("todos", {
      id: id,
      isCompleted: !todo.IsCompleted,
      todo: todo.Todo
    }).then(async (response) => {
      if (response.status == 200) {
        await getTodos();
      }
      else alert('Hata oluştu!');
    }).catch((error) => {
      console.log(error);
      alert(error.response?.data || 'Hata oluştu!');
    });

  }

  const editTodo = (id) => {
    setTodos(
      todos?.map((todo) =>
        todo.Id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  }

  const editTask = async (task, id, isCompleted) => {
    await api.put(`/todos`, {
      id: id,
      todo: task,
      isCompleted: isCompleted
    }).then(async (response) => {
      if (response.status == 200) {
        await getTodos();
      }
      else alert('Hata oluştu!');
    }).catch((error) => {
      console.log(error);
      alert(error.response?.data || 'Hata oluştu!');
    });
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    }
    else {
      setIsLogged(true);
      getTodos();
    }
  }, []);
  if (!isLogged) return null;
  return (
    <>

      <div className="TodoWrapper">
        <h1>İş Listem 🧑‍💼</h1>
        <CreateTodo addTodo={addTodo} />
        {todos?.map((todo) =>
          todo.isEditing ? (
            <EditTodo editTodo={editTask} task={todo} />
          ) : (
            <Todo
              key={todo.Id}
              task={todo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              toggleComplete={toggleComplete}
            />
          )
        )}
      </div>
      <div className="logout-container">
        <button className="logout-button" onClick={logOut}>Çıkış Yap</button>
      </div>
    </>

  );
};
