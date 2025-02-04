import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import axios from "axios"; // Import axios if you are using axios

const AddProduct = () => {
  const [form, setForm] = useState({
    materialClassification: "",
    productId: "",
    productName: "",
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    nha: "",
    cmmReferenceNumber: "",
    date: "",
    registeredBy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use axios or fetch to send data to the backend
    try {
      const response = await axios.post("https://your-api-endpoint.com/products", form);
      console.log("Product added successfully:", response.data);
      alert("Product Added Successfully!");

      // Reset the form after successful submission
      setForm({
        materialClassification: "",
        productId: "",
        productName: "",
        productDescription: "",
        unitOfMeasurement: "",
        oem: "",
        nha: "",
        cmmReferenceNumber: "",
        date: "",
        registeredBy: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div id="">
      <Header />
      <div id="content-wrapper" className="d-flex flex-row mt-5">
        <div id="content">
          <div className="container-fluid">
            <div className="row mx-5">
              <div className="col-md-6 px-0 d-flex">
                <h5 className="h5 mb-0 text-gray-800 mt-3">Add Product</h5>
              </div>
            </div>

            <div className="row mx-5 card border border-dark shadow-lg">
              <div className="col-md-12">
                <form onSubmit={handleSubmit}>
                  <div className="col-md-12 p-2 d-flex">
                    <label className="col-md-4 mt-2">Material Classification</label>
                    <input
                      className="form-control w-100"
                      type="text"
                      name="materialClassification"
                      value={form.materialClassification}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-3">Product ID</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="productId"
                        value={form.productId}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Product Name</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="productName"
                        value={form.productName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 p-2 d-flex">
                    <label className="col-md-4 mt-2">Product Description</label>
                    <textarea
                      className="form-control w-100"
                      name="productDescription"
                      value={form.productDescription}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-6 mt-2">Unit of Measurement</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">OEM</label>
                      <input
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
                      <input
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
                        type="text"
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
                        value={form.date}
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

                  <div className="col-md-12 text-end m-2">
                    <button type="submit" className="btn btn-primary">Add Product</button>
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

export default AddProduct;
