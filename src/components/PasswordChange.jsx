import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import Footer from "./Footer";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import Header from "./Header";

const PasswordChange = () => {
  // States for form fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  // State for error messages
 // const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");

  if (!currentPassword || !newPassword || !confirmPassword) {
    setErrorMessage('All fields are required');
    return;
  }
  if (!validatePassword(newPassword)) {
    setErrorMessage('New password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.');
    return;
  }
  if (newPassword !== confirmPassword) {
    setErrorMessage('New password and confirm password do not match');
    return;
  }
  const token = sessionStorage.getItem("jwt_token");
  if (!token) {
    setErrorMessage('You need to be logged in to change your password');
    return;
  }
  try {
    // Assuming you have an API endpoint to update the password
    const response = await axiosInstance.post('/auth/passwordChange', {
      currentPassword,
      newPassword,
    });
    console.log("Status",response.status);
    if (response.status === 200) {
      //setSuccess('Password changed successfully!');
      alert("Password changed successfully!");
      navigate('/');
    } else {
      alert('Failed to change password');
    }
  } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          alert(error.response.data || "Old password is incorrect");
        } else {
          alert("An error occurred: " + error.response.data);
        }
      } 
    }  
};


  return (
    <div className="wrapper">
          <div className="content">
            <Header />
            <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb breadcrumbsLabel="Password Change"  isBack={true}/>
            <div className="my-2 p-2">
              <div className="container-fluid">
                <div className="row mx-1 card border border-dark shadow-lg py-2" style={{height : '397px'}}>
                  <div className="col-md-12">
                    <form onSubmit={handleSubmit} style={{height : '100%'}}>
                        <div className="col-md-6 p-2 d-flex">
                          <label className="col-md-4 mt-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">New Password</label>
                            <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                             required
                            />
                        </div>
                        <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">Confirm New Password</label>
                        <input
                         type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        />
                        </div>
                        <div className="col-md-12 text-right mt-1">
                        <div className="text-end m-0">
                      <button type="submit" className="btn btn-primary">Change Passsword</button>
                      </div>
                    </div>
                    </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
         <Footer />
        </div >
      );
};

export default PasswordChange;