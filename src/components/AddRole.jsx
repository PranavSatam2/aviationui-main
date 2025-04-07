import React, { useState } from 'react';
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";


const AddRole= () => {
  const [roleName, setRoleName] = useState('');        // Role Name
  const [roleCode, setRoleCode] = useState('');        // Role Code
  const [roleDescription, setRoleDescription] = useState('');  // Role Description
  const [error, setError] = useState('');              // Error message
  const [success, setSuccess] = useState('');          // Success message

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
    const token = localStorage.getItem("jwt_token");
  if (!token) {
    setError('You need to be logged in to change your password');
    return;
  }

    try {
      // Send the new role data to the backend
      const response = await axios.post('http://localhost:8082/api/roles/addRole', {
        name: roleName,
        code: roleCode,
        description: roleDescription,
       }, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Add user"  isBack={true}/>

        {/* content Begin */}
        {/* <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-4 mb-0 text-gray-800">Add User</h5>
          </div>
        </div> */}
        <div className="my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 card border border-dark shadow-lg py-2" style={{height : '397px'}}>
              <div className="col-md-12">
                <form onSubmit={handleSubmit} style={{height : '100%'}}>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">

          <label className="col-md-4 mt-1" htmlFor="roleName">Role Name</label>
          <input
          className="form-control w-100"
            type="text"
            id="roleName"
            value={roleName}
            onChange={(e) => handleInputChange(e, setRoleName)}
            placeholder="Enter role name"
          />
        </div>

        <div className="col-md-6 p-1 d-flex">
          <label className="col-md-4 mt-1" htmlFor="roleCode">Role Code</label>
          <input
          className="form-control w-100"
            type="text"
            id="roleCode"
            value={roleCode}
            onChange={(e) => handleInputChange(e, setRoleCode)}
            placeholder="Enter role code"
          />
        </div>
        </div>
        <div className="col-md-12 d-flex">
        <div className="col-md-6 p-1 d-flex">
          <label className="col-md-4 mt-1" htmlFor="roleDescription">Role Description</label>
          <textarea
          className="form-control w-100"
            id="roleDescription"
            value={roleDescription}
            onChange={(e) => handleInputChange(e, setRoleDescription)}
            placeholder="Enter role description"
          />
        </div>
        </div>
        {/* Show error message if any */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Show success message after a successful submission */}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <div className="col-md-12 text-right mt-1">
                      <div className="text-end m-0">
                    <button type="submit" className="btn btn-primary">Add User</button>
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

export default AddRole;
