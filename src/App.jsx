import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddProduct from "./components/AddProduct";
import StoreAccComponent from "./components/StoreAccComponent";
import SupplierRegistration from "./components/SupplierRegistration";




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/storeAcceptance" element={<StoreAccComponent />} />
        <Route path="/SupplierRegistration" element={<SupplierRegistration />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
