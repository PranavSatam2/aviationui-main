import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { listAllMaterials, deleteMaterial, getMaterialDetail } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net';

const ViewMaterialPage = () => {
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const dataTableInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await listAllMaterials();
                console.log("API Response:", response);  // Debug log
                setTableData(response.data || []); 
                //setTableData(response || []);
            } catch (error) {
                console.error("Error fetching materials", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Current table data:", tableData);  // Debug log

        if (tableData.length > 0) {
            if (dataTableInstance.current) {
                console.log("Destroying existing DataTable");
                dataTableInstance.current.destroy();
            }

            setTimeout(() => {
                if (tableRef.current) {
                    console.log("Initializing DataTable");
                    dataTableInstance.current = $(tableRef.current).DataTable({
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true,
                        destroy: true
                    });
                } else {
                    console.error("TableRef is null, DataTable cannot initialize.");
                }
            }, 100);  // Add slight delay to ensure table is in DOM
        }
    }, [tableData]);

    const deleteSelectedElement = async (materialId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteMaterial(materialId);
    
                // Directly remove the deleted record from tableData
                setTableData((prevData) =>
                    prevData.filter((material) => material.materialId !== materialId)
                );
    
                alert("Record deleted successfully!");
            } catch (error) {
                console.error("Failed to delete material", error);
                alert("Failed to delete material. Please try again.");
            }
        }
    };
    
    
    
    // const deleteSelectedElement = async (materialId) => {
    //     if (window.confirm("Are you sure you want to delete this item?")) {
    //         try {
    //             await deleteMaterial(materialId);
    
    //             // Directly filter out the deleted material from tableData
    //             setTableData(prevData => prevData.filter(material => material.materialId !== materialId));
    
    //         } catch (error) {
    //             console.error("Failed to delete material", error);
    //             alert("Failed to delete material. Please try again.");
    //         }
    //     }
    // };
    
    const editSelectedElement = async (materialId) => {
        try {
            const response = await getMaterialDetail(materialId);
            const materialData = response?.data;
            

            if (materialData) {
                navigate('/MaterialPage', { state: { materialId, materialData } });
            }
        } catch (error) {
            console.error("Error fetching material details: ", error);
        }
    };

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
                <h5 className="fw-semibold mb-1">View Material Records</h5>
                <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>View and manage all material receipt records</p>
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
                          placeholder="Search materials..." 
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
                      <i className="fa-solid fa-plus me-1"></i> Add Material
                    </button>
                  </div>
                  
                  {/* Table */}
                  <div className="table-responsive" style={{ 
                    maxHeight: 'calc(100vh - 270px)',
                    width: '100%'
                  }}>
                    <table 
                      ref={tableRef} 
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
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Material ID
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            MRN No
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Part No
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Description
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Supplier
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Order No
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Challan No
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Receipt Date
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Quantity
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Store Incharge
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10
                            }}
                          >
                            Quality Acceptance
                          </th>
                          <th 
                            style={{ 
                              padding: '14px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#495057',
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#f5f7fa',
                              zIndex: 10,
                              textAlign: 'center'
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((material, index) => (
                            <tr 
                              key={material.materialId}
                              style={{ 
                                backgroundColor: index % 2 === 0 ? 'white' : '#fbfbfd',
                                transition: 'background-color 0.2s',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f9ff'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fbfbfd'}
                            >
                              <td style={{ padding: '12px', fontWeight: '500', color: '#1B74E4' }}>
                                {material.materialId}
                              </td>
                              <td style={{ padding: '12px' }}>{material.mrnNo}</td>
                              <td style={{ padding: '12px' }}>{material.partNumber}</td>
                              <td style={{ 
                                padding: '12px',
                                maxWidth: '150px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {material.partDescription}
                              </td>
                              <td style={{ padding: '12px' }}>{material.supplierName}</td>
                              <td style={{ padding: '12px' }}>{material.orderNumber}</td>
                              <td style={{ padding: '12px' }}>{material.challanNo}</td>
                              <td style={{ padding: '12px' }}>{material.receiptDate}</td>
                              <td style={{ padding: '12px' }}>
                                <span className="badge bg-light text-dark" style={{ 
                                  fontWeight: '500',
                                  fontSize: '12px',
                                  padding: '5px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6'
                                }}>
                                  {material.quantity}
                                </span>
                              </td>
                              <td style={{ padding: '12px' }}>{material.storeInchargeSign}</td>
                              <td style={{ padding: '12px' }}>{material.qualityAcceptance}</td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div className="d-flex justify-content-center gap-3">
                                  <button 
                                    className="btn p-1" 
                                    onClick={() => editSelectedElement(material.materialId)}
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
                                    title="Edit Material"
                                  >
                                    <i className="fa-solid fa-pen-to-square" style={{ color: '#1B74E4' }}></i>
                                  </button>
                                  <button 
                                    className="btn p-1" 
                                    onClick={() => deleteSelectedElement(material.materialId)}
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
                                    title="Delete Material"
                                  >
                                    <i className="fa-solid fa-trash" style={{ color: '#dc3545' }}></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" className="text-center py-4">
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
                                  <i className="fa-solid fa-boxes-stacked" style={{ fontSize: '24px', color: '#1B74E4' }}></i>
                                </div>
                                <h6 className="mb-1" style={{ color: '#495057' }}>No Material Records Found</h6>
                                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>No material records are currently available in the system</p>
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
                                  <i className="fa-solid fa-plus me-1"></i> Add First Material
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination footer */}
                  {tableData.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center p-3" style={{ 
                      backgroundColor: '#e0ecff',
                      borderTop: '1px solid #c9dcff'
                    }}>
                      <div>
                        <span className="text-muted" style={{ fontSize: '14px' }}>
                          Showing <span className="fw-medium">{tableData.length}</span> of <span className="fw-medium">{tableData.length}</span> materials
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
            
            <Footer />
          </div>
        </div>
      );
};

export default ViewMaterialPage;
