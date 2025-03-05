import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import StoreAccComponent from "./StoreAccComponent";

const HomePage = () => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content" style={{ marginLeft: '280px' }}>
        <Header />
        
        {/* Title Header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ 
          backgroundColor: '#1B74E4', 
          color: 'white',
          borderBottom: '1px solid #0b5ed7'
        }}>
          <div>
            <h5 className="fw-semibold mb-1">Dashboard</h5>
            <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>Welcome to the Inventory Management System</p>
          </div>
          <div>
            <span className="badge text-bg-light" style={{ 
              fontSize: '13px', 
              fontWeight: '500', 
              padding: '8px 12px' 
            }}>
              <i className="fa-regular fa-calendar me-1"></i>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        
        <div className="container-fluid py-4 px-4" style={{ backgroundColor: '#f0f6ff' }}>
          {/* Quick Stats Section */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px', borderLeft: '4px solid #1B74E4' }}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-primary text-uppercase mb-1" style={{ fontSize: '12px', color: '#1B74E4' }}>
                        Total Suppliers
                      </div>
                      <div className="h5 mb-0 fw-bold text-gray-800">35</div>
                    </div>
                    <div className="col-auto">
                      <i className="fa-solid fa-building fa-2x" style={{ color: 'rgba(27, 116, 228, 0.2)' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px', borderLeft: '4px solid #38b000' }}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1" style={{ fontSize: '12px', color: '#38b000' }}>
                        Active Products
                      </div>
                      <div className="h5 mb-0 fw-bold text-gray-800">156</div>
                    </div>
                    <div className="col-auto">
                      <i className="fa-solid fa-box fa-2x" style={{ color: 'rgba(56, 176, 0, 0.2)' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px', borderLeft: '4px solid #f48c06' }}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1" style={{ fontSize: '12px', color: '#f48c06' }}>
                        Pending Orders
                      </div>
                      <div className="h5 mb-0 fw-bold text-gray-800">12</div>
                    </div>
                    <div className="col-auto">
                      <i className="fa-solid fa-clock fa-2x" style={{ color: 'rgba(244, 140, 6, 0.2)' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px', borderLeft: '4px solid #9d4edd' }}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1" style={{ fontSize: '12px', color: '#9d4edd' }}>
                        Completed Orders
                      </div>
                      <div className="h5 mb-0 fw-bold text-gray-800">89</div>
                    </div>
                    <div className="col-auto">
                      <i className="fa-solid fa-check-circle fa-2x" style={{ color: 'rgba(157, 78, 221, 0.2)' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="row">
            {/* Recent Activities */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm" style={{ 
                borderRadius: '10px', 
                overflow: 'hidden',
                borderTop: '3px solid #1B74E4'
              }}>
                <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ 
                  backgroundColor: '#e0ecff', 
                  borderBottom: '1px solid #c9dcff'
                }}>
                  <h6 className="m-0 fw-bold" style={{ color: '#1B74E4' }}>Recent Activities</h6>
                  <button className="btn btn-sm btn-outline-primary" style={{ 
                    fontSize: '12px',
                    borderColor: '#1B74E4',
                    color: '#1B74E4'
                  }}>
                    View All
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-semibold">New Supplier Added</h6>
                          <p className="mb-1 text-muted" style={{ fontSize: '14px' }}>Aerospace Components Ltd. has been registered as a new supplier.</p>
                        </div>
                        <span className="badge text-bg-light" style={{ fontSize: '12px' }}>Today</span>
                      </div>
                    </div>
                    <div className="list-group-item border-0 py-3 px-4" style={{ backgroundColor: '#fbfbfd' }}>
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-semibold">Material Receipt</h6>
                          <p className="mb-1 text-muted" style={{ fontSize: '14px' }}>25 units of Part #A2938 received from Global Industries.</p>
                        </div>
                        <span className="badge text-bg-light" style={{ fontSize: '12px' }}>Yesterday</span>
                      </div>
                    </div>
                    <div className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-semibold">Store Acceptance Completed</h6>
                          <p className="mb-1 text-muted" style={{ fontSize: '14px' }}>Quality inspection passed for recent order from EastTech Suppliers.</p>
                        </div>
                        <span className="badge text-bg-light" style={{ fontSize: '12px' }}>3 days ago</span>
                      </div>
                    </div>
                    <div className="list-group-item border-0 py-3 px-4" style={{ backgroundColor: '#fbfbfd' }}>
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-semibold">New Product Added</h6>
                          <p className="mb-1 text-muted" style={{ fontSize: '14px' }}>Part #B6721 has been added to the inventory system.</p>
                        </div>
                        <span className="badge text-bg-light" style={{ fontSize: '12px' }}>1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm" style={{ 
                borderRadius: '10px', 
                overflow: 'hidden',
                borderTop: '3px solid #1B74E4',
                height: '100%'
              }}>
                <div className="card-header py-3" style={{ 
                  backgroundColor: '#e0ecff', 
                  borderBottom: '1px solid #c9dcff'
                }}>
                  <h6 className="m-0 fw-bold" style={{ color: '#1B74E4' }}>Quick Actions</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-3">
                    <button className="btn btn-primary p-3 d-flex align-items-center" style={{ 
                      backgroundColor: '#1B74E4', 
                      border: 'none',
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}>
                      <i className="fa-solid fa-plus-circle me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-0 fw-semibold">Add Supplier</h6>
                        <small>Register a new supplier</small>
                      </div>
                    </button>
                    
                    <button className="btn btn-outline-primary p-3 d-flex align-items-center" style={{ 
                      borderColor: '#1B74E4',
                      color: '#1B74E4',
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}>
                      <i className="fa-solid fa-box me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-0 fw-semibold">Add Product</h6>
                        <small>Create a new product entry</small>
                      </div>
                    </button>
                    
                    <button className="btn btn-outline-primary p-3 d-flex align-items-center" style={{ 
                      borderColor: '#1B74E4',
                      color: '#1B74E4',
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}>
                      <i className="fa-solid fa-clipboard-list me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-0 fw-semibold">Store Acceptance</h6>
                        <small>Record receipt of materials</small>
                      </div>
                    </button>
                    
                    <button className="btn btn-outline-primary p-3 d-flex align-items-center" style={{ 
                      borderColor: '#1B74E4',
                      color: '#1B74E4',
                      borderRadius: '8px'
                    }}>
                      <i className="fa-solid fa-file-alt me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-0 fw-semibold">Generate Report</h6>
                        <small>Create inventory reports</small>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  
  );
};

export default HomePage;
