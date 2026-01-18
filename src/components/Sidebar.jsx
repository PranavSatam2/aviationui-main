import { useState } from "react";
import styles from "./sidebar.module.css";
import AviationLogo from "../static/img/AMCLOGO.jpg";
import { Users, Package, Warehouse, FileText, ChevronRight } from "lucide-react";
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
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleCollapse = (section, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (loading) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <img
            style={{ height: "55px", width: "80px", objectFit: "contain" }}
            src={AviationLogo}
            alt="AMC Logo"
            className={styles.logoImage}
          />
        </div>
        <div className={styles.headerDivider}></div>
      </div>

      {/* Menu */}
      <div className={styles.sidebarMenu}>
        <ul className={styles.menuList}>
          {menuItems.map((menu, index) => {
            const isOpen = collapseState[menu.id];
            const isHovered = hoveredItem === menu.id;

            return (
              <li 
                key={menu.id} 
                className={styles.menuItem}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`${styles.menuToggle} ${isOpen ? styles.active : ''}`}
                  onClick={(event) => toggleCollapse(menu.id, event)}
                  onMouseEnter={() => setHoveredItem(menu.id)}
                  onMouseLeave={() => setHoveredItem(null)}
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
                    <div className={styles.iconWrapper}>
                      {iconMap[menu.icon]}
                    </div>
                    <span className={styles.menuName}>{menu.name}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`${styles.toggleIcon} ${isOpen ? styles.open : ''}`}
                  />
                </div>

                {menu.subMenus && menu.subMenus.length > 0 && (
                  <div
                    className={`${styles.submenu} ${isOpen ? styles.show : ''}`}
                    id={`${menu.name}-collapse`}
                  >
                    <ul className={styles.submenuList}>
                      {menu.subMenus.map((sub, subIndex) => (
                        <li 
                          key={sub.id} 
                          className={styles.submenuItem}
                          style={{ animationDelay: `${subIndex * 0.05}s` }}
                        >
                          <a 
                            href={`/aviationui${sub.path}`} 
                            className={styles.submenuLink}
                          >
                            <span className={styles.submenuDot}></span>
                            <span className={styles.submenuText}>{sub.name}</span>
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

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.versionBadge}>
          <span className={styles.versionText}>Dashboard</span>
          <span className={styles.versionNumber}>v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;