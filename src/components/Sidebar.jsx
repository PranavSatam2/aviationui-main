import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css"; // Importing CSS modules
import AviationLogo from "../static/img/AviationLogo.png";
import {jwtDecode as jwt_decode} from 'jwt-decode';
import { Users, Package, Warehouse, FileText } from "lucide-react";

const iconMap = {
  users: <Users size={18} />,
  package: <Package size={18} />,
  warehouse: <Warehouse size={18} />,
  filetext: <FileText size={18} />,
};

const storedMenuItems = localStorage.getItem("menuItems");
  const menuItems = storedMenuItems ? JSON.parse(storedMenuItems) : [];
const Sidebar = () => {  //() => {
  //console.log("Menu Items being passed:", menuItems);
  const [collapseState, setCollapseState] = useState({
  });

  const useUserRoles = () => {
    const [roles, setRoles] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        const decodedToken = jwt_decode(token);
        setRoles(decodedToken.roles || []);
      }
    }, []);
  
    const hasRole = (role) => roles.includes(role);
    return { roles, hasRole };
  };

  const toggleCollapse = (section) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  //console.log("Menu Items being passed in sidbar:", menuItems);


  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img
          style={{ height: "30px", width: "30px" }}
          src={AviationLogo}
          alt="Logo"
        ></img>
        <h3 className={styles.companyName}>Aviation</h3>
      </div>

      <div className={styles.sidebarMenu}>
        <ul className={styles.menuList}>
          {menuItems.map((menu) => {
            const isOpen = collapseState[menu.id];

            return (
              <li key={menu.id} className={styles.menuItem}>
                <a
                  className={styles.menuToggle}
                  onClick={() => toggleCollapse(menu.id)}
                  aria-expanded={isOpen ? "true" : "false"}
                >
                  {iconMap[menu.icon]}  {/* This renders the dynamic icon */}
                  {menu.name}
                  <span
                    className={`${styles.toggleIcon} ${
                      isOpen ? styles.open : ""
                    }`}
                  >
                    ▶
                  </span>
                </a>

                {menu.subMenus && menu.subMenus.length > 0 && (
                  <div
                    className={`${styles.submenu} ${
                      isOpen ? styles.show : ""
                    }`}
                    id={`${menu.name}-collapse`}
                  >
                    <ul className={styles.submenuList}>
                      {menu.subMenus.map((sub) => (
                        <li key={sub.id} className={styles.submenuItem}>
                          <a href={`/aviationui${sub.path}`} className={styles.submenuLink}>
                            {sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.sidebarFooter}>Dashboard v1.0</div>
    </div>
  );
};

export default Sidebar;