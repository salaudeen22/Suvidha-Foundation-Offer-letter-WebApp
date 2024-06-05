import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import SideBarContext from '../ContextProvider/SidebarContext';

function Home() {
  const { sidebar } = useContext(SideBarContext);
  return (
    <div className={`Home ${sidebar ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      <Navbar />
      Dashboard
    </div>
  );
}

export default Home;
