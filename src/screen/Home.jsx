import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import SideBarContext from "../ContextProvider/SidebarContext";

function Home() {
  const offerLetters = [
    {
      slno: 1,
      name: "John Doe",
      designation: "Frontend",
      from: "01-01-2024",
      to: "31-12-2024",
      uid: "UID123",
      status: "Pending",
    },
    {
      slno: 2,
      name: "Jane Smith",
      designation: "Mern Stack",
      from: "15-01-2024",
      to: "14-01-2025",
      uid: "UID456",
      status: "Approved",
    },
  ];

  const pendingLetters = [
    { uid: "UID123", status: "Pending" },
    { uid: "UID789", status: "Pending" },
  ];
  const { sidebar } = useContext(SideBarContext);
  return (
    <div className={`Home ${sidebar ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Navbar />
      <div className="main-content">
        <div className="top">
          <div className="TotalBox">
            <div className="title">Total Accepted Offer Letter </div>
            <hr />
            <div className="content">
              <h1>
                <span> 10</span>
              </h1>
            </div>
          </div>
          <div className="TotalBox">
            <div className="title">Total Offer Letter Sent </div>
            <hr />
            <div className="content">
              <h1>
                <span> 45</span>
              </h1>
            </div>
          </div>
          <div className="TotalBox">
            <div className="title">Total Enrolled Student</div>
            <hr />
            <div className="content">
              <h1>
                <span> 50</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="middle">
          <div className="midleft">
            <h3>Release Offer Letter</h3>
            <table className="offer-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>From</th>
                  <th>To</th>
                  <th>UID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {offerLetters.map((letter, index) => (
                  <tr key={index}>
                    <td>{letter.slno}</td>
                    <td>{letter.name}</td>
                    <td>{letter.designation}</td>
                    <td>{letter.from}</td>
                    <td>{letter.to}</td>
                    <td>{letter.uid}</td>
                    <td>{letter.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="midright">
            <h3>Pending Letter</h3>
            <table className="pending-table">
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLetters.map((letter, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/details/${letter.uid}`}>{letter.uid}</Link>
                    </td>
                    <td>{letter.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
}

export default Home;
