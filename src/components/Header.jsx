// Header.jsx
import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import styles from "./Header.module.css";
import ProfileLogo from "../static/img/prfileLogo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');
  const role = sessionStorage.getItem('role');
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handlelogout = () => {
    sessionStorage.clear();
    navigate("/");
    toast.success("Log out Successful");
  };
  
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        {/* Company Branding */}
        <div className={styles.brandSection}>
          <div className={styles.brandGlow}></div>
          <h3 className={styles.companyName}>AMC Technology</h3>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Divider */}
          <div className={styles.verticalDivider}></div>

          {/* User Profile */}
          <div className={styles.profileContainer}>
            <button className={styles.profileButton} onClick={toggleDropdown}>
              <div className={styles.avatarContainer}>
                <img src={ProfileLogo} alt="Profile" className={styles.avatar} />
                <div className={styles.statusIndicator}></div>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{username || 'User'}</div>
                <div className={styles.userRole}>{role || 'Guest'}</div>
              </div>
              <ChevronDown 
                size={16} 
                className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className={styles.dropdownBackdrop} onClick={toggleDropdown}></div>
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>
                      <img src={ProfileLogo} alt="Profile" />
                    </div>
                    <div>
                      <p className={styles.dropdownName}>{username || 'User'}</p>
                      <p className={styles.dropdownRole}>{role || 'Guest'}</p>
                    </div>
                  </div>
                  
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.dropdownItemDanger} onClick={handlelogout}>
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;