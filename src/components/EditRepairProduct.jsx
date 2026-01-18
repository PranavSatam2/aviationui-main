import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../services/db_manager";
import { toast } from "react-toastify";
import styles from "./AddCustomer.module.css"; // Reusing the same CSS

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        const response = await getCustomerById(id);
        if (response.data) {
          setForm(response.data);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Failed to load customer data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNo" || name === "mobileNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "customerName":
      case "contactPersonName":
        if (!value) return `${fieldName} is required.`;
        if (value.length > 255)
          return `${fieldName} should not exceed 255 characters.`;
        break;

      case "phoneNo":
        if (!/^[0-9]{10}$/.test(value))
          return `Phone number must be exactly 10 digits.`;
        break;

      case "countryCode":
        if (!value) return "Country code is required.";
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
          return "GST number must be 15 alphanumeric characters.";
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

    for (const key of Object.keys(form)) {
      const error = validateField(key, form[key]);
      if (error) {
        toast.error(error);
        return;
      }
    }

    try {
      const response = await updateCustomer(id, form);
      if (response.status === 200) {
        toast.success("Customer updated successfully!");
        navigate("/viewCustomers");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading customer data...</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Edit Customer</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-user"></i>
                    <span>Basic Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Customer Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        className={styles.input}
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Contact Person Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="contactPersonName"
                        className={styles.input}
                        value={form.contactPersonName}
                        onChange={handleChange}
                        placeholder="Enter contact person name"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-phone"></i>
                    <span>Contact Information</span>
                  </div>

                  <div className={styles.formRowTriple}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Phone No <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="phoneNo"
                        className={styles.input}
                        value={form.phoneNo}
                        onChange={handleChange}
                        placeholder="Enter 10 digit phone"
                        maxLength="10"
                        required
                      />
                      {form.phoneNo && form.phoneNo.length < 10 && (
                        <span className={styles.validationMessage}>
                          <i className="fa fa-exclamation-circle"></i>
                          Phone must be 10 digits ({form.phoneNo.length}/10)
                        </span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Country Code <span className={styles.required}>*</span>
                      </label>
                      <select
                        name="countryCode"
                        className={styles.select}
                        value={form.countryCode}
                        onChange={handleChange}
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
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Mobile Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        className={styles.input}
                        value={form.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter 10 digit mobile"
                        maxLength="10"
                        required
                      />
                      {form.mobileNumber && form.mobileNumber.length < 10 && (
                        <span className={styles.validationMessage}>
                          <i className="fa fa-exclamation-circle"></i>
                          Mobile must be 10 digits ({form.mobileNumber.length}/10)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Email ID <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        className={styles.input}
                        value={form.emailId}
                        onChange={handleChange}
                        placeholder="customer@example.com"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Customer Type <span className={styles.required}>*</span>
                      </label>
                      <select
                        name="customerType"
                        className={styles.select}
                        value={form.customerType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Customer Type</option>
                        <option value="Airline">Airline</option>
                        <option value="MRO">MRO</option>
                        <option value="NSOP">NSOP</option>
                      </select>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-map-marker"></i>
                    <span>Address Information</span>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>
                      Ship To Address 1 <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      name="shipToAddress1"
                      className={styles.textarea}
                      value={form.shipToAddress1}
                      onChange={handleChange}
                      placeholder="Enter primary shipping address"
                      required
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Ship To Address 2</label>
                    <textarea
                      name="shipToAddress2"
                      className={styles.textarea}
                      value={form.shipToAddress2}
                      onChange={handleChange}
                      placeholder="Enter secondary shipping address (optional)"
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Ship To Address 3</label>
                    <textarea
                      name="shipToAddress3"
                      className={styles.textarea}
                      value={form.shipToAddress3}
                      onChange={handleChange}
                      placeholder="Enter tertiary shipping address (optional)"
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>
                      Bill To Address <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      name="billToAddress"
                      className={styles.textarea}
                      value={form.billToAddress}
                      onChange={handleChange}
                      placeholder="Enter billing address"
                      required
                    />
                  </div>

                  {/* Payment & Tax Information */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-credit-card"></i>
                    <span>Payment & Tax Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Payment Terms <span className={styles.required}>*</span>
                      </label>
                      <select
                        name="paymentTerms"
                        className={styles.select}
                        value={form.paymentTerms}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Payment Terms</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="advance payment">Advance Payment</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        GST Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="gstNo"
                        className={styles.input}
                        value={form.gstNo}
                        onChange={handleChange}
                        placeholder="15 character GST number"
                        maxLength="15"
                        required
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className={styles.formActions}>
                    <button 
                      type="button" 
                      className={styles.btnCancel}
                      onClick={() => navigate(-1)}
                    >
                      <i className="fa fa-times"></i>
                      <span>Cancel</span>
                    </button>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-save"></i>
                      <span>Update Customer</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditCustomer;