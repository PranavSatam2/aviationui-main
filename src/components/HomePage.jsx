import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  //localStorage.getItem("menuItems")
 // const [menuItems, setMenuItems] = useState([]);
  const roleId = localStorage.getItem('roleId')|| '';
  const token = localStorage.getItem('jwt_token')|| '';
  
  function useRoleMenus(roleId, token) {
    const [menuItems, setMenuItems] = useState([]);
    
    useEffect(() => {
    
      if (!roleId) return;
      fetch(`http://localhost:8082/api/roles/roleMenus/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(setMenuItems)
        .catch(console.error);
    }, [roleId, token]);
    return menuItems;
  }

const menuItems = useRoleMenus(roleId, token);
localStorage.setItem("menuItems", JSON.stringify(menuItems));
  return (
    <div className="wrapper ">
      <Sidebar/>

      <div className="content">
        <Header />
        {/* conetnt Begin*/}
        <div className="col-md-6">
            <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
                <h5 className="h5 mx-3 mb-0 text-gray-800">Home Page</h5>
            </div>
        </div>

        <div className="card shadow mx-4 my-2 p-2">
          {/* conetnt */}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
