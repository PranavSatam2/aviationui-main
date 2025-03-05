import React, { useState } from 'react';
import AddProduct from './AddProduct';
import { Home, Truck, ShoppingCart, Warehouse, ClipboardList, BarChart3, Settings, ChevronRight, ChevronDown, Menu, LogOut, PlusCircle, Eye, FileText, Package, LayoutList } from 'lucide-react';

import EditProduct from './EditProduct';
import ViewProduct from './ViewProduct';
import SupplierRegistration from './SupplierRegistration';
import ViewSupplierRegistration from './ViewSupplierRegis';
import { Link } from 'react-router-dom';
import '../static/css/admin.css'

const Sidebar = () => {
  const [collapseState, setCollapseState] = useState({
    supplierReg: false,
    purchaseOrder: false,
    materialManagement: false,
  });

  const toggleCollapse = (section) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (

<div 
  className="flex-shrink-0" 
  style={{ 
    width: '280px', 
    position: 'fixed', 
    zIndex: 1050, 
    height: '100vh', 
    backgroundColor: '#1B74E4', /* Updated Meta blue */
    color: 'white',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    borderRadius: '0 16px 16px 0'
  }}
>
  {/* Header with profile */}
  <div 
    className="d-flex align-items-center justify-content-between px-4 py-3" 
    style={{ 
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      background: 'linear-gradient(to right, #1B74E4, #0B5FBF)',
      borderRadius: '0 16px 0 0'
    }}
  >
    <div className="d-flex align-items-center">
      <img 
        src="src/static/img/prfileLogo.png" 
        alt="Profile" 
        className="rounded-circle" 
        style={{ 
          height: '38px', 
          width: '38px',
          border: '2px solid white',
          objectFit: 'cover'
        }} 
      />
      <div className="ms-3">
        <div style={{ fontSize: '15px', fontWeight: '600', marginLeft:'5px' }}>Admin Portal</div>
      </div>
      <div className="ms-auto">
      <a 
        href="http://localhost:8089/" 
        style={{ 
          color: 'white', 
          opacity: '0.8',
          display: 'flex',
          marginLeft:'8px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
      >
        <LogOut size={18} />
      </a>
    </div>
    </div>
    <button 
      style={{ 
        background: 'none', 
        border: 'none', 
        color: 'white', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    </button>
  </div>

  {/* Navigation Menu */}
  <div className="py-2" style={{ overflowY: 'auto', height: 'calc(100vh - 138px)' }}>
    <ul className="list-unstyled ps-0 mt-2">
      {/* Dashboard Item */}
      
      {/* Supplier Registration */}
      <li className="mb-1">
        <a
          className="d-flex align-items-center justify-content-between text-white text-decoration-none px-4 py-3 mx-2"
          onClick={() => toggleCollapse('supplierReg')}
          style={{ 
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            backgroundColor: collapseState.supplierReg ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          }}
          onMouseOver={(e) => {
            if (!collapseState.supplierReg) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }
          }}
          onMouseOut={(e) => {
            if (!collapseState.supplierReg) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center">
            <Truck size={18} className="custom-icon-gap" />
                     Supplier Registration
          </div>
          {collapseState.supplierReg ? 
            <ChevronDown size={16} /> : 
            <ChevronRight size={16} />
          }
        </a>
        <div 
          style={{ 
            maxHeight: collapseState.supplierReg ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            marginLeft: '8px',
          }}
        >
          <ul className="list-unstyled">
            <li className="mx-3">
              <Link 
                to="/SupplierRegistration" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <FileText size={14} className="custom-icon-gap" />
                Registration
              </Link>
            </li>
            <li className="mx-3">
              <Link 
                to="/ViewSupplierRegistration" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <Eye size={14} className="custom-icon-gap" />
                View Supplier
              </Link>
            </li>
          </ul>
        </div>
      </li>

      {/* Product Order */}
      <li className="mb-1">
        <a
          className="d-flex align-items-center justify-content-between text-white text-decoration-none px-4 py-3 mx-2"
          onClick={() => toggleCollapse('purchaseOrder')}
          style={{ 
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            backgroundColor: collapseState.purchaseOrder ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          }}
          onMouseOver={(e) => {
            if (!collapseState.purchaseOrder) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }
          }}
          onMouseOut={(e) => {
            if (!collapseState.purchaseOrder) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center">
            <ShoppingCart size={18} className="custom-icon-gap" />
            Product Order
          </div>
          {collapseState.purchaseOrder ? 
            <ChevronDown size={16} /> : 
            <ChevronRight size={16} />
          }
        </a>
        <div 
          style={{ 
            maxHeight: collapseState.purchaseOrder ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            marginLeft: '8px',
          }}
        >
          <ul className="list-unstyled">
            <li className="mx-3">
              <a 
                href="AddProduct" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <PlusCircle size={14} className="custom-icon-gap" />
                Add Product
              </a>
            </li>
            <li className="mx-3">
              <a 
                href="ProductList" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <LayoutList size={14} className="custom-icon-gap" />
                View Product
              </a>
            </li>
          </ul>
        </div>
      </li>

      {/* Store Acceptance */}
      <li className="mb-1">
        <a
          className="d-flex align-items-center justify-content-between text-white text-decoration-none px-4 py-3 mx-2"
          onClick={() => toggleCollapse('materialManagement')}
          style={{ 
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            backgroundColor: collapseState.materialManagement ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          }}
          onMouseOver={(e) => {
            if (!collapseState.materialManagement) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }
          }}
          onMouseOut={(e) => {
            if (!collapseState.materialManagement) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center">
            <Warehouse size={18} className="custom-icon-gap" />
            Store Acceptance
          </div>
          {collapseState.materialManagement ? 
            <ChevronDown size={16} /> : 
            <ChevronRight size={16} />
          }
        </a>
        <div 
          style={{ 
            maxHeight: collapseState.materialManagement ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            marginLeft: '8px',
          }}
        >
          <ul className="list-unstyled">
            <li className="mx-3">
              <Link 
                to="/storeAcceptance" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <FileText size={14} className="custom-icon-gap" />
                Registration
              </Link>
            </li>
            <li className="mx-3">
              <Link 
                to="/viewstoreAcceptance" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <Eye size={14} className="custom-icon-gap" />
                View Store
              </Link>
            </li>
          </ul>
        </div>
      </li>

      {/* Material Note */}
      <li className="mb-1">
        <a
          className="d-flex align-items-center justify-content-between text-white text-decoration-none px-4 py-3 mx-2"
          onClick={() => toggleCollapse('MaterialNote')}
          style={{ 
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            backgroundColor: collapseState.MaterialNote ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          }}
          onMouseOver={(e) => {
            if (!collapseState.MaterialNote) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }
          }}
          onMouseOut={(e) => {
            if (!collapseState.MaterialNote) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center">
            <ClipboardList size={18} className="custom-icon-gap" />
            Material Note
          </div>
          {collapseState.MaterialNote ? 
            <ChevronDown size={16} /> : 
            <ChevronRight size={16} />
          }
        </a>
        <div 
          style={{ 
            maxHeight: collapseState.MaterialNote ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            marginLeft: '8px',
          }}
        >
          <ul className="list-unstyled">
            <li className="mx-3">
              <a 
                href="materialPage" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <PlusCircle size={14} className="custom-icon-gap" />
                Add Material Note
              </a>
            </li>
            <li className="mx-3">
              <a 
                href="viewmaterialPage" 
                className="d-flex align-items-center text-white text-decoration-none px-4 py-2 my-1"
                style={{ 
                  fontSize: '13px',
                  opacity: '0.9',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <Eye size={14} className="custom-icon-gap" />
                View Material Note
              </a>
            </li>
          </ul>
        </div>
      </li>

      {/* Reports */}
      

      {/* Settings */}
      <li>
        <a
          href="/settings"
          className="d-flex align-items-center text-white text-decoration-none px-4 py-3 mx-2"
          style={{ 
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            borderRadius: '8px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Settings size={18} className="custom-icon-gap" />
          Settings
        </a>
      </li>
    </ul>
  </div>

  {/* Bottom section with user info */}
  <div 
    className="mt-auto px-4 py-3 d-flex align-items-center" 
    style={{ 
      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.08)',
      borderRadius: '0 0 16px 0'
    }}
  >
    
    
  </div>
</div>
  );
};

export default Sidebar;
