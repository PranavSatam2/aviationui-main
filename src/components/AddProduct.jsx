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
    <div className="wrapper ">
      <Sidebar />

      <div className="content">
        <Header />
        {/* conetnt Begin*/}
        <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-5">
            <h5 className="h5 mx-3 mb-0 text-gray-800">Add Products</h5>
          </div>
        </div>
        <div className="card shadow mx-4 my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 w-100 card border border-dark shadow-lg py-2">
              <div className="col-md-12">
                <form onSubmit={handleSubmit}>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-1">Product ID</label>
                      <input
                        className="form-control w-100"
                        type="Number"
                        name="productId"
                        value={form.productId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-5 mt-2">Material Classification</label>
                      <select
                        className="form-control w-100"
                        name="materialClassification"
                        value={form.materialClassification}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a classification</option>
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
                        <option value="">Select a unit</option>
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
                  </div>


                  <div className="col-md-6 p-3 d-flex">
                    <label className="col-md-3 mt-2">OEM</label>
                    <input
                      className="form-control w-100"
                      type="text"
                      name="oem"
                      value={form.oem}
                      onChange={handleChange}
                      required
                    />
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
                      <textarea
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
      </div >
      <Footer />
    </div >
  );
};

export default AddProduct;
