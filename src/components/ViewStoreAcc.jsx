import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { deleteStore, getStoreDetail, listAllStore } from "../services/db_manager";
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
        listAllStore().then(response => { 
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
            let response = await deleteStore(elementId);
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
                let supplierData = await getStoreDetail(elementId);
                supplierData = supplierData.data;
                if (supplierId !== null) {
                    navigate('/storeAcceptance', { state: { storeId, storeData } });
                }
            } catch (error) {
                console.error("Error fetching store details: ", error);
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
                    <h5 className="fw-semibold mb-1">View Store Acceptance</h5>
                    <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>View and manage all accepted store items</p>
                  </div>
                </div>
                
                <div className="container-fluid py-3 px-4" style={{ backgroundColor: '#f0f6ff' }}>
                  <div className="card border-0 shadow-sm" style={{ 
                    borderRadius: '10px', 
                    overflow: 'hidden',
                    borderTop: '3px solid #1B74E4'
                  }}>
                    <div className="card-body p-0">
                      {/* Search and Filter Bar */}
                      <div className="d-flex justify-content-between align-items-center p-3" style={{ 
                        backgroundColor: '#e0ecff',
                        borderBottom: '1px solid #c9dcff'
                      }}>
                        <div className="d-flex align-items-center">
                          <div className="input-group" style={{ width: '250px' }}>
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Search items..." 
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
                          <select 
                            className="form-select ms-3" 
                            style={{ 
                              width: '180px', 
                              borderColor: '#c9dcff',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="">All Suppliers</option>
                            <option value="Supplier1">Supplier 1</option>
                            <option value="Supplier2">Supplier 2</option>
                            <option value="Supplier3">Supplier 3</option>
                          </select>
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
                          <i className="fa-solid fa-plus me-1"></i> Add New Item
                        </button>
                      </div>
                      
                      {/* Table with responsive scrolling */}
                      <div className="table-responsive overflow-auto px-0">
                        <table 
                          id="dataTable" 
                          className="table mb-0" 
                          style={{ 
                            width: "100%",
                            borderCollapse: "separate",
                            borderSpacing: "0"
                          }}
                        >
                          <thead>
                            <tr style={{ backgroundColor: '#f5f7fa' }}>
                              <th 
                                style={{ 
                                  width: "80px", 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Part Num
                              </th>
                              <th 
                                style={{ 
                                  width: "200px", 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Description
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Batch
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Supplier
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Quantity
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                DOM
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                DOE
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Receipt Date
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}
                              >
                                Quality Inspector
                              </th>
                              <th 
                                style={{ 
                                  borderBottom: '2px solid #e9ecef',
                                  padding: '14px 12px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#495057',
                                  textAlign: 'center'
                                }}
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData && tableData.length > 0 ? tableData.map((store, index) => (
                              <tr 
                                key={store.partNum}
                                style={{ 
                                  backgroundColor: index % 2 === 0 ? 'white' : '#fbfbfd',
                                  transition: 'background-color 0.2s',
                                  borderBottom: '1px solid #f2f4f8'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f9ff'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fbfbfd'}
                              >
                                <td style={{ padding: '12px', fontWeight: '500', color: '#1B74E4' }}>
                                  {store.partNum}
                                </td>
                                <td style={{ padding: '12px' }}>
                                  <div style={{ 
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {store.description}
                                  </div>
                                </td>
                                <td style={{ padding: '12px' }}>{store.batch}</td>
                                <td style={{ padding: '12px' }}>{store.supplier}</td>
                                <td style={{ padding: '12px' }}>
                                  <span className="badge bg-light text-dark" style={{ 
                                    fontWeight: '500',
                                    fontSize: '12px',
                                    padding: '5px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #dee2e6'
                                  }}>
                                    {store.quantity}
                                  </span>
                                </td>
                                <td style={{ padding: '12px' }}>{store.dom}</td>
                                <td style={{ padding: '12px' }}>{store.doe}</td>
                                <td style={{ padding: '12px' }}>{store.dateOfRecipet}</td>
                                <td style={{ padding: '12px' }}>{store.nameOfQualityInsp}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                  <div className="d-flex justify-content-center gap-3">
                                    <button 
                                      className="btn p-1" 
                                      onClick={() => editSelectedElement(`${store.partNum}`)}
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
                                      title="Edit Item"
                                    >
                                      <i className="fa-solid fa-pen-to-square" style={{ color: '#1B74E4' }}></i>
                                    </button>
                                    <button 
                                      className="btn p-1" 
                                      onClick={() => deleteSelectedElement(`${store.partNum}`)}
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
                                      title="Delete Item"
                                    >
                                      <i className="fa-solid fa-trash" style={{ color: '#dc3545' }}></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan="10" className="text-center py-4">
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
                                      <i className="fa-solid fa-clipboard-list" style={{ fontSize: '24px', color: '#1B74E4' }}></i>
                                    </div>
                                    <h6 className="mb-1" style={{ color: '#495057' }}>No Data Available</h6>
                                    <p className="text-muted mb-3" style={{ fontSize: '14px' }}>No store acceptance records found in the system</p>
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
                                      <i className="fa-solid fa-plus me-1"></i> Add First Item
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
                              Showing <span className="fw-medium">{tableData.length}</span> of <span className="fw-medium">{tableData.length}</span> items
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
