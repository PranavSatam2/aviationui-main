import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { updatePurchaseRequisition, getPurchaseRequisitionDetail, fetchPartNumbersAndDescriptions } from "../../../services/db_manager";
import { useParams, useNavigate } from "react-router-dom";

const EditPurchaseRequisition = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const RequisitionID= location.state ||"";
  // State for the current form being filled
  const [form, setForm] = useState({
    srNo: "",
    partNumber: "",
    description: "",
    currentStock: "",
    requiredQty: "",
    requiredDate: "",
    remark: "",
  });

  // State to track original data for comparison
  const [originalData, setOriginalData] = useState(null);
  
  // State to store dropdown options from API
  const [descriptions, setDescriptions] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);
  
  // State to track loading status
  const [descLoading, setDescLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to track any error in API calls
  const [descError, setDescError] = useState(null);
  const [partError, setPartError] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the specific purchase requisition data when component mounts
  useEffect(() => {
    if (RequisitionID) {
      fetchRequisitionData();
    }
  }, [RequisitionID]);
  
  const fetchRequisitionData = async () => {
    setIsLoading(true);
    try {
      const requisitionData = await getPurchaseRequisitionDetail(RequisitionID);
      console.log(requisitionData,"reqqqqqqqqqqqqqq")
      // Format the date from the database (if needed)
      if (requisitionData.requiredDate) {
        const date = new Date(requisitionData.requiredDate);
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        requisitionData.requiredDate = formattedDate;
      }
      
      setForm(requisitionData);
      setOriginalData(requisitionData);
      setError(null);
    } catch (err) {
      console.error("Error fetching requisition data:", err);
      setError("Failed to load requisition data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch descriptions from API when component mounts
  useEffect(() => {
    const getDescriptions = async () => {
      setDescLoading(true);
      try {
        const data = await fetchPartNumbersAndDescriptions();
        setDescriptions(data);
        setDescError(null);
      } catch (err) {
        console.error("Error fetching descriptions:", err);
        setDescError("Failed to load descriptions. Please try again later.");
        // Fallback data in case the API fails
        // setDescriptions([
        //   { id: 1, description: "Raw Material" },
        //   { id: 2, description: "Finished Goods" },
        //   { id: 3, description: "Spare Parts" },
        //   { id: 4, description: "Consumables" },
        //   { id: 5, description: "Office Supplies" }
        // ]);
      } finally {
        setDescLoading(false);
      }
    };
    
    getDescriptions();
  }, []);

  // Fetch part numbers from API when component mounts
  useEffect(() => {
    const getPartNumbers = async () => {
      setPartLoading(true);
      try {
        const data = await fetchPartNumbersAndDescriptions();
        setPartNumbers(data);
        setPartError(null);
      } catch (err) {
        console.error("Error fetching part numbers:", err);
        setPartError("Failed to load part numbers. Please try again later.");
        // Fallback data in case the API fails
        // setPartNumbers([
        //   { id: 1, partNo: "PT001", description: "Engine Part" },
        //   { id: 2, partNo: "PT002", description: "Transmission Part" },
        //   { id: 3, partNo: "PT003", description: "Brake System Part" },
        //   { id: 4, partNo: "PT004", description: "Electrical Component" },
        //   { id: 5, partNo: "PT005", description: "Body Component" }
        // ]);
      } finally {
        setPartLoading(false);
      }
    };
    
    getPartNumbers();
  }, []);

  // Update current stock when part number changes
  useEffect(() => {
    if (form.partNumber && !originalData) { // Only auto-update if not editing an existing record
      const selectedPart = partNumbers.find(part => part.partNo === form.partNumber);
      if (selectedPart && selectedPart.currentStock) {
        setForm(prevForm => ({
          ...prevForm,
          currentStock: selectedPart.currentStock.toString()
        }));
      }
    }
  }, [form.partNumber, partNumbers, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Helper function to validate each field
  const validateField = (fieldName, value, rules) => {
    if (!value) return `${fieldName} is required.`;

    if (rules.type === "number" && isNaN(value)) {
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

  // Validation rules object
  const validationRules = {
    srNo: {
      type: "number",
      length: 12,
    },
    partNumber: {
      length: 12,
    },
    description: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    currentStock: {
      type: "number",
      length: 10,
    },
    requiredQty: {
      type: "number",
      length: 10,
    },
    remark: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.]/g, "");
      event.target.classList.add("is-valid");
    }

    event.target.value = value;
  };

  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen);
    event.target.value = value;
    let elementLen = value.length;
    if (elementLen > maxLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else if (elementLen < minLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    }
  }

  // Handle form submission to update the requisition
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Iterate through each field and validate
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        alert(error);
        return;
      }
    }

    try {
      await updatePurchaseRequisition(id, form);
      alert("Purchase Requisition updated successfully!");
      // Navigate back to the list view after successful update
      navigate('/purchase-requisitions');
    } catch (error) {
      console.error("Error updating purchase requisition:", error);
      alert("Failed to update purchase requisition. Please try again.");
    }
  };

  // Cancel editing and navigate back
  const handleCancel = () => {
    navigate('/purchase-requisitions');
  };

  if (isLoading) {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading requisition data...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div className="alert alert-danger m-4">
            {error}
            <button className="btn btn-primary ms-3" onClick={handleCancel}>
              Back to List
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Edit Purchase Requisition"
            isBack={true}
          />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ minHeight: "397px" }}
              >
                <div className="col-md-12">
                  <h4 className="mt-3 mb-3">Edit Purchase Requisition #{id}</h4>
                  
                  <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">
                          Sr No
                        </label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="srNo"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.srNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number</label>
                        {partLoading ? (
                          <div className="d-flex align-items-center">
                            <div className="spinner-border text-primary me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <span>Loading part numbers...</span>
                          </div>
                        ) : partError ? (
                          <div className="alert alert-danger w-100">
                            {partError}
                          </div>
                        ) : (
                          <select
                            className="form-select w-100"
                            name="partNumber"
                            value={form.partNumber}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a part number</option>
                            {partNumbers.map((part) => (
                              <option key={part.id} value={part.partNo}>
                                {part.partNumber}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Description</label>
                      {descLoading ? (
                        <div className="d-flex align-items-center">
                          <div className="spinner-border text-primary me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Loading descriptions...</span>
                        </div>
                      ) : descError ? (
                        <div className="alert alert-danger w-100">
                          {descError}
                        </div>
                      ) : (
                        <select
                          className="form-select w-100"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a description</option>
                          {descriptions.map((desc) => (
                            <option key={desc.id} value={desc.description}>
                              {desc.description}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Current Stock</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="currentStock"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.currentStock}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Required Qty</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="requiredQty"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.requiredQty}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Required Date</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="requiredDate"
                          value={form.requiredDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Remark</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="remark"
                          onInput={(event) => {
                            validateDataType(event, "A");
                          }}
                          value={form.remark}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Requisition
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

export default EditPurchaseRequisition;