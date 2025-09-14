import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { addCustomer } from "../services/db_manager"; // service to call API
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const AddCustomer = () => {
  const [form, setForm] = useState({
    customerName: "",
    contactPersonName: "",
    phoneNo: "",
    mobileNumber: "",
    emailId: "",
    shipToAddress1: "",
    shipToAddress2: "",
    shipToAddress3: "",
    billToAddress: "",
    paymentTerms: "",
    gstNo: "",
    customerType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateField = (fieldName, value, rules) => {
    if (!value && rules.required) return `${fieldName} is required.`;
    if (rules.pattern && !rules.pattern.test(value)) return `${fieldName} is invalid.`;
    if (rules.maxLength && value.length > rules.maxLength)
      return `${fieldName} should not exceed ${rules.maxLength} characters.`;
    return null;
  };

  const validationRules = {
    customerName: { required: true, maxLength: 255 },
    contactPersonName: { required: true, maxLength: 255 },
    phoneNo: { required: true, pattern: /^[0-9]{10}$/ },
    mobileNumber: { required: true, pattern: /^[0-9]{10}$/ },
    emailId: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    shipToAddress1: { required: true, maxLength: 500 },
    shipToAddress2: { required: false, maxLength: 500 },
    shipToAddress3: { required: false, maxLength: 500 },
    billToAddress: { required: true, maxLength: 500 },
    paymentTerms: { required: true, pattern: /^(30|60|90|advance payment)$/i },
    gstNo: { required: true, pattern: /^[0-9A-Z]{15}$/ },
    customerType: { required: true, pattern: /^(Airline|MRO|NSOP)$/i },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        alert(error);
        return;
      }
    }

    try {
      const response = await addCustomer(form);
      console.log("Customer added successfully:", response.data);
      alert("Customer Added Successfully!");

      // Reset form
      setForm({
        customerName: "",
        contactPersonName: "",
        phoneNo: "",
        mobileNumber: "",
        emailId: "",
        shipToAddress1: "",
        shipToAddress2: "",
        shipToAddress3: "",
        billToAddress: "",
        paymentTerms: "",
        gstNo: "",
        customerType: "",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Add Customer" isBack={true} />
          <div className="my-2 p-2">
            <div className="container-fluid">
              <div className="row mx-1 card border border-dark shadow-lg py-2 p-2">
                <div className="col-md-12">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 p-">
                        <label>Customer Name *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="customerName"
                          value={form.customerName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2">
                        <label>Contact Person Name *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="contactPersonName"
                          value={form.contactPersonName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 p-2">
                        <label>Phone No *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="phoneNo"
                          value={form.phoneNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2">
                        <label>Mobile Number *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="mobileNumber"
                          value={form.mobileNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 p-2">
                        <label>Email ID *</label>
                        <input
                          className="form-control"
                          type="email"
                          name="emailId"
                          value={form.emailId}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2">
                        <label>Customer Type *</label>
                        <select
                          className="form-control"
                          name="customerType"
                          value={form.customerType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Customer Type *</option>
                          <option value="Airline">Airline</option>
                          <option value="MRO">MRO</option>
                          <option value="NSOP">NSOP</option>
                        </select>
                      </div>

                      <div className="col-md-12 p-2">
                        <label>Ship To Address 1 *</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress1"
                          value={form.shipToAddress1}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-12 p-2">
                        <label>Ship To Address 2</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress2"
                          value={form.shipToAddress2}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-12 p-2">
                        <label>Ship To Address 3</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress3"
                          value={form.shipToAddress3}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-12 p-2">
                        <label>Bill To Address *</label>
                        <textarea
                          className="form-control"
                          name="billToAddress"
                          value={form.billToAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 p-2">
                        <label>Payment Terms *</label>
                        <select
                          className="form-control"
                          name="paymentTerms"
                          value={form.paymentTerms}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Payment Terms *</option>
                          <option value="30">30</option>
                          <option value="60">60</option>
                          <option value="90">90</option>
                          <option value="advance payment">Advance Payment</option>
                        </select>
                      </div>

                      <div className="col-md-6 p-2">
                        <label>GST Number *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="gstNo"
                          value={form.gstNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end mt-3">
                      <button type="submit" className="btn btn-primary">
                        Add Customer
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

export default AddCustomer;
