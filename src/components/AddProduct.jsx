import React, { useState } from "react";
import '../styles/AddProduct.css';
import Header from "./Header";
import Footer from "./Footer";
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

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");
  };

  const handleView = async () => {
    try {
      const response = await fetch("https://api.example.com/product");
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div>
    <Header />
    <div className="content-container">
      <Sidebar />
      <div className="form-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={key === "date" ? "date" : "text"}
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                disabled={!isEditing}
              />
            </div>
          ))}
          <button type="submit" className="submit-button">Submit</button>
        </form>
        <button onClick={handleView} className="view-button">View</button>
        <button onClick={handleEdit} className="edit-button">Edit</button>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default AddProduct;
