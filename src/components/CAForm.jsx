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
import logo from "../static/img/logo.png";
import { PrintCAForm } from "./PrintCAForm";

const CAForm = () => {
  const [workOrderNumber, setWorkOrderNumber] = useState([]);
  const [partLoading, setPartLoading] = useState(false);
  const [partError, setPartError] = useState(null);
  const [selectedWorkOrderNumber, setSelectedWorkOrderNumber] = useState("");
  const [reportData, setReportData] = useState();

  const [workOrderDetails, setWorkOrderDetails] = useState({
    description: "",
    partNo: "",
    quantity: "",
    serialNo: "",
  });

  // const generateCertificateNumber = () => {
  //   const year = new Date().getFullYear();
  //   const companyCode = "CA-N-";
  //   const randomId = Math.floor(100 + Math.random() * 900); // Generates number like 231

  //   return `${year}/${companyCode}/${randomId}`;
  // };

  //const certNumber = generateCertificateNumber();

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
    name14d: "",
    date14e: "",
  });

  useEffect(() => {
    const getWorkOrderNumber = async () => {
      setPartLoading(true);
      try {
        const res = await fetchWorkOrder();
        console.log("WorkOrder data:", res.data);
        const actualData = res.data.data || res.data;
        setWorkOrderNumber(actualData);
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

  const handlePartNumberSelect = async (workOrder) => {
    setSelectedWorkOrderNumber(workOrder);
    if (!workOrder) return;

    try {
      const res = await fetchWorkOrderDetails(workOrder);
      setWorkOrderDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch workOrder details:", err);
    }
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

    if (!selectedWorkOrderNumber) {
      errors.push("Work Order Number is required.");
    }

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

    return errors;
  };

  const handleSave = async () => {
    const errors = validateFormData();

    if (errors.length > 0) {
      // Show all errors as toast messages
      errors.forEach((err) => toast.error(err));
      return; // Stop save if validation fails
    }

    try {
      const payload = {
        // Required fields
        formTrackingNumber: formData.formTrackingNumber,
        workOrderNo: selectedWorkOrderNumber,
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

      // Call the API to save the data
      const responce = await submitCAForm(payload);
      alert("CA Form saved successfully!");
      // Fetch the saved CA Form data from backend
      const savedDataRes = await getCAForm(responce.data.formTrackingNumber);

      const savedData = savedDataRes;

      // Update state with latest data
      setReportData(savedData);
      // console.log("Save data ",savedDataRes);

      setTimeout(() => handlePrintClick(savedData), 300);
    } catch (error) {
      toast.error("Error saving CA Form.");
    }
  };

  const handlePrintClick = (report) => {
    // Store the report data
    //console.log("Report",report)
    setReportData(report.data);

    // Short delay to ensure React has updated the state and rendered the component
    setTimeout(() => {
      // Cache original body styles
      const originalBodyStyle = document.body.style.cssText;

      // Apply print-friendly styles to the body
      document.body.style.margin = "0";
      document.body.style.padding = "0";

      // Print the document
      window.print();
      setTimeout(() => {
        document.body.style.cssText = originalBodyStyle;
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
        setReportData(null);
      }, 100);
    }, 300);
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="CA Form"
            // isBack={true}
          />
          <div className="printView">
            <PrintCAForm dataMap={reportData} />
          </div>
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
                  {/* <input
                    id="formTrackingNumber"
                    type="text"
                    className={styles.inputField}
                    value={formData.formTrackingNumber}
                    onChange={(e) => handleInputChange("poNo", e.target.value)}
                  /> */}
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
                  {partLoading ? (
                    <div className="d-flex align-items-center">
                      <div
                        className="spinner-border text-primary me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Loading WorkOrder numbers...</span>
                    </div>
                  ) : partError ? (
                    <div className="alert alert-danger w-100">{partError}</div>
                  ) : (
                    <select
                      className="form-select w-100"
                      name="workOrderNumber"
                      onChange={(e) => handlePartNumberSelect(e.target.value)}
                      value={selectedWorkOrderNumber}
                      required
                    >
                      <option value="">Select a WorkOrder number</option>
                      {Array.isArray(workOrderNumber) &&
                        workOrderNumber.map((workOrder) => (
                          <option
                            key={workOrder.workOrderNo}
                            value={workOrder.workOrderNo}
                          >
                            {workOrder.workOrderNo}
                          </option>
                        ))}
                    </select>
                  )}
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
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
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
              {/* Items Table */}
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
                      THiS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE
                      AUTHORITY TO INSTAL THE ITEMS. WHERE THE USER/INSTALLER
                      PERFORMS WoRK IN ACCORDANCE WITH REGULATIONS OF AN
                      AIRWORTHINESS AUTHORITY DIFFERENT THAN TH AIRWORTHINESS
                      AUTHORITY SPECIFIED IN BLOCK 1, IT IS ESSENTIAL THAT THE
                      USER/INSTALLER ENSURES THAT HIS/HER AIRWORTHINESS
                      AUTHORITY ACCEPTS ITEMS FROM THE AIRWORTHIINESS AUTHORITY
                      SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A DO
                      NOT CONSTITUTE INSTALLATIOoN CERTIFICATON. IN ALL CASES
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
