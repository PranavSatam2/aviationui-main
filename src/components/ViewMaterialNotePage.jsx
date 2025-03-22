import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  listAllMaterials,
  deleteMaterial,
  getMaterialDetail,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const ViewMaterialPage = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("materialId");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listAllMaterials();
        console.log("API Response:", response);
        setTableData(response.data || []);
      } catch (error) {
        console.error("Error fetching materials", error);
        toast.error("Failed to load materials");
      }
    };
    fetchData();
  }, []);

  const deleteSelectedElement = async (materialId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMaterial(materialId);
        setTableData((prevData) =>
          prevData.filter((material) => material.materialId !== materialId)
        );
        toast.success("Record deleted successfully!");
      } catch (error) {
        console.error("Failed to delete material", error);
        toast.error("Failed to delete material. Please try again.");
      }
    }
  };

  const editSelectedElement = async (materialId) => {
    try {
      const response = await getMaterialDetail(materialId);
      const materialData = response?.data;

      if (materialData) {
        navigate("/editmaterial", { state: { materialId, materialData } });
      }
    } catch (error) {
      console.error("Error fetching material details: ", error);
      toast.error("Failed to fetch material details");
    }
  };

  // Search functionality
  const filteredData = tableData.filter((material) => {
    return Object.values(material).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="View Material Records" />

        <div className="card border border-dark shadow mx-4 my-4 p-2">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 ms-auto">
                <div className="d-flex align-items-center">
                  <label className="me-2">Show</label>
                  <select
                    className="form-select"
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
                  <label className="ms-2">entries</label>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light sticky-top">
                  <tr>
                    {[
                      "materialId",
                      "mrnNo",
                      "partNumber",
                      "partDescription",
                      "supplierName",
                      "orderNumber",
                      "challanNo",
                      "receiptDate",
                      "quantity",
                      "storeInchargeSign",
                      "qualityAcceptance",
                    ].map((field) => (
                      <th
                        key={field}
                        className="position-sticky"
                        onClick={() => handleSort(field)}
                        style={{ cursor: "pointer" }}
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                        {sortField === field && (
                          <i
                            className={`ms-1 fa fa-sort-${
                              sortDirection === "asc" ? "up" : "down"
                            }`}
                          ></i>
                        )}
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((material) => (
                      <tr key={material.materialId}>
                        <td>{material.materialId}</td>
                        <td>{material.mrnNo}</td>
                        <td>{material.partNumber}</td>
                        <td>{material.partDescription}</td>
                        <td>{material.supplierName}</td>
                        <td>{material.orderNumber}</td>
                        <td>{material.challanNo}</td>
                        <td>{material.receiptDate}</td>
                        <td>{material.quantity}</td>
                        <td>{material.storeInchargeSign}</td>
                        <td>{material.qualityAcceptance}</td>
                        <td style={{display: "flex",justifyContent:'space-evenly'}}>
                          <button
                            className="btn btn-sm btn-danger me-1"
                            onClick={() =>
                              deleteSelectedElement(material.materialId)
                            }
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              editSelectedElement(material.materialId)
                            }
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">
                        {searchTerm
                          ? "No matching records found"
                          : "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <p>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, sortedData.length)} of{" "}
                  {sortedData.length} entries
                  {searchTerm &&
                    ` (filtered from ${tableData.length} total entries)`}
                </p>
              </div>
              <div className="col-md-6">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
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
                        className="page-link"
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
                        className="page-link"
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
                        className="page-link"
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

export default ViewMaterialPage;
