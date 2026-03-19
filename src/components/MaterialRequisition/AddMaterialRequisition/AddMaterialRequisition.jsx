import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { createMaterialRequisition, fetchPartNumbersAndDescriptions, fetchSupplierName } from "../../../services/db_manager";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../MaterialRequisition.module.css";

const AddRequisition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workOrder, readOnly } = location.state || {};

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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierError, setSupplierError] = useState(null);

  useEffect(() => {
    if (workOrder) {
      console.log("Received work order:", workOrder.partNumber);
      setForm({
        materialRequisitionNo: "",
        workOrderNo: workOrder.workOrderNo || "",
        date: workOrder.issueDate || "",
        partNumber: workOrder.partNumber || "",
        description: workOrder.description || "",
        requestedQty: workOrder.qty || "",
        issuedQty: "",
        unitOfMeasurement: "",
        curDate: new Date().toISOString().split("T")[0]
      });
    }
  }, [workOrder]);

  useEffect(() => {
    const getSupplierNames = async () => {
      try {
        const response = await fetchSupplierName();
        setSuppliers(response.data);
      } catch (err) {
        console.error("Error fetching supplier names:", err);
        setSupplierError("Failed to load supplier names");
      }
    };

    getSupplierNames();
  }, []);

  const handleProductChange = (e) => {
    const selected = e.target.value;
    const match = data.find((item) => item.productName === selected);

    setForm(prevForm => ({
      ...prevForm,
      partNumber: selected,
      description: match ? match.productDescription : ""
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateField = (fieldName, value, rules) => {
    if (!value) return `${fieldName} is required.`;

    if (rules.type === "number" && isNaN(value)) {
      return `${fieldName} should be a number.`;
    }

    if (rules.length && value.length > rules.length) {
      return `${fieldName} should be at most ${rules.length} characters.`;
    }

    if (rules.regex && !rules.regex.test(value)) {
      return `${fieldName} has invalid characters.`;
    }

    return null;
  };

  const validationRules = {
    workOrderNo: {
      length: 12,
    },
    partNumber: {
      length: 255,
      regex: /^[a-zA-Z0-9-\s]*$/,
    },
    description: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    requestedQty: {
      type: "number",
      length: 10,
    },
    issuedQty: {
      type: "number",
      length: 10,
    },
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
      const response = await createMaterialRequisition(form);
      console.log("Requisition added successfully:", response.data);
      toast.success("Requisition Added Successfully!");

      setForm({
        materialRequisitionNo: "",
        workOrderNo: "",
        date: "",
        partNumber: "",
        description: "",
        requestedQty: "",
        issuedQty: "",
        unitOfMeasurement: "",
        supplierName: "",
      });

      navigate("/materialRequisition");
    } catch (error) {
      console.error("Error adding requisition:", error);
      toast.error("Failed to add requisition.");
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
              <span className={styles.breadcrumbLabel}>Add Material Requisition</span>
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
                      <label className={styles.label}>
                        Work Order No. <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="workOrderNo"
                        onInput={(event) => validateDataType(event, "A")}
                        value={form.workOrderNo}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Date <span className={styles.required}>*</span>
                      </label>
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
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partNumber"
                        value={form.partNumber}
                        onChange={handleProductChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Description <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="description"
                        value={form.description || "Auto-selected"}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Quantity Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-edit"></i>
                    <span>Quantity Information</span>
                    <span className={styles.editableBadge}>Editable</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Requested QTY <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="requestedQty"
                        onInput={(event) => validateDataType(event, "N")}
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
                        onInput={(event) => validateDataType(event, "N")}
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
                        {suppliers.length > 0 ? (
                          suppliers.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading suppliers...</option>
                        )}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Current Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="curDate"
                        value={form.curDate}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-plus-circle"></i>
                      <span>Add Requisition</span>
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

export default AddRequisition;