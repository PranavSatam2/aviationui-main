// import { useEffect, useState } from "react";
import styles from "./PrintSupplier.module.css";

export const PrintableGeneralTab = (dataMap) => {
  const data = dataMap["dataMap"] || {};
  
  return (
    <div id="printContainer " className={styles.container}>
      <div id="printableContent" className={styles.printContainer}>
        {/* Header Section */}
        <div style={{ display: "flex", border: "1px solid black", marginBottom: "15px" }}>
          <div style={{ width: "20%", padding: "10px", borderRight: "1px solid black", fontWeight: "bold" }}>
            amc
          </div>
          <div style={{ width: "55%", textAlign: "center", padding: "10px", fontWeight: "bold", fontSize: "16px", borderRight: "1px solid black" }}>
            SUPPLIER / SUB-CONTRACTOR EVALUATION FORM
          </div>
          <div style={{ width: "25%", padding: "10px" }}>
            <div>Form: AMC-29</div>
            <div>Rev.: 00</div>
            <div>Date: Jan 2021</div>
          </div>
        </div>

        {/* General Information Section */}
        <div style={{ marginBottom: "20px", border: "1px solid black", padding: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ width: "60%" }}>
              <strong>Supplier Name:</strong> {data.supplierName || "N/A"}
            </div>
            <div style={{ width: "40%" }}>
              <strong>Date:</strong> {data.date || new Date().toLocaleDateString()}
            </div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Address:</strong> {data.address || "N/A"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ width: "33%" }}>
              <strong>Phone:</strong> {data.countryCode || ""} {data.phoneNumber || "N/A"}
            </div>
            <div style={{ width: "33%" }}>
              <strong>Fax:</strong> {data.faxNum || "N/A"}
            </div>
            <div style={{ width: "33%" }}>
              <strong>Email:</strong> {data.email || "N/A"}
            </div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Payment Terms:</strong> {data.paymentTerms ? `${data.paymentTerms} ${data.paymentTerms !== "Advance Pay" ? "Days" : ""}` : "N/A"}
          </div>
          <div style={{ marginBottom: "10px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Quality Manager Contact:</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "33%" }}>
                <strong>Name:</strong> {data.qualityManagerName || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Phone:</strong> {data.qualityManagerCountryCode || ""} {data.qualityManagerPhoneNumber || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Email:</strong> {data.qualityManagerEmailId || "N/A"}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Sales Representative Contact:</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "33%" }}>
                <strong>Name:</strong> {data.saleRepresentativeName || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Phone:</strong> {data.saleRepresentativeCountryCode || ""} {data.saleRepresentativePhoneNumber || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Email:</strong> {data.saleRepresentativeEmailId || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Analysis Section - Compact Grid */}
        <div style={{ border: "1px solid black", marginBottom: "15px" }}>
          <div style={{ padding: "8px", fontWeight: "bold", textAlign: "center", backgroundColor: "#f5f5f5", borderBottom: "1px solid black" }}>
            SUPPLIER ANALYSIS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px 10px", padding: "8px", fontSize: "0.85em" }}>
            <div><strong>1) Core products/Process:</strong><br/>{data.coreProcess || "N/A"}</div>
            <div><strong>2) Years in Business:</strong><br/>{data.workYear || "N/A"} years</div>
            <div><strong>3) ISO Registered?</strong><br/>{data.isoRegistered || "N/A"}</div>
            <div><strong>4) ISO Standard:</strong><br/>{data.isoStandard || "N/A"}</div>
            <div><strong>5) ISO Certificate:</strong><br/>{data.isoCertificate || "N/A"}</div>
            <div><strong>6) CAR 145 / DGCA Approval:</strong><br/>{data.carDgcaApproval || "N/A"}</div>
            <div><strong>7) ISO Registration Plans:</strong><br/>{data.isoRegistrationPlans || "N/A"}</div>
            <div><strong>8) Total Employees:</strong><br/>{data.numEmp || "N/A"}</div>
            <div><strong>9) Operating Shifts:</strong><br/>{data.numOpeShift || "N/A"}</div>
            <div><strong>10) Quality Manual Available?</strong><br/>{data.quaManual || "N/A"}</div>
            <div><strong>11) Annual Turnover (INR):</strong><br/>{data.turnOver || "N/A"}</div>
          </div>
        </div>

        {/* Quality Process Section */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ border: "1px solid black", borderBottom: "none", padding: "8px", fontWeight: "bold", textAlign: "center", backgroundColor: "#f5f5f5" }}>
            QUALITY PROCESS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px", width: "70%", textAlign: "left", borderBottom: "1px solid black", borderRight: "1px solid black" }}>QMS</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>YES</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>NO</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black" }}>N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Does quality assurance have independence from Mfg.?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.independenceManuf === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.independenceManuf === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.independenceManuf === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Do you have documented operative system for internal & external Corrective & preventive actions</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.documentedOperative === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.documentedOperative === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.documentedOperative === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are there documented procedure for identification, collection, filing, Storage & maintenance of Quality records?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.documentedProcedure === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.documentedProcedure === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.documentedProcedure === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Does your system assure that product shipped meets customers applicable revision of specifications</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.productShipment === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.productShipment === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.productShipment === "N/A" ? "✓" : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Incoming Inspection Section */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ border: "1px solid black", borderBottom: "none", padding: "8px", fontWeight: "bold", textAlign: "center", backgroundColor: "#f5f5f5" }}>
            INCOMING INSPECTION
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px", width: "70%", textAlign: "left", borderBottom: "1px solid black", borderRight: "1px solid black" }}>Questions</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>YES</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>NO</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black" }}>N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is incoming process documented?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.processDocumented === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.processDocumented === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.processDocumented === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>What sampling plan is used for incoming inspection?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.samplingIncomingInsp === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.samplingIncomingInsp === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.samplingIncomingInsp === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is objective evidence of receiving inspection results maintained on file?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.receivingInspectionResultsOnFile === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.receivingInspectionResultsOnFile === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.receivingInspectionResultsOnFile === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is lot number or other traceability identification maintained?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.identificationMaintained === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.identificationMaintained === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.identificationMaintained === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is incoming material kept separate from inspected material?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.sepInsMaterial === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.sepInsMaterial === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.sepInsMaterial === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is there any procedure for isolating nonconforming material?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.nonConMaterial === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.nonConMaterial === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.nonConMaterial === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are deviations that affect the customer's requirement referred to customers for disposition?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.affectCusReq === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.affectCusReq === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.affectCusReq === "N/A" ? "✓" : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Process/Document/Procurement Control Section */}
        <div style={{ marginBottom: "15px"}}>
          <div style={{ border: "1px solid black", borderBottom: "none", padding: "8px", fontWeight: "bold", textAlign: "center", backgroundColor: "#f5f5f5" }}>
            PROCESS / DOCUMENT / PROCUREMENT CONTROL
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px", width: "70%", textAlign: "left", borderBottom: "1px solid black", borderRight: "1px solid black" }}>Questions</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>YES</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>NO</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black" }}>N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are written work instructions available at work stations?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.writtenWorkInstructionsAvaibleInStation === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.writtenWorkInstructionsAvaibleInStation === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.writtenWorkInstructionsAvaibleInStation === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Does the finished product show evidence of final inspection acceptance?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.finalInspectionEvidence === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.finalInspectionEvidence === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.finalInspectionEvidence === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are statistical methods used to control the process?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.statisMethod === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.statisMethod === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.statisMethod === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are procedures in place for control of customer-supplied documents?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.suppliedDocument === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.suppliedDocument === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.suppliedDocument === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Does range procedure include a method for handling revision changes & obsolete documents?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.includeMethod === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.includeMethod === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.includeMethod === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are quality capabilities of suppliers evaluated prior to procurement?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.qualityCapabilities === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.qualityCapabilities === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.qualityCapabilities === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Do you have an approved supplier list?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.approvedSupplierList === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.approvedSupplierList === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.approvedSupplierList === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is the supplier competent with respect to market price?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.marketPrice === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.marketPrice === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.marketPrice === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are certified test reports & certifications of conformance obtained on purchased material?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.certifiedTestReports === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.certifiedTestReports === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.certifiedTestReports === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is the supplier capable of on-time delivery?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.supplierOnTimeDelivery === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.supplierOnTimeDelivery === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.supplierOnTimeDelivery === "N/A" ? "✓" : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Material and Other Section */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ border: "1px solid black", borderBottom: "none", padding: "8px", fontWeight: "bold", textAlign: "center", backgroundColor: "#f5f5f5" }}>
            MATERIAL AND OTHER
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px", width: "70%", textAlign: "left", borderBottom: "1px solid black", borderRight: "1px solid black" }}>Questions</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>YES</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black", borderRight: "1px solid black" }}>NO</th>
                <th style={{ padding: "6px", width: "10%", textAlign: "center", borderBottom: "1px solid black" }}>N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are equipment calibrated?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.equipCalibrated === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.equipCalibrated === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.equipCalibrated === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are gauges and test equipment periodically certified, and are records maintained for frequency of recalibration?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.recalibration === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.recalibration === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.recalibration === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Are gauges, test equipment available and sufficient for our scope of work?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.scopeOfWork === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.scopeOfWork === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.scopeOfWork === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is there adequate area & safety programs in place?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.safetyProgram === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.safetyProgram === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.safetyProgram === "N/A" ? "✓" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px", borderRight: "1px solid black", borderBottom: "1px solid black" }}>Is there a procedure in place for housekeeping?</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.houseKeeping === "Yes" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderRight: "1px solid black", borderBottom: "1px solid black" }}>{data.houseKeeping === "No" ? "✓" : ""}</td>
                <td style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid black" }}>{data.houseKeeping === "N/A" ? "✓" : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Internal Use Section */}
        <div style={{ marginTop: "30px", borderTop: "1px solid black", paddingTop: "10px" }}>
          <div style={{ marginBottom: "10px", fontWeight: "bold" }}>FOR AMC TECHNOLOGY INTERNAL USE</div>
          <div style={{ marginBottom: "10px" }}>Approval to vendor (Yes / No): _________________</div>
          <div style={{ marginBottom: "20px" }}>Remark (If Any): _______________________________</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
            <div>Quality Manager</div>
            <div>Date: ________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};