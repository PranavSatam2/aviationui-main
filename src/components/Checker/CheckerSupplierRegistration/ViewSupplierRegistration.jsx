import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useLocation } from "react-router-dom";
import GeneralTab from "../../tabs/supplier_registration/GeneralTab";
import SupplierAnalysisTab from "../../tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "../../tabs/supplier_registration/QualityProcessTab";
import IncomingInspectionTab from "../../tabs/supplier_registration/IncomingInspectionTab";
import DocAndProcControl from "../../tabs/supplier_registration/DocAndProcControl";
import MaterialAndOther from "../../tabs/supplier_registration/MaterialAndOther";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { Modal, Button, Form } from "react-bootstrap";

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

  // ######################################### HOOKS #######################################

  const [dataMap, setDataMap] = useState(formVariables);
  const [isActiveTab, setIsActiveTab] = useState(false);
  const [disabledField, setDisabledField] = useState(false);
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const location = useLocation();
  const { supplierId, supplierData } = location.state || {};

  useEffect(() => {
    const checkActiveTab = () => {
      const activeTab = document.getElementById("Proc&Other");
      setIsActiveTab(
        activeTab?.classList.contains("show") &&
          activeTab?.classList.contains("active")
      );
    };

    checkActiveTab();
    const interval = setInterval(checkActiveTab, 100);

    return () => clearInterval(interval);
  }, []);

  // Set selectedItems when supplierId is available
  useEffect(() => {
    if (supplierId) {
      setSelectedItems([supplierId]);
    }
  }, [supplierId]);

  function handleNextTab() {
    const activeTab = document.querySelector(".nav-link.active");
    const nextTab =
      activeTab.parentElement.nextElementSibling?.querySelector("a");

    if (nextTab) {
      nextTab.click();
    }
  }

  function handlePrevTab() {
    const activeTab = document.querySelector(".nav-link.active");
    const prevTab =
      activeTab.parentElement.previousElementSibling?.querySelector("a");

    if (prevTab) {
      prevTab.click();
    }
  }

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

  const handleSubmitAction = () => {
    // Add your action logic here based on actionType
    console.log(
      `Action: ${actionType}, Remark: ${remark}, Supplier ID: ${supplierId}`
    );

    // Here you would implement the actual functionality
    // For example:
    // if (actionType === "accept") {
    //   acceptSupplier(supplierId, remark);
    // } else if (actionType === "reject") {
    //   rejectSupplier(supplierId, remark);
    // } else if (actionType === "Send To Edit") {
    //   sendToEdit(supplierId, remark);
    // }

    handleCloseModal();
  };

  // ################################### FUNCTIONS ###############################

  useEffect(() => {
    // Check if supplierData and supplierId are available
    if (supplierData && supplierId) {
      setDisabledField(true);
      setDataMap((prevData) => ({
        ...prevData,
        ...supplierData, // Merge supplierData into dataMap
      }));
    }
  }, [supplierData, supplierId]);

  // These are empty function implementations to pass to child components
  // They won't do anything since we're in view-only mode
  const handleChange = () => {};
  const validateDataType = () => {};
  const validateLen = () => {};
  const errors = {};

  // ############################### RETURN-COMPONENT #############################
  return (
    <div className="wrapper">
      <Sidebar />

      <div className="content">
        <Header />
        {/* content Begin*/}
        <div style={{ marginTop: "10px", marginBottom: "4rem" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="View Supplier Registration"
            isBack={true}
          />

          {/* Content Body */}
          <div
            className="card border border-dark shadow mx-4 my-2 p-2"
            style={{ minHeight: "60vh" }}
          >
            <div className="col-md-12">
              <ul className="nav nav-tabs" id="myTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    General
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    href="#profile"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Quality Analysis
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    href="#contact"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false"
                  >
                    Quality Process
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="inspection-tab"
                    data-bs-toggle="tab"
                    href="#inspection"
                    role="tab"
                    aria-controls="inspection"
                    aria-selected="true"
                  >
                    Incoming Inspection
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="Doc&Proc-tab"
                    data-bs-toggle="tab"
                    href="#Doc&Proc"
                    role="tab"
                    aria-controls="Doc&Proc"
                    aria-selected="false"
                  >
                    Process / Document / Procurement Control
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="Proc&Other-tab"
                    data-bs-toggle="tab"
                    href="#Proc&Other"
                    role="tab"
                    aria-controls="Proc&Other"
                    aria-selected="false"
                  >
                    Measuring Equipment & Other
                  </a>
                </li>
              </ul>
              <div
                className="tab-content mt-0 border"
                id="myTabsContent"
                style={{ minHeight: "60vh" }}
              >
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  {" "}
                  <GeneralTab
                    dataMap={dataMap}
                    handleChange={handleChange}
                    validateDataType={validateDataType}
                    validateLen={validateLen}
                    errors={errors}
                    isViewOnly={true}
                    disabledField={disabledField}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  {" "}
                  <SupplierAnalysisTab
                    dataMap={dataMap}
                    handleChange={handleChange}
                    validateDataType={validateDataType}
                    validateLen={validateLen}
                    errors={errors}
                    isViewOnly={true}
                    disabledField={disabledField}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="contact"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  {" "}
                  <QualityProcessTab
                    dataMap={dataMap}
                    handleChange={handleChange}
                    validateDataType={validateDataType}
                    validateLen={validateLen}
                    errors={errors}
                    isViewOnly={true}
                    disabledField={disabledField}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="inspection"
                  role="tabpanel"
                  aria-labelledby="inspection-tab"
                >
                  {" "}
                  <IncomingInspectionTab
                    dataMap={dataMap}
                    handleChange={handleChange}
                    validateDataType={validateDataType}
                    validateLen={validateLen}
                    errors={errors}
                    isViewOnly={true}
                    disabledField={disabledField}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="Doc&Proc"
                  role="tabpanel"
                  aria-labelledby="Doc&Proc-tab"
                >
                  {" "}
                  <DocAndProcControl
                    dataMap={dataMap}
                    handleChange={handleChange}
                    validateDataType={validateDataType}
                    validateLen={validateLen}
                    errors={errors}
                    isViewOnly={true}
                    disabledField={disabledField}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="Proc&Other"
                  role="tabpanel"
                  aria-labelledby="Proc&Other-tab"
                >
                  {" "}
                  <MaterialAndOther
                    dataMap={dataMap}
                    handleChange={handleChange}
                    validateDataType={validateDataType}
                    validateLen={validateLen}
                    errors={errors}
                    isViewOnly={true}
                    disabledField={disabledField}
                  />
                </div>
              </div>
              <div className="mt-3 col-md-12 d-flex justify-content-between">
                <div>
                  <button
                    className="btn btn-outline-success mx-2"
                    onClick={() => handleShowModal("accept")}
                  >
                    <i className="fa-solid fa-check me-2"></i>
                    Approved
                  </button>
                  <button
                    className="btn btn-outline-info mx-2"
                    onClick={() => handleShowModal("Send To Edit")}
                  >
                    <i className="fa-solid fa-paper-plane me-2"></i>
                    Send To Edit
                  </button>
                  <button
                    className="btn btn-outline-danger mx-2"
                    onClick={() => handleShowModal("reject")}
                  >
                    <i className="fa-solid fa-xmark me-2"></i>
                    Reject
                  </button>
                </div>

                {/* Navigation Buttons */}
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary mx-2"
                    onClick={handlePrevTab}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextTab}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Content End */}
        <Footer />
      </div>

      {/* Accept/Reject Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "accept"
              ? "Accept Suppliers"
              : actionType === "Send To Edit"
              ? "Send To Edit"
              : "Reject Suppliers"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {actionType} {selectedItems.length}{" "}
            selected supplier{selectedItems.length !== 1 ? "s" : ""}?
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your remarks here..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant={actionType === "accept" ? "success" : "danger"}
            onClick={handleSubmitAction}
            disabled={!remark.trim()}
          >
            Confirm{" "}
            {actionType === "accept"
              ? "Accept"
              : actionType === "Send To Edit"
              ? "Send"
              : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewSupplierRegistration;
