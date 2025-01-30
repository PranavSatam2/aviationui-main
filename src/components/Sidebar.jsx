import React from "react";
import { Link } from "react-router-dom";
import AddProduct from "./AddProduct";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
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
