import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Home from './screen/Home';
import OfferletterManagement from './screen/OfferletterManagement';
import SideBarContextProvider from './ContextProvider/SidebarContextProvider';
import Login from './screen/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className='Main'>
        <SideBarContextProvider>
          <ConditionalSidebar />
          <div className="Content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/offer-letter-management" element={<OfferletterManagement />} />
            </Routes>
          </div>
        </SideBarContextProvider>
      </div>
    </Router>
  );
}

function ConditionalSidebar() {
  const location = useLocation();
  const shouldShowSidebar = location.pathname !== '/';

  return shouldShowSidebar ? <Sidebar /> : null;
}

export default App;
