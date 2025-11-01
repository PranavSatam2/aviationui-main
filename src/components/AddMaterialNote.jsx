import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import {
  addMaterialNote,
  fetchSupplierName,
  fetchAllPurchaseOrder,
  fetchAllPartNO,
  fetchAllPartNODetails,
} from "../services/db_manager";

const AddMaterialNote = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [poNumbers, setPoNumbers] = useState([]);
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    supplierName: "",
    orderNumber: "",
    partNumber: "",
    partDescription: "",
    quantity: "",
    unitOfMeasurement: "",
    challanNo: "",
    receiptDate: "",
    qualityAcceptance: "",
    storeInchargeSign: "",
  });

  // ✅ Fetch Suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchSupplierName();
        console.log("Fetched Supplier list:", result.data);
        setSuppliers(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Failed to fetch supplier list", err);
        setSuppliers([]);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch PO Numbers based on Supplier
  useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await fetchAllPurchaseOrder();
          console.log("Fetched PO list:", result);
          setPoNumbers(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
          console.error("Failed to fetch PO list", err);
          setPoNumbers([]);
        }
      };
      fetchData();
    
  }, []);

  // ✅ Fetch Parts based on PO Number
  useEffect(() => {
    if (form.orderNumber) {
      console.log(form.orderNumber);
      const fetchData = async () => {
        try {
          const result = await fetchAllPartNO(form.orderNumber);
          console.log("Fetched PartNo list:", result);
          setParts(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
          console.error("Failed to fetch Parts list", err);
          setParts([]);
        }
      };
      fetchData();
    }
  }, [form.orderNumber]);

  // ✅ Fetch Part Details when Part Number selected
useEffect(() => {
    if (form.partNumber) {
      const fetchData = async () => {
        try {
          const result = await fetchAllPartNODetails(form.partNumber, form.orderNumber);
          console.log("Fetched PartNoDetails:", result);
          if (result) {
            const { description, currentStoke, unit, poDate} = result.data;
            setForm((prev) => ({
              ...prev,
              partDescription: description || "",
              quantity: currentStoke || "",
              unitOfMeasurement: unit || "",
              receiptDate: poDate || "",
              storeInchargeSign: sessionStorage.getItem("username") || "",
            }));
          }
        } catch (err) {
          console.error("Failed to fetch PartDetails", err);
        }
      };
      fetchData();
    }
  }, [form.partNumber,form.orderNumber]);

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMaterialNote(form);
      toast.success("Material Receipt Note saved successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving material:", error);
      const backendMessage =
      error.response?.data?.message || "Failed to save material receipt note.";

    toast.error(backendMessage);
  }
      //toast.error("Failed to save material receipt note.");
    
  };

  // ✅ Reset Form
  const resetForm = () => {
    setForm({
      supplierName: "",
      orderNumber: "",
      partNumber: "",
      partDescription: "",
      quantity: "",
      unitOfMeasurement: "",
      challanNo: "",
      receiptDate: "",
      qualityAcceptance: "",
      storeInchargeSign: "",
    });
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Material Receipt Note Form"
            isBack={true}
          />

          <div
            className="card border border-dark shadow mx-4 my-4 p-2"
            style={{ height: "70vh" }}
          >
            <form onSubmit={handleSubmit}>
              {/* Supplier + PO */}
              <div className="col-md-12 p-2 d-flex">

                <div className="col-md-6 p-2">
                  <label>PO Number</label>
                  <select
                    className="form-control"
                    name="orderNumber"
                    value={form.orderNumber}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select PO Number --</option>
                    {poNumbers.map((po, i) => (
                      <option key={i} value={po.poNumber}>
                        {po.poNumber}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6 p-2">
                  <label>Supplier</label>
                  <select
                    className="form-control"
                    name="supplierName"
                    value={form.supplierName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((s,i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                
              </div>

              {/* Part Selection + Description */}
              <div className="col-md-12 p-2 d-flex">
                <div className="col-md-6 p-2">
                  <label>Part Number</label>
                  <select
                    className="form-control"
                    name="partNumber"
                    value={form.partNumber}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Part --</option>
                    {parts.map((p, i) => (
                      <option key={i} value={`${p.partNumber}|${p.id}`}>
                        {p.partNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 p-2">
                  <label>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="partDescription"
                    value={form.partDescription}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              {/* Challan + Receipt Date */}
              <div className="col-md-12 p-2 d-flex">
                <div className="col-md-6 p-2">
                  <label>Challan No<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="challanNo"
                    value={form.challanNo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 p-2">
                  <label>Receipt Date<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    name="receiptDate"
                    value={form.receiptDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Quantity + UOM */}
              <div className="col-md-12 p-2 d-flex">
                <div className="col-md-6 p-2">
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="col-md-6 p-2">
                  <label>Unit of Measurement</label>
                  <input
                    type="text"
                    className="form-control"
                    name="unitOfMeasurement"
                    value={form.unitOfMeasurement}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              {/* Receive Quantity */}
              <div className="col-md-12 p-2">
                <label>Receive Quantity<span style={{ color: "red" }}>*</span></label>
                <input
                  type="number"
                  className="form-control"
                  name="qualityAcceptance"
                  value={form.qualityAcceptance}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Save Button */}
              <div className="col-md-12 text-right mt-3">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddMaterialNote;
