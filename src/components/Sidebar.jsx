import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import SideBarContext from "../ContextProvider/SidebarContext";

function Sidebar() {
  const { sidebar } = useContext(SideBarContext);
  const [openSections, setOpenSections] = useState({
    offerLetterManagement: false,
    templateManagement: false,
    candidateManagement: false,
    reportsAndAnalytics: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className={`sidebar ${sidebar ? 'visible' : 'hidden'}`}>
      <div className="logo">
        <h2>Suvidha Foundation</h2>
        <hr />
      </div>

      <ul className="menu">
        <Link to="/">
          <li>Dashboard</li>
        </Link>
        <Link to="/OfferletterManagement">
          <li
            onClick={() => toggleSection("offerLetterManagement")}
            className={openSections.offerLetterManagement ? "active" : ""}
          >
            <div id="liheader">
              Offer Letter Management
            </div>
          </li>
        </Link>
        <li
          onClick={() => toggleSection("templateManagement")}
          className={openSections.templateManagement ? "active" : ""}
        >
          <div id="liheader">
            Template Management
            <span className="icon">
              {openSections.templateManagement ? "^" : "^"}
            </span>
          </div>
          {openSections.templateManagement && (
            <ul className="submenu">
              <li>View Templates</li>
              <li>Create Template</li>
              <li>Edit Template</li>
            </ul>
          )}
        </li>
        <li
          onClick={() => toggleSection("reportsAndAnalytics")}
          className={openSections.reportsAndAnalytics ? "active" : ""}
        >
          <div id="liheader">
            Reports and Analytics
            <span className="icon">
              {openSections.reportsAndAnalytics ? "^" : "^"}
            </span>
          </div>
          {openSections.reportsAndAnalytics && (
            <ul className="submenu">
              <li>Offer Letter Statistics</li>
              <li>Acceptance Rates</li>
              <li>Candidate Reports</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
