import React, { useEffect, useState } from "react";
import { Search, Save } from "lucide-react";
import styles from "./Purchase.module.css";
import {
  createPurchaseOrder,
  GetAllDataUsingBatchNo,
  listAllPurchaseRequisition,
} from "../../services/db_manager";
import Sidebar from "../Sidebar";
import Header from "../Header";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // <-- For navigation


export default function PurchaseOrderForm() {
  const [batchNo, setBatchNo] = useState("");
  const [orderForm, setOrderForm] = useState(false);

  // State for table data
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  // Fetch data for table
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await listAllPurchaseRequisition();
      console.log("table ", response);
      setTableData(response || []);
      console.log(tableData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching purchase requisitions", error);
      toast.error("Failed to load purchase requisitions");
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelectItem = (itemId) => {
  if (selectedItems.includes(itemId)) {
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
  } else {
    setSelectedItems([...selectedItems, itemId]);
  }
};

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.gross || 0), 0);
  };

  // Search functionality
  const filteredData = tableData.filter((requisition) => {
    return Object.values(requisition).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  const sortedData = [...filteredData].sort((a, b) => {
    console.log(filteredData);
  const aValue = a[sortField];
  const bValue = b[sortField];

  if (aValue === undefined || bValue === undefined) return 0;

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

  // Calculate total items for display
  const totalItems = filteredData.length;


  const handleSort = (field) => {
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
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  // Column definitions for the table
  const columns = [
    { field: "batchNumber", label: "PR Number", width: "230px" },
    { field: "id", label: "P_REQ_No", width: "100px" },
    { field: "partNumber", label: "Part Number", width: "150px" },
    { field: "description", label: "Description", width: "150px" },
    { field: "currentStock", label: "Current Stock", width: "100px" },
    { field: "requiredQty", label: "Required Qty", width: "100px" },
    { field: "requiredDate", label: "Required Date", width: "150px" },
    { field: "remark", label: "Remark", width: "100px" },
    // {
    //   field: "unitOfMeasurement",
    //   label: "Unit of Measurement",
    //   width: "150px",
    // },
    { field: "status", label: "Status", width: "100px" },
  ];

   const handleProceed = () => {
   if (selectedItems.length === 0) {
    toast.warning("Please select at least one row before proceeding");
    return;
  }
  const selectedItemsData = tableData.filter(item =>
    selectedItems.includes(item.id)
  );
  navigate("/purchaseOrderForm", { state: { selectedItems: selectedItemsData } });
};

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb
              breadcrumbsLabel="Purchase Order"
              // isBack={true}
            />


              
              <div
                className={[
                  "normalView",
                  "card border-0 shadow-lg  rounded-3",
                ].join(" ")}
              >
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="input-group">
                        <span className="input-group-text bg-primary text-white border-0">
                          <i className="fa fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          placeholder="Search requisitions..."
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
                        </select>
                        <label className="ms-2 text-muted fw-light">
                          entries
                        </label>
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <p className="mt-2 text-muted">Loading data...</p>
                    </div>
                  ) : (
                    <div
                      className="table-responsive"
                      style={{
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#ccc transparent",
                        maxHeight: "80vh",
                      }}
                    >
                      <table className="table table-hover table-striped align-middle">
                        <thead>
                          <tr className="bg-light">
                            <th style={{  width: "40px", textAlign: "center" }}>
                              <input type="checkbox" disabled /> {/* optional master checkbox */}
                              </th>
                            {columns.map((column) => (
                              <th
                                key={column.field}
                                className="position-sticky top-0 bg-light py-3"
                                onClick={() => handleSort(column.field)}
                                style={{
                                  cursor: "pointer",
                                  width: column.width || "auto",
                                  fontSize: "0.9rem",
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <span>{column.label}</span>
                                  {sortField === column.field ? (
                                    <i
                                      className={`ms-1 fa fa-sort-${
                                        sortDirection === "desc" ? "up" : "down"
                                      } text-primary`}
                                    ></i>
                                  ) : (
                                    <i
                                      className="ms-1 fa fa-sort text-muted opacity-50"
                                      style={{ fontSize: "0.8rem" }}
                                    ></i>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length > 0 ? (
                            currentItems.map((item, idx) => (
                          <tr key={idx}>
                          
                            <td style={{ width: "40px", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                            />
                          </td>
                          {columns.map((col) => (
                            <td key={col.field}>{item[col.field]}</td>
                          ))}
                          </tr>
                              
                            
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={columns.length + 1}
                                className="text-center py-5"
                              >
                                {searchTerm ? (
                                  <div>
                                    <i className="fa fa-search fa-2x text-muted mb-3"></i>
                                    <p className="mb-0">
                                      No matching records found
                                    </p>
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
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Showing{" "}
                        <span className="fw-bold text-dark">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="fw-bold text-dark">
                          {Math.min(indexOfLastItem, sortedData.length)}
                        </span>{" "}
                        of{" "}
                        <span className="fw-bold text-dark">
                          {sortedData.length}
                        </span>{" "}
                        batch groups
                        {searchTerm &&
                          ` (filtered from ${
                            Object.keys(tableData).length
                          } total batch groups)`}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-end mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(1)}
                              aria-label="First page"
                            >
                              <i className="fa-solid fa-angles-left"></i>
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              aria-label="Previous page"
                            >
                              <i className="fa-solid fa-angle-left"></i>
                            </button>
                          </li>

                          {renderPageNumbers()}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              aria-label="Next page"
                            >
                              <i className="fa-solid fa-angle-right"></i>
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
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
                  
                
             
{/* Proceed Button */}
                <div className="mt-3 d-flex justify-content-end">
                  <button
                    className="btn btn-primary"
                    onClick={handleProceed}
                    disabled={selectedItems.length === 0}
                  >
                    Proceed
                  </button>
                  </div>
                  </div>
                  </div>
              {/* Order Form - opens when Po Number is clicked */}
              
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
