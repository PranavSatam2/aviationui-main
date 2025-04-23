import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    
    if (token && roleId) {
      const fetchMenu = async () => {
        try {
          console.log("http://43.204.71.108:8082 ...............");
          const res = await fetch(`http://43.204.71.108:8082/aero-maint-core-0.0.1-SNAPSHOT/api/roles/roleMenus/${roleId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          setMenuItems(data);
        } catch (error) {
          console.error("Failed to fetch menu items:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMenu();
    } else {
      setLoading(false); // No token, no need to fetch
    }
  }, [token, roleId]);
  useEffect(() => {
    console.log("Available Components in componentsMap:", componentsMap);
  }, [componentsMap]);

  return (
    <>
      <Router>
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
