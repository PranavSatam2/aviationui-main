import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { updateDispatchReport } from "../services/db_manager";
import { toast } from "react-toastify";

const EditDispatchReport = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    reportNo: "",
    reportDate: "",
    partNo: "",
    partDescription: "",
    orderNo: "",
    customerName: "",
    quantity: "",
    batchNo: "",
    challanNo: "",
    challanDate: "",
    challanRemark: "",
    invoiceNo: "",
    invoiceDate: "",
    invoiceRemark: "",
    caFormNo: "",
    caFormDate: "",
    caFormRemark: "",
    ewayBill: "",
    ewayBillDate: "",
    ewayBillRemark: "",
    storesInChargeName: "",
    storesInChargeSign: "",
  });

  useEffect(() => {
    if (state && state.report) {
      setFormData({ ...state.report });
    } else {
      toast.error("No data to edit");
      navigate("/view-dispatch-reports");
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDispatchReport(formData.id, formData);
      toast.success("Dispatch report updated successfully");
      navigate("/viewDispatchReport");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update dispatch report");
    }
  };

  const handleCancel = () => navigate("/viewDispatchReport");

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />

        <div className="container mt-4">
          <button onClick={handleCancel} className="btn btn-light mb-2">
            ← Back
          </button>
          <h4 className="mb-4">Edit Dispatch Report</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Report No.</label>
                <input type="text" name="reportNo" className="form-control" value={formData.reportNo || ""} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Date</label>
                <input type="date" name="reportDate" className="form-control" value={formData.reportDate || ""} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Part No.</label>
                <input type="text" name="partNo" className="form-control" value={formData.partNo || ""} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>Part Description</label>
                <input type="text" name="partDescription" className="form-control" value={formData.partDescription || ""} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Order No.</label>
                <input type="text" name="orderNo" className="form-control" value={formData.orderNo || ""} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>Customer Name</label>
                <input type="text" name="customerName" className="form-control" value={formData.customerName || ""} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Quantity</label>
                <input type="number" name="quantity" className="form-control" value={formData.quantity || ""} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>Batch No.</label>
                <input type="text" name="batchNo" className="form-control" value={formData.batchNo || ""} onChange={handleChange} />
              </div>
            </div>

            {/* Challan Section */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Challan No.</label>
                <input type="text" name="challanNo" className="form-control" value={formData.challanNo || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Date</label>
                <input type="date" name="challanDate" className="form-control" value={formData.challanDate || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Remark</label>
                <input type="text" name="challanRemark" className="form-control" value={formData.challanRemark || ""} onChange={handleChange} />
              </div>
            </div>

            {/* Invoice Section */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Invoice No.</label>
                <input type="text" name="invoiceNo" className="form-control" value={formData.invoiceNo || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Date</label>
                <input type="date" name="invoiceDate" className="form-control" value={formData.invoiceDate || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Remark</label>
                <input type="text" name="invoiceRemark" className="form-control" value={formData.invoiceRemark || ""} onChange={handleChange} />
              </div>
            </div>

            {/* CA Form Section */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label>CA Form</label>
                <input type="text" name="caFormNo" className="form-control" value={formData.caFormNo || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Date</label>
                <input type="date" name="caFormDate" className="form-control" value={formData.caFormDate || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Remark</label>
                <input type="text" name="caFormRemark" className="form-control" value={formData.caFormRemark || ""} onChange={handleChange} />
              </div>
            </div>

            {/* E-Way Bill Section */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label>E-Way Bill</label>
                <input type="text" name="ewayBill" className="form-control" value={formData.ewayBill || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Date</label>
                <input type="date" name="ewayBillDate" className="form-control" value={formData.ewayBillDate || ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Remark</label>
                <input type="text" name="ewayBillRemark" className="form-control" value={formData.ewayBillRemark || ""} onChange={handleChange} />
              </div>
            </div>

            {/* Store In-Charge Section */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label>Stores In-Charge Name</label>
                <input type="text" name="storesInChargeName" className="form-control" value={formData.storesInChargeName || ""} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>Stores In-Charge Sign</label>
                <input type="text" name="storesInChargeSign" className="form-control" value={formData.storesInChargeSign || ""} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-3">Update Report</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditDispatchReport;
