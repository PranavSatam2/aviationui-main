import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleMenuMapping = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [roleMenuMapping, setRoleMenuMapping] = useState({});

  useEffect(() => {
    // Fetch roles and menus
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/roles/role');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axios.get('/api/roles/menus');
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchRoles();
    fetchMenus();
  }, []);

  const handleCheckboxChange = (roleId, menuId, isChecked) => {
    setRoleMenuMapping((prevState) => ({
      ...prevState,
      [roleId]: {
        ...prevState[roleId],
        [menuId]: isChecked
      }
    }));
  };

  // Recursive function to render menus and submenus
  const renderMenu = (menu) => {
    return (
      <div key={menu.id} style={{ marginLeft: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={roleMenuMapping[menu.id] || false}
            onChange={(e) => handleCheckboxChange('roleId', menu.id, e.target.checked)}  // Replace 'roleId' with actual role
          />
          {menu.name}
        </label>
        {menu.submenus && menu.submenus.length > 0 && (
          <div style={{ marginLeft: '20px' }}>
            {menu.submenus.map((submenu) => renderMenu(submenu))}
          </div>
        )}
      </div>
    );
  };

  const handleSaveMappings = async () => {
    const mappings = [];

    Object.keys(roleMenuMapping).forEach((roleId) => {
      const roleMenus = roleMenuMapping[roleId];
      Object.keys(roleMenus).forEach((menuId) => {
        mappings.push({
          roleId: parseInt(roleId),
          menuId: parseInt(menuId),
          accessible: roleMenus[menuId]
        });
      });
    });

    try {
      await axios.post('/api/roles/save-mapping', mappings);
      alert('Role-Menu mappings saved successfully!');
    } catch (error) {
      console.error('Error saving mappings:', error);
    }
  };

  return (
    <div>
      <h1>Role-Menu Mapping</h1>
      <div>
        {menus.map((menu) => renderMenu(menu))} {/* Render root menus */}
      </div>
      <button onClick={handleSaveMappings}>Save Mappings</button>
    </div>
  );
};

export default RoleMenuMapping;