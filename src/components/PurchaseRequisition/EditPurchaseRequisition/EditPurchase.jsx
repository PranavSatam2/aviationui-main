import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import {
  updatePurchaseRequisition,
  getPurchaseRequisitionDetail,
  fetchPartNumbersAndDescriptions,
} from "../../../services/db_manager";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../AddpurchaseRequisition/AddPurchaseRequisition.module.css";

const EditPurchaseRequisition = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { RequisitionID } = location.state || "";
  
  const [form, setForm] = useState({
    partNumber: "",
    description: "",
    currentStock: "",
    requiredQty: "",
    requiredDate: "",
    remark: "",
    unitOfMeasurement: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);
  const [descLoading, setDescLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [descError, setDescError] = useState(null);
  const [partError, setPartError] = useState(null);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (RequisitionID) {
      fetchRequisitionData();
    }
  }, [RequisitionID]);

  const fetchRequisitionData = async () => {
    setIsLoading(true);
    try {
      const requisitionData = await getPurchaseRequisitionDetail(RequisitionID);

      setForm(requisitionData.data);
      setSelectedProduct(requisitionData.data.partNumber || "");
      setSelectedDescription(requisitionData.data.description || "");

      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching Purchase requisition data:", err);
      setError("Failed to load Purchase requisition data. Please try again.");
    }
  };

  useEffect(() => {
    const getDescriptions = async () => {
      setDescLoading(true);
      try {
        const data = await fetchPartNumbersAndDescriptions();
        setDescriptions(data);
        setDescError(null);
      } catch (err) {
        console.error("Error fetching descriptions:", err);
        setDescError("Failed to load descriptions. Please try again later.");
      } finally {
        setDescLoading(false);
      }
    };

    getDescriptions();
  }, []);

  useEffect(() => {
    const getPartNumbers = async () => {
      setPartLoading(true);
      try {
        const data = await fetchPartNumbersAndDescriptions();
        setData(data);
        setPartNumbers(data);
        setPartError(null);
      } catch (err) {
        console.error("Error fetching part numbers:", err);
        setPartError("Failed to load part numbers. Please try again later.");
      } finally {
        setPartLoading(false);
      }
    };

    getPartNumbers();
  }, []);

  useEffect(() => {
    if (form.partNumber && data.length > 0) {
      setSelectedProduct(form.partNumber);

      const match = data.find((item) => item.productName === form.partNumber);
      const description = match ? match.productDescription : "";
      setSelectedDescription(description);
    }
  }, [form, data]);

  const handleProductChange = (e) => {
    const selected = e.target.value;
    setSelectedProduct(selected);

    const match = data.find((item) => item.productName === selected);
    const description = match ? match.productDescription : "";

    setSelectedDescription(description);

    setForm((prevForm) => ({
      ...prevForm,
      partNumber: selected,
      description: description,
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
    partNumber: {
      length: 12,
    },
    description: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    requiredQty: {
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

    if (value.trim().length > 0) {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    } else {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    }
  };

  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen);
    event.target.value = value;
    let elementLen = value.length;
    if (elementLen > maxLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else if (elementLen < minLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    }
  }

  const clearValidationClasses = () => {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll(".form-control, .form-select");
    inputs.forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
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
      await updatePurchaseRequisition(RequisitionID, form);
      toast.success("Purchase Requisition updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating purchase requisition:", error);
      toast.error("Failed to update purchase requisition. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <span className={styles.loadingText}>Loading requisition data...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.errorContainer}>
            <div className={styles.errorBox}>{error}</div>
            <button className={styles.btnCancel} onClick={handleCancel}>
              Back to List
            </button>
          </div>
        </div>
        <Footer />
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
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>
                Edit Purchase Requisition
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Part Number & Description */}
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
                        onChange={handleChange}
                        required
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
                        value={form.description}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  {/* Current Stock & Required Qty */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Current Stock <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="currentStock"
                        value={form.currentStock}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Required Qty <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="requiredQty"
                        onInput={(event) => validateDataType(event, "N")}
                        value={form.requiredQty}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Unit of Measurement */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Unit of Measurement <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Unit</option>
                        <option value="EA">EA</option>
                        <option value="RL">RL</option>
                        <option value="QT">QT</option>
                        <option value="GAL">GAL</option>
                        <option value="KIT">KIT</option>
                        <option value="LTR">LTR</option>
                        <option value="SHT">SHT</option>
                        <option value="Sq.ft">Sq.ft</option>
                        <option value="Sq.mtr">Sq.mtr</option>
                      </select>
                    </div>
                  </div>

                  {/* Required Date & Remark */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Required Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="requiredDate"
                        value={form.requiredDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Remark</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="remark"
                        value={form.remark}
                        onChange={handleChange}
                      />
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
                      <i className="fa fa-check"></i>
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

export default EditPurchaseRequisition;