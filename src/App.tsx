import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BloodBankProvider } from './contexts/BloodBankContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Donors from './pages/Donors';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <BloodBankProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/donors" element={<Donors />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BloodBankProvider>
    </AuthProvider>
  );
}

export default App;