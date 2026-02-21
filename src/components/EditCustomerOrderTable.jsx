import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  getCustomerOrder,
  deleteReport,
  getEditOrderList,
  ApproveReport,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrintInspectionReport } from "./PrintInspectionReport";
import styles from "./ViewMaterialNote.module.css";

const EditCustomerOrderTable = () => {
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

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remark, setRemark] = useState("");
  const [reportData, setReportData] = useState();

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getEditOrderList();
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
    if (selectedItem === report.srNo) {
      setSelectedItem("");
      console.log("Selected ID: none");
    } else {
      setSelectedItem(report.srNo);
      setSelecteReportData(report);
      console.log("Selected ID:", report.srNo);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItem("");
      console.log("Selected ID: none");
    } else {
      if (currentItems.length > 0) {
        const firstItemId = currentItems[0].srNo;
        setSelectedItem(firstItemId);
        setSelecteReportData(currentItems[0]);
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
        let reportData = await getCustomerOrder(elementId);
        reportData = reportData.data;
        if (reportId !== null) {
          navigate("/editCustomerOrderform", {
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
      toast.success(`Report ${action} successfully`);
      fetchData();
    } catch (error) {
      console.error("Error processing report: ", error);
      toast.error("Failed to process report");
    }

    setSelectedItem("");
    setSelectAll(false);
    setRemark("");
    handleCloseModal();
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

  // Search functionality
  const filteredData = Array.isArray(tableData)
    ? tableData.filter((report) =>
        Object.values(report).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

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

  // Column definitions
  const columns = [
    { field: "orderNo", label: "Order No", width: "100px" },
    { field: "roNo", label: "RO No.", width: "100px" },
    { field: "roReceiveDate", label: "RO Received Date", width: "120px" },
    { field: "customerName", label: "Customer Name", width: "150px" },
    { field: "partNo", label: "Part No.", width: "100px" },
    { field: "partDescription", label: "Part Desc", width: "150px" },
    { field: "quantity", label: "Quantity", width: "80px" },
    { field: "batchNo", label: "Batch No.", width: "100px" },
    { field: "srNo", label: "Sr. No.", width: "80px" },
    { field: "status", label: "Status", width: "100px" },
    { field: "makerUserName", label: "Maker Name", width: "120px" },
    { field: "makerDate", label: "Maker Date", width: "120px" },
    { field: "userRole", label: "Maker Role", width: "100px" },
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
              <i className="fa fa-edit"></i>
              <span className={styles.breadcrumbLabel}>
                Edit Customer Orders
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
                    placeholder="Search orders..."
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
                        {/* <th className={styles.checkboxHeader}>
                          <div className={styles.checkboxWrapper}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={selectAll}
                              onChange={handleSelectAll}
                              disabled
                            />
                          </div>
                        </th> */}
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
                        <th className={styles.actionsHeader}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((report, index) => (
                          <tr
                            key={report.formId}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {/* <td className={styles.checkboxCell}>
                              <div className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                  checked={selectedItem === report.srNo}
                                  onChange={() => handleCheckboxChange(report)}
                                />
                              </div>
                            </td> */}
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
                                    editSelectedElement(report.srNo)
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

              {/* Action Buttons */}
              {/* <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginTop: '2rem', 
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button
                  className={styles.btnSuccess}
                  onClick={() => handleOpenModal("accept")}
                  disabled={!selectedItem}
                >
                  <i className="fa-solid fa-check"></i>
                  Approve
                </button>
                <button
                  className={styles.btnDanger}
                  onClick={() => handleOpenModal("reject")}
                  disabled={!selectedItem}
                >
                  <i className="fa-solid fa-xmark"></i>
                  Reject
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>
                {actionType === "accept" ? "Approve Order" : "Reject Order"}
              </h5>
              <button className={styles.modalClose} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                Are you sure you want to {actionType === "accept" ? "approve" : "reject"} the
                selected order?
              </p>
              <div className={styles.formGroup}>
                <label className={styles.label}>Remark</label>
                <textarea
                  className={styles.textarea}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remarks here..."
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnDanger}
                onClick={handleCloseModal}
                style={{
                  background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                }}
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
                Confirm {actionType === "accept" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCustomerOrderTable;