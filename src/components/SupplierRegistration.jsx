import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import GeneralTab from "./tabs/supplier_registration/GeneralTab";
import SupplierAnalysisTab from "./tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "./tabs/supplier_registration/QualityProcessTab";
import IncomingInspectionTab from "./tabs/supplier_registration/IncomingInspectionTab";
import DocAndProcControl from "./tabs/supplier_registration/DocAndProcControl";
import MaterialAndOther from "./tabs/supplier_registration/MaterialAndOther";
import { createSupplier, updateSupplier } from "../services/db_manager";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { error } from "jquery";
const SupplierRegistration = () => {
  // Variables
  const navigate = useNavigate();
  let formVariavles = {
    supplierName: "",
    vendorTypes: "",
    // formId               : '',
    countryCode: "",
    qualityManagerCountryCode: "", // Add this
    saleRepresentativeCountryCode: "", // Add this
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
    // areYouIsoRegistered: "",
    isoRegistered: "",
    //ontKnow              : '',
    isoStandard: "",
    carDgcaApproval: "",
    isoRegistrationPlans: "",
    isoCertificate: "",
    //registerCar           : '',
    numEmp: "",
    numOpeShift: "",
    quaManual: "",
    turnOver: "",
    paymentTerms: "",
    independenceManuf: "",
    documentedOperative: "",
    documentedProcedure: "",
    productShipment: "",
    processDocumented: "",
    samplingIncomingInsp: "",
    receivingInspectionResultsOnFile: "", //ObjectiveEvidence     : '',
    //arApproval           : '',
    identificationMaintained: "",
    sepInsMaterial: "",
    nonConMaterial: "",
    affectCusReq: "",
    writtenWorkInstructionsAvaibleInStation: "",
    //nstructionStation    : '',
    finalInspectionEvidence: "",
    //documentedOperative   : '',
    //inalInsAcc           : '',
    statisMethod: "",
    suppliedDocument: "",
    includeMethod: "",
    qualityCapabilities: "",
    approvedSupplierList: "",
    marketPrice: "",
    certifiedTestReports: "",
    //  certifiedReport       : '',
    supplierOnTimeDelivery: "",
    // supplierCapable       : '',
    equipCalibrated: "",
    recalibration: "",
    scopeOfWork: "",
    safetyProgram: "",
    houseKeeping: "",
    userName: "Hrishikesh",
    userId: "10",
    userAction: "1",
    userRole: "M",
  };

  // ######################################### HOOK #######################################

  const [dataMap, setDataMap] = useState(formVariavles);

  const [errors, setErrors] = useState({});

  const location = useLocation();
  const { supplierId, supplierData } = location.state || {};
  const [invalidFeedback, setInvalidFeedback] = useState("d-none text-danger ");
  const [invalidFeedbackMsg, setInvalidFeedbackMsg] = useState("");
  const [isActiveTab, setIsActiveTab] = useState(false);

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
  let msg = {
    invalidFld: "*Please enter all mandatory fields",
    dataSaved: "Data saved successfully",
  };
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
  // ################################## HOOK-FUNCTION ###########################

  // This function is used to save Form data
  async function actionPerformed(action) {
    if (action === "clear") {
      let keys = Object.keys(formVariavles);
      keys.forEach((key) => {
        formVariavles[key] = "";
      });
      setDataMap(formVariavles);
      setErrors({});
      return;
    }
    const missingFields = getMissingFields();
    if (Object.keys(missingFields).length > 0) {
      console.log(missingFields), "missingFields";

      setErrors(missingFields);
      setInvalidFeedback("text-danger col-md-4");
      setInvalidFeedbackMsg(msg.invalidFld);
      toast.error("Please fill all required fields");
      return;
    }

    console.log("✅ VALIDATION PASSED - Proceeding with submission");
    setErrors({});

    try {
      let response = await createSupplier(dataMap);
      if (response) {
        toast.success("Supplier Added successfully");
        setDataMap(formVariavles);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (response?.error) {
        toast.error(response.error.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create supplier"
      );
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
          // "vendorTypes"
        ].includes(key)
      ) {
        errorMessages[key] = "This field is required.";
      }
    }

    return errorMessages;
  }

  // ################################### FUNCTIONS ###############################

  useEffect(() => {
    // Check if supplierData and supplierId are available
    if (supplierData && supplierId) {
      setDataMap((prevData) => ({
        ...prevData,
        ...supplierData, // Merge supplierData into dataMap
      }));
    }
  }, [supplierData, supplierId]);

  // This functiom handle all change event's
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
          "vendorTypes"
        ].includes(name)
          ? "This field is required."
          : "",
    }));
  };

  // Removed unused isAllFldValidated

  // ########################### VALIDATION ################################

  // This function validate the dataType
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

    // ✅ Only mark as valid if value is not empty
    if (value.trim().length > 0) {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    } else {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    }
  };

  // ✅ This function validates the length of field
  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen);
    event.target.value = value;
    let elementLen = value.length;

    // 👇 Extra check: if field is empty, mark invalid
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
  // Removed unused isDisabled updater
  // ############################### RETURN-COMPONENT #############################
  return (
    <div className="wrapper ">
      <Sidebar />

      <div className="content">
        <Header />
        {/* conetnt Begin*/}
        <div style={{ marginTop: "10px", marginBottom: "4rem" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Supplier Registration"
            isBack={true}
          />

          {/* Content heading */}
          {/* <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-2">
            <h5 className="h5 mx-3 mb-0 text-gray-800">
              Supplier Registration
            </h5>
          </div>
        </div> */}

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
                    actionPerformed={actionPerformed}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="mt-3 col-md-12 d-flex justify-content-end">
                <p className={invalidFeedback}>{invalidFeedbackMsg}</p>

                {/* <div className="col-md-8 text-right align-items-end"> */}
                <button
                  type="button"
                  className="btn btn-warning mx-2"
                  onClick={() => actionPerformed("clear")}
                >
                  Clear
                </button>
                {/* </div> */}
                <button
                  type="button"
                  className="btn btn-secondary mx-2"
                  onClick={handlePrevTab}
                >
                  Previous
                </button>
                {!isActiveTab && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextTab}
                  >
                    Next
                  </button>
                )}
                {isActiveTab && (
                  <button
                    type="button"
                    className="btn btn-success mx-2"
                    onClick={() => actionPerformed("submit")}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Content End */}
        <Footer />
      </div>
    </div>
  );
};

export default SupplierRegistration;
