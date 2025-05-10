import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axiosInstance from './axiosConfig';
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PasswordChange from './components/PasswordChange.jsx';
import componentsMap from './components/componentsMap.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProduct from "./components/EditProduct";
import EditMaterialNote from "./components/EditMaterialNote";
import EditMaterialRequisition from "./components/MaterialRequisition/EditMaterialRequisition/EditMaterialRequisition";
import EditSupplierTable from "./components/Checker/EditSupplier/EditSupplierTable";
import EditSupplierfrom from "./components/Checker/EditSupplier/Editsupplierform";
import EditStoreAcceptance from "./components/EditStoreAcceptance";
import EditPurchaseRequisition from "./components/PurchaseRequisition/EditPurchaseRequisition/EditPurchase.jsx";
import PurchaseOrderForm from "./components/PurchaseOrder/PurchaseOrder.jsx";
import AddPurchaseRequisition from "./components/PurchaseRequisition/AddpurchaseRequisition/Addpurchase.jsx";
import ViewPurchaseOrderPage from "./components/PurchaseOrder/ViewPurchaseOrder/ViewPurchaseOrder.jsx";
import EditPurchaseOrder from "./components/PurchaseOrder/EditPurchaseOrder/EditPurchaseOrder.jsx";
import EditInspectionReportForm from "./components/EditInspectionReportForm";
import EditInspectionReportTable from "./components/EditInspectionReportTable.jsx";
import ViewSupplierRegistration from "./components/Checker/CheckerSupplierRegistration/ViewSupplierRegistration";





const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = sessionStorage.getItem('jwt_token')!= null?sessionStorage.getItem('jwt_token'):'';
  const roleId = sessionStorage.getItem('roleId')!= null?sessionStorage.getItem('roleId'):'';
  console.log(" app token ...............",token);
  useEffect(() => {
    if (roleId && token) {
      async function fetchMenu() {
        try {
          const res = await axiosInstance.get(`/api/roles/roleMenus/${roleId}`);
          setMenuItems(res.data);
        } catch (error) {
          console.error("Failed to fetch menu items:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMenu();
    } else {
      setLoading(false); // Stop loading if no token
    }
  }, [roleId, token]);

  useEffect(() => {
    console.log("Available Components in componentsMap:", componentsMap);
  }, [componentsMap]);

  return (
    <>
      <Router basename="/aviationui">
      <Suspense fallback={<div>Loading...</div>}>
      {!token ? (
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      ) : (
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/passwordChange" element={<PasswordChange />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/editProduct/:productId" element={<EditProduct />} />
        <Route path="/editstoreAcceptance" element={<EditStoreAcceptance />} />
        <Route path="/editmaterial" element={<EditMaterialNote />} />
        <Route path="/editsupplier" element={<EditSupplierTable />} />
        <Route path="/editsupplierform" element={<EditSupplierfrom />} />
        <Route path="/editmaterialrequisition" element={<EditMaterialRequisition />}/>
        <Route path="/ViewSupplier" element={<ViewSupplierRegistration />} />
        <Route path="/editInspectionReportForm" element={<EditInspectionReportForm />} />
        <Route path="/editReport" element={<EditInspectionReportTable/>} />
        <Route path="/editmaterialrequisition" element={<EditMaterialRequisition />}/>
        <Route path="/editpurchaserequisition" element={<EditPurchaseRequisition />}/>
        <Route path="/purchaseOrder" element={<PurchaseOrderForm />}/>
        <Route path="/purchaserequistion" element={<AddPurchaseRequisition />}/>
        <Route path="/viewpurchaseOrder" element={<ViewPurchaseOrderPage />}/>
        <Route path="/editpurchaseorder" element={<EditPurchaseOrder />}/>
        <Route path='/editUser' element={<componentsMap.EditUser />} />
        <Route path="/editRole/:roleId" element={<componentsMap.EditRole />} />

  
  {menuItems.flatMap((menu) =>
      menu.subMenus.map((sub) => {
        const Component = componentsMap[sub.component]; // component = "AddUser" or "RoleMenuMapping"
        const routePath = `${sub.path.replace(/^\/+/, "")}`;
        console.log("Registering route:", routePath);

        if (!Component) return null;
          return (
          <Route
          key={routePath}
          path={routePath}
          element={<Component />}
          />
        );
      })
    )}
      

            {/* Fallback */}
            <Route path="*" element={<div style={{ padding: "2rem" }}>404 - Page Not Found</div>} />
          </Routes>
        )}
      </Suspense>
      <ToastContainer />
    </Router>
    </>
  );
};

export default App;
