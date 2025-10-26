import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDispatchReports,
  deleteDispatchReport,
} from "../services/db_manager";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const ViewDispatchReport = () => {
  const [dispatchReports, setDispatchReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    loadDispatchReports();
  }, []);

  const loadDispatchReports = async () => {
    setLoading(true);
    try {
      const response = await getAllDispatchReports();
      if (Array.isArray(response)) {
        setDispatchReports(response);
        setFilteredReports(response);
      } else {
        console.warn("Unexpected response format:", response);
        setDispatchReports([]);
        setFilteredReports([]);
      }
    } catch (err) {
      console.error("Error fetching dispatch reports:", err);
      setError("Failed to load dispatch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchId) {
      setFilteredReports(dispatchReports);
    } else {
      const results = dispatchReports.filter((report) =>
        String(report.id).includes(searchId)
      );
      setFilteredReports(results);
      setCurrentPage(1); // reset to first page
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button
            className="page-link border-0"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  // Edit the selected dispatch report
  const editSelectedElement = async (reportId) => {
    try {
      const response = await getAllDispatchReports();
      const dispatchReportData = response.find(
        (report) => report.id === reportId
      );
      if (!dispatchReportData) {
        alert("Dispatch report not found");
        return;
      }
      navigate("/editDispatchReport", {
        state: { report: dispatchReportData },
      });
    } catch (error) {
      console.error("Error fetching material details: ", error);
      alert("Failed to fetch material details");
    }
  };

  const deleteSelectedElement = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDispatchReport(id);
        loadDispatchReports();
      } catch (err) {
        console.error("Error deleting report:", err);
        alert("Failed to delete report.");
      }
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />

        <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-3 mb-0 text-gray-800">View Dispatch Reports</h5>
          </div>
        </div>

        <div className="card shadow mx-4 my-2 p-0">
          {/* Search */}
          <div className="px-3 py-1 shadow-lg mb-1">
            <label className="form-label">Search by Report ID:</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control py-2 border-end-0 border rounded-start"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Report ID"
              />
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center py-3">Loading...</p>
          ) : (
            <div className="card p-4 shadow-lg">
              <div className="table-responsive overflow-auto px-0">
                <table
                  id="dataTable"
                  className="table border"
                  style={{
                    width: "100%",
                    tableLayout: "auto",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <thead className="position-sticky sticky-top bg-light">
                    <tr>
                      <th>Report No</th>
                      <th>Date</th>
                      <th>Part No</th>
                      <th>Part Description</th>
                      <th>Order No</th>
                      <th>Customer Name</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="24" className="text-center">
                          No dispatch reports found.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((report) => (
                        <tr key={report.id}>
                          <td>{report.reportNo}</td>
                          <td>{report.reportDate || "-"}</td>
                          <td>{report.partNo || "-"}</td>
                          <td>{report.partDescription || "-"}</td>
                          <td>{report.orderNo || "-"}</td>
                          <td>{report.customerName || "-"}</td>
                          <td>{report.quantity}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => editSelectedElement(report.id)}
                              title="Edit"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteSelectedElement(report.id)}
                              title="Delete"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              <div className="row align-items-center mt-3">
                <div className="col-md-6">
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Showing{" "}
                    <span className="fw-bold text-dark">
                      {indexOfFirstItem + 1}
                    </span>{" "}
                    to{" "}
                    <span className="fw-bold text-dark">
                      {Math.min(indexOfLastItem, filteredReports.length)}
                    </span>{" "}
                    of{" "}
                    <span className="fw-bold text-dark">
                      {filteredReports.length}
                    </span>{" "}
                    entries
                    {searchId &&
                      ` (filtered from ${dispatchReports.length} total entries)`}
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end mb-0">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(1)}
                        >
                          <i className="fa-solid fa-angles-left"></i>
                        </button>
                      </li>
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>

                      {renderPageNumbers()}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          <i className="fa-solid fa-angles-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ViewDispatchReport;
