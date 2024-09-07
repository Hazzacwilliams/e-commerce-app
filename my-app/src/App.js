import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './pages/Register';
import ChooseSignIn from './pages/ChooseSignIn';
import HomeLoggedIn from './pages/HomeLoggedIn';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChooseSignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><HomeLoggedIn /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>

  );
}

export default App;
