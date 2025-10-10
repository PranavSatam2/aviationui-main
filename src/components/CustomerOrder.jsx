import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import {
  listAllCustomerNames,
  listAllPartNo,
  GetpartDetailsFromProductSelect,
} from "../services/db_manager";

const CustomerOrder = () => {
  const [roNo, setRoNo] = useState("");
  const [roDate, setRoDate] = useState("");
  const [roReceiveDate, setRoReceiveDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [partSerialNumber, setPartSerialNumber] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState({});
  const [document, setDocument] = useState(null);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [allCustomerNames, setAllCustomerNames] = useState([]);
  const [filteredCustomerNames, setFilteredCustomerNames] = useState([]);
  const [allPartNos, setAllPartNos] = useState([]);
  const [filteredPartNos, setFilteredPartNos] = useState([]);
  const [isLoadingPartDetails, setIsLoadingPartDetails] = useState(false);
  const [serialOptions, setSerialOptions] = useState([]);

  const handleInputChange = (e, setter) => setter(e.target.value);

  // Fetch customer names & part numbers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const names = await listAllCustomerNames();
        setAllCustomerNames(names);
        setFilteredCustomerNames(names);

        const parts = await listAllPartNo();
        setAllPartNos(parts);
        setFilteredPartNos(parts);
      } catch (err) {
        console.error("Error fetching names or parts:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch part details on partNo change
  useEffect(() => {
    const fetchPartDetails = async () => {
      if (!partNo) {
        setPartDescription("");
        setPartSerialNumber("");
        return;
      }
      setIsLoadingPartDetails(true);
      try {
        const data = await GetpartDetailsFromProductSelect(partNo);
        if (data?.length > 0) {
          const partDetails = data[0];
          setPartDescription(partDetails.productDescription || "");

          // Convert object to array of serial values
          const serialArray = partDetails.productSerialNumbers
            ? Object.values(partDetails.productSerialNumbers)
            : [];

          setSerialOptions(serialArray);
          setPartSerialNumber(""); // reset selected value
        } else {
          setPartDescription("");
          setSerialOptions([]);
          setPartSerialNumber("");
        }
      } catch (err) {
        console.error("Error fetching part details:", err);
        setPartDescription("");
        setPartSerialNumber("");
      } finally {
        setIsLoadingPartDetails(false);
      }
    };
    fetchPartDetails();
  }, [partNo]);

  const validateForm = () => {
    const newErrors = {};
    if (!/^\d{1,50}$/.test(roNo)) newErrors.roNo = "RO No must be a number";
    if (!/^\d{1,10}$/.test(quantity))
      newErrors.quantity = "Quantity must be a number";
    if (!partSerialNumber.trim())
      newErrors.partSerialNumber = "Part Serial Number is required";
    if (!customerName) newErrors.customerName = "Customer Name is required";
    if (!partNo) newErrors.partNo = "Part Number is required";
    if (!partDescription)
      newErrors.partDescription = "Part Description is required";
    if (!roReceiveDate)
      newErrors.roReceiveDate = "RO Received Date is required";
    if (!roDate) newErrors.roDate = "RO Date is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newReq = {
      roNo,
      roDate,
      roReceiveDate,
      customerName,
      partNo,
      partDescription,
      quantity,
      partSerialNumber,
      status,
      id: Date.now(),
      makerUserName: sessionStorage.getItem("username"),
      makerDate: new Date().toISOString().split("T")[0],
      userAction: "1",
      userRole: sessionStorage.getItem("roleId"),
    };

    setPurchaseRequisitions([...purchaseRequisitions, newReq]);
    setRoNo("");
    setRoDate("");
    setRoReceiveDate("");
    setCustomerName("");
    setPartNo("");
    setPartDescription("");
    setQuantity("");
    setPartSerialNumber("");
    setStatus("");
    alert("Customer Order added to the list!");
  };

  const handleRemoveRequisition = (id) =>
    setPurchaseRequisitions(purchaseRequisitions.filter((r) => r.id !== id));

  const handleSubmitAll = async () => {
    if (!document) return alert("Please upload the document.");
    if (purchaseRequisitions.length === 0)
      return alert("No Customer Order to submit!");

    try {
      const ordersPayload = purchaseRequisitions.map((req) => ({
        roNo: Number(req.roNo),
        roDate: req.roDate,
        roReceiveDate: req.roReceiveDate,
        customerName: req.customerName,
        partNo: req.partNo,
        partDescription: req.partDescription,
        quantity: Number(req.quantity),
        batchNo: req.partSerialNumber,
        makerUserName: req.makerUserName,
        makerDate: req.makerDate,
        userAction: "1",
        userRole: req.userRole,
      }));

      const formData = new FormData();
      formData.append("document", document);
      formData.append("orders", JSON.stringify(ordersPayload));

      await axiosInstance.post(
        "/api/customerOrder/uploadWithOrders",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("All orders submitted successfully.");
      setPurchaseRequisitions([]);
      setDocument(null);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit Customer Order. Check console for details.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <CustomBreadcrumb breadcrumbsLabel="Add Customer Order" isBack={true} />
        <div className="container-fluid my-2 p-2">
          {/* Form Card */}
          <div className="row mx-1 card border border-dark shadow-lg py-2">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                {/* RO No & Sales Order No */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Sales Order Number</label>
                    <input
                      className="form-control w-100"
                      type="text"
                      value="Auto Generated"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Repair Order No *</label>
                    <input
                      className="form-control w-100"
                      type="text"
                      value={roNo}
                      onChange={(e) => handleInputChange(e, setRoNo)}
                    />
                    {error.roNo && (
                      <span className="text-danger ms-2">{error.roNo}</span>
                    )}
                  </div>
                </div>

                {/* Part Number & Serial */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Part Number *</label>
                    <select
                      className="form-select"
                      value={partNo}
                      onChange={(e) => setPartNo(e.target.value)}
                      disabled={isLoadingPartDetails}
                    >
                      <option value="">Select Part No</option>
                      {filteredPartNos.map((pn, idx) => (
                        <option key={idx} value={pn.productName}>
                          {pn.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">
                      Part Serial Number *
                    </label>
                    <select
                      className="form-select w-100"
                      value={partSerialNumber}
                      onChange={(e) =>
                        handleInputChange(e, setPartSerialNumber)
                      }
                      disabled={serialOptions.length === 0}
                    >
                      <option value="">Select Serial Number</option>
                      {serialOptions.map((serial, idx) => (
                        <option key={idx} value={serial}>
                          {serial}
                        </option>
                      ))}
                    </select>

                    {error.partSerialNumber && (
                      <span className="text-danger">
                        {error.partSerialNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer & RO Receive Date */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Customer Name *</label>
                    <select
                      className="form-select"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    >
                      <option value="">Select Customer</option>
                      {filteredCustomerNames.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">RO Received Date *</label>
                    <input
                      className="form-control w-100"
                      type="date"
                      value={roReceiveDate}
                      onChange={(e) => handleInputChange(e, setRoReceiveDate)}
                    />
                  </div>
                </div>

                {/* Part Description & RO Date */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Part Description *</label>
                    <textarea
                      className="form-control w-100"
                      value={partDescription}
                      onChange={(e) => handleInputChange(e, setPartDescription)}
                      style={{ height: "70px" }}
                      placeholder="auto-filled select part number"
                      disabled
                    ></textarea>
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">RO Date *</label>
                    <input
                      className="form-control w-100"
                      type="date"
                      value={roDate}
                      onChange={(e) => handleInputChange(e, setRoDate)}
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Quantity *</label>
                    <input
                      className="form-control w-100"
                      type="text"
                      value={quantity}
                      onChange={(e) => handleInputChange(e, setQuantity)}
                    />
                  </div>
                </div>

                {/* Add to list */}
                <div className="col-md-12 text-end mt-1">
                  <button type="submit" className="btn btn-primary">
                    Add to List
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Display Table */}
          {purchaseRequisitions.length > 0 && (
            <div className="row mx-1 card border border-dark shadow-lg py-5 mt-4">
              <div className="col-md-12">
                <h4>Customer Order List</h4>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>RO No</th>
                        <th>RO Date</th>
                        <th>RO Received Date</th>
                        <th>Customer Name</th>
                        <th>Part No</th>
                        <th>Part Serial Number</th>
                        <th>Part Description</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseRequisitions.map((req) => (
                        <tr key={req.id}>
                          <td>{req.roNo}</td>
                          <td>{req.roDate}</td>
                          <td>{req.roReceiveDate}</td>
                          <td>{req.customerName}</td>
                          <td>{req.partNo}</td>
                          <td>{req.partSerialNumber}</td>
                          <td>{req.partDescription}</td>
                          <td>{req.quantity}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveRequisition(req.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Upload & Submit */}
                <div className="col-md-6 p-1 d-flex mb-3">
                  <label className="col-md-4 mt-2">Upload Document *</label>
                  <input
                    className="form-control w-100"
                    type="file"
                    onChange={(e) => setDocument(e.target.files[0])}
                  />
                  {document && (
                    <small className="mt-1">Uploaded: {document.name}</small>
                  )}
                </div>
                <button className="btn btn-success" onClick={handleSubmitAll}>
                  Submit All Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerOrder;
