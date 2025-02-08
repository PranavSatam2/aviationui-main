import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex-shrink-0 p-3" style={{ width: '220px', position: 'fixed', zIndex: 1050, height: '100vh', backgroundColor: '#6c8dfa', color: 'white' }}>
      <a href="/" className="d-flex align-items-center pb-3 my-5 link-dark text-decoration-none border-bottom">
        <svg className="bi me-2" width="30" height="24"> <use xlinkHref="#bootstrap" /> </svg> <span className="fs-5 fw-semibold text-white font-weight-bold">AMC Technology</span>
      </a>

      <ul className="list-unstyled ps-0">
        <li className="mb-4">
          <a className="mx-2 mb-2 btn-toggle align-items-center rounded collapsed text-white mb-3 font-weight-bold text-decoration-none" data-bs-toggle="collapse" data-bs-target="#supplierReg-collapse" aria-expanded="false">
            Supplier Registration
          </a>
          <div className="collapse bg-white rounded border mt-2" id="supplierReg-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small p-3">
              <li className="mb-2"><Link to="/SupplierRegistration" className="rounded mb-4 text-dark text-decoration-none">Supplier Registration</Link></li>
              <li className="mb-2"><Link to="/view-supplier-registrtaion" className="rounded mb-4 text-dark text-decoration-none">View Supplier Registration</Link></li>
            </ul>
          </div>
        </li>

        {/* Additional Menu Items */}
        <li className="mb-4">
          <a className="mx-2 mb-2 btn-toggle align-items-center rounded collapsed text-white mb-3 font-weight-bold text-decoration-none" data-bs-toggle="collapse" data-bs-target="#purchaseOrder-collapse" aria-expanded="false">
            Purchase Order
          </a>
          <div className="collapse bg-white rounded border mt-2" id="purchaseOrder-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small p-3">
              <li className="mb-2"><Link to="#" className="rounded mb-4 text-dark text-decoration-none">Overview</Link></li>
            </ul>
          </div>
        </li>

        {/* More Menu Items */}
        <li className="mb-4">
          <a className="mx-2 mb-2 btn-toggle align-items-center rounded collapsed text-white mb-3 font-weight-bold text-decoration-none" data-bs-toggle="collapse" data-bs-target="#materialManagement-collapse" aria-expanded="false">
            Material Management
          </a>
          <div className="collapse bg-white rounded border mt-2" id="materialManagement-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small p-3">
              <li className="mb-2"><Link to="#" className="rounded mb-4 text-dark text-decoration-none">Overview</Link></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
