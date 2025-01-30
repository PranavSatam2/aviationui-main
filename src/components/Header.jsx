import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import LoginPage from "./LoginPage";

const Header = () => {
  return (
    <nav class="navbar navbar-dark bg-dark py-4">
  <div class="container-fluid">
    <a class="navbar-brand">Navbar</a>
    <form class="d-flex">
      <button class="btn btn-outline-success" type="submit"><Link to="/Login">Login</Link></button>
    </form>
  </div>
</nav>
  );
};

export default Header;
