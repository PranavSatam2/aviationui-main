import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import {
  deletePurchaseOrder,
  listAllPurchaseOrder,
} from "../../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import PurchaseOrderReport from "../PurchaseOrderReport/PurchaseOrderReport";
import styles from "../ViewPurchaseOrder/ViewPurchaseOrder.module.css";
import PurchaseOrderForm from "../PurchaseOrderReport/PurchaseOrderReport";
const ViewPurchaseOrderPage = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("poNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseOrderData, setPurchaseOrderData] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await listAllPurchaseOrder();
      setTableData(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching purchase orders", error);
      toast.error("Failed to load purchase orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Delete the selected purchase order
  const deleteSelectedElement = async (purchaseOrderId) => {
    if (
      window.confirm("Are you sure you want to delete this purchase order?")
    ) {
      try {
        await deletePurchaseOrder(purchaseOrderId);
        setTableData((prevData) =>
          prevData.filter(
            (purchaseOrder) => purchaseOrder.id !== purchaseOrderId
          )
        );
        toast.success("Purchase order deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete purchase order", error);
        toast.error("Failed to delete purchase order. Please try again.");
      }
    }
  };

  // Edit the selected purchase order
  const editSelectedElement = async (purchaseOrderID) => {
    // try {
    //   const response = await getPurchaseOrderDetail(purchaseOrderId);
    //   const orderData = response?.data;
    //   if (orderData) {
    navigate("/editpurchaseorder", {
      state: { purchaseOrderID },
    });
    //   }
    // } catch (error) {
    //   console.error("Error fetching purchase order details: ", error);
    //   toast.error("Failed to fetch purchase order details");
    // }
  };

  // Search functionality
  const filteredData = tableData.filter((purchaseOrder) => {
    return Object.entries(purchaseOrder)
      .filter(([key]) => key !== "id") // Exclude id from search
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

  // Column definitions for the table - expanded to include all fields except ID
  const columns = [
    { field: "poNumber", label: "PO Number", width: "120px" },
    { field: "poDate", label: "PO Date", width: "120px" },
    // { field: "batchNumber", label: "Batch Number", width: "120px" },
    { field: "ourReference", label: "Our Reference", width: "120px" },
    { field: "yourReference", label: "Your Reference", width: "120px" },
    { field: "delivery", label: "Delivery", width: "100px" },
    { field: "srNo", label: "SR No", width: "80px" },
    { field: "deliveryAddress", label: "Delivery Address", width: "200px" },
    { field: "paymentTerms", label: "Payment Terms", width: "120px" },
    { field: "partNumber", label: "Part Number", width: "120px" },
    { field: "description", label: "Description", width: "150px" },
    { field: "currentStoke", label: "Current Stock", width: "120px" },
    { field: "unit", label: "Unit", width: "80px" },
    { field: "ratePerUnit", label: "Rate Per Unit", width: "120px" },
    { field: "grossAmount", label: "Gross Amount", width: "120px" },
    { field: "sgst", label: "SGST", width: "80px" },
    { field: "cgst", label: "CGST", width: "80px" },
    { field: "igst", label: "IGST", width: "80px" },
    { field: "total", label: "Total", width: "120px" },
    { field: "grandTotal", label: "Grand Total", width: "120px" },
    { field: "incoterm", label: "Incoterm", width: "100px" },
    { field: "currency", label: "Currency", width: "100px" },
    { field: "forwarder", label: "Forwarder", width: "120px" },
    { field: "transportation", label: "Transportation", width: "120px" },
    { field: "pf", label: "PF", width: "80px" },
    { field: "other_Charges", label: "Other Charges", width: "120px" },
    { field: "insurance", label: "Insurance", width: "100px" },
  ];

  const handlePrintClick = (purchaseOrder) => {
    setPurchaseOrderData(purchaseOrder);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Format currency values
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return parseFloat(value).toFixed(2);
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Purchase Orders" />
          <div className="printView">
            <PurchaseOrderForm tableData={purchaseOrderData} />
          </div>
          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
              styles.normalViewStyle,
            ].join(" ")}
          >
            <div className="card-body">
              <div className="row align-items-center mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search purchase orders..."
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
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </div>
              ) : (
                <div
                  className="table-responsive"
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "65vh",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#ccc transparent",
                  }}
                >
                  <table className="table table-hover table-striped align-middle">
                    <thead>
                      <tr className="bg-light">
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
                              whiteSpace: "nowrap",
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
                            whiteSpace: "nowrap",
                          }}
                        >
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((purchaseOrder, index) => (
                          <tr
                            key={purchaseOrder.id || index}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${purchaseOrder.id || index}-${
                                  column.field
                                }`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={purchaseOrder[column.field]}
                              >
                                {[
                                  "total",
                                  "grandTotal",
                                  "ratePerUnit",
                                  "grossAmount",
                                  "sgst",
                                  "cgst",
                                  "igst",
                                  "transportation",
                                  "pf",
                                  "other_Charges",
                                  "insurance",
                                ].includes(column.field)
                                  ? formatCurrency(purchaseOrder[column.field])
                                  : column.field === "deliveryAddress"
                                  ? purchaseOrder[column.field]?.substring(
                                      0,
                                      20
                                    ) +
                                    (purchaseOrder[column.field]?.length > 20
                                      ? "..."
                                      : "")
                                  : column.field === "termsAndConditions"
                                  ? purchaseOrder[column.field]?.substring(
                                      0,
                                      20
                                    ) +
                                    (purchaseOrder[column.field]?.length > 20
                                      ? "..."
                                      : "")
                                  : purchaseOrder[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(purchaseOrder.id)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    deleteSelectedElement(purchaseOrder.id)
                                  }
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    handlePrintClick(purchaseOrder)
                                  }
                                  title="Print"
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
                            colSpan={columns.length + 1}
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
    </div>
  );
};

export default ViewPurchaseOrderPage;
