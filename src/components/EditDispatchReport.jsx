import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { updateDispatchReport } from "../services/db_manager";
import { toast } from "react-toastify";
import styles from "./EditDispatchReport.module.css";

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
      navigate("/viewDispatchReport");
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow only editable fields to update
    const editableFields = [
      "challanNo",
      "challanDate",
      "invoiceNo",
      "invoiceDate",
      "caFormNo",
      "caFormDate",
      "ewayBill",
      "ewayBillDate",
      "challanRemark",
      "invoiceRemark",
      "caFormRemark",
      "ewayBillRemark",
    ];

    if (editableFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDispatchReport(formData.id, formData);
      toast.success("Dispatch Report updated successfully");
      navigate("/viewDispatchReport");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update Dispatch Report");
    }
  };

  const handleCancel = () => navigate("/viewDispatchReport");

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button className={styles.backButton} onClick={handleCancel}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Edit Dispatch Report</span>
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
                      <label className={styles.label}>Part Number</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partNo"
                        value={formData.partNo || ""}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Part Description</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partDescription"
                        value={formData.partDescription || ""}
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
                      <label className={styles.label}>Work Order No.</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="orderNo"
                        value={formData.orderNo || ""}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Customer Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="customerName"
                        value={formData.customerName || ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Quantity</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="quantity"
                        value={formData.quantity || ""}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Serial No.</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="batchNo"
                        value={formData.batchNo || ""}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Report Date</label>
                      <input
                        type="date"
                        className={styles.input}
                        name="reportDate"
                        value={formData.reportDate || ""}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Editable Checklist Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-edit"></i>
                    <span>Editable Checklist</span>
                    <span className={styles.editableBadge}>Editable</span>
                  </div>

                  {/* Challan */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>
                      <i className="fa fa-pencil-alt"></i>
                      Challan Details
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Challan No. <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="challanNo"
                          value={formData.challanNo || ""}
                          onChange={handleChange}
                          placeholder="Enter challan number"
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
                          value={formData.challanDate || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="challanRemark"
                          value={formData.challanRemark || ""}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>
                      <i className="fa fa-pencil-alt"></i>
                      Invoice Details
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Invoice No. <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="invoiceNo"
                          value={formData.invoiceNo || ""}
                          onChange={handleChange}
                          placeholder="Enter invoice number"
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
                          value={formData.invoiceDate || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="invoiceRemark"
                          value={formData.invoiceRemark || ""}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CA Form */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>
                      <i className="fa fa-pencil-alt"></i>
                      CA Form Details
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          CA Form No. <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="caFormNo"
                          value={formData.caFormNo || ""}
                          onChange={handleChange}
                          placeholder="Enter CA form number"
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
                          value={formData.caFormDate || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="caFormRemark"
                          value={formData.caFormRemark || ""}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* E-WAY Bill */}
                  <div className={styles.checklistGroup}>
                    <div className={styles.checklistTitle}>
                      <i className="fa fa-pencil-alt"></i>
                      E-WAY Bill Details
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          E-WAY Bill <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          name="ewayBill"
                          value={formData.ewayBill || ""}
                          onChange={handleChange}
                          placeholder="Enter E-WAY bill number"
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
                          value={formData.ewayBillDate || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Remark</label>
                        <input
                          type="text"
                          className={styles.input}
                          name="ewayBillRemark"
                          value={formData.ewayBillRemark || ""}
                          onChange={handleChange}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={handleCancel}
                    >
                      <i className="fa fa-times"></i>
                      <span>Cancel</span>
                    </button>
                    <button type="submit" className={styles.btnUpdate}>
                      <i className="fa fa-save"></i>
                      <span>Update Report</span>
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

export default EditDispatchReport;