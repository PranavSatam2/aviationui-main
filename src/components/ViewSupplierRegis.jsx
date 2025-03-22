import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  deleteSupplier,
  getSupplierDetail,
  listAllSupplier,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const ViewSupplierRegis = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listAllSupplier();
        if (response) {
          setTableData(response);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load suppliers");
      }
    };
    fetchData();
  }, []);

  const deleteSelectedElement = async (elementId) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const response = await deleteSupplier(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((supplier) => supplier.formId !== elementId)
          );
          toast.success("Supplier deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete supplier", error);
        toast.error("Failed to delete supplier. Please try again.");
      }
    }
  };

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let supplierId = elementId;
        let supplierData = await getSupplierDetail(elementId);
        supplierData = supplierData.data;
        if (supplierId !== null) {
          navigate("/SupplierRegistration", {
            state: { supplierId, supplierData },
          });
        }
      } catch (error) {
        console.error("Error fetching supplier details: ", error);
        toast.error("Failed to fetch supplier details");
      }
    }
  };

  // Search functionality
  const filteredData = tableData.filter((supplier) => {
    return Object.values(supplier).some(
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

  // Column definitions for the table
  const columns = [
    { field: "formId", label: "Id", width: "35px" },
    { field: "supplierName", label: "Supplier Name", width: "200px" },
    { field: "address", label: "Address" },
    { field: "phoneNumber", label: "Number" },
    { field: "faxNum", label: "Fax" },
    { field: "email", label: "Email Id" },
    { field: "qualityManagerName", label: "Quality Manager" },
    { field: "qualityManagerPhoneNumber", label: "QM Number" },
    { field: "qualityManagerEmailId", label: "QM Email" },
    { field: "saleRepresentativeName", label: "Sale Rep" },
    { field: "saleRepresentativePhoneNumber", label: "S Number" },
    { field: "saleRepresentativeEmailId", label: "S Email" },
    { field: "coreProcess", label: "Core Product" },
  ];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Supplier Registration" />
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
                      placeholder="Search suppliers..."
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
                            width: column.width || "auto",
                          }}
                        >
                          {column.label}
                          {sortField === column.field && (
                            <i
                              className={`ms-1 fa fa-sort-${
                                sortDirection === "asc" ? "up" : "down"
                              }`}
                            ></i>
                          )}
                        </th>
                      ))}
                      <th style={{ width: "80px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((supplier) => (
                        <tr key={supplier.formId}>
                          {columns.map((column) => (
                            <td
                              key={`${supplier.formId}-${column.field}`}
                              className="text-nowrap overflow-hidden text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={supplier[column.field]}
                            >
                              {supplier[column.field]}
                            </td>
                          ))}
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <button
                              className="btn btn-sm btn-danger me-1"
                              onClick={() =>
                                deleteSelectedElement(supplier.formId)
                              }
                              title="Delete"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                editSelectedElement(supplier.formId)
                              }
                              title="Edit"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="text-center"
                        >
                          {searchTerm
                            ? "No matching records found"
                            : "No data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <p>
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, sortedData.length)} of{" "}
                    {sortedData.length} entries
                    {searchTerm &&
                      ` (filtered from ${tableData.length} total entries)`}
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
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
                          className="page-link"
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
                          className="page-link"
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

export default ViewSupplierRegis;
