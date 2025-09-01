import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import axiosInstance from "../axiosConfig";
import { createProduct } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const AddProduct = () => {
  const [form, setForm] = useState({
    materialClassification: "",
    productName: "",
    productDescription: "",
    unitOfMeasurement: "",
    oem: "",
    nha: "",
    cmmReferenceNumber: "",
    registrationDate: "",
    registeredBy: "",
  });

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
  const validateDataType = (event, dataType) => 
    {
        document.getElementById('')
        let value = event.target.value
        if (dataType === 'A') 
        {
            value = value.replace(/[^a-zA-Z0-9 ]/g, '');
            event.target.classList.add('is-valid')
        } 
        else if (dataType === 'N') 
        {
            value = value.replace(/[^0-9]/g, '');
            event.target.classList.add('is-valid')
        } 
        else if (dataType === 'ANS') 
        {
            value = value.replace(/[^a-zA-Z0-9@.]/g, '');
            event.target.classList.add('is-valid')
        }
    
        event.target.value = value
    };
  function validateLen(event, minLen, maxLen) 
    {
        let value = event.target.value.substring(0,maxLen)
        event.target.value = value
        let elementLen = value.length
        if (elementLen > maxLen) 
        {
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
        } 
        else if (elementLen < minLen) 
        {
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
        } 
        else 
        {
            event.target.classList.add('is-valid')
            event.target.classList.remove('is-invalid')
        }
    }

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

    // If all validation passes, proceed with submitting
    try {
      const response = await createProduct(form);
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
        registrationDate: "",
        registeredBy: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Add Products"  isBack={true}/>

        {/* content Begin */}
        {/* <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-4 mb-0 text-gray-800">Add Products</h5>
          </div>
        </div> */}
        <div className="my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 card border border-dark shadow-lg py-2" style={{height : '397px'}}>
              <div className="col-md-12">
                <form onSubmit={handleSubmit} style={{height : '100%'}}>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-1">Product Name</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="productName"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.productName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Material Classification</label>
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

                  <hr className="mx-0 my-2 p-0 border" />

                  <div className="col-md-12 p-3 d-flex">
                    <label className="col-md-2 mt-2">Product Description</label>
                    <textarea
                      className="form-control w-100"
                      name="productDescription"
                      value={form.productDescription}
                      onInput={(event) => {validateDataType(event,'A')}}
                      onChange={handleChange}
                      style={{height : '70px'}}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-1 d-flex">
                      <label className="col-md-4 mt-2">Unit of Measurement</label>
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
                      onInput={(event) => {validateDataType(event,'A')}}
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
                        onInput={(event) => {validateDataType(event,'A')}}
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
                        // onInput={(event) => {validateLen(event,1,12)}}
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
                        name="registrationDate"
                        value={form.registrationDate}
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
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 text-end m-1 p-4 text-right">
                    <button type="submit" className="btn btn-primary">Add Product</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >
      </div>
      <Footer />
    </div >
  );
};

export default AddProduct;
