import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateRepairProduct } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditCustomerRepairProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    productSerialNumbers: [""], // start with one empty serial number field
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
          // Ensure at least one serial number exists
          if (!product.productSerialNumbers || product.productSerialNumbers.length === 0) {
            product.productSerialNumbers = [""];
          }
          
          // Get username from session storage and set it
          const username = sessionStorage.getItem('username') || '';
          product.registerBy = username;
          
          setForm(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle simple input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle serial numbers change
  const handleSerialNumberChange = (index, value) => {
    const updatedSerials = [...form.productSerialNumbers];
    updatedSerials[index] = value;
    setForm({ ...form, productSerialNumbers: updatedSerials });
  };

  // Add new serial number field
  const addSerialNumberField = () => {
    setForm({ ...form, productSerialNumbers: [...form.productSerialNumbers, ""] });
  };

  // Remove a serial number field
  const removeSerialNumberField = (index) => {
    const updatedSerials = form.productSerialNumbers.filter((_, i) => i !== index);
    setForm({ ...form, productSerialNumbers: updatedSerials.length ? updatedSerials : [""] });
  };

  // Validation functions
  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9\s]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "CMM") {
      // Allow only numeric and dash for CMM Ref No
      value = value.replace(/[^0-9-]/g, "");
    }
    event.target.value = value;
  };

  const validateCMMRefNo = (value) => {
    // CMM Ref No should be numeric OR dash only (examples: 123-456-789, 213123)
    const cmmPattern = /^[0-9-]+$/;
    return cmmPattern.test(value);
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.productName) {
      alert("Product Name is required");
      return;
    }

    if (form.productSerialNumbers.some((sn) => !sn)) {
      alert("All Serial Number fields must be filled");
      return;
    }

    // CMM Ref No validation
    if (form.cmmRefNo && !validateCMMRefNo(form.cmmRefNo)) {
      alert("CMM Ref No should contain only numeric characters and dashes (e.g., 123-456-789 or 213123).");
      return;
    }

    try {
      const response = await updateRepairProduct(id, form);
      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate("/viewCustomersRepairProduct");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Edit Customer Repair Product" isBack={true} />
          <div className="my-2 p-2">
            <div className="container-fluid">
              <div className="row mx-1 card border border-dark shadow-lg py-2 p-4">
                <div className="col-md-12" style={{ height: "72vh", overflowY: "scroll" }}>
                  <form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Product Name *</label>
                        <input
                          type="text"
                          name="productName"
                          className="form-control"
                          value={form.productName}
                          onInput={(event) => validateDataType(event, "A")}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">OEM *</label>
                        <input
                          type="text"
                          name="oem"
                          className="form-control"
                          value={form.oem}
                          onInput={(event) => validateDataType(event, "A")}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Serial Numbers */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label fw-bold">Serial Numbers *</label>
                        {form.productSerialNumbers.map((sn, index) => (
                          <div key={index} className="d-flex mb-2">
                            <input
                              type="text"
                              className="form-control me-2"
                              value={sn}
                              onInput={(event) => validateDataType(event, "A")}
                              onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                              required
                            />
                            {form.productSerialNumbers.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeSerialNumberField(index)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" className="btn btn-outline-secondary" onClick={addSerialNumberField}>
                          <i className="fa fa-plus me-1"></i>Add Serial Number
                        </button>
                      </div>
                    </div>

                    {/* Product Description */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label fw-bold">Product Description *</label>
                        <textarea
                          name="productDescription"
                          className="form-control"
                          value={form.productDescription}
                          onInput={(event) => validateDataType(event, "A")}
                          onChange={handleChange}
                          rows="3"
                          required
                        ></textarea>
                      </div>
                    </div>

                    {/* Unit of Measurement */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Unit of Measurement *</label>
                        <select
                          name="unitOfMeasurement"
                          value={form.unitOfMeasurement}
                          onChange={handleChange}
                          className="form-select"
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
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">CMM Ref No</label>
                        <input
                          type="text"
                          name="cmmRefNo"
                          className="form-control"
                          value={form.cmmRefNo}
                          onInput={(event) => validateDataType(event, "CMM")}
                          onChange={handleChange}
                          placeholder="e.g., 123-456-789 or 213123"
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-bold">Date</label>
                        <input
                          type="date"
                          name="date"
                          className="form-control"
                          value={form.date}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-bold">Registered By</label>
                        <input
                          type="text"
                          name="registerBy"
                          className="form-control"
                          value={form.registerBy}
                          disabled
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="row">
                      <div className="col-md-12 text-end">
                        <button type="submit" className="btn btn-primary px-4 py-2">
                          <i className="fa fa-save me-2"></i>Update Product
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
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
