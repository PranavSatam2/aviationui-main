import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { saveDispatchReport, fetchPartNumbersAndDescriptions } from "../services/db_manager";

const AddDispatchReport = () => {
  const [form, setForm] = useState({
    reportNo: "",
    reportDate: new Date().toISOString().split("T")[0],
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
    storesInChargeSign: ""
  });

  // State to store dropdown options from API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 🔹 Get work order data from navigation state
  const location = useLocation();
  const workOrderData = location.state?.workOrder || null;
  const navigate = useNavigate();

  useEffect(() => {
      const loggedUser = sessionStorage.getItem("username"); // username stored at login
      if (loggedUser) {
        setForm((prev) => ({ ...prev, storesInChargeName: loggedUser }));
      }
    }, []);

  useEffect(() => {
    if (workOrderData) {
      setForm((prevForm) => ({
        ...prevForm,
        orderNo: workOrderData.workOrderNo || "",
        customerName: workOrderData.customerName || "",
        partNo: workOrderData.partNumber || "",
        partDescription: workOrderData.description || "",
        quantity: workOrderData.qty || ""
      }));
    }
  }, [workOrderData]);


  // Fetch data once on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPartNumbersAndDescriptions(); // replace with actual API call
        setData(response);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load product data. Please try again.");
        // fallback data
        setData([
          { productName: "Sample A", productDescription: "Desc A" },
          { productName: "Sample B", productDescription: "Desc B" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle part number (productName) change
  const handleProductChange = (e) => {
    const selected = e.target.value;
    const match = data.find((item) => item.productName === selected);

    setForm((prevForm) => ({
      ...prevForm,
      partNo: selected,
      partDescription: match ? match.productDescription : ""
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await saveDispatchReport(form);
      // response could be response.data if you are using axios
      alert(response?.message || "Dispatch report saved successfully!");
      // resetForm();
      // window.location.reload(); // reload after saving
      navigate("/dispatchReport"); // navigate to view page
    } catch (error) {
      console.error("Error saving dispatch report", error);
      alert(error?.response?.data?.message || "Failed to save dispatch report.");
    }
  };


  const resetForm = () => {
    setForm({
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
      storesInchargeName: form.storesInChargeName,
      storesInchargeSign: "",
      ewayBillDate: "",
      ewayBillRemark: ""
    });
    setError({});
  };


  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px"
  };

  const inputStyle = {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginBottom: "10px"
  };

  const sectionStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px"
  };

  const threeColStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 2fr",
    gap: "20px",
    marginBottom: "20px"
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Dispatch Report"
            isBack={true}
          />
          <div
            className="card border border-dark shadow mx-4 my-4 p-3"
            style={{ minHeight: "80vh" }}
          >
            <form onSubmit={handleSubmit} style={{ maxWidth: "100%", marginLeft: "3%", marginRight: "3%" }}>
              {/* Part Info */}
              {/* Part No. & Quantity */}
              <div style={sectionStyle}>
                {/* <div>
                  <label style={labelStyle}>Part No.</label>
                  {loading ? (
                    <div>Loading part numbers...</div>
                  ) : error ? (
                    <div style={{ color: "red" }}>{error}</div>
                  ) : (
                    <select
                      name="partNo"
                      style={inputStyle}
                      value={form.partNo}
                      onChange={handleProductChange}
                    >
                      <option value="">Select a part number</option>
                      {data.map((part, index) => (
                        <option key={index} value={part.productName}>
                          {part.productName}
                        </option>
                      ))}
                    </select>
                  )}
                </div> */}

                <div>
                  <label style={labelStyle}>Part Number</label>
                  <input
                    name="partNo"
                    style={inputStyle}
                    value={form.partNo}
                    disabled
                  />
                </div>

                <div>
                  <label style={labelStyle}>Qty.</label>
                  <input
                    name="quantity"
                    style={inputStyle}
                    value={form.quantity}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              {/* Part Description */}
              <div style={sectionStyle}>
                <div>
                  <label style={labelStyle}>Part Description</label>
                  <input
                    name="partDescription"
                    style={inputStyle}
                    value={form.partDescription}
                    disabled
                  />
                </div>
                <div>
                  <label style={labelStyle}>Report Date</label>
                  <input type="date" name="reportDate" style={inputStyle} value={form.reportDate} onChange={handleChange} disabled/>
                </div>
              </div>


              {/* Order & Customer */}
              <div style={sectionStyle}>
                <div>
                  <label style={labelStyle}>Work Order No.</label>
                  <input name="orderNo" style={inputStyle} value={form.orderNo} onChange={handleChange} disabled/>
                </div>
                <div>
                  <label style={labelStyle}>Customer Name</label>
                  <input name="customerName" style={inputStyle} value={form.customerName} onChange={handleChange} disabled/>
                </div>
                <div>
                  <label style={labelStyle}>Serial No.<span style={{ color: "red" }}>*</span></label>
                  <input
                    name="batchNo"
                    style={inputStyle}
                    value={form.batchNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Checklist Header */}
              <div style={{ fontWeight: "bold", borderTop: "1px solid #ccc", paddingTop: "15px", marginBottom: "10px" }}>
                Checklist
              </div>

              {/* Challan */}
              <div style={threeColStyle}>
                <div>
                  <label style={labelStyle}>Challan No.<span style={{ color: "red" }}>*</span></label>
                  <input name="challanNo" style={inputStyle} value={form.challanNo} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Date<span style={{ color: "red" }}>*</span></label>
                  <input type="date" name="challanDate" style={inputStyle} value={form.challanDate} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Remark</label>
                  <input name="challanRemark" style={inputStyle} value={form.challanRemark} onChange={handleChange} />
                </div>
              </div>

              {/* Invoice */}
              <div style={threeColStyle}>
                <div>
                  <label style={labelStyle}>Invoice No.<span style={{ color: "red" }}>*</span></label>
                  <input name="invoiceNo" style={inputStyle} value={form.invoiceNo} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Date<span style={{ color: "red" }}>*</span></label>
                  <input type="date" name="invoiceDate" style={inputStyle} value={form.invoiceDate} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Remark</label>
                  <input name="invoiceRemark" style={inputStyle} value={form.invoiceRemark} onChange={handleChange} />
                </div>
              </div>

              {/* CA Form */}
              <div style={threeColStyle}>
                <div>
                  <label style={labelStyle}>CA Form No.<span style={{ color: "red" }}>*</span></label>
                  <input name="caFormNo" style={inputStyle} value={form.c} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Date<span style={{ color: "red" }}>*</span></label>
                  <input type="date" name="caFormDate" style={inputStyle} value={form.caFormDate} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Remark</label>
                  <input name="caFormRemark" style={inputStyle} value={form.caFormRemark} onChange={handleChange} />
                </div>
              </div>

              {/* E-WAY Bill */}
              <div style={threeColStyle}>
                <div>
                  <label style={labelStyle}>E-WAY Bill<span style={{ color: "red" }}>*</span></label>
                  <input name="ewayBill" style={inputStyle} value={form.ewayBill} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Date<span style={{ color: "red" }}>*</span></label>
                  <input type="date" name="ewayBillDate" style={inputStyle} value={form.ewayBillDate} onChange={handleChange} required/>
                </div>
                <div>
                  <label style={labelStyle}>Remark</label>
                  <input name="ewayBillRemark" style={inputStyle} value={form.ewayBillRemark} onChange={handleChange} />
                </div>
              </div>

              {/* Store In-Charge Info */}
              <div style={sectionStyle}>
                <div>
                  <label style={labelStyle}>Stores In-Charge Name</label>
                  <input name="storesInChargeName" style={inputStyle} value={form.storesInChargeName} onChange={handleChange} disabled />
                </div>
                <div>
                  <label style={labelStyle}>Stores In-Charge Sign</label>
                  <input name="storesInChargeSign" style={inputStyle} value={form.storesInChargeSign} onChange={handleChange} />
                </div>
              </div>

              {/* Submit */}
              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 30px",
                    fontSize: "16px",
                    backgroundColor: "#0052cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddDispatchReport;
