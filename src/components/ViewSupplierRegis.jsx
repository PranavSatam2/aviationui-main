import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { deleteSupplier, getSupplierDetail, listAllSupplier } from "../services/db_manager";
import MyModalComponent from "./partials/MyModalComponent";
import { useNavigate } from "react-router-dom";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const ViewSupplierRegis = () => {
    // State
    const [tableData, setTableData] = useState([]);  // Store data
    const navigate = useNavigate();
    const modalRef = useRef();                      // Modal reference

    // Fetching data when the component is mounted
    useEffect(() => {
        listAllSupplier().then(response => { 
            if (response) {
                setTableData(response); // Update state with response data
            }
        }).catch(error => {
            console.log("Error fetching data", error);
        });
    }, []);

    // Apply dataTable utility after data is loaded from backend
    useEffect(() => {
        if (tableData.length > 0) {
            $('#dataTable').DataTable(); 
        }
    }, [tableData]);

    // Delete the selected supplier
    async function deleteSelectedElement(elementId) {
        if (elementId !== '') {
            let response = await deleteSupplier(elementId);
            if (response) {
                window.location.reload();
            }
        }
    }

    // Edit the selected supplier
    async function editSelectedElement(elementId) {
        if (elementId !== '') {
            try {
                let supplierId = elementId;
                let supplierData = await getSupplierDetail(elementId);
                supplierData = supplierData.data;
                if (supplierId !== null) {
                    navigate('/SupplierRegistration', { state: { supplierId, supplierData } });
                }
            } catch (error) {
                console.error("Error fetching supplier details: ", error);
            }
        }
    }

    return (
        <div className="wrapper">
          <Sidebar />
          <div className="content" style={{ marginLeft: '280px' }}>
            <Header />
            
            {/* Title Header */}
            <div className="d-flex align-items-center px-4 py-3" style={{ 
              backgroundColor: '#1B74E4', 
              color: 'white',
              borderBottom: '1px solid #0b5ed7'
            }}>
              <div>
                <h5 className="fw-semibold mb-1">View Supplier Registration</h5>
                <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>View and manage all registered suppliers</p>
              </div>
            </div>
            
            <div className="container-fluid py-3 px-4" style={{ backgroundColor: '#f0f6ff' }}>
              {/* Search and Filter Bar */}
              <div className="card border-0 shadow-sm mb-4" style={{
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div className="card-body p-3 d-flex justify-content-between align-items-center" style={{ 
                  backgroundColor: '#e0ecff',
                  border: 'none'
                }}>
                  <div className="d-flex align-items-center">
                    <div className="input-group" style={{ width: '250px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search suppliers..." 
                        style={{ 
                          borderRadius: '6px 0 0 6px',
                          borderColor: '#c9dcff',
                          fontSize: '14px'
                        }}
                      />
                      <button 
                        className="btn btn-outline-primary" 
                        type="button" 
                        style={{ 
                          borderRadius: '0 6px 6px 0',
                          borderColor: '#c9dcff',
                          borderLeft: 'none',
                          backgroundColor: 'white',
                          color: '#1B74E4'
                        }}
                      >
                        <i className="fa-solid fa-search"></i>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ 
                      borderRadius: '6px',
                      backgroundColor: '#1B74E4',
                      border: 'none',
                      fontSize: '14px',
                      padding: '8px 16px'
                    }}
                  >
                    <i className="fa-solid fa-plus me-1"></i> Add Supplier
                  </button>
                </div>
              </div>
              
              {/* Content Body */}
              <div className="card border-0 shadow-sm" style={{ 
                borderRadius: '10px', 
                overflow: 'hidden',
                borderTop: '3px solid #1B74E4'
              }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr style={{ backgroundColor: '#f5f7fa' }}>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}>Id</th>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}>Supplier Name</th>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}>Address</th>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}>Number</th>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}>Email Id</th>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}>Quality Manager</th>
                          <th style={{ 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057',
                            textAlign: 'center'
                          }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData && tableData.length > 0 ? tableData.map((supplier, index) => (
                          <tr 
                            key={supplier.formId}
                            style={{ 
                              backgroundColor: index % 2 === 0 ? 'white' : '#fbfbfd',
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid #f2f4f8'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f9ff'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fbfbfd'}
                          >
                            <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1B74E4' }}>
                              {supplier.formId}
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                              {supplier.supplierName}
                            </td>
                            <td style={{ 
                              padding: '12px 16px',
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {supplier.address}
                            </td>
                            <td style={{ padding: '12px 16px' }}>{supplier.phoneNumber}</td>
                            <td style={{ 
                              padding: '12px 16px',
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {supplier.email}
                            </td>
                            <td style={{ padding: '12px 16px' }}>{supplier.qualityManagerName}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <div className="d-flex justify-content-center" style={{ gap: '10px' }}>
                                <button 
                                  className="btn p-1" 
                                  onClick={() => editSelectedElement(`${supplier.formId}`)}
                                  style={{ 
                                    backgroundColor: 'rgba(27, 116, 228, 0.1)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Edit Supplier"
                                >
                                  <i className="fa-solid fa-pen-to-square" style={{ color: '#1B74E4' }}></i>
                                </button>
                                <button 
                                  className="btn p-1" 
                                  onClick={() => deleteSelectedElement(`${supplier.formId}`)}
                                  style={{ 
                                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Delete Supplier"
                                >
                                  <i className="fa-solid fa-trash" style={{ color: '#dc3545' }}></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              <div className="d-flex flex-column align-items-center">
                                <div 
                                  style={{ 
                                    backgroundColor: '#e0ecff',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '12px'
                                  }}
                                >
                                  <i className="fa-solid fa-building" style={{ fontSize: '24px', color: '#1B74E4' }}></i>
                                </div>
                                <h6 className="mb-1" style={{ color: '#495057' }}>No Suppliers Found</h6>
                                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>No supplier records are available in the system</p>
                                <button 
                                  className="btn btn-primary btn-sm" 
                                  style={{ 
                                    backgroundColor: '#1B74E4',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 16px',
                                    fontSize: '13px'
                                  }}
                                >
                                  <i className="fa-solid fa-plus me-1"></i> Add First Supplier
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination footer */}
                  {tableData && tableData.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center p-3" style={{ 
                      backgroundColor: '#e0ecff',
                      borderTop: '1px solid #c9dcff'
                    }}>
                      <div>
                        <span className="text-muted" style={{ fontSize: '14px' }}>
                          Showing <span className="fw-medium">{tableData.length}</span> of <span className="fw-medium">{tableData.length}</span> suppliers
                        </span>
                      </div>
                      <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm mb-0">
                          <li className="page-item disabled">
                            <a className="page-link" href="#" style={{ borderRadius: '4px 0 0 4px' }}>
                              <i className="fa-solid fa-chevron-left"></i>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a className="page-link" href="#" style={{ backgroundColor: '#1B74E4', borderColor: '#1B74E4' }}>1</a>
                          </li>
                          <li className="page-item"><a className="page-link" href="#">2</a></li>
                          <li className="page-item"><a className="page-link" href="#">3</a></li>
                          <li className="page-item">
                            <a className="page-link" href="#" style={{ borderRadius: '0 4px 4px 0' }}>
                              <i className="fa-solid fa-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <MyModalComponent ref={modalRef} modalTitle="My Custom Modal Title" modalBodyContent="This is a custom body for the modal." buttonLabel="Open Modal" />
            <Footer />
          </div>
        </div>
      );
};

export default ViewSupplierRegis;
