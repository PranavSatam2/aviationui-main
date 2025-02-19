import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation
import { deleteProduct, listAllProduct } from "../services/db_manager"; // Assuming these functions are defined in your `db_manager`

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products when the component is mounted
    const fetchProducts = async () => {
      try {
        const response = await listAllProduct(); // Fetch products from the database
        setProducts(response.data); // Assuming response.data contains the list of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete action
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId); // Delete the product using the API
        setProducts(products.filter((product) => product.id !== productId)); // Remove deleted product from the state
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product.");
      }
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div className="container-fluid">
          <div className="row mx-1 card border border-dark shadow-lg py-2">
            <div className="col-md-12">
              <h5 className="text-center">Product List</h5>
              {/* Table with responsive scrolling */}
              <div className="table-responsive overflow-auto px-0">
                <table
                  id="dataTable"
                  className="table border"
                  style={{
                    width: "100%",
                    cellspacing: "0",
                    tableLayout: "fixed",
                    height: "275px", // Adjust the height as needed
                  }}
                >
                  <thead className="position-sticky sticky-top bg-light">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "10%" }}>Product ID</th>
                      <th style={{ width: "15%" }}>Name</th>
                      <th style={{ width: "20%" }}>Material Classification</th>
                      <th style={{ width: "20%" }}>Description</th>
                      <th style={{ width: "10%" }}>UOM</th>
                      <th style={{ width: "10%" }}>OEM</th>
                      <th style={{ width: "10%" }}>NHA</th>
                      <th style={{ width: "10%" }}>CMM Reference Number</th>
                      <th style={{ width: "5%" }}>Date</th>
                      <th style={{ width: "10%" }}>Registered By</th>
                      <th style={{ width: "15%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>{product.productId}</td>
                          <td>{product.productName}</td>
                          <td>{product.materialClassification}</td>
                          <td>{product.productDescription}</td>
                          <td>{product.unitOfMeasurement}</td>
                          <td>{product.oem}</td>
                          <td>{product.nha}</td>
                          <td>{product.cmmReferenceNumber}</td>
                          <td>{product.date}</td>
                          <td>{product.registeredBy}</td>
                          <td>
                            {/* Edit Button */}
                            <Link to={`/edit/${product.id}`} className="btn btn-warning btn-sm mx-1">
                            <i class="fa-solid fa-pen-to-square">Edit</i>
                            </Link>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="btn btn-danger btn-sm mx-1"
                            >
                              <i class="fa-solid fa-trash">Delete</i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">
                          No products available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
