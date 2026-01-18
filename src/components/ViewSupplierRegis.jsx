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
import { PrintableGeneralTab } from "./Checker/CheckerSupplierRegistration/PrintSupplierReg";
import styles from "./ViewSupplierRegis.module.css";

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
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow pop-ups for printing");
      return;
    }

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
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="width: 50%;">
                <strong>Type of Vendor / Supplier:</strong> ${
                  supplier.vendorTypes || "N/A"
                }
              </div>
              <div style="width: 50%;">
                <strong>Payment Terms:</strong> ${
                  supplier.paymentTerms
                    ? `${supplier.paymentTerms} ${
                        supplier.paymentTerms !== "Advance Pay" ? "Days" : ""
                      }`
                    : "N/A"
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
              <i className="fa fa-users"></i>
              <span className={styles.breadcrumbLabel}>View Supplier Registration</span>
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
                                  className={styles.btnDelete}
                                  onClick={() =>
                                    deleteSelectedElement(supplier.supplierId)
                                  }
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  className={styles.btnPrint}
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
    </div>
  );
};

export default ViewSupplierRegis;