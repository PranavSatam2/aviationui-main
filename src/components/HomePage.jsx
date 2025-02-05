import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import StoreAccComponent from "./StoreAccComponent";

const HomePage = () => {
  return (
    <div className="wrapper " style={{height : '100vh'}}>
      <Sidebar />
      
      <div className="content">
      <Header />
        <div className="card">
          {/* conetnt */}
          
        </div>      
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
