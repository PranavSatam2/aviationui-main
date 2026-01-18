import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./MaterialNote.module.css";
import {
  addMaterialNote,
  fetchSupplierName,
  fetchAllPurchaseOrder,
  fetchAllPartNO,
  fetchAllPartNODetails,
} from "../services/db_manager";

const AddMaterialNote = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [poNumbers, setPoNumbers] = useState([]);
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    supplierName: "",
    orderNumber: "",
    partNumber: "",
    partDescription: "",
    quantity: "",
    unitOfMeasurement: "",
    challanNo: "",
    receiptDate: "",
    qualityAcceptance: "",
    storeInchargeSign: "",
  });

  // ✅ Fetch Suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchSupplierName();
        console.log("Fetched Supplier list:", result.data);
        setSuppliers(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Failed to fetch supplier list", err);
        setSuppliers([]);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch PO Numbers based on Supplier
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAllPurchaseOrder();
        console.log("Fetched PO list:", result);
        setPoNumbers(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Failed to fetch PO list", err);
        setPoNumbers([]);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch Parts based on PO Number AND Auto-select Supplier
  useEffect(() => {
    if (form.orderNumber) {
      console.log(form.orderNumber);
      const fetchData = async () => {
        try {
          const result = await fetchAllPartNO(form.orderNumber);
          console.log("Fetched PartNo list:", result);
          setParts(Array.isArray(result.data) ? result.data : []);
          
          // ✅ Auto-populate supplier name from the first item
          if (result.data && result.data.length > 0 && result.data[0].supplierName) {
            setForm((prev) => ({
              ...prev,
              supplierName: result.data[0].supplierName,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch Parts list", err);
          setParts([]);
        }
      };
      fetchData();
    } else {
      // Reset parts and supplier when PO is cleared
      setParts([]);
      setForm((prev) => ({
        ...prev,
        supplierName: "",
      }));
    }
  }, [form.orderNumber]);

  // ✅ Fetch Part Details when Part Number selected
  useEffect(() => {
    if (form.partNumber) {
      const fetchData = async () => {
        try {
          const result = await fetchAllPartNODetails(form.partNumber, form.orderNumber);
          console.log("Fetched PartNoDetails:", result);
          if (result) {
            const { description, currentStoke, unit, poDate } = result.data;
            setForm((prev) => ({
              ...prev,
              partDescription: description || "",
              quantity: currentStoke || "",
              unitOfMeasurement: unit || "",
              receiptDate: poDate || "",
              storeInchargeSign: sessionStorage.getItem("username") || "",
            }));
          }
        } catch (err) {
          console.error("Failed to fetch PartDetails", err);
        }
      };
      fetchData();
    }
  }, [form.partNumber, form.orderNumber]);

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMaterialNote(form);
      toast.success("Material Receipt Note saved successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving material:", error);
      const backendMessage =
        error.response?.data?.message || "Failed to save material receipt note.";

      toast.error(backendMessage);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setForm({
      supplierName: "",
      orderNumber: "",
      partNumber: "",
      partDescription: "",
      quantity: "",
      unitOfMeasurement: "",
      challanNo: "",
      receiptDate: "",
      qualityAcceptance: "",
      storeInchargeSign: "",
    });
    setParts([]);
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
              <span className={styles.breadcrumbLabel}>Add Material Receipt Note Form</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.container}>
            <div className={styles.formCard}>
              {/* Form Body */}
              <form onSubmit={handleSubmit}>
                <div className={styles.formBody}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>PO Number</label>
                      <select
                        className={styles.select}
                        name="orderNumber"
                        value={form.orderNumber}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select PO Number --</option>
                        {poNumbers.map((po, i) => (
                          <option key={i} value={po.poNumber}>
                            {po.poNumber}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Supplier</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="supplierName"
                        value={form.supplierName}
                        onChange={handleChange}
                        disabled
                        placeholder="Auto-populated from PO"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Part Number</label>
                      <select
                        className={styles.select}
                        name="partNumber"
                        value={form.partNumber}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Part --</option>
                        {parts.map((p, i) => (
                          <option key={i} value={`${p.partNumber}|${p.id}`}>
                            {p.partNumber}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partDescription"
                        value={form.partDescription}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Challan No<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="challanNo"
                        value={form.challanNo}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Receipt Date<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="receiptDate"
                        value={form.receiptDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Quantity</label>
                      <input
                        type="number"
                        className={styles.input}
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        disabled
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Unit of Measurement</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>
                      Receive Quantity<span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      name="qualityAcceptance"
                      value={form.qualityAcceptance}
                      onChange={handleChange}
                      required
                    />
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

export default AddMaterialNote;