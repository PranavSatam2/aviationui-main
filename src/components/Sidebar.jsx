import { useState } from "react";
import styles from "./sidebar.module.css";
import AviationLogo from "../static/img/AviationLogo.png";
import { Users, Package, Warehouse, FileText } from "lucide-react";
import { useRoleMenus } from "../context/RoleMenuContext";

const iconMap = {
  users: <Users size={18} />,
  package: <Package size={18} />,
  warehouse: <Warehouse size={18} />,
  filetext: <FileText size={18} />,
};

const Sidebar = () => {
  const { menuItems = [], loading } = useRoleMenus();
  const [collapseState, setCollapseState] = useState({});

  const toggleCollapse = (section, event) => {
    event.preventDefault(); // Prevent any default link behavior
    event.stopPropagation(); // Stop event bubbling
    
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (loading) {
    return <div className={styles.sidebar}>Loading Sidebar...</div>;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img
          style={{ height: "30px", width: "30px" }}
          src={AviationLogo}
          alt="Logo"
        />
        <h3 className={styles.companyName}>Aviation</h3>
      </div>

      <div className={styles.sidebarMenu}>
        <ul className={styles.menuList}>
          {menuItems.map((menu) => {
            const isOpen = collapseState[menu.id];

            return (
              <li key={menu.id} className={styles.menuItem}>
                {/* Changed from <a> to <div> and added proper event handling */}
                <div
                  className={styles.menuToggle}
                  onClick={(event) => toggleCollapse(menu.id, event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      toggleCollapse(menu.id, event);
                    }
                  }}
                  aria-expanded={isOpen ? "true" : "false"}
                >
                  <div className={styles.menuContent}>
                    {iconMap[menu.icon]}
                    <span className={styles.menuName}>{menu.name}</span>
                  </div>
                  <span
                    className={`${styles.toggleIcon} ${
                      isOpen ? styles.open : ""
                    }`}
                  >
                    ▶
                  </span>
                </div>

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
                          <a 
                            href={`/aviationui${sub.path}`} 
                            className={styles.submenuLink}
                          >
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