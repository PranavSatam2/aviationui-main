import React, { useState, useEffect } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import styles from "./RoleMenuMapping.module.css";

const RoleMenuMapping = () => {
  const navigate = useNavigate();
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
      const subMenus = menu.subMenus || menu.submenus || [];
      const isParentChecked = roleMenuMapping[selectedRole]?.[menu.id] === true;

      return (
        <div key={menu.id} className={styles.menuItem}>
          {/* Parent Menu */}
          <div className={styles.parentMenu}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                id={`menu-${menu.id}`}
                checked={!!roleMenuMapping[selectedRole]?.[menu.id]}
                onChange={(e) =>
                  handleParentCheck(menu.id, e.target.checked, subMenus)
                }
              />
              <span className={styles.checkmark}></span>
              <span className={styles.menuName}>{menu.name}</span>
            </label>
          </div>

          {/* Sub Menus */}
          {subMenus.length > 0 && (
            <div className={styles.subMenuContainer}>
              {subMenus.map((sub) => (
                <div key={sub.id} className={styles.subMenuItem}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      id={`sub-${sub.id}`}
                      checked={roleMenuMapping[selectedRole]?.[sub.id] || false}
                      disabled={!isParentChecked}
                      onChange={(e) =>
                        handleCheckboxChange(sub.id, e.target.checked, [], menu.id)
                      }
                    />
                    <span className={styles.checkmark}></span>
                    <span className={styles.subMenuName}>{sub.name}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Role Menu Mapping</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form>
                  {/* Role Selection Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-user-shield"></i>
                    <span>Role Selection</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="roleDropdown" className={styles.label}>
                      Select Role <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="roleDropdown"
                      className={styles.select}
                      value={selectedRole}
                      onChange={handleRoleChange}
                    >
                      <option value="">-- Choose Role --</option>
                      {roles.map(({ id, roleName }) => (
                        <option key={id} value={id}>{roleName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Menu Permissions Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-list-ul"></i>
                    <span>Menu Permissions</span>
                  </div>

                  <div className={styles.menuListContainer}>
                    {menus.length === 0 ? (
                      <div className={styles.loadingBox}>
                        <div className={styles.spinner}></div>
                        <span>Loading menu data...</span>
                      </div>
                    ) : !selectedRole ? (
                      <div className={styles.infoBox}>
                        <i className="fa fa-info-circle"></i>
                        <span>Please select a role to configure menu permissions</span>
                      </div>
                    ) : (
                      renderMenus(menus)
                    )}
                  </div>

                  {/* Save Button */}
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.btnSubmit}
                      onClick={handleSaveMappings}
                      disabled={!selectedRole}
                    >
                      <i className="fa fa-save"></i>
                      <span>Save Mapping</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RoleMenuMapping;