import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getCAFormList, getCAForm, deleteCAForm } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrintCAForm } from "./PrintCAForm";
import styles from "./ViewMaterialNote.module.css";
import logo from "../static/img/AMCLOGO.jpg"; 

const ViewCAForm = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
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
        const firstItemId = currentItems[0].id;
        setSelectedItem(firstItemId);
      }
    }
    setSelectAll(!selectAll);
  };

  const handlePrintClick = (report) => {
    // Create the HTML content with inline styles
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CA Form - ${report.formTrackingNumber || "N/A"}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          padding: 20px;
        }
        .container {
          max-width: 297mm;
          margin: 0 auto;
          background: white;
        }
        .print-container {
          border: 2px solid black;
          padding: 2px;
        }
        .section {
          display: flex;
          border: 1px solid black;
          margin-bottom: 0;
        }
        .border-right {
          border-right: 1px solid black;
        }
        .company-logo {
          text-align: center;
          margin: 10px 0;
        }
        .company-logo img {
          height: 50px;
          width: 50px;
        }
        .cross-section {
          position: relative;
          overflow: hidden;
        }
        .cross-mark {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .checkbox {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid black;
          margin-right: 8px;
          vertical-align: middle;
          position: relative;
        }
        .checkbox.checked::before {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          font-size: 14px;
          font-weight: bold;
        }
        @media print {
          body {
            padding: 0;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="print-container">
          <!-- Header Section -->
          <div class="section">
            <div style="width: 20%; padding: 10px;" class="border-right">
              <div style="font-weight: bold;">1. DGCA India</div>
            </div>
            <div style="width: 50%; text-align: center; padding: 10px; font-weight: bold; font-size: 16px;" class="border-right">
              2. AUTHORISED RELEASE CERTIFICATE<br/>CA FORM 1
            </div>
            <div style="width: 30%; padding: 10px; font-weight: bold;">
              3. Form Tracking Number<br/>
              ${report.formTrackingNumber || "N/A"}
            </div>
          </div>

          <!-- Company Info Section -->
          <div class="section">
            <div style="width: 50%; padding: 10px; display: flex;" class="border-right">
              <div style="width: 30%;">
                <div style="font-weight: bold;">4. Approved Organization Name and Address:</div>
                <div class="company-logo">
                  <img src="${logo}" alt="AMC Technology Logo" />
                </div>
              </div>
              <div style="width: 70%; padding-left: 10px;">
                <br/>
                AMC TECHNOLOGY<br/>
                105, HRIDAY INDUSTRIAL ESTATE,<br/>
                HIRA INDUSTRIAL PARK, VASAI PHATA,<br/>
                VASAI EAST, PALGHAR 401 203,<br/>
                MAHARASHTRA, INDIA
              </div>
            </div>
            <div style="width: 50%; padding: 10px;">
              <div style="font-weight: bold;">5. Work Order/Contract/Invoice:</div>
              ${report.workOrderNumber || "N/A"}
            </div>
          </div>

          <!-- Table Header -->
          <div class="section">
            <div style="width: 8%; padding: 10px;" class="border-right">6. Item</div>
            <div style="width: 15%; padding: 10px;" class="border-right">7. Description</div>
            <div style="width: 15%; padding: 10px;" class="border-right">8. Part No.</div>
            <div style="width: 8%; padding: 10px;" class="border-right">9. Qty</div>
            <div style="width: 15%; padding: 10px;" class="border-right">10. Serial/Batch No.</div>
            <div style="width: 39%; padding: 10px;">11. Status/Work</div>
          </div>

          <!-- Table Data -->
          <div class="section">
            <div style="width: 8%; padding: 10px;" class="border-right">${
              report.item || "N/A"
            }</div>
            <div style="width: 15%; padding: 10px;" class="border-right">${
              report.description || "N/A"
            }</div>
            <div style="width: 15%; padding: 10px;" class="border-right">${
              report.partNo || "N/A"
            }</div>
            <div style="width: 8%; padding: 10px;" class="border-right">${
              report.quantity || "N/A"
            }</div>
            <div style="width: 15%; padding: 10px;" class="border-right">${
              report.serialNo || "N/A"
            }</div>
            <div style="width: 39%; padding: 10px;">${
              report.status || "N/A"
            }</div>
          </div>

          <!-- Remarks Section -->
          <div class="section">
            <div style="width: 100%; padding: 10px;">
              <strong>12. Remarks:</strong><br/>
              <div style="padding-left: 20px; min-height: 40px; margin-top: 5px;">
                ${report.remarks || "N/A"}
              </div>
            </div>
          </div>

          <!-- Certification Sections 13 & 14 -->
          <div class="section">
            <!-- Section 13 with X cross -->
            <div style="flex: 1; padding: 10px; position: relative;" class="border-right cross-section">
              <svg class="cross-mark" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" stroke-width="2" vector-effect="non-scaling-stroke"/>
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" stroke-width="2" vector-effect="non-scaling-stroke"/>
              </svg>
              <div style="position: relative; z-index: 2;">
                <strong>13. Manufacturer / Conformity Certification</strong><br/>
                Certifies that the items identified above were manufactured in conformity to:<br/><br/>
                <div style="margin: 8px 0;">
                  <span class="checkbox ${
                    report.approveDesign13a ? "checked" : ""
                  }"></span>
                  <span>Approved design data and are in condition for safe operation.</span>
                </div>
                <div style="margin: 8px 0;">
                  <span class="checkbox ${
                    report.nonApproveDesign13a ? "checked" : ""
                  }"></span>
                  <span>Non-approved design data specified in block 12.</span>
                </div>
                <div style="margin-top: 15px; font-size: 11px;">
                  <div style="margin: 5px 0;">13 b. Authorised Signature: _______________</div>
                  <div style="margin: 5px 0;">13 c. Approval / Authorisation Number: _______________</div>
                  <div style="margin: 5px 0;">13 d. Name: _______________</div>
                  <div style="margin: 5px 0;">13 e. Date (dd/mm/yyyy): _______________</div>
                </div>
              </div>
            </div>

            <!-- Section 14 -->
            <div style="flex: 1; padding: 10px; position: relative;">
              <div>
                <strong>14 a. CAR 145.A.50 RELEASE TO SERVICE</strong><br/>
                <div style="margin: 8px 0;">
                  <span class="checkbox ${
                    report.otherRegulation14a ? "checked" : ""
                  }"></span>
                  <span>Other regulation specified in block 12.</span>
                </div>
                <br/>
                Certifies that unless otherwise specified in block 12, the work identified in block 11 and described in block 12 was accomplished in accordance with CAR 145 and in respect to that work the items are considered ready for release to service.
              </div>
              <div style="margin-top: 15px; font-size: 11px;">
                <div style="margin: 5px 0;">14 b. Authorised Signature: _______________</div>
                <div style="margin: 5px 0;">14 c. Certificate / Approval Ref No.: _______________</div>
                <div style="margin: 5px 0;">14 d. Name: _______________</div>
                <div style="margin: 5px 0;">14 e. Date (dd/mm/yyyy): _______________</div>
              </div>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="section">
            <div style="padding: 10px; line-height: 1.6;">
              <div style="font-weight: bold;">USER/INSTALLER RESPONSIBILITY:</div>
              <p style="margin-top: 8px; text-align: justify; font-size: 10px;">
                THIS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE AUTHORITY TO INSTALL THE ITEMS. WHERE THE USER/INSTALLER PERFORMS WORK IN ACCORDANCE WITH REGULATIONS OF AN AIRWORTHINESS AUTHORITY DIFFERENT THAN THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1, IT IS ESSENTIAL THAT THE USER/INSTALLER ENSURES THAT HIS/HER AIRWORTHINESS AUTHORITY ACCEPTS ITEMS FROM THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A DO NOT CONSTITUTE INSTALLATION CERTIFICATION. IN ALL CASES AIRCRAFT MAINTENANCE RECORDS MUST CONTAIN AN INSTALLATION CERTIFICATION ISSUED IN ACCORDANCE WITH THE NATIONAL REGULATIONS BY THE USER/INSTALLER BEFORE THE AIRCRAFT MAY BE FLOWN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

    // Open new window and print
    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = function () {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 250);
      };
    } else {
      alert("Please allow pop-ups for this website to print the form.");
    }
  };

  // Column definitions for the table
  const columns = [
    { field: "formTrackingNumber", label: "CA Form No.", width: "180px" },
    { field: "workOrderNumber", label: "Work Order No.", width: "150px" },
    { field: "item", label: "Item", width: "80px" },
    { field: "partNo", label: "Part No.", width: "120px" },
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
              <i className="fa fa-certificate"></i>
              <span className={styles.breadcrumbLabel}>View CA Form</span>
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
                            key={report.id}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            {columns.map((column) => (
                              <td
                                key={`${report.id}-${column.field}`}
                                title={report[column.field]}
                              >
                                {report[column.field]}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnPrint}
                                  onClick={() => handlePrintClick(report)}
                                  title="Print CA Form"
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

export default ViewCAForm;