import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import {
  fetchPartDetails,
  submitInspectionReport,
  fetchPartNumbers,
  fetchMrnNos
} from "../services/db_manager";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GenerateInspectionReportTable.module.css";

const GenerateInspectionReportTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mrnNo } = location.state || { mrnNo: [] };
  const [partNumber, setPartNumber] = useState([]);
  const [partLoading, setPartLoading] = useState(false);
  const [partError, setPartError] = useState(null);
  const [selectedPart, setSelectedPart] = useState("");
  const [document, setDocument] = useState(null);

  const [form, setForm] = useState({
    partNumber: "",
    partDesc: "",
    purchaseOrderNo: "",
    supplierName: "",
    reportNo: "",
    date: new Date().toISOString().split('T')[0] || "",
    qty: "",
    qtyReceive: "",
    invoiceObservation: "",
    manufacturerCertObservation: "",
    supplierCertObservation: "",
    fullTraceabilityObservation: "",
    batchNumberObservation: "",
    dateOfManufacturingObservation: "",
    dateOfExpiryObservation: "",
    selfLifeObservation: "",
    tdsObservation: "",
    materialConditionObservation: "",
    specificationObservation: "",
    documentObservation: "",
    lotAccepted: "",
    deviationDate: "",
    remark: "",
    makerUserName: "",
    makerUserId: "",
    makerDate: "",
    checkerUserName: "",
    checkerUserId: "",
    checkerDate: "",
    userAction: "",
    userRole: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async (mrnNo) => {
      console.log("MRN ", mrnNo);
      if (!mrnNo) return;

      try {
        const res = await fetchPartDetails(mrnNo);
        const data = res.data || {};

        setForm((prev) => ({
          ...prev,
          reportNo: mrnNo || "",
          partNumber: data.partNumber || "",
          partDesc: data.partDesc || "",
          purchaseOrderNo: data.purchaseOrderNo || "",
          supplierName: data.supplierName || "",
          qty: data.qty || "",
          qtyReceive: data.qtyReceive || ""
        }));
      } catch (err) {
        console.error("Failed to fetch MRN details:", err);
        setForm((prev) => ({
          ...prev,
          reportNo: "",
          partNumber: "",
          partDesc: "",
          purchaseOrderNo: "",
          supplierName: "",
          qty: "",
          qtyReceive: ""
        }));
      }
    };
    fetchData(location.state?.mrnNo);
  }, [location.state?.mrnNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleAddInspectionReport = async (e) => {
    e.preventDefault();
    if (!document) return alert("Please upload the document.");
    
    const payload = {
      partNumber: form.partNumber,
      partDesc: form.partDesc,
      purchaseOrderNo: form.purchaseOrderNo,
      supplierName: form.supplierName,
      reportNo: form.reportNo,
      date: form.date,
      qty: form.qty,
      qtyReceive: form.qtyReceive,
      invoiceObservation: form.invoiceObservation,
      manufacturerCertObservation: form.manufacturerCertObservation,
      dateOfExpiryObservation: form.dateOfExpiryObservation,
      supplierCertObservation: form.supplierCertObservation,
      fullTraceabilityObservation: form.fullTraceabilityObservation,
      batchNumberObservation: form.batchNumberObservation,
      dateOfManufacturingObservation: form.dateOfManufacturingObservation,
      selfLifeObservation: form.selfLifeObservation,
      tdsObservation: form.tdsObservation,
      materialConditionObservation: form.materialConditionObservation,
      specificationObservation: form.specificationObservation,
      documentObservation: form.documentObservation,
      lotAccepted: form.lotAccepted === "With Deviation"
        ? `${form.lotAccepted} | ${form.deviationDate}`
        : form.lotAccepted,
      remark: form.remark,
      makerUserName: sessionStorage.getItem('username'),
      makerUserId: "",
      makerDate: new Date().toISOString().split('T')[0],
      checkerUserName: "",
      checkerUserId: "",
      checkerDate: "",
      userAction: "1",
      userRole: sessionStorage.getItem('roleId'),
    };
    
    const formData = new FormData();
    formData.append("document", document);
    formData.append("report", JSON.stringify(payload));
    
    try {
      const response = await submitInspectionReport(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Report submitted successfully:", response.data);
      alert("Report submitted successfully");
      navigate("/AddReceivingInspectionReport");
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit report");
    }
  };

  const checklistItems = [
    {
      sr: 1,
      checkList: "Invoice",
      requirements: "Quantity and Unit Price must match with Purchase Order",
      field: "invoiceObservation",
      type: "text",
      required: true
    },
    {
      sr: 2,
      checkList: "Manufacturer Certificate",
      requirements: "COC must available",
      field: "manufacturerCertObservation",
      type: "text",
      required: true
    },
    {
      sr: 3,
      checkList: "Supplier Certificate(Distributor/Third Party)",
      requirements: "COC must available, in case \"No\" direct supply from Mfg.",
      field: "supplierCertObservation",
      type: "text",
      required: true
    },
    {
      sr: 4,
      checkList: "Certificate Full Traceability",
      requirements: "Must Available",
      field: "fullTraceabilityObservation",
      type: "text",
      required: true
    },
    {
      sr: 5,
      checkList: "Batch Number",
      requirements: "Must match(Physical Unit lable & all COC)",
      field: "batchNumberObservation",
      type: "text",
      required: true
    },
    {
      sr: 6,
      checkList: "Date of Manufacturing(If Applicable)",
      requirements: "Must match(Physical Unit lable & all COC)",
      field: "dateOfManufacturingObservation",
      type: "date",
      required: false
    },
    {
      sr: 7,
      checkList: "Date of Expiry(If Applicable)",
      requirements: "Must match(Physical Unit lable & all COC)",
      field: "dateOfExpiryObservation",
      type: "date",
      required: false
    },
    {
      sr: 8,
      checkList: "Shelf Life(If Applicable)",
      requirements: "80% and above",
      field: "selfLifeObservation",
      type: "text",
      required: false
    },
    {
      sr: 9,
      checkList: "Technical Data Sheet(TDS) & MSDS",
      requirements: "Must Available",
      field: "tdsObservation",
      type: "text",
      required: false
    },
    {
      sr: 10,
      checkList: "Material Condition",
      requirements: "No Damage / No Leakage",
      field: "materialConditionObservation",
      type: "text",
      required: true
    },
    {
      sr: 11,
      checkList: "Specification(If any)",
      requirements: "Must Match with Purchase Order Specification",
      field: "specificationObservation",
      type: "text",
      required: true
    },
    {
      sr: 12,
      checkList: "Documents(If Import)",
      requirements: "Air Way Bill(AWB) & Bill Of Entry(If Available)",
      field: "documentObservation",
      type: "text",
      required: true
    }
  ];

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>
                Add Receiving Inspection Report Form
              </span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleAddInspectionReport}>
                  {/* Basic Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-info-circle"></i>
                    <span>Basic Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        MRN No. <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="reportNo"
                        value={form.reportNo}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="partNumber"
                        value={form.partNumber}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Description <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="partDesc"
                        value={form.partDesc}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Purchase Order No. <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="purchaseOrderNo"
                        value={form.purchaseOrderNo}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Supplier Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="supplierName"
                        value={form.supplierName}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Qty <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="qty"
                        value={form.qty}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Receive Qty <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="qtyReceive"
                        value={form.qtyReceive}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Inspection Checklist Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-clipboard-list"></i>
                    <span>Inspection Checklist</span>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>SR No</th>
                          <th style={{ width: '250px' }}>Check List</th>
                          <th>Requirements</th>
                          <th style={{ width: '200px' }}>Observation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {checklistItems.map((item) => (
                          <tr key={item.sr}>
                            <td className={styles.textCenter}>{item.sr}</td>
                            <td>{item.checkList}</td>
                            <td className={styles.requirementsCell}>{item.requirements}</td>
                            <td>
                              <input
                                className={styles.tableInput}
                                type={item.type}
                                name={item.field}
                                value={form[item.field]}
                                onChange={handleChange}
                                required={item.required}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Final Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-check-square"></i>
                    <span>Final Assessment</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        LOT Accepted <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="lotAccepted"
                        value={form.lotAccepted}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="With Deviation">With Deviation</option>
                      </select>
                    </div>
                    {form.lotAccepted === "With Deviation" && (
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Deviation Date <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          className={styles.input}
                          name="deviationDate"
                          value={form.deviationDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Remark (If any) <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="remark"
                        value={form.remark}
                        onChange={handleChange}
                        required
                        placeholder="Enter remarks"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Upload Documents <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.fileInput}
                        type="file"
                        id="document"
                        name="document"
                        onChange={(e) => setDocument(e.target.files[0])}
                        required
                      />
                      {document && (
                        <div className={styles.fileInfo}>
                          <i className="fa fa-file-alt"></i>
                          <span>{document.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-check-circle"></i>
                      <span>Submit Report</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default GenerateInspectionReportTable;