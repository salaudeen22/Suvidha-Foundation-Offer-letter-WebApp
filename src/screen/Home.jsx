import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBarContext from "../ContextProvider/SidebarContext";
import axios from "axios";
import PieGraph from "../components/PieGraph"; // Assuming PieGraph component is correctly imported
import BarGraph from "../components/BarGraph";

function Home() {
  const [recentOfferLetters, setRecentOfferLetters] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const { sidebar } = useContext(SideBarContext);
  const [barGraphData, setBarGraphData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseRecent = await axios.get(
          "http://localhost:4000/api/recentofferLetters"
        );
        setRecentOfferLetters(responseRecent.data.data);

        const responsePieChart = await axios.get(
          "http://localhost:4000/api/countByDesignation"
        );
        setPieChartData(responsePieChart.data.data);
        const responseBarGraph = await axios.get(
          "http://localhost:4000/api/bargraphdata"
        );
        setBarGraphData(responseBarGraph.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={`Home ${sidebar ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Navbar />
      <div className="main-content">
        <div className="top">
          <div className="midleft">
            <h3>Recent Offer Letters</h3>
            <table className="offer-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>UID</th>
                </tr>
              </thead>
              <tbody>
                {recentOfferLetters.map((letter, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{letter.name}</td>
                    <td>{letter.designation}</td>
                    <td>{letter.uid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="TotalBox">
            <div className="title">Total Accepted Offer Letter </div>
            <hr />
            <div className="content">
              <h1>
                <span> 10</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="card">
            <div className="card-content">
              <PieGraph data={pieChartData} />
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <BarGraph data={barGraphData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;