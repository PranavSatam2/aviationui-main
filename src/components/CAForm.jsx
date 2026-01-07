import { useEffect, useState } from "react";
import { Search, Save } from "lucide-react";
import styles from "./CAForm.module.css";
import {
  submitCAForm,
  fetchWorkOrderDetails,
  fetchWorkOrder,
  getCAForm,
} from "../services/db_manager";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import Footer from "./Footer";
import { toast } from "react-toastify";
import logo from "../static/img/AMCLOGO.jpg";
import { useLocation, useNavigate } from "react-router-dom";

const CAForm = () => {
  const [partLoading, setPartLoading] = useState(false);
  const [partError, setPartError] = useState(null);
  const [selectedWorkOrderNumber, setSelectedWorkOrderNumber] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { workOrderNo } = location.state || { workOrderNo: [] };

  const [workOrderDetails, setWorkOrderDetails] = useState({
    workOrderNumber: "",
    description: "",
    partNo: "",
    quantity: "",
    serialNo: "",
    status: "",
  });

  const [formData, setFormData] = useState({
    formTrackingNumber: "",
    workOrderNumber: "",
    item: "1",
    description: "",
    partNo: "",
    quantity: "",
    serialNo: "",
    status: "",
    remarks: "",
    approveDesign13a: "N",
    nonApproveDesign13a: "N",
    otherRegulation14a: "N",
    authorisedSign13b: "",
    authorisationNumber13c: "",
    authorisedSign14b: "",
    approvalRefNo14c: "",
    name13d: "",
    date13e: "",
    name14d: sessionStorage.getItem("username") || "",
    date14e: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
  });

  useEffect(() => {
    const getWorkOrderNumber = async () => {
      console.log("WorkOrderNo : ", workOrderNo);
      try {
        const res = await fetchWorkOrderDetails(workOrderNo);
        console.log(res);
        setWorkOrderDetails(res.data);
      } catch (err) {
        console.error("Error fetching WorkOrder numbers:", err);
        setPartError(
          "Failed to load WorkOrder numbers. Please try again later."
        );
      } finally {
        setPartLoading(false);
      }
    };

    getWorkOrderNumber();
  }, []);

  const handleCheckboxChangeYN = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === "Y" ? "N" : "Y",
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let reportId = elementId;
        let reportData = await getCAForm(elementId);
        reportData = reportData.data;
      } catch (error) {
        console.error("Error fetching CA Form details: ", error);
        toast.error("Failed to fetch CA Form details");
      }
    }
  };

  const validateFormData = () => {
    const errors = [];

    if (!formData.item) {
      errors.push("Item is required.");
    }

    if (!workOrderDetails.description) {
      errors.push("Description is required.");
    }

    if (!workOrderDetails.partNo) {
      errors.push("Part Number is required.");
    }

    if (!workOrderDetails.quantity) {
      errors.push("Quantity is required.");
    }

    if (!workOrderDetails.serialNo) {
      errors.push("Serial/Batch Number is required.");
    }
    if (!workOrderDetails.status) {
      errors.push("Status is required.");
    }

    if (!formData.remarks) {
      errors.push("Remark is required.");
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateFormData();

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      const payload = {
        formTrackingNumber: formData.formTrackingNumber,
        workOrderNo: workOrderDetails.workOrderNumber,
        item: formData.item,
        description: workOrderDetails.description,
        partNo: workOrderDetails.partNo,
        quantity: workOrderDetails.quantity,
        serialNo: workOrderDetails.serialNo,
        status: formData.status,
        remarks: formData.remarks,
        approveDesign13a: formData.approveDesign13a,
        nonApproveDesign13a: formData.nonApproveDesign13a,
        otherRegulation14a: formData.otherRegulation14a,
        authorisedSign13b: formData.authorisedSign13b,
        authorisationNumber13c: formData.authorisationNumber13c,
        authorisedSign14b: formData.authorisedSign14b,
        approvalRefNo14c: formData.approvalRefNo14c,
        name13d: formData.name13d,
        date13e: formData.date13e,
        name14d: formData.name14d,
        date14e: formData.date14e,
      };

      console.log("Saving CA Form:", payload);

      const responce = await submitCAForm(payload);
      alert("CA Form saved successfully!");
      
      const savedDataRes = await getCAForm(responce.data.formTrackingNumber);
      const savedData = savedDataRes;

      setTimeout(() => handlePrintClick(savedData.data), 300);
      
      // Reset form after printing
      setTimeout(() => {
        setFormData({
          formTrackingNumber: "",
          workOrderNumber: "",
          item: "1",
          description: "",
          partNo: "",
          quantity: "",
          serialNo: "",
          status: "",
          remarks: "",
          approveDesign13a: "N",
          nonApproveDesign13a: "N",
          otherRegulation14a: "N",
          authorisedSign13b: "",
          authorisationNumber13c: "",
          authorisedSign14b: "",
          approvalRefNo14c: "",
          name13d: "",
          date13e: "",
          name14d: "",
          date14e: "",
        });

        setWorkOrderDetails({
          description: "",
          partNo: "",
          quantity: "",
          serialNo: "",
        });

        setSelectedWorkOrderNumber("");
      }, 500);
    } catch (error) {
      toast.error("Error saving CA Form.");
    }
  };

const handlePrintClick = (report) => {
  // Create the HTML content with inline styles for landscape
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CA Form - ${report.formTrackingNumber || 'N/A'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 11px;
          padding: 15px;
        }
        .container {
          max-width: 297mm;
          margin: 0 auto;
          background: white;
        }
        .print-container {
          border: 2px solid black;
          padding: 2px;
        }
        .section {
          display: flex;
          border: 1px solid black;
          margin-bottom: 0;
        }
        .border-right {
          border-right: 1px solid black;
        }
        .company-logo {
          text-align: center;
          margin: 10px 0;
        }
        .company-logo img {
          height: 60px;
          width: auto;
          max-width: 100px;
        }
        .cross-section {
          position: relative;
          overflow: hidden;
        }
        .cross-mark {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .checkbox {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid black;
          margin-right: 8px;
          vertical-align: middle;
          position: relative;
        }
        .checkbox.checked::before {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          font-size: 14px;
          font-weight: bold;
        }
        @media print {
          body {
            padding: 0;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="print-container">
          <!-- Header Section -->
          <div class="section">
            <div style="width: 20%; padding: 10px;" class="border-right">
              <div style="font-weight: bold;">1. DGCA India</div>
            </div>
            <div style="width: 50%; text-align: center; padding: 10px; font-weight: bold; font-size: 16px;" class="border-right">
              2. AUTHORISED RELEASE CERTIFICATE<br/>CA FORM 1
            </div>
            <div style="width: 30%; padding: 10px; font-weight: bold;">
              3. Form Tracking Number<br/>
              ${report.formTrackingNumber || 'N/A'}
            </div>
          </div>

          <!-- Company Info Section -->
          <div class="section">
            <div style="width: 50%; padding: 10px; display: flex;" class="border-right">
              <div style="width: 35%;">
                <div style="font-weight: bold;">4. Approved Organization Name and Address:</div>
                <div class="company-logo">
                  <img src="${logo}" alt="AMC Technology Logo" />
                </div>
              </div>
              <div style="width: 65%; padding-left: 10px;">
                <br/>
                AMC TECHNOLOGY<br/>
                105, HRIDAY INDUSTRIAL ESTATE,<br/>
                HIRA INDUSTRIAL PARK, VASAI PHATA,<br/>
                VASAI EAST, PALGHAR 401 203,<br/>
                MAHARASHTRA, INDIA
              </div>
            </div>
            <div style="width: 50%; padding: 10px;">
              <div style="font-weight: bold;">5. Work Order/Contract/Invoice:</div>
              ${report.workOrderNumber || report.workOrderNo || 'N/A'}
            </div>
          </div>

          <!-- Table Header -->
          <div class="section">
            <div style="width: 8%; padding: 8px; font-weight: bold;" class="border-right">6. Item</div>
            <div style="width: 15%; padding: 8px; font-weight: bold;" class="border-right">7. Description</div>
            <div style="width: 15%; padding: 8px; font-weight: bold;" class="border-right">8. Part No.</div>
            <div style="width: 8%; padding: 8px; font-weight: bold;" class="border-right">9. Qty</div>
            <div style="width: 15%; padding: 8px; font-weight: bold;" class="border-right">10. Serial/Batch No.</div>
            <div style="width: 39%; padding: 8px; font-weight: bold;">11. Status/Work</div>
          </div>

          <!-- Table Data -->
          <div class="section">
            <div style="width: 8%; padding: 8px;" class="border-right">${report.item || 'N/A'}</div>
            <div style="width: 15%; padding: 8px;" class="border-right">${report.description || 'N/A'}</div>
            <div style="width: 15%; padding: 8px;" class="border-right">${report.partNo || 'N/A'}</div>
            <div style="width: 8%; padding: 8px;" class="border-right">${report.quantity || 'N/A'}</div>
            <div style="width: 15%; padding: 8px;" class="border-right">${report.serialNo || 'N/A'}</div>
            <div style="width: 39%; padding: 8px;">${report.status || 'N/A'}</div>
          </div>

          <!-- Remarks Section -->
          <div class="section">
            <div style="width: 100%; padding: 10px;">
              <strong>12. Remarks:</strong><br/>
              <div style="padding-left: 20px; min-height: 40px; margin-top: 5px;">
                ${report.remarks || report.remark || 'N/A'}
              </div>
            </div>
          </div>

          <!-- Certification Sections 13 & 14 -->
          <div class="section">
            <!-- Section 13 with X cross -->
            <div style="flex: 1; padding: 10px; position: relative;" class="border-right cross-section">
              <svg class="cross-mark" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" stroke-width="2" vector-effect="non-scaling-stroke"/>
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" stroke-width="2" vector-effect="non-scaling-stroke"/>
              </svg>
              <div style="position: relative; z-index: 2;">
                <strong>13. Manufacturer / Conformity Certification</strong><br/>
                <span style="font-size: 10px;">13 a. Certifies that the items identified above were manufactured in conformity to:</span><br/><br/>
                <div style="margin: 8px 0;">
                  <span class="checkbox ${report.approveDesign13a === 'Y' ? 'checked' : ''}"></span>
                  <span style="font-size: 10px;">Approved design data and are in condition for safe operation.</span>
                </div>
                <div style="margin: 8px 0;">
                  <span class="checkbox ${report.nonApproveDesign13a === 'Y' ? 'checked' : ''}"></span>
                  <span style="font-size: 10px;">Non-approved design data specified in block 12.</span>
                </div>
                <div style="margin-top: 15px; font-size: 10px;">
                  <div style="margin: 5px 0;">13 b. Authorised Signature: ${report.authorisedSign13b || '_______________'}</div>
                  <div style="margin: 5px 0;">13 c. Approval / Authorisation Number: ${report.authorisationNumber13c || '_______________'}</div>
                  <div style="margin: 5px 0;">13 d. Name: ${report.name13d || '_______________'}</div>
                  <div style="margin: 5px 0;">13 e. Date (dd/mm/yyyy): ${report.date13e || '_______________'}</div>
                </div>
              </div>
            </div>

            <!-- Section 14 -->
            <div style="flex: 1; padding: 10px; position: relative;">
              <div>
                <strong>14 a. CAR 145.A.50 RELEASE TO SERVICE</strong><br/>
                <div style="margin: 8px 0;">
                  <span class="checkbox ${report.otherRegulation14a === 'Y' ? 'checked' : ''}"></span>
                  <span style="font-size: 10px;">Other regulation specified in block 12.</span>
                </div>
                <br/>
                <p style="font-size: 10px; text-align: justify;">
                  Certifies that unless otherwise specified in block 12, the work identified in block 11 and described in block 12 was accomplished in accordance with CAR 145 and in respect to that work the items are considered ready for release to service.
                </p>
              </div>
              <div style="margin-top: 15px; font-size: 10px;">
                <div style="margin: 5px 0;">14 b. Authorised Signature: ${report.authorisedSign14b || '_______________'}</div>
                <div style="margin: 5px 0;">14 c. Certificate / Approval Ref No.: ${report.approvalRefNo14c || '_______________'}</div>
                <div style="margin: 5px 0;">14 d. Name: ${report.name14d || '_______________'}</div>
                <div style="margin: 5px 0;">14 e. Date (dd/mm/yyyy): ${report.date14e || '_______________'}</div>
              </div>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="section">
            <div style="padding: 10px; line-height: 1.5;">
              <div style="font-weight: bold;">USER/INSTALLER RESPONSIBILITY:</div>
              <p style="margin-top: 8px; text-align: justify; font-size: 9px;">
                THIS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE AUTHORITY TO INSTALL THE ITEMS. WHERE THE USER/INSTALLER PERFORMS WORK IN ACCORDANCE WITH REGULATIONS OF AN AIRWORTHINESS AUTHORITY DIFFERENT THAN THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1, IT IS ESSENTIAL THAT THE USER/INSTALLER ENSURES THAT HIS/HER AIRWORTHINESS AUTHORITY ACCEPTS ITEMS FROM THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A DO NOT CONSTITUTE INSTALLATION CERTIFICATION. IN ALL CASES AIRCRAFT MAINTENANCE RECORDS MUST CONTAIN AN INSTALLATION CERTIFICATION ISSUED IN ACCORDANCE WITH THE NATIONAL REGULATIONS BY THE USER/INSTALLER BEFORE THE AIRCRAFT MAY BE FLOWN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Open new window and print
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    };
  } else {
    alert('Please allow pop-ups for this website to print the form.');
  }
};

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="CA Form" />
          
          <div className={styles.container}>
            <div className={`${styles.formContainer} p-4 pb-5`}>
              <div
                className={`${styles.companySection} flex items-center justify-between gap-4`}
              >
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  1. DGCA India
                </div>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <h1 className="text-center font-bold text-lg">
                    2. AUTHORISED RELEASE CERTIFICATE <br></br> CA FORM 1
                  </h1>
                </div>

                <div className={`${styles.companyInfo} flex items-center`}>
                  <label htmlFor="formTrackingNumber" className="mr-2">
                    3. Form Tracking Number:
                  </label>
                </div>
              </div>
              <div className={`${styles.companySection} flex items-center `}>
                <div className={styles.companyInfo}>
                  4. Approved Organization Name and Address:
                  <div className={styles.companyLogo}>
                    <img
                      src={logo}
                      alt="AMC Technology Logo"
                      className={styles.logoImage}
                    />
                  </div>
                </div>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <br />
                  AMC TECHNOLOGY
                  <br />
                  105, HRIDAY INDUSTRIAL ESTATE,
                  <br />
                  HIRA INDUSTRIAL PARK, VASAI PHATA,
                  <br />
                  VASAI EAST, PALGHAR 401 203,
                  <br />
                  MAHARASHTRA, INDIA
                </div>
                <div className={styles.companyInfo}>
                  <label className="col-md-4 mt-2">
                    5. Work Order/Contract/Invoice:
                  </label>
                  <input
                    id="workOrderNumber"
                    type="text"
                    className={styles.inputField}
                    value={workOrderDetails.workOrderNumber}
                    onChange={(e) =>
                      handleInputChange("workOrderNumbers", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className={`${styles.companySection} flex items-center `}>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <label htmlFor="item" className="mr-2">
                    6. Item
                  </label>
                  <input
                    id="item"
                    type="text"
                    className={styles.inputField}
                    value={formData.item}
                    onChange={(e) => handleInputChange("item", e.target.value)}
                  />
                </div>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <label htmlFor="description" className="mr-2">
                    7. Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    className={styles.inputField}
                    value={workOrderDetails.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <label htmlFor="partNo" className="mr-2">
                    8. Part No.
                  </label>
                  <input
                    id="partNo"
                    type="text"
                    className={styles.inputField}
                    value={workOrderDetails.partNo}
                    onChange={(e) =>
                      handleInputChange("partNo", e.target.value)
                    }
                  />
                </div>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <label htmlFor="quantity" className="mr-2">
                    9. Qty
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    className={styles.inputField}
                    value={workOrderDetails.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                  />
                </div>
                <div
                  className={styles.companyInfo}
                  style={{ borderRight: "1px solid black" }}
                >
                  <label htmlFor="serialNo" className="mr-2">
                    10. Serial/Batch No.
                  </label>
                  <input
                    id="serialNo"
                    type="text"
                    className={styles.inputField}
                    value={workOrderDetails.serialNo}
                    onChange={(e) =>
                      handleInputChange("serialNo", e.target.value)
                    }
                  />
                </div>
                <div className={styles.companyInfo}>
                  <label htmlFor="status" className="mr-2">
                    11. Status/Work
                  </label>
                  <input
                    id="status"
                    type="text"
                    className={styles.inputField}
                    value={workOrderDetails.status}
                    required
                  />
                </div>
              </div>
              <div className={`${styles.companySection} flex items-center `}>
                <div className="col-md-6 p-2 d-flex">
                  <label htmlFor="remarks" className="col-md-4 mt-2">
                    12. Remarks
                  </label>
                  <textarea
                    className={styles.inputField}
                    name="remarks"
                    value={formData.remarks}
                    onChange={(e) =>
                      handleInputChange("remarks", e.target.value)
                    }
                    style={{ height: "70px" }}
                    required
                  ></textarea>
                </div>
              </div>
              
              {/* Combined Section 13 & 14 */}
              <div className={`${styles.crossSectionWrapper}`}>
                {/* Section 13 */}
                <div className={`${styles.sectionBox} ${styles.crossBox}`}>
                  <div className={styles.sectionTitle}>
                    13. Manufacturer / Conformity Certification
                  </div>
                  <div className={styles.companyInfo}>
                    <p>
                      13 a. Certifies that the items identified above were
                      manufactured in conformity to:
                    </p>
                    <label>
                      <input
                        disabled
                        type="checkbox"
                        checked={formData.approveDesign13a === "Y"}
                        onChange={() =>
                          handleCheckboxChangeYN("approveDesign13a")
                        }
                      />
                      Approved design data and are in condition for safe
                      operation.
                    </label>
                    <br />
                    <label>
                      <input
                        disabled
                        type="checkbox"
                        checked={formData.nonApproveDesign13a === "Y"}
                        onChange={() =>
                          handleCheckboxChangeYN("nonApproveDesign13a")
                        }
                      />
                      Non-approved design data specified in block 12.
                    </label>
                  </div>

                  <div className={`${styles.signatureGroup}`}>
                    <div className={styles.signatureItem}>
                      <label>13 b. Authorised Signature</label>
                      <input
                        disabled
                        type="text"
                        className={styles.inputField}
                        value={formData.authorisedSign13b}
                        onChange={(e) =>
                          handleInputChange("authorisedSign13b", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.signatureItem}>
                      <label>13 c. Approval / Authorisation Number</label>
                      <input
                        disabled
                        type="text"
                        className={styles.inputField}
                        value={formData.authorisationNumber13c}
                        onChange={(e) =>
                          handleInputChange(
                            "authorisationNumber13c",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.signatureItem}>
                      <label>13 d. Name</label>
                      <input
                        disabled
                        type="text"
                        className={styles.inputField}
                        value={formData.name13d}
                        onChange={(e) =>
                          handleInputChange("name13d", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.signatureItem}>
                      <label>13 e. Date (dd/mm/yyyy)</label>
                      <input
                        disabled
                        type="text"
                        className={styles.inputField}
                        value={formData.date13e}
                        onChange={(e) =>
                          handleInputChange("date13e", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Section 14 */}
                <div className={`${styles.sectionBox}`}>
                  <div className={styles.sectionTitle}>
                    14. Release to Service
                  </div>
                  <div className={styles.companyInfo}>
                    <p>14 a. CAR 145.A.50 RELEASE TO SERVICE</p>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.otherRegulation14a === "Y"}
                        onChange={() =>
                          handleCheckboxChangeYN("otherRegulation14a")
                        }
                      />
                      Other regulation specified in block 12.
                    </label>
                    <p className="mt-1">
                      Certifies that unless otherwise specified in block 12, the
                      work identified in block 11 and described in block 12 was
                      accomplished in accordance with CAR 145 and in respect to
                      that work the items are considered ready for release to
                      service.
                    </p>
                  </div>

                  <div className={`${styles.signatureGroup}`}>
                    <div className={styles.signatureItem}>
                      <label>14 b. Authorised Signature</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.authorisedSign14b}
                        onChange={(e) =>
                          handleInputChange("authorisedSign14b", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.signatureItem}>
                      <label>14 c. Certificate / Approval Ref No.</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.approvalRefNo14c}
                        onChange={(e) =>
                          handleInputChange("approvalRefNo14c", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.signatureItem}>
                      <label>14 d. Name</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.name14d}
                        onChange={(e) =>
                          handleInputChange("name14d", e.target.value)
                        }
                        disabled
                      />
                    </div>
                    <div className={styles.signatureItem}>
                      <label>14 e. Date (dd/mm/yyyy)</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.date14e}
                        onChange={(e) =>
                          handleInputChange("date14e", e.target.value)
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className={styles.footerSection}>
                <div className={styles.footerLeft}>
                  <div className={styles.legalText}>
                    <div>USER/INSTALLER RESPONSIBILITY:</div>
                    <p>
                      THIS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE
                      AUTHORITY TO INSTALL THE ITEMS. WHERE THE USER/INSTALLER
                      PERFORMS WORK IN ACCORDANCE WITH REGULATIONS OF AN
                      AIRWORTHINESS AUTHORITY DIFFERENT THAN THE AIRWORTHINESS
                      AUTHORITY SPECIFIED IN BLOCK 1, IT IS ESSENTIAL THAT THE
                      USER/INSTALLER ENSURES THAT HIS/HER AIRWORTHINESS
                      AUTHORITY ACCEPTS ITEMS FROM THE AIRWORTHINESS AUTHORITY
                      SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A DO
                      NOT CONSTITUTE INSTALLATION CERTIFICATION. IN ALL CASES
                      AIRCRAFT MAINTENANCE RECORDS MUST CONTAIN AN INSTALLATION
                      CERTIFICATION ISSUED IN ACCORDANCE WITH THE NATIONAL
                      REGULATIONS BY THE USER/INSTALLER BEFORE THE AIRCRAFT MAY
                      BE FLOWN.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div>
                <button onClick={handleSave} className={styles.saveButton}>
                  <Save size={18} className={styles.saveIcon} />
                  Save CA Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CAForm;