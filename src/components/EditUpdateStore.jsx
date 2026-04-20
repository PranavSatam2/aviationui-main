import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { getStoreDetail, updateStore } from "../services/db_manager";
import styles from "./EditUpdateStore.module.css";

const EditUpdateStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const emptyForm = {
    partNum: "",
    description: "",
    batch: "",
    condition: "",
    supplier: "",
    dom: "",
    doe: "",
    quantity: "",
    dateOfRecipet: "",
    nameOfQualityInsp: "",
    signatureOfQualityInsp: "",
    formAMC: "",
    revNo: "",
    flag: "",
    rackNo: "",
    updatedBy: "",
    updatedDate: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);

  const formatDateForInput = (val) => {
    if (!val && val !== 0) return "";
    try {
      const s = String(val);
      return s.includes("T") ? s.substring(0, 10) : s.substring(0, 10);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      try {
        const response = await getStoreDetail(id);
        if (response?.data) {
          const username = sessionStorage.getItem("username") || "";
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, "0");
          const d = String(today.getDate()).padStart(2, "0");
          const formattedToday = `${y}-${m}-${d}`;

          const data = response.data;
          const normalized = {
            ...data,
            dom: formatDateForInput(data.dom),
            doe: formatDateForInput(data.doe),
            dateOfRecipet: formatDateForInput(data.dateOfRecipet),
            updatedBy: username,
            updatedDate: formattedToday,
          };

          normalized.quantity =
            normalized.quantity === null || normalized.quantity === undefined
              ? ""
              : normalized.quantity;

          setForm((prev) => ({ ...prev, ...normalized }));
        } else {
          const username = sessionStorage.getItem("username") || "";
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, "0");
          const d = String(today.getDate()).padStart(2, "0");
          const formattedToday = `${y}-${m}-${d}`;
          setForm((prev) => ({
            ...prev,
            updatedBy: username,
            updatedDate: formattedToday,
          }));
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
        alert("Failed to load store data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const numeric = value === "" ? "" : parseInt(value, 10);
      setForm((prev) => ({ ...prev, [name]: isNaN(numeric) ? "" : numeric }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.partNum) {
      alert("Part Number is required");
      return;
    }

    const payload = {
      ...form,
      quantity:
        form.quantity === "" || form.quantity === null || form.quantity === undefined
          ? 0
          : Number(form.quantity),
    };

    try {
      const response = await updateStore(id, payload);
      if (response?.status === 200 || response?.status === 204) {
        alert("Store updated successfully!");
        navigate("/updatestore");
      } else {
        alert("Store update response received: " + (response?.status || "unknown"));
      }
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Failed to update store.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading store data...</p>
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
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Update Material In Store</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Material Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-box"></i>
                    <span>Material Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="partNum"
                        value={form.partNum}
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
                        className={styles.input}
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Batch <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="batch"
                        value={form.batch}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Condition <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        required
                        disabled
                      >
                        <option value="">Select Condition</option>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Refurbished">Refurbished</option>
                        <option value="Repaired">Repaired</option>
                      </select>
                    </div>
                  </div>

                  {/* Supplier Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-truck"></i>
                    <span>Supplier Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Supplier <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="supplier"
                        value={form.supplier}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        DOM (Date of Manufacture) <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="date"
                        name="dom"
                        value={form.dom || ""}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        DOE (Date of Expiry) <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="date"
                        name="doe"
                        value={form.doe || ""}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="number"
                        name="quantity"
                        value={form.quantity === "" ? "" : form.quantity}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  {/* Quality Inspection Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-clipboard-check"></i>
                    <span>Quality Inspection</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Date of Receipt <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="date"
                        name="dateOfRecipet"
                        value={form.dateOfRecipet || ""}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quality Inspector <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="nameOfQualityInsp"
                        value={form.nameOfQualityInsp}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Signature of Quality Inspector <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="signatureOfQualityInsp"
                        value={form.signatureOfQualityInsp}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Form AMC <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="formAMC"
                        value={form.formAMC || ""}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Rev No <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="revNo"
                        value={form.revNo || ""}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  {/* Storage & Update Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-warehouse"></i>
                    <span>Storage & Update Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Rack No <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="rackNo"
                        value={form.rackNo || ""}
                        onChange={handleChange}
                        placeholder="e.g., RACK-22"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Updated By</label>
                      <input
                        className={styles.input}
                        type="text"
                        name="updatedBy"
                        value={form.updatedBy || ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Updated Date</label>
                      <input
                        className={styles.input}
                        type="date"
                        name="updatedDate"
                        value={form.updatedDate || ""}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-save"></i>
                      <span>Update Store</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditUpdateStore;