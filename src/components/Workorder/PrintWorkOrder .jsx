import React from "react";
import "./PrintWorkOrder.css";

const PrintWorkOrder = ({ workOrderData }) => {
  if (!workOrderData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Default work order steps if not provided
  const defaultWorkSteps = [
    {
      srNo: 1,
      detail: "INCOMING INSPECTION:\na) Carry out visual inspection of the unit at the time of receipt for any physical damage, missing parts, documents and any other aspect.\nb) Report any discrepancy noticed to shop QC for further action and disposition.\nc) Check SB compliance.\nRecord TSN-CSN:"
    },
    { srNo: 2, detail: "Test unit to confirm the defect as per CMM." },
    { srNo: 3, detail: "Disassembly as per CMM." },
    { srNo: 4, detail: "Cleaning as per CMM." },
    { srNo: 5, detail: "Inspection/Check as per CMM." },
    { srNo: 6, detail: "Troubleshooting as per CMM." },
    { srNo: 7, detail: "Repair as per CMM." },
    { srNo: 8, detail: "Assembly as per CMM." },
    { srNo: 9, detail: "Test unit as per CMM." },
    { srNo: 10, detail: "Fits and Clearances as per CMM." },
    { srNo: 11, detail: "Final Inspection" }
  ];

  const workSteps = workOrderData.workOrderSteps?.length > 0 
    ? workOrderData.workOrderSteps 
    : defaultWorkSteps;

  const materialRequisitions = workOrderData.materialRequisitions || [];

  return (
    <div className="print-container">
      <div className="print-workorder">
        {/* Header Section */}
        <div className="print-header">
          <div className="header-left">
            <div className="company-logo">
              {/* Add your company logo here */}
              <div className="logo-placeholder">LOGO</div>
            </div>
          </div>
          <div className="header-center">
            <h1 className="form-title">WORKORDER</h1>
          </div>
          <div className="header-right">
            <div className="form-info">
              <div>Form: AMC 7A</div>
              <div>Rev: 01</div>
              <div>Date: {formatDate(new Date())}</div>
            </div>
          </div>
        </div>

        {/* Work Order Details Section */}
        <div className="details-section">
          <table className="details-table">
            <tbody>
              <tr>
                <td className="label">Work Order Number:</td>
                <td className="value">{workOrderData.workOrderNo || ""}</td>
                <td className="label">Repair Order #:</td>
                <td className="value">{workOrderData.repairOrderNo || ""}</td>
                <td className="label">Issue Date:</td>
                <td className="value">{formatDate(workOrderData.issueDate)}</td>
                <td className="label">Date:</td>
                <td className="value"></td>
              </tr>
              <tr>
                <td className="label">Customer Name:</td>
                <td className="value" colSpan="3">{workOrderData.customerName || ""}</td>
                <td className="label">Qty:</td>
                <td className="value">{workOrderData.qty || ""}</td>
                <td className="label"></td>
                <td className="value"></td>
              </tr>
              <tr>
                <td className="label">Description:</td>
                <td className="value" colSpan="3">{workOrderData.description || ""}</td>
                <td className="label">CMM Ref:</td>
                <td className="value">{workOrderData.cmmRefNo || ""}</td>
                <td className="label"></td>
                <td className="value"></td>
              </tr>
              <tr>
                <td className="label">S/N, B/N:</td>
                <td className="value" colSpan="3">{workOrderData.snBn || ""}</td>
                <td className="label">Rev No.:</td>
                <td className="value">{workOrderData.revNo || ""}</td>
                <td className="label">Date:</td>
                <td className="value">{formatDate(workOrderData.cmmRevDate)}</td>
              </tr>
              <tr>
                <td className="label">Workshop Manager Remarks:</td>
                <td className="value" colSpan="7">{workOrderData.workshopManagerRemarks || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Issued By Section */}
        <div className="issued-section">
          <span className="label">Issued By:</span>
          <span className="value">{workOrderData.issuedBy || "Workshop Manager"}</span>
          <div className="signature-box">
            <div className="signature-label">Signature & Date</div>
          </div>
        </div>

        {/* Work Details Table */}
        <div className="work-details-section">
          <table className="work-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>Sr. No.</th>
                <th style={{ width: "60%" }}>Detail of Work done</th>
                <th style={{ width: "15%" }}>Technician Sign & Date</th>
                <th style={{ width: "20%" }}>Certifying Staff Sign/Stamp & Date</th>
              </tr>
            </thead>
            <tbody>
              {workSteps.map((step, index) => (
                <tr key={index}>
                  <td className="center">{step.srNo || index + 1}</td>
                  <td className="work-detail">{step.detail || step.description || ""}</td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="action-row">
                  <strong>Action:</strong> {workOrderData.actionTaken || ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Certifying Staff Section */}
        <div className="certifying-section">
          <span className="label">Certifying Staff Sign/Stamp:</span>
          <span className="value"></span>
          <span className="date-label">Date:</span>
          <span className="date-value"></span>
        </div>

        {/* Material Requisition Section */}
        <div className="material-section">
          <div className="section-header">
            <span className="label">Material Requisition Slip #</span>
          </div>
          <table className="material-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>S/No.</th>
                <th style={{ width: "35%" }}>Description</th>
                <th style={{ width: "20%" }}>Part No.</th>
                <th style={{ width: "15%" }}>S/N, B/N</th>
                <th style={{ width: "10%" }}>Qty.</th>
                <th style={{ width: "10%" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {materialRequisitions.length > 0 ? (
                materialRequisitions.map((item, index) => (
                  <tr key={index}>
                    <td className="center">{item.srNo || index + 1}</td>
                    <td>{item.description || ""}</td>
                    <td>{item.partNo || ""}</td>
                    <td>{item.snbn || ""}</td>
                    <td className="center">{item.qty || ""}</td>
                    <td>{item.remarks || ""}</td>
                  </tr>
                ))
              ) : (
                // Empty rows for manual filling
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="center">{index + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tools Section */}
        <div className="tools-section">
          <div className="tools-row">
            <span className="label">Tools:</span>
            <span className="value">{workOrderData.toolsUsed || ""}</span>
          </div>
          <div className="tools-row">
            <span className="label">Man Hour - Certifying Staff:</span>
            <span className="value">{workOrderData.certifyingStaffhours || ""}</span>
            <span className="label ml-20">Technician:</span>
            <span className="value">{workOrderData.technician || ""}</span>
            <span className="label ml-20">Total Manhour:</span>
            <span className="value">{workOrderData.totalManHour || ""}</span>
          </div>
        </div>

        {/* Certification Statement */}
        <div className="certification-section">
          <p>
            This is Certified that the Task specified above has been carried out according to given CMM ref. and meet the requirement of DGCA
            and is ready for release to Service/ CA Form 1 i.a.w. CAR 145.50
          </p>
          <div className="verification-text">
            All Documents has been Scrutinized & Verified
          </div>
        </div>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="signature-box">
            <div className="signature-title">Workshop Manager</div>
            <div className="signature-line">Date & Sign</div>
            <div className="signature-date">{formatDate(workOrderData.workshopManagerSignDate)}</div>
          </div>
          <div className="signature-box">
            <div className="signature-title">Quality Manager</div>
            <div className="signature-line">Date & Sign</div>
            <div className="signature-date">{formatDate(workOrderData.qualityManagerSignDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintWorkOrder;