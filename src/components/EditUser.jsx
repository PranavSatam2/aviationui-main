import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { userById, updateUser } from "../services/db_manager";
import { toast } from "react-toastify";
import styles from "./AddUser.module.css";

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || "";
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    role: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    console.log("id", id);
    const fetchUser = async () => {
      try {
        const response = await userById(id);
        if (response.data) {
          setForm(response.data);
        }
      } catch (error) {
        console.error("Error fetching material details:", error);
        alert("Error fetching material details.");
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt_token");
    axiosInstance.get("/api/roles/role")
      .then((response) => {
        console.log("Fetched roles:", response.data);
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch roles", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form", form);
    try {
      const response = await updateUser(id, form);
      if (response.status === 200) {
        navigate("/ViewUser");
        toast.success("User updated successfully!");
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("Failed to update User.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Helper function to validate each field
  const validateField = (fieldName, value, rules) => {
    if (!value || value.trim() === "") {
  return rules.required ? `${fieldName} is required.` : null;
   }

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
    firstName: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z]*$/,
    },
    middleName: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z]*$/,
    },
    lastName: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z]*$/,
    },
    username: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    mobileNumber: {
      required: true,
      regex: /^[0-9\s]*$/,
      length: 12,
    },
    address: {
      required: true,
      length: 100,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    city: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    state: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z\s]*$/,
    },
    country: {
      required: true,
      length: 50,
      regex: /^[a-zA-Z\s]*$/,
    },
    email: {
      required: true,
      length: 255,
      regex: /^\S+@\S+\.\S+$/,
    },
  };

  const validateDataType = (event, dataType) => {
    document.getElementById('')
    let value = event.target.value
    if (dataType === 'A') {
      value = value.replace(/[^a-zA-Z0-9 ]/g, '');
      event.target.classList.add('is-valid')
    } else if (dataType === 'N') {
      value = value.replace(/[^0-9]/g, '');
      event.target.classList.add('is-valid')
    } else if (dataType === 'ANS') {
      value = value.replace(/[^a-zA-Z0-9@.]/g, '');
      event.target.classList.add('is-valid')
    }

    event.target.value = value
  };

  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen)
    event.target.value = value
    let elementLen = value.length
    if (elementLen > maxLen) {
      event.target.classList.remove('is-valid')
      event.target.classList.add('is-invalid')
    } else if (elementLen < minLen) {
      event.target.classList.remove('is-valid')
      event.target.classList.add('is-invalid')
    } else {
      event.target.classList.add('is-valid')
      event.target.classList.remove('is-invalid')
    }
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Update User</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-user"></i>
                    <span>Personal Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        First Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="firstName"
                        onInput={(event) => { validateDataType(event, 'A') }}
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Middle Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="middleName"
                        onInput={(event) => { validateDataType(event, 'A') }}
                        value={form.middleName}
                        onChange={handleChange}
                        placeholder="Enter middle name"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Last Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="lastName"
                        onInput={(event) => { validateDataType(event, 'A') }}
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Date Of Birth <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Account Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-id-card"></i>
                    <span>Account Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Username <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="username"
                        onInput={(event) => { validateDataType(event, 'A') }}
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        User Type <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.roleName}>
                            {role.roleName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-phone"></i>
                    <span>Contact Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Mobile Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onInput={(event) => { validateDataType(event, 'N') }}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Email <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="email"
                        name="email"
                        onInput={(event) => { validateLen(event, 1, 255) }}
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-map-marker-alt"></i>
                    <span>Address Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Address <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="address"
                        value={form.address}
                        onInput={(event) => { validateDataType(event, 'A') }}
                        onChange={handleChange}
                        placeholder="Enter address"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        City <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="city"
                        value={form.city}
                        onInput={(event) => { validateDataType(event, 'A') }}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        State <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="state"
                        value={form.state}
                        onInput={(event) => { validateDataType(event, 'A') }}
                        onChange={handleChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Country <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        name="country"
                        value={form.country}
                        onInput={(event) => { validateDataType(event, 'A') }}
                        onChange={handleChange}
                        placeholder="Enter country"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-save"></i>
                      <span>Update User</span>
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

export default EditUser;