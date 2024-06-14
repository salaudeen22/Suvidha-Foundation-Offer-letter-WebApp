import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBarContext from "../ContextProvider/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import FormOverlay from "../components/FormOverlay";
import { pdfjs } from "react-pdf"; // Import react-pdf

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function OfferletterManagement() {
  // Your existing code
  const { sidebar } = useContext(SideBarContext);
  const [numLetters, setNumLetters] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentLetters, setRecentLetters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);

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

  const handleGenerate = async (refNo) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/generate/${refNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate offer letter");
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "OfferLetter.pdf";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error generating offer letter:", error.message);
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "SendMail!",
          text: "Your file has been sent.",
          icon: "success",
        });
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

  return (
    <div className={`Home ${sidebar ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Navbar />
      <div className="content">
        <div className="controls">
          <input
            type="number"
            value={numLetters}
            onChange={handleNumLettersChange}
            placeholder="Number of offer letters"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search offer letters"
          />
          <button onClick={() => setShowForm(!showForm)}>
            Create New Offer Letter
          </button>
        </div>
        {showForm && (
          <div className="overlay">
            <span className="close" onClick={() => setShowForm(false)}>
              &times;
            </span>
            <FormOverlay />
          </div>
        )}
        {showPdfViewer && (
          <div className="overlay">
            <span className="close" onClick={() => setShowPdfViewer(false)}>
              &times;
            </span>
            <div className="pdf-viewer">
              <div className="pdf-toolbar"></div>
              <iframe
                title="PDF Viewer"
                src={pdfUrl}
                width="100%"
                height="600px"
              />
            </div>
          </div>
        )}

        <div className="recent-offers">
          <h2>Top 10 Recent Offer Letters</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>From</th>
                <th>To</th>
                <th>UID</th>
                <th>Update File</th>
                <th>View File</th>
                <th>Send Mail</th>
              </tr>
            </thead>
            <tbody>
              {filteredLetters.map((letter) => (
                <tr key={letter.uid}>
                  <td>{letter.name}</td>
                  <td>{letter.designation}</td>
                  <td>{formatDate(letter.from)}</td>
                  <td>{formatDate(letter.to)}</td>
                  <td>{letter.uid}</td>
                  <td onClick={() => handleGenerate(letter.uid)}>
                    <FontAwesomeIcon icon={faDownload} />
                  </td>
                  <td onClick={() => handleView(letter.uid)}>
                    <FontAwesomeIcon icon={faEye} />
                  </td>
                  <td onClick={() => handleSendMail(letter.uid)}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OfferletterManagement;
