import { useState, useEffect, useRef } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import {
  createPurchaseRequisition,
  fetchCurrentQuantityFromStore,
  fetchPartNumbersAndDescriptions,
} from "../../../services/db_manager";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./AddPurchaseRequisition.module.css";

const AddPurchaseRequisition = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    partNumber: "",
    description: "",
    currentStock: "",
    requiredQty: "",
    requiredDate: "",
    remark: "",
    unitOfMeasurement: "",
  });

  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setForm((prev) => ({
      ...prev,
      requiredDate: formattedDate,
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPartNumbersAndDescriptions();
        setData(response);
        setFilteredData(response);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.alternateProduct &&
            item.alternateProduct
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePartSelection = (selectedItem) => {
    setForm((prevForm) => ({
      ...prevForm,
      partNumber: selectedItem.productName,
      description: selectedItem.productDescription,
      unitOfMeasurement: selectedItem.unitOfMeasurement || "",
    }));
    setSearchTerm(selectedItem.productName);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (form.partNumber) {
      const currentQuantity = async () => {
        try {
          const result = await fetchCurrentQuantityFromStore(form.partNumber);
          console.log("Fetched currentQuantity:", result.data);
          if (result && result.data !== null && result.data !== undefined) {
            setForm((prev) => ({
              ...prev,
              currentStock: result.data,
            }));
          } else {
            setForm((prev) => ({
              ...prev,
              currentStock: 0,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch currentStock", err);
        }
      };
      currentQuantity();
    }
  }, [form.partNumber]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    if (!value) {
      setForm((prevForm) => ({
        ...prevForm,
        partNumber: "",
        description: "",
        unitOfMeasurement: "",
      }));
    }
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
      length: 255,
    },
    description: {
      length: 255,
      regex: /^[a-zA-Z0-9\s\-_.,/]*$/,
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

  const clearValidationClasses = () => {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll(".form-control, .form-select");
    inputs.forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
  };

  const handleAddRequisition = (e) => {
    e.preventDefault();

    console.log("Form values:", {
      partNumber: form.partNumber,
      description: form.description,
      currentStock: form.currentStock,
      requiredQty: form.requiredQty,
      requiredDate: form.requiredDate,
      remark: form.remark,
      unitOfMeasurement: form.unitOfMeasurement,
    });

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        console.log(`Validation error for ${field}:`, error);
        toast.error(error);
        return;
      }
    }

    const alreadyExists = purchaseRequisitions.some(
      (req) => req.partNumber === form.partNumber
    );

    if (alreadyExists) {
      toast.warning(`Part Number "${form.partNumber}" is already in the list!`);
      return;
    }

    const newRequisition = {
      ...form,
      id: Date.now(),
    };

    setPurchaseRequisitions([...purchaseRequisitions, newRequisition]);

    clearValidationClasses();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setForm({
      partNumber: "",
      description: "",
      currentStock: "",
      requiredQty: "",
      requiredDate: formattedDate,
      remark: "",
      unitOfMeasurement: "",
    });

    setSearchTerm("");
    setIsDropdownOpen(false);

    toast.success("Purchase Requisition added to the list!");
  };

  const handleRemoveRequisition = (id) => {
    setPurchaseRequisitions(
      purchaseRequisitions.filter((req) => req.id !== id)
    );
    toast.info("Item removed from list");
  };

  const handleSubmitAll = async () => {
    if (purchaseRequisitions.length === 0) {
      toast.warning("No purchase requisitions to submit!");
      return;
    }

    try {
      const requisitionsToSubmit = purchaseRequisitions.map((req) => ({
        partNumber: req.partNumber,
        description: req.description,
        currentStock: req.currentStock,
        requiredQty: req.requiredQty,
        requiredDate: req.requiredDate,
        unitOfMeasurement: req.unitOfMeasurement,
        remark: req.remark,
      }));

      await createPurchaseRequisition(requisitionsToSubmit);
      setPurchaseRequisitions([]);
      toast.success("All Purchase Requisitions submitted successfully!");
    } catch (error) {
      console.error("Error submitting purchase requisitions:", error);
      toast.error("Failed to submit purchase requisitions.");
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
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>
                Add Purchase Requisition
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleAddRequisition}>
                  {/* Part Number */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      {loading ? (
                        <div className={styles.loadingBox}>
                          <div className={styles.spinner}></div>
                          <span>Loading part numbers...</span>
                        </div>
                      ) : error ? (
                        <div className={styles.errorBox}>{error}</div>
                      ) : (
                        <div className={styles.searchableDropdown} ref={dropdownRef}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Search part number..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setIsDropdownOpen(true)}
                            required
                          />
                          {isDropdownOpen && filteredData.length > 0 && (
                            <div className={styles.dropdownMenu}>
                              {filteredData.map((item, index) => (
                                <div
                                  key={index}
                                  className={styles.dropdownItem}
                                  onClick={() => handlePartSelection(item)}
                                >
                                  <div className={styles.itemTitle}>
                                    {item.productName}
                                    {item.mappingType === "DOWN" && (
                                      <span className={styles.arrow}>↓</span>
                                    )}
                                    {item.mappingType === "UP" && (
                                      <span className={styles.arrow}>↑</span>
                                    )}
                                    {item.mappingType === "BOTH" && (
                                      <span className={styles.arrow}>↑↓</span>
                                    )}
                                  </div>
                                  <div className={styles.itemSubtitle}>
                                    Alternate-Product 1: {item?.alternateProduct1 || "N/A"}
                                  </div>
                                  <div className={styles.itemSubtitle}>
                                    Alternate-Product 2: {item?.alternateProduct2 || "N/A"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Description <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        value={form.description || "Auto-selected"}
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
                        placeholder="Enter required quantity"
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
                        disabled
                      >
                        <option value="">Auto-selected from part</option>
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
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Remark</label>
                      <input
                        type="text"
                        className={styles.input}
                        name="remark"
                        onInput={(event) => validateDataType(event, "A")}
                        value={form.remark}
                        onChange={handleChange}
                        placeholder="Optional remarks"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnAdd}>
                      <i className="fa fa-plus"></i>
                      <span>Add to List</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Requisitions List */}
            {purchaseRequisitions.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <i className="fa fa-list"></i>
                  <span>Purchase Requisitions List ({purchaseRequisitions.length})</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Part Number</th>
                          <th>Description</th>
                          <th>Current Stock</th>
                          <th>Required Qty</th>
                          <th>Unit</th>
                          <th>Required Date</th>
                          <th>Remark</th>
                          <th className={styles.actionsHeader}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseRequisitions.map((req, index) => (
                          <tr key={req.id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>{req.partNumber}</td>
                            <td>{req.description}</td>
                            <td>{req.currentStock}</td>
                            <td>{req.requiredQty}</td>
                            <td>{req.unitOfMeasurement}</td>
                            <td>{req.requiredDate}</td>
                            <td>{req.remark || "-"}</td>
                            <td className={styles.actionsCell}>
                              <button
                                className={styles.btnRemove}
                                onClick={() => handleRemoveRequisition(req.id)}
                                title="Remove"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.submitActions}>
                    <button className={styles.btnSubmitAll} onClick={handleSubmitAll}>
                      <i className="fa fa-check-circle"></i>
                      <span>Submit All Requisitions</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddPurchaseRequisition;