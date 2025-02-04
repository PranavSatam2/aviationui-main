import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ViewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product data by ID from API
    fetch(`https://api.example.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="view-product-container">
      <h2>Product Details</h2>
      <div className="product-details">
        <p><strong>Material Classification:</strong> {product.materialClassification}</p>
        <p><strong>Product ID:</strong> {product.productId}</p>
        <p><strong>Product Name:</strong> {product.productName}</p>
        <p><strong>Description:</strong> {product.productDescription}</p>
        <p><strong>Unit of Measurement:</strong> {product.unitOfMeasurement}</p>
        <p><strong>OEM:</strong> {product.oem}</p>
        <p><strong>NHA:</strong> {product.nha}</p>
        <p><strong>CMM Reference Number:</strong> {product.cmmReferenceNumber}</p>
        <p><strong>Date:</strong> {product.date}</p>
        <p><strong>Registered By:</strong> {product.registeredBy}</p>
      </div>
      <div className="button-group">
        <Link to="/list-products" className="back-button">Back</Link>
      </div>
    </div>
  );
};

export default ViewProduct;
