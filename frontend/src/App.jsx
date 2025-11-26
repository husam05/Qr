import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/u/:slug" element={<PublicProfile />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
