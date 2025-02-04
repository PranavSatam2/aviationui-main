import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListProducts.css";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products for the logged-in user
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api.example.com/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based auth
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="content d-flex">
        <Sidebar />
        <div className="list-container">
          <h2>My Products</h2>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.productDescription}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/view-product/${product.productId}`)}
                      >
                        View
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit-product/${product.productId}`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListProducts;
