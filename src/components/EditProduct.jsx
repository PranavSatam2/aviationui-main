import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    // Fetch product data by ID from API
    fetch(`https://api.example.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => setFormData(data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send updated data to API
    fetch(`https://api.example.com/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Product updated successfully!");
        navigate("/list-products");
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>Material Classification</label>
        <input type="text" name="materialClassification" value={formData.materialClassification} onChange={handleChange} required />

        <label>Product ID</label>
        <input type="text" name="productId" value={formData.productId} onChange={handleChange} required />

        <label>Product Name</label>
        <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} required />

        <label>Unit of Measurement</label>
        <input type="text" name="unitOfMeasurement" value={formData.unitOfMeasurement} onChange={handleChange} required />

        <label>OEM</label>
        <input type="text" name="oem" value={formData.oem} onChange={handleChange} required />

        <label>NHA</label>
        <input type="text" name="nha" value={formData.nha} onChange={handleChange} required />

        <label>CMM Reference Number</label>
        <input type="text" name="cmmReferenceNumber" value={formData.cmmReferenceNumber} onChange={handleChange} required />

        <label>Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Registered By</label>
        <input type="text" name="registeredBy" value={formData.registeredBy} onChange={handleChange} required />

        <div className="button-group">
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="cancel-button" onClick={() => navigate("/list-products")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
