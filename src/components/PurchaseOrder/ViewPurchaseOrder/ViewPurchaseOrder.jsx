import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import {
  deletePurchaseOrder,
  listAllPurchaseOrder,
  getPurchaseOrder,
} from "../../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import styles from "../ViewPurchaseOrder/ViewPurchaseOrder.module.css";

const ViewPurchaseOrderPage = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("poNumber");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [printData, setPrintData] = useState(null);
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
    navigate("/editpurchaseorder", {
      state: { purchaseOrderID },
    });
  };

  // Print functionality
  const handlePrintClick = async (purchaseOrderId) => {
    try {
      // Fetch the full purchase order data
      const response = await getPurchaseOrder(purchaseOrderId);
      
      if (response) {
        setPrintData(response);
        
        // Wait for state to update and DOM to render
        setTimeout(() => {
          window.print();
        }, 300);
      }
    } catch (error) {
      console.error("Error fetching purchase order for print:", error);
      toast.error("Failed to load purchase order for printing");
    }
  };

  // Search functionality
  const filteredData = tableData
    .filter((requisition) => requisition.status?.toLowerCase() !== "close")
    .filter((requisition) =>
      Object.values(requisition).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((order) => {
      let matchesDate = true;
      if (startDate) {
        matchesDate =
          matchesDate &&
          order.poDate &&
          new Date(order.poDate) >= new Date(startDate);
      }
      if (endDate) {
        matchesDate =
          matchesDate &&
          order.poDate &&
          new Date(order.poDate) <= new Date(endDate);
      }
      return matchesDate;
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
    { field: "poNumber", label: "PO Number", width: "120px" },
    { field: "poDate", label: "PO Date", width: "120px" },
    { field: "srNo", label: "SR No", width: "80px" },
    { field: "paymentTerms", label: "Payment Terms", width: "120px" },
    { field: "partNumber", label: "Part Number", width: "120px" },
    { field: "description", label: "Desc", width: "150px" },
    { field: "currentStoke", label: "PO QTY", width: "100px" },
    { field: "unit", label: "Unit", width: "80px" },
    { field: "ratePerUnit", label: "Rate Per Unit", width: "120px" },
    { field: "grossAmount", label: "Gross AMT", width: "100px" },
    { field: "currency", label: "Currency", width: "100px" },
    { field: "status", label: "Status", width: "90px" },
  ];

  // Format currency values
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return parseFloat(value).toFixed(2);
  };

  // Print styles
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      
      #printSection,
      #printSection * {
        visibility: visible;
      }
      
      #printSection {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
      }
      
      .no-print {
        display: none !important;
      }
      
      @page {
        size: A4;
        margin: 10mm;
      }
    }
    
    @media screen {
      #printSection {
        display: none;
      }
    }
  `;

  // Purchase Order Print Template
  const PurchaseOrderPrintTemplate = ({ data }) => {
    if (!data) return null;

    const calculateSubtotal = () => {
      return parseFloat(data.grossAmount || 0);
    };

    const calculateTotal = () => {
      return (
        calculateSubtotal() +
        (parseFloat(data.pf) || 0) +
        (parseFloat(data.transportation) || 0) +
        (parseFloat(data.insurance) || 0) +
        (parseFloat(data.other_Charges) || 0)
      );
    };

    return (
      <div id="printSection" style={{ fontFamily: "Arial, sans-serif" }}>
        <style>{`
          .print-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          
          .company-info h2 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 24px;
          }
          
          .company-info p {
            margin: 2px 0;
            font-size: 12px;
            color: #666;
          }
          
          .order-info {
            text-align: right;
          }
          
          .order-info-grid {
            display: grid;
            grid-template-columns: auto auto;
            gap: 5px 10px;
            font-size: 12px;
          }
          
          .order-info-label {
            font-weight: bold;
            text-align: right;
          }
          
          .address-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .address-box {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
          }
          
          .address-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
          }
          
          .address-text {
            font-size: 12px;
            line-height: 1.6;
          }
          
          .payment-terms {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          
          .payment-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .items-table th,
          .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          
          .items-table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .items-table td.text-center {
            text-align: center;
          }
          
          .items-table td.text-right {
            text-align: right;
          }
          
          .footer-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
          }
          
          .legal-text {
            font-size: 10px;
            line-height: 1.5;
          }
          
          .legal-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 11px;
          }
          
          .terms-section {
            margin-top: 15px;
          }
          
          .terms-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 11px;
          }
          
          .terms-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 5px 10px;
            font-size: 11px;
          }
          
          .total-section {
            text-align: right;
          }
          
          .total-table {
            width: 100%;
            margin-bottom: 20px;
          }
          
          .total-table td {
            padding: 5px 10px;
            font-size: 12px;
          }
          
          .total-label {
            font-weight: bold;
            text-align: right;
          }
          
          .total-value {
            text-align: right;
            border-bottom: 1px solid #eee;
          }
          
          .signature {
            margin-top: 40px;
            text-align: center;
          }
          
          .signature-title {
            font-weight: bold;
            margin-bottom: 50px;
            font-size: 12px;
          }
          
          .form-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          
          .form-footer p {
            display: inline-block;
            margin: 0 15px;
          }
        `}</style>

        <div className="print-container">
          {/* Header Section */}
          <div className="print-header">
            <div className="company-info">
              <h2>AMC TECHNOLOGY</h2>
              <p>105, Hiday Industrial Estate, Hira Industrial Park</p>
              <p>Off Western Express Highway, Vasai Phata,</p>
              <p>Vasai (East) Dist - Palghar, 401208</p>
              <p>GST NO: 27ABTPS4731Z1ZA</p>
            </div>
            <div className="order-info">
              <div className="order-info-grid">
                <div className="order-info-label">P.O. No.:</div>
                <div>{data.poNumber || ""}</div>
                <div className="order-info-label">P.O. Date:</div>
                <div>{data.poDate || ""}</div>
                <div className="order-info-label">Our Reference:</div>
                <div>{data.ourReference || ""}</div>
                <div className="order-info-label">Your Reference:</div>
                <div>{data.yourReference || ""}</div>
                <div className="order-info-label">Delivery:</div>
                <div>{data.delivery || ""}</div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="address-section">
            <div className="address-box">
              <div className="address-title">To,</div>
              <div className="address-text">
                {data.deliveryAddress || ""}
              </div>
            </div>
            <div className="address-box">
              <div className="address-title">Delivery Address:</div>
              <div className="address-text">
                AMC TECHNOLOGY<br />
                105, Hiday Industrial Estate, Hira Industrial Park<br />
                Off Western Express Highway, Vasai Phata,<br />
                Vasai (East) Dist - Palghar, 401208
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="payment-terms">
            <div className="payment-title">Payment Terms:</div>
            <div>{data.paymentTerms || ""}</div>
          </div>

          {/* Items Table */}
          <table className="items-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Part Number</th>
                <th>Description</th>
                <th className="text-center">QTY</th>
                <th className="text-center">Units</th>
                <th className="text-center">Rate/Unit</th>
                <th className="text-right">Gross</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.srNo || 1}</td>
                <td>{data.partNumber || ""}</td>
                <td>{data.description || ""}</td>
                <td className="text-center">{data.currentStoke || 0}</td>
                <td className="text-center">{data.unit || ""}</td>
                <td className="text-center">{formatCurrency(data.ratePerUnit)}</td>
                <td className="text-right">{formatCurrency(data.grossAmount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Section */}
          <div className="footer-section">
            <div>
              <div className="legal-text">
                <div className="legal-title">JURISDICTION OF COURTS:</div>
                <p>
                  All contracts shall be deemed to have been wholly made in
                  Mumbai and all claims thereunder are payable in Mumbai City
                  and it is the distinct condition of the order that no suit or
                  action for the purpose of enforcing any claim in respect of
                  the order shall be instituted in any Court other than that
                  situated in Mumbai City, Maharashtra State, India i.e. courts
                  in Mumbai shall alone have jurisdiction to decide upon any
                  dispute arising out of or in Respect of the contract.
                </p>
              </div>
              <div className="terms-section">
                <div className="terms-title">TERMS AND CONDITION:</div>
                <div className="terms-grid">
                  <div>Incoterm:</div>
                  <div>{data.incoterm || ""}</div>
                  <div>Currency:</div>
                  <div>{data.currency || ""}</div>
                  <div>Forwarder:</div>
                  <div>{data.forwarder || ""}</div>
                </div>
              </div>
            </div>
            <div className="total-section">
              <table className="total-table">
                <tbody>
                  <tr>
                    <td className="total-label">Gross</td>
                    <td className="total-value">{formatCurrency(calculateSubtotal())}</td>
                  </tr>
                  <tr>
                    <td className="total-label">Total</td>
                    <td className="total-value">{formatCurrency(data.total)}</td>
                  </tr>
                  <tr>
                    <td className="total-label">SGST {data.sgstPercentage}%</td>
                    <td className="total-value">{formatCurrency(data.sgst)}</td>
                  </tr>
                  <tr>
                    <td className="total-label">CGST {data.cgstPercentage}%</td>
                    <td className="total-value">{formatCurrency(data.cgst)}</td>
                  </tr>
                  <tr>
                    <td className="total-label">IGST {data.igstPercentage}%</td>
                    <td className="total-value">{formatCurrency(data.igst)}</td>
                  </tr>
                  <tr>
                    <td className="total-label">Grand Total</td>
                    <td className="total-value" style={{ fontWeight: "bold", fontSize: "14px" }}>
                      {formatCurrency(data.grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="signature">
                <div className="signature-title">FOR AMC TECHNOLOGY</div>
                <div className="signature-title">Authorised Signatory</div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="form-footer">
            <p>Form: AMC-32</p>
            <p>Rev:00</p>
            <p>Date: Jan 2021</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{printStyles}</style>
      
      {/* Print Template - Hidden on screen */}
      <PurchaseOrderPrintTemplate data={printData} />

      <div className="wrapper no-print">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb breadcrumbsLabel="View Purchase Orders" />
            
            <div
              className={[
                "card border-0 shadow-lg mx-4 my-4 rounded-3",
                styles.normalViewStyle,
              ].join(" ")}
            >
              <div className="card-body">
                {/* Date Range Filter */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label className="form-label fw-light">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-light">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

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
                                      sortDirection === "desc" ? "up" : "down"
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
                                      handlePrintClick(purchaseOrder.id)
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
    </>
  );
};

export default ViewPurchaseOrderPage;