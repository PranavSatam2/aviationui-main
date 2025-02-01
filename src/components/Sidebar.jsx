import React from "react";
import { Link } from "react-router-dom";
import AddProduct from "./AddProduct";
import "../styles/Sidebar.css";
import HomePage from "./HomePage";

const Sidebar = () => {
  return (
    <div className="sidebar" style={{ backgroundColor: "#A6CDC6", color: "#fff", padding: "10px" }}>
      <ul>
        <li>
          <Link to="/AddProduct">Product Form</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
