import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail, updateProduct, fetchPartNumbersAndDescriptions } from "../services/db_manager"; // Assuming these API functions are defined
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditProduct = () => {
  const { productId } = useParams(); // Get the productId from URL
  const navigate = useNavigate();
  const [showAlternate, setShowAlternate] = useState(false);
  const [showAlternateName, setShowAlternateName] = useState(false);
  const [showAlternateName1, setShowAlternateName1] = useState(false); // toggle state
  const [showAlternateName2, setShowAlternateName2] = useState(false);
  const [partList, setPartList] = useState([]);

  // 🟩 get today's date in YYYY-MM-DD format
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

          // Set alternate product flags
          if (response.data) {
            setForm(response.data);

            if (response.data.alternateProduct1) {
              setShowAlternateName1(true);
            }
            if (response.data.alternateProduct2) {
              setShowAlternateName2(true);
            }
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

  // Helper function to validate each field
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

    return null; // No error
  };


  // New validation rules object
  const validationRules = {
    productName: { required: true, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    productDescription: { required: true, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    unitOfMeasurement: {
      required: true,
      length: 10,
      regex: /^[a-zA-Z0-9.\s-]*$/,
    },
    materialClassification: { required: true, length: 30, regex: /^[a-zA-Z0-9\s-]*$/ },
    oem: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    nha: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    cmmReferenceNumber: { required: false, type: "number", length: 12 },
    registeredBy: { required: true, length: 255, regex: /^[a-zA-Z\s-]*$/ },
  };

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

    try {
      // Send updated data to the API to update the product
      const response = await updateProduct(productId, form);
      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate("/productList"); // Redirect to product list page
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Edit Products" isBack={true} />
          {/* content Begin */}
          {/* <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <CustomBreadcrumb breadcrumbsLabel="Edit Products" isBack={true} />{" "}
          </div>
        </div> */}
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
                          {showAlternateName && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  productName: prev.alternateProduct,
                                  alternateProduct: prev.productName,
                                }));
                              }}
                            >
                              ↕
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">
                          Material Classification <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-control w-100"
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
                            <span style={{ fontSize: "20px" }}>
                                          ↑
                                        </span>
                            {/* <i className="bi bi-arrow-up"></i> UP */}
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
                            <span style={{ fontSize: "20px" }}>
                                          ↑↓
                                        </span>
                            {/* <i className="bi bi-arrow-down-up"></i> BOTH */}
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
                              setForm(prev => ({ ...prev, alternateProduct1: "" }));
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
                            <option key={index} value={part.productName}>
                              {part.productName} → {part.quantity}
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
                              setForm(prev => ({ ...prev, alternateProduct2: "" }));
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
                            <option key={index} value={part.productName}>
                              {part.productName} → {part.quantity}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}


                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">
                        Product Description <span style={{ color: "red" }}>*</span>
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
                          Unit of Measurement <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-control w-100"
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
                          onInput={(event) => validateDataType(event, "L")}
                          value={form.cmmReferenceNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Date<span style={{ color: "red" }}>*</span></label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="registrationDate"
                          value={form.registrationDate}
                          onChange={handleChange}
                          required
                          readOnly // 🟩 prevents manual change
                        />
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Registered By<span style={{ color: "red" }}>*</span></label>
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
                        Edit Product
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

export default EditProduct;