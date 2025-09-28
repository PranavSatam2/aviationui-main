import { useState, useEffect } from "react";
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
    countryCode: "",
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
        if (!/^[0-9]{12}$/.test(value))
          return `Phone number must be exactly 12 digits.`;
        break;

      case "countryCode":
        if (!/^[0-9]{2}$/.test(value))
          return `Country code must be exactly 2 digits.`;
        break;

      case "mobileNumber":
        if (!/^[0-9]{10}$/.test(value))
          return `Mobile number must be exactly 10 digits.`;
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
        if (!/^[A-Z0-9]{15}$/.test(value))
          return "GST number must be 15 alphanumeric characters (no special characters).";
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
              <div className="row mx-1 card border border-dark shadow-lg py-2 p-4">
                <div className="col-md-12" style={{ height: "72vh", overflowY: "scroll" }}>
                  <form onSubmit={handleSubmit}>
                    {/* Customer Name & Contact Person */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Customer Name *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="customerName"
                          value={form.customerName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Contact Person *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="contactPersonName"
                          value={form.contactPersonName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>


                    {/* Phone, Country Code & Mobile */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Phone No * (12 digits)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="phoneNo"
                          value={form.phoneNo}
                          onChange={handleChange}
                          placeholder="Enter 12 digit phone number"
                          maxLength="12"
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label fw-bold">Country Code * (2 digits)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="countryCode"
                          value={form.countryCode}
                          onChange={handleChange}
                          placeholder="e.g., 91"
                          maxLength="2"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Mobile Number * (10 digits)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="mobileNumber"
                          value={form.mobileNumber}
                          onChange={handleChange}
                          placeholder="Enter 10 digit mobile number"
                          maxLength="10"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Email *</label>
                        <input
                          className="form-control"
                          type="email"
                          name="emailId"
                          value={form.emailId}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Customer Type *</label>
                        <select
                          className="form-select"
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
                    </div>

                    {/* Addresses */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label fw-bold">Ship To Address 1 *</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress1"
                          value={form.shipToAddress1}
                          onChange={handleChange}
                          rows="2"
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label fw-bold">Ship To Address 2</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress2"
                          value={form.shipToAddress2}
                          onChange={handleChange}
                          rows="2"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label fw-bold">Ship To Address 3</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress3"
                          value={form.shipToAddress3}
                          onChange={handleChange}
                          rows="2"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label fw-bold">Bill To Address *</label>
                        <textarea
                          className="form-control"
                          name="billToAddress"
                          value={form.billToAddress}
                          onChange={handleChange}
                          rows="2"
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Terms & GST */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Payment Terms *</label>
                        <select
                          className="form-select w-100"
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
                      <div className="col-md-6">
                        <label className="form-label fw-bold">GST Number * (15 alphanumeric characters)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="gstNo"
                          value={form.gstNo}
                          onChange={handleChange}
                          placeholder="Enter 15 character GST number"
                          maxLength="15"
                          required
                        />
                      </div>
                    </div>



                    {/* Submit Button */}
                    <div className="row">
                      <div className="col-md-12 text-end">
                        <button type="submit" className="btn btn-primary px-4 py-2">
                          <i className="fa fa-save me-2"></i>Update Customer
                        </button>
                      </div>
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
