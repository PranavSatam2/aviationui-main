import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axiosInstance from './axiosConfig';
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PasswordChange from './components/PasswordChange.jsx';
import componentsMap from './components/componentsMap.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('jwt_token')!= null?localStorage.getItem('jwt_token'):'';
  const roleId = localStorage.getItem('roleId')!= null?localStorage.getItem('roleId'):'';
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
