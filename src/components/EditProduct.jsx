import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail, updateProduct } from "../services/db_manager"; // Assuming these API functions are defined
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditProduct = () => {
  const { productId } = useParams(); // Get the productId from URL
  const navigate = useNavigate();
  const [showAlternate, setShowAlternate] = useState(false);
  const [showAlternateName, setShowAlternateName] = useState(false);

  // 🟩 get today’s date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loggedUser = sessionStorage.getItem("username"); // username stored at login
    if (loggedUser) {
      setForm(prev => ({ ...prev, registeredBy: loggedUser }));
    }
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
    alternateProduct: "",  // make sure it’s present
  });

  useEffect(() => {
  const fetchProductDetail = async () => {
    try {
      const response = await getProductDetail(productId);
      if (response.data) {
        setForm(response.data);

        // Set alternate product flags
        if (response.data.alternateProduct) {
          setShowAlternate(true);      // ✅ radio button shows Yes
          setShowAlternateName(true);  // ✅ allows swapping button ↕ to appear
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
    unitOfMeasurement: { required: true, length: 6, regex: /^[a-zA-Z]*$/ },
    materialClassification: { required: true, length: 30, regex: /^[a-zA-Z0-9\s-]*$/ },
    oem: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    nha: { required: false, length: 255, regex: /^[a-zA-Z0-9\s-]*$/ },
    cmmReferenceNumber: { required: false, type: "number", length: 12 },
    registeredBy: { required: true, length: 255, regex: /^[a-zA-Z\s-]*$/ },
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
                          Product Name <span style={{ color: "red" }}>*</span>
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

                    {/* Yes/No radio for Alternate Product */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Alternate Product?</label>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="alternateProductOption"
                              id="altYes"
                              checked={showAlternate === true}
                              onChange={() => setShowAlternate(true)}
                            />
                            <label className="form-check-label" htmlFor="altYes">
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="alternateProductOption"
                              id="altNo"
                              checked={showAlternate === false}
                              onChange={() => {
                                setShowAlternate(false);
                                setForm({ ...form, alternateProduct: "" });
                              }}
                            />
                            <label className="form-check-label" htmlFor="altNo">
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Only show alternate product field if Yes */}
                    {showAlternate && (
                      <div className="col-md-12 d-flex">
                        <div className="col-md-6 p-2 d-flex">
                          <label className="col-md-4 mt-2">Alternate Product Name</label>
                          <input
                            className="form-control w-100"
                            type="text"
                            name="alternateProduct"
                            value={form.alternateProduct || ""}
                            onChange={handleChange}
                          />
                        </div>
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
                          type="Number"
                          name="cmmReferenceNumber"
                          onInput={(event) => {
                            validateLen(event, 1, 12);
                          }}
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
