import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { deleteProduct, getProductDetail, listAllProduct } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { toast } from "react-toastify";

const ProductList = () => {
  // State
  const [tableData, setTableData] = useState([]); // Product data
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("productId");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const navigate = useNavigate();

  // Fetching data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listAllProduct();
        if (response && response.data) {
          setTableData(response.data); // Update state with response data
        }
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load product data");
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

  // Search functionality
  const filteredData = tableData.filter((product) => {
    return Object.values(product).some(
      (value) => 
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
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(i)}
          >
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
    { field: "productName", label: "Name", width: "150px" },
    { field: "materialClassification", label: "Material Classification", width: "180px" },
    { field: "productDescription", label: "Description", width: "200px" },
    { field: "unitOfMeasurement", label: "UOM", width: "80px" },
    { field: "oem", label: "OEM", width: "100px" },
    { field: "nha", label: "NHA", width: "100px" },
    { field: "cmmReferenceNumber", label: "CMM Reference Number", width: "180px" },
    { field: "registrationDate", label: "Date", width: "120px" },
    { field: "registeredBy", label: "Registered By", width: "150px" }
  ];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="View Product" />

        <div className="card border border-dark shadow mx-4 my-4 p-2">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 ms-auto">
                <div className="d-flex align-items-center">
                  <label className="me-2">Show</label>
                  <select
                    className="form-select"
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
                  <label className="ms-2">entries</label>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light sticky-top">
                  <tr>
                    {columns.map((column) => (
                      <th 
                        key={column.field} 
                        className="position-sticky"
                        onClick={() => handleSort(column.field)}
                        style={{ 
                          cursor: "pointer", 
                          width: column.width || "auto" 
                        }}
                      >
                        {column.label}
                        {sortField === column.field && (
                          <i className={`ms-1 fa fa-sort-${sortDirection === "asc" ? "up" : "down"}`}></i>
                        )}
                      </th>
                    ))}
                    <th style={{ width: "80px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                      <tr key={product.productId}>
                        {columns.map((column) => (
                          <td 
                            key={`${product.productId}-${column.field}`}
                            className="text-nowrap overflow-hidden text-truncate"
                            style={{ maxWidth: "150px" }}
                            title={product[column.field]}
                          >
                            {product[column.field]}
                          </td>
                        ))}
                        <td style={{display: "flex",justifyContent:'space-evenly'}}>
                          <button
                            className="btn btn-sm btn-danger me-1"
                            onClick={() => handleDelete(product.productId)}
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(product.productId)}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center">
                        {searchTerm ? "No matching records found" : "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <p>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} entries
                  {searchTerm && ` (filtered from ${tableData.length} total entries)`}
                </p>
              </div>
              <div className="col-md-6">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(1)}
                        aria-label="First page"
                      >
                        <i className="fa-solid fa-angles-left"></i>
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>
                    
                    {renderPageNumbers()}
                    
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
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
    </div>
  );
};

export default ProductList;