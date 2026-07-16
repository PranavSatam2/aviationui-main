import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralTab from "../../tabs/supplier_registration/GeneralTab";
import SupplierAnalysisTab from "../../tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "../../tabs/supplier_registration/QualityProcessTab";
import IncomingInspectionTab from "../../tabs/supplier_registration/IncomingInspectionTab";
import DocAndProcControl from "../../tabs/supplier_registration/DocAndProcControl";
import MaterialAndOther from "../../tabs/supplier_registration/MaterialAndOther";
import { ApproveSupplier } from "../../../services/db_manager";
import { toast } from "react-toastify";
import styles from "./ViewSupplierRegistration.module.css";

const ViewSupplierRegistration = () => {
  // Variables
  let formVariables = {
    supplierName: "",
    phoneNumber: "",
    faxNum: "",
    email: "",
    address: "",
    qualityManagerName: "",
    qualityManagerPhoneNumber: "",
    qualityManagerEmailId: "",
    saleRepresentativeName: "",
    saleRepresentativeEmailId: "",
    saleRepresentativePhoneNumber: "",
    coreProcess: "",
    workYear: "",
    areYouIsoRegistered: "",
    isoRegistered: "",
    isoStandard: "",
    carDgcaApproval: "",
    isoRegistrationPlans: "",
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
  };

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

  // ######################################### HOOKS #######################################

  const [dataMap, setDataMap] = useState(formVariables);
  const [activeTab, setActiveTab] = useState(0);
  const [disabledField, setDisabledField] = useState(false);
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { supplierId, supplierData } = location.state || {};

  // Set selectedItems when supplierId is available
  useEffect(() => {
    if (supplierId) {
      setSelectedItems([supplierId]);
    }
  }, [supplierId]);

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

  // Modal handlers
  const handleShowModal = (action) => {
    setActionType(action);
    setRemark("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActionType("");
    setRemark("");
  };

  const handleSubmitAction = async () => {
    const action = actionType === "accept" ? "accepted" : "rejected";
    const updatedSupplierData = {
      ...supplierData,
      remark: remark,
      userRole: "QM",
      userAction: action === "rejected" ? "3" : "2",
    };
    try {
      const response = await ApproveSupplier(updatedSupplierData);
      toast.success(`Supplier action successfully`);
      navigate(-1);
    } catch (error) {
      console.error("Error fetching supplier details: ", error);
      toast.error("Failed to fetch supplier details");
    }

    setRemark("");
    handleCloseModal();
  };

  // ################################### FUNCTIONS ###############################

  useEffect(() => {
    if (supplierData && supplierId) {
      setDisabledField(true);
      setDataMap((prevData) => ({
        ...prevData,
        ...supplierData,
      }));
    }
  }, [supplierData, supplierId]);

  const handleChange = () => {};
  const validateDataType = () => {};
  const validateLen = () => {};
  const errors = {};

  const renderTabContent = () => {
    const tabProps = {
      dataMap,
      handleChange,
      validateDataType,
      validateLen,
      errors,
      isViewOnly: true,
      disabledField,
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
        return <MaterialAndOther {...tabProps} />;
      default:
        return null;
    }
  };

  // ############################### RETURN-COMPONENT #############################
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
              <span className={styles.breadcrumbLabel}>
                View Supplier Registration
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
              <div className={styles.actionSection}>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.btnApprove}
                    onClick={() => handleShowModal("accept")}
                  >
                    <i className="fa fa-check"></i>
                    <span>Approve</span>
                  </button>
                  <button
                    className={styles.btnSendToEdit}
                    onClick={() => handleShowModal("Send To Edit")}
                  >
                    <i className="fa fa-paper-plane"></i>
                    <span>Send To Edit</span>
                  </button>
                  <button
                    className={styles.btnReject}
                    onClick={() => handleShowModal("reject")}
                  >
                    <i className="fa fa-times"></i>
                    <span>Reject</span>
                  </button>
                </div>

                {/* Navigation Buttons */}
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.btnSecondary}
                    onClick={handlePrevTab}
                    disabled={activeTab === 0}
                  >
                    <i className="fa fa-chevron-left"></i>
                    <span>Previous</span>
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleNextTab}
                    disabled={activeTab === tabs.length - 1}
                  >
                    <span>Next</span>
                    <i className="fa fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>
                {actionType === "accept"
                  ? "Accept Supplier"
                  : actionType === "Send To Edit"
                  ? "Send To Edit"
                  : "Reject Supplier"}
              </h5>
              <button
                className={styles.modalCloseButton}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                Are you sure you want to {actionType} {selectedItems.length}{" "}
                selected supplier{selectedItems.length !== 1 ? "s" : ""}?
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Remark</label>
                <textarea
                  className={styles.formTextarea}
                  rows={4}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remarks here..."
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnModalSecondary}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className={`${styles.btnModalConfirm} ${
                  actionType === "reject" ? styles.btnModalDanger : ""
                }`}
                onClick={handleSubmitAction}
                disabled={!remark.trim()}
              >
                Confirm{" "}
                {actionType === "accept"
                  ? "Accept"
                  : actionType === "Send To Edit"
                  ? "Send"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSupplierRegistration;