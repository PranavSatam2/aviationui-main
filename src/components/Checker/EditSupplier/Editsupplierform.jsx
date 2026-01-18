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
    userName: "Hrishikesh",
    userId: "10",
    userRole: "M",
    userAction: "1",
  };

  const [dataMap, setDataMap] = useState(formVariables);

  useEffect(() => {
    if (supplierData && supplierId) {
      setDataMap((prevData) => ({
        ...prevData,
        ...supplierData,
      }));
    }
  }, [supplierData, supplierId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataMap((dataMap) => ({
      ...dataMap,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]:
        value.trim() === "" &&
        ![
          "faxNum",
          "workYear",
          "numEmp",
          "numOpeShift",
          "rev",
          "sysdate",
          "remark",
          "carDgcaApproval",
          "isoCertificate",
          "qualityManagerName",
          "qualityManagerEmailId",
          "qualityManagerPhoneNumber",
          "qualityManagerCountryCode",
          "paymentTerms",
          "vendorTypes",
        ].includes(name)
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

  function getMissingFields() {
    let errorMessages = {};
    let keys = Object.keys(dataMap);

    for (let key of keys) {
      if (
        !dataMap[key] &&
        ![
          "faxNum",
          "workYear",
          "numEmp",
          "numOpeShift",
          "rev",
          "sysdate",
          "remark",
          "carDgcaApproval",
          "isoCertificate",
          "qualityManagerName",
          "qualityManagerEmailId",
          "qualityManagerPhoneNumber",
          "qualityManagerCountryCode",
          "isoRegistrationPlans",
        ].includes(key)
      ) {
        errorMessages[key] = "This field is required.";
      }
    }

    return errorMessages;
  }

  const handleNextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  async function actionPerformed(action) {
    if (action === "clear") {
      let keys = Object.keys(formVariables);
      keys.forEach((key) => {
        formVariables[key] = "";
      });
      setDataMap(formVariables);
      setErrors({});
      toast.info("Form cleared");
      return;
    }

    const missingFields = getMissingFields();
    if (Object.keys(missingFields).length > 0) {
      console.log(missingFields, "miss");
      setErrors(missingFields);
      toast.error("Please fill all required fields");
      return;
    }

    console.log("✅ VALIDATION PASSED - Proceeding with update");
    setIsSubmitting(true);
    setErrors({});

    try {
      let supplierDataToUpdate = {
        ...dataMap,
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
                    onClick={() => setActiveTab(index)}
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