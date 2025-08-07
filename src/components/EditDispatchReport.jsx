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
      setFormData((prev) => ({
        ...prev,
        ...state.report,
      }));
    } else {
      toast.error("No data to edit");
      navigate("/viewDispatchReport");
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
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Error updating dispatch report");
    }
  };

  const fields = [
    "reportNo",
    "reportDate",
    "partNo",
    "partDescription",
    "orderNo",
    "customerName",
    "quantity",
    "batchNo",
    "challanNo",
    "challanDate",
    "challanRemark",
    "invoiceNo",
    "invoiceDate",
    "invoiceRemark",
    "caFormNo",
    "caFormDate",
    "caFormRemark",
    "ewayBill",
    "ewayBillDate",
    "ewayBillRemark",
    "storesInChargeName",
    "storesInChargeSign",
  ];

  return (
    <div>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Edit Dispatch Report</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
          {fields.map((field) => (
            <div key={field} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type={
                  field.toLowerCase().includes("date")
                    ? "date"
                    : field === "quantity"
                    ? "number"
                    : "text"
                }
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
                required={field !== "remark"} // Optional logic to make 'remark' optional
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditDispatchReport;
