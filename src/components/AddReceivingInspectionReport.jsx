import React, { useEffect, useState } from "react";
import { Search, Save } from "lucide-react";
import styles from "./ViewMaterialNote.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  GetAllDataUsingBatchNo,
  fetchMrnNos,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddReceivingInspectionReport() {
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
      const response = await fetchMrnNos();
      console.log("table ", response);
      setTableData(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching MRN Details", error);
      toast.error("Failed to load MRN Details /");
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
  const handleBatchClick = async (mrnNo) => {
    if (!mrnNo) return;
    console.log(mrnNo, "response for MRN");

    navigate("/generateInspectionReport", { state: { mrnNo } });
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
          className={`${styles.pageItem} ${currentPage === i ? styles.active : ''}`}
        >
          <button className={styles.pageLink} onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  // Column definitions for the table
  const columns = [
    { field: "reportNo", label: "MRN No", width: "200px" },
    { field: "partNumber", label: "Part Number", width: "120px" },
    { field: "partDesc", label: "Description", width: "200px" },
    { field: "supplierName", label: "Supplier", width: "140px" },
    { field: "purchaseOrderNo", label: "PO Number", width: "140px" },
    { field: "qty", label: "Quantity", width: "140px" },
    { field: "qtyReceive", label: "Received Quantity", width: "140px" },
  ];

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-file-medical"></i>
              <span className={styles.breadcrumbLabel}>Generate Inspection Report</span>
            </div>
          </div>

          {/* Card Container */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Search and Entries Control */}
              <div className={styles.controlsRow}>
                <div className={styles.searchBox}>
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search inspection reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className={styles.entriesSelector}>
                  <label className={styles.label}>Show</label>
                  <select
                    className={styles.select}
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
                  <label className={styles.label}>entries</label>
                </div>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Loading data...</p>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column.field}
                            onClick={() => handleSort(column.field)}
                            style={{ width: column.width }}
                          >
                            <div className={styles.thContent}>
                              <span>{column.label}</span>
                              {sortField === column.field ? (
                                <i
                                  className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ${styles.sortIconActive}`}
                                ></i>
                              ) : (
                                <i className={`fa fa-sort ${styles.sortIcon}`}></i>
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
                            key={requisition.reportNo || index}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {columns.map((column) => (
                              <td
                                key={`${requisition.reportNo}-${column.field}`}
                                title={requisition[column.field]}
                              >
                                {column.field === "reportNo" ? (
                                  <button
                                    className={styles.linkButton}
                                    onClick={() => handleBatchClick(requisition.reportNo)}
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
                          <td
                            colSpan={columns.length}
                            className={styles.noData}
                          >
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x"></i>
                                <p>No matching records found</p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x"></i>
                                <p>No data available</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className={styles.paginationRow}>
                <div className={styles.paginationInfo}>
                  Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                  <strong>{Math.min(indexOfLastItem, sortedData.length)}</strong> of{" "}
                  <strong>{sortedData.length}</strong> entries
                  {searchTerm &&
                    ` (filtered from ${tableData.length} total entries)`}
                </div>
                <nav>
                  <ul className={styles.pagination}>
                    <li
                      className={`${styles.pageItem} ${
                        currentPage === 1 ? styles.disabled : ""
                      }`}
                    >
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(1)}
                        aria-label="First page"
                      >
                        <i className="fa-solid fa-angles-left"></i>
                      </button>
                    </li>
                    <li
                      className={`${styles.pageItem} ${
                        currentPage === 1 ? styles.disabled : ""
                      }`}
                    >
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>

                    {renderPageNumbers()}

                    <li
                      className={`${styles.pageItem} ${
                        currentPage === totalPages ? styles.disabled : ""
                      }`}
                    >
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                    <li
                      className={`${styles.pageItem} ${
                        currentPage === totalPages ? styles.disabled : ""
                      }`}
                    >
                      <button
                        className={styles.pageLink}
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
        <Footer />
      </div>
    </div>
  );
}