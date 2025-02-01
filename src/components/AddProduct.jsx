import React, { useState } from "react";
import "../styles/AddProduct.css";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const AddProduct = () => {
  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");

    // Clear input fields after submission
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleView = async () => {
    setIsViewing(true);
    setIsEditing(false);

    // Mock API Data
    const mockApiData = {
      materialClassification: "Metal",
      productId: "P12345",
      productName: "Steel Bolt",
      productDescription: "High-quality steel bolt used for heavy machinery",
      unitOfMeasurement: "Pieces",
      oem: "OEM Corp",
      nha: "NHA123",
      cmmReferenceNumber: "CMM56789",
      date: "2024-02-01",
      registeredBy: "John Doe",
    };

    setFormData(mockApiData);
  };

  return (
    <div className="container">
      <Header />
      <div className="content d-flex">
        <Sidebar />
        <div className="form-container">
          <fieldset>
            <legend>Product Details</legend>
            <form onSubmit={handleSubmit}>
              <div className="form-columns">
                {/* Left Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="materialClassification">Material Classification</label>
                    <input
                      type="text"
                      id="materialClassification"
                      name="materialClassification"
                      value={formData.materialClassification}
                      onChange={handleChange}
                      disabled={isViewing}
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
                      disabled={isViewing}
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
                      disabled={isViewing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="unitOfMeasurement">Unit of Measurement</label>
                    <input
                      type="text"
                      id="unitOfMeasurement"
                      name="unitOfMeasurement"
                      value={formData.unitOfMeasurement}
                      onChange={handleChange}
                      disabled={isViewing}
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
                      disabled={isViewing}
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="nha">NHA</label>
                    <input
                      type="text"
                      id="nha"
                      name="nha"
                      value={formData.nha}
                      onChange={handleChange}
                      disabled={isViewing}
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
                      disabled={isViewing}
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
                      disabled={isViewing}
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
                      disabled={isViewing}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Description Field */}
              <div className="form-group">
                <label htmlFor="productDescription">Product Description</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  disabled={isViewing}
                  required
                ></textarea>
              </div>

              {/* Button Group */}
              <div className="button-group">
                <button type="button" className="edit-button" onClick={handleEdit}>
                  Edit
                </button>
                <button type="button" className="view-button" onClick={handleView}>
                  View
                </button>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
