import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { updateCAForm } from "../services/db_manager";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./EditCAForm.module.css";
import { Save } from "lucide-react";
import logo from "../static/img/logo.png";

const EditCAForm = () => {
  const [partLoading, setPartLoading] = useState(false);
  const [partError, setPartError] = useState(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [document, setDocument] = useState(null);
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const { reportId, reportData } = location.state || "";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    formTrackingNumber: "",
    workOrderNo: "",
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
    if (reportData && reportId) {
      setFormData((prevData) => ({
        ...prevData,
        ...reportData,
      }));
    }
  }, [reportData, reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChangeYN = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === "Y" ? "N" : "Y",
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
      setFormError("You need to be logged in again");
      return;
    }
    try {
      let updateOrdertData = {
        ...formData,
      };
      console.log("Id :", formData.id);
      let response = await updateCAForm(reportId, updateOrdertData);
      if (response) {
        navigate("/editCAForm");
        toast.success("CA Form updated successfully");
      }
    } catch (error) {
      console.error("Error updating CA Form:", error);
      toast.error("Failed to update CA Form.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Edit CA Form</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                {/* Header Section */}
                <div className={styles.formHeader}>
                  <div className={styles.headerItem}>
                    <span className={styles.headerLabel}>1. DGCA India</span>
                  </div>
                  <div className={styles.headerTitle}>
                    <h2>2. AUTHORISED RELEASE CERTIFICATE</h2>
                    <h3>CA FORM 1</h3>
                  </div>
                  <div className={styles.headerItem}>
                    <span className={styles.headerLabel}>3. Form Tracking Number</span>
                    <input
                      type="text"
                      className={styles.trackingInput}
                      value={formData.formTrackingNumber}
                      disabled
                    />
                  </div>
                </div>

                {/* Company Section */}
                <div className={styles.companySection}>
                  <div className={styles.companyLeft}>
                    <div className={styles.companyLabel}>
                      4. Approved Organization Name and Address:
                    </div>
                    <div className={styles.companyLogo}>
                      <img src={logo} alt="AMC Technology Logo" className={styles.logoImage} />
                    </div>
                  </div>
                  <div className={styles.companyAddress}>
                    <p>AMC TECHNOLOGY</p>
                    <p>105, HRIDAY INDUSTRIAL ESTATE,</p>
                    <p>HIRA INDUSTRIAL PARK, VASAI PHATA,</p>
                    <p>VASAI EAST, PALGHAR 401 203,</p>
                    <p>MAHARASHTRA, INDIA</p>
                  </div>
                  <div className={styles.workOrderSection}>
                    <label className={styles.label}>
                      5. Work Order/Contract/Invoice
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.workOrderNo}
                      disabled
                    />
                  </div>
                </div>

                {/* Details Section */}
                <div className={styles.sectionHeader}>
                  <i className="fa fa-list"></i>
                  <span>Item Details</span>
                  <span className={styles.readOnlyBadge}>Read Only</span>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>6. Item</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.item}
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>7. Description</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.description}
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>8. Part No.</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.partNo}
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>9. Qty</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.quantity}
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>10. Serial/Batch No.</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.serialNo}
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      11. Status/Work <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      placeholder="Enter status/work"
                    />
                  </div>
                </div>

                {/* Remarks Section */}
                <div className={styles.sectionHeader}>
                  <i className="fa fa-edit"></i>
                  <span>Editable Section</span>
                  <span className={styles.editableBadge}>Editable</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    12. Remarks <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    value={formData.remarks}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    rows="4"
                    placeholder="Enter remarks..."
                  />
                </div>

                {/* Footer Notice */}
                <div className={styles.footerNotice}>
                  <div className={styles.noticeTitle}>USER/INSTALLER RESPONSIBILITY:</div>
                  <p className={styles.noticeText}>
                    THIS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE AUTHORITY TO INSTALL THE ITEMS. 
                    WHERE THE USER/INSTALLER PERFORMS WORK IN ACCORDANCE WITH REGULATIONS OF AN AIRWORTHINESS 
                    AUTHORITY DIFFERENT THAN THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1, IT IS ESSENTIAL 
                    THAT THE USER/INSTALLER ENSURES THAT HIS/HER AIRWORTHINESS AUTHORITY ACCEPTS ITEMS FROM 
                    THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A DO NOT 
                    CONSTITUTE INSTALLATION CERTIFICATION. IN ALL CASES AIRCRAFT MAINTENANCE RECORDS MUST CONTAIN 
                    AN INSTALLATION CERTIFICATION ISSUED IN ACCORDANCE WITH THE NATIONAL REGULATIONS BY THE 
                    USER/INSTALLER BEFORE THE AIRCRAFT MAY BE FLOWN.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => navigate(-1)}
                  >
                    <i className="fa fa-times"></i>
                    <span>Cancel</span>
                  </button>
                  <button onClick={handleSave} className={styles.btnUpdate}>
                    <Save size={18} />
                    <span>Update CA Form</span>
                  </button>
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

export default EditCAForm;