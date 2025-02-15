import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { getProductDetail, updateProduct } from "../services/db_manager";

const EditProduct = () => {
  const [productId, setProductId] = useState("");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch product data by ID
  const fetchProductData = async () => {
    if (!productId.trim()) {
      setError("Please enter a valid Product ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getProductDetail(productId);
      setForm(response.data); // Assuming API returns product object
      setError("");
    } catch (err) {
      setError("Product not found. Please check the Product ID.");
      setForm(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Function to submit the updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);
    try {
      await updateProduct(productId, form);
      alert("Product updated successfully!");
    } catch (err) {
      alert("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper " style={{height : '100vh'}}>
      <Sidebar />
      
      <div className="content">
      <Header />
        <div className="card">
        <div className="container mt-5" style={{maxWidth: "80%", marginLeft: "18%"}}>
        <h3 className="text-center text-primary">Edit Product</h3>

        {/* Input for fetching product data */}
        <div className="card p-3 shadow-lg">
          <label className="form-label">Enter Product ID:</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control py-2 border-end-0 border rounded-start"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID"
            /><br/>
            <button className="btn btn-primary" onClick={fetchProductData} disabled={loading}>
              {loading ? "Fetching..." : "Fetch Product"}
            </button>
          </div>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        {/* Display Form only if data is found */}
        {form && (
          <form className="card p-4 shadow-lg mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Material Classification</label>
              <input type="text" className="form-control" name="materialClassification" value={form.materialClassification} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input type="text" className="form-control" name="productName" value={form.productName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Product Description</label>
              <textarea className="form-control" name="productDescription" value={form.productDescription} onChange={handleChange} required></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Unit of Measurement</label>
              <input type="text" className="form-control" name="unitOfMeasurement" value={form.unitOfMeasurement} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">OEM</label>
              <input type="text" className="form-control" name="oem" value={form.oem} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">NHA</label>
              <input type="text" className="form-control" name="nha" value={form.nha} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">CMM Reference Number</label>
              <input type="text" className="form-control" name="cmmReferenceNumber" value={form.cmmReferenceNumber} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Registered By</label>
              <input type="text" className="form-control" name="registeredBy" value={form.registeredBy} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
        </div>      
      </div>
      <Footer />
    </div>
  );
};

export default EditProduct;
