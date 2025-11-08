import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getViewReportList, getReportDetails } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import styles from "./Checker/EditSupplier/EditSupplierTable.module.css";
import { Modal, Button, Form } from "react-bootstrap";

const ViewInspectionReports = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selecteReportData, setSelecteReportData] = useState();
  const [showModal1, setShowModal1] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "accept" or "reject"
  const [remark, setRemark] = useState("");

  // Date range states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getViewReportList();
      if (response) {
        console.log(response);
        if (response?.data) {
          setTableData(response.data);
        } else if (Array.isArray(response)) {
          setTableData(response);
        } else {
          console.error("Unexpected response format:", response);
          setTableData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Reset selection when page changes
  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  // Search and Date Range Filter
  const filteredData = Array.isArray(tableData)
    ? tableData
        .filter((report) =>
          Object.values(report).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .filter((report) => {
          // Date filter (assuming report.date is in YYYY-MM-DD format)
          let matchesDate = true;
          if (startDate) {
            matchesDate =
              matchesDate &&
              report.date &&
              new Date(report.date) >= new Date(startDate);
          }
          if (endDate) {
            matchesDate =
              matchesDate &&
              report.date &&
              new Date(report.date) <= new Date(endDate);
          }
          return matchesDate;
        })
    : [];

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let reportId = elementId;
        let reportData = await getReportDetails(elementId);
        reportData = reportData.data;
        console.log("Fetched report data:", reportData);

        setSelectedRow(reportData);
        console.log("Selected Row Data: ", reportData);

        setShowModal1(true);
      } catch (error) {
        console.error("Error fetching report details: ", error);
        toast.error("Failed to fetch report details");
      }
    }
  };

  // Modal handlers
  const handleOpenModal = (type) => {
    if (!selectedItem) {
      toast.warning("Please select a report");
      return;
    }
    setActionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRemark("");
  };

  // Print functionality
const handlePrintClick = (report) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Inspection Report - ${report.reportNo || 'N/A'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 12px;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .header-section {
            display: flex;
            border: 1px solid black;
            margin-bottom: 15px;
          }
          .header-left {
            width: 20%;
            padding: 10px;
            border-right: 1px solid black;
            font-weight: bold;
          }
          .header-center {
            width: 55%;
            text-align: center;
            padding: 10px;
            font-weight: bold;
            font-size: 16px;
            border-right: 1px solid black;
          }
          .header-right {
            width: 25%;
            padding: 10px;
          }
          .info-section {
            border: 1px solid black;
            padding: 10px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .info-left {
            width: 60%;
          }
          .info-right {
            width: 40%;
          }
          .signature-section {
            margin-top: 30px;
            border-top: 1px solid black;
            padding-top: 10px;
          }
          .signature-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .signature-col {
            width: 33%;
          }
          hr {
            border: 1px solid black;
            margin: 10px 0;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Section -->
          <div class="header-section">
            <div class="header-left">amc</div>
            <div class="header-center">Receiving Inspection Report</div>
            <div class="header-right">
              <div>Form: AMC-29</div>
              <div>Rev.: 00</div>
              <div>Date: Jan 2021</div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <div class="info-row">
              <div class="info-left">
                <strong>Part Number:</strong> ${report.partNumber || 'N/A'}
              </div>
              <div class="info-right">
                <strong>Report No:</strong> ${report.reportNo || 'N/A'}
              </div>
            </div>

            <div class="info-row">
              <div class="info-left">
                <strong>Part Description:</strong> ${report.partDesc || 'N/A'}
              </div>
              <div class="info-right">
                <strong>Date:</strong> ${report.date || new Date().toLocaleDateString()}
              </div>
            </div>

            <div class="info-row">
              <div class="info-left">
                <strong>Purchase Order No:</strong> ${report.purchaseOrderNo || 'N/A'}
              </div>
              <div class="info-right">
                <strong>Qty:</strong> ${report.qty || 'N/A'}
              </div>
            </div>

            <div class="info-row">
              <div class="info-left">
                <strong>Supplier:</strong> ${report.supplierName || 'N/A'}
              </div>
              <div class="info-right">
                <strong>Receive Qty:</strong> ${report.qtyReceive || 'N/A'}
              </div>
            </div>

            <!-- Checklist Table -->
            <table>
              <thead>
                <tr>
                  <th style="width: 10%; text-align: left;">Sr.No.</th>
                  <th style="width: 30%; text-align: center;">Check List</th>
                  <th style="width: 30%; text-align: center;">Requirements</th>
                  <th style="width: 30%; text-align: center;">Observation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td style="text-align: center;">Invoice</td>
                  <td style="text-align: center;">Quantity and Unit Price must match with Purchase Order</td>
                  <td style="text-align: center;">${report.invoiceObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td style="text-align: center;">Manufacturer Certificate</td>
                  <td style="text-align: center;">COC must available</td>
                  <td style="text-align: center;">${report.manufacturerCertObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td style="text-align: center;">Supplier Certificate(Distributor/Third Party)</td>
                  <td style="text-align: center;">COC must available, in case "No" direct supply from Mfg.</td>
                  <td style="text-align: center;">${report.supplierCertObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td style="text-align: center;">Certificate Full Traceability</td>
                  <td style="text-align: center;">Must Available</td>
                  <td style="text-align: center;">${report.fullTraceabilityObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td style="text-align: center;">Batch Number</td>
                  <td style="text-align: center;">Must match(Physical Unit lable & all COC)</td>
                  <td style="text-align: center;">${report.batchNumberObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td style="text-align: center;">Date of Manufacturing & Date of Expiry(If Applicable)</td>
                  <td style="text-align: center;">Must match(Physical Unit lable & all COC)</td>
                  <td style="text-align: center;">${report.dateOfManufacturingObservation || 'N/A'}<br/>${report.dateOfExpiryObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td style="text-align: center;">Shelf Life(If Applicable)</td>
                  <td style="text-align: center;">80% and above</td>
                  <td style="text-align: center;">${report.selfLifeObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td style="text-align: center;">Technical Data Sheet(TDS) & MSDS</td>
                  <td style="text-align: center;">Must Available</td>
                  <td style="text-align: center;">${report.tdsObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td style="text-align: center;">Material Condition</td>
                  <td style="text-align: center;">No Damage / No Leakage</td>
                  <td style="text-align: center;">${report.materialConditionObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td style="text-align: center;">Specification(If any)</td>
                  <td style="text-align: center;">Must Match with Purchase Order Specification</td>
                  <td style="text-align: center;">${report.specificationObservation || 'N/A'}</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td style="text-align: center;">Documents(If Import)</td>
                  <td style="text-align: center;">Air Way Bill(AWB) & Bill Of Entry(If Available)</td>
                  <td style="text-align: center;">${report.documentObservation || 'N/A'}</td>
                </tr>
              </tbody>
            </table>

            <!-- Lot Acceptance Section -->
            <div style="margin-bottom: 10px;">
              <strong>LOT Accepted(Yes/No/With Deviation):</strong> ${report.lotAccepted || 'N/A'}
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Remark(If Any):</strong> ${report.remark || 'N/A'}
            </div>
          </div>

          <!-- Signature Section -->
          <hr />
          <div class="signature-section">
            <div class="signature-row">
              <div class="signature-col">${report.makerUserName || 'N/A'}</div>
              <div class="signature-col">${report.makerDate || 'N/A'}</div>
              <div class="signature-col"></div>
            </div>
            <div class="signature-row">
              <div class="signature-col"><strong>Checked By Inspector</strong></div>
              <div class="signature-col"><strong>Date</strong></div>
              <div class="signature-col"><strong>Quality Manager Approval</strong></div>
            </div>
          </div>
        </div>

        <script>
          // Auto print when window loads
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

  const handleCheckboxChange = (report) => {
    if (selectedItem === report.inspectionReportId) {
      setSelectedItem("");
    } else {
      setSelectedItem(report.inspectionReportId);
      setSelecteReportData(report);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItem("");
    } else {
      if (currentItems.length > 0) {
        const firstItemId = currentItems[0].formId;
        setSelectedItem(firstItemId);
      }
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  // Column definitions for the table
  const columns = [
    {
      field: "inspectionReportId",
      label: "Inspection Report Id",
      width: "100px",
    },
    { field: "partNumber", label: "Part Number", width: "100px" },
    { field: "partDesc", label: "Part Description", width: "100px" },
    { field: "purchaseOrderNo", label: "Purchase Order No.", width: "100px" },
    { field: "supplierName", label: "Supplier Name", width: "100px" },
    { field: "reportNo", label: "MRN No.", width: "100px" },
    { field: "date", label: "Date", width: "100px" },
    { field: "qty", label: "Quantity", width: "100px" },
    { field: "qtyReceive", label: "Receive Quantity", width: "100px" },
    {
      field: "invoiceObservation",
      label: "Invoice  Observation",
      width: "100px",
    },
    {
      field: "manufacturerCertObservation",
      label: "Manufacturer Cert Observation",
      width: "100px",
    },
    {
      field: "supplierCertObservation",
      label: "Supplier Cert. Observation",
      width: "100px",
    },
    {
      field: "fullTraceabilityObservation",
      label: " cert. Full Traceability Observation",
      width: "100px",
    },
    {
      field: "batchNumberObservation",
      label: "Batch Number Observation",
      width: "100px",
    },
    {
      field: "dateOfManufacturingObservation",
      label: "Date of Manufacturing & Date of Expiry Observation",
      width: "100px",
    },
    {
      field: "selfLifeObservation",
      label: "Self Life Observation",
      width: "100px",
    },
    {
      field: "tdsObservation",
      label: "Technical Data Sheet(TDS) & MSDS Observation",
      width: "100px",
    },
    {
      field: "materialConditionObservation",
      label: "Material Condition Observation",
      width: "100px",
    },
    {
      field: "specificationObservation",
      label: "Specification Observation",
      width: "100px",
    },
    {
      field: "documentObservation",
      label: "Documents Observation",
      width: "100px",
    },
    { field: "lotAccepted", label: "Lot Accepted", width: "100px" },
    { field: "remark", label: "Remark", width: "100px" },
    { field: "makerUserName", label: "Maker Name", width: "100px" },
    { field: "makerDate", label: "Maker Date", width: "100px" },
  ];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Inspection Report" />

          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
              styles.normalViewStyle,
            ].join(" ")}
          >
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
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search reports..."
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
                  <div className="spinner-border text-primary" role="status"></div>
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
                      <tr className="bg-blue">
                        <th
                          className="position-sticky top-0 bg-light py-3 text-center"
                          style={{ width: "40px" }}
                        >
                          <div className="form-check d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="selectAll"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </div>
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
                                    sortDirection === "asc" ? "up" : "down"
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
                        <th
                          className="position-sticky top-0 bg-light py-3 text-center"
                          style={{
                            width: "100px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((report, index) => (
                          <tr
                            key={report.formId}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            <td className="text-center">
                              <div className="form-check d-flex justify-content-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`check-${report.inspectionReportId}`}
                                  checked={
                                    selectedItem === report.inspectionReportId
                                  }
                                  onChange={() => handleCheckboxChange(report)}
                                />
                              </div>
                            </td>
                            {columns.map((column) => (
                              <td
                                key={`${report.formId}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={report[column.field]}
                              >
                                {report[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(
                                      report.inspectionReportId
                                    )
                                  }
                                  title="View Doc"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handlePrintClick(report)}
                                  title="Print Doc"
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
                            colSpan={columns.length + 2}
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
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
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
                    entries
                    {searchTerm &&
                      ` (filtered from ${tableData.length} total entries)`}
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
        </div>
        <Footer />
      </div>

      {showModal1 && selectedRow && (
        <div className="modalBackdrop1">
          <Modal show={showModal1} onHide={() => setShowModal1(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Inspection Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Inspection Report Id:</strong>{" "}
                {selectedRow.inspectionReportId}
              </p>
              <p>
                <strong>Part Description:</strong> {selectedRow.partDesc}
              </p>
              <p>
                <strong>Purchase Order No.:</strong>{" "}
                {selectedRow.purchaseOrderNo}
              </p>
              <p>
                <strong>Supplier Name:</strong> {selectedRow.supplierName}
              </p>
              <p>
                <strong>Report No:</strong> {selectedRow.reportNo}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedRow.qty}
              </p>
              <p>
                <strong>Receive Quantity:</strong> {selectedRow.qtyReceive}
              </p>
              <p>
                <strong>Date:</strong> {selectedRow.date}
              </p>
              <p>
                <strong>Invoice Observation:</strong>{" "}
                {selectedRow.invoiceObservation}
              </p>
              <p>
                <strong>Manufacturer Cert Observation:</strong>{" "}
                {selectedRow.manufacturerCertObservation}
              </p>
              <p>
                <strong>Supplier Cert. Observation:</strong>{" "}
                {selectedRow.supplierCertObservation}
              </p>
              <p>
                <strong>Cert. Full Traceability Observation:</strong>{" "}
                {selectedRow.fullTraceabilityObservation}
              </p>
              <p>
                <strong>Batch Number Observation:</strong>{" "}
                {selectedRow.batchNumberObservation}
              </p>
              <p>
                <strong>
                  Date of Manufacturing & Date of Expiry Observation:
                </strong>{" "}
                {selectedRow.dateOfManufacturingObservation}
              </p>
              <p>
                <strong>Self Life Observation:</strong>{" "}
                {selectedRow.selfLifeObservation}
              </p>
              <p>
                <strong>Technical Data Sheet(TDS) & MSDS Observation:</strong>{" "}
                {selectedRow.tdsObservation}
              </p>
              <p>
                <strong>Material Condition Observation:</strong>{" "}
                {selectedRow.materialConditionObservation}
              </p>
              <p>
                <strong>Specification Observation:</strong>{" "}
                {selectedRow.specificationObservation}
              </p>
              <p>
                <strong>Documents Observation:</strong>{" "}
                {selectedRow.documentObservation}
              </p>
              <p>
                <strong>Lot Accepted:</strong> {selectedRow.lotAccepted}
              </p>
              <p>
                <strong>Remark:</strong> {selectedRow.remark}
              </p>
              <p>
                <strong>Maker Name</strong> {selectedRow.makerUserName}
              </p>
              <p>
                <strong>Maker Date:</strong> {selectedRow.makerDate}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowModal1(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default ViewInspectionReports;