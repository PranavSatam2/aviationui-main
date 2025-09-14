import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditCustomer = () => {
  const { id } = useParams(); // get ID from route
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getCustomerById(id);
        if (response.data) {
          setForm(response.data);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        alert("Error fetching customer details.");
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validation rules
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "customerName":
      case "contactPersonName":
        if (!value) return `${fieldName} is required.`;
        if (value.length > 255)
          return `${fieldName} should not exceed 255 characters.`;
        break;

      case "phoneNo":
      case "mobileNumber":
        if (!/^[0-9]{10}$/.test(value))
          return `${fieldName} must be exactly 10 digits.`;
        break;

      case "emailId":
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format.";
        break;

      case "shipToAddress1":
      case "shipToAddress2":
      case "shipToAddress3":
      case "billToAddress":
        if (value && value.length > 500)
          return `${fieldName} should not exceed 500 characters.`;
        if (
          (fieldName === "shipToAddress1" || fieldName === "billToAddress") &&
          !value
        )
          return `${fieldName} is required.`;
        break;

      case "paymentTerms":
        if (!/^(30|60|90|advance payment)$/i.test(value))
          return "Payment terms must be one of: 30, 60, 90, advance payment.";
        break;

      case "gstNo":
        if (!/^[0-9A-Z]{15}$/.test(value))
          return "GST number must be 15 uppercase alphanumeric characters.";
        break;

      case "customerType":
        if (!/^(Airline|MRO|NSOP)$/i.test(value))
          return "Customer type must be Airline, MRO, or NSOP.";
        break;

      default:
        return null;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    for (const key of Object.keys(form)) {
      const error = validateField(key, form[key]);
      if (error) {
        alert(error);
        return;
      }
    }

    try {
      const response = await updateCustomer(id, form);
      if (response.status === 200) {
        alert("Customer updated successfully!");
        navigate("/viewCustomers"); // go back to list page
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Edit Customer" isBack={true} />
          <div className="my-2 p-2">
            <div className="container-fluid">
              <div className="row mx-1 card border border-dark shadow-lg py-2">
                <div className="col-md-12">
                  <form onSubmit={handleSubmit}>
                    {/* Customer Name */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Customer Name *</label>
                      <input
                        className="form-control"
                        type="text"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Contact Person *</label>
                      <input
                        className="form-control"
                        type="text"
                        name="contactPersonName"
                        value={form.contactPersonName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Phone / Mobile */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Phone No *</label>
                      <input
                        className="form-control"
                        type="text"
                        name="phoneNo"
                        value={form.phoneNo}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Mobile No *</label>
                      <input
                        className="form-control"
                        type="text"
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Email *</label>
                      <input
                        className="form-control"
                        type="email"
                        name="emailId"
                        value={form.emailId}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Addresses */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Ship To Address 1 *</label>
                      <textarea
                        className="form-control"
                        name="shipToAddress1"
                        value={form.shipToAddress1}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Ship To Address 2</label>
                      <textarea
                        className="form-control"
                        name="shipToAddress2"
                        value={form.shipToAddress2}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Ship To Address 3</label>
                      <textarea
                        className="form-control"
                        name="shipToAddress3"
                        value={form.shipToAddress3}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Bill To Address *</label>
                      <textarea
                        className="form-control"
                        name="billToAddress"
                        value={form.billToAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Payment Terms */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Payment Terms *</label>
                      <select
                        className="form-control"
                        name="paymentTerms"
                        value={form.paymentTerms}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="30">30</option>
                        <option value="60">60</option>
                        <option value="90">90</option>
                        <option value="advance payment">Advance Payment</option>
                      </select>
                    </div>

                    {/* GST No */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">GST No *</label>
                      <input
                        className="form-control"
                        type="text"
                        name="gstNo"
                        value={form.gstNo}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Customer Type */}
                    <div className="col-md-12 p-2 d-flex">
                      <label className="col-md-3 mt-2">Customer Type *</label>
                      <select
                        className="form-control"
                        name="customerType"
                        value={form.customerType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Airline">Airline</option>
                        <option value="MRO">MRO</option>
                        <option value="NSOP">NSOP</option>
                      </select>
                    </div>

                    {/* Submit */}
                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <button type="submit" className="btn btn-primary">
                        Update Customer
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

export default EditCustomer;
