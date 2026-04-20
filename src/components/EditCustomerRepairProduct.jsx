import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateRepairProduct } from "../services/db_manager";
import { toast } from "react-toastify";
import styles from "./EditCustomerRepairProduct.module.css";

const EditCustomerRepairProduct = () => {
  const { id } = useParams();
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.data) {
          const product = response.data;
          if (!product.productSerialNumbers || product.productSerialNumbers.length === 0) {
            product.productSerialNumbers = [""];
          }
          
          const username = sessionStorage.getItem('username') || '';
          product.registerBy = username;
          
          setForm(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSerialNumberChange = (index, value) => {
    const updatedSerials = [...form.productSerialNumbers];
    updatedSerials[index] = value;
    setForm({ ...form, productSerialNumbers: updatedSerials });
  };

  const addSerialNumberField = () => {
    setForm({ ...form, productSerialNumbers: [...form.productSerialNumbers, ""] });
  };

  const removeSerialNumberField = (index) => {
    const updatedSerials = form.productSerialNumbers.filter((_, i) => i !== index);
    setForm({ ...form, productSerialNumbers: updatedSerials.length ? updatedSerials : [""] });
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9\s]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "CMM") {
      value = value.replace(/[^0-9-]/g, "");
    }
    event.target.value = value;
  };

  const validateCMMRefNo = (value) => {
    const cmmPattern = /^[0-9-]+$/;
    return cmmPattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productName) {
      toast.error("Product Name is required");
      return;
    }

    if (form.productSerialNumbers.some((sn) => !sn)) {
      toast.error("All Serial Number fields must be filled");
      return;
    }

    if (form.cmmRefNo && !validateCMMRefNo(form.cmmRefNo)) {
      toast.error("CMM Ref No should contain only numeric characters and dashes");
      return;
    }

    try {
      const response = await updateRepairProduct(id, form);
      if (response.status === 200) {
        toast.success("Product updated successfully!");
        navigate("/viewCustomersRepairProduct");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading product data...</p>
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
                Edit Customer Repair Product
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
                        onInput={(event) => validateDataType(event, "A")}
                        onChange={handleChange}
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
                          onInput={(event) => validateDataType(event, "A")}
                          onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                          placeholder={`Serial Number ${index + 1}`}
                          required
                        />
                        {form.productSerialNumbers.length > 1 && (
                          <button
                            type="button"
                            className={styles.btnRemoveSerial}
                            onClick={() => removeSerialNumberField(index)}
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
                      onClick={addSerialNumberField}
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
                      <label className={styles.label}>CMM Ref No</label>
                      <input
                        type="text"
                        name="cmmRefNo"
                        className={styles.input}
                        value={form.cmmRefNo}
                        onInput={(event) => validateDataType(event, "CMM")}
                        onChange={handleChange}
                        placeholder="e.g., 123-456-789 or 213123"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Date</label>
                      <input
                        type="date"
                        name="date"
                        className={styles.input}
                        value={form.date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Registered By</label>
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
                      <i className="fa fa-save"></i>
                      <span>Update Product</span>
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

export default EditCustomerRepairProduct;