import React, { useState } from "react";
import styles from "./sidebar.module.css"; // Importing CSS modules
import AviationLogo from "../static/img/AviationLogo.png";

const Sidebar = () => {
  const [collapseState, setCollapseState] = useState({
    supplierReg: false,
    purchaseOrder: false,
    materialManagement: false,
    MaterialNote: false,
  });

  const toggleCollapse = (section) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

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
          {/* Supplier Registration */}
          <li className={styles.menuItem}>
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
          </li>

          {/* Product Order */}
          <li className={styles.menuItem}>
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
          </li>

          {/* Store Acceptance */}
          <li className={styles.menuItem}>
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
          </li>

          {/* Material Note */}
          <li className={styles.menuItem}>
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
          </li>
        </ul>
      </div>

      <div className={styles.sidebarFooter}>Dashboard v1.0</div>
    </div>
  );
};

export default Sidebar;
