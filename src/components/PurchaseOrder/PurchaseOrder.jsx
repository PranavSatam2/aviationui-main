import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { listAllPurchaseRequisition } from "../../services/db_manager";
import styles from "./PurchaseOrder.module.css";

export default function PurchaseOrderForm() {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await listAllPurchaseRequisition();
      console.log("table ", response);
      setTableData(response || []);
    } catch (error) {
      console.error("Error fetching purchase requisitions", error);
      toast.error("Failed to load purchase requisitions");
    } finally {
      setIsLoading(false);
    }
  };

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

  const columns = [
    { field: "batchNumber", label: "PR Number", width: "200px" },
    { field: "id", label: "P_REQ_No", width: "100px" },
    { field: "partNumber", label: "Part Number", width: "130px" },
    { field: "description", label: "Description", width: "150px" },
    { field: "currentStock", label: "Current Stock", width: "120px" },
    { field: "requiredQty", label: "Required Qty", width: "120px" },
    { field: "requiredDate", label: "Required Date", width: "120px" },
    { field: "remark", label: "Remark", width: "100px" },
    { field: "status", label: "Status", width: "100px" },
  ];

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one row before proceeding");
      return;
    }
    const selectedItemsData = tableData.filter((item) =>
      selectedItems.includes(item.id)
    );
    navigate("/purchaseOrderForm", { state: { selectedItems: selectedItemsData } });
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
              <i className="fa fa-shopping-cart"></i>
              <span className={styles.breadcrumbLabel}>Purchase Order</span>
            </div>
            <div className={styles.selectedInfo}>
              {selectedItems.length > 0 && (
                <span className={styles.selectedBadge}>
                  {selectedItems.length} Selected
                </span>
              )}
            </div>
          </div>

          {/* Card */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Controls Row */}
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
                          <input type="checkbox" disabled />
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
                        currentItems.map((item, idx) => (
                          <tr key={idx} style={{ animationDelay: `${idx * 0.02}s` }}>
                            <td className={styles.checkboxCell}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className={styles.checkbox}
                              />
                            </td>
                            {columns.map((col) => (
                              <td key={col.field} title={item[col.field]}>
                                {item[col.field]}
                              </td>
                            ))}
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
                  <strong>{sortedData.length}</strong> batch groups
                  {searchTerm && ` (filtered from ${tableData.length} total batch groups)`}
                </div>
                <nav>
                  <ul className={styles.pagination}>
                    <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(1)}
                        aria-label="First page"
                      >
                        <i className="fa-solid fa-angles-left"></i>
                      </button>
                    </li>
                    <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>

                    {renderPageNumbers()}

                    <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                    <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
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

              {/* Proceed Button */}
              <div className={styles.proceedContainer}>
                <button
                  className={styles.btnProceed}
                  onClick={handleProceed}
                  disabled={selectedItems.length === 0}
                >
                  <i className="fa fa-arrow-right"></i>
                  <span>Proceed with Selected Items</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}