import React, { useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { createPurchaseRequisition } from "../../../services/db_manager";
// Uncomment and update the import for your database service
// import { createPurchaseRequisition } from "../../../services/db_manager";

const AddPurchaseRequisition = () => {
  const [form, setForm] = useState({
    purchaseRequisitionNo: "",
    partNumber: "",
    description: "",
    currentStock: "",
    requiredQty: "",
    requiredDate: "",
    remark: "",
  });

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
    purchaseRequisitionNo: {
      type: "number",
      length: 12,
    },
    partNumber: {
      type: "number",
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

    // If all validation passes, proceed with submitting
    try {
      // Uncomment this when you have the database service function
      const response = await createPurchaseRequisition(form);
      console.log("Purchase Requisition added successfully:", response.data);
      alert("Purchase Requisition Added Successfully!");
      // location.reload();

      // Reset the form after successful submission
      setForm({
        purchaseRequisitionNo: "",
        partNumber: "",
        description: "",
        currentStock: "",
        requiredQty: "",
        requiredDate: "",
        remark: "",
      });
    } catch (error) {
      console.error("Error adding purchase requisition:", error);
      alert("Failed to add purchase requisition.");
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
                style={{ height: "397px" }}
              >
                <div className="col-md-12">
                  <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">
                          Purchase Requisition No
                        </label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="purchaseRequisitionNo"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.purchaseRequisitionNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="partNumber"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.partNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Description</label>
                      <textarea
                        className="form-control w-100"
                        name="description"
                        value={form.description}
                        onInput={(event) => {
                          validateDataType(event, "A");
                        }}
                        onChange={handleChange}
                        style={{ height: "70px" }}
                        required
                      ></textarea>
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
                      <button type="submit" className="btn btn-primary">
                        Add Purchase Requisition
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

export default AddPurchaseRequisition;