import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  deleteWorkOrder,
  listOfAllWorkorderTableView,
} from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";

const WorkorderTable = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("workOrderNo");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await listOfAllWorkorderTableView();
      setTableData(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching work orders", error);
      toast.error("Failed to load work orders");
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
        await deleteWorkOrder(workOrderNo);
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

  const columns = [
    { field: "workOrderNo", label: "Work Order No", width: "140px" },
    { field: "issueDate", label: "Issue Date", width: "120px" },
    { field: "customerName", label: "Customer Name", width: "150px" },
    { field: "repairOrderNo", label: "Repair Order No", width: "180px" },
    { field: "partNumber", label: "Part Number", width: "120px" },
    { field: "qty", label: "Quantity", width: "100px" },
    { field: "description", label: "Description", width: "150px" },
    { field: "cmmRefNo", label: "CMM Ref No", width: "120px" },
    { field: "revNo", label: "Rev No", width: "100px" },
    { field: "issuedBy", label: "Issued By", width: "120px" },
    { field: "technician", label: "Technician", width: "120px" },
    { field: "totalManHour", label: "Man Hours", width: "110px" },
    { field: "actionTaken", label: "Action Taken", width: "130px" },
    { field: "toolsUsed", label: "Tools Used", width: "120px" },
    { field: "snBn", label: "SN/BN", width: "100px" },
  ];

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

  // Default work steps
  const defaultWorkSteps = [
    { srNo: 1, detail: "INCOMING INSPECTION: Visual inspection, SB compliance" },
    { srNo: 2, detail: "Test unit as per CMM" },
    { srNo: 3, detail: "Disassembly as per CMM" },
    { srNo: 4, detail: "Cleaning as per CMM" },
    { srNo: 5, detail: "Inspection/Check as per CMM" },
    { srNo: 6, detail: "Troubleshooting as per CMM" },
    { srNo: 7, detail: "Repair as per CMM" },
    { srNo: 8, detail: "Assembly as per CMM" },
    { srNo: 9, detail: "Test unit as per CMM" },
    { srNo: 10, detail: "Fits and Clearances as per CMM" },
    { srNo: 11, detail: "Final Inspection" },
  ];

  // PRINT FUNCTIONALITY - OPENS IN NEW WINDOW
  const handlePrintClick = (workOrder) => {
    console.log("Printing work order:", workOrder);
    
    const mainPartMaterialRequisition = {
      srNo: 101,
      description: workOrder.partDesc || workOrder.description || "",
      partNo: workOrder.partNo || workOrder.partNumber || "",
      snbn: workOrder.snBin || workOrder.snBn || "",
      qty: workOrder.qty || "",
      remarks: workOrder.remarks || workOrder.workshopManagerRemarks || "Main part from order",
    };

    const processedWorkOrder = {
      ...workOrder,
      materialRequisitions: workOrder.materialRequisitions || 
                           workOrder.partsUsed || 
                           [mainPartMaterialRequisition],
      workOrderSteps: workOrder.workOrderSteps || workOrder.workDetails || [],
    };

    // Generate print HTML
    const printHTML = generatePrintHTML(processedWorkOrder);
    
    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      // Optional: close window after printing
      // printWindow.close();
    };
  };

  // Generate HTML for printing
  const generatePrintHTML = (workOrderData) => {
    const workSteps = workOrderData.workOrderSteps?.length > 0
      ? workOrderData.workOrderSteps
      : defaultWorkSteps;

    const materialRequisitions = workOrderData.materialRequisitions || [];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Work Order - ${workOrderData.workOrderNo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 7pt;
      padding: 20px;
      background: white;
      color: black;
    }
    
    @media print {
      body {
        padding: 10px;
      }
      
      @page {
        size: A4;
        margin: 10mm;
      }
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    table td, table th {
      border: 1px solid black;
      padding: 8px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid black;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    
    .header h1 {
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 2px;
      text-align: center;
      flex: 1;
    }
    
    .header-info {
      text-align: right;
      font-size: 7pt;
      line-height: 1.3;
    }
    
    .section-title {
      background-color: #e0e0e0;
      padding: 8px;
      border: 1px solid black;
      font-weight: bold;
      font-size: 9pt;
      margin-top: 15px;
      margin-bottom: 5px;
    }
    
    .info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border: 1px solid black;
      margin-bottom: 15px;
    }
    
    .info-row strong {
      font-weight: bold;
    }
    
    .signature-section {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-top: 15px;
    }
    
    .signature-box {
      flex: 1;
      text-align: center;
      border: 1px solid black;
      padding: 10px;
      min-height: 80px;
    }
    
    .signature-box .title {
      font-weight: bold;
      font-size: 8pt;
      margin-bottom: 30px;
    }
    
    .signature-box .date {
      font-size: 7pt;
      margin-top: 10px;
    }
    
    .certification {
      padding: 10px;
      border: 1px solid black;
      font-size: 7pt;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    
    .certification p {
      margin-bottom: 10px;
    }
    
    .certification .highlight {
      text-align: center;
      font-weight: bold;
      margin-top: 10px;
      padding: 8px;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>WORKORDER</h1>
    <div class="header-info">
      <div>Form: AMC 7A</div>
      <div>Rev: 01</div>
      <div>Date: ${formatDate(new Date())}</div>
    </div>
  </div>

  <!-- Work Order Details -->
  <table style="margin-bottom: 15px; font-size: 7pt;">
    <tbody>
      <tr>
        <td style="font-weight: bold; background-color: #f0f0f0; width: 12%;">WO#:</td>
        <td style="width: 21%;">${workOrderData.workOrderNo || ""}</td>
        <td style="font-weight: bold; background-color: #f0f0f0; width: 12%;">RO#:</td>
        <td style="width: 21%;">${workOrderData.repairOrderNo || ""}</td>
        <td style="font-weight: bold; background-color: #f0f0f0; width: 12%;">Date:</td>
        <td style="width: 22%;">${formatDate(workOrderData.issueDate)}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f0f0f0;">Customer:</td>
        <td colspan="3">${workOrderData.customerName || ""}</td>
        <td style="font-weight: bold; background-color: #f0f0f0;">Qty:</td>
        <td>${workOrderData.qty || ""}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f0f0f0;">Desc:</td>
        <td colspan="5">${workOrderData.description || ""}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f0f0f0;">S/N:</td>
        <td>${workOrderData.snBn || ""}</td>
        <td style="font-weight: bold; background-color: #f0f0f0;">CMM:</td>
        <td>${workOrderData.cmmRefNo || ""}</td>
        <td style="font-weight: bold; background-color: #f0f0f0;">Rev:</td>
        <td>${workOrderData.revNo || ""}</td>
      </tr>
    </tbody>
  </table>

  <!-- Issued By -->
  <div class="info-row">
    <strong>Issued By:</strong>
    <span>${workOrderData.issuedBy || ""}</span>
  </div>

  <!-- Work Details -->
  <table style="margin-bottom: 15px; font-size: 7pt;">
    <thead>
      <tr>
        <th style="background-color: #e0e0e0; width: 5%; text-align: center;">No.</th>
        <th style="background-color: #e0e0e0; width: 55%; text-align: center;">Work Done</th>
        <th style="background-color: #e0e0e0; width: 20%; text-align: center;">Tech Sign</th>
        <th style="background-color: #e0e0e0; width: 20%; text-align: center;">Staff Sign</th>
      </tr>
    </thead>
    <tbody>
      ${workSteps.map((step, index) => `
        <tr>
          <td style="text-align: center;">${step.srNo || step.stepNo || index + 1}</td>
          <td>${step.detail || step.detailOfWorkDone || ""}</td>
          <td>${step.technicianSign || ""}</td>
          <td>${step.certifyingStaffSign || ""}</td>
        </tr>
      `).join('')}
      <tr>
        <td colspan="4"><strong>Action:</strong> ${workOrderData.actionTaken || ""}</td>
      </tr>
    </tbody>
  </table>

  <!-- Material Requisition -->
  <div class="section-title">Material Requisition</div>
  <table style="margin-bottom: 15px; font-size: 7pt;">
    <thead>
      <tr>
        <th style="background-color: #e0e0e0; width: 8%; text-align: center;">No.</th>
        <th style="background-color: #e0e0e0; width: 35%; text-align: center;">Description</th>
        <th style="background-color: #e0e0e0; width: 20%; text-align: center;">Part No.</th>
        <th style="background-color: #e0e0e0; width: 15%; text-align: center;">S/N</th>
        <th style="background-color: #e0e0e0; width: 8%; text-align: center;">Qty</th>
        <th style="background-color: #e0e0e0; width: 14%; text-align: center;">Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${materialRequisitions.length > 0 ? 
        materialRequisitions.map((item, idx) => `
          <tr>
            <td style="text-align: center;">${item.srNo || idx + 1}</td>
            <td>${item.description || ""}</td>
            <td>${item.partNo || ""}</td>
            <td>${item.snbn || ""}</td>
            <td style="text-align: center;">${item.qty || ""}</td>
            <td>${item.remarks || ""}</td>
          </tr>
        `).join('') :
        Array.from({ length: 3 }, (_, idx) => `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td style="height: 25px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `).join('')
      }
    </tbody>
  </table>

  <!-- Tools Section -->
  <div style="display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid black; margin-bottom: 15px; font-size: 7pt;">
    <strong>Tools:</strong>
    <span style="flex: 1; border-bottom: 1px solid black; min-height: 20px;">${workOrderData.toolsUsed || ""}</span>
    <strong>Tech:</strong>
    <span style="flex: 1; border-bottom: 1px solid black; min-height: 20px;">${workOrderData.technician || ""}</span>
    <strong>Hours:</strong>
    <span style="border-bottom: 1px solid black; min-width: 50px;">${workOrderData.totalManHour || ""}</span>
  </div>

  <!-- Certification -->
  <div class="certification">
    <p>Certified: Task completed per CMM ref, meets DGCA requirements, ready for release per CAR 145.50</p>
    <div class="highlight">All Documents Scrutinized & Verified</div>
  </div>

  <!-- Signatures -->
  <div class="signature-section">
    <div class="signature-box">
      <div class="title">Workshop Manager</div>
      <div class="date">Date & Sign: ${formatDate(workOrderData.workshopManagerSignDate)}</div>
    </div>
    <div class="signature-box">
      <div class="title">Quality Manager</div>
      <div class="date">Date & Sign: ${formatDate(workOrderData.qualityManagerSignDate)}</div>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View All Work Orders" />

          {/* Normal View */}
          <div className="card border-0 shadow-lg mx-4 my-4 rounded-3">
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
                      placeholder="Search work orders..."
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
                  <div className="spinner-border text-primary" role="status"></div>
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
                                <i className={`ms-1 fa fa-sort-${sortDirection === "asc" ? "up" : "down"} text-primary`}></i>
                              ) : (
                                <i className="ms-1 fa fa-sort text-muted opacity-50" style={{ fontSize: "0.8rem" }}></i>
                              )}
                            </div>
                          </th>
                        ))}
                        <th
                          className="position-sticky top-0 bg-light py-3 text-center"
                          style={{
                            width: "150px",
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
                        currentItems.map((workOrder, index) => (
                          <tr
                            key={workOrder.workOrderNo || index}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${workOrder.workOrderNo || index}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={workOrder[column.field]}
                              >
                                {column.field === "issueDate" ||
                                column.field === "qualityManagerSignDate" ||
                                column.field === "workshopManagerSignDate"
                                  ? formatDate(workOrder[column.field])
                                  : column.field === "description"
                                  ? formatText(workOrder[column.field], 20)
                                  : column.field === "actionTaken"
                                  ? formatText(workOrder[column.field], 15)
                                  : column.field === "toolsUsed"
                                  ? formatText(workOrder[column.field], 15)
                                  : column.field === "workshopManagerRemarks"
                                  ? formatText(workOrder[column.field], 15)
                                  : workOrder[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => editSelectedElement(workOrder.workOrderNo)}
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteSelectedElement(workOrder.workOrderNo)}
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handlePrintClick(workOrder)}
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
                          <td colSpan={columns.length + 1} className="text-center py-5">
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x text-muted mb-3"></i>
                                <p className="mb-0">No matching records found</p>
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
                    Showing <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="fw-bold text-dark">{Math.min(indexOfLastItem, sortedData.length)}</span> of{" "}
                    <span className="fw-bold text-dark">{sortedData.length}</span> entries
                    {searchTerm && ` (filtered from ${tableData.length} total entries)`}
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link border-0" onClick={() => setCurrentPage(1)} aria-label="First page">
                          <i className="fa-solid fa-angles-left"></i>
                        </button>
                      </li>
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link border-0" onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous page">
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>
                      {renderPageNumbers()}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link border-0" onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next page">
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link border-0" onClick={() => setCurrentPage(totalPages)} aria-label="Last page">
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

export default WorkorderTable;