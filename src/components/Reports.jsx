import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import {
  getReportEntities,
  getReportColumns,
  generateReportPreview,
  downloadReportCSV,
  downloadReportExcel,
} from "../services/db_manager";
import styles from "./Reports.module.css";

const Reports = () => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [availableColumns, setAvailableColumns] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchColumn, setSearchColumn] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  // const [dateField, setDateField] = useState("");
  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    if (selectedEntity) {
      fetchColumns(selectedEntity);
      setReportData([]);
      setShowPreview(false);
      setSelectedColumns([]);
      setDateFrom("");
      setDateTo("");
      // setDateField("");
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
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((c) => c !== columnKey)
        : [...prev, columnKey],
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
        filter: {
            Rflag: filterActive ? 0 : 1,
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
          },
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
  filter: {
    Rflag: filterActive ? 0 : 1,
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  },
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

  const filteredColumns = Object.entries(availableColumns).filter(
    ([key, value]) =>
      value.toLowerCase().includes(searchColumn.toLowerCase()) ||
      key.toLowerCase().includes(searchColumn.toLowerCase()),
  );

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
          className={`${styles.pageItem} ${currentPage === i ? styles.active : ""}`}
        >
          <button className={styles.pageLink} onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-chart-bar"></i>
              <span className={styles.breadcrumbLabel}>
                Dynamic Report Generator
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Step 1: Component Selection */}
              <div className={styles.stepHeader}>
                <span className={styles.stepBadge}>1</span>
                <h5 className={styles.stepTitle}>Select Component</h5>
              </div>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className={styles.select}
              >
                <option value="">-- Choose Component --</option>
                {entities.map((entity) => (
                  <option key={entity} value={entity}>
                    {entity}
                  </option>
                ))}
              </select>

              {/* Step 2: Column Selection */}
              {selectedEntity && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.stepHeader}>
                    <span className={styles.stepBadge}>2</span>
                    <h5 className={styles.stepTitle}>
                      Select Columns from {selectedEntity}
                    </h5>
                  </div>

                  <div className={styles.sectionControls}>
                    <div className={styles.controlsLeft}></div>
                    <div className={styles.controlsRight}>
                      <button
                        onClick={handleSelectAll}
                        className={styles.btnSelectAll}
                      >
                        <i
                          className={`fa ${selectedColumns.length === Object.keys(availableColumns).length ? "fa-check-square" : "fa-square"}`}
                        ></i>
                        <span>
                          {selectedColumns.length ===
                          Object.keys(availableColumns).length
                            ? "Deselect All"
                            : "Select All"}
                        </span>
                      </button>
                      <span className={styles.selectedBadge}>
                        {selectedColumns.length} Selected
                      </span>
                    </div>
                  </div>

                  {/* Search Columns */}
                  <div className={styles.searchBox}>
                    <i className="fa fa-search"></i>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Search columns..."
                      value={searchColumn}
                      onChange={(e) => setSearchColumn(e.target.value)}
                    />
                  </div>

                  {/* Column Grid */}
                  <div className={styles.columnGrid}>
                    {filteredColumns.map(([key, displayName]) => (
                      <div
                        key={key}
                        className={`${styles.columnCard} ${
                          selectedColumns.includes(key)
                            ? styles.columnCardSelected
                            : ""
                        }`}
                        onClick={() => handleColumnToggle(key)}
                      >
                        <div className={styles.columnCheckbox}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedColumns.includes(key)}
                              onChange={() => handleColumnToggle(key)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <label className={styles.columnLabel}>
                              {displayName}
                            </label>
                          </div>
                          <div className={styles.columnKey}>{key}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredColumns.length === 0 && (
                    <div className={styles.noResults}>
                      <i className="fa fa-search fa-2x"></i>
                      <p>No columns found matching "{searchColumn}"</p>
                    </div>
                  )}
                </>
              )}
              {selectedEntity && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.stepHeader}>
                    <span className={styles.stepBadge}>3</span>
                    <h5 className={styles.stepTitle}>
                      Select Date Range (Optional)
                    </h5>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                      alignItems: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      {/* <label style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                        Date Field
                      </label>
                      <select
                        value={dateField}
                        onChange={(e) => setDateField(e.target.value)}
                        className={styles.select}
                        style={{ minWidth: "180px" }}
                      >
                        <option value="">-- Select Date Field --</option>
                        {selectedColumns
                          .filter(
                            (col) =>
                              col.toLowerCase().includes("date") ||
                              col.toLowerCase().includes("time"),
                          )
                          .map((col) => (
                            <option key={col} value={col}>
                              {availableColumns[col] || col}
                            </option>
                          ))}
                        {/* Fallback: show all selected columns */}
                        {/* {selectedColumns
                          .filter(
                            (col) =>
                              !col.toLowerCase().includes("date") &&
                              !col.toLowerCase().includes("time"),
                          )
                          .map((col) => (
                            <option key={col} value={col}>
                              {availableColumns[col] || col}
                            </option>
                          ))}
                      </select> */}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className={styles.searchInput}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        min={dateFrom}
                        className={styles.searchInput}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>

                    {(dateFrom || dateTo ) && (
                      <button
                        onClick={() => {
                          setDateFrom("");
                          setDateTo("");
                          // setDateField("");
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          background: "#f8f9fa",
                          cursor: "pointer",
                          height: "fit-content",
                        }}
                      >
                        <i className="fa fa-times"></i> Clear Dates
                      </button>
                    )}
                  </div>
                </>
              )}
              {/* Step 3: Filter and Actions */}
              {selectedEntity && selectedColumns.length > 0 && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.stepHeader}>
                    <span className={styles.stepBadge}>4</span>
                    <h5 className={styles.stepTitle}>
                      Filter & Generate Report
                    </h5>
                  </div>

                  <div className={styles.actionButtons}>
                    <button
                      onClick={generatePreview}
                      disabled={loading}
                      className={styles.btnPreview}
                    >
                      <i className="fa fa-eye"></i>
                      <span>{loading ? "Loading..." : "Preview Report"}</span>
                    </button>
                    <button
                      onClick={() => downloadReport("csv")}
                      disabled={loading}
                      className={styles.btnDownloadCSV}
                    >
                      <i className="fa fa-download"></i>
                      <span>Download CSV</span>
                    </button>
                    <button
                      onClick={() => downloadReport("excel")}
                      disabled={loading}
                      className={styles.btnDownloadExcel}
                    >
                      <i className="fa fa-file-excel"></i>
                      <span>Download Excel</span>
                    </button>
                  </div>
                </>
              )}

              {/* Preview Table */}
              {showPreview && reportData.length > 0 && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                      <h5 className={styles.tableTitle}>
                        <i className="fa fa-table"></i>
                        <span>Report Preview</span>
                      </h5>
                      <div className={styles.entriesSelector}>
                        <label className={styles.label}>Show</label>
                        <select
                          className={styles.selectSmall}
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
                        <label className={styles.label}>entries</label>
                      </div>
                    </div>

                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            {selectedColumns.map((col) => (
                              <th key={col}>{availableColumns[col]}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((row, idx) => (
                            <tr key={idx}>
                              {selectedColumns.map((col) => (
                                <td
                                  key={col}
                                  title={
                                    row[col] != null ? String(row[col]) : ""
                                  }
                                >
                                  {row[col] != null ? String(row[col]) : "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className={styles.paginationRow}>
                      <div className={styles.paginationInfo}>
                        Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                        <strong>
                          {Math.min(indexOfLastItem, reportData.length)}
                        </strong>{" "}
                        of <strong>{reportData.length}</strong> entries
                      </div>
                      <nav>
                        <ul className={styles.pagination}>
                          <li
                            className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ""}`}
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
                            className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ""}`}
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
                            className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ""}`}
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
                            className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ""}`}
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
                </>
              )}

              {/* No Component Selected */}
              {!selectedEntity && (
                <div className={styles.emptyState}>
                  <i className="fa fa-chart-bar"></i>
                  <h5>No Component Selected</h5>
                  <p>Please select a component to start generating reports</p>
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
