import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  listAllMaterialRequisition,
  deleteMaterialRequisition,
  getMaterialRequisitionDetail,
} from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./ViewRequisition.module.css";

const ViewMaterialRequisitionPage = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("materialRequisitionNo");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await listAllMaterialRequisition();
      setTableData(response || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching material requisitions", error);
      toast.error("Failed to load material requisitions");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Delete the selected material requisition
  const deleteSelectedElement = async (materialRequisitionID) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMaterialRequisition(materialRequisitionID);
        setTableData((prevData) =>
          prevData.filter(
            (requisition) =>
              requisition.materialRequisitionID !== materialRequisitionID
          )
        );
        toast.success("Material requisition deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete material requisition", error);
        toast.error("Failed to delete material requisition. Please try again.");
      }
    }
  };

  // Edit the selected material requisition
  const editSelectedElement = async (RequisitionID) => {
    try {
      const response = await getMaterialRequisitionDetail(RequisitionID);
      const requisitionData = response?.data;
      if (requisitionData) {
        navigate("/editmaterialrequisition", {
          state: { RequisitionID },
        });
      }
    } catch (error) {
      console.error("Error fetching material requisition details: ", error);
      toast.error("Failed to fetch material requisition details");
    }
  };

  // Search and Date Range Filter
  const filteredData = tableData.filter((requisition) => {
    // Search filter
    const matchesSearch = Object.values(requisition).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Date filter
    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate &&
        requisition.date &&
        new Date(requisition.date) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate =
        matchesDate &&
        requisition.date &&
        new Date(requisition.date) <= new Date(endDate);
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
          className={`${styles.pageItem} ${
            currentPage === i ? styles.active : ""
          }`}
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
    { field: "materialRequisitionNo", label: "Requisition No", width: "140px" },
    { field: "workOrderNo", label: "Workorder No", width: "130px" },
    { field: "date", label: "Issue Date", width: "120px" },
    { field: "partNumber", label: "Part No", width: "120px" },
    { field: "description", label: "Description", width: "200px" },
    { field: "requestedQty", label: "Requested Qty", width: "130px" },
    { field: "issuedQty", label: "Issued Qty", width: "120px" },
    { field: "supplierName", label: "Supplier Name", width: "150px" },
    { field: "curDate", label: "Created Date", width: "140px" },
  ];

  const handlePrintClick = (data) => {
    if (!data) return;

    const printContent = `
      <html>
        <head>
          <title>Material Requisition Print</title>
          <style>
            @media print {
              @page {
                margin: 20mm;
                size: A4;
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              padding: 20px;
            }
            .header-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #000;
            }
            .form-info {
              text-align: right;
              font-size: 11px;
            }
            .title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .info-table td {
              border: 1px solid #000;
              padding: 8px;
              font-size: 12px;
            }
            .info-label {
              font-weight: bold;
              width: 180px;
              background-color: #f5f5f5;
            }
            .main-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .main-table th,
            .main-table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
              font-size: 11px;
            }
            .main-table th {
              background-color: #f5f5f5;
              font-weight: bold;
              text-transform: uppercase;
            }
            .main-table td {
              height: 35px;
            }
            .sr-no-col { width: 50px; }
            .part-no-col { width: 120px; }
            .desc-col { width: 200px; }
            .qty-col { width: 80px; }
            .batch-col { width: 100px; }
            .sign-col { width: 120px; }
            .signature-section {
              margin-top: 60px;
              border-top: 1px solid #000;
              padding-top: 10px;
              width: 300px;
            }
            .signature-section div {
              font-weight: bold;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <!-- Header Section -->
          <div class="header-section">
            <div class="logo">amc</div>
            <div class="form-info">
              <div>Form: AMF-1/</div>
              <div>Rev.: 01</div>
              <div>Date: Feb 2024</div>
            </div>
          </div>

          <!-- Title -->
          <div class="title">MATERIAL REQUISITION</div>

          <!-- Info Table -->
          <table class="info-table">
            <tr>
              <td class="info-label">Material Requisition No.:</td>
              <td style="width: 35%;">${data.materialRequisitionNo || ""}</td>
              <td class="info-label">Date: ${data.date || ""}</td>
            </tr>
            <tr>
              <td class="info-label">Workorder No.:</td>
              <td colspan="3">${data.workOrderNo || ""}</td>
            </tr>
          </table>

          <!-- Main Table -->
          <table class="main-table">
            <thead>
              <tr>
                <th class="sr-no-col">Sr.<br/>No.</th>
                <th class="part-no-col">Part No.</th>
                <th class="desc-col">Description</th>
                <th class="qty-col">Requested<br/>Qty</th>
                <th class="qty-col">Issued<br/>Qty</th>
                <th class="batch-col">Batch /<br/>LOT#</th>
                <th class="sign-col">Receiver Sign</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${data.partNumber || ""}</td>
                <td style="text-align: left;">${data.description || ""}</td>
                <td>${data.requestedQty || ""}</td>
                <td>${data.issuedQty || ""}</td>
                <td>${data.batchLotNo || ""}</td>
                <td></td>
              </tr>
              ${Array.from({ length: 15 }, (_, i) => `
                <tr>
                  <td>${i + 2}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Signature Section -->
          <div class="signature-section">
            <div>Workshop Manager Sign</div>
            <div style="margin-top: 5px;">_________________________________</div>
          </div>

        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=600");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-file-text"></i>
              <span className={styles.breadcrumbLabel}>
                View Material Requisitions
              </span>
            </div>
          </div>

          {/* Card Container */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Date Range Filter */}
              <div className={styles.filtersRow}>
                <div className={styles.dateFilters}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Start Date</label>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>End Date</label>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Search and Entries Control */}
              <div className={styles.controlsRow}>
                <div className={styles.searchBox}>
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search requisitions..."
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
                                  className={`fa fa-sort-${
                                    sortDirection === "asc" ? "up" : "down"
                                  } ${styles.sortIconActive}`}
                                ></i>
                              ) : (
                                <i
                                  className={`fa fa-sort ${styles.sortIcon}`}
                                ></i>
                              )}
                            </div>
                          </th>
                        ))}
                        <th className={styles.actionsHeader}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((requisition, index) => (
                          <tr
                            key={requisition.materialRequisitionNo}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {columns.map((column) => (
                              <td
                                key={`${requisition.materialRequisitionNo}-${column.field}`}
                                title={requisition[column.field]}
                              >
                                {requisition[column.field]}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnEdit}
                                  onClick={() =>
                                    editSelectedElement(requisition.id)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className={styles.btnDelete}
                                  onClick={() =>
                                    deleteSelectedElement(requisition.id)
                                  }
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  className={styles.btnPrint}
                                  onClick={() => handlePrintClick(requisition)}
                                  title="Print"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length + 1}
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
                  <strong>
                    {Math.min(indexOfLastItem, sortedData.length)}
                  </strong>{" "}
                  of <strong>{sortedData.length}</strong> entries
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
};

export default ViewMaterialRequisitionPage;