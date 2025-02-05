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
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/Store" element={<StoreAccComponent />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/listProducts" element={<ListProducts />} />
        <Route path="/viewProduct" element={<ViewProduct />} />
        <Route path="/editProduct" element={<EditProduct />} />
        <Route path="/storeAcceptance" element={<StoreAccComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
