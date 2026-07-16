import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import styles from "./AddRole.module.css";

const AddRole = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes for each field
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  // Handle form submission to create a new role
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!roleName || !roleCode || !roleDescription) {
      setError('Please provide role name, role code, and role description.');
      return;
    }
    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
      setError('You need to be logged in to change your password');
      return;
    }

    try {
      // Send the new role data to the backend
      const response = await axiosInstance.post('/api/roles/addRole', {
        roleName,
        roleCode,
        roleDescription,
      });

      // On successful role creation, show success message and clear form
      setSuccess('Role created successfully!');
      setRoleName('');
      setRoleCode('');
      setRoleDescription('');
      setError('');
    } catch (error) {
      console.error('Error creating role:', error);
      setError('Error creating the role.');
      setSuccess('');
    }
  };

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
              <span className={styles.breadcrumbLabel}>Add Role</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Role Information Section */}
                  <div className={styles.sectionTitle}>
                    <i className="fa fa-user-shield"></i>
                    <span>Role Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="roleName">
                        Role Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        id="roleName"
                        value={roleName}
                        onChange={(e) => handleInputChange(e, setRoleName)}
                        placeholder="Enter role name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="roleCode">
                        Role Code <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.input}
                        type="text"
                        id="roleCode"
                        value={roleCode}
                        onChange={(e) => handleInputChange(e, setRoleCode)}
                        placeholder="Enter role code"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="roleDescription">
                        Role Description <span className={styles.required}>*</span>
                      </label>
                      <textarea
                        className={styles.textarea}
                        id="roleDescription"
                        value={roleDescription}
                        onChange={(e) => handleInputChange(e, setRoleDescription)}
                        placeholder="Enter role description"
                        rows="4"
                        required
                      />
                    </div>
                  </div>

                  {/* Show error message if any */}
                  {error && (
                    <div className={styles.errorMessage}>
                      <i className="fa fa-exclamation-circle"></i>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Show success message after a successful submission */}
                  {success && (
                    <div className={styles.successMessage}>
                      <i className="fa fa-check-circle"></i>
                      <span>{success}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-plus-circle"></i>
                      <span>Add Role</span>
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

export default AddRole;