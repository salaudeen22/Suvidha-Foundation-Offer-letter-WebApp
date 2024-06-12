import React, { useContext, useState } from "react";
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


const dummyOfferLetters = [
  {
    slNo: 1,
    name: "John Doe",
    designation: "Software Engineer",
    from: "2024-01-01",
    to: "2024-12-31",
    uid: "UID001",
  },
  {
    slNo: 2,
    name: "Jane Smith",
    designation: "Product Manager",
    from: "2024-02-01",
    to: "2024-12-31",
    uid: "UID002",
  },
  {
    slNo: 3,
    name: "Alice Johnson",
    designation: "UX Designer",
    from: "2024-03-01",
    to: "2024-12-31",
    uid: "UID003",
  },
  {
    slNo: 4,
    name: "Bob Brown",
    designation: "DevOps Engineer",
    from: "2024-04-01",
    to: "2024-12-31",
    uid: "UID004",
  },
  {
    slNo: 5,
    name: "Charlie Green",
    designation: "Data Scientist",
    from: "2024-05-01",
    to: "2024-12-31",
    uid: "UID005",
  },
  {
    slNo: 6,
    name: "Diana White",
    designation: "HR Manager",
    from: "2024-06-01",
    to: "2024-12-31",
    uid: "UID006",
  },
  {
    slNo: 7,
    name: "Evan Black",
    designation: "Marketing Specialist",
    from: "2024-07-01",
    to: "2024-12-31",
    uid: "UID007",
  },
  {
    slNo: 8,
    name: "Fiona Blue",
    designation: "Sales Executive",
    from: "2024-08-01",
    to: "2024-12-31",
    uid: "UID008",
  },
  {
    slNo: 9,
    name: "George Yellow",
    designation: "Financial Analyst",
    from: "2024-09-01",
    to: "2024-12-31",
    uid: "UID009",
  },
  {
    slNo: 10,
    name: "Hannah Red",
    designation: "Legal Advisor",
    from: "2024-10-01",
    to: "2024-12-31",
    uid: "UID010",
  },
];

function OfferletterManagement() {
  const { sidebar } = useContext(SideBarContext);
  const [numLetters, setNumLetters] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentLetters, setRecentLetters] = useState(dummyOfferLetters);
  const [showform, setshowform] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    from: "",
    to: "",
    uid: "",
    paid: "unpaid", // Default value for "paid"
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumLettersChange = (e) => {
    setNumLetters(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenerate = (uid) => {
    // Logic to generate file for the offer letter with the given UID
  };

  const handleView = (uid) => {
    // Logic to view the file for the offer letter with the given UID
  };

  const handleSubmit = async (e) => {};

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
          <button
            onClick={() => {
              showform ? setshowform(false) : setshowform(true);
            }}
          >
            Create New Offer Letter
          </button>
        </div>
        {showform && (
           <div className="overlay">
           <span className="close" onClick={()=>
             {
               setshowform(false);
             }
           }>&times;</span>
           <FormOverlay/>
         </div>
        )}

        <div className="recent-offers">
          <h2>Top 10 Recent Offer Letters</h2>
          <table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Designation</th>
                <th>From</th>
                <th>To</th>
                <th>UID</th>
                <th>Generate File</th>
                <th>View File</th>
                <th>Send Mail</th>
              </tr>
            </thead>
            <tbody>
              {filteredLetters.map((letter) => (
                <tr key={letter.uid}>
                  <td>{letter.slNo}</td>
                  <td>{letter.name}</td>
                  <td>{letter.designation}</td>
                  <td>{letter.from}</td>
                  <td>{letter.to}</td>
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
