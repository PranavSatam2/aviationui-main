import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  deleteStore,
  getStoreDetail,
  AllStoreTagList,
} from "../services/db_manager";
import MyModalComponent from "./partials/MyModalComponent";
import { useNavigate } from "react-router-dom";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { toast } from "react-toastify";

const ViewSupplierRegis = () => {
  // State
  const [tableData, setTableData] = useState([]); // Store data
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const navigate = useNavigate();
  const modalRef = useRef(); // Modal reference

  // Fetching data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
      const response = await AllStoreTagList();
      if (response && !response.every(item => item === null)) {
        setTableData(response);
      } else {
        setTableData([]);
      }
      } catch (error) {
        toast.error("Failed to load store data");
        // Set empty array in case of error too
        setTableData([]);
      } finally {
      setIsLoading(false);
    }
    };
    fetchData();
  }, []);

  // Delete the selected supplier
  async function deleteSelectedElement(elementId) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await deleteStore(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((item) => item.id !== elementId)
          );
          toast.success("Item deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete item", error);
        toast.error("Failed to delete item. Please try again.");
      }
    }
  }

  // Edit the selected supplier
  async function editSelectedElement(elementId) {
    // console.log("123344");
    // navigate("/editstoreAcceptance", {
    //       state: { elementId },
    //     });
     try {
       const response = await getStoreDetail(elementId);
      const supplierData = response.data;
      
        navigate("/editstoreAcceptance", {
          state: { elementId },
        })
      
    } catch (error) {
      console.error("Error fetching store details: ", error);
      toast.error("Failed to fetch store details");
    }
  }

  // Print function to generate Store Acceptance Tag form and directly open print dialog
  const handlePrint = (store) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Store Acceptance Tag - ${store.partNum}</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .header .company {
            font-size: 16px;
            margin: 5px 0;
            font-weight: 600;
          }
          
          .header .address {
            font-size: 12px;
            margin: 5px 0;
            color: #333;
          }
          
          .form-group {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
          }
          
          .form-group label {
            font-weight: bold;
            min-width: 180px;
            font-size: 14px;
          }
          
          .form-group .value {
            flex: 1;
            border-bottom: 1px solid #000;
            padding: 5px 10px;
            min-height: 30px;
          }
          
          .inline-group {
            display: flex;
            gap: 30px;
            margin-bottom: 20px;
          }
          
          .inline-group .form-item {
            flex: 1;
            display: flex;
            align-items: center;
          }
          
          .inline-group .form-item label {
            font-weight: bold;
            margin-right: 10px;
            font-size: 14px;
            white-space: nowrap;
          }
          
          .inline-group .form-item .value {
            flex: 1;
            border-bottom: 1px solid #000;
            padding: 5px 10px;
            min-height: 30px;
          }
          
          .condition-row {
            margin-bottom: 20px;
            display: flex;
            gap: 20px;
            align-items: center;
          }
          
          .condition-row .batch-section {
            flex: 2;
            display: flex;
            align-items: center;
          }
          
          .condition-row .batch-section label {
            font-weight: bold;
            margin-right: 10px;
            font-size: 14px;
            white-space: nowrap;
          }
          
          .condition-row .batch-section .value {
            flex: 1;
            border-bottom: 1px solid #000;
            padding: 5px 10px;
            min-height: 30px;
          }
          
          .condition-group {
            flex: 2;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .condition-group > label {
            font-weight: bold;
            font-size: 14px;
            margin-right: 10px;
          }
          
          .condition-group .checkbox-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .condition-group .checkbox {
            width: 22px;
            height: 22px;
            border: 2px solid #000;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
          }
          
          .condition-group .checkbox.checked::before {
            content: "✓";
          }
          
          .footer-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 30px;
          }
          
          .footer-section .signature {
            flex: 2;
            display: flex;
            flex-direction: column;
          }
          
          .footer-section .signature label {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .footer-section .signature .value {
            border-bottom: 1px solid #000;
            padding: 5px 10px;
            min-height: 30px;
          }
          
          .footer-section .date-section {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .footer-section .date-section label {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .footer-section .date-section .value {
            border-bottom: 1px solid #000;
            padding: 5px 10px;
            min-height: 30px;
          }
          
          .form-footer {
            margin-top: 60px;
            padding-top: 15px;
            border-top: 2px solid #000;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>STORE ACCEPTANCE TAG</h1>
          <div class="company">AMC Technology</div>
          <div class="address">105, Hriday Industrial Estate, Hira Industrial Park, Vasai Phata, Vasai East, Palghar - 401208</div>
        </div>
        
        <div class="form-group">
          <label>Part No. :</label>
          <div class="value">${store.partNum || ''}</div>
        </div>
        
        <div class="form-group">
          <label>Description :</label>
          <div class="value">${store.description || ''}</div>
        </div>
        
        <div class="condition-row">
          <div class="batch-section">
            <label>Batch / Lot # :</label>
            <div class="value">${store.batch || ''}</div>
          </div>
          <div class="condition-group">
            <label>Condition:</label>
            <div class="checkbox-item">
              <div class="checkbox ${store.condition === 'New' ? 'checked' : ''}"></div>
              <span>New</span>
            </div>
            <div class="checkbox-item">
              <div class="checkbox ${store.condition === 'O/H' ? 'checked' : ''}"></div>
              <span>O/H</span>
            </div>
            <div class="checkbox-item">
              <div class="checkbox ${store.condition === 'Repaired' ? 'checked' : ''}"></div>
              <span>Repaired</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Supplier:</label>
          <div class="value">${store.supplier || ''}</div>
        </div>
        
        <div class="inline-group">
          <div class="form-item">
            <label>DOM:</label>
            <div class="value">${store.dom || ''}</div>
          </div>
          <div class="form-item">
            <label>DOE:</label>
            <div class="value">${store.doe || ''}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Quantity :</label>
          <div class="value">${store.quantity || ''}</div>
        </div>
        
        <div class="inline-group">
          <div class="form-item">
            <label>Receiving Insp. Report #:</label>
            <div class="value">${store.inspectionReportId || ''}</div>
          </div>
          <div class="form-item">
            <label>Date of Receipt:</label>
            <div class="value">${store.dateOfRecipet || ''}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Name of Quality Inspector:</label>
          <div class="value">${store.nameOfQualityInsp || ''}</div>
        </div>
        
        <div class="footer-section">
          <div class="signature">
            <label>Signature of Quality Inspector:</label>
            <div class="value">${store.signatureOfQualityInsp || ''}</div>
          </div>
          <div class="date-section">
            <label>Date:</label>
            <div class="value">${new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>
        
        <div class="form-footer">
          <div>Form ${store.formAMC || 'AMC-38'}</div>
          <div>Rev No.:${store.revNo || '00'}</div>
          <div>Date: Jan-2021</div>
        </div>
        
        <script>
          // Automatically open print dialog when page loads
          window.onload = function() {
            window.print();
            // Optional: Close window after printing (uncomment if needed)
            // window.onafterprint = function() {
            //   window.close();
            // };
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Search and Date Range Filter
  const filteredData = tableData.filter((store) => {
    // Search filter
    const matchesSearch = Object.values(store).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Date filter (convert to Date objects for comparison)
    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate &&
        store.dateOfRecipet &&
        new Date(store.dateOfRecipet) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate =
        matchesDate &&
        store.dateOfRecipet &&
        new Date(store.dateOfRecipet) <= new Date(endDate);
    }
    return matchesSearch && matchesDate;
  });

  // Sorting functionality
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (field === "action") return; // Don't sort action column
    
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    
    return pageNumbers;
  };

  // Column definitions for the table
  const columns = [
    {field: "id", label: "ID", width: "80px"},
    { field: "partNum", label: "Part Num", width: "100px" },
    { field: "description", label: "Description", width: "200px" },
    { field: "batch", label: "Batch", width: "120px" },
    { field: "supplier", label: "Supplier", width: "150px" },
    { field: "quantity", label: "Quantity", width: "100px" },
    { field: "dom", label: "DOM", width: "120px" },
    { field: "doe", label: "DOE", width: "120px" },
    { field: "dateOfRecipet", label: "Receipt Date", width: "120px" },
    { field: "nameOfQualityInsp", label: "Quality Inspector", width: "150px" },
    { field: "action", label: "Action", width: "100px" }
  ];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Store Acceptance" />

          <div className="card border-0 shadow-lg mx-4 my-4 rounded-3">
            <div className="card-body">
              {/* Date Range Filter */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label fw-light">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-light">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="row  align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 ms-auto">
                  <div className="d-flex align-items-center justify-content-end">
                    <label className="me-2 text-muted fw-light">Show</label>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <label className="ms-2 text-muted fw-light">entries</label>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                  </div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </div>
              ) : (
                <div 
                  className="table-responsive" 
                  style={{
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#ccc transparent",
                  }}
                >
                  <table className="table table-hover table-striped align-middle">
                    <thead>
                      <tr className="bg-light">
                        {columns.map((column) => (
                          <th 
                            key={column.field} 
                            className="position-sticky top-0 bg-light py-3"
                            onClick={() => handleSort(column.field)}
                            style={{ 
                              cursor: column.field !== "action" ? "pointer" : "default", 
                              width: column.width || "auto",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px"
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <span>{column.label}</span>
                              {column.field !== "action" && (
                                sortField === column.field ? (
                                  <i className={`ms-1 fa fa-sort-${sortDirection === "asc" ? "up" : "down"} text-primary`}></i>
                                ) : (
                                  <i className="ms-1 fa fa-sort text-muted opacity-50" style={{ fontSize: "0.8rem" }}></i>
                                )
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((store, index) => (
                          <tr 
                            key={store.id || store.partNum} 
                            className={index % 2 === 0 ? "bg-white" : "bg-light bg-opacity-50"}
                          >
                            {columns.map((column) => (
                              <td 
                                key={`${store.id}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{ 
                                  maxWidth: column.field === "action" ? "100px" : "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                                title={column.field !== "action" ? store[column.field] : ""}
                              >
                                {column.field === "action" ? (
                                  <button
                                    className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                    onClick={() => handlePrint(store)}
                                    title="Print Store Acceptance Tag"
                                  >
                                    <i className="fa fa-print"></i>
                                  </button>
                                ) : (
                                  store[column.field]
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length} className="text-center py-5">
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x text-muted mb-3"></i>
                                <p className="mb-0">No matching records found</p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x text-muted mb-3"></i>
                                <p className="mb-0">No data available</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="row mt-4 align-items-center">
                <div className="col-md-6">
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Showing <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> to <span className="fw-bold text-dark">{Math.min(indexOfLastItem, sortedData.length)}</span> of <span className="fw-bold text-dark">{sortedData.length}</span> entries
                    {searchTerm && ` (filtered from ${tableData.length} total entries)`}
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(1)}
                          aria-label="First page"
                        >
                          <i className="fa-solid fa-angles-left"></i>
                        </button>
                      </li>
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          aria-label="Previous page"
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>
                      
                      {renderPageNumbers()}
                      
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          aria-label="Next page"
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(totalPages)}
                          aria-label="Last page"
                        >
                          <i className="fa-solid fa-angles-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          <MyModalComponent
            ref={modalRef}
            modalTitle="My Custom Modal Title"
            modalBodyContent="This is a custom body for the modal."
            buttonLabel="Open Modal"
          />
      </div>
      <Footer />
    </div>
  </div>
  );
};

export default ViewSupplierRegis;