import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import FinancialSummary from './pages/FinancialSummary';
import SideBar from './components/global-components/Sidebar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page without Sidebar */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Wrap all other routes inside SideBar */}
        <Route path="/*" element={<SideBar />} />
      </Routes>
    </Router>
  );
}

export default App;
