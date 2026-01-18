import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  getCAFormList,
  getCAForm,
  deleteCAForm,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrintCAForm } from "./PrintCAForm";
import styles from "./ViewMaterialNote.module.css";

const EditCAFormTable = () => {
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
      const response = await getCAFormList();
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

  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

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

  const deleteSelectedElement = async (elementId) => {
    if (window.confirm("Are you sure you want to delete this CA Form?")) {
      try {
        const response = await deleteCAForm(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((report) => report.formId !== elementId)
          );
          toast.success("CA Form deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete CA Form", error);
        toast.error("Failed to delete CA Form Please try again.");
      }
    }
  };

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let reportId = elementId;
        let reportData = await getCAForm(elementId);
        reportData = reportData.data;
        if (reportId !== null) {
          navigate("/editCAForm", {
            state: { reportId, reportData },
          });
        }
      } catch (error) {
        console.error("Error fetching CA Form details: ", error);
        toast.error("Failed to fetch CA Form details");
      }
    }
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

  const handleCheckboxChange = (report) => {
    if (selectedItem === report.id) {
      setSelectedItem("");
    } else {
      setSelectedItem(report.id);
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

  const handlePrintClick = (report) => {
    console.log("Report", report);
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

  // Column definitions for the table
  const columns = [
    { field: "formTrackingNumber", label: "Form Tracking No.", width: "180px" },
    { field: "workOrderNumber", label: "Work Order No.", width: "150px" },
    { field: "customerName", label: "Customer Name", width: "150px" },
    { field: "partNo", label: "Part Number", width: "120px" },
    { field: "description", label: "Description", width: "180px" },
    { field: "quantity", label: "Quantity", width: "90px" },
    { field: "serialNo", label: "Serial No.", width: "130px" },
    { field: "status", label: "Status", width: "100px" },
    { field: "remarks", label: "Remarks", width: "150px" },
  ];

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Print View (Hidden) */}
          <div className="printView">
            <PrintCAForm dataMap={reportData} />
          </div>

          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-pen-to-square"></i>
              <span className={styles.breadcrumbLabel}>Edit CA Form</span>
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
                    placeholder="Search CA forms..."
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
                  <p className={styles.loadingText}>Loading CA forms...</p>
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
                                    editSelectedElement(report.formTrackingNumber)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className={styles.btnDelete}
                                  onClick={() =>
                                    deleteSelectedElement(report.formTrackingNumber)
                                  }
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
                          <td colSpan={columns.length + 1} className={styles.noData}>
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x"></i>
                                <p>No matching records found</p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x"></i>
                                <p>No CA forms available</p>
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

export default EditCAFormTable;