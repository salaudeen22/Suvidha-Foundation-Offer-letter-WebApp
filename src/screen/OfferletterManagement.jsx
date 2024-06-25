import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEye, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import SideBarContext from "../ContextProvider/SidebarContext";
import Swal from "sweetalert2";
import FormOverlay from "../components/FormOverlay";
import { pdfjs } from "react-pdf";
import UpdateFormOverlay from "../components/UpdateFormOverlay";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function OfferletterManagement() {
  const { sidebar } = useContext(SideBarContext);
  const [numLetters, setNumLetters] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentLetters, setRecentLetters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [FetchData, setFetchData] = useState({
    name: "",
    email: "",
    designation: "",
    from: "",
    to: "",
    uid: "",
    paid: "unpaid",
  });
  const [editForm, setEditForm] = useState(false);

  const handleNumLettersChange = (e) => {
    setNumLetters(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  function formatDate(dateString) {
    const options = { day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  const handleEdit = async (refNo) => {
    try {
      const response = await fetch(`http://localhost:4000/api/fetchofferLetters/${refNo}`);
      if (!response.ok) {
        throw new Error("Failed to fetch UID data");
      }

      const result = await response.json();
      const data = result.data;

      if (data && data.name && data.email && data.designation && data.from && data.to && data.uid && data.paid) {
        setFetchData({
          name: data.name,
          email: data.email,
          designation: data.designation,
          from: data.from,
          to: data.to,
          uid: data.uid,
          paid: data.paid,
        });
        setEditForm(true);
      } else {
        console.error("Fetched data is incomplete:", data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleView = async (refNo) => {
    try {
      const response = await fetch(`http://localhost:4000/api/view/${refNo}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF for UID: ${refNo}`);
      }
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setShowPdfViewer(true);
    } catch (error) {
      console.error("Error viewing PDF:", error.message);
      Swal.fire({
        title: "Error",
        text: `Failed to fetch PDF for UID: ${refNo}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/offerLetters");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRecentLetters(data.data);
    } catch (error) {
      console.error("Error fetching offer letters:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendMail = (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:4000/api/sendMail/${uid}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send email");
          }

          Swal.fire({
            title: "Email Sent!",
            text: "Your offer letter has been sent successfully.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error sending email:", error.message);
          Swal.fire({
            title: "Error",
            text: "Failed to send email. Please try again later.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  const filteredLetters = recentLetters
    .filter(
      (letter) =>
        letter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.uid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, numLetters);

  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * numLetters;
  const indexOfFirstItem = indexOfLastItem - numLetters;
  const currentItems = filteredLetters.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLetters.length / numLetters);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`Home ${sidebar ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Navbar />
      <div className="content">
        <div className="controls">
          <p style={{ fontSize: "18px", fontWeight: "500", color: "#2c3135;" }}>
            Number of recent records
           <span className="dropcontent">
              <select value={numLetters} onChange={handleNumLettersChange} className="stylish-dropdown">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <FontAwesomeIcon icon={faChevronDown} className="fa-chevron-down" />
              </select>
            
              </span>
          
          </p>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search offer letters"
          />
          <button onClick={() => setShowForm(!showForm)}>Create New Offer Letter</button>
        </div>
        {showForm && (
          <div className="overlay">
            <FormOverlay onClose={() => setShowForm(false)} />
          </div>
        )}
        {editForm && (
          <div className="overlay">
            <UpdateFormOverlay data={FetchData} onClose={() => setEditForm(false)} />
          </div>
        )}
        {showPdfViewer && (
          <div className="overlay">
            <div className="pdf-viewer">
              <div className="pdf-toolbar"></div>
              <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="600px" />
            </div>
          </div>
        )}

        <div className="recent-offers">
          <h2>Top 10 Recent Offer Letters</h2>
          <div>
            <table>
              <thead>
                <tr>
              
                  <th>Name</th>
                  <th>Designation</th>
                  <th>From</th>
                  <th>To</th>
                  <th>UID</th>
                  <th>View File</th>
                  <th>Send Mail</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((letter) => (
                  <tr key={letter.uid} onClick={() => handleEdit(letter.uid)}>
         
                    <td>{letter.name}</td>
                    <td>{letter.designation}</td>
                    <td>{formatDate(letter.from)}</td>
                    <td>{formatDate(letter.to)}</td>
                    <td>{letter.uid}</td>
                    <td onClick={(e) => { e.stopPropagation(); handleView(letter.uid); }}>
                      <FontAwesomeIcon icon={faEye} />
                    </td>
                    <td onClick={(e) => { e.stopPropagation(); handleSendMail(letter.uid); }}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferletterManagement;