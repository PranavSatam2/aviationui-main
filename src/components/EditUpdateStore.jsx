import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { getStoreDetail, updateStore } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditUpdateStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const emptyForm = {
    partNum: "",
    description: "",
    batch: "",
    condition: "",
    supplier: "",
    dom: "",
    doe: "",
    quantity: "",
    dateOfRecipet: "",
    nameOfQualityInsp: "",
    signatureOfQualityInsp: "",
    formAMC: "",
    revNo: "",
    flag: "",
    rackNo: "",
    updatedBy: "",
    updatedDate: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);

  const formatDateForInput = (val) => {
    if (!val && val !== 0) return "";
    // If value is like "2025-09-27T07:33:55.000+00:00" or "2025-09-27", return YYYY-MM-DD
    try {
      const s = String(val);
      return s.includes("T") ? s.substring(0, 10) : s.substring(0, 10);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      try {
        const response = await getStoreDetail(id); // expect response.data
        if (response?.data) {
          // get username and today so we can override backend updatedBy/updatedDate
          const username = sessionStorage.getItem("username") || "";
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, "0");
          const d = String(today.getDate()).padStart(2, "0");
          const formattedToday = `${y}-${m}-${d}`;

          const data = response.data;
          const normalized = {
            ...data,
            dom: formatDateForInput(data.dom),
            doe: formatDateForInput(data.doe),
            dateOfRecipet: formatDateForInput(data.dateOfRecipet),
            // overwrite backend updatedDate and updatedBy with session/system values
            updatedBy: username,
            updatedDate: formattedToday,
          };

          // Ensure quantity is a number or empty string for controlled input
          normalized.quantity =
            normalized.quantity === null || normalized.quantity === undefined
              ? ""
              : normalized.quantity;

          setForm((prev) => ({ ...prev, ...normalized }));
        } else {
          // if no data, still set updatedBy/updatedDate from session/system
          const username = sessionStorage.getItem("username") || "";
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, "0");
          const d = String(today.getDate()).padStart(2, "0");
          const formattedToday = `${y}-${m}-${d}`;
          setForm((prev) => ({
            ...prev,
            updatedBy: username,
            updatedDate: formattedToday,
          }));
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
        alert("Failed to load store data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Keep quantity as number when possible, but allow empty string for controlled input
    if (name === "quantity") {
      const numeric = value === "" ? "" : parseInt(value, 10);
      setForm((prev) => ({ ...prev, [name]: isNaN(numeric) ? "" : numeric }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation (you can extend)
    if (!form.partNum) {
      alert("Part Number is required");
      return;
    }

    // Prepare payload - ensure quantity is numeric (0 if empty)
    const payload = {
      ...form,
      quantity:
        form.quantity === "" || form.quantity === null || form.quantity === undefined
          ? 0
          : Number(form.quantity),
    };

    try {
      const response = await updateStore(id, payload); // keep your service signature
      if (response?.status === 200 || response?.status === 204) {
        alert("Store updated successfully!");
        navigate("/updatestore");
      } else {
        // If your API returns 200 with data object, you may handle that too
        alert("Store update response received: " + (response?.status || "unknown"));
      }
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Failed to update store.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading store data...</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Update Material In Store" isBack={true} />
          <div className="my-2 p-2">
            <div className="container-fluid">
              <div className="row mx-1 card border border-dark shadow-lg py-2 p-4">
                <div className="col-md-12" style={{ height: "78vh", overflowY: "scroll" }}>
                  <form onSubmit={handleSubmit}>
                    {/* Part Number & Description */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Part Number *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="partNum"
                          value={form.partNum}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Description *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* Batch & Condition */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Batch *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="batch"
                          value={form.batch}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Condition *</label>
                        <select
                          className="form-select"
                          name="condition"
                          value={form.condition}
                          onChange={handleChange}
                          required
                          disabled
                        >
                          <option value="">Select Condition</option>
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                          <option value="Refurbished">Refurbished</option>
                          <option value="Repaired">Repaired</option>
                        </select>
                      </div>
                    </div>

                    {/* Supplier & DOM */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Supplier *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="supplier"
                          value={form.supplier}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">DOM (Date of Manufacture) *</label>
                        <input
                          className="form-control"
                          type="date"
                          name="dom"
                          value={form.dom || ""}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* DOE & Quantity */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">DOE (Date of Expiry) *</label>
                        <input
                          className="form-control"
                          type="date"
                          name="doe"
                          value={form.doe || ""}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Quantity *</label>
                        <input
                          className="form-control"
                          type="number"
                          name="quantity"
                          value={form.quantity === "" ? "" : form.quantity}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* Date of Receipt & Quality Inspector */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Date of Receipt *</label>
                        <input
                          className="form-control"
                          type="date"
                          name="dateOfRecipet"
                          value={form.dateOfRecipet || ""}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Quality Inspector *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="nameOfQualityInsp"
                          value={form.nameOfQualityInsp}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* Signature of Quality Inspector & Form AMC */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Signature of Quality Inspector *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="signatureOfQualityInsp"
                          value={form.signatureOfQualityInsp}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Form AMC *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="formAMC"
                          value={form.formAMC || ""}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* Rev No & Flag */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Rev No *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="revNo"
                          value={form.revNo || ""}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* Rack No, Updated By, Updated Date */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Rack No *</label>
                        <input
                          className="form-control"
                          type="text"
                          name="rackNo"
                          value={form.rackNo || ""}
                          onChange={handleChange}
                          placeholder="e.g., RACK-22"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Updated By</label>
                        <input
                          className="form-control"
                          type="text"
                          name="updatedBy"
                          value={form.updatedBy || ""}
                          disabled
                          style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Updated Date</label>
                        <input
                          className="form-control"
                          type="date"
                          name="updatedDate"
                          value={form.updatedDate || ""}
                          disabled
                          style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="row">
                      <div className="col-md-12 text-end">
                        <button type="submit" className="btn btn-primary px-4 py-2">
                          <i className="fa fa-save me-2"></i>Update Store
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

export default EditUpdateStore;
