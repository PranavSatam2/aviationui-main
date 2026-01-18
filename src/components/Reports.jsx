import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { toast } from "react-toastify";
import {
  getReportEntities,
  getReportColumns,
  generateReportPreview,
  downloadReportCSV,
  downloadReportExcel
} from "../services/db_manager"; // adjust path if required


const Reports = () => {
  // State
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [availableColumns, setAvailableColumns] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchColumn, setSearchColumn] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load available entities on mount
  useEffect(() => {
    fetchEntities();
  }, []);

  // Load columns when entity changes
  useEffect(() => {
    if (selectedEntity) {
      fetchColumns(selectedEntity);
      setReportData([]);
      setShowPreview(false);
      setSelectedColumns([]);
    }
  }, [selectedEntity]);

  const fetchEntities = async () => {
  try {
    const data = await getReportEntities();
    setEntities(data);
  } catch (err) {
    toast.error("Failed to load entities");
  }
};


  const fetchColumns = async (entityName) => {
  try {
    setLoading(true);
    const data = await getReportColumns(entityName);
    setAvailableColumns(data);
  } catch (err) {
    toast.error("Failed to load columns");
  } finally {
    setLoading(false);
  }
};


  const handleColumnToggle = (columnKey) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(c => c !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAll = () => {
    if (selectedColumns.length === Object.keys(availableColumns).length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(Object.keys(availableColumns));
    }
  };

  const generatePreview = async () => {
  if (selectedColumns.length === 0) {
    toast.error("Please select at least one column");
    return;
  }

  try {
    setLoading(true);

    const result = await generateReportPreview({
      entityName: selectedEntity,
      columns: selectedColumns,
      filter: filterActive ? { flag: 0 } : null
    });

    setReportData(result.data || []);
    setShowPreview(true);
    setCurrentPage(1);

    toast.success(`Report generated with ${result.totalRecords} records`);
  } catch (err) {
    toast.error("Failed to generate preview");
  } finally {
    setLoading(false);
  }
};


  const downloadReport = async (format) => {
  if (selectedColumns.length === 0) {
    toast.error("Please select at least one column");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      entityName: selectedEntity,
      columns: selectedColumns,
      filter: filterActive ? { flag: 0 } : null
    };

    const response =
      format === "csv"
        ? await downloadReportCSV(payload)
        : await downloadReportExcel(payload);

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedEntity}_Report_${Date.now()}.${
      format === "csv" ? "csv" : "xlsx"
    }`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success(`${format.toUpperCase()} downloaded successfully`);
  } catch (err) {
    toast.error("Failed to download report");
  } finally {
    setLoading(false);
  }
};


  const filteredColumns = Object.entries(availableColumns).filter(([key, value]) =>
    value.toLowerCase().includes(searchColumn.toLowerCase()) ||
    key.toLowerCase().includes(searchColumn.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reportData.length / itemsPerPage);

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

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Dynamic Report Generator" />

          <div className="card border-0 shadow-lg mx-4 my-4 rounded-3">
            <div className="card-body">
              {/* Step 1: Component Selection */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <h5 className="fw-semibold mb-3">
                    <span className="badge bg-primary me-2">1</span>
                    Select Component
                  </h5>
                  <select
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="form-select"
                  >
                    <option value="">-- Choose Component --</option>
                    {entities.map(entity => (
                      <option key={entity} value={entity}>{entity}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Column Selection */}
              {selectedEntity && (
                <>
                  <hr className="my-4" />
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold mb-0">
                          <span className="badge bg-primary me-2">2</span>
                          Select Columns from {selectedEntity}
                        </h5>
                        <div className="d-flex gap-2">
                          <button
                            onClick={handleSelectAll}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className={`fa ${selectedColumns.length === Object.keys(availableColumns).length ? 'fa-square-check' : 'fa-square'} me-1`}></i>
                            {selectedColumns.length === Object.keys(availableColumns).length ? 'Deselect All' : 'Select All'}
                          </button>
                          <span className="badge bg-info text-white align-self-center">
                            {selectedColumns.length} Selected
                          </span>
                        </div>
                      </div>

                      {/* Search Columns */}
                      <div className="mb-3">
                        <div className="input-group">
                          <span className="input-group-text bg-primary text-white border-0">
                            <i className="fa fa-search"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Search columns..."
                            value={searchColumn}
                            onChange={(e) => setSearchColumn(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Column Grid */}
                      <div 
                        className="row g-3" 
                        style={{ 
                          maxHeight: '400px', 
                          overflowY: 'auto',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#ccc transparent'
                        }}
                      >
                        {filteredColumns.map(([key, displayName]) => (
                          <div key={key} className="col-md-6 col-lg-4">
                            <div
                              className={`border rounded p-3 cursor-pointer ${
                                selectedColumns.includes(key)
                                  ? 'border-primary bg-primary bg-opacity-10'
                                  : 'border-secondary bg-light'
                              }`}
                              onClick={() => handleColumnToggle(key)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedColumns.includes(key)}
                                  onChange={() => handleColumnToggle(key)}
                                />
                                <label className="form-check-label fw-semibold">
                                  {displayName}
                                </label>
                                <div className="text-muted small">{key}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {filteredColumns.length === 0 && (
                        <div className="text-center text-muted py-4">
                          <i className="fa fa-search fa-2x mb-3"></i>
                          <p>No columns found matching "{searchColumn}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Filter and Actions */}
              {selectedEntity && selectedColumns.length > 0 && (
                <>
                  <hr className="my-4" />
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <h5 className="fw-semibold mb-3">
                        <span className="badge bg-primary me-2">3</span>
                        Filter & Generate Report
                      </h5>
                      
                      {/* Filter Options */}
                      {/* <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={filterActive}
                            onChange={(e) => setFilterActive(e.target.checked)}
                            id="filterActiveCheck"
                          />
                          <label className="form-check-label" htmlFor="filterActiveCheck">
                            Show only active records (flag = 0)
                          </label>
                        </div>
                      </div> */}

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          onClick={generatePreview}
                          disabled={loading}
                          className="btn btn-primary"
                        >
                          <i className="fa fa-eye me-2"></i>
                          {loading ? 'Loading...' : 'Preview Report'}
                        </button>
                        <button
                          onClick={() => downloadReport('csv')}
                          disabled={loading}
                          className="btn btn-success"
                        >
                          <i className="fa fa-download me-2"></i>
                          Download CSV
                        </button>
                        <button
                          onClick={() => downloadReport('excel')}
                          disabled={loading}
                          className="btn btn-info text-white"
                        >
                          <i className="fa fa-file-excel me-2"></i>
                          Download Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Preview Table */}
              {showPreview && reportData.length > 0 && (
                <>
                  <hr className="my-4" />
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold">
                          <i className="fa fa-table me-2 text-primary"></i>
                          Report Preview
                        </h5>
                        <div className="d-flex align-items-center">
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
                          </select>
                          <label className="ms-2 text-muted fw-light">entries</label>
                        </div>
                      </div>

                      <div
                        className="table-responsive"
                        style={{
                          maxHeight: '500px',
                          overflowY: 'auto',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#ccc transparent'
                        }}
                      >
                        <table className="table table-hover table-striped align-middle">
                          <thead>
                            <tr className="bg-light">
                              {selectedColumns.map(col => (
                                <th
                                  key={col}
                                  className="position-sticky top-0 bg-light py-3"
                                  style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}
                                >
                                  {availableColumns[col]}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.map((row, idx) => (
                              <tr
                                key={idx}
                                className={idx % 2 === 0 ? 'bg-white' : 'bg-light bg-opacity-50'}
                              >
                                {selectedColumns.map(col => (
                                  <td
                                    key={col}
                                    className="text-nowrap py-3"
                                    style={{
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                    title={row[col] != null ? String(row[col]) : ''}
                                  >
                                    {row[col] != null ? String(row[col]) : '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="row mt-4 align-items-center">
                        <div className="col-md-6">
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Showing{' '}
                            <span className="fw-bold text-dark">
                              {indexOfFirstItem + 1}
                            </span>{' '}
                            to{' '}
                            <span className="fw-bold text-dark">
                              {Math.min(indexOfLastItem, reportData.length)}
                            </span>{' '}
                            of{' '}
                            <span className="fw-bold text-dark">
                              {reportData.length}
                            </span>{' '}
                            entries
                          </p>
                        </div>
                        <div className="col-md-6">
                          <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-end mb-0">
                              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                  className="page-link border-0"
                                  onClick={() => setCurrentPage(1)}
                                  aria-label="First page"
                                >
                                  <i className="fa-solid fa-angles-left"></i>
                                </button>
                              </li>
                              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                  className="page-link border-0"
                                  onClick={() => setCurrentPage(currentPage - 1)}
                                  aria-label="Previous page"
                                >
                                  <i className="fa-solid fa-angle-left"></i>
                                </button>
                              </li>

                              {renderPageNumbers()}

                              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                  className="page-link border-0"
                                  onClick={() => setCurrentPage(currentPage + 1)}
                                  aria-label="Next page"
                                >
                                  <i className="fa-solid fa-angle-right"></i>
                                </button>
                              </li>
                              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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
                </>
              )}

              {/* No Component Selected */}
              {!selectedEntity && (
                <div className="text-center py-5">
                  <i className="fa fa-file-alt fa-4x text-muted mb-3"></i>
                  <h5 className="text-muted">No Component Selected</h5>
                  <p className="text-muted">Please select a component to start generating reports</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Reports;