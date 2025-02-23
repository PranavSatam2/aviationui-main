import React, { useState } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import ViewProduct from './ViewProduct';
import SupplierRegistration from './SupplierRegistration';
import ViewSupplierRegistration from './ViewSupplierRegis';
import { Link } from 'react-router-dom';

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
    <div className="flex-shrink-0 p-3" style={{ width: '220px', position: 'fixed', zIndex: 1050, height: '100vh', backgroundColor: '#6c8dfa', color: 'white' }}>
      <a href="/" className="d-flex align-items-center pb-3 my-4 link-dark text-decoration-none border-bottom">
        <svg className="bi me-2" width="30" height="24">
          <use xlinkHref="#bootstrap" />
        </svg>
        <img src="src/static/img/prfileLogo.png" alt="Profile" className="rounded-circle mx-5" style={{ height: '30px', width: '30px' }} />
      </a>

      <ul className="list-unstyled ps-0 my-5">
        {/* Supplier Registration */}
        <li className="mb-4">
          <a
            className="mx-2 mb-2 btn-toggle align-items-center rounded text-white mb-3 font-weight-bold text-decoration-none"
            onClick={() => toggleCollapse('supplierReg')}
            aria-expanded={collapseState.supplierReg ? 'true' : 'false'}
          >
            Supplier Registration
          </a>
          <div className={`collapse ${collapseState.supplierReg ? 'show' : ''} bg-white rounded border mt-2`} id="supplierReg-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small p-3">
              <li className="mb-2">
                <span><i className="fa-solid fa-address-card"></i><Link to="/SupplierRegistration" className="rounded mb-4 text-dark text-decoration-none">Registration</Link></span>
              </li>
              <li className="mb-2">
                <span><i className="fa-solid fa-eye"></i><Link to="/ViewSupplierRegistration" className="rounded mb-4 text-dark text-decoration-none">View Supplier</Link></span>
              </li>
            </ul>
          </div>
        </li>

        {/* Product Order */}
        <li className="mb-4">
          <a
            className="mx-2 mb-2 btn-toggle align-items-center rounded text-white mb-3 font-weight-bold text-decoration-none"
            onClick={() => toggleCollapse('purchaseOrder')}
            aria-expanded={collapseState.purchaseOrder ? 'true' : 'false'}
          >
            Product Order
          </a>
          <div className={`collapse ${collapseState.purchaseOrder ? 'show' : ''} bg-white rounded border mt-2`} id="purchaseOrder-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small p-3">
              <li className="mb-2"><a href="AddProduct" className="rounded mb-4 text-dark text-decoration-none">Add Product</a></li>
              <li className="mb-2"><a href="ProductList" className="rounded mb-4 text-dark text-decoration-none">View Product</a></li>
            </ul>
          </div>
        </li>

        {/* Store Acceptance */}
        <li className="mb-4">
          <a
            className="mx-2 mb-2 btn-toggle align-items-center rounded text-white mb-3 font-weight-bold text-decoration-none"
            onClick={() => toggleCollapse('materialManagement')}
            aria-expanded={collapseState.materialManagement ? 'true' : 'false'}
          >
            Store Acceptance
          </a>
          <div className={`collapse ${collapseState.materialManagement ? 'show' : ''} bg-white rounded border mt-2`} id="materialManagement-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small p-3">
              <li className="mb-2"><span><i className="fa-solid fa-address-card"></i><Link to="/storeAcceptance" className="rounded mb-4 text-dark text-decoration-none">Registration</Link></span></li>
              <li className="mb-2"><span><i className="fa-solid fa-eye"></i><Link to="/viewstoreAcceptance" className="rounded mb-4 text-dark text-decoration-none">View Store</Link></span></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
