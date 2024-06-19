import React, { useState } from "react";
import Swal from "sweetalert2";

function FormOverlay({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    from: "",
    to: "",
    uid: "",
    paid: "unpaid",
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/offerLetter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      Swal.fire({
        title: "Good job!",
        text: "Offer Letter Created Successfully",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
      console.error(error);
    }
  };
  return (
    <div className="form-container">
    <span className="close" onClick={onClose}>
        &times;
      </span>
      <h2>Create New Offer Letter</h2>
      <form onSubmit={handleSubmit} className="offer-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="from">From:</label>
          <input
            type="date"
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="to">To:</label>
          <input
            type="date"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="uid">UID:</label>
          <input
            type="text"
            id="uid"
            name="uid"
            value={formData.uid}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paid">Paid:</label>
          <select
            id="paid"
            name="paid"
            value={formData.paid}
            onChange={handleChange}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <button type="submit">Submit</button>
        <button onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default FormOverlay;
