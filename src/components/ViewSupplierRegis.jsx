import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  deleteSupplier,
  getSupplierDetail,
  listAllSupplier,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { PrintableGeneralTab } from "./Checker/CheckerSupplierRegistration/PrintSupplierReg";

const ViewSupplierRegis = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [supplierData, setSupplierData] = useState();

  const navigate = useNavigate();

  // Fetching data when the component is mounted
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await listAllSupplier();
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

  const deleteSelectedElement = async (elementId) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const response = await deleteSupplier(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((supplier) => supplier.formId !== elementId)
          );
          toast.success("Supplier deleted successfully");
          fetchData();
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
          navigate("/SupplierRegistration", {
            state: { supplierId, supplierData },
          });
        }
      } catch (error) {
        console.error("Error fetching supplier details: ", error);
        toast.error("Failed to fetch supplier details");
      }
    }
  };

  // Search functionality
  const filteredData = tableData.filter((supplier) => {
    return Object.values(supplier).some(
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

  const handlePrintClick = (supplier) => {
    // Create print window immediately with the supplier data
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow pop-ups for printing");
      return;
    }

    // Write the complete HTML with inline data
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Supplier Registration - ${
          supplier.supplierName || "Supplier"
        }</title>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 15px;
            font-family: Arial, sans-serif;
            background: white;
            font-size: 12px;
          }
          
          .container {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            page-break-inside: auto;
            border: 1px solid black;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          td, th {
            page-break-inside: avoid;
            border: 1px solid black;
            padding: 6px;
          }
          
          thead {
            display: table-header-group;
          }
          
          tbody {
            display: table-row-group;
          }
          
          strong {
            font-weight: bold;
          }
          
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Section -->
          <div style="display: flex; border: 1px solid black; margin-bottom: 15px;">
            <div style="width: 20%; padding: 10px; border-right: 1px solid black; font-weight: bold;">
              amc
            </div>
            <div style="width: 55%; text-align: center; padding: 10px; font-weight: bold; font-size: 16px; border-right: 1px solid black;">
              SUPPLIER / SUB-CONTRACTOR EVALUATION FORM
            </div>
            <div style="width: 25%; padding: 10px;">
              <div>Form: AMC-29</div>
              <div>Rev.: 00</div>
              <div>Date: Jan 2021</div>
            </div>
          </div>

          <!-- General Information Section -->
          <div style="margin-bottom: 20px; border: 1px solid black; padding: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="width: 60%;">
                <strong>Supplier Name:</strong> ${
                  supplier.supplierName || "N/A"
                }
              </div>
              <div style="width: 40%;">
                <strong>Date:</strong> ${
                  supplier.date || new Date().toLocaleDateString()
                }
              </div>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Address:</strong> ${supplier.address || "N/A"}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="width: 33%;">
                <strong>Phone:</strong> ${supplier.countryCode || ""} ${
      supplier.phoneNumber || "N/A"
    }
              </div>
              <div style="width: 33%;">
                <strong>Fax:</strong> ${supplier.faxNum || "N/A"}
              </div>
              <div style="width: 33%;">
                <strong>Email:</strong> ${supplier.email || "N/A"}
              </div>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Payment Terms:</strong> ${
                supplier.paymentTerms
                  ? `${supplier.paymentTerms} ${
                      supplier.paymentTerms !== "Advance Pay" ? "Days" : ""
                    }`
                  : "N/A"
              }
            </div>
            <div style="margin-bottom: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
              <div style="font-weight: bold; margin-bottom: 5px;">Quality Manager Contact:</div>
              <div style="display: flex; justify-content: space-between;">
                <div style="width: 33%;">
                  <strong>Name:</strong> ${supplier.qualityManagerName || "N/A"}
                </div>
                <div style="width: 33%;">
                  <strong>Phone:</strong> ${
                    supplier.qualityManagerCountryCode || ""
                  } ${supplier.qualityManagerPhoneNumber || "N/A"}
                </div>
                <div style="width: 33%;">
                  <strong>Email:</strong> ${
                    supplier.qualityManagerEmailId || "N/A"
                  }
                </div>
              </div>
            </div>
            <div style="border-top: 1px solid #ddd; padding-top: 10px;">
              <div style="font-weight: bold; margin-bottom: 5px;">Sales Representative Contact:</div>
              <div style="display: flex; justify-content: space-between;">
                <div style="width: 33%;">
                  <strong>Name:</strong> ${
                    supplier.saleRepresentativeName || "N/A"
                  }
                </div>
                <div style="width: 33%;">
                  <strong>Phone:</strong> ${
                    supplier.saleRepresentativeCountryCode || ""
                  } ${supplier.saleRepresentativePhoneNumber || "N/A"}
                </div>
                <div style="width: 33%;">
                  <strong>Email:</strong> ${
                    supplier.saleRepresentativeEmailId || "N/A"
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Supplier Analysis Section -->
          <div style="border: 1px solid black; margin-bottom: 15px;">
            <div style="padding: 8px; font-weight: bold; text-align: center; background-color: #f5f5f5; border-bottom: 1px solid black;">
              SUPPLIER ANALYSIS
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 10px; padding: 8px; font-size: 0.85em;">
              <div><strong>1) Core products/Process:</strong><br/>${
                supplier.coreProcess || "N/A"
              }</div>
              <div><strong>2) Years in Business:</strong><br/>${
                supplier.workYear || "N/A"
              } years</div>
              <div><strong>3) ISO Registered?</strong><br/>${
                supplier.isoRegistered || "N/A"
              }</div>
              <div><strong>4) ISO Standard:</strong><br/>${
                supplier.isoStandard || "N/A"
              }</div>
              <div><strong>5) ISO Certificate:</strong><br/>${
                supplier.isoCertificate || "N/A"
              }</div>
              <div><strong>6) CAR 145 / DGCA Approval:</strong><br/>${
                supplier.carDgcaApproval || "N/A"
              }</div>
              <div><strong>7) ISO Registration Plans:</strong><br/>${
                supplier.isoRegistrationPlans || "N/A"
              }</div>
              <div><strong>8) Total Employees:</strong><br/>${
                supplier.numEmp || "N/A"
              }</div>
              <div><strong>9) Operating Shifts:</strong><br/>${
                supplier.numOpeShift || "N/A"
              }</div>
              <div><strong>10) Quality Manual Available?</strong><br/>${
                supplier.quaManual || "N/A"
              }</div>
              <div><strong>11) Annual Turnover (INR):</strong><br/>${
                supplier.turnOver || "N/A"
              }</div>
            </div>
          </div>

          <!-- Quality Process Section -->
          <div style="margin-bottom: 15px;">
            <div style="border: 1px solid black; border-bottom: none; padding: 8px; font-weight: bold; text-align: center; background-color: #f5f5f5;">
              QUALITY PROCESS
            </div>
            <table>
              <thead>
                <tr>
                  <th style="padding: 6px; width: 70%; text-align: left;">QMS</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">YES</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">NO</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">N/A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 6px;">Does quality assurance have independence from Mfg.?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.independenceManuf === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.independenceManuf === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.independenceManuf === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Do you have documented operative system for internal & external Corrective & preventive actions</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.documentedOperative === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.documentedOperative === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.documentedOperative === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are there documented procedure for identification, collection, filing, Storage & maintenance of Quality records?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.documentedProcedure === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.documentedProcedure === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.documentedProcedure === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Does your system assure that product shipped meets customers applicable revision of specifications</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.productShipment === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.productShipment === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.productShipment === "N/A" ? "✓" : ""
                  }</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Incoming Inspection Section -->
          <div style="margin-bottom: 15px;">
            <div style="border: 1px solid black; border-bottom: none; padding: 8px; font-weight: bold; text-align: center; background-color: #f5f5f5;">
              INCOMING INSPECTION
            </div>
            <table>
              <thead>
                <tr>
                  <th style="padding: 6px; width: 70%; text-align: left;">Questions</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">YES</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">NO</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">N/A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 6px;">Is incoming process documented?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.processDocumented === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.processDocumented === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.processDocumented === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">What sampling plan is used for incoming inspection?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.samplingIncomingInsp === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.samplingIncomingInsp === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.samplingIncomingInsp === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is objective evidence of receiving inspection results maintained on file?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.receivingInspectionResultsOnFile === "Yes"
                      ? "✓"
                      : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.receivingInspectionResultsOnFile === "No"
                      ? "✓"
                      : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.receivingInspectionResultsOnFile === "N/A"
                      ? "✓"
                      : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is lot number or other traceability identification maintained?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.identificationMaintained === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.identificationMaintained === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.identificationMaintained === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is incoming material kept separate from inspected material?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.sepInsMaterial === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.sepInsMaterial === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.sepInsMaterial === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is there any procedure for isolating nonconforming material?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.nonConMaterial === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.nonConMaterial === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.nonConMaterial === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are deviations that affect the customer's requirement referred to customers for disposition?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.affectCusReq === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.affectCusReq === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.affectCusReq === "N/A" ? "✓" : ""
                  }</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Process/Document/Procurement Control Section -->
          <div style="margin-bottom: 15px; padding-top:30px;">
            <div style="border: 1px solid black; border-bottom: none; padding: 8px; font-weight: bold; text-align: center; background-color: #f5f5f5;">
              PROCESS / DOCUMENT / PROCUREMENT CONTROL
            </div>
            <table>
              <thead>
                <tr>
                  <th style="padding: 6px; width: 70%; text-align: left;">Questions</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">YES</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">NO</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">N/A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 6px;">Are written work instructions available at work stations?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.writtenWorkInstructionsAvaibleInStation === "Yes"
                      ? "✓"
                      : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.writtenWorkInstructionsAvaibleInStation === "No"
                      ? "✓"
                      : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.writtenWorkInstructionsAvaibleInStation === "N/A"
                      ? "✓"
                      : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Does the finished product show evidence of final inspection acceptance?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.finalInspectionEvidence === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.finalInspectionEvidence === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.finalInspectionEvidence === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are statistical methods used to control the process?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.statisMethod === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.statisMethod === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.statisMethod === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are procedures in place for control of customer-supplied documents?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.suppliedDocument === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.suppliedDocument === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.suppliedDocument === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Does range procedure include a method for handling revision changes & obsolete documents?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.includeMethod === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.includeMethod === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.includeMethod === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are quality capabilities of suppliers evaluated prior to procurement?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.qualityCapabilities === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.qualityCapabilities === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.qualityCapabilities === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Do you have an approved supplier list?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.approvedSupplierList === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.approvedSupplierList === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.approvedSupplierList === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is the supplier competent with respect to market price?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.marketPrice === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.marketPrice === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.marketPrice === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are certified test reports & certifications of conformance obtained on purchased material?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.certifiedTestReports === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.certifiedTestReports === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.certifiedTestReports === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is the supplier capable of on-time delivery?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.supplierOnTimeDelivery === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.supplierOnTimeDelivery === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.supplierOnTimeDelivery === "N/A" ? "✓" : ""
                  }</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Material and Other Section -->
          <div style="margin-bottom: 15px;">
            <div style="border: 1px solid black; border-bottom: none; padding: 8px; font-weight: bold; text-align: center; background-color: #f5f5f5;">
              MATERIAL AND OTHER
            </div>
            <table>
              <thead>
                <tr>
                  <th style="padding: 6px; width: 70%; text-align: left;">Questions</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">YES</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">NO</th>
                  <th style="padding: 6px; width: 10%; text-align: center;">N/A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 6px;">Are equipment calibrated?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.equipCalibrated === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.equipCalibrated === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.equipCalibrated === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are gauges and test equipment periodically certified, and are records maintained for frequency of recalibration?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.recalibration === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.recalibration === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.recalibration === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Are gauges, test equipment available and sufficient for our scope of work?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.scopeOfWork === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.scopeOfWork === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.scopeOfWork === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is there adequate area & safety programs in place?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.safetyProgram === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.safetyProgram === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.safetyProgram === "N/A" ? "✓" : ""
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px;">Is there a procedure in place for housekeeping?</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.houseKeeping === "Yes" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.houseKeeping === "No" ? "✓" : ""
                  }</td>
                  <td style="padding: 6px; text-align: center;">${
                    supplier.houseKeeping === "N/A" ? "✓" : ""
                  }</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Internal Use Section -->
          <div style="margin-top: 30px; border-top: 1px solid black; padding-top: 10px;">
            <div style="margin-bottom: 10px; font-weight: bold;">FOR AMC TECHNOLOGY INTERNAL USE</div>
            <div style="margin-bottom: 10px;">Approval to vendor (Yes / No): _________________</div>
            <div style="margin-bottom: 20px;">Remark (If Any): _______________________________</div>
            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
              <div>Quality Manager</div>
              <div>Date: ________________</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };
  // Column definitions for the table
  const columns = [
    { field: "supplierId", label: "ID", width: "50px" },
    { field: "supplierName", label: "Supplier Name", width: "100px" },
    { field: "address", label: "Address", width: "100px" },
    { field: "phoneNumber", label: "Phone Number", width: "100px" },
    { field: "faxNum", label: "Fax Number", width: "100px" },
    { field: "email", label: "Email", width: "100px" },
    { field: "qualityManagerName", label: "Quality Manager", width: "100px" },
    { field: "qualityManagerPhoneNumber", label: "QM Phone", width: "100px" },
    { field: "qualityManagerEmailId", label: "QM Email", width: "100px" },
    { field: "saleRepresentativeName", label: "Sales Rep", width: "100px" },
    {
      field: "saleRepresentativePhoneNumber",
      label: "SR Phone",
      width: "100px",
    },
    { field: "saleRepresentativeEmailId", label: "SR Email", width: "150px" },
    { field: "coreProcess", label: "Core Product", width: "100px" },
  ];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Supplier Registration" />
          <div className="printView">
            <PrintableGeneralTab dataMap={supplierData} />
          </div>
          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
            ].join(" ")}
          >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search suppliers..."
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
                  <div className="spinner-border text-primary" role="status">
                    {/* <span className="visually-hidden"></span> */}
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
                      <tr className="bg-blue">
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
                                    sortDirection === "asc" ? "up" : "down"
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
                        currentItems.map((supplier, index) => (
                          <tr
                            key={supplier.formId}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${supplier.formId}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={supplier[column.field]}
                              >
                                {supplier[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                {/* <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(supplier.supplierId)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button> */}
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    deleteSelectedElement(supplier.supplierId)
                                  }
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handlePrintClick(supplier)}
                                  title="Print Doc"
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

export default ViewSupplierRegis;
