import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { deletePurchaseRequisition, DownloadCSV, DownloadPDF, getPurchaseRequisitionDetail, listAllPurchaseRequisition } from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
// import styles from "./ViewPurchaseRequisition.module.css";

const ViewPurchaseRequisitionPage = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("purchaseRequisitionNo");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(false)
    try {
      const response = await listAllPurchaseRequisition();
      setTableData(response || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching purchase requisitions", error);
      toast.error("Failed to load purchase requisitions");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Delete the selected purchase requisition
  const deleteSelectedElement = async (purchaseRequisitionID) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deletePurchaseRequisition(purchaseRequisitionID);
        setTableData((prevData) =>
          prevData.filter(
            (requisition) =>
              requisition.purchaseRequisitionID !== purchaseRequisitionID
          )
        );
        toast.success("Purchase requisition deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete purchase requisition", error);
        toast.error("Failed to delete purchase requisition. Please try again.");
      }
    }
  };

  // Edit the selected purchase requisition
  const editSelectedElement = async (RequisitionID) => {
    console.log(RequisitionID,"id paraent")
    navigate("/editpurchaserequisition", {
      state: { RequisitionID },
    });
  };

  // Search functionality
  // Filter out "close" status first, then search, then date filter
  const filteredData = tableData
    .filter(requisition => requisition.status?.toLowerCase() !== 'close')
    .filter(requisition =>
      Object.values(requisition).some(
        value =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(requisition => {
      // Date filter (assuming requiredDate is in YYYY-MM-DD format)
      let matchesDate = true;
      if (startDate) {
        matchesDate =
          matchesDate &&
          requisition.requiredDate &&
          new Date(requisition.requiredDate) >= new Date(startDate);
      }
      if (endDate) {
        matchesDate =
          matchesDate &&
          requisition.requiredDate &&
          new Date(requisition.requiredDate) <= new Date(endDate);
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
    { field: "batchNumber", label: "Purchase_Req", width: "250px"},
   // { field: "id", label: "P_REQ_No", width: "100px" },
    { field: "partNumber", label: "Part Number", width: "130px" },
    { field: "description", label: "Description", width: "130px" },
    { field: "currentStock", label: "Current Stock", width: "70px" },
    { field: "requiredQty", label: "Required Qty", width: "70px" },
    { field: "requiredDate", label: "Required Date", width: "150px" },
    { field: "remark", label: "Remark", width: "100px" },
    { field: "unitOfMeasurement", label: "Unit of Measurement", width: "150px" },
    { field: "status", label: "Status", width: "100px" },
  ];

  // const handlePrintClick = () => {
  //   setTimeout(() => {
  //     window.print();
  //   }, 500);
  // };
  const handleDownloadCSV = async () => {

    try {
    const response = await DownloadCSV();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "purchase_requisitions.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("CSV file downloaded successfully!");
  } catch (error) {
    toast.error("Error downloading CSV file");
  }
    // try {
    //   const response = await DownloadCSV()
    //   if(!response.error){
    //     toast.success("CSV file download successfully.!")
    //   }
    //   // Create a URL from the file
    //   // const url = window.URL.createObjectURL(response.data);
    //   console.log(response,"urllll")

    //   // const link = document.createElement('a');
    //   // link.href = url;
    //   // link.setAttribute('download', 'data.csv');
    //   // document.body.appendChild(link);
    //   // link.click();

    //   // // Clean up
    //   // link.parentNode.removeChild(link);
    //   // window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   toast.error('Error downloading the CSV file');
    // }
  };

  const handleDownloadPDF = async () => {
    try{
    const response = await DownloadPDF();
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "purchase_requisitions.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("PDF file downloaded successfully!");
  } catch (error) {
    toast.error("Error downloading PDF file");
  }
  //   try {
  //     const response = await DownloadPDF()
  //     if(!response.error){
  //       toast.success("PDF file download successfully .!")
  //     }
  //     // const url = window.URL.createObjectURL(new Blob([response.data]));
  //     // console.log(url,"urllll")
  //     // const link = document.createElement('a');
  //     // link.href = url;
  //     // link.setAttribute('download', 'data.pdf'); // File name
  //     // document.body.appendChild(link);
  //     // link.click();
  //     // link.parentNode.removeChild(link);
  //     // window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     toast.error('Error downloading PDF');
  //   }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Purchase Requisitions" />
          
          {/* ...existing table and controls... */}
          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
            //   styles.normalViewStyle,
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
              <div className="row align-items-center">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search requisitions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3" style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <button
                    onClick={handleDownloadCSV}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Download CSV
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Download PDF
                  </button>
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
                  <div className="spinner-border text-primary" role="status">
                  </div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </div>
              ) : (
                <div
                  className="table-responsive"
                  style={{
                    overflowY: "auto",
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
                          }}
                        >
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((requisition, index) => (
                          <tr
                            key={requisition.purchaseRequisitionNo}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${requisition.purchaseRequisitionNo}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={requisition[column.field]}
                              >
                                {requisition[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(requisition.id)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    deleteSelectedElement(requisition.id)
                                  }
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                {/* <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handlePrintClick(requisition)}
                                  title="Print"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button> */}
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

export default ViewPurchaseRequisitionPage;
