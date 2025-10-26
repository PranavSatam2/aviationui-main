import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { createProduct, fetchPartNumbersAndDescriptions } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const AddProduct = () => {
  const [showAlternateName1, setShowAlternateName1] = useState(false); // toggle state
  const [showAlternateName2, setShowAlternateName2] = useState(false);
  const [mappingType, setMappingType] = useState(""); // "UP", "DOWN", "BOTH"
  const [partList, setPartList] = useState([]);


  // 🟩 get today’s date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loggedUser = sessionStorage.getItem("username"); // username stored at login
    if (loggedUser) {
      setForm((prev) => ({ ...prev, registeredBy: loggedUser }));
    }

    // Fetch part numbers from API
    fetchPartNumbersAndDescriptions()
      .then((data) => {
        setPartList(data);
      })
      .catch((error) => {
        console.error("Error fetching part numbers:", error);
      });
  }, []);

  const [form, setForm] = useState({
    materialClassification: "",
    productName: "",
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    nha: "",
    cmmReferenceNumber: "",
    registrationDate: today, // 🟩 set today
    registeredBy: "", // will fill later
    alternateProduct1: "", // new field
    alternateProduct2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validation helpers (unchanged)
  const validateField = (fieldName, value, rules) => {
    if (!value && rules.required) return `${fieldName} is required.`;

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
    productName: { required: true, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    productDescription: {
      required: true,
      length: 255,
      regex: /^[a-zA-Z0-9\s-]*$/,
    },
    unitOfMeasurement: {
      required: true,
      length: 10,
      regex: /^[a-zA-Z0-9.\s-]*$/,
    },
    materialClassification: {
      required: true,
      length: 30,
      regex: /^[a-zA-Z0-9\s-]*$/,
    },
    oem: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    nha: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    cmmReferenceNumber: { required: false, regex: /^[0-9\s-]*$/, length: 12 },
    registeredBy: { required: true, length: 255, regex: /^[a-zA-Z\s-]*$/ },
  };

  // Optional: validate alternateName only if showAlternateName true
  if (showAlternateName1) {
    validationRules.alternateProduct1 = {
      required: true,
      length: 255,
      regex: /^[a-zA-Z0-9\s-]*$/,
    };
  }

  if (showAlternateName2) {
    validationRules.alternateProduct2 = {
      required: true,
      length: 255,
      regex: /^[a-zA-Z0-9\s-]*$/,
    };
  }

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 \-]/g, ""); // allow hyphen
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@\.\-]/g, "");
    } else if (dataType === "L") {
      value = value.replace(/[^0-9 \-]/g, "");// allow only digits
    }
    event.target.value = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Iterate through each field and validate
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        alert(error);
        return;
      }
    }

    const payload = { ...form };
    if (!showAlternateName1) delete payload.alternateProduct1;
    if (!showAlternateName2) delete payload.alternateProduct2;

    try {
      const response = await createProduct(payload);
      console.log("Product added successfully:", response.data);
      alert("Product Added Successfully!");
      location.reload();

      // Reset the form after successful submission
      setForm({
        materialClassification: "",
        productName: "",
        productDescription: "",
        unitOfMeasurement: "",
        oem: "",
        nha: "",
        cmmReferenceNumber: "",
        registrationDate: today,
        registeredBy: form.registeredBy,
        alternateProduct1: "",
        alternateProduct2: "",
      });
      setShowAlternateName1(false);
    } catch (error) {
      console.error("Error adding product:", error);

      // 🔹 Show an alert popup instead of inline text
      if (error.response && error.response.status === 409) {
        alert(
          "This part number / product name already exists. Please enter a different one."
        );
      } else {
        alert("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Add Products" isBack={true} />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ height: "auto" }}
              >
                <div className="col-md-12">
                  <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">
                          Product Number <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="input-group w-100">
                          <input
                            className="form-control"
                            type="text"
                            name="productName"
                            onInput={(event) => validateDataType(event, "A")}
                            value={form.productName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">
                          Material Classification{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-select w-100"
                          name="materialClassification"
                          value={form.materialClassification}
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            Select Material Classification
                          </option>
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

                    {(showAlternateName1 || showAlternateName2) && (
                      <div className="d-flex align-items-center mb-3">
                        <label className="col-md-2 ml-3 mt-2 p-2 fw-semibold">
                          Mapping Type<span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Mapping Type"
                          style={{ marginLeft: "10px" }}
                          required
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setForm({ ...form, mappingType: "UP" })
                            }
                            className={`btn ${form.mappingType === "UP"
                              ? "btn-primary"
                              : "btn-outline-primary"
                              }`}
                            style={{
                              minWidth: "80px",
                              fontWeight: "bold",
                              letterSpacing: "1px",
                            }}
                          >
                            <i className="bi bi-arrow-up"></i> UP
                          </button>
                          {/* <button
                            type="button"
                            onClick={() =>
                              setForm({ ...form, mappingType: "DOWN" })
                            }
                            className={`btn ${form.mappingType === "DOWN"
                                ? "btn-success"
                                : "btn-outline-success"
                              }`}
                            style={{
                              minWidth: "80px",
                              fontWeight: "bold",
                              letterSpacing: "1px",
                            }}
                          >
                            <i className="bi bi-arrow-down"></i> DOWN
                          </button> */}
                          <button
                            type="button"
                            onClick={() =>
                              setForm({ ...form, mappingType: "BOTH" })
                            }
                            className={`btn ${form.mappingType === "BOTH"
                              ? "btn-warning text-white"
                              : "btn-outline-warning"
                              }`}
                            style={{
                              minWidth: "80px",
                              fontWeight: "bold",
                              letterSpacing: "1px",
                            }}
                          >
                            <i className="bi bi-arrow-down-up"></i> BOTH
                          </button>
                        </div>
                      </div>
                    )}

                    {/* === Alternate Name radio === */}
                    <div className="col-md-12 d-flex p-2">
                      <label className="col-md-2 mt-2">
                        Alternate Product Number 1?
                      </label>
                      <div className="col-md-4 d-flex mt-2">
                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="alternateOption"
                            id="alternateYes"
                            value="yes"
                            onChange={() => setShowAlternateName1(true)}
                            checked={showAlternateName1}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="alternateYes"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="alternateOption"
                            id="alternateNo"
                            value="no"
                            onChange={() => {
                              setShowAlternateName1(false);
                              setForm({ ...form, alternateName1: "" });
                            }}
                            checked={!showAlternateName1}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="alternateNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* === Alternate Name Field (conditional) === */}
                    {showAlternateName1 && (
                      <div className="col-md-12 d-flex p-2">
                        <label className="col-md-2 mt-2">
                          Alternate Product Number 1 <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-select w-100"
                          name="alternateProduct1"
                          value={form.alternateProduct1}
                          onChange={handleChange}
                          required={showAlternateName1}
                        >
                          <option value="">Select Alternate Product 1</option>
                          {partList.map((part, index) => (
                            <option key={index} value={part.productNumber || part.partNo}>
                              {part.productName || part.partNo}
                            </option>
                          ))}
                        </select>

                      </div>
                    )}

                    {/* === Alternate Name 2 radio === */}
                    <div className="col-md-12 d-flex p-2">
                      <label className="col-md-2 mt-2">
                        Alternate Product Number 2?
                      </label>
                      <div className="col-md-4 d-flex mt-2">
                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="alternateOption2"
                            id="alternateYes2"
                            value="yes"
                            onChange={() => setShowAlternateName2(true)}
                            checked={showAlternateName2}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="alternateYes2"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="alternateOption2"
                            id="alternateNo2"
                            value="no"
                            onChange={() => {
                              setShowAlternateName2(false);
                              setForm({ ...form, alternateProduct2: "" });
                            }}
                            checked={!showAlternateName2}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="alternateNo2"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* === Alternate Name 2 Field (conditional) === */}
                    {showAlternateName2 && (
                      <div className="col-md-12 d-flex p-2">
                        <label className="col-md-2 mt-2">
                          Alternate Product Number 2 <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-select w-100"
                          name="alternateProduct2"
                          value={form.alternateProduct2}
                          onChange={handleChange}
                          required={showAlternateName2}
                        >
                          <option value="">Select Alternate Product 2</option>
                          {partList.map((part, index) => (
                            <option key={index} value={part.productNumber || part.partNo}>
                              {part.productName || part.partNo}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">
                        Product Description{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        className="form-control w-100"
                        name="productDescription"
                        value={form.productDescription}
                        onInput={(event) => {
                          validateDataType(event, "A");
                        }}
                        onChange={handleChange}
                        style={{ height: "70px" }}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-1 d-flex">
                        <label className="col-md-4 mt-2">
                          Unit of Measurement{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-select w-100"
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

                      <div className="col-md-6 d-flex">
                        <label className="col-md-4 mt-2">OEM</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="oem"
                          onInput={(event) => {
                            validateDataType(event, "A");
                          }}
                          value={form.oem}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">NHA</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="nha"
                          value={form.nha}
                          onInput={(event) => {
                            validateDataType(event, "A");
                          }}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">
                          CMM Reference Number
                        </label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="cmmReferenceNumber"
                          value={form.cmmReferenceNumber}
                          onInput={(event) => validateDataType(event, "L")}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">
                          Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="registrationDate"
                          value={form.registrationDate}
                          onChange={handleChange}
                          readOnly // 🟩 prevents manual change
                        />
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">
                          Registered By<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="registeredBy"
                          value={form.registeredBy}
                          onInput={(event) => {
                            validateDataType(event, "A");
                          }}
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <button type="submit" className="btn btn-primary">
                        Add Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
