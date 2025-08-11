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
    }
  };

  // Edit the selected dispatch report
    const editSelectedElement = async (reportId) => {
      try {
        const response = await getAllDispatchReports();
        const dispatchReportData = response.find(
          (report) => report.id === reportId
        );
        if (!dispatchReportData) {
          toast.error("Dispatch report not found");
          return;
        }
        // Navigate to the edit page with the selected report data
        // Assuming you have a route set up for editing dispatch reports
        // and the EditDispatchReport component expects the report data in state
        navigate("/editDispatchReport", {
          state: { report: dispatchReportData },
        });
      } catch (error) {
        console.error("Error fetching material details: ", error);
        toast.error("Failed to fetch material details");
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
                      <th>ID</th>
                      <th>Report No</th>
                      <th>Date</th>
                      <th>Part No</th>
                      <th>Part Description</th>
                      <th>Order No</th>
                      <th>Customer Name</th>
                      <th>Quantity</th>
                      <th>Batch No</th>
                      <th>Challan No</th>
                      <th>Challan Date</th>
                      <th>Challan Remark</th>
                      <th>Invoice No</th>
                      <th>Invoice Date</th>
                      <th>Invoice Remark</th>
                      <th>CA Form</th>
                      <th>CA Form Date</th>
                      <th>CA Form Remark</th>
                      <th>E-Way Bill</th>
                      <th>E-Way Bill Date</th>
                      <th>E-Way Bill Remark</th>
                      <th>Store In-Charge Name</th>
                      <th>Store In-Charge Sign</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan="24" className="text-center">
                          No dispatch reports found.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td>{report.id}</td>
                          <td>{report.reportNo}</td>
                          <td>{report.reportDate || "-"}</td>
                          <td>{report.partNo || "-"}</td>
                          <td>{report.partDescription || "-"}</td>
                          <td>{report.orderNo || "-"}</td>
                          <td>{report.customerName || "-"}</td>
                          <td>{report.quantity}</td>
                          <td>{report.batchNo || "-"}</td>
                          <td>{report.challanNo || "-"}</td>
                          <td>{report.challanDate || "-"}</td>
                          <td>{report.challanRemark || "-"}</td>
                          <td>{report.invoiceNo || "-"}</td>
                          <td>{report.invoiceDate || "-"}</td>
                          <td>{report.invoiceRemark || "-"}</td>
                          <td>{report.caFormDate || "-"}</td>
                          <td>{report.caFormNo || "-"}</td>
                          <td>{report.caFormRemark || "-"}</td>
                          <td>{report.ewayBill || "-"}</td>
                          <td>{report.ewayBillDate || "-"}</td>
                          <td>{report.ewayBillRemark || "-"}</td>
                          <td>{report.storesInChargeName || "-"}</td>
                          <td>{report.storesInChargeSign || "-"}</td>
                          <td>
                            <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(report.id)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                            <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    deleteSelectedElement(report.id)
                                  }
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
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ViewDispatchReport;
