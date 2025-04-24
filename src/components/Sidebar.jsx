import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css"; // Importing CSS modules
import AviationLogo from "../static/img/AviationLogo.png";
//import decode from "jwt-decode";
//import jwt_decode from "jwt-decode";
import {jwtDecode as jwt_decode} from 'jwt-decode';

const storedMenuItems = localStorage.getItem("menuItems");
  const menuItems = storedMenuItems ? JSON.parse(storedMenuItems) : [];
const Sidebar = () => {  //() => {
  console.log("Menu Items being passed:", menuItems);
  const [collapseState, setCollapseState] = useState({
    // supplierReg: false,
    // purchaseOrder: false,
    // materialManagement: false,
    // MaterialNote: false,
    // userManagement: false,
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

   // Utility function to check if the current user has a specific role
   const { hasRole } = useUserRoles();
   

  console.log("Menu Items being passed in sidbar:", menuItems);


  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img
          src={AviationLogo}
          alt="Logo"
          style={{ height: "30px", width: "30px" }}
        />
        <h3 className={styles.companyName}>Aviation</h3>
      </div>

      <div className={styles.sidebarMenu}>
        <ul className={styles.menuList}>
          {menuItems.map((menu) => {
            //if (!hasRole(menu.roles)) return null;

            const isOpen = collapseState[menu.id];

            return (
              <li key={menu.id} className={styles.menuItem}>
                <a
                  className={styles.menuToggle}
                  onClick={() => toggleCollapse(menu.id)}
                  aria-expanded={isOpen ? "true" : "false"}
                >
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
                          <a href={sub.path} className={styles.submenuLink}>
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


          {/* User Management */}
          {/* {hasRole("Admin") && (
          <li className={styles.menuItem}>
            <a
              className={styles.menuToggle}
              onClick={() => toggleCollapse("userManagement")}
              aria-expanded={collapseState.userManagement ?"true" : "false"}
            >
              User Management
              <span
                className={`${styles.toggleIcon} ${
                  collapseState.userManagement ? styles.open : ""
                }`}
              >
                ▶
              </span>
            </a>

            <div
              className={`${styles.submenu} ${
                collapseState.userManagement ? styles.show : ""
              }`}
              id="userManagement-collapse"
            >
              <ul className={styles.submenuList}>
                <li className={styles.submenuItem}>
                  <a href="/AddUser" className={styles.submenuLink}>
                    Add User
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a href="/ViewUser" className={styles.submenuLink}>
                    View User
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a href="/AddRole" className={styles.submenuLink}>
                    Add Role
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a href="/RoleMenuMapping" className={styles.submenuLink}>
                    Role Menu Mapping
                  </a>
                </li>
              </ul>
            </div>
          </li>
          )} */}
          
          {/* Supplier Registration */}
          {/* <li className={styles.menuItem}>
            <a
              className={styles.menuToggle}
              onClick={() => toggleCollapse("supplierReg")}
              aria-expanded={collapseState.supplierReg ? "true" : "false"}
            >
              Supplier Registration
              <span
                className={`${styles.toggleIcon} ${
                  collapseState.supplierReg ? styles.open : ""
                }`}
              >
                ▶
              </span>
            </a>

            <div
              className={`${styles.submenu} ${
                collapseState.supplierReg ? styles.show : ""
              }`}
              id="supplierReg-collapse"
            >
              <ul className={styles.submenuList}>
                <li className={styles.submenuItem}>
                  <a
                    href="/SupplierRegistration"
                    className={styles.submenuLink}
                  >
                    Registration
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a
                    href="/ViewSupplierRegistration"
                    className={styles.submenuLink}
                  >
                    View Supplier
                  </a>
                </li>
              </ul>
            </div>
          </li> */}

          {/* Product Order */}
          {/* <li className={styles.menuItem}>
            <a
              className={styles.menuToggle}
              onClick={() => toggleCollapse("purchaseOrder")}
              aria-expanded={collapseState.purchaseOrder ? "true" : "false"}
            >
              Product Order
              <span
                className={`${styles.toggleIcon} ${
                  collapseState.purchaseOrder ? styles.open : ""
                }`}
              >
                ▶
              </span>
            </a>

            <div
              className={`${styles.submenu} ${
                collapseState.purchaseOrder ? styles.show : ""
              }`}
              id="purchaseOrder-collapse"
            >
              <ul className={styles.submenuList}>
                <li className={styles.submenuItem}>
                  <a href="/AddProduct" className={styles.submenuLink}>
                    Add Product
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a href="/ProductList" className={styles.submenuLink}>
                    View Product
                  </a>
                </li>
              </ul>
            </div>
          </li> */}

          {/* Store Acceptance */}
          {/* <li className={styles.menuItem}>
            <a
              className={styles.menuToggle}
              onClick={() => toggleCollapse("materialManagement")}
              aria-expanded={
                collapseState.materialManagement ? "true" : "false"
              }
            >
              Store Acceptance
              <span
                className={`${styles.toggleIcon} ${
                  collapseState.materialManagement ? styles.open : ""
                }`}
              >
                ▶
              </span>
            </a>

            <div
              className={`${styles.submenu} ${
                collapseState.materialManagement ? styles.show : ""
              }`}
              id="materialManagement-collapse"
            >
              <ul className={styles.submenuList}>
                <li className={styles.submenuItem}>
                  <a href="/storeAcceptance" className={styles.submenuLink}>
                    Registration
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a href="/viewstoreAcceptance" className={styles.submenuLink}>
                    View Store
                  </a>
                </li>
              </ul>
            </div>
          </li> */}

          {/* Material Note */}
          {/* <li className={styles.menuItem}>
            <a
              className={styles.menuToggle}
              onClick={() => toggleCollapse("MaterialNote")}
              aria-expanded={collapseState.MaterialNote ? "true" : "false"}
            >
              Material Note
              <span
                className={`${styles.toggleIcon} ${
                  collapseState.MaterialNote ? styles.open : ""
                }`}
              >
                ▶
              </span>
            </a>

            <div
              className={`${styles.submenu} ${
                collapseState.MaterialNote ? styles.show : ""
              }`}
              id="MaterialNote-collapse"
            >
              <ul className={styles.submenuList}>
                <li className={styles.submenuItem}>
                  <a href="/materialPage" className={styles.submenuLink}>
                    Add MaterialNote
                  </a>
                </li>
                <li className={styles.submenuItem}>
                  <a href="/viewmaterialPage" className={styles.submenuLink}>
                    View MaterialNote
                  </a>
                </li>
              </ul>
            </div>
          </li> */}
//         </ul>
//       </div>

//       <div className={styles.sidebarFooter}>Dashboard v1.0</div>
//     </div>
//   );
// };

// export default Sidebar;
