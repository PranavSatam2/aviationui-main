import React, { useState, useEffect } from "react";
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
              <div className="row mx-1 card border border-dark shadow-lg py-2">
                <div className="col-md-12">
                  <form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-2 mt-2">Product Name</label>
                      <input
                        type="text"
                        name="productName"
                        className="form-control w-75"
                        value={form.productName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Serial Numbers */}
                    <div className="col-md-12 p-2">
                      <label className="mt-2">Serial Numbers</label>
                      {form.productSerialNumbers.map((sn, index) => (
                        <div key={index} className="d-flex mb-2">
                          <input
                            type="text"
                            className="form-control w-75"
                            value={sn}
                            onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-danger ms-2"
                            onClick={() => removeSerialNumberField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-secondary" onClick={addSerialNumberField}>
                        Add Serial Number
                      </button>
                    </div>

                    {/* Product Description */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-2 mt-2">Description</label>
                      <textarea
                        name="productDescription"
                        className="form-control w-75"
                        value={form.productDescription}
                        onChange={handleChange}
                        style={{ height: "70px" }}
                        required
                      ></textarea>
                    </div>

                    {/* Unit of Measurement & OEM */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Unit of Measurement</label>
                        <select
                          name="unitOfMeasurement"
                          value={form.unitOfMeasurement}
                          onChange={handleChange}
                          className="form-control w-75"
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

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">OEM</label>
                        <input
                          type="text"
                          name="oem"
                          className="form-control w-75"
                          value={form.oem}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* CMM Ref, Date, Registered By */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-4 p-2 d-flex">
                        <label className="col-md-5 mt-2">CMM Ref No</label>
                        <input
                          type="text"
                          name="cmmRefNo"
                          className="form-control w-75"
                          value={form.cmmRefNo}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4 p-2 d-flex">
                        <label className="col-md-4 mt-2">Date</label>
                        <input
                          type="date"
                          name="date"
                          className="form-control w-75"
                          value={form.date}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4 p-2 d-flex">
                        <label className="col-md-5 mt-2">Registered By</label>
                        <input
                          type="text"
                          name="registerBy"
                          className="form-control w-75"
                          value={form.registerBy}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end mt-3">
                      <button type="submit" className="btn btn-primary">
                        Update Product
                      </button>
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
