import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getMaterialDetail,
  updateMaterial,
  fetchPartNumbersAndDescriptions,
} from "../services/db_manager";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditMaterialNote = () => {
  const location = useLocation();
  const { materialId } = location.state || "";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mrnNo: "",
    supplierName: "",
    orderNumber: "",
    challanNo: "",
    receiptDate: "",
    partNumber: "",
    partDescription: "",
    quantity: "",
    unitOfMeasurement: "",
  });

  const [partData, setPartData] = useState([]);

  // Fetch material details
  useEffect(() => {
    const fetchMaterialDetailData = async () => {
      try {
        const response = await getMaterialDetail(materialId);
        if (response.data) {
          setForm(response.data);
        }
      } catch (error) {
        console.error("Error fetching material details:", error);
        toast.error("Error fetching material details.");
      }
    };
    fetchMaterialDetailData();
  }, [materialId]);

  // Fetch available parts
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const result = await fetchPartNumbersAndDescriptions();
        setPartData(result);
      } catch (err) {
        console.error("Failed to fetch part list", err);
      }
    };
    fetchParts();
  }, []);

  // Handle part number selection
  const handleProductChange = (e) => {
    const selected = e.target.value;

    // find matching description
    const match = partData.find((item) => item.productName === selected);
    const description = match ? match.productDescription : "";

    // update form with both part number and description
    setForm((prevForm) => ({
      ...prevForm,
      partNumber: selected,
      partDescription: description,
    }));
  };

  // Handle generic field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateMaterial(materialId, form);
      if (response.status === 200) {
        toast.success("Material updated successfully!");
        navigate("/ViewMaterialNotePage");
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Failed to update material.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Edit Material Receipt Note Form"
            isBack={true}
          />
          <div
            className="card border border-dark shadow mx-4 my-4 p-2"
            style={{ height: "70vh" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="col-md-12">
                <div className="row">
                  {/* Part Number */}
                  <div className="col-md-6 p-2">
                    <label>
                      Part Number <span className="text-danger mx-1">*</span>
                    </label>
                    <select
                      required
                      className="form-control"
                      name="partNumber"
                      value={form.partNumber}
                      onChange={handleProductChange}
                    >
                      <option value="">-- Select Part --</option>
                      {partData.map((item) => (
                        <option key={item.productName} value={item.productName}>
                          {item.productName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Part Description */}
                  <div className="col-md-6 p-2">
                    <label>
                      Part Description <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="partDescription"
                      value={form.partDescription}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>

                  {/* Other Fields */}
                  <div className="col-md-6 p-2">
                    <label>
                      MRN No <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="mrnNo"
                      value={form.mrnNo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Supplier Name <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="supplierName"
                      value={form.supplierName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Order Number <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      className="form-control"
                      name="orderNumber"
                      value={form.orderNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Challan No <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="challanNo"
                      value={form.challanNo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Receipt Date <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      className="form-control"
                      name="receiptDate"
                      value={form.receiptDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Quantity <span className="text-danger mx-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Unit of Measurement <span className="text-danger mx-1">*</span>
                    </label>
                    <select
                      required
                      className="form-control"
                      name="unitOfMeasurement"
                      value={form.unitOfMeasurement}
                      onChange={handleChange}
                    >
                      <option value="">Select Unit</option>
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
                  </div>
                </div>

                {/* Save Button */}
                <div className="col-md-12 text-right mt-3">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EditMaterialNote;
