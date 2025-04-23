import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddProduct from "./components/AddProduct";
import StoreAccComponent from "./components/StoreAccComponent";
import LoginPage from "./components/LoginPage";
import ListProducts from "./components/ListProducts";
import ViewProduct from "./components/ViewProduct";
import EditProduct from "./components/EditProduct";
import SupplierRegistartion from "./components/SupplierRegistration";
import ProductList from "./components/ProductList";
import ViewSupplierRegis from "./components/ViewSupplierRegis";
import ViewStoreAcc from "./components/ViewStoreAcc";
import MaterialReceiptNoteForm from "./components/AddMaterialNote";
import ViewMaterialPage from "./components/ViewMaterialNotePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditMaterialNote from "./components/EditMaterialNote";
import EditStoreAcceptance from "./components/EditStoreAcceptance";
import AddRequisition from "./components/MaterialRequisition/AddMaterialRequisition/AddMaterialRequisition";
import ViewMaterialRequisitionPage from "./components/MaterialRequisition/ViewMaterialRequisition";
import EditMaterialRequisition from "./components/MaterialRequisition/EditMaterialRequisition/EditMaterialRequisition";
import ViewPurchaseRequisitionPage from "./components/PurchaseRequisition/ViewPurchaseRequisition";
import AddPurchaseRequisition from "./components/PurchaseRequisition/AddpurchaseRequisition/Addpurchase";
import Checker from "./components/Checker/CheckerTable";
import ViewSupplierRegistration from "./components/Checker/CheckerSupplierRegistration/ViewSupplierRegistration";
import EditSupplierTable from "./components/Checker/EditSupplier/EditSupplierTable";
import EditSupplierfrom from "./components/Checker/EditSupplier/Editsupplierform";
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/Store" element={<StoreAccComponent />} />
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/listProducts" element={<ListProducts />} /> */}
          <Route path="/productList" element={<ProductList />} />
          <Route path="/viewProduct" element={<ViewProduct />} />
          <Route path="/editProduct/:productId" element={<EditProduct />} />
          <Route path="/storeAcceptance" element={<StoreAccComponent />} />
          <Route
            path="/editstoreAcceptance"
            element={<EditStoreAcceptance />}
          />
          <Route path="/viewstoreAcceptance" element={<ViewStoreAcc />} />
          <Route path="/editmaterial" element={<EditMaterialNote />} />
          <Route
            path="/SupplierRegistration"
            element={<SupplierRegistartion />}
          />
          <Route
            path="/ViewSupplierRegistration"
            element={<ViewSupplierRegis />}
          />
          <Route path="/materialPage" element={<MaterialReceiptNoteForm />} />
          <Route path="/viewmaterialPage" element={<ViewMaterialPage />} />

          <Route path="/addmaterialrequisition" element={<AddRequisition />} />
          <Route
            path="/Viewmaterialrequisition"
            element={<ViewMaterialRequisitionPage />}
          />
          <Route
            path="/editmaterialrequisition"
            element={<EditMaterialRequisition />}
          />
          <Route
            path="/ViewPurchaseRequisition"
            element={<ViewPurchaseRequisitionPage />}
          />
          <Route
            path="/addPurchaseRequisition"
            element={<AddPurchaseRequisition />}
          />
          <Route path="/approvesupplier" element={<Checker />} />
          <Route path="/editsupplier" element={<EditSupplierTable />} />
          <Route path="/editsupplierform" element={<EditSupplierfrom />} />


          <Route path="/ViewSupplier" element={<ViewSupplierRegistration />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
