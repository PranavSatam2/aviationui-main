import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getViewReportList, getReportDetails, AllStoreTag } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./ViewMaterialNote.module.css";

const ViewInspectionReports = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selecteReportData, setSelecteReportData] = useState();
  const [showModal1, setShowModal1] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remark, setRemark] = useState("");

  // Date range states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getViewReportList();
      if (response) {
        console.log(response);
        if (response?.data) {
          setTableData(response.data);
        } else if (Array.isArray(response)) {
          setTableData(response);
        } else {
          console.error("Unexpected response format:", response);
          setTableData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  const filteredData = Array.isArray(tableData)
    ? tableData
        .filter((report) =>
          Object.values(report).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .filter((report) => {
          let matchesDate = true;
          if (startDate) {
            matchesDate =
              matchesDate &&
              report.date &&
              new Date(report.date) >= new Date(startDate);
          }
          if (endDate) {
            matchesDate =
              matchesDate &&
              report.date &&
              new Date(report.date) <= new Date(endDate);
          }
          return matchesDate;
        })
    : [];

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let reportId = elementId;
        let reportData = await getReportDetails(elementId);
        reportData = reportData.data;
        console.log("Fetched report data:", reportData);

        setSelectedRow(reportData);
        console.log("Selected Row Data: ", reportData);

        setShowModal1(true);
      } catch (error) {
        console.error("Error fetching report details: ", error);
        toast.error("Failed to fetch report details");
      }
    }
  };

  const handlePrintStoreTag = async (inspectionReportId) => {
    try {
      toast.info("Fetching store tag data...");
      
      const response = await AllStoreTag(inspectionReportId);
      const storeTagData = response?.data || response;
      
      console.log("=== Store Tag Data for Inspection Report ID:", inspectionReportId, "===");
      console.log("Full Response:", storeTagData);
      
      if (!storeTagData || (Array.isArray(storeTagData) && storeTagData.length === 0)) {
        toast.warning("No store tag data found for this inspection report");
        return;
      }

      const tagsArray = Array.isArray(storeTagData) ? storeTagData : [storeTagData];
      
      console.log("Total Store Tags:", tagsArray.length);
      tagsArray.forEach((tag, index) => {
        console.log(`\n--- Store Tag ${index + 1} ---`);
        console.log(tag);
      });

      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      const generateStoreTagHTML = (store, index) => `
        <div class="store-tag-page" style="${index > 0 ? 'page-break-before: always;' : ''}">
          <div class="header">
            <h1>STORE ACCEPTANCE TAG</h1>
            <div class="company">AMC Technology</div>
            <div class="address">105, Hriday Industrial Estate, Hira Industrial Park, Vasai Phata, Vasai East, Palghar - 401208</div>
          </div>
          
          <div class="form-group">
            <label>Part No. :</label>
            <div class="value">${store.partNum || ''}</div>
          </div>
          
          <div class="form-group">
            <label>Description :</label>
            <div class="value">${store.description || ''}</div>
          </div>
          
          <div class="condition-row">
            <div class="batch-section">
              <label>Batch / Lot # :</label>
              <div class="value">${store.batch || ''}</div>
            </div>
            <div class="condition-group">
              <label>Condition:</label>
              <div class="checkbox-item">
                <div class="checkbox ${store.condition === 'New' ? 'checked' : ''}"></div>
                <span>New</span>
              </div>
              <div class="checkbox-item">
                <div class="checkbox ${store.condition === 'O/H' ? 'checked' : ''}"></div>
                <span>O/H</span>
              </div>
              <div class="checkbox-item">
                <div class="checkbox ${store.condition === 'Repaired' ? 'checked' : ''}"></div>
                <span>Repaired</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Supplier:</label>
            <div class="value">${store.supplier || ''}</div>
          </div>
          
          <div class="inline-group">
            <div class="form-item">
              <label>DOM:</label>
              <div class="value">${store.dom || ''}</div>
            </div>
            <div class="form-item">
              <label>DOE:</label>
              <div class="value">${store.doe || ''}</div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Quantity :</label>
            <div class="value">${store.quantity || ''}</div>
          </div>
          
          <div class="inline-group">
            <div class="form-item">
              <label>Receiving Insp. Report #:</label>
              <div class="value">${store.inspectionReportId || inspectionReportId || ''}</div>
            </div>
            <div class="form-item">
              <label>Date of Receipt:</label>
              <div class="value">${store.dateOfRecipet || store.dateOfReceipt || ''}</div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Name of Quality Inspector:</label>
            <div class="value">${store.nameOfQualityInsp || ''}</div>
          </div>
          
          <div class="footer-section">
            <div class="signature">
              <label>Signature of Quality Inspector:</label>
              <div class="value">${store.signatureOfQualityInsp || ''}</div>
            </div>
            <div class="date-section">
              <label>Date:</label>
              <div class="value">${new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>
          
          <div class="form-footer">
            <div>Form ${store.formAMC || 'AMC-38'}</div>
            <div>Rev No.:${store.revNo || '00'}</div>
            <div>Date: Jan-2021</div>
          </div>
        </div>
      `;

      const allTagsHTML = tagsArray.map((tag, index) => generateStoreTagHTML(tag, index)).join('');
      
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Store Acceptance Tag - Inspection Report ${inspectionReportId}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .store-tag-page {
                page-break-after: always;
              }
              .store-tag-page:last-child {
                page-break-after: auto;
              }
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            
            .store-tag-page {
              margin-bottom: 40px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }
            
            .header h1 {
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .header .company {
              font-size: 16px;
              margin: 5px 0;
              font-weight: 600;
            }
            
            .header .address {
              font-size: 12px;
              margin: 5px 0;
              color: #333;
            }
            
            .form-group {
              margin-bottom: 20px;
              display: flex;
              align-items: center;
            }
            
            .form-group label {
              font-weight: bold;
              min-width: 180px;
              font-size: 14px;
            }
            
            .form-group .value {
              flex: 1;
              border-bottom: 1px solid #000;
              padding: 5px 10px;
              min-height: 30px;
            }
            
            .inline-group {
              display: flex;
              gap: 30px;
              margin-bottom: 20px;
            }
            
            .inline-group .form-item {
              flex: 1;
              display: flex;
              align-items: center;
            }
            
            .inline-group .form-item label {
              font-weight: bold;
              margin-right: 10px;
              font-size: 14px;
              white-space: nowrap;
            }
            
            .inline-group .form-item .value {
              flex: 1;
              border-bottom: 1px solid #000;
              padding: 5px 10px;
              min-height: 30px;
            }
            
            .condition-row {
              margin-bottom: 20px;
              display: flex;
              gap: 20px;
              align-items: center;
            }
            
            .condition-row .batch-section {
              flex: 2;
              display: flex;
              align-items: center;
            }
            
            .condition-row .batch-section label {
              font-weight: bold;
              margin-right: 10px;
              font-size: 14px;
              white-space: nowrap;
            }
            
            .condition-row .batch-section .value {
              flex: 1;
              border-bottom: 1px solid #000;
              padding: 5px 10px;
              min-height: 30px;
            }
            
            .condition-group {
              flex: 2;
              display: flex;
              align-items: center;
              gap: 15px;
            }
            
            .condition-group > label {
              font-weight: bold;
              font-size: 14px;
              margin-right: 10px;
            }
            
            .condition-group .checkbox-item {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            
            .condition-group .checkbox {
              width: 22px;
              height: 22px;
              border: 2px solid #000;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 16px;
            }
            
            .condition-group .checkbox.checked::before {
              content: "✓";
            }
            
            .footer-section {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              gap: 30px;
            }
            
            .footer-section .signature {
              flex: 2;
              display: flex;
              flex-direction: column;
            }
            
            .footer-section .signature label {
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 14px;
            }
            
            .footer-section .signature .value {
              border-bottom: 1px solid #000;
              padding: 5px 10px;
              min-height: 30px;
            }
            
            .footer-section .date-section {
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            
            .footer-section .date-section label {
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 14px;
            }
            
            .footer-section .date-section .value {
              border-bottom: 1px solid #000;
              padding: 5px 10px;
              min-height: 30px;
            }
            
            .form-footer {
              margin-top: 60px;
              padding-top: 15px;
              border-top: 2px solid #000;
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${allTagsHTML}
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      toast.success(`Store tag${tagsArray.length > 1 ? 's' : ''} ready to print!`);
      
    } catch (error) {
      console.error("Error fetching store tag data:", error);
      toast.error("Failed to fetch store tag data");
    }
  };

  const handleOpenModal = (type) => {
    if (!selectedItem) {
      toast.warning("Please select a report");
      return;
    }
    setActionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRemark("");
  };

  const handlePrintInspectionReport = (report) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inspection Report - ${report.reportNo || 'N/A'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              font-size: 12px;
            }
            .container {
              max-width: 210mm;
              margin: 0 auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .header-section {
              display: flex;
              border: 1px solid black;
              margin-bottom: 15px;
            }
            .header-left {
              width: 20%;
              padding: 10px;
              border-right: 1px solid black;
              font-weight: bold;
            }
            .header-center {
              width: 55%;
              text-align: center;
              padding: 10px;
              font-weight: bold;
              font-size: 16px;
              border-right: 1px solid black;
            }
            .header-right {
              width: 25%;
              padding: 10px;
            }
            .info-section {
              border: 1px solid black;
              padding: 10px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .info-left {
              width: 60%;
            }
            .info-right {
              width: 40%;
            }
            .signature-section {
              margin-top: 30px;
              border-top: 1px solid black;
              padding-top: 10px;
            }
            .signature-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .signature-col {
              width: 33%;
            }
            hr {
              border: 1px solid black;
              margin: 10px 0;
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
            <div class="header-section">
              <div class="header-left">amc</div>
              <div class="header-center">Receiving Inspection Report</div>
              <div class="header-right">
                <div>Form: AMC-29</div>
                <div>Rev.: 00</div>
                <div>Date: Jan 2021</div>
              </div>
            </div>

            <div class="info-section">
              <div class="info-row">
                <div class="info-left">
                  <strong>Part Number:</strong> ${report.partNumber || 'N/A'}
                </div>
                <div class="info-right">
                  <strong>Report No:</strong> ${report.reportNo || 'N/A'}
                </div>
              </div>

              <div class="info-row">
                <div class="info-left">
                  <strong>Part Description:</strong> ${report.partDesc || 'N/A'}
                </div>
                <div class="info-right">
                  <strong>Date:</strong> ${report.date || new Date().toLocaleDateString()}
                </div>
              </div>

              <div class="info-row">
                <div class="info-left">
                  <strong>Purchase Order No:</strong> ${report.purchaseOrderNo || 'N/A'}
                </div>
                <div class="info-right">
                  <strong>Qty:</strong> ${report.qty || 'N/A'}
                </div>
              </div>

              <div class="info-row">
                <div class="info-left">
                  <strong>Supplier:</strong> ${report.supplierName || 'N/A'}
                </div>
                <div class="info-right">
                  <strong>Receive Qty:</strong> ${report.qtyReceive || 'N/A'}
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style="width: 10%; text-align: left;">Sr.No.</th>
                    <th style="width: 30%; text-align: center;">Check List</th>
                    <th style="width: 30%; text-align: center;">Requirements</th>
                    <th style="width: 30%; text-align: center;">Observation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td style="text-align: center;">Invoice</td>
                    <td style="text-align: center;">Quantity and Unit Price must match with Purchase Order</td>
                    <td style="text-align: center;">${report.invoiceObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td style="text-align: center;">Manufacturer Certificate</td>
                    <td style="text-align: center;">COC must available</td>
                    <td style="text-align: center;">${report.manufacturerCertObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td style="text-align: center;">Supplier Certificate(Distributor/Third Party)</td>
                    <td style="text-align: center;">COC must available, in case "No" direct supply from Mfg.</td>
                    <td style="text-align: center;">${report.supplierCertObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td style="text-align: center;">Certificate Full Traceability</td>
                    <td style="text-align: center;">Must Available</td>
                    <td style="text-align: center;">${report.fullTraceabilityObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td style="text-align: center;">Batch Number</td>
                    <td style="text-align: center;">Must match(Physical Unit lable & all COC)</td>
                    <td style="text-align: center;">${report.batchNumberObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td style="text-align: center;">Date of Manufacturing & Date of Expiry(If Applicable)</td>
                    <td style="text-align: center;">Must match(Physical Unit lable & all COC)</td>
                    <td style="text-align: center;">${report.dateOfManufacturingObservation || 'N/A'}<br/>${report.dateOfExpiryObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td style="text-align: center;">Shelf Life(If Applicable)</td>
                    <td style="text-align: center;">80% and above</td>
                    <td style="text-align: center;">${report.selfLifeObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td style="text-align: center;">Technical Data Sheet(TDS) & MSDS</td>
                    <td style="text-align: center;">Must Available</td>
                    <td style="text-align: center;">${report.tdsObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td style="text-align: center;">Material Condition</td>
                    <td style="text-align: center;">No Damage / No Leakage</td>
                    <td style="text-align: center;">${report.materialConditionObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td style="text-align: center;">Specification(If any)</td>
                    <td style="text-align: center;">Must Match with Purchase Order Specification</td>
                    <td style="text-align: center;">${report.specificationObservation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td style="text-align: center;">Documents(If Import)</td>
                    <td style="text-align: center;">Air Way Bill(AWB) & Bill Of Entry(If Available)</td>
                    <td style="text-align: center;">${report.documentObservation || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-bottom: 10px;">
                <strong>LOT Accepted(Yes/No/With Deviation):</strong> ${report.lotAccepted || 'N/A'}
              </div>
              <div style="margin-bottom: 10px;">
                <strong>Remark(If Any):</strong> ${report.remark || 'N/A'}
              </div>
            </div>

            <hr />
            <div class="signature-section">
              <div class="signature-row">
                <div class="signature-col">${report.makerUserName || 'N/A'}</div>
                <div class="signature-col">${report.makerDate || 'N/A'}</div>
                <div class="signature-col"></div>
              </div>
              <div class="signature-row">
                <div class="signature-col"><strong>Checked By Inspector</strong></div>
                <div class="signature-col"><strong>Date</strong></div>
                <div class="signature-col"><strong>Quality Manager Approval</strong></div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

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

  const handleCheckboxChange = (report) => {
    if (selectedItem === report.inspectionReportId) {
      setSelectedItem("");
    } else {
      setSelectedItem(report.inspectionReportId);
      setSelecteReportData(report);
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

  const columns = [
    { field: "inspectionReportId", label: "Inspection Report Id", width: "100px" },
    { field: "partNumber", label: "Part Number", width: "100px" },
    { field: "partDesc", label: "Part Description", width: "100px" },
    { field: "purchaseOrderNo", label: "Purchase Order No.", width: "100px" },
    { field: "supplierName", label: "Supplier Name", width: "100px" },
    { field: "reportNo", label: "MRN No.", width: "100px" },
    { field: "date", label: "Date", width: "100px" },
    { field: "qty", label: "Quantity", width: "100px" },
    { field: "qtyReceive", label: "Receive Quantity", width: "100px" },
    { field: "invoiceObservation", label: "Invoice Observation", width: "100px" },
    { field: "manufacturerCertObservation", label: "Manufacturer Cert Observation", width: "100px" },
    { field: "supplierCertObservation", label: "Supplier Cert. Observation", width: "100px" },
    { field: "fullTraceabilityObservation", label: "Full Traceability Observation", width: "100px" },
    { field: "batchNumberObservation", label: "Batch Number Observation", width: "100px" },
    { field: "dateOfManufacturingObservation", label: "Date of Manufacturing & Date of Expiry Observation", width: "100px" },
    { field: "selfLifeObservation", label: "Self Life Observation", width: "100px" },
    { field: "tdsObservation", label: "Technical Data Sheet(TDS) & MSDS Observation", width: "100px" },
    { field: "materialConditionObservation", label: "Material Condition Observation", width: "100px" },
    { field: "specificationObservation", label: "Specification Observation", width: "100px" },
    { field: "documentObservation", label: "Documents Observation", width: "100px" },
    { field: "lotAccepted", label: "Lot Accepted", width: "100px" },
    { field: "remark", label: "Remark", width: "100px" },
    { field: "makerUserName", label: "Maker Name", width: "100px" },
    { field: "makerDate", label: "Maker Date", width: "100px" },
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
              <i className="fa fa-file-alt"></i>
              <span className={styles.breadcrumbLabel}>
                View Inspection Reports
              </span>
            </div>
          </div>

          {/* Card Container */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* Date Filters */}
              <div className={styles.filtersRow}>
                <div className={styles.dateFilters}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Start Date</label>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>End Date</label>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Search and Entries Control */}
              <div className={styles.controlsRow}>
                <div className={styles.searchBox}>
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search reports..."
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
                        <th className={styles.checkboxHeader}>
                          <div className={styles.checkboxWrapper}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              id="selectAll"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
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
                                  className={`fa fa-sort-${
                                    sortDirection === "asc" ? "up" : "down"
                                  } ${styles.sortIconActive}`}
                                ></i>
                              ) : (
                                <i
                                  className={`fa fa-sort ${styles.sortIcon}`}
                                ></i>
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
                        currentItems.map((report, index) => (
                          <tr
                            key={report.formId}
                            style={{ animationDelay: `${index * 0.02}s` }}
                          >
                            <td className={styles.checkboxCell}>
                              <div className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                  id={`check-${report.inspectionReportId}`}
                                  checked={
                                    selectedItem === report.inspectionReportId
                                  }
                                  onChange={() => handleCheckboxChange(report)}
                                />
                              </div>
                            </td>
                            {columns.map((column) => (
                              <td
                                key={`${report.formId}-${column.field}`}
                                title={report[column.field]}
                              >
                                {report[column.field]}
                              </td>
                            ))}
                            <td className={styles.actionsCell}>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.btnView}
                                  onClick={() =>
                                    editSelectedElement(
                                      report.inspectionReportId
                                    )
                                  }
                                  title="View Doc"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button
                                  className={styles.btnPrint}
                                  onClick={() => handlePrintInspectionReport(report)}
                                  title="Print Inspection Report"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                                <button
                                  className={styles.btnTag}
                                  onClick={() => handlePrintStoreTag(report.inspectionReportId)}
                                  title="Print Store Tag"
                                >
                                  <i className="fa-solid fa-tags"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length + 2}
                            className={styles.noData}
                          >
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
                  <strong>
                    {Math.min(indexOfLastItem, sortedData.length)}
                  </strong>{" "}
                  of <strong>{sortedData.length}</strong> entries
                  {searchTerm &&
                    ` (filtered from ${tableData.length} total entries)`}
                </div>
                <nav>
                  <ul className={styles.pagination}>
                    <li
                      className={`${styles.pageItem} ${
                        currentPage === 1 ? styles.disabled : ""
                      }`}
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
                      className={`${styles.pageItem} ${
                        currentPage === 1 ? styles.disabled : ""
                      }`}
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
                      className={`${styles.pageItem} ${
                        currentPage === totalPages ? styles.disabled : ""
                      }`}
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
                      className={`${styles.pageItem} ${
                        currentPage === totalPages ? styles.disabled : ""
                      }`}
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
          </div>
        </div>
        <Footer />
      </div>

      {/* View Modal */}
      {showModal1 && selectedRow && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{maxWidth: '700px', maxHeight: '80vh', overflow: 'auto'}}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Inspection Report Details</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowModal1(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <strong>Inspection Report Id:</strong> {selectedRow.inspectionReportId}
              </div>
              <div className={styles.detailRow}>
                <strong>Part Description:</strong> {selectedRow.partDesc}
              </div>
              <div className={styles.detailRow}>
                <strong>Purchase Order No.:</strong> {selectedRow.purchaseOrderNo}
              </div>
              <div className={styles.detailRow}>
                <strong>Supplier Name:</strong> {selectedRow.supplierName}
              </div>
              <div className={styles.detailRow}>
                <strong>Report No:</strong> {selectedRow.reportNo}
              </div>
              <div className={styles.detailRow}>
                <strong>Quantity:</strong> {selectedRow.qty}
              </div>
              <div className={styles.detailRow}>
                <strong>Receive Quantity:</strong> {selectedRow.qtyReceive}
              </div>
              <div className={styles.detailRow}>
                <strong>Date:</strong> {selectedRow.date}
              </div>
              <div className={styles.detailRow}>
                <strong>Invoice Observation:</strong> {selectedRow.invoiceObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Manufacturer Cert Observation:</strong> {selectedRow.manufacturerCertObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Supplier Cert. Observation:</strong> {selectedRow.supplierCertObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Cert. Full Traceability Observation:</strong> {selectedRow.fullTraceabilityObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Batch Number Observation:</strong> {selectedRow.batchNumberObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Date of Manufacturing & Date of Expiry Observation:</strong> {selectedRow.dateOfManufacturingObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Self Life Observation:</strong> {selectedRow.selfLifeObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Technical Data Sheet(TDS) & MSDS Observation:</strong> {selectedRow.tdsObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Material Condition Observation:</strong> {selectedRow.materialConditionObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Specification Observation:</strong> {selectedRow.specificationObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Documents Observation:</strong> {selectedRow.documentObservation}
              </div>
              <div className={styles.detailRow}>
                <strong>Lot Accepted:</strong> {selectedRow.lotAccepted}
              </div>
              <div className={styles.detailRow}>
                <strong>Remark:</strong> {selectedRow.remark}
              </div>
              <div className={styles.detailRow}>
                <strong>Maker Name:</strong> {selectedRow.makerUserName}
              </div>
              <div className={styles.detailRow}>
                <strong>Maker Date:</strong> {selectedRow.makerDate}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowModal1(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInspectionReports;