import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { createRepairProduct } from "../services/db_manager";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./EditCustomerRepairProduct.module.css"; // Reusing the same CSS

const AddCustomerRepairProduct = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    productName: "",
    productSerialNumbers: [""],
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    cmmRefNo: "",
    date: "",
    registerBy: "",
  });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const username = sessionStorage.getItem("username") || "";

    setForm((prev) => ({
      ...prev,
      date: formattedDate,
      registerBy: username,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSerialNumberChange = (index, value) => {
    const serials = [...form.productSerialNumbers];
    serials[index] = value;
    setForm({ ...form, productSerialNumbers: serials });
  };

  const addSerialNumber = () => {
    setForm({
      ...form,
      productSerialNumbers: [...form.productSerialNumbers, ""],
    });
  };

  const removeSerialNumber = (index) => {
    const serials = [...form.productSerialNumbers];
    serials.splice(index, 1);
    setForm({ ...form, productSerialNumbers: serials });
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9\s]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "CMM") {
      value = value.replace(/[^0-9-]/g, "");
    } else if (dataType === "ANH") {
      value = value.replace(/[^a-zA-Z0-9-]/g, "");
    }
    event.target.value = value;
  };

  const validateCMMRefNo = (value) => {
    const cmmPattern = /^[0-9-]+$/;
    return cmmPattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.productName ||
      !form.productDescription ||
      !form.unitOfMeasurement ||
      !form.oem ||
      !form.cmmRefNo ||
      !form.date ||
      !form.registerBy
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!validateCMMRefNo(form.cmmRefNo)) {
      toast.error("CMM Ref No should contain only numeric characters and dashes");
      return;
    }

    if (
      form.productSerialNumbers.length === 0 ||
      form.productSerialNumbers.some((sn) => sn.trim() === "")
    ) {
      toast.error("Please add at least one valid serial number");
      return;
    }

    try {
      const response = await createRepairProduct(form);
      console.log("Customer Repair Product added:", response.data);
      toast.success("Customer Repair Product Added Successfully!");
      
      const username = sessionStorage.getItem("username") || "";
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setForm({
        productName: "",
        productSerialNumbers: [""],
        productDescription: "",
        unitOfMeasurement: "",
        oem: "",
        cmmRefNo: "",
        date: formattedDate,
        registerBy: username,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
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
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>
                Add Customer Repair Product
              </span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Product Name & OEM */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Product Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="productName"
                        className={styles.input}
                        value={form.productName}
                        onInput={(event) => validateDataType(event, "ANH")}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        OEM <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="oem"
                        className={styles.input}
                        value={form.oem}
                        onInput={(event) => validateDataType(event, "A")}
                        onChange={handleChange}
                        placeholder="Enter OEM"
                        required
                      />
                    </div>
                  </div>

                  {/* Serial Numbers */}
                  <div className={styles.serialNumberSection}>
                    <label className={styles.label}>
                      Serial Numbers <span className={styles.required}>*</span>
                    </label>
                    {form.productSerialNumbers.map((sn, index) => (
                      <div key={index} className={styles.serialNumberGroup}>
                        <input
                          type="text"
                          className={`${styles.input} ${styles.serialNumberInput}`}
                          value={sn}
                          onInput={(event) => validateDataType(event, "ANH")}
                          onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                          placeholder={`Serial Number ${index + 1}`}
                          required
                        />
                        {form.productSerialNumbers.length > 1 && (
                          <button
                            type="button"
                            className={styles.btnRemoveSerial}
                            onClick={() => removeSerialNumber(index)}
                            title="Remove Serial Number"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className={styles.btnAddSerial} 
                      onClick={addSerialNumber}
                    >
                      <i className="fa fa-plus"></i>
                      <span>Add Serial Number</span>
                    </button>
                  </div>

                  {/* Product Description */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles.label}>
                        Product Description <span className={styles.required}>*</span>
                      </label>
                      <textarea
                        name="productDescription"
                        className={styles.textarea}
                        value={form.productDescription}
                        onInput={(event) => validateDataType(event, "A")}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Enter detailed product description"
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Unit of Measurement */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Unit of Measurement <span className={styles.required}>*</span>
                      </label>
                      <select
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                        className={styles.select}
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

                  {/* CMM Ref No, Date, Registered By */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        CMM Ref No <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="cmmRefNo"
                        className={styles.input}
                        value={form.cmmRefNo}
                        onInput={(event) => validateDataType(event, "CMM")}
                        onChange={handleChange}
                        placeholder="e.g., 123-456-789 or 213123"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        className={styles.input}
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Registered By <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="registerBy"
                        className={styles.input}
                        value={form.registerBy}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className={styles.formActions}>
                    <button 
                      type="button" 
                      className={styles.btnCancel}
                      onClick={() => navigate(-1)}
                    >
                      <i className="fa fa-times"></i>
                      <span>Cancel</span>
                    </button>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-plus-circle"></i>
                      <span>Add Product</span>
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

export default AddCustomerRepairProduct;