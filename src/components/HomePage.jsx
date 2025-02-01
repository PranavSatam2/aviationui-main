import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="content d-flex">
        <Sidebar />
        <div className="form-container" style={{ textAlign: "center", padding: "20px", margin: "20px" }}>
          <h1>Welcome Home!!!!!!!</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
