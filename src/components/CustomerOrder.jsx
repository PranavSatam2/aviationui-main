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
  const [roDate, setRoDate] = useState(new Date().toISOString().split("T")[0]);
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

  useEffect(() => {
    const fetchPartDetails = async () => {
      if (!partNo) {
        setPartDescription("");
        setPartSerialNumber("");
        setSerialOptions([]);
        return;
      }
      setIsLoadingPartDetails(true);
      try {
        const data = await GetpartDetailsFromProductSelect(partNo);
        if (data?.length > 0) {
          const partDetails = data[0];
          setPartDescription(partDetails.productDescription || "");

          const serialArray = partDetails.productSerialNumbers
            ? Object.values(partDetails.productSerialNumbers)
            : [];

          setSerialOptions(serialArray);
          setPartSerialNumber("");
        } else {
          setPartDescription("");
          setSerialOptions([]);
          setPartSerialNumber("");
        }
      } catch (err) {
        console.error("Error fetching part details:", err);
        setPartDescription("");
        setSerialOptions([]);
        setPartSerialNumber("");
      } finally {
        setIsLoadingPartDetails(false);
      }
    };
    fetchPartDetails();
  }, [partNo]);

  const validateForm = () => {
    const newErrors = {};
    if (!roNo.trim()) {
      newErrors.roNo = "RO No is required";
    } else if (!/^\d{1,50}$/.test(roNo)) {
      newErrors.roNo = "RO No must be a number";
    }

    if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (!/^\d{1,10}$/.test(quantity)) {
      newErrors.quantity = "Quantity must be a number";
    }

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

  const resetForm = () => {
    setRoNo("");
    setRoReceiveDate("");
    setCustomerName("");
    setPartNo("");
    setPartDescription("");
    setQuantity("");
    setPartSerialNumber("");
    setStatus("");
    setSerialOptions([]);
    setError({});
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
    
    // Reset form for next entry
    resetForm();

    alert("Customer Order added to the list! You can add more orders.");
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
      resetForm();
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
              <h5 className="mb-3">Add New Customer Order</h5>
              <form onSubmit={handleSubmit}>
                {/* RO No */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Repair Order No *</label>
                    <div className="w-100">
                      <input
                        className="form-control w-100"
                        type="text"
                        value={roNo}
                        onChange={(e) => handleInputChange(e, setRoNo)}
                      />
                      {error.roNo && (
                        <span className="text-danger small">{error.roNo}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Part Number & Serial */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Part Number *</label>
                    <div className="w-100">
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
                      {error.partNo && (
                        <span className="text-danger small">{error.partNo}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">
                      Part Serial Number *
                    </label>
                    <div className="w-100">
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
                        <span className="text-danger small">
                          {error.partSerialNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer & RO Receive Date */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Customer Name *</label>
                    <div className="w-100">
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
                      {error.customerName && (
                        <span className="text-danger small">
                          {error.customerName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">RO Received Date *</label>
                    <div className="w-100">
                      <input
                        className="form-control w-100"
                        type="date"
                        value={roReceiveDate}
                        onChange={(e) => handleInputChange(e, setRoReceiveDate)}
                      />
                      {error.roReceiveDate && (
                        <span className="text-danger small">
                          {error.roReceiveDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Part Description & RO Date */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Part Description *</label>
                    <div className="w-100">
                      <textarea
                        className="form-control w-100"
                        value={partDescription}
                        onChange={(e) => handleInputChange(e, setPartDescription)}
                        style={{ height: "70px" }}
                        placeholder="Auto-filled when part number is selected"
                        disabled
                      ></textarea>
                      {error.partDescription && (
                        <span className="text-danger small">
                          {error.partDescription}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">RO Submit Date *</label>
                    <input
                      className="form-control w-100"
                      type="date"
                      value={roDate}
                      onChange={(e) => handleInputChange(e, setRoDate)}
                      // disabled
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-md-12 p-2 d-flex">
                  <div className="col-md-6 p-1 d-flex">
                    <label className="col-md-4 mt-2">Quantity *</label>
                    <div className="w-100">
                      <input
                        className="form-control w-100"
                        type="text"
                        value={quantity}
                        onChange={(e) => handleInputChange(e, setQuantity)}
                      />
                      {error.quantity && (
                        <span className="text-danger small">
                          {error.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to list */}
                <div className="col-md-12 text-end mt-3">
                  <button type="submit" className="btn btn-primary">
                    Add to List
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Display Table */}
          {purchaseRequisitions.length > 0 && (
            <div className="row mx-1 card border border-dark shadow-lg py-4 mt-4">
              <div className="col-md-12">
                <h4>Customer Order List ({purchaseRequisitions.length} {purchaseRequisitions.length === 1 ? 'order' : 'orders'})</h4>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
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
                      {purchaseRequisitions.map((req, index) => (
                        <tr key={req.id}>
                          <td>{index + 1}</td>
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
                  <div className="w-100">
                    <input
                      className="form-control w-100"
                      type="file"
                      onChange={(e) => setDocument(e.target.files[0])}
                    />
                    {document && (
                      <small className="text-success mt-1 d-block">
                        ✓ Uploaded: {document.name}
                      </small>
                    )}
                  </div>
                </div>
                <button className="btn btn-success btn-lg" onClick={handleSubmitAll}>
                  Submit All {purchaseRequisitions.length} Orders
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