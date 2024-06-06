import React, { useContext } from "react";
import SideBarContext from "../ContextProvider/SidebarContext";
import { FaListUl } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { FaCircleUser } from "react-icons/fa6";

function Navbar() {
  const { sidebar, setsidebar, signedIn, setSignedIn } =
    useContext(SideBarContext);

  const handleClick = (e) => {
    e.preventDefault();
    setsidebar(!sidebar);
  };

  return (
    <div className="navbar">
      <div className="navbar-state">
        <button className="close-btn" onClick={handleClick}>
          {sidebar ? <RxCross1 /> : <FaListUl />}
        </button>
        <h3 className="welcome-message">Welcome, username</h3>
      </div>

      <input
        type="text"
        className="search-input text-black"
        placeholder="Search..."
      />

      <div className="user-img">
        {signedIn ? (
          <FaCircleUser className="text-2xl cursor-pointer" />
        ) : (
          <Link
            to="/signin"
            onClick={() => {
              setsidebar(false);
            }}
            className="flex items-center"
          >
            <SlLogin className="text-lg mr-2" />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
