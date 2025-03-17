import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

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

    const filtered = getProductDetail(searchId);
    setFilteredProducts(filtered);

    if (filtered.length === 0) {
      setError("No products found with the given ID.");
    } else {
      setError("");
    }
  };

  // Initialize DataTable after products are loaded or filtered
  useEffect(() => {
    // Only initialize DataTable if table is rendered
    if (window.$) {
      window.$("#dataTable").DataTable(); // Initialize DataTable
    }
  }, [filteredProducts]); // Re-run whenever filteredProducts change

  return (
    <div className="wrapper">
      <Sidebar />


      <div className="content">
        <Header />
        {/* conetnt Begin*/}
        <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-3 mb-0 text-gray-800">View Products</h5>
          </div>
        </div>
        <div className="card shadow mx-4 my-2 p-0">

          {/* Search by Product ID */}
          <div className="px-3 py-1 shadow-lg mb-1">
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
              <div className="table-responsive overflow-auto px-0">
                <table id="dataTable" className="table border" style={{ width: "100%", cellspacing: "0", tableLayout: "fixed", height: "275px" }}>
                  <thead className="position-sticky sticky-top bg-light">
                    <tr>
                      <th style={{width: "35px"}}>ID</th>
                      <th style={{width: "200px"}}>Material Classification</th>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Unit</th>
                      <th>OEM</th>
                      <th>NHA</th>
                      <th>CMM</th>
                      <th>Date</th>
                      <th>Registered By</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-auto w-100">
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
                        <td>{product.registrationDate}</td>
                        <td>{product.registeredBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            )}
            </div>     
      </div>
        <Footer />
      </div>
  );
};

export default ViewProduct;
