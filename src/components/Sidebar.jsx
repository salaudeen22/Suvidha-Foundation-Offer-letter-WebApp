import React, { useContext, useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideBarContext from "../ContextProvider/SidebarContext";
import Swal from "sweetalert2";
function Sidebar() {
  const { sidebar,setsidebar } = useContext(SideBarContext);
  const [openSections, setOpenSections] = useState({
    offerLetterManagement: false,
    templateManagement: false,
    candidateManagement: false,
    reportsAndAnalytics: false,
  });
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Logout Successfully!",

      icon: "success",
    });

    localStorage.clear();
    navigate("/");
  };
  

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className={`sidebar ${sidebar ? 'visible' : 'hidden'}`}>
      <div className="siderLogo">
        <h2>Suvidha Foundation</h2>
      </div>

      <ul className="menu">
        <Link to="/home">
          <li>Dashboard</li>
        </Link>
        <Link to="/offer-letter-management">
          <li
            onClick={() => toggleSection("offerLetterManagement")}
            className={openSections.offerLetterManagement ? "active" : ""}
          >
            <div id="liheader">Offer Letter Management</div>
          </li>
        </Link>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
