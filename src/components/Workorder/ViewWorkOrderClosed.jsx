import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  deletePurchaseOrder,
  listOfAllWorkorderTable,
  listOfClosedWorkorders,
  fetchStatusClosed,
} from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../ViewMaterialNote.module.css";

const ViewWorkOrderClosed = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("workOrderNo");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [workOrderData, setWorkOrderData] = useState();
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await listOfClosedWorkorders();
      setTableData(response.data || []);
    } catch (error) {
      console.error("Error fetching View All Work Orders", error);
      toast.error("Failed to load View All Work Orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteSelectedElement = async (workOrderNo) => {
    if (window.confirm("Are you sure you want to delete this work order?")) {
      try {
        await deletePurchaseOrder(workOrderNo);
        setTableData((prevData) =>
          prevData.filter((workOrder) => workOrder.workOrderNo !== workOrderNo)
        );
        toast.success("Work order deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete work order", error);
        toast.error("Failed to delete work order. Please try again.");
      }
    }
  };

  const editSelectedElement = async (workOrderNo) => {
    navigate("/EditWorkorder", {
      state: { workOrderNo },
    });
  };

  // Search functionality
  const filteredData = tableData.filter((workOrder) => {
    return Object.entries(workOrder)
      .filter(
        ([key]) =>
          ![
            "issueDate",
            "qualityManagerSignDate",
            "workshopManagerSignDate",
          ].includes(key)
      )
      .some(
        ([_, value]) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const columns = [
    { field: "workOrderNo", label: "Work Order No", width: "140px" },
    { field: "issueDate", label: "Issue Date", width: "120px" },
    { field: "customerName", label: "Customer Name", width: "150px" },
    { field: "repairOrderNo", label: "Repair Order No", width: "150px" },
    { field: "partNumber", label: "Part Number", width: "120px" },
    { field: "qty", label: "Quantity", width: "90px" },
    { field: "description", label: "Description", width: "150px" },
    { field: "cmmRefNo", label: "CMM Ref No", width: "120px" },
    { field: "revNo", label: "Rev No", width: "90px" },
    { field: "issuedBy", label: "Issued By", width: "120px" },
    { field: "technician", label: "Technician", width: "120px" },
    { field: "totalManHour", label: "Man Hours", width: "100px" },
    { field: "actionTaken", label: "Action Taken", width: "130px" },
    { field: "toolsUsed", label: "Tools Used", width: "120px" },
    { field: "snBn", label: "SN/BN", width: "100px" },
  ];

  const handlePrintClick = (workOrder) => {
    setWorkOrderData(workOrder);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatText = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Print View (Hidden) */}
          <div className="printView">
            {/* <PurchaseOrderForm tableData={workOrderData} /> */}
          </div>

          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-check-circle"></i>
              <span className={styles.breadcrumbLabel}>
                Dispatch Report 
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
                    placeholder="Search View All Work Orders..."
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
                  <p className={styles.loadingText}>Loading View All Work Orders...</p>
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
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((workOrder, index) => (
                          <tr
                            key={workOrder.workOrderNo || index}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {columns.map((column) => (
                              <td
                                key={`${workOrder.workOrderNo || index}-${
                                  column.field
                                }`}
                                title={workOrder[column.field]}
                              >
                                {column.field === "workOrderNo" ? (
                                  <button
                                    className={styles.linkButton}
                                    onClick={() =>
                                      navigate("/AddDispatchReport", {
                                        state: { workOrder },
                                      })
                                    }
                                  >
                                    {workOrder.workOrderNo}
                                  </button>
                                ) : column.field === "issueDate" ||
                                  column.field === "qualityManagerSignDate" ||
                                  column.field === "workshopManagerSignDate" ? (
                                  formatDate(workOrder[column.field])
                                ) : column.field === "description" ? (
                                  formatText(workOrder[column.field], 20)
                                ) : column.field === "actionTaken" ? (
                                  formatText(workOrder[column.field], 15)
                                ) : column.field === "toolsUsed" ? (
                                  formatText(workOrder[column.field], 15)
                                ) : column.field === "workshopManagerRemarks" ? (
                                  formatText(workOrder[column.field], 15)
                                ) : (
                                  workOrder[column.field]
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length} className={styles.noData}>
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x"></i>
                                <p>No matching records found</p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x"></i>
                                <p>No View All Work Orders available</p>
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

export default ViewWorkOrderClosed;