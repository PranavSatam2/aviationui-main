import React, { useEffect, useState } from "react";
import { Search, Save } from "lucide-react";
import styles from "./PurchaseOrder/Purchase.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
   fetchWorkOrder,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";


export default function GenerateCAForm() {
  //const [batchNo, setBatchNo] = useState("");
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
  const [form, setForm] = useState({
      partNumber: "",
      partDesc: "",
      purchaseOrderNo: "",
      supplierName: "",
      reportNo: "",
      date: new Date().toISOString().split('T')[0] || "",
      qty: "",
      qtyReceive: "",
  });

  // Fetch data for table
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWorkOrder();
      console.log("table ", response);
      setTableData(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching WorkOrder Details", error);
      toast.error("Failed to load Workorder Details /");
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);
 

  // Search functionality
  const filteredData = tableData.filter((requisition) => {
    return Object.values(requisition).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
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

  //Handle Po Number click to open order form
  const handleBatchClick = async (workOrderNo) => {
        if (!workOrderNo) return;
       console.log(workOrderNo, "response for WorkOrder");

      navigate("/generateCAForm", { state: {workOrderNo} });
  };

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
    { field: "workOrderNumber", label: "WorkOrder No", width: "200px" },
    { field: "partNo", label: "Part Number", width: "200px" },
    { field: "description", label: "Description", width: "120px" },
    { field: "quantity", label: "Quantity", width: "140px" },
    { field: "serialNo", label: "Serial No", width: "140px" },
    { field: "customerName", label: "Customer Name", width: "140px" },
   // { field: "repairOrderNo", label: "", width: "140px" },
    { field: "status", label: "Status", width: "120px" },
  ]

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb
              breadcrumbsLabel="Generate Inspection Report"
              // isBack={true}
            />
            <div className={styles.container}>

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
                          <option value={50}>50</option>
                          <option value={100}>100</option>
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
                        maxHeight: "45vh",
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
                                   currentItems.map((requisition, index) => (
                                  <tr
                                    key={requisition.workOrderNumber || index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-light bg-opacity-50"}
                                    >
                                      {columns.map((column) => (
                                      <td
                                        key={`${requisition.reportNo}-${column.field}`}
                                        className="text-nowrap py-3"
                                        style={{
                                        maxWidth: "150px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    title={requisition[column.field]}
                                  >
                                   {column.field === "workOrderNumber" ? (
                                <button
                                 className="btn btn-link p-0 text-primary fw-bold"
                                onClick={() => handleBatchClick(requisition.workOrderNumber)}
                                style={{
                                 textDecoration: "underline",
                                cursor: "pointer",
                                }}
                              >
                                {requisition[column.field]}
                            </button>
                                ) : (
                              requisition[column.field]
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
                  </div>
                </div>
              </div>
{/* Proceed Button */}
                {/* <div className="mt-3 d-flex justify-content-end">
                  <button
                    className="btn btn-primary"
                    onClick={handleProceed}
                    disabled={selectedItems.length === 0}
                  >
                    Proceed
                  </button>
                  </div> */}
              {/* Order Form - opens when Po Number is clicked */}
              
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 