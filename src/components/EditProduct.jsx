import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail, updateProduct } from "../services/db_manager"; // Assuming these API functions are defined

const EditProduct = () => {
  const { productId } = useParams(); // Get the productId from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    materialClassification: "",
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    nha: "",
    cmmReferenceNumber: "",
    date: "",
    registeredBy: "",
  });

  useEffect(() => {
    // Fetch the product details when the component mounts
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail(productId); // Get product by ID
        if (response.data) {
          setForm(response.data); // Set the fetched product details in state
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
    if (!value) return `${fieldName} is required.`;

    if (rules.type === 'number' && isNaN(value)) {
      return `${fieldName} should be a number.`;
    }

    if (rules.length && value.length > rules.length) {
      return `${fieldName} should be at most ${rules.length} characters.`;
    }

    if (rules.regex && !rules.regex.test(value)) {
      return `${fieldName} has invalid characters.`;
    }

    return null; // No error
  };

  // New validation rules object
  const validationRules = {
    productName: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    productDescription: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    unitOfMeasurement: {
      length: 6,
      regex: /^[a-zA-Z]*$/,
    },
    materialClassification: {
      length: 30,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    oem: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    nha: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    cmmReferenceNumber: {
      type: 'number',
      length: 12,
    },
    registeredBy: {
      length: 255,
      regex: /^[a-zA-Z\s]*$/,
    },
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
        {/* content Begin */}
        <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-4 mb-0 text-gray-800">Edit Product</h5>
          </div>
        </div>
        <div className="my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 card border border-dark shadow-lg py-2">
              <div className="col-md-12">
                <form onSubmit={handleSubmit}>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-5 mt-1">Product Name</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="productName"
                        value={form.productName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-5 mt-2">Material Classification</label>
                      <select
                        className="form-control w-100"
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

                  <div className="col-md-12 p-3 d-flex">
                    <label className="col-md-2 mt-2">Product Description</label>
                    <textarea
                      className="form-control w-100"
                      name="productDescription"
                      value={form.productDescription}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-1 d-flex">
                      <label className="col-md-6 mt-2">Unit of Measurement</label>
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
                        <option value="Sq. ft">Sq. ft</option>
                        <option value="Sq.mtr">Sq.mtr</option>
                      </select>
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-3 mt-2">OEM</label>
                      <textarea
                        className="form-control w-100"
                        type="text"
                        name="oem"
                        value={form.oem}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">NHA</label>
                      <textarea
                        className="form-control w-100"
                        type="text"
                        name="nha"
                        value={form.nha}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">CMM Reference Number</label>
                      <input
                        className="form-control w-100"
                        type="Number"
                        name="cmmReferenceNumber"
                        value={form.cmmReferenceNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Date</label>
                      <input
                        className="form-control w-100"
                        type="date"
                        name="date"
                        value={form.registration_date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Registered By</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="registeredBy"
                        value={form.registeredBy}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 text-end m-1 p-4">
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
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
