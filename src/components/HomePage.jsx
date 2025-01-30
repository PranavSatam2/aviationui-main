import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="content">
        <Sidebar />
        
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
