import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import axios from "axios"; // Import axios if you are using axios
import { createProduct } from "../services/db_manager";

const AddProduct = () => {
  const [form, setForm] = useState({
    materialClassification: "",
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

      // Reset the form after successful submission
      setForm({
        materialClassification: "",
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
    <div className="wrapper">
      <Sidebar />
      <div className="content" style={{ marginLeft: '280px' }}>
        <Header />
        
        {/* Content header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ 
          backgroundColor: '#1B74E4', 
          color: 'white',
          borderBottom: '1px solid #0b5ed7'
        }}>
          <div>
            <h5 className="fw-semibold mb-1">Add Products</h5>
            <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>Create new product entries in the inventory system</p>
          </div>
        </div>
        
        {/* Form container */}
        <div className="container-fluid py-3 px-4" style={{ backgroundColor: '#f0f6ff' }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <div className="card-header py-3" style={{ 
              backgroundColor: '#e0ecff', 
              borderBottom: '1px solid #c9dcff',
              borderRadius: '8px 8px 0 0'
            }}>
              <h6 className="mb-0 text-primary" style={{ color: '#0d6efd' }}>Product Information</h6>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* First row */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="productName" style={{ color: '#1B74E4' }}>
                        Product Name
                      </label>
                      <input
                        id="productName"
                        className="form-control border-primary-subtle"
                        type="text"
                        name="productName"
                        placeholder="Enter product name"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.productName}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="materialClassification" style={{ color: '#1B74E4' }}>
                        Material Classification
                      </label>
                      <select
                        id="materialClassification"
                        className="form-select border-primary-subtle"
                        name="materialClassification"
                        value={form.materialClassification}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff'
                        }}
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
                </div>
                
                {/* Description row */}
                <div className="row mb-3">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="productDescription" style={{ color: '#1B74E4' }}>
                        Product Description
                      </label>
                      <textarea
                        id="productDescription"
                        className="form-control border-primary-subtle"
                        name="productDescription"
                        placeholder="Enter detailed product description"
                        value={form.productDescription}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        rows="3"
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Section divider */}
                <div className="row mb-3">
                  <div className="col-12">
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#e0ecff', 
                      margin: '10px 0 20px' 
                    }}></div>
                  </div>
                </div>
                
                {/* Second row */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="unitOfMeasurement" style={{ color: '#1B74E4' }}>
                        Unit of Measurement
                      </label>
                      <select
                        id="unitOfMeasurement"
                        className="form-select border-primary-subtle"
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff'
                        }}
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="oem" style={{ color: '#1B74E4' }}>
                        OEM
                      </label>
                      <input
                        id="oem"
                        className="form-control border-primary-subtle"
                        type="text"
                        name="oem"
                        placeholder="Enter OEM details"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.oem}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Third row */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="nha" style={{ color: '#1B74E4' }}>
                        NHA
                      </label>
                      <input
                        id="nha"
                        className="form-control border-primary-subtle"
                        type="text"
                        name="nha"
                        placeholder="Enter NHA"
                        value={form.nha}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="cmmReferenceNumber" style={{ color: '#1B74E4' }}>
                        CMM Reference Number
                      </label>
                      <input
                        id="cmmReferenceNumber"
                        className="form-control border-primary-subtle"
                        type="number"
                        name="cmmReferenceNumber"
                        placeholder="Enter reference number"
                        onInput={(event) => {validateLen(event,1,12)}}
                        value={form.cmmReferenceNumber}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Fourth row */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="date" style={{ color: '#1B74E4' }}>
                        Date
                      </label>
                      <input
                        id="date"
                        className="form-control border-primary-subtle"
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium mb-2" htmlFor="registeredBy" style={{ color: '#1B74E4' }}>
                        Registered By
                      </label>
                      <input
                        id="registeredBy"
                        className="form-control border-primary-subtle"
                        type="text"
                        name="registeredBy"
                        placeholder="Enter name of registrar"
                        value={form.registeredBy}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '6px',
                          borderColor: '#c9dcff' 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="d-flex justify-content-end pt-2" style={{ 
                  borderTop: '1px solid #e0ecff', 
                  paddingTop: '20px' 
                }}>
                  <button 
                    type="button" 
                    className="btn btn-outline-primary me-2" 
                    style={{ 
                      padding: '10px 20px', 
                      borderRadius: '6px',
                      fontWeight: '500',
                      borderColor: '#1B74E4',
                      marginRight: '10px',
                      marginBottom: '10px',
                      color: '#1B74E4'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ 
                      padding: '10px 20px', 
                      borderRadius: '6px',
                      fontWeight: '500',
                      marginBottom: '10px',
                      backgroundColor: '#1B74E4',
                      border: 'none'
                    }}
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default AddProduct;
