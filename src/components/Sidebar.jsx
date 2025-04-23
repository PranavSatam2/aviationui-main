import React, { useState } from "react";
import styles from "./sidebar.module.css";
import AviationLogo from "../static/img/AviationLogo.png";
import { Users, Package, Warehouse, FileText } from "lucide-react";

const Sidebar = () => {
  const [collapseState, setCollapseState] = useState({});

  const toggleCollapse = (section) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleMouseEnter = (section) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: true,
    }));
  };

  const handleMouseLeave = (section) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: false,
    }));
  };

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
          {[
            {
              key: "supplierReg",
              icon: Users,
              label: "Supplier Registration",
              links: [
                { href: "/SupplierRegistration", label: "Registration" },
                { href: "/ViewSupplierRegistration", label: "View Supplier" },
                { href: "/approvesupplier ", label: "Approve Supplier " },
                { href: "/editsupplier ", label: "Edit Supplier " },
              ],
            },
            {
              key: "purchaseOrder",
              icon: Package,
              label: "Product Order",
              links: [
                { href: "/AddProduct", label: "Add Product" },
                { href: "/ProductList", label: "View Product" },
              ],
            },
            {
              key: "materialManagement",
              icon: Warehouse,
              label: "Store Acceptance",
              links: [
                { href: "/storeAcceptance", label: "Registration" },
                { href: "/viewstoreAcceptance", label: "View Store" },
              ],
            },
            {
              key: "MaterialNote",
              icon: FileText,
              label: "Material Note",
              links: [
                { href: "/materialPage", label: "Add MaterialNote" },
                { href: "/viewmaterialPage", label: "View MaterialNote" },
              ],
            },
            {
              key: "MaterialRequisition",
              icon: FileText,
              label: "Material Requisition",
              links: [
                {
                  href: "/addmaterialrequisition",
                  label: "Add Material Requisition",
                },
                { href: "/Viewmaterialrequisition", label: "View Requisition" },
              ],
            },
            {
              key: "PurchaseRequisition",
              icon: FileText,
              label: "Purchase Requisition",
              links: [
                {
                  href: "/addPurchaseRequisition",
                  label: "Add Purchase Requisition",
                },
                {
                  href: "/ViewPurchaseRequisition ",
                  label: "View Purchase Requisition",
                },
              ],
            },
            // { key: "Checker", icon: FileText, label: "Checker", links: [
            //   // { href: "/addPurchaseRequisition", label: "Add Purchase Requisition" },
            //   { href: "/checker ", label: "Checker" }
            // ] },
          ].map(({ key, icon: Icon, label, links }) => (
            <li
              key={key}
              className={styles.menuItem}
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={() => handleMouseLeave(key)}
            >
              <a
                className={styles.menuToggle}
                onClick={() => toggleCollapse(key)}
                aria-expanded={collapseState[key] ? "true" : "false"}
              >
                <Icon className={styles.icon} size={20} />
                {label}
                <span
                  className={`${styles.toggleIcon} ${
                    collapseState[key] ? styles.open : ""
                  }`}
                >
                  ▶
                </span>
              </a>
              <div
                className={`${styles.submenu} ${
                  collapseState[key] ? styles.show : ""
                }`}
              >
                <ul className={styles.submenuList}>
                  {links.map((link) => (
                    <li key={link.href} className={styles.submenuItem}>
                      <a href={link.href} className={styles.submenuLink}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sidebarFooter}>Dashboard v1.0</div>
    </div>
  );
};

export default Sidebar;
