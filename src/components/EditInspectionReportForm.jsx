import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { updateReport } from "../services/db_manager";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditInspectionReportform = () => {
  const location = useLocation();
  const { reportId ,reportData } = location.state || "";
 const navigate = useNavigate();
  const [form, setForm] = useState({
    partNumber: "",
    partDesc: "",
    purchaseOrderNo: "",
    supplierName: "",
    reportNo: "",
    date: "",
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

  useEffect(() => {
      
      if (reportData && reportId) {
        let lotAcceptedValue = reportData.lotAccepted || "";
        let deviationDateValue = "";

    // If "With Deviation | date" → split into two values
    if (lotAcceptedValue.includes("|")) {
      const parts = lotAcceptedValue.split("|");
      lotAcceptedValue = parts[0].trim();       // "With Deviation"
      deviationDateValue = parts[1].trim();     // "2025-09-29"
    }

    setForm((prevData) => ({
      ...prevData,
      ...reportData,
      lotAccepted: lotAcceptedValue,
      deviationDate: deviationDateValue,
    }));
        
      }
    }, [reportData, reportId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updateReportData={
              ...form,
              lotAccepted: form.lotAccepted === "With Deviation" && form.deviationDate
              ? `${form.lotAccepted} | ${form.deviationDate}`
              : form.lotAccepted,
              userAction:'1',
              makerUserName: sessionStorage.getItem('username'),
              makerDate: new Date().toISOString().split('T')[0],
              userRole: sessionStorage.getItem('roleId'),
          }
          console.log("Id :",reportId);
            let response = await updateReport(reportId, updateReportData);
            if (response) {
              navigate("/editReport");
              toast.success("Report updated successfully");
            }
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report.");
    }
  };

  return (

        <div className="wrapper">
          <Sidebar />
          <div className="content">
            <Header />
            <div style={{ marginTop: "10px" }}>
              <CustomBreadcrumb
                breadcrumbsLabel="Edit Receiving Inspection Report Form"
                            isBack={true}
              />
    
              <div className="my-2 p-2">
                <div className="container-fluid">
                  <div
                    className="row mx-1 card border border-dark shadow-lg py-2"
                    style={{ minHeight: "397px" }}
                  >
                    <div className="col-md-12">
                      <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                        <div className="col-md-12 p-2 d-flex">
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">MRO No.</label>
                            <input
                              className="form-control w-100"
                              type="text"
                              name="reportNo"
                              value={form.reportNo}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Part Number</label>
                            <input
                              className="form-control w-100"
                              type="text"
                              name="partNumber"
                              value={form.partNumber}
                              onChange={handleChange}
                              disabled
                            />
                        </div>
                        </div>
    
                        <hr className="mx-0 my-2 p-0 border" />
    
                        <div className="col-md-12 p-3 d-flex">
                          <label className="col-md-2 mt-2">Part Description</label>
                          <input
                              className="form-control w-100"
                              type="text"
                              name="partDesc"
                              value={form.partDesc}
                              onChange={handleChange}
                              disabled
                            />
                        </div>
    
                        <div className="col-md-12 d-flex">
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Purchase Order No.</label>
                            <input
                              className="form-control w-100"
                              type="text"
                              name="purchaseOrderNo"
                              value={form.purchaseOrderNo}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Supplier Name</label>
                            <input
                              className="form-control w-100"
                              type="text"
                              name="supplierName"
                              value={form.supplierName}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                        </div>
    
                        <div className="col-md-12 d-flex">
                          
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Date</label>
                            <input
                              className="form-control w-100"
                              type="date"
                              name="date"
                              value={form.date}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          </div>
                          <div className="col-md-12 d-flex">
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Qty</label>
                            <input
                              className="form-control w-100"
                              type="text"
                              name="qty"
                              value={form.qty}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                          <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Receive Qty</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="qtyReceive"
                          value={form.qtyReceive}
                          onChange={handleChange}
                          required
                        />
                      </div>
                          </div>
    
                          <div className="row mx-1 card border border-dark shadow-lg py-2 mt-4">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>SR No</th>
                                <th>Check List</th>
                                <th>Requirements</th>
                                <th> Observation</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>Invoice</td>
                                  <td>Quantity and Unit Price must match with Purchase Order</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="invoiceObservation"
                              value={form.invoiceObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td>Manufacturer Certificate</td>
                                  <td>COC must available</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="manufacturerCertObservation"
                              value={form.manufacturerCertObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                  <td>3</td>
                                  <td>Supplier Certificate(Distributor/Third Party)</td>
                                  <td>COC must available, in case "No" direct supply from Mfg.</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="supplierCertObservation"
                              value={form.supplierCertObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                  <td>4</td>
                                  <td>Certificate Full Traceability</td>
                                  <td>Must Available</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="fullTraceabilityObservation"
                              value={form.fullTraceabilityObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                  <td>5</td>
                                  <td>Batch Number</td>
                                  <td>Must match(Physical Unit lable & all COC)</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="batchNumberObservation"
                              value={form.batchNumberObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                  <td>6</td>
                                  <td>Date of Manufacturing(If Applicable)</td>
                                  <td>Must match(Physical Unit lable & all COC)</td>
                                  <td><input
                              className="form-control w-100"
                              type="date"
                              name="dateOfManufacturingObservation"
                              value={form.dateOfManufacturingObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>

                                <tr>
                                  <td>6</td>
                                  <td>Date of Expiry(If Applicable)</td>
                                  <td>Must match(Physical Unit lable & all COC)</td>
                                  <td><input
                              className="form-control w-100"
                              type="date"
                              name="dateOfExpiryObservation"
                              value={form.dateOfExpiryObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
    
                                <tr>
                                  <td>7</td>
                                  <td>Shelf Life(If Applicable)</td>
                                  <td>80% and above</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="selfLifeObservation"
                              value={form.selfLifeObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
    
                                <tr>
                                  <td>8</td>
                                  <td>Technical Data Sheet(TDS) & MSDS</td>
                                  <td>Must Available</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="tdsObservation"
                              value={form.tdsObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
    
                                <tr>
                                  <td>9</td>
                                  <td>Material Condition</td>
                                  <td>No Damage / No Leakage</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="materialConditionObservation"
                              value={form.materialConditionObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                <td>10</td>
                                  <td>Specification(If any)</td>
                                  <td>Must Match with Purchase Order Specification</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="specificationObservation"
                              value={form.specificationObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                                <tr>
                                <td>11</td>
                                  <td>Documents(If Import)</td>
                                  <td>Air Way Bill(AWB) & Bill Of Entry(If Available)</td>
                                  <td><input
                              className="form-control w-100"
                              type="text"
                              name="documentObservation"
                              value={form.documentObservation}
                              onChange={handleChange}
                              required
                            /></td>
                                </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">LOT Accepted</label>
                            <select
                          className="form-control w-100"
                          name="lotAccepted"
                          value={form.lotAccepted}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="With Deviation">With Deviation</option>
                        </select>
                          </div>
                          {form.lotAccepted === "With Deviation" && (
                            <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Deviation Date</label>
                            <input
                            type="date"
                            className="form-control w-100"
                            name="deviationDate"
                            value={form.deviationDate}
                            onChange={handleChange}
                            />
                          </div>
                            )}
                          <div className="col-md-6 p-2 d-flex">
                            <label className="col-md-4 mt-2">Remark(If any)</label>
                            <input
                              className="form-control w-100"
                              type="text"
                              name="remark"
                              value={form.remark}
                              onChange={handleChange}
                              
                            />
                          </div>
                          </div>
                          </div>
                        <div className="text-end mb-3">
                          <button 
                            className="btn btn-success"
    
                          >
                            Submit
                          </button>
                        </div>
    
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    };

export default EditInspectionReportform;
