import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screen/Home';
import OfferletterManagement from './screen/OfferletterManagement';
import SideBarContextProvider from './ContextProvider/SidebarContextProvider';

function App() {
  return (
    <Router>
      <div className='Main'>
        <SideBarContextProvider>
          <Sidebar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/OfferletterManagement" element={<OfferletterManagement />} />
          </Routes>
        </SideBarContextProvider>
      </div>
    </Router>
  );
}

export default App;
