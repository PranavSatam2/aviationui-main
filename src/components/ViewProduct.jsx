import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import "../styles/ViewProduct.css";

const ViewProduct = () => {
  const [products, setProducts] = useState([]); // State to store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products
  const [searchId, setSearchId] = useState(""); // State to store search input
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(""); // State to handle errors

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Function to fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("https://api.example.com/products");
      setProducts(response.data); // Assuming API returns an array of products
      setFilteredProducts(response.data); // Initialize filtered products with all products
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search by product ID
  const handleSearch = () => {
    if (!searchId.trim()) {
      setFilteredProducts(products); // If search input is empty, show all products
      return;
    }

    const filtered = products.filter((product) =>
      product.id.toString().includes(searchId)
    );
    setFilteredProducts(filtered);

    if (filtered.length === 0) {
      setError("No products found with the given ID.");
    } else {
      setError("");
    }
  };

  return (
    <div className="wrapper " style={{height : '100vh'}}>
      <Sidebar />
      
      <div className="content">
      <Header />
        <div className="card">
        <div className="container mt-5" style={{maxWidth: "80%", marginLeft: "18%"}}>
        <h3 className="text-center text-primary">View Products</h3>

        {/* Search by Product ID */}
        <div className="card p-3 shadow-lg mb-4">
          <label className="form-label">Search by Product ID:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control py-2 border-end-0 border rounded-start"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Product ID"
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        {/* Display All Products in a Table */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="card p-4 shadow-lg">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Material Classification</th>
                  <th>Product Name</th>
                  <th>Product Description</th>
                  <th>Unit of Measurement</th>
                  <th>OEM</th>
                  <th>NHA</th>
                  <th>CMM Reference Number</th>
                  <th>Date</th>
                  <th>Registered By</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.materialClassification}</td>
                    <td>{product.productName}</td>
                    <td>{product.productDescription}</td>
                    <td>{product.unitOfMeasurement}</td>
                    <td>{product.oem}</td>
                    <td>{product.nha}</td>
                    <td>{product.cmmReferenceNumber}</td>
                    <td>{product.date}</td>
                    <td>{product.registeredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </div>      
      </div>
      <Footer />
    </div>
  );
};

export default ViewProduct;