import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleMenuMapping = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleMenuMapping, setRoleMenuMapping] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError('You need to be logged in to change your password');
      return;
    }

    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/roles/role', {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        alert("There was an error fetching roles.");
      }
    };

    // Fetch menus
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/roles/menus', {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
        alert("There was an error fetching menus.");
      }
    };

    fetchRoles();
    fetchMenus();
  }, []);

  // Handle change in role selection
  const handleRoleChange = (event) => {
    const roleId = event.target.value;
    setSelectedRole(roleId);
    setRoleMenuMapping((prevState) => ({
      ...prevState,
      [roleId]: prevState[roleId] || {},
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (menuId, isChecked) => {
    setRoleMenuMapping((prevState) => ({
      ...prevState,
      [selectedRole]: {
        ...prevState[selectedRole],
        [menuId]: isChecked,
      },
    }));
  };

  // Recursive function to render menus and submenus
  const renderMenu = (menu) => {
    return (
      <div key={menu.id} style={{ marginLeft: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={roleMenuMapping[selectedRole]?.[menu.id] || false}
            onChange={(e) => handleCheckboxChange(menu.id, e.target.checked)}
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

  // Handle saving mappings
  const handleSaveMappings = async () => {
    if (!selectedRole) {
      alert('Please select a role to save mappings.');
      return;
    }

    const mappings = [];
    const roleMenus = roleMenuMapping[selectedRole] || {};

    Object.keys(roleMenus).forEach((menuId) => {
      mappings.push({
        roleId: parseInt(selectedRole),
        menuId: parseInt(menuId),
        accessible: roleMenus[menuId],
      });
    });

    try {
      await axios.post('http://localhost:8082/api/roles/saveMapping', mappings);
      alert('Role-Menu mappings saved successfully!');
    } catch (error) {
      console.error('Error saving mappings:', error);
      alert("There was an error saving the mappings.");
    }
  };

  return (
    <div>
      <h1>Role-Menu Mapping</h1>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Dropdown for selecting role */}
      <div>
        <label htmlFor="roleDropdown">Select Role: </label>
        <select id="roleDropdown" onChange={handleRoleChange} value={selectedRole || ''}>
          <option value="" disabled>Select a Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show menus and checkboxes only if a role is selected */}
      {selectedRole && (
        <div>
          <h3>Assign Menus to Role</h3>
          {menus.map((menu) => renderMenu(menu))} {/* Render root menus */}
        </div>
      )}

      <button onClick={handleSaveMappings}>Save Mappings</button>
    </div>
  );
};

export default RoleMenuMapping;
