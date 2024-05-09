import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/Login';
import { TodoWrapper } from './components/TodoWrapper';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<TodoWrapper />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
