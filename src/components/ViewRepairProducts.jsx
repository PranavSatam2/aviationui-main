import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  deleteReapairProduct,
  getProductById,
  getAllProducts,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./ViewMaterialNote.module.css";

const CustomerRepairProductList = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProducts();
        if (response && response.data) {
          setTableData(response.data);
        }
      } catch (error) {
        console.error("Error fetching repair products", error);
        toast.error("Failed to load repair product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteReapairProduct(id);
        setTableData((prev) => prev.filter((item) => item.id !== id));
        toast.success("Repair product deleted successfully");
      } catch (error) {
        console.error("Failed to delete repair product", error);
        toast.error("Failed to delete repair product. Please try again.");
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getProductById(id);
      if (response?.data) {
        navigate(`/editCustomersRepairProduct/${id}`);
      }
    } catch (error) {
      console.error("Error fetching repair product details: ", error);
      toast.error("Failed to fetch repair product details");
    }
  };

  // Filter data by search and date range
  const filteredData = tableData.filter((product) => {
    // Search filter
    const matchesSearch = Object.values(product).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    // Date filter
    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate &&
        product.date &&
        product.date >= startDate;
    }
    if (endDate) {
      matchesDate =
        matchesDate &&
        product.date &&
        product.date <= endDate;
    }
    return matchesSearch && matchesDate;
  });

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

  const columns = [
    { field: "id", label: "ID", width: "60px" },
    { field: "productName", label: "Name", width: "150px" },
    { field: "productSerialNumbers", label: "Serial Numbers", width: "200px" },
    { field: "productDescription", label: "Description", width: "150px" },
    { field: "unitOfMeasurement", label: "UOM", width: "80px" },
    { field: "oem", label: "OEM", width: "100px" },
    { field: "cmmRefNo", label: "CMM Ref No", width: "150px" },
    { field: "date", label: "Date", width: "100px" },
    { field: "registerBy", label: "Registered By", width: "120px" },
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
              <i className="fa fa-tools"></i>
              <span className={styles.breadcrumbLabel}>
                View Customer Repair Products
              </span>
            </div>
          </div>

          {/* Card Container */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Date Filters */}
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
                    placeholder="Search products..."
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
                        {columns.map((col) => (
                          <th
                            key={col.field}
                            onClick={() => handleSort(col.field)}
                            style={{ width: col.width }}
                          >
                            <div className={styles.thContent}>
                              <span>{col.label}</span>
                              {sortField === col.field ? (
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
                        currentItems.map((product, index) => (
                          <tr
                            key={product.id}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {columns.map((col) => (
                              <td key={col.field} title={product[col.field]}>
                                {col.field === "productSerialNumbers"
                                  ? product[col.field].join(", ")
                                  : product[col.field]}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnEdit}
                                  onClick={() => handleEdit(product.id)}
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className={styles.btnDelete}
                                  onClick={() => handleDelete(product.id)}
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

export default CustomerRepairProductList;