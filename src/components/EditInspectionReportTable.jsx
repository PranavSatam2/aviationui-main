import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  getEditReportList,
  deleteReport,
  getReportDetails,
  ApproveReport,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrintInspectionReport } from "./PrintInspectionReport";
import styles from "./ViewMaterialNote.module.css";

const EditInspectionReportTable = () => {
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
  const [reportData, setReportData] = useState();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remark, setRemark] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getEditReportList();
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (report) => {
    if (selectedItem === report.inspectionReportId) {
      setSelectedItem("");
      console.log("Selected ID: none");
    } else {
      setSelectedItem(report.inspectionReportId);
      setSelecteReportData(report);
      console.log("Selected ID:", report.inspectionReportId);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItem("");
      console.log("Selected ID: none");
    } else {
      if (currentItems.length > 0) {
        const firstItemId = currentItems[0].formId;
        setSelectedItem(firstItemId);
        console.log("Selected ID:", firstItemId);
      }
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  const deleteSelectedElement = async (elementId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        const response = await deleteReport(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((report) => report.formId !== elementId)
          );
          toast.success("Report deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete report", error);
        toast.error("Failed to delete report Please try again.");
      }
    }
  };

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let reportId = elementId;
        let reportData = await getReportDetails(elementId);
        reportData = reportData.data;
        if (reportId !== null) {
          navigate("/editInspectionReportform", {
            state: { reportId, reportData },
          });
        }
      } catch (error) {
        console.error("Error fetching report details: ", error);
        toast.error("Failed to fetch report details");
      }
    }
  };

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

  const handleSubmitAction = async () => {
    const action = actionType === "accept" ? "accepted" : "rejected";
    const updatedReportData = {
      ...selecteReportData,
      remark: remark,
      userRole: sessionStorage.getItem("roleId"),
      userAction: action === "rejected" ? "3" : "2",
    };
    try {
      const response = await ApproveReport(updatedReportData);
      toast.success(`Report ${action} successfully, ${response}`);
      fetchData();
    } catch (error) {
      console.error("Error fetching report details: ", error);
      toast.error("Failed to fetch report details");
    }

    setSelectedItem("");
    setSelectAll(false);
    setRemark("");
    handleCloseModal();
  };

  const filteredData = Array.isArray(tableData)
    ? tableData.filter((report) =>
        Object.values(report).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

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

  const handlePrintClick = (report) => {
    setReportData(report);

    setTimeout(() => {
      const originalBodyStyle = document.body.style.cssText;
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      window.print();

      setTimeout(() => {
        document.body.style.cssText = originalBodyStyle;
      }, 100);
    }, 500);
  };

  const columns = [
    { field: "inspectionReportId", label: "Inspection Report Id", width: "100px" },
    { field: "partNumber", label: "Part Number", width: "100px" },
    { field: "partDesc", label: "Part Description", width: "100px" },
    { field: "purchaseOrderNo", label: "Purchase Order No.", width: "100px" },
    { field: "supplierName", label: "Supplier Name", width: "100px" },
    { field: "reportNo", label: "MRN No.", width: "100px" },
    { field: "date", label: "Date", width: "100px" },
    { field: "qty", label: "Quantity", width: "100px" },
    { field: "invoiceObservation", label: "Invoice Observation", width: "100px" },
    { field: "manufacturerCertObservation", label: "Manufacturer Cert Observation", width: "100px" },
    { field: "supplierCertObservation", label: "Supplier Cert. Observation", width: "100px" },
    { field: "fullTraceabilityObservation", label: "Full Traceability Observation", width: "100px" },
    { field: "batchNumberObservation", label: "Batch Number Observation", width: "100px" },
    { field: "dateOfManufacturingObservation", label: "Date of Manufacturing Observation", width: "100px" },
    { field: "dateOfExpiryObservation", label: "Date of Expiry Observation", width: "100px" },
    { field: "selfLifeObservation", label: "Self Life Observation", width: "100px" },
    { field: "tdsObservation", label: "Technical Data Sheet(TDS) & MSDS Observation", width: "100px" },
    { field: "materialConditionObservation", label: "Material Condition Observation", width: "100px" },
    { field: "specificationObservation", label: "Specification Observation", width: "100px" },
    { field: "documentObservation", label: "Documents Observation", width: "100px" },
    { field: "lotAccepted", label: "Lot Accepted", width: "100px" },
    { field: "remark", label: "Remark", width: "100px" },
  ];

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Print View (Hidden) */}
          <div className="printView">
            <PrintInspectionReport dataMap={reportData} />
          </div>

          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-clipboard-check"></i>
              <span className={styles.breadcrumbLabel}>
                Edit Inspection Reports
              </span>
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
                    placeholder="Search reports..."
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
                        <th className={styles.checkboxHeader}>
                          <div className={styles.checkboxWrapper}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              id="selectAll"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
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
                        <th className={styles.actionsHeader}>
                          <div className={styles.thContent}>
                            <span>ACTIONS</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((report, index) => (
                          <tr
                            key={report.formId}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            <td className={styles.checkboxCell}>
                              <div className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
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
                                title={report[column.field]}
                              >
                                {report[column.field]}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnEdit}
                                  onClick={() =>
                                    editSelectedElement(
                                      report.inspectionReportId
                                    )
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length + 2}
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

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {actionType === "accept"
                  ? "Accept Report"
                  : actionType === "Edit"
                  ? "Send To Edit"
                  : "Reject Report"}
              </h3>
              <button
                className={styles.modalClose}
                onClick={handleCloseModal}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                Are you sure you want to {actionType} the selected report?
              </p>
              <div className={styles.formGroup}>
                <label className={styles.label}>Remark</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remarks here..."
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnCancel}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className={
                  actionType === "accept" ? styles.btnSuccess : styles.btnDanger
                }
                onClick={handleSubmitAction}
                disabled={!remark.trim()}
              >
                Confirm{" "}
                {actionType === "accept"
                  ? "Accept"
                  : actionType === "Edit"
                  ? "Send"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditInspectionReportTable;