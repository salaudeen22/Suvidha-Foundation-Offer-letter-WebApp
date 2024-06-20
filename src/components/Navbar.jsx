import React, { useContext } from "react";
import SideBarContext from "../ContextProvider/SidebarContext";
import ham from '../Assessts/menu.png'

function Navbar() {
  const { sidebar, setsidebar } = useContext(SideBarContext);

  const handleClick = (e) => {
    e.preventDefault();
    setsidebar(!sidebar);
    console.log(sidebar);
  };
  const username=localStorage.getItem("userName");

  return (
    <div className="navbar">
      <div className="navbar-state">
        <button className="close-btn" onClick={handleClick}><img src={ham} alt="" srcset="" /></button>
        <h3 className="welcome-message">Welcome, {username}</h3>
      </div>

      {/* <input
        type="text"
        className="search-input"
        placeholder="Search..."
      /> */}

      <div className="user-img">
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="User"
          height="40px"
          width="40px"
        /> */}
        <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM7vNLb7DLGkqB26WLYGjp89xhYrFWOVZ1ow&s" alt="Suvidha Foundation" className="logo" />
      </div>
    </div>
  );
}

export default Navbar;
