import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import {
  deleteSupplier,
  getSupplierDetail,
  listAllSupplier,
  getpendingAllSupplier,
  ApproveSupplier,
  getEditingSupplierList,
} from "../../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { Modal, Button, Form } from "react-bootstrap";
import { PrintableGeneralTab } from "../CheckerSupplierRegistration/PrintSupplierReg";
import styles from "./EditSupplierTable.module.css";

const EditSupplierTable = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [selecteSupplierData, setSelecteSupplierData] = useState();
  const [selectAll, setSelectAll] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remark, setRemark] = useState("");
  const [supplierData, setSupplierData] = useState();

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getEditingSupplierList();
      if (response) {
        setTableData(response);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (supplier) => {
    if (selectedItem === supplier.supplierId) {
      setSelectedItem("");
    } else {
      setSelectedItem(supplier.supplierId);
      setSelecteSupplierData(supplier);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItem("");
    } else {
      if (currentItems.length > 0) {
        const firstItemId = currentItems[0].formId;
        setSelectedItem(firstItemId);
      }
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  const deleteSelectedElement = async (elementId) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const response = await deleteSupplier(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((supplier) => supplier.formId !== elementId)
          );
          toast.success("Supplier deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete supplier", error);
        toast.error("Failed to delete supplier. Please try again.");
      }
    }
  };

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let supplierId = elementId;
        let supplierData = await getSupplierDetail(elementId);
        supplierData = supplierData.data;
        if (supplierId !== null) {
          navigate("/editsupplierform", {
            state: { supplierId, supplierData },
          });
        }
      } catch (error) {
        console.error("Error fetching supplier details: ", error);
        toast.error("Failed to fetch supplier details");
      }
    }
  };

  const handleOpenModal = (type) => {
    if (!selectedItem) {
      toast.warning("Please select a supplier");
      return;
    }
    setActionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRemark("");
  };

  const handleSubmitAction = async () => {
    const action = actionType === "accept" ? "accepted" : "rejected";
    const updatedSupplierData = {
      ...selecteSupplierData,
      remark: remark,
      userRole: "QM",
      userAction: "2",
    };
    try {
      const response = await ApproveSupplier(updatedSupplierData);
      toast.success(`Supplier ${action} successfully, ${response}`);
      fetchData();
    } catch (error) {
      console.error("Error fetching supplier details: ", error);
      toast.error("Failed to fetch supplier details");
    }

    setSelectedItem("");
    setSelectAll(false);
    setRemark("");
    handleCloseModal();
  };

  const filteredData = tableData.filter((supplier) => {
    return Object.values(supplier).some(
      (value) =>
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

  const handlePrintClick = (supplier) => {
    setSupplierData(supplier);

    setTimeout(() => {
      const originalBodyStyle = document.body.style.cssText;
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      window.print();

      setTimeout(() => {
        document.body.style.cssText = originalBodyStyle;
      }, 100);
    }, 500);
  };

  const columns = [
    { field: "supplierId", label: "ID", width: "60px" },
    { field: "supplierName", label: "Supplier Name", width: "150px" },
    { field: "address", label: "Address", width: "150px" },
    { field: "phoneNumber", label: "Phone Number", width: "120px" },
    { field: "faxNum", label: "Fax Number", width: "100px" },
    { field: "email", label: "Email", width: "150px" },
    { field: "qualityManagerName", label: "Quality Manager", width: "130px" },
    { field: "qualityManagerPhoneNumber", label: "QM Phone", width: "120px" },
    { field: "qualityManagerEmailId", label: "QM Email", width: "150px" },
    { field: "saleRepresentativeName", label: "Sales Rep", width: "120px" },
    {
      field: "saleRepresentativePhoneNumber",
      label: "SR Phone",
      width: "120px",
    },
    { field: "saleRepresentativeEmailId", label: "SR Email", width: "150px" },
    { field: "coreProcess", label: "Core Product", width: "120px" },
  ];

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <div className={styles.breadcrumbContent}>
              <i className="fa fa-edit"></i>
              <span className={styles.breadcrumbLabel}>Edit Supplier</span>
            </div>
          </div>

          {/* Print View (Hidden) */}
          <div className="printView" style={{ display: 'none' }}>
            <PrintableGeneralTab dataMap={supplierData} />
          </div>

          {/* Card */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Search and Entries */}
              <div className={styles.controlsRow}>
                <div className={styles.searchBox}>
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search suppliers..."
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
                                <i
                                  className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ${styles.sortIconActive}`}
                                ></i>
                              ) : (
                                <i className={`fa fa-sort ${styles.sortIcon}`}></i>
                              )}
                            </div>
                          </th>
                        ))}
                        <th className={styles.actionsHeader}>
                          <div className={styles.thContent}>
                            <span>ACTIONS</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((supplier, index) => (
                          <tr key={supplier.formId} style={{ animationDelay: `${index * 0.02}s` }}>
                            {columns.map((column) => (
                              <td
                                key={`${supplier.formId}-${column.field}`}
                                title={supplier[column.field]}
                              >
                                {supplier[column.field]}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnEdit}
                                  onClick={() =>
                                    editSelectedElement(supplier.supplierId)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length + 1} className={styles.noData}>
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x"></i>
                                <p>No matching records found</p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x"></i>
                                <p>No data available</p>
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
                  <strong>{Math.min(indexOfLastItem, sortedData.length)}</strong> of{" "}
                  <strong>{sortedData.length}</strong> entries
                  {searchTerm && ` (filtered from ${tableData.length} total entries)`}
                </div>
                <nav>
                  <ul className={styles.pagination}>
                    <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(1)}
                        aria-label="First page"
                      >
                        <i className="fa-solid fa-angles-left"></i>
                      </button>
                    </li>
                    <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>

                    {renderPageNumbers()}

                    <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
                      <button
                        className={styles.pageLink}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                    <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
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

      {/* Accept/Reject Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "accept"
              ? "Accept Supplier"
              : actionType === "Send To Edit"
              ? "Send To Edit"
              : "Reject Supplier"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {actionType} the selected supplier?</p>
          <Form.Group className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your remarks here..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant={actionType === "accept" ? "success" : "danger"}
            onClick={handleSubmitAction}
            disabled={!remark.trim()}
          >
            Confirm{" "}
            {actionType === "accept"
              ? "Accept"
              : actionType === "Send To Edit"
              ? "Send"
              : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditSupplierTable;