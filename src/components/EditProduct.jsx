import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail, updateProduct, fetchPartNumbersAndDescriptions } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import styles from "./EditProduct.module.css";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [showAlternateName1, setShowAlternateName1] = useState(false);
  const [showAlternateName2, setShowAlternateName2] = useState(false);
  const [partList, setPartList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loggedUser = sessionStorage.getItem("username");
    if (loggedUser) {
      setForm((prev) => ({ ...prev, registeredBy: loggedUser }));
    }

    fetchPartNumbersAndDescriptions()
      .then((data) => {
        setPartList(data);
      })
      .catch((error) => {
        console.error("Error fetching part numbers:", error);
      });
  }, []);

  const [form, setForm] = useState({
    productName: "",
    materialClassification: "",
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    nha: "",
    cmmReferenceNumber: "",
    registrationDate: today,
    registeredBy: sessionStorage.getItem("username") || "",
    alternateProduct1: "",
    alternateProduct2: "",
    mappingType: "",
  });

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail(productId);
        if (response.data) {
          setForm(response.data);

          if (response.data.alternateProduct1) {
            setShowAlternateName1(true);
          }
          if (response.data.alternateProduct2) {
            setShowAlternateName2(true);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Error fetching product details.");
      }
    };
    fetchProductDetail();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateField = (fieldName, value, rules) => {
    if (rules.required && !value) return `${fieldName} is required.`;
    if (rules.type === "number" && value && isNaN(value)) {
      return `${fieldName} should be a number.`;
    }
    if (rules.length && value && value.length > rules.length) {
      return `${fieldName} should be at most ${rules.length} characters.`;
    }
    if (rules.regex && value && !rules.regex.test(value)) {
      return `${fieldName} has invalid characters.`;
    }
    return null;
  };

  const validationRules = {
    productName: { required: true, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    productDescription: { required: true, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    unitOfMeasurement: { required: true, length: 10, regex: /^[a-zA-Z0-9.\s-]*$/ },
    materialClassification: { required: true, length: 30, regex: /^[a-zA-Z0-9\s-]*$/ },
    oem: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    nha: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    cmmReferenceNumber: { required: false, regex: /^[0-9\s-]*$/, length: 12 },
    registeredBy: { required: true, length: 255, regex: /^[a-zA-Z\s-]*$/ },
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 \-]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@\.\-]/g, "");
    } else if (dataType === "L") {
      value = value.replace(/[^0-9 \-]/g, "");
    }
    event.target.value = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        alert(error);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await updateProduct(productId, form);
      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate("/productList");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          <div className={styles.breadcrumbSection}>
            <button 
              className={styles.backButton}
              onClick={() => navigate("/productList")}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Edit Products</span>
            </div>
          </div>

          <div className={styles.formContainer}>
            <div className={styles.card}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Basic Information</h3>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="productName"
                        onInput={(event) => validateDataType(event, "A")}
                        value={form.productName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Material Classification <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="materialClassification"
                        value={form.materialClassification}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Material Classification</option>
                        <option value="Consumable">Consumable</option>
                        <option value="Spare part">Spare part</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Tape">Tape</option>
                        <option value="Adhesive">Adhesive</option>
                        <option value="Sealant">Sealant</option>
                        <option value="Fiber Cloths">Fiber Cloths</option>
                        <option value="General">General</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                        <option value="Finish Product">Finish Product</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Interchangeability Section */}
                {(showAlternateName1 || showAlternateName2) && (
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Interchangeability</h3>
                    <div className={styles.mappingButtons}>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, mappingType: "UP" })}
                        className={`${styles.mappingBtn} ${
                          form.mappingType === "UP" ? styles.mappingBtnActive : ""
                        }`}
                      >
                        <i className="fa fa-arrow-up"></i>
                        <span>UP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, mappingType: "BOTH" })}
                        className={`${styles.mappingBtn} ${
                          form.mappingType === "BOTH" ? styles.mappingBtnActive : ""
                        }`}
                      >
                        <i className="fa fa-arrow-up"></i>
                        <i className="fa fa-arrow-down"></i>
                        <span>BOTH</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Alternate Products Section */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Alternate Products</h3>

                  {/* Alternate Product 1 */}
                  <div className={styles.radioGroup}>
                    <label className={styles.label}>Alternate Part Number 1?</label>
                    <div className={styles.radioOptions}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="alternateOption"
                          checked={showAlternateName1}
                          onChange={() => setShowAlternateName1(true)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="alternateOption"
                          checked={!showAlternateName1}
                          onChange={() => {
                            setShowAlternateName1(false);
                            setForm(prev => ({ ...prev, alternateProduct1: "" }));
                          }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {showAlternateName1 && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Alternate Part Number 1 <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="alternateProduct1"
                        value={form.alternateProduct1}
                        onChange={handleChange}
                        required={showAlternateName1}
                      >
                        <option value="">Select Alternate Product 1</option>
                        {partList.map((part, index) => (
                          <option key={index} value={part.productName}>
                            {part.productName} → {part.quantity}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Alternate Product 2 */}
                  <div className={styles.radioGroup}>
                    <label className={styles.label}>Alternate Part Number 2?</label>
                    <div className={styles.radioOptions}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="alternateOption2"
                          checked={showAlternateName2}
                          onChange={() => setShowAlternateName2(true)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="alternateOption2"
                          checked={!showAlternateName2}
                          onChange={() => {
                            setShowAlternateName2(false);
                            setForm(prev => ({ ...prev, alternateProduct2: "" }));
                          }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {showAlternateName2 && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Alternate Part Number 2 <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="alternateProduct2"
                        value={form.alternateProduct2}
                        onChange={handleChange}
                        required={showAlternateName2}
                      >
                        <option value="">Select Alternate Product 2</option>
                        {partList.map((part, index) => (
                          <option key={index} value={part.productName}>
                            {part.productName} → {part.quantity}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Product Details Section */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Product Details</h3>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Part Description <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      className={styles.textarea}
                      name="productDescription"
                      value={form.productDescription}
                      onInput={(event) => validateDataType(event, "A")}
                      onChange={handleChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>

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

                    <div className={styles.formGroup}>
                      <label className={styles.label}>OEM</label>
                      <input
                        className={styles.input}
                        type="text"
                        name="oem"
                        onInput={(event) => validateDataType(event, "A")}
                        value={form.oem}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>NHA</label>
                      <input
                        className={styles.input}
                        type="text"
                        name="nha"
                        value={form.nha}
                        onInput={(event) => validateDataType(event, "A")}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>CMM Reference Number</label>
                      <input
                        className={styles.input}
                        type="text"
                        name="cmmReferenceNumber"
                        onInput={(event) => validateDataType(event, "L")}
                        value={form.cmmReferenceNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Registration Section */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Registration Information</h3>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="date"
                        name="registrationDate"
                        value={form.registrationDate}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Registered By <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="registeredBy"
                        value={form.registeredBy}
                        onInput={(event) => validateDataType(event, "A")}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => navigate("/productList")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner}></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save"></i>
                        Update Product
                      </>
                    )}
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

export default EditProduct;