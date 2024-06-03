import React from "react";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-state">
        <button className="close-btn">x</button>
        <h3 className="welcome-message">Welcome, username</h3>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search..."
      />

      <div className="user-img">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="User"
          height="40px"
          width="40px"
        />
      </div>
    </div>
  );
}

export default Navbar;
