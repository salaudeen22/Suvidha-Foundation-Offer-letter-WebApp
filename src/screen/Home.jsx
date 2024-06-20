import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [totalOfferLetters, setTotalOfferLetters] = useState(0);
  const [currentWorkingOfferLetters, setCurrentWorkingOfferLetters] =
    useState(0);

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
    fetchTotalOfferLetters();
  }, []);
  const fetchTotalOfferLetters = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/totalOfferLetters"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch total offer letters");
      }
      const data = await response.json();
      setTotalOfferLetters(data.totalCount);
      // console.log(totalOfferLetters);
      // Fetch current working offer letters count
      const currentWorkingResponse = await fetch(
        "http://localhost:4000/api/currentWorkingOfferLetters"
      );
      if (!currentWorkingResponse.ok) {
        throw new Error("Failed to fetch current working offer letters");
      }
      const currentWorkingData = await currentWorkingResponse.json();
      setCurrentWorkingOfferLetters(currentWorkingData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={`Home ${sidebar ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Navbar />
      <div className="main-content">
        <div className="top">
          <div className="midleft">
            <div className="midCard">
              <div className="midCartitle">
                <h3>Recent Offer Letters</h3>
              </div>
              <hr />
              <div className="midCardTable">
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
              <div className="midCartBottom">
                <Link to="/offer-letter-management">View More</Link>
              </div>
            </div>
          </div>
          <div className="midright">
            <div className="TotalBox">
              <div className="title">Total Number of Employee </div>
              <hr />
              <div className="content">
                <h1>
                  <span> {totalOfferLetters}</span>
                </h1>
              </div>
            </div>
            <div className="TotalBox">
              <div className="title">Total No of employee Working </div>
              <hr />
              <div className="content">
                <h1>
                  <span> {currentWorkingOfferLetters}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="card-1">
            <div className="cardtitle">
              <h4>Employee Distribution</h4>
            </div>
            <hr />
            <div className="card-content">
              <PieGraph data={pieChartData} />
            </div>
          </div>
          <div className="card-2">
            <div className="cardtitle">
              <h4>Internship Role Distribution</h4>
            </div>
            <hr />
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
