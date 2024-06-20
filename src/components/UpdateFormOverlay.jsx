import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function UpdateFormOverlay({ data, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    from: "",
    to: "",
    uid: "",
    paid: "unpaid",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        designation: data.designation || "",
        from: data.from ? new Date(data.from).toISOString().split('T')[0] : "", 
        to: data.to ? new Date(data.to).toISOString().split('T')[0] : "", 
        uid: data.uid || "",
        paid: data.paid || "unpaid",
      });
    }
  }, [data]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/updateofferLetter/${formData.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          title: "Good job!",
          text: "Offer Letter Updated Successfully",
          icon: "success",
        });
        onClose(); // Close the overlay on successful submit
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseData.message || "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:4000/api/offerLetter/${formData.uid}`, {
            method: "DELETE",
          });
          const responseData = await response.json();
          if (responseData.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Offer Letter has been deleted.",
              icon: "success",
            });
            onClose(); // Close the overlay on successful deletion
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: responseData.message || "Something went wrong!",
              footer: '<a href="#">Why do I have this issue?</a>',
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>',
          });
        }
      }
    });
  };

  return (
    <div className="form-container">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <h2>Update Offer Letter</h2>
      <form onSubmit={handleSubmit} className="offer-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
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
            placeholder="Enter email"
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
            placeholder="Enter designation"
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
            placeholder="Start date"
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
            placeholder="End date"
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
            disabled
            onChange={handleChange}
            placeholder="Enter UID"
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
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
}

export default UpdateFormOverlay;
