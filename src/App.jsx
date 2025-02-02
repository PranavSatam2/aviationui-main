import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddProduct from "./components/AddProduct";
import StoreAccComponent from "./components/StoreAccComponent";
import LoginPage from "./components/LoginPage";
import ListProducts from "./components/ListProducts";
import ViewProduct from "./components/ViewProduct";
import EditProduct from "./components/EditProduct";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/Store" element={<StoreAccComponent />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/ListProducts" element={<ListProducts />} />
        <Route path="/view-product/:id" element={<ViewProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
};

export default App;
