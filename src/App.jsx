import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddProduct from "./components/AddProduct";
import StoreAccComponent from "./components/StoreAccComponent";
import LoginPage from "./components/LoginPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/Store" element={<StoreAccComponent />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
