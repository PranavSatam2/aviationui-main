import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMaterialRequisitionDetail,
  updateMaterialRequisition,
  fetchSupplierName,
} from "../../../services/db_manager";
import { toast } from "react-toastify";
import styles from "../MaterialRequisition.module.css";

const EditMaterialRequisition = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { RequisitionID } = location.state || {};

  const [form, setForm] = useState({
    materialRequisitionNo: "",
    workOrderNo: "",
    date: "",
    partNumber: "",
    description: "",
    requestedQty: "",
    issuedQty: "",
    unitOfMeasurement: "",
    supplierName: "",
    curDate: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSupplierNames = async () => {
      try {
        const response = await fetchSupplierName();
        setSuppliers(response.data);
      } catch (err) {
        console.error("Error fetching supplier names:", err);
        toast.error("Failed to load supplier names");
      }
    };
    getSupplierNames();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getMaterialRequisitionDetail(RequisitionID);
        if (response.data) {
          setForm(response.data);
        }
      } catch (err) {
        console.error("Error fetching requisition:", err);
        toast.error("Failed to fetch requisition details.");
      } finally {
        setLoading(false);
      }
    };

    if (RequisitionID) fetchDetails();
  }, [RequisitionID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.]/g, "");
    }
    event.target.value = value;
  };

  const validationRules = {
    workOrderNo: { length: 12 },
    partNumber: { length: 255 },
    description: { length: 255, regex: /^[a-zA-Z0-9\s]*$/ },
    requestedQty: { type: "number", length: 10 },
    issuedQty: { type: "number", length: 10 },
  };

  const validateField = (fieldName, value, rules) => {
    if (!value) return `${fieldName} is required.`;
    if (rules.type === "number" && isNaN(value))
      return `${fieldName} should be a number.`;
    if (rules.length && value.length > rules.length)
      return `${fieldName} should be at most ${rules.length} characters.`;
    if (rules.regex && !rules.regex.test(value))
      return `${fieldName} has invalid characters.`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        toast.error(error);
        return;
      }
    }

    try {
      const response = await updateMaterialRequisition(RequisitionID, form);
      if (response.status === 200) {
        toast.success("Material Requisition Updated Successfully!");
        navigate("/ViewMaterialRequisition");
      }
    } catch (err) {
      console.error("Error updating requisition:", err);
      toast.error("Failed to update requisition.");
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <h5>Loading requisition details...</h5>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

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
              <span className={styles.breadcrumbLabel}>Edit Material Requisition</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Work Order Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-file-alt"></i>
                    <span>Work Order Information</span>
                    <span className={styles.readOnlyBadge}>Read Only</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Work Order No.</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="workOrderNo"
                        value={form.workOrderNo}
                        onChange={handleChange}
                        onInput={(e) => validateDataType(e, "A")}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Date</label>
                      <input
                        type="date"
                        className={styles.input}
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Part Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-box"></i>
                    <span>Part Information</span>
                    <span className={styles.readOnlyBadge}>Read Only</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Part Number</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partNumber"
                        value={form.partNumber}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Quantity Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-edit"></i>
                    <span>Editable Information</span>
                    <span className={styles.editableBadge}>Editable</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Requested QTY</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="requestedQty"
                        onInput={(e) => validateDataType(e, "N")}
                        value={form.requestedQty}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Issued QTY <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="issuedQty"
                        onInput={(e) => validateDataType(e, "N")}
                        value={form.issuedQty}
                        onChange={handleChange}
                        placeholder="Enter issued quantity"
                        required
                      />
                    </div>
                  </div>

                  {/* Supplier Section */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Supplier Name <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="supplierName"
                        value={form.supplierName}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Current Date</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="curDate"
                        value={form.curDate}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={() => navigate(-1)}
                    >
                      <i className="fa fa-times"></i>
                      <span>Cancel</span>
                    </button>
                    <button type="submit" className={styles.btnUpdate}>
                      <i className="fa fa-save"></i>
                      <span>Update Requisition</span>
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

export default EditMaterialRequisition;