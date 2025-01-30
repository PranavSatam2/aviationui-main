import React, { useState } from "react";
import '../styles/AddProduct.css';
import Header from "./Header";
import Footer from "./Footer"
import Sidebar from "./Sidebar";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    materialClassification: "",
    productId: "",
    productName: "",
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    nha: "",
    cmmReferenceNumber: "",
    date: "",
    registeredBy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");
    // Add API call here to send data to the backend
  };

  return (
    <div>
      <Header/>
      <Sidebar/>
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }} className="add-product-container">
      <h2>Product Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="materialClassification">Material Classification</label>
          <input
            type="text"
            id="materialClassification"
            name="materialClassification"
            value={formData.materialClassification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productId">Product ID</label>
          <input
            type="text"
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Product Description</label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="unitOfMeasurement">Unit of Measurement</label>
          <input
            type="text"
            id="unitOfMeasurement"
            name="unitOfMeasurement"
            value={formData.unitOfMeasurement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="oem">OEM (Original Equipment Manufacturer)</label>
          <input
            type="text"
            id="oem"
            name="oem"
            value={formData.oem}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nha">NHA</label>
          <input
            type="text"
            id="nha"
            name="nha"
            value={formData.nha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cmmReferenceNumber">CMM Reference Number</label>
          <input
            type="text"
            id="cmmReferenceNumber"
            name="cmmReferenceNumber"
            value={formData.cmmReferenceNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="registeredBy">Registered By (Name)</label>
          <input
            type="text"
            id="registeredBy"
            name="registeredBy"
            value={formData.registeredBy}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default AddProduct;
