import { useState, useEffect, useRef } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { createPurchaseRequisition,  fetchCurrentQuantityFromStore} from "../../../services/db_manager";
// Import functions to fetch data from your API
// Assuming you have these functions in your services
import { fetchPartNumbersAndDescriptions } from "../../../services/db_manager";

const AddPurchaseRequisition = () => {
  // State for the current form being filled
  const [form, setForm] = useState({
    partNumber: "",
    description: "",
    currentStock: "",
    requiredQty: "",
    requiredDate: "",
    remark: "",
    unitOfMeasurement: "",
  });

  // State to store all the purchase requisitions added
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);

  // State to store dropdown options from API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for searchable dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const dropdownRef = useRef(null);

  // Set default system date on component mount
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setForm(prev => ({ 
      ...prev, 
      requiredDate: formattedDate
    }));
  }, []);

  // Fetch data once on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPartNumbersAndDescriptions(); // replace with actual API call
        setData(response);
        setFilteredData(response);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load product data. Please try again.");
        // fallback data with alternateProduct field
        const fallbackData = [
          {
            productName: "PART001",
            alternateProduct: "Aircraft Engine Component",
            unitOfMeasurement: "EA",
          },
          {
            productName: "PART002",
            alternateProduct: "Hydraulic Pump Assembly",
            unitOfMeasurement: "KIT",
          },
          {
            productName: "PART003",
            alternateProduct: "Electrical Wiring Harness",
            unitOfMeasurement: "RL",
          },
          {
            productName: "PART004",
            alternateProduct: "Landing Gear Strut",
            unitOfMeasurement: "EA",
          },
          {
            productName: "PART005",
            alternateProduct: "Navigation System Module",
            unitOfMeasurement: "KIT",
          },
        ];
        setData(fallbackData);
        setFilteredData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.alternateProduct &&
            item.alternateProduct
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle part number selection from searchable dropdown
  const handlePartSelection = (selectedItem) => {
    setForm((prevForm) => ({
      ...prevForm,
      partNumber: selectedItem.productName,
      description: selectedItem.productDescription,
      unitOfMeasurement: selectedItem.unitOfMeasurement || "",
    }));
    setSearchTerm(selectedItem.productName);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
      if (form.partNumber) {
        const currentQuantity = async () => {
          try {
            const result = await fetchCurrentQuantityFromStore(form.partNumber);
            console.log("Fetched currentQuantity:", result.data);
            if (result && result.data !== null && result.data !== undefined) {
          setForm((prev) => ({
            ...prev,
            currentStock: result.data, // directly use the integer
          }));
        }else{
           setForm((prev) => ({
            ...prev,
            currentStock: 0, // directly use the integer
          }));
        }
          } catch (err) {
            console.error("Failed to fetch currentStock", err);
          }
        };
        currentQuantity();
      }
    }, [form.partNumber]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    // If user clears the search, clear the form
    if (!value) {
      setForm((prevForm) => ({
        ...prevForm,
        partNumber: "",
        description: "",
        unitOfMeasurement: "",
      }));
    }
  };

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
    // remark field removed from validation - now optional
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;

    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.]/g, "");
    }

    event.target.value = value;

    // ✅ Only mark as valid if value is not empty
    if (value.trim().length > 0) {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    } else {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    }
  };


  // Function to clear all validation classes from form inputs
  const clearValidationClasses = () => {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll(".form-control, .form-select");
    inputs.forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
  };

  // Add a new purchase requisition to the list
  const handleAddRequisition = (e) => {
    e.preventDefault();

    // Log all form field values to console
    console.log("Form values:", {
      partNumber: form.partNumber,
      description: form.description,
      currentStock: form.currentStock,
      requiredQty: form.requiredQty,
      requiredDate: form.requiredDate,
      remark: form.remark,
      unitOfMeasurement: form.unitOfMeasurement,
    });

    // Iterate through each field and validate
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        console.log(`Validation error for ${field}:`, error);
        alert(error);
        return;
      }
    }

    // Add the current form to the purchaseRequisitions array with a unique ID
    const newRequisition = {
      ...form,
      id: Date.now(), // Using timestamp as a simple unique ID
    };

    setPurchaseRequisitions([...purchaseRequisitions, newRequisition]);

    // Clear validation classes before resetting form
    clearValidationClasses();

    // Get current system date for reset
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Reset the form after adding to the list
    setForm({
      partNumber: "",
      description: "",
      currentStock: "",
      requiredQty: "",
      requiredDate: formattedDate,
      remark: "",
      unitOfMeasurement: "",
    });

    // Reset search term and close dropdown
    setSearchTerm("");
    setIsDropdownOpen(false);

    alert("Purchase Requisition added to the list!");
  };

  // Remove a purchase requisition from the list
  const handleRemoveRequisition = (id) => {
    setPurchaseRequisitions(
      purchaseRequisitions.filter((req) => req.id !== id)
    );
  };

  // Submit all purchase requisitions
  const handleSubmitAll = async () => {
    if (purchaseRequisitions.length === 0) {
      alert("No purchase requisitions to submit!");
      return;
    }

    try {
      // You can modify this to submit all requisitions at once if your API supports it
      // For now, we'll just show a success message
      alert(
        `${purchaseRequisitions.length} Purchase Requisitions ready to be submitted!`
      );
      // let newData=[...purchaseRequisitions]
      const requisitionsToSubmit = purchaseRequisitions.map((req) => ({
        partNumber: req.partNumber,
        description: req.description,
        currentStock: req.currentStock,
        requiredQty: req.requiredQty,
        requiredDate: req.requiredDate,
        unitOfMeasurement: req.unitOfMeasurement,
        remark: req.remark,
      }));
      // Uncomment below to actually submit each requisition to the API
      // for (const requisition of purchaseRequisitions) {
      await createPurchaseRequisition(requisitionsToSubmit);
      // }
      setPurchaseRequisitions([]);
      alert("All Purchase Requisitions submitted successfully!");
    } catch (error) {
      console.error("Error submitting purchase requisitions:", error);
      alert("Failed to submit purchase requisitions.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Purchase Requisition"
            isBack={true}
          />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ minHeight: "397px" }}
              >
                <div className="col-md-12">
                  <form
                    onSubmit={handleAddRequisition}
                    style={{ height: "100%" }}
                  >
                    <div className="col-md-12 p-2 d-flex">
                      {/* <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">Sr No</label>
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
                      </div> */}
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number *</label>
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border text-primary me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span>Loading part numbers...</span>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger w-100">
                            {error}
                          </div>
                        ) : (
                          <div
                            className="w-100 position-relative"
                            ref={dropdownRef}
                          >
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search part number..."
                              value={searchTerm}
                              onChange={handleSearchChange}
                              onFocus={() => setIsDropdownOpen(true)}
                              required
                            />
                            {isDropdownOpen && filteredData.length > 0 && (
                              <div
                                className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg"
                                style={{
                                  zIndex: 1000,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteredData.map((item, index) => (
                                  <div
                                    key={index}
                                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handlePartSelection(item)}
                                    onMouseEnter={(e) =>
                                      (e.target.style.backgroundColor =
                                        "#f8f9fa")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.backgroundColor = "white")
                                    }
                                  >
                                    <div className="fw-bold">
                                      {item.productName}
                                    </div>
                                    <div className="text-muted small">
                                      {item.alternateProduct}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    {/* Description Dropdown (Disabled and auto-selected) */}
                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Description *</label>
                      {loading ? (
                        <div className="d-flex align-items-center">
                          <div
                            className="spinner-border text-primary me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Loading descriptions...</span>
                        </div>
                      ) : error ? (
                        <div className="alert alert-danger w-100">{error}</div>
                      ) : (
                        <select
                          className="form-select w-100"
                          name="description"
                          value={form.description}
                          disabled
                        >
                          <option value="">
                            {form.description || "Auto-selected"}
                          </option>
                        </select>
                      )}
                    </div>
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Current Stock *</label>
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
                        <label className="col-md-4 mt-2">Required Qty *</label>
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
                          placeholder="Enter required quantity"
                        />
                      </div>
                    </div>
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-1 d-flex">
                        <label className="col-md-4 mt-2">
                          Unit of Measurement *
                        </label>
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border text-primary me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span>Loading descriptions...</span>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger w-100">
                            {error}
                          </div>
                        ) : (
                          <select
                            className="form-select w-100"
                            name="unitOfMeasurement"
                            value={form.unitOfMeasurement}
                            onChange={handleChange}
                            required
                            disabled
                          >
                            <option value="">Auto-selected from part</option>
                            <option value="EA">EA</option>
                            <option value="RL">RL</option>
                            <option value="QT">QT</option>
                            <option value="GAL">GAL</option>
                            <option value="KIT">KIT</option>
                            <option value="LTR">LTR</option>
                            <option value="SHT">SHT</option>
                            <option value="Sq.ft">Sq.ft</option>
                            <option value="Sq.mtr">Sq.mtr</option>
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Required Date *</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="requiredDate"
                          value={form.requiredDate}
                          disabled
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
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
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <button type="submit" className="btn btn-primary">
                        Add to List
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Display the list of purchase requisitions */}
              {purchaseRequisitions.length > 0 && (
                <div className="row mx-1 card border border-dark shadow-lg py-2 mt-4">
                  <div className="col-md-12">
                    <h4 className="mt-3 mb-3">Purchase Requisitions List</h4>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Part Number</th>
                            <th>Description</th>
                            <th>Current Stock</th>
                            <th>Required Qty</th>
                            <th>Unit of Measurement</th>
                            <th>Required Date</th>
                            <th>Remark</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseRequisitions.map((req) => (
                            <tr key={req.id}>
                              <td>{req.partNumber}</td>
                              <td>{req.description}</td>
                              <td>{req.currentStock}</td>
                              <td>{req.requiredQty}</td>
                              <td>{req.unitOfMeasurement}</td>
                              <td>{req.requiredDate}</td>
                              <td>{req.remark}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleRemoveRequisition(req.id)
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end mb-3">
                      <button
                        className="btn btn-success"
                        onClick={handleSubmitAll}
                      >
                        Submit All Requisitions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddPurchaseRequisition;
