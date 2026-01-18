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
import styles from "./ViewPurchaseOrder.module.css";

const ViewPurchaseOrderPage = () => {
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
    } catch (error) {
      console.error("Error fetching purchase orders", error);
      toast.error("Failed to load purchase orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteSelectedElement = async (purchaseOrderId) => {
    if (window.confirm("Are you sure you want to delete this purchase order?")) {
      try {
        await deletePurchaseOrder(purchaseOrderId);
        setTableData((prevData) =>
          prevData.filter((purchaseOrder) => purchaseOrder.id !== purchaseOrderId)
        );
        toast.success("Purchase order deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete purchase order", error);
        toast.error("Failed to delete purchase order. Please try again.");
      }
    }
  };

  const editSelectedElement = async (purchaseOrderID) => {
    navigate("/editpurchaseorder", {
      state: { purchaseOrderID },
    });
  };

  const handlePrintClick = async (purchaseOrderId) => {
    try {
      const response = await getPurchaseOrder(purchaseOrderId);
      
      if (response) {
        setPrintData(response);
        
        setTimeout(() => {
          window.print();
        }, 300);
      }
    } catch (error) {
      console.error("Error fetching purchase order for print:", error);
      toast.error("Failed to load purchase order for printing");
    }
  };

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
    { field: "poNumber", label: "PO Number", width: "120px" },
    { field: "poDate", label: "PO Date", width: "120px" },
    { field: "srNo", label: "SR No", width: "80px" },
    { field: "paymentTerms", label: "Payment Terms", width: "140px" },
    { field: "partNumber", label: "Part Number", width: "130px" },
    { field: "description", label: "Description", width: "150px" },
    { field: "currentStoke", label: "PO QTY", width: "100px" },
    { field: "unit", label: "Unit", width: "80px" },
    { field: "ratePerUnit", label: "Rate/Unit", width: "100px" },
    { field: "grossAmount", label: "Gross AMT", width: "110px" },
    { field: "currency", label: "Currency", width: "90px" },
    { field: "status", label: "Status", width: "90px" },
  ];

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return parseFloat(value).toFixed(2);
  };

  const printStyles = `
    @media print {
      body * { visibility: hidden; }
      #printSection, #printSection * { visibility: visible; }
      #printSection { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 10mm; }
    }
    @media screen {
      #printSection { display: none; }
    }
  `;

  const PurchaseOrderPrintTemplate = ({ data }) => {
    if (!data) return null;

    const calculateSubtotal = () => parseFloat(data.grossAmount || 0);

    return (
      <div id="printSection" style={{ fontFamily: "Arial, sans-serif" }}>
        <style>{`
          .print-container { max-width: 210mm; margin: 0 auto; padding: 20px; background: white; }
          .print-header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .company-info h2 { margin: 0 0 10px 0; color: #333; font-size: 24px; }
          .company-info p { margin: 2px 0; font-size: 12px; color: #666; }
          .order-info { text-align: right; }
          .order-info-grid { display: grid; grid-template-columns: auto auto; gap: 5px 10px; font-size: 12px; }
          .order-info-label { font-weight: bold; text-align: right; }
          .address-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .address-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .address-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
          .address-text { font-size: 12px; line-height: 1.6; }
          .payment-terms { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .payment-title { font-weight: bold; margin-bottom: 5px; font-size: 14px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          .items-table th { background-color: #f5f5f5; font-weight: bold; }
          .items-table td.text-center { text-align: center; }
          .items-table td.text-right { text-align: right; }
          .footer-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
          .legal-text { font-size: 10px; line-height: 1.5; }
          .legal-title { font-weight: bold; margin-bottom: 5px; font-size: 11px; }
          .terms-section { margin-top: 15px; }
          .terms-title { font-weight: bold; margin-bottom: 10px; font-size: 11px; }
          .terms-grid { display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; font-size: 11px; }
          .total-section { text-align: right; }
          .total-table { width: 100%; margin-bottom: 20px; }
          .total-table td { padding: 5px 10px; font-size: 12px; }
          .total-label { font-weight: bold; text-align: right; }
          .total-value { text-align: right; border-bottom: 1px solid #eee; }
          .signature { margin-top: 40px; text-align: center; }
          .signature-title { font-weight: bold; margin-bottom: 50px; font-size: 12px; }
          .form-footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
          .form-footer p { display: inline-block; margin: 0 15px; }
        `}</style>

        <div className="print-container">
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
                <div className="order-info-label">P.O. No.:</div><div>{data.poNumber || ""}</div>
                <div className="order-info-label">P.O. Date:</div><div>{data.poDate || ""}</div>
                <div className="order-info-label">Our Reference:</div><div>{data.ourReference || ""}</div>
                <div className="order-info-label">Your Reference:</div><div>{data.yourReference || ""}</div>
                <div className="order-info-label">Delivery:</div><div>{data.delivery || ""}</div>
              </div>
            </div>
          </div>

          <div className="address-section">
            <div className="address-box">
              <div className="address-title">To,</div>
              <div className="address-text">{data.deliveryAddress || ""}</div>
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

          <div className="payment-terms">
            <div className="payment-title">Payment Terms:</div>
            <div>{data.paymentTerms || ""}</div>
          </div>

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

          <div className="footer-section">
            <div>
              <div className="legal-text">
                <div className="legal-title">JURISDICTION OF COURTS:</div>
                <p>All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...</p>
              </div>
              <div className="terms-section">
                <div className="terms-title">TERMS AND CONDITION:</div>
                <div className="terms-grid">
                  <div>Incoterm:</div><div>{data.incoterm || ""}</div>
                  <div>Currency:</div><div>{data.currency || ""}</div>
                  <div>Forwarder:</div><div>{data.forwarder || ""}</div>
                </div>
              </div>
            </div>
            <div className="total-section">
              <table className="total-table">
                <tbody>
                  <tr><td className="total-label">Gross</td><td className="total-value">{formatCurrency(calculateSubtotal())}</td></tr>
                  <tr><td className="total-label">Total</td><td className="total-value">{formatCurrency(data.total)}</td></tr>
                  <tr><td className="total-label">SGST {data.sgstPercentage}%</td><td className="total-value">{formatCurrency(data.sgst)}</td></tr>
                  <tr><td className="total-label">CGST {data.cgstPercentage}%</td><td className="total-value">{formatCurrency(data.cgst)}</td></tr>
                  <tr><td className="total-label">IGST {data.igstPercentage}%</td><td className="total-value">{formatCurrency(data.igst)}</td></tr>
                  <tr><td className="total-label">Grand Total</td><td className="total-value" style={{ fontWeight: "bold", fontSize: "14px" }}>{formatCurrency(data.grandTotal)}</td></tr>
                </tbody>
              </table>
              <div className="signature">
                <div className="signature-title">FOR AMC TECHNOLOGY</div>
                <div className="signature-title">Authorised Signatory</div>
              </div>
            </div>
          </div>

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
      <PurchaseOrderPrintTemplate data={printData} />

      <div className={`${styles.wrapper} no-print`}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.mainContent}>
            <div className={styles.breadcrumbSection}>
              <div className={styles.breadcrumbContent}>
                <i className="fa fa-file-invoice-dollar"></i>
                <span className={styles.breadcrumbLabel}>View Purchase Orders</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardBody}>
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

                <div className={styles.controlsRow}>
                  <div className={styles.searchBox}>
                    <i className="fa fa-search"></i>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Search purchase orders..."
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
                                  <i className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ${styles.sortIconActive}`}></i>
                                ) : (
                                  <i className={`fa fa-sort ${styles.sortIcon}`}></i>
                                )}
                              </div>
                            </th>
                          ))}
                          <th className={styles.actionsHeader}>
                            <div className={styles.thContent}><span>ACTIONS</span></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map((purchaseOrder, index) => (
                            <tr key={purchaseOrder.id || index} style={{ animationDelay: `${index * 0.02}s` }}>
                              {columns.map((column) => (
                                <td key={`${purchaseOrder.id || index}-${column.field}`} title={purchaseOrder[column.field]}>
                                  {["total", "grandTotal", "ratePerUnit", "grossAmount", "sgst", "cgst", "igst"].includes(column.field)
                                    ? formatCurrency(purchaseOrder[column.field])
                                    : column.field === "deliveryAddress"
                                    ? purchaseOrder[column.field]?.substring(0, 20) + (purchaseOrder[column.field]?.length > 20 ? "..." : "")
                                    : purchaseOrder[column.field]}
                                </td>
                              ))}
                              <td className={styles.actionsCell}>
                                <div className={styles.actionButtons}>
                                  <button className={styles.btnEdit} onClick={() => editSelectedElement(purchaseOrder.id)} title="Edit">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                  <button className={styles.btnDelete} onClick={() => deleteSelectedElement(purchaseOrder.id)} title="Delete">
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                  <button className={styles.btnPrint} onClick={() => handlePrintClick(purchaseOrder.id)} title="Print">
                                    <i className="fa-solid fa-print"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={columns.length + 1} className={styles.noData}>
                              {searchTerm ? (
                                <div><i className="fa fa-search fa-2x"></i><p>No matching records found</p></div>
                              ) : (
                                <div><i className="fa fa-database fa-2x"></i><p>No data available</p></div>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

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
                        <button className={styles.pageLink} onClick={() => setCurrentPage(1)} aria-label="First page">
                          <i className="fa-solid fa-angles-left"></i>
                        </button>
                      </li>
                      <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
                        <button className={styles.pageLink} onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous page">
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>
                      {renderPageNumbers()}
                      <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
                        <button className={styles.pageLink} onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next page">
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                      <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
                        <button className={styles.pageLink} onClick={() => setCurrentPage(totalPages)} aria-label="Last page">
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
    </>
  );
};

export default ViewPurchaseOrderPage;