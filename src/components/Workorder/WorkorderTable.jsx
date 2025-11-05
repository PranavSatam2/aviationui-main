import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  deletePurchaseOrder,
  listOfAllWorkorderTable,
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
  const [workOrderData, setWorkOrderData] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await listOfAllWorkorderTable();
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
        await deletePurchaseOrder(workOrderNo);
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

  // PRINT FUNCTIONALITY - FIXED to properly sync Material Requisition data
  const handlePrintClick = (workOrder) => {
    console.log("Printing work order:", workOrder);
    
    // Process the work order data similar to EditWorkorder
    // Create material requisition from main part data if needed
    const mainPartMaterialRequisition = {
      srNo: 101,
      description: workOrder.partDesc || workOrder.description || "",
      partNo: workOrder.partNo || workOrder.partNumber || "",
      snbn: workOrder.snBin || workOrder.snBn || "",
      qty: workOrder.qty || "",
      remarks: workOrder.remarks || workOrder.workshopManagerRemarks || "Main part from order",
    };

    // Handle material requisitions with proper fallbacks (like in EditWorkorder)
    const processedWorkOrder = {
      ...workOrder,
      materialRequisitions: workOrder.materialRequisitions || 
                           workOrder.partsUsed || 
                           [mainPartMaterialRequisition],
      // Ensure work order steps are properly formatted
      workOrderSteps: workOrder.workOrderSteps || workOrder.workDetails || [],
    };

    console.log("Processed work order with material requisitions:", processedWorkOrder.materialRequisitions);
    
    setWorkOrderData(processedWorkOrder);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Default work steps - condensed version
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

  // Render Print Component - OPTIMIZED FOR SINGLE PAGE
  const PrintWorkOrder = () => {
    if (!workOrderData) return null;

    const workSteps =
      workOrderData.workOrderSteps?.length > 0
        ? workOrderData.workOrderSteps
        : defaultWorkSteps;

    // Get material requisitions with proper handling
    const materialRequisitions = workOrderData.materialRequisitions || [];
    
    console.log("Rendering material requisitions in print:", materialRequisitions);

    return (
      <div
        id="printWorkOrder"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "7pt",
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          padding: 0,
          backgroundColor: "white",
          color: "black",
        }}
      >
        {/* Header - Compact */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid black",
            paddingBottom: "9px",
            marginBottom: "5px",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <h1
              style={{
                fontSize: "14pt",
                fontWeight: "bold",
                margin: 5,
                letterSpacing: "1px",
                color: "black",
              }}
            >
              WORKORDER
            </h1>
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "6pt",
              lineHeight: 1.2,
              color: "black",
            }}
          >
            <div>Form: AMC 7A</div>
            <div>Rev: 01</div>
            <div>Date: {formatDate(new Date())}</div>
          </div>
        </div>

        {/* Work Order Details Table - Compact */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "6pt",
            marginBottom: "10px",
            border: "1px solid black",
          }}
        >
          <tbody>
            <tr>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>WO#:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.workOrderNo || ""}</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>RO#:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.repairOrderNo || ""}</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>Date:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{formatDate(workOrderData.issueDate)}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>Customer:</td>
              <td colSpan="3" style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.customerName || ""}</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>Qty:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.qty || ""}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>Desc:</td>
              <td colSpan="5" style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.description || ""}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>S/N:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.snBn || ""}</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>CMM:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.cmmRefNo || ""}</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", fontWeight: "bold", backgroundColor: "#f0f0f0", color: "black" }}>Rev:</td>
              <td style={{ border: "1px solid black", padding: "7px 9px", color: "black" }}>{workOrderData.revNo || ""}</td>
            </tr>
          </tbody>
        </table>

        {/* Issued By - Compact */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "9px", padding: "7px", border: "1px solid black", fontSize: "6pt", backgroundColor: "white", color: "black" }}>
          <span style={{ fontWeight: "bold" }}>Issued By:</span>
          <span>{workOrderData.issuedBy || ""}</span>
        </div>

        {/* Work Details Table - Very Compact */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "6pt", marginBottom: "9px", border: "1px solid black" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "5%", color: "black" }}>No.</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "55%", color: "black" }}>Work Done</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "20%", color: "black" }}>Tech Sign</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "20%", color: "black" }}>Staff Sign</th>
            </tr>
          </thead>
          <tbody>
            {workSteps.map((step, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "7px", textAlign: "center", backgroundColor: "white", color: "black" }}>
                  {step.srNo || step.stepNo || index + 1}
                </td>
                <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                  {step.detail || step.detailOfWorkDone || ""}
                </td>
                <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                  {step.technicianSign || ""}
                </td>
                <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                  {step.certifyingStaffSign || ""}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                <strong>Action:</strong> {workOrderData.actionTaken || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Material Requisition - Compact - FIXED DATA SYNC */}
        <div style={{ backgroundColor: "#e0e0e0", padding: "10px", border: "1px solid black", fontWeight: "bold", fontSize: "16px", marginBottom: 0, color: "black" }}>
          Material Requisition
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "6pt", marginBottom: "9px", border: "1px solid black" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "8%", color: "black" }}>No.</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "35%", color: "black" }}>Description</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "20%", color: "black" }}>Part No.</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "15%", color: "black" }}>S/N</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "8%", color: "black" }}>Qty</th>
              <th style={{ border: "1px solid black", padding: "7px", backgroundColor: "#e0e0e0", textAlign: "center", width: "14%", color: "black" }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {materialRequisitions.length > 0 ? (
              // If we have material requisitions, show them
              materialRequisitions.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid black", padding: "7px", textAlign: "center", backgroundColor: "white", color: "black" }}>
                    {item.srNo || idx + 1}
                  </td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                    {item.description || ""}
                  </td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                    {item.partNo || ""}
                  </td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                    {item.snbn || ""}
                  </td>
                  <td style={{ border: "1px solid black", padding: "7px", textAlign: "center", backgroundColor: "white", color: "black" }}>
                    {item.qty || ""}
                  </td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}>
                    {item.remarks || ""}
                  </td>
                </tr>
              ))
            ) : (
              // If no material requisitions, show 3 empty rows
              Array.from({ length: 3 }, (_, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid black", padding: "7px", textAlign: "center", backgroundColor: "white", color: "black" }}>
                    {idx + 1}
                  </td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}></td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}></td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}></td>
                  <td style={{ border: "1px solid black", padding: "7px", textAlign: "center", backgroundColor: "white", color: "black" }}></td>
                  <td style={{ border: "1px solid black", padding: "7px", backgroundColor: "white", color: "black" }}></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Tools Section - Compact */}
        <div style={{ fontSize: "6pt", marginBottom: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px", border: "1px solid black", backgroundColor: "white", color: "black" }}>
            <span style={{ fontWeight: "bold" }}>Tools:</span>
            <span style={{ flex: 1, borderBottom: "1px solid black" }}>{workOrderData.toolsUsed || ""}</span>
            <span style={{ fontWeight: "bold" }}>Tech:</span>
            <span style={{ flex: 1, borderBottom: "1px solid black" }}>{workOrderData.technician || ""}</span>
            <span style={{ fontWeight: "bold" }}>Hours:</span>
            <span style={{ borderBottom: "1px solid black", minWidth: "30px" }}>{workOrderData.totalManHour || ""}</span>
          </div>
        </div>

        {/* Certification - Compact */}
        <div style={{ marginBottom: "9px", padding: "9px", border: "1px solid black", fontSize: "6pt", lineHeight: 1.3, backgroundColor: "white", color: "black" }}>
          <p style={{ margin: 0 }}>
            Certified: Task completed per CMM ref, meets DGCA requirements, ready for release per CAR 145.50
          </p>
          <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "7px", padding: "7px", backgroundColor: "#f0f0f0", color: "black" }}>
            All Documents Scrutinized & Verified
          </div>
        </div>

        {/* Signatures - Compact */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ flex: 1, textAlign: "center", border: "1px solid black", padding: "5px", backgroundColor: "white", color: "black" }}>
            <div style={{ fontWeight: "bold", fontSize: "7pt", marginBottom: "10px" }}>Workshop Manager</div>
            <div style={{ fontSize: "6pt", marginTop: "5px" }}>Date & Sign: {formatDate(workOrderData.workshopManagerSignDate)}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", border: "1px solid black", padding: "5px", backgroundColor: "white", color: "black" }}>
            <div style={{ fontWeight: "bold", fontSize: "7pt", marginBottom: "10px" }}>Quality Manager</div>
            <div style={{ fontSize: "6pt", marginTop: "5px" }}>Date & Sign: {formatDate(workOrderData.qualityManagerSignDate)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View All Work Orders" />

          {/* Print View */}
          <div className="printView">
            <PrintWorkOrder />
          </div>

          {/* Normal View */}
          <div className="normalView card border-0 shadow-lg mx-4 my-4 rounded-3">
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