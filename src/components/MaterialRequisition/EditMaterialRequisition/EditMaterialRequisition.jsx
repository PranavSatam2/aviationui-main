import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import {
  getMaterialRequisitionDetail,
  updateMaterialRequisition,
  fetchSupplierName,
} from "../../../services/db_manager";
import { toast } from "react-toastify";

const EditMaterialRequisition = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { RequisitionID } = location.state || {};

  const [form, setForm] = useState({
    materialRequisitionNo: "",
    workOrderNo: "",
    date: "",
    partNumber: "",
    description: "",
    requestedQty: "",
    issuedQty: "",
    unitOfMeasurement: "",
    supplierName: "",
    curDate: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch supplier names once
  useEffect(() => {
    const getSupplierNames = async () => {
      try {
        const response = await fetchSupplierName();
        setSuppliers(response.data);
      } catch (err) {
        console.error("Error fetching supplier names:", err);
        toast.error("Failed to load supplier names");
      }
    };
    getSupplierNames();
  }, []);

  // Fetch material requisition details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getMaterialRequisitionDetail(RequisitionID);
        if (response.data) {
          setForm(response.data);
        }
      } catch (err) {
        console.error("Error fetching requisition:", err);
        toast.error("Failed to fetch requisition details.");
      } finally {
        setLoading(false);
      }
    };

    if (RequisitionID) fetchDetails();
  }, [RequisitionID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
  };

  const validationRules = {
    workOrderNo: { length: 12 },
    partNumber: { length: 255 },
    description: { length: 255, regex: /^[a-zA-Z0-9\s]*$/ },
    requestedQty: { type: "number", length: 10 },
    issuedQty: { type: "number", length: 10 },
  };

  const validateField = (fieldName, value, rules) => {
    if (!value) return `${fieldName} is required.`;
    if (rules.type === "number" && isNaN(value))
      return `${fieldName} should be a number.`;
    if (rules.length && value.length > rules.length)
      return `${fieldName} should be at most ${rules.length} characters.`;
    if (rules.regex && !rules.regex.test(value))
      return `${fieldName} has invalid characters.`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        toast.error(error);
        return;
      }
    }

    try {
      const response = await updateMaterialRequisition(RequisitionID, form);
      if (response.status === 200) {
        toast.success("Material Requisition Updated Successfully!");
        navigate("/ViewMaterialRequisition");
      }
    } catch (err) {
      console.error("Error updating requisition:", err);
      toast.error("Failed to update requisition.");
    }
  };

  if (loading) {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div className="text-center mt-5">
            <h5>Loading requisition details...</h5>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Edit Material Requisition" isBack={true} />

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
                        <label className="col-md-4 mt-1">Workorder No</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="workOrderNo"
                          value={form.workOrderNo}
                          onChange={handleChange}
                          onInput={(e) => validateDataType(e, "A")}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Date</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number</label>
                        <input
                          className="form-control w-100"
                          name="partNumber"
                          value={form.partNumber}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Description</label>
                      <select
                        className="form-select w-100"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled
                      >
                        <option value="">{form.description}</option>
                      </select>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Requested QTY</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="requestedQty"
                          onInput={(e) => validateDataType(e, "N")}
                          value={form.requestedQty}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Issued QTY</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="issuedQty"
                          onInput={(e) => validateDataType(e, "N")}
                          value={form.issuedQty}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Supplier Name</label>
                        <select
                          className="form-select w-100"
                          name="supplierName"
                          value={form.supplierName}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Supplier</option>
                          {suppliers.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Date</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="curDate"
                          onInput={(e) => validateDataType(e, "N")}
                          value={form.curDate}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <div className="col-md-4 mt-2 d-flex">
                        <button type="submit" className="btn btn-primary">
                          Update Requisition
                        </button>
                      </div>
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

export default EditMaterialRequisition;
