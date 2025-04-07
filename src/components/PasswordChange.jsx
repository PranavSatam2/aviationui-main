import React, { useEffect, useState } from "react";
import axios from 'axios';
import Footer from "./Footer";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import Header from "./Header";

const PasswordChange = () => {
  // States for form fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!currentPassword || !newPassword || !confirmPassword) {
    setError('All fields are required');
    return;
  }
  if (!validatePassword(newPassword)) {
    setError('New password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.');
    return;
  }
  if (newPassword !== confirmPassword) {
    setError('New password and confirm password do not match');
    return;
  }
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    setError('You need to be logged in to change your password');
    return;
  }
  try {
    // Assuming you have an API endpoint to update the password
    const response = await axios.post('http://localhost:8082/auth/passwordChange', {
      currentPassword,
      newPassword,
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      setSuccess('Password changed successfully!');
      alert("Password changed user.");
      navigate('/');
    } else {
      setError('Failed to change password');
    }
  } catch (error) {
    setError('An error occurred while changing the password');
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