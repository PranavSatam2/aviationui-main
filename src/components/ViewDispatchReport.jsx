import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDispatchReports,
  deleteDispatchReport,
} from "../services/db_manager";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import styles from "./ViewMaterialNote.module.css";

const ViewDispatchReport = () => {
  const [dispatchReports, setDispatchReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    loadDispatchReports();
  }, []);

  const loadDispatchReports = async () => {
    setLoading(true);
    try {
      const response = await getAllDispatchReports();
      if (Array.isArray(response)) {
        setDispatchReports(response);
        setFilteredReports(response);
      } else {
        console.warn("Unexpected response format:", response);
        setDispatchReports([]);
        setFilteredReports([]);
      }
    } catch (err) {
      console.error("Error fetching dispatch reports:", err);
      setError("Failed to load dispatch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchId) {
      setFilteredReports(dispatchReports);
    } else {
      const results = dispatchReports.filter((report) =>
        String(report.id).includes(searchId)
      );
      setFilteredReports(results);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setFilteredReports(dispatchReports);
    setCurrentPage(1);
    loadDispatchReports();
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

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

  const editSelectedElement = async (reportId) => {
    try {
      const response = await getAllDispatchReports();
      const dispatchReportData = response.find(
        (report) => report.id === reportId
      );
      if (!dispatchReportData) {
        alert("Dispatch report not found");
        return;
      }
      navigate("/editDispatchReport", {
        state: { report: dispatchReportData },
      });
    } catch (error) {
      console.error("Error fetching material details: ", error);
      alert("Failed to fetch material details");
    }
  };

  const deleteSelectedElement = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDispatchReport(id);
        loadDispatchReports();
      } catch (err) {
        console.error("Error deleting report:", err);
        alert("Failed to delete report.");
      }
    }
  };

  const printReport = (report) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dispatch Report - ${report.reportNo}</title>
          <style>
            @media print {
              @page {
                margin: 20mm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .logo {
              font-size: 36px;
              font-weight: bold;
              color: #2c5282;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              flex-grow: 1;
            }
            .form-info {
              text-align: right;
              font-size: 12px;
            }
            .form-row {
              display: flex;
              margin-bottom: 15px;
              border: 1px solid #000;
            }
            .form-field {
              padding: 8px;
              border-right: 1px solid #000;
              flex: 1;
            }
            .form-field:last-child {
              border-right: none;
            }
            .form-label {
              font-weight: bold;
              display: inline-block;
              margin-right: 10px;
            }
            .form-value {
              display: inline-block;
            }
            .checklist {
              margin-top: 30px;
            }
            .checklist-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .signature-section {
              margin-top: 30px;
              border: 1px solid #000;
            }
            .signature-row {
              display: flex;
              border-bottom: 1px solid #000;
            }
            .signature-row:last-child {
              border-bottom: none;
            }
            .signature-label {
              font-weight: bold;
              padding: 15px;
              border-right: 1px solid #000;
              width: 200px;
            }
            .signature-value {
              padding: 15px;
              flex: 1;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">amc</div>
            <div class="title">DISPATCH REPORT</div>
            <div class="form-info">
              Form AMC 02<br>
              Rev. 00<br>
              Date: Jan 2021
            </div>
          </div>

          <div class="form-row">
            <div class="form-field" style="flex: 2;">
              <span class="form-label">Report No.:</span>
              <span class="form-value">${report.reportNo || ""}</span>
            </div>
            <div class="form-field" style="flex: 1;">
              <span class="form-label">Date:</span>
              <span class="form-value">${report.reportDate || ""}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field" style="flex: 1;">
              <span class="form-label">Part No.:</span>
              <span class="form-value">${report.partNo || ""}</span>
            </div>
            <div class="form-field" style="flex: 1;">
              <span class="form-label">Qty.:</span>
              <span class="form-value">${report.quantity || ""}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field" style="flex: 2;">
              <span class="form-label">Part Description:</span>
              <span class="form-value">${report.partDescription || ""}</span>
            </div>
            <div class="form-field" style="flex: 1;">
              <span class="form-label">Batch No.(If Any):</span>
              <span class="form-value">${report.batchNo || ""}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Order No.:</span>
              <span class="form-value">${report.orderNo || ""}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Customer Name:</span>
              <span class="form-value">${report.customerName || ""}</span>
            </div>
          </div>

          <div class="checklist">
            <div class="checklist-title">CHECKLIST</div>
            <table>
              <thead>
                <tr>
                  <th>PERTICULERS</th>
                  <th>NUMBER</th>
                  <th>DATE</th>
                  <th>REMARK (If Any)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Challan No.</td>
                  <td>${report.challanNo || ""}</td>
                  <td>${report.challanDate || ""}</td>
                  <td>${report.challanRemark || ""}</td>
                </tr>
                <tr>
                  <td>Invoice No.</td>
                  <td>${report.invoiceNo || ""}</td>
                  <td>${report.invoiceDate || ""}</td>
                  <td>${report.invoiceRemark || ""}</td>
                </tr>
                <tr>
                  <td>CA Form 1</td>
                  <td>${report.caFormNo || ""}</td>
                  <td>${report.caFormDate || ""}</td>
                  <td>${report.caFormRemark || ""}</td>
                </tr>
                <tr>
                  <td>E-WAY Bill</td>
                  <td>${report.ewayBill || ""}</td>
                  <td>${report.ewayBillDate || ""}</td>
                  <td>${report.ewayBillRemark || ""}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="signature-section">
            <div class="signature-row">
              <div class="signature-label">Stores In-Charge Name</div>
              <div class="signature-value">${
                report.storesInChargeName || ""
              }</div>
            </div>
            <div class="signature-row">
              <div class="signature-label">Stores In-Charge Sign</div>
              <div class="signature-value">${
                report.storesInChargeSign || ""
              }</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const columns = [
    { field: "reportNo", label: "Report No", width: "130px" },
    { field: "reportDate", label: "Date", width: "120px" },
    { field: "partNo", label: "Part No", width: "120px" },
    { field: "partDescription", label: "Part Description", width: "180px" },
    { field: "orderNo", label: "Order No", width: "130px" },
    { field: "customerName", label: "Customer Name", width: "150px" },
    { field: "quantity", label: "Quantity", width: "90px" },
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
              <i className="fa fa-truck"></i>
              <span className={styles.breadcrumbLabel}>
                View Dispatch Reports
              </span>
            </div>
          </div>

          {/* Card Container */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Search Box */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  className={styles.label}
                  style={{ marginBottom: "0.5rem", display: "block" }}
                >
                  Search by Report ID:
                </label>
                <div style={{ display: "flex", gap: "0.5rem", maxWidth: "500px" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type="text"
                      className={styles.searchInput}
                      style={{
                        width: "100%",
                        padding: "0.75rem 2.5rem 0.75rem 1rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                      }}
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Enter Report ID"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.boxShadow = "0 0 0 4px rgba(102, 126, 234, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    {searchId && (
                      <button
                        onClick={handleClearSearch}
                        style={{
                          position: "absolute",
                          right: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#6b7280",
                          fontSize: "1.2rem",
                          padding: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#dc2626";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#6b7280";
                        }}
                        title="Clear search"
                      >
                        <i className="fa fa-times-circle"></i>
                      </button>
                    )}
                  </div>
                  <button
                    className={styles.btnView}
                    onClick={handleSearch}
                    disabled={loading}
                    style={{ minWidth: "120px", whiteSpace: "nowrap" }}
                  >
                    <i className="fa fa-search" style={{ marginRight: "0.5rem" }}></i>
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
                {error && (
                  <p
                    style={{
                      color: "#dc2626",
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Table */}
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Loading dispatch reports...</p>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <th key={column.field} style={{ width: column.width }}>
                            <div className={styles.thContent}>
                              <span>{column.label}</span>
                            </div>
                          </th>
                        ))}
                        <th className={styles.actionsHeader}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((report, index) => (
                          <tr
                            key={report.id}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {columns.map((column) => (
                              <td
                                key={`${report.id}-${column.field}`}
                                title={report[column.field] || "-"}
                              >
                                {report[column.field] || "-"}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnEdit}
                                  onClick={() => editSelectedElement(report.id)}
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className={styles.btnPrint}
                                  onClick={() => printReport(report)}
                                  title="Print"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                                <button
                                  className={styles.btnDelete}
                                  onClick={() => deleteSelectedElement(report.id)}
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
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
                            {searchId ? (
                              <div>
                                <i className="fa fa-search fa-2x"></i>
                                <p>No matching dispatch reports found</p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x"></i>
                                <p>No dispatch reports available</p>
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
                    {Math.min(indexOfLastItem, filteredReports.length)}
                  </strong>{" "}
                  of <strong>{filteredReports.length}</strong> entries
                  {searchId &&
                    ` (filtered from ${dispatchReports.length} total entries)`}
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

export default ViewDispatchReport;