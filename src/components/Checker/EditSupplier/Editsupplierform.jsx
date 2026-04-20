import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useNavigate } from "react-router-dom";
import GeneralTab from "../../tabs/supplier_registration/GeneralTab";
import SupplierAnalysisTab from "../../tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "../../tabs/supplier_registration/QualityProcessTab";
import IncomingInspectionTab from "../../tabs/supplier_registration/IncomingInspectionTab";
import DocAndProcControl from "../../tabs/supplier_registration/DocAndProcControl";
import MaterialAndOther from "../../tabs/supplier_registration/MaterialAndOther";
import { updateSupplier } from "../../../services/db_manager";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./EditSupplierForm.module.css";

// ─── Fields that are NEVER required ───────────────────────────────────────────
const OPTIONAL_FIELDS = [
  "faxNum",
  "workYear",
  "numEmp",
  "numOpeShift",
  "carDgcaApproval",
  "isoCertificate",
  "isoRegistrationPlans",
  "qualityManagerName",
  "qualityManagerEmailId",
  "qualityManagerPhoneNumber",
  "qualityManagerCountryCode",
  "userName",
  "userId",
  "userAction",
  "userRole",
];

// ─── Required fields mapped to each tab index ─────────────────────────────────
const TAB_REQUIRED_FIELDS = {
  0: [
    "supplierName",
    "vendorTypes",
    "paymentTerms",
    "countryCode",
    "phoneNumber",
    "email",
    "address",
    "saleRepresentativeName",
    "saleRepresentativeEmailId",
    "saleRepresentativeCountryCode",
    "saleRepresentativePhoneNumber",
  ],
  1: [
    "coreProcess",
    "isoRegistered",
    "isoStandard",
    "quaManual",
    "turnOver",
  ],
  2: [
    "independenceManuf",
    "documentedOperative",
    "documentedProcedure",
    "productShipment",
  ],
  3: [
    "processDocumented",
    "samplingIncomingInsp",
    "receivingInspectionResultsOnFile",
    "identificationMaintained",
    "sepInsMaterial",
    "nonConMaterial",
    "affectCusReq",
  ],
  4: [
    "writtenWorkInstructionsAvaibleInStation",
    "finalInspectionEvidence",
    "statisMethod",
    "suppliedDocument",
    "includeMethod",
    "qualityCapabilities",
    "approvedSupplierList",
    "marketPrice",
    "certifiedTestReports",
    "supplierOnTimeDelivery",
  ],
  5: [
    "equipCalibrated",
    "recalibration",
    "scopeOfWork",
    "safetyProgram",
    "houseKeeping",
  ],
};

// ─── Validate one specific tab, return its error map ─────────────────────────
function getErrorsForTab(tabIndex, dataMap) {
  const fields = TAB_REQUIRED_FIELDS[tabIndex] || [];
  const tabErrors = {};
  fields.forEach((key) => {
    if (!dataMap[key] || dataMap[key].toString().trim() === "") {
      tabErrors[key] = "This field is required.";
    }
  });
  return tabErrors;
}

// ─── Validate ALL tabs, return combined error map ────────────────────────────
function getAllErrors(dataMap) {
  let allErrors = {};
  Object.keys(TAB_REQUIRED_FIELDS).forEach((tabIndex) => {
    const tabErrors = getErrorsForTab(Number(tabIndex), dataMap);
    allErrors = { ...allErrors, ...tabErrors };
  });
  return allErrors;
}

const EditSupplierForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { supplierId, supplierData } = location.state || {};

  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 0, name: "General", icon: "fa-building" },
    { id: 1, name: "Quality Analysis", icon: "fa-chart-line" },
    { id: 2, name: "Quality Process", icon: "fa-cogs" },
    { id: 3, name: "Incoming Inspection", icon: "fa-clipboard-check" },
    {
      id: 4,
      name: "Process / Document / Procurement Control",
      icon: "fa-file-alt",
    },
    { id: 5, name: "Measuring Equipment & Other", icon: "fa-tools" },
  ];

  let formVariables = {
    supplierName: "",
    countryCode: "",
    vendorTypes: "",
    qualityManagerCountryCode: "",
    saleRepresentativeCountryCode: "",
    phoneNumber: "",
    faxNum: "",
    email: "",
    address: "",
    paymentTerms: "",
    qualityManagerName: "",
    qualityManagerPhoneNumber: "",
    qualityManagerEmailId: "",
    saleRepresentativeName: "",
    saleRepresentativeEmailId: "",
    saleRepresentativePhoneNumber: "",
    coreProcess: "",
    workYear: "",
    isoRegistered: "",
    isoStandard: "",
    carDgcaApproval: "",
    isoRegistrationPlans: "",
    isoCertificate: "",
    numEmp: "",
    numOpeShift: "",
    quaManual: "",
    turnOver: "",
    independenceManuf: "",
    documentedOperative: "",
    documentedProcedure: "",
    productShipment: "",
    processDocumented: "",
    samplingIncomingInsp: "",
    receivingInspectionResultsOnFile: "",
    identificationMaintained: "",
    sepInsMaterial: "",
    nonConMaterial: "",
    affectCusReq: "",
    writtenWorkInstructionsAvaibleInStation: "",
    finalInspectionEvidence: "",
    statisMethod: "",
    suppliedDocument: "",
    includeMethod: "",
    qualityCapabilities: "",
    approvedSupplierList: "",
    marketPrice: "",
    certifiedTestReports: "",
    supplierOnTimeDelivery: "",
    equipCalibrated: "",
    recalibration: "",
    scopeOfWork: "",
    safetyProgram: "",
    houseKeeping: "",
    userName: sessionStorage.getItem("username") || "",
    userId: sessionStorage.getItem("userId") || "",
    userRole: "M",
    userAction: "1",
  };

  const [dataMap, setDataMap] = useState(formVariables);

  useEffect(() => {
    if (supplierData && supplierId) {
      setDataMap((prevData) => ({
        ...prevData,
        ...supplierData,
        userId: sessionStorage.getItem("userId") || prevData.userId || "",
        userName: sessionStorage.getItem("username") || prevData.userName || "",
        userRole: prevData.userRole || "M",
        userAction: "1",
      }));
    }
  }, [supplierData, supplierId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataMap((dataMap) => ({
      ...dataMap,
      [name]: value,
    }));

    // Don't show errors for optional fields
    if (OPTIONAL_FIELDS.includes(name)) return;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]:
        !value || value.toString().trim() === ""
          ? "This field is required."
          : "",
    }));
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;

    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.]/g, "");
    } else if (dataType === "ANS-") {
      value = value.replace(/[^a-zA-Z0-9\- ]/g, "");
    }

    event.target.value = value;

    if (value.trim().length > 0) {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    } else {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    }
  };

  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen);
    event.target.value = value;
    let elementLen = value.length;

    if (elementLen === 0) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
      return;
    }

    if (elementLen > maxLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else if (elementLen < minLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    }
  }

  // ─── Next button: block navigation if current tab has unfilled required fields
  const handleNextTab = () => {
    if (activeTab >= tabs.length - 1) return;

    const tabErrors = getErrorsForTab(activeTab, dataMap);
    if (Object.keys(tabErrors).length > 0) {
      setErrors(tabErrors);
      toast.error("Please fill all required fields before proceeding.");
      return;
    }

    // Clear errors and move forward
    setErrors({});
    setActiveTab(activeTab + 1);
  };

  const handlePrevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  // ─── Tab header click: validate current tab first, block if errors exist ─────
  const handleTabClick = (targetIndex) => {
    if (targetIndex === activeTab) return;

    const leavingErrors = getErrorsForTab(activeTab, dataMap);
    if (Object.keys(leavingErrors).length > 0) {
      setErrors(leavingErrors);
      toast.error("Please fill all required fields before proceeding.");
      return;
    }

    // Clear errors and allow tab switch
    setErrors({});
    setActiveTab(targetIndex);
  };

  async function actionPerformed(action) {
    if (action === "clear") {
      const clearedData = {
        ...Object.keys(formVariables).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {}),
        userId: sessionStorage.getItem("userId") || "",
        userName: sessionStorage.getItem("username") || "",
        userRole: "M",
        userAction: "1",
      };

      setDataMap(clearedData);
      setErrors({});
      toast.info("Form cleared");
      return;
    }

    const allErrors = getAllErrors(dataMap);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let supplierDataToUpdate = {
        ...dataMap,
        userId: sessionStorage.getItem("userId") || dataMap.userId || "",
        userName: sessionStorage.getItem("username") || dataMap.userName || "",
        userRole: "M",
        userAction: "1",
      };
      let response = await updateSupplier(supplierId, supplierDataToUpdate);
      if (response) {
        toast.success("Supplier updated successfully");
        navigate("/editsupplier");
      } else if (response?.error) {
        toast.error(response.error.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update supplier"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderTabContent = () => {
    const tabProps = {
      dataMap,
      handleChange,
      validateDataType,
      validateLen,
      errors,
    };

    switch (activeTab) {
      case 0:
        return <GeneralTab {...tabProps} />;
      case 1:
        return <SupplierAnalysisTab {...tabProps} />;
      case 2:
        return <QualityProcessTab {...tabProps} />;
      case 3:
        return <IncomingInspectionTab {...tabProps} />;
      case 4:
        return <DocAndProcControl {...tabProps} />;
      case 5:
        return (
          <MaterialAndOther {...tabProps} actionPerformed={actionPerformed} />
        );
      default:
        return null;
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
            <button
              className={styles.backButton}
              onClick={() => navigate("/editsupplier")}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>
                Edit Supplier Registration
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              {/* Tab Navigation */}
              <div className={styles.tabNavigation}>
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`${styles.tabButton} ${
                      activeTab === index ? styles.activeTab : ""
                    }`}
                    onClick={() => handleTabClick(index)}
                  >
                    <i className={`fa ${tab.icon}`}></i>
                    <span className={styles.tabName}>{tab.name}</span>
                    {activeTab === index && (
                      <div className={styles.activeIndicator}></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className={styles.tabContent}>{renderTabContent()}</div>

              {/* Action Buttons */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.btnClear}
                  onClick={() => actionPerformed("clear")}
                  disabled={isSubmitting}
                >
                  <i className="fa fa-eraser"></i>
                  <span>Clear</span>
                </button>

                <div className={styles.navigationButtons}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handlePrevTab}
                    disabled={activeTab === 0 || isSubmitting}
                  >
                    <i className="fa fa-chevron-left"></i>
                    <span>Previous</span>
                  </button>

                  {activeTab < tabs.length - 1 ? (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleNextTab}
                      disabled={isSubmitting}
                    >
                      <span>Next</span>
                      <i className="fa fa-chevron-right"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.btnSubmit}
                      onClick={() => actionPerformed("submit")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className={styles.spinner}></span>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa fa-check"></i>
                          <span>Update</span>
                        </>
                      )}
                    </button>
                  )}
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

export default EditSupplierForm;