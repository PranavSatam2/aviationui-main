import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { saveDispatchReport, fetchPartNumbersAndDescriptions, getCaFormNo } from "../services/db_manager";
import { toast } from "react-toastify";
import styles from "./AddDispatchReport.module.css";

const AddDispatchReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workOrderData = location.state?.workOrder || null;

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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedUser = sessionStorage.getItem("username");
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPartNumbersAndDescriptions();
        setData(response);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load product data. Please try again.");
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
      toast.success(response?.message || "Dispatch report saved successfully!");
      navigate("/dispatchReport");
    } catch (error) {
      console.error("Error saving dispatch report", error);
      toast.error(error?.response?.data?.message || "Failed to save dispatch report.");
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
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Add Dispatch Report</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Part Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-box"></i>
                    <span>Part Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partNo"
                        value={form.partNo}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Description <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partDescription"
                        value={form.partDescription}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Report Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="reportDate"
                        value={form.reportDate}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Order Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-file-alt"></i>
                    <span>Order Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Work Order No. <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="orderNo"
                        value={form.orderNo}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Customer Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Serial No. <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="batchNo"
                        value={form.batchNo}
                        onChange={handleChange}
                        placeholder="Enter serial number"
                        required
                      />
                    </div>
                  </div>

                  {/* Checklist Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-check-circle"></i>
                    <span>Checklist</span>
                  </div>

                  {/* Challan */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>Challan Details</div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Challan No. <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="challanNo"
                          value={form.challanNo}
                          onChange={handleChange}
                          placeholder="Enter challan number"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Date <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          className={styles.input}
                          name="challanDate"
                          value={form.challanDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="challanRemark"
                          value={form.challanRemark}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>Invoice Details</div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Invoice No. <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="invoiceNo"
                          value={form.invoiceNo}
                          onChange={handleChange}
                          placeholder="Enter invoice number"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Date <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          className={styles.input}
                          name="invoiceDate"
                          value={form.invoiceDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="invoiceRemark"
                          value={form.invoiceRemark}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CA Form */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>CA Form Details</div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          CA Form No. <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="caFormNo"
                          value={form.caFormNo}
                          onChange={handleChange}
                          placeholder="Enter CA form number"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Date <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          className={styles.input}
                          name="caFormDate"
                          value={form.caFormDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="caFormRemark"
                          value={form.caFormRemark}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* E-WAY Bill */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>E-WAY Bill Details</div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          E-WAY Bill <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="ewayBill"
                          value={form.ewayBill}
                          onChange={handleChange}
                          placeholder="Enter E-WAY bill number"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Date <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          className={styles.input}
                          name="ewayBillDate"
                          value={form.ewayBillDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="ewayBillRemark"
                          value={form.ewayBillRemark}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Store In-Charge Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-user"></i>
                    <span>Store In-Charge Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Stores In-Charge Name
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="storesInChargeName"
                        value={form.storesInChargeName}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-check-circle"></i>
                      <span>Submit Report</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddDispatchReport;