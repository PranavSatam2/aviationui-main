import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import HomePage from "./components/HomePage";
// import AddProduct from "./components/AddProduct";
// import StoreAccComponent from "./components/StoreAccComponent";
 import LoginPage from "./components/LoginPage";
// import ListProducts from "./components/ListProducts";
// import ViewProduct from "./components/ViewProduct";
// import EditProduct from "./components/EditProduct";
// import SupplierRegistartion from "./components/SupplierRegistration";
// import ProductList from "./components/ProductList";
// import ViewSupplierRegis from "./components/ViewSupplierRegis";
// import ViewStoreAcc from "./components/ViewStoreAcc";
// import MaterialReceiptNoteForm from "./components/AddMaterialNote";
// import ViewMaterialPage from "./components/ViewMaterialNotePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import EditMaterialNote from "./components/EditMaterialNote";
// import EditStoreAcceptance from "./components/EditStoreAcceptance";
// import AddUser from './components/AddUser';
// import ViewUser from './components/ViewUser';
import PasswordChange from './components/PasswordChange.jsx';
// import RoleMenuMapping from './components/RoleMenuMapping.jsx';
// import AddRole from './components/AddRole.jsx';
import componentsMap from './components/componentsMap.jsx';
//import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
    const roleId = localStorage.getItem('roleId');
    const token = localStorage.getItem('jwt_token');
    useEffect(() => {
      async function fetchMenu() {
      try {
        const res = await fetch(`http://localhost:8082/api/roles/roleMenus/${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
  
        const data = await res.json();
        console.log(data);
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }finally {
        setLoading(false);
      }
    };
  
    if (roleId) {
      fetchMenu();
    }
  }, [roleId, token]);
  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading menus...</div>;
  }
  return (
    <>
      <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/passwordChange" element={<PasswordChange />} />
        <Route path="/homePage" element={<HomePage />} />
            
          

  {menuItems.flatMap((menu) =>
      menu.subMenus.map((sub) => {
        const Component = componentsMap[sub.component]; // component = "AddUser" or "RoleMenuMapping"
        if (!Component) return null;
        return (
          <Route
            key={sub.path}
            path={sub.path}
            element={<Component />}
          />
        );
      })
    )}


                    {/* Public Route */}
                    {/* <Route path="/" element={<LoginPage />} />
                    <Route path="/passwordChange" element={<PasswordChange />} /> */}
          
          {/* Private Routes */}
          {/* <Route
            path="/homePage"
            element={
              <PrivateRoute requiredRoles={['USER', 'Admin']} element={<HomePage />} />
            }
          />
          <Route
            path="/addProduct"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<AddProduct />} />
            }
          />
          <Route
            path="/addUser"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<AddUser />} />
            }
          />
          <Route
            path="/viewUser"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<ViewUser />} />
            }
          />
          <Route
            path="/addRole"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<AddRole />} />
            }
          />
          <Route
            path="/roleMenuMapping"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<RoleMenuMapping/>} />
            }
          />
          <Route
            path="/Store"
            element={
              <PrivateRoute requiredRoles={['STORE', 'Admin']} element={<StoreAccComponent />} />
            }
          />
          <Route
            path="/productList"
            element={
              <PrivateRoute requiredRoles={['USER', 'Admin']} element={<ProductList />} />
            }
          />
          <Route
            path="/viewProduct"
            element={
              <PrivateRoute requiredRoles={['USER', 'Admin']} element={<ViewProduct />} />
            }
          />
          <Route
            path="/editProduct/:productId"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<EditProduct />} />
            }
          />
          <Route
            path="/storeAcceptance"
            element={
              <PrivateRoute requiredRoles={['STORE', 'Admin']} element={<StoreAccComponent />} />
            }
          />
          <Route
            path="/editstoreAcceptance/:id"
            element={
              <PrivateRoute requiredRoles={['STORE', 'Admin']} element={<EditStoreAcceptance />} />
            }
          />
          <Route
            path="/viewstoreAcceptance"
            element={
              <PrivateRoute requiredRoles={['STORE', 'Admin']} element={<ViewStoreAcc />} />
            }
          />
          <Route
            path="/editmaterial"
            element={
              <PrivateRoute requiredRoles={['Admin']} element={<EditMaterialNote />} />
            }
          />
          <Route
            path="/SupplierRegistration"
            element={
              <PrivateRoute requiredRoles={['SUPPLIER', 'Admin']} element={<SupplierRegistartion />} />
            }
          />
          <Route
            path="/ViewSupplierRegistration"
            element={
              <PrivateRoute requiredRoles={['SUPPLIER', 'Admin']} element={<ViewSupplierRegis />} />
            }
          />
          <Route
            path="/materialPage"
            element={
              <PrivateRoute requiredRoles={['MATERIAL', 'Admin']} element={<MaterialReceiptNoteForm />} />
            }
          />
          <Route
            path="/viewmaterialPage"
            element={
              <PrivateRoute requiredRoles={['MATERIAL', 'Admin']} element={<ViewMaterialPage />} />
            }
          /> */}
           {/* Fallback Route */}
      <Route path="*" element={<div style={{ padding: "2rem" }}>404 - Page Not Found</div>} />
          </Routes>
          </Suspense>
      </Router>
      <ToastContainer />
    </>
  );
};

          {/* <Route path="/homePage" element={<HomePage />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/viewUser" element={<ViewUser/>} />
          <Route path="/Store" element={<StoreAccComponent />} />
          <Route path="/" element={<LoginPage />} /> */}
          {/* <Route path="/listProducts" element={<ListProducts />} /> */}
          {/* <Route path="/productList" element={<ProductList />} />
          <Route path="/viewProduct" element={<ViewProduct />} />
          <Route path="/editProduct/:productId" element={<EditProduct />} />
          <Route path="/storeAcceptance" element={<StoreAccComponent />} />
          <Route path="/editstoreAcceptance/:id" element={<EditStoreAcceptance />} />
          <Route path="/viewstoreAcceptance" element={<ViewStoreAcc />} />
          <Route path="/editmaterial" element={<EditMaterialNote />} />
          <Route path="/SupplierRegistration"
            element={<SupplierRegistartion />}
          />
          <Route
            path="/ViewSupplierRegistration"
            element={<ViewSupplierRegis />}
          />
          <Route path="/materialPage" element={<MaterialReceiptNoteForm />} />
          <Route path="/viewmaterialPage" element={<ViewMaterialPage />} /> */}
        

export default App;
