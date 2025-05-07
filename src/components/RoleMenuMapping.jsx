import React, { useState, useEffect } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const RoleMenuMapping = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleMenuMapping, setRoleMenuMapping] = useState({});
  const [error, setError] = useState('');

  const token = sessionStorage.getItem("jwt_token");

  useEffect(() => {
    if (!token) {
      setError('You need to be logged in to access this page.');
      return;
    }

    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get('/api/roles/role');
        console.log("Role data:", res.data);
        setRoles(res.data);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    const fetchMenus = async () => {
      try {
        const res = await axiosInstance.get('/api/roles/menus');
        console.log("Menu data:", res.data);
        setMenus(res.data);
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    };

    fetchRoles();
    fetchMenus();
  }, [token]);
  const fetchRoleMenuMapping = async (roleId) => {
    try {
      const res = await axiosInstance.get(`/api/roles/roleMenus/${roleId}`);
      const mapping = {};
      const extractMenuIds = (menus) => {
        menus.forEach(menu => {
          if (menu.id !== undefined) {
            mapping[menu.id] = true;
          }
          if (menu.subMenus && menu.subMenus.length > 0) {
            extractMenuIds(menu.subMenus);
          }
        });
      };
  
      extractMenuIds(res.data);
      
  
      setRoleMenuMapping((prev) => ({
        ...prev,
        [roleId]: mapping,
      }));
    } catch (err) {
      console.error("Error fetching role-menu mapping:", err);
      alert("Failed to fetch role-menu mapping.");
    }
  };
  
  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    console.log("Selected Role ID:", roleId);
    setSelectedRole(roleId);
    if (roleId) {
      await fetchRoleMenuMapping(roleId);
    }
    //setRoleMenuMapping((prev) => ({ ...prev, [roleId]: prev[roleId] || {} }));
  };

  const handleParentCheck = (menuId, checked, subMenus = []) => {
    handleCheckboxChange(menuId, checked, subMenus);
  };
  
  const handleCheckboxChange = (menuId, checked, subMenus = [], parentId = null) => {
    setRoleMenuMapping((prev) => {
      const updated = {
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [menuId]: checked,
        },
      };
  
      // Uncheck all submenus if parent is unchecked
      subMenus.forEach((sub) => {
        if (sub?.id !== undefined) {
          updated[selectedRole][sub.id] = false;
        } else {
          console.warn("⚠️ Submenu item has no id:", sub);
        }
      });
  
      // If a submenu is checked, ensure parent is checked too
      if (checked && parentId !== null && parentId !== undefined) {
        updated[selectedRole][parentId] = true;
      }
  
      return updated;
    });
  };
  


  const handleSaveMappings = async (e) => {
    e.preventDefault();
    if (!selectedRole) return alert("Please select a role.");

    const roleMenus = roleMenuMapping[selectedRole] || {};
    const mappings = Object.entries(roleMenus).map(([menuId, accessible]) => ({
      roleId: parseInt(selectedRole),
      menuId: parseInt(menuId),
      accessible,
    }));

    try {
      await axiosInstance.post('/api/roles/saveMapping', mappings);
      alert("Role-Menu mapping saved successfully!");
    } catch (error) {
      console.error("Error saving mappings:", error);
      alert("Failed to save mappings.");
    }
  };

  const renderMenus = (menuList) =>
    menuList.map((menu) => {
      console.log("Selected Role:", selectedRole);
console.log("Menu ID:", menu.id);
console.log("roleMenuMapping:", roleMenuMapping);
console.log("Mapped Value:", roleMenuMapping[selectedRole]?.[menu.id]);
      const subMenus = menu.subMenus || menu.submenus || [];
      const isParentChecked = roleMenuMapping[selectedRole]?.[menu.id] === true;
      //const isParentChecked = roleMenuMapping[selectedRole]?.[menu.id] || false;
      //const isParentChecked = !!roleMenuMapping[selectedRole]?.[String(menu.id)];
      console.log("Parent",isParentChecked);
  
      return (
        <div key={menu.id} style={{ margin: '10px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={!!roleMenuMapping[selectedRole]?.[menu.id]}
             onChange={(e) => handleParentCheck(menu.id, e.target.checked)}
              // checked={isParentChecked}
              // onChange={(e) =>
              //   handleCheckboxChange(menu.id, e.target.checked, subMenus)
             // }
            />
            <strong style={{ marginLeft: '8px' }}>{menu.name}</strong>
          </label>
  
          {subMenus.length > 0 && isParentChecked && (

<div style={{ marginLeft: '25px', marginTop: '5px' }}>
{subMenus.map((sub) => (
  <div key={sub.id} className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      id={`sub-${sub.id}`}
      checked={roleMenuMapping[selectedRole]?.[sub.id] || false}
      onChange={(e) =>
        handleCheckboxChange(sub.id, e.target.checked, [], menu.id)
      }
    />
    <label className="form-check-label" htmlFor={`sub-${sub.id}`}>
      {sub.name}
    </label>
  </div>
))}
</div>
          )}
        </div>
      );
    });


  console.log("Menus to render:", menus);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Role Menu Mapping"  isBack={true}/>
        <div className="my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 card border border-dark shadow-lg py-2" style={{height : '397px'}}>
              <div className="col-md-12">
                <form style={{height : '100%'}}>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                
        <label className="col-md-4 mt-2" htmlFor="roleDropdown">Select Role:</label>
        <select
          className="form-control w-100"
          id="roleDropdown"
          value={selectedRole}
          onChange={handleRoleChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="">-- Choose Role --</option>
          {roles.map(({ id, roleName }) => (
          <option key={id} value={id}>{roleName}</option>
          ))}
</select>
      </div>
</div>

      {/* //{selectedRole && ( */}
        <>
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
            {menus.length === 0 ? (
              <p>Loading menu data...</p>
            ) : (
              renderMenus(menus)
            )}
          </div>
          <div style={{ marginTop: '15px' }}>
            <button className="btn btn-primary" onClick={(e) => handleSaveMappings(e)}>
              Save Mapping
            </button>
            </div>          {/* <button
            onClick={handleSaveMappings}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
              Save Mappings
          </button> */}
        </>
                </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      
      <Footer />
    </div >
  );
};

export default RoleMenuMapping;
