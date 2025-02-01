import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import LoginPage from "./LoginPage";

const Header = () => {
  return (
    <div className="header" style={{ border: "1px solid #000", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
    <nav class="navbar navbar-dark py-4" style={{ backgroundColor: "#16404D" }}>
  <div class="container-fluid">
  <a class="navbar-brand" href="/">
      <img src="/airplane.jpg" alt="" width="30" height="24" class="d-inline-block align-text-top"></img>
      Airplane
    </a>
    <form class="d-flex">
      <button class="btn btn-outline-success" type="submit"><Link to="/Login">Login</Link></button>
    </form>
  </div>
</nav>
    </div>
  );
};

export default Header;
