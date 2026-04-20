import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MaterialNote.module.css";
import {
  getMaterialDetail,
  updateMaterial,
  fetchPartNumbersAndDescriptions,
} from "../services/db_manager";
import { toast } from "react-toastify";

const EditMaterialNote = () => {
  const location = useLocation();
  const { materialId } = location.state || "";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    mrnNo: "",
    supplierName: "",
    orderNumber: "",
    challanNo: "",
    receiptDate: "",
    partNumber: "",
    partDescription: "",
    quantity: "",
    unitOfMeasurement: "",
    qualityAcceptance: "",
    storeInchargeSign: sessionStorage.getItem("username") || "",
  });

  const [partData, setPartData] = useState([]);

  // Fetch material details
  useEffect(() => {
    const fetchMaterialDetailData = async () => {
      setIsLoading(true);
      try {
        const response = await getMaterialDetail(materialId);
        if (response.data) {
          setForm(response.data);
        }
      } catch (error) {
        console.error("Error fetching material details:", error);
        toast.error("Error fetching material details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterialDetailData();
  }, [materialId]);

  // Handle generic field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateMaterial(materialId, form);
      if (response.status === 200) {
        toast.success("Material updated successfully!");
        navigate("/ViewMaterialNote");
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Failed to update material.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Edit Material Receipt Note Form</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.container}>
            <div className={styles.formCard}>
              {/* Loading Overlay */}
              {isLoading && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Loading material details...</p>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit}>
                <div className={styles.formBody}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className={styles.input}
                        name="partNumber"
                        value={form.partNumber}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Description
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className={styles.input}
                        name="partDescription"
                        value={form.partDescription}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        MRN No
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className={styles.input}
                        name="mrnNo"
                        value={form.mrnNo}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Supplier Name
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className={styles.input}
                        name="supplierName"
                        value={form.supplierName}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Order Number
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className={styles.input}
                        name="orderNumber"
                        value={form.orderNumber}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Challan No
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className={styles.input}
                        name="challanNo"
                        value={form.challanNo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Receipt Date
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="date"
                        className={styles.input}
                        name="receiptDate"
                        value={form.receiptDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        type="number"
                        className={styles.input}
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Unit of Measurement
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        required
                        className={styles.input}
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Receive Quantity</label>
                      <input
                        type="number"
                        className={styles.input}
                        name="qualityAcceptance"
                        value={form.qualityAcceptance}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div className={styles.formFooter}>
                  <button 
                    type="button" 
                    className={styles.btnCancel}
                    onClick={() => navigate(-1)}
                  >
                    <i className="fa fa-times"></i>
                    <span>Cancel</span>
                  </button>
                  <button type="submit" className={styles.btnSave}>
                    <i className="fa fa-check"></i>
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditMaterialNote;