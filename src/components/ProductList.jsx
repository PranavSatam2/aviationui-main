import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  deleteProduct,
  getProductDetail,
  listAllProduct,
  fetchPartNumbersAndDescriptions,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { toast } from "react-toastify";
import styles from "./ProductList.module.css";

const ProductList = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("productId");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantityMap, setQuantityMap] = useState({});
  const userRole = sessionStorage.getItem("role");

  const navigate = useNavigate();

  // Function to render mapping type with arrows
  const renderMappingType = (mappingType) => {
    if (!mappingType) return "";
    
    const upperType = mappingType.toUpperCase();
    
    switch (upperType) {
      case "BOTH":
        return (
          <span className={styles.mappingBoth}>
            <i className="fa fa-arrow-down" title="Down"></i>
            <i className="fa fa-arrow-up" title="Up"></i>
          </span>
        );
      case "UP":
        return (
          <span className={styles.mappingUp}>
            <i className="fa fa-arrow-up" title="Up"></i>
          </span>
        );
      case "DOWN":
        return (
          <span className={styles.mappingDown}>
            <i className="fa fa-arrow-down" title="Down"></i>
          </span>
        );
      default:
        return mappingType;
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const partData = await fetchPartNumbersAndDescriptions();
        
        const qtyMap = {};
        if (partData && Array.isArray(partData)) {
          partData.forEach((item) => {
            if (item.productName) {
              qtyMap[item.productName] = item.quantity || 0;
            }
            if (item.alternateProduct1) {
              qtyMap[item.alternateProduct1] = item.alternateQuantity1 || 0;
            }
            if (item.alternateProduct2) {
              qtyMap[item.alternateProduct2] = item.alternateQuantity2 || 0;
            }
          });
        }
        setQuantityMap(qtyMap);

        const response = await listAllProduct();
        if (response && response.data) {
          setTableData(response.data);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete the selected product
  async function handleDelete(productId) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProduct(productId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((item) => item.productId !== productId)
          );
          toast.success("Product deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete product", error);
        toast.error("Failed to delete product. Please try again.");
      }
    }
  }

  // Edit the selected product
  async function handleEdit(productId) {
    try {
      const response = await getProductDetail(productId);
      const productData = response?.data;
      if (productData) {
        navigate(`/editProduct/${productId}`);
      }
    } catch (error) {
      console.error("Error fetching product details: ", error);
      toast.error("Failed to fetch product details");
    }
  }

  // Search and Date Range Filter
  const filteredData = tableData.filter((product) => {
    const matchesSearch = Object.values(product).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate &&
        product.registrationDate &&
        product.registrationDate >= startDate;
    }
    if (endDate) {
      matchesDate =
        matchesDate &&
        product.registrationDate &&
        product.registrationDate <= endDate;
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
    { field: "productId", label: "ID", width: "60px" },
    { field: "productName", label: "Part Number", width: "180px" },
    { field: "alternateProduct1", label: "Alternate Part 1", width: "150px" },
    { field: "alternateProduct2", label: "Alternate Part 2", width: "150px" },
    { field: "mappingType", label: "Interchangeability", width: "190px" },
    { field: "materialClassification", label: "Material Classification", width: "150px" },
    { field: "productDescription", label: "Description", width: "150px" },
    { field: "unitOfMeasurement", label: "UOM", width: "80px" },
    { field: "oem", label: "OEM", width: "100px" },
    { field: "nha", label: "NHA", width: "100px" },
    { field: "cmmReferenceNumber", label: "CMM Ref Number", width: "150px" },
    { field: "registrationDate", label: "Date", width: "100px" },
    { field: "registeredBy", label: "Registered By", width: "120px" },
  ];

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-list"></i>
              <span className={styles.breadcrumbLabel}>View Products</span>
            </div>
            {/* <button 
              className={styles.addButton}
              onClick={() => navigate("/addProduct")}
            >
              <i className="fa fa-plus"></i>
              <span>Add New Product</span>
            </button> */}
          </div>

          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Filters Section */}
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

              {/* Search and Entries */}
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
                          <tr key={product.productId} style={{ animationDelay: `${index * 0.02}s` }}>
                            {columns.map((column) => {
                              let displayValue = product[column.field];

                              if (column.field === "mappingType") {
                                return (
                                  <td key={`${product.productId}-${column.field}`} className={styles.mappingCell}>
                                    {renderMappingType(displayValue)}
                                  </td>
                                );
                              }

                              return (
                                <td
                                  key={`${product.productId}-${column.field}`}
                                  title={displayValue}
                                >
                                  {displayValue}
                                </td>
                              );
                            })}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                {userRole === "Admin" && (
                                  <button
                                    className={styles.btnEdit}
                                    onClick={() => handleEdit(product.productId)}
                                    title="Edit"
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                )}
                                <button
                                  className={styles.btnDelete}
                                  onClick={() => handleDelete(product.productId)}
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
                  {searchTerm && ` (filtered from ${tableData.length} total entries)`}
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
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductList;