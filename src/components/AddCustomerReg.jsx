import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { addCustomer, getCustomerById } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const AddCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isViewMode = window.location.pathname.includes('/viewCustomer/');
  const isEditMode = window.location.pathname.includes('/editCustomer/');
  
  // Country codes list
  const countryCodes = [
    { code: "+1", country: "USA/Canada" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "India" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+39", country: "Italy" },
    { code: "+61", country: "Australia" },
    { code: "+971", country: "UAE" },
    { code: "+65", country: "Singapore" },
    { code: "+82", country: "South Korea" },
    { code: "+7", country: "Russia" },
    { code: "+55", country: "Brazil" },
    { code: "+27", country: "South Africa" },
    { code: "+52", country: "Mexico" },
    { code: "+34", country: "Spain" },
    { code: "+31", country: "Netherlands" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
  ];
  
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
  const [isLoading, setIsLoading] = useState(false);

  // Load customer data for view/edit mode
  useEffect(() => {
    if (id && (isViewMode || isEditMode)) {
      const fetchCustomerData = async () => {
        setIsLoading(true);
        try {
          const response = await getCustomerById(id);
          if (response?.data) {
            setForm(response.data);
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
          alert("Failed to load customer data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomerData();
    }
  }, [id, isViewMode, isEditMode]);

  const handleChange = (e) => {
    if (!isViewMode) {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    }
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
    countryCode: { required: true }, // Updated - removed pattern validation
    mobileNumber: { required: true, pattern: /^[0-9]{10}$/ },
    emailId: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    shipToAddress1: { required: true, maxLength: 500 },
    shipToAddress2: { required: false, maxLength: 500 },
    shipToAddress3: { required: false, maxLength: 500 },
    billToAddress: { required: true, maxLength: 500 },
    paymentTerms: { required: true, pattern: /^(30|60|90|advance payment)$/i },
    gstNo: { required: true, pattern: /^[A-Z0-9]{15}$/ },
    customerType: { required: true, pattern: /^(Airline|MRO|NSOP)$/i },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewMode) {
      return;
    }

    // Validate fields
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        alert(error);
        return;
      }
    }

    try {
      if (isEditMode) {
        alert("Edit functionality needs to be implemented in the service");
        return;
      } else {
        const response = await addCustomer(form);
        console.log("Customer added successfully:", response.data);
        alert("Customer Added Successfully!");

        setForm({
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
      }
    } catch (error) {
      console.error("Error processing customer:", error);
      alert("Failed to process customer data.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb 
            breadcrumbsLabel={
              isViewMode ? "View Customer" : 
              isEditMode ? "Edit Customer" : 
              "Add Customer"
            } 
            isBack={true} 
          />
          <div className="my-2 p-2">
            <div className="container-fluid">
              <div className="row mx-1 card border border-dark shadow-lg py-2 p-4" >
                <div className="col-md-12" style={{ height: "72vh",overflowY: "scroll" }}>
                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-2 text-muted">Loading customer data...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 p-2">
                        <label>Customer Name *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="customerName"
                          value={form.customerName}
                          onChange={handleChange}
                          readOnly={isViewMode}
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
                          readOnly={isViewMode}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label>Phone No *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="phoneNo"
                          value={form.phoneNo}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          maxLength="10"
                          readOnly={isViewMode}
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <label>Country Code *</label>
                        <select
                          className="form-select"
                          name="countryCode"
                          value={form.countryCode}
                          onChange={handleChange}
                          disabled={isViewMode}
                          required
                        >
                          <option value="">Select</option>
                          {countryCodes.map((item) => (
                            <option key={item.code} value={item.code}>
                              {`${item.code} - ${item.country}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Mobile Number *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="mobileNumber"
                          value={form.mobileNumber}
                          onChange={handleChange}
                          placeholder="Enter 10 digit mobile number"
                          maxLength="10"
                          readOnly={isViewMode}
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
                          readOnly={isViewMode}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2">
                        <label>Customer Type *</label>
                        <select
                          className="form-select"
                          name="customerType"
                          value={form.customerType}
                          onChange={handleChange}
                          disabled={isViewMode}
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
                          readOnly={isViewMode}
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
                          readOnly={isViewMode}
                        />
                      </div>
                      <div className="col-md-12 p-2">
                        <label>Ship To Address 3</label>
                        <textarea
                          className="form-control"
                          name="shipToAddress3"
                          value={form.shipToAddress3}
                          onChange={handleChange}
                          readOnly={isViewMode}
                        />
                      </div>
                      <div className="col-md-12 p-2">
                        <label>Bill To Address *</label>
                        <textarea
                          className="form-control"
                          name="billToAddress"
                          value={form.billToAddress}
                          onChange={handleChange}
                          readOnly={isViewMode}
                          required
                        />
                      </div>

                      <div className="col-md-6 p-2">
                        <label>Payment Terms *</label>
                        <select
                          className="form-select w-100"
                          name="paymentTerms"
                          value={form.paymentTerms}
                          onChange={handleChange}
                          disabled={isViewMode}
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
                        <label>GST Number * (15 alphanumeric characters)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="gstNo"
                          value={form.gstNo}
                          onChange={handleChange}
                          placeholder="Enter 15 character GST number"
                          maxLength="15"
                          readOnly={isViewMode}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end mt-3">
                      {isViewMode ? (
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => navigate(-1)}
                        >
                          Back
                        </button>
                      ) : (
                        <button type="submit" className="btn btn-primary">
                          {isEditMode ? "Update Customer" : "Add Customer"}
                        </button>
                      )}
                    </div>
                  </form>
                  )}
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