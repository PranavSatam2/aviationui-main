import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import {
  listAllCustomerNames,
  listAllPartNo,
  GetpartDetailsFromProductSelect,
} from "../services/db_manager";
import { toast } from "react-toastify";
import styles from "./CustomerOrder.module.css";

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
  const [cmmRefNo, setCmmRefNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loader state

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
        setCmmRefNo("");
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
          setCmmRefNo(partDetails.cmmRefNo || "");
        } else {
          setPartDescription("");
          setSerialOptions([]);
          setPartSerialNumber("");
          setCmmRefNo("");
        }
      } catch (err) {
        console.error("Error fetching part details:", err);
        setPartDescription("");
        setSerialOptions([]);
        setPartSerialNumber("");
        setCmmRefNo("");
      } finally {
        setIsLoadingPartDetails(false);
      }
    };
    fetchPartDetails();
  }, [partNo]);

  const handleRoNoChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9-]/g, "");
    setRoNo(filteredValue);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!roNo.trim()) {
      newErrors.roNo = "RO No is required";
    } else if (!/^[a-zA-Z0-9-]{1,50}$/.test(roNo)) {
      newErrors.roNo =
        "RO No must be alphanumeric (letters, numbers, and hyphens only)";
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
    setCmmRefNo("");
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
      cmmRefNo,
      id: Date.now(),
      makerUserName: sessionStorage.getItem("username"),
      makerDate: new Date().toISOString().split("T")[0],
      userAction: "1",
      userRole: sessionStorage.getItem("roleId"),
    };

    setPurchaseRequisitions([...purchaseRequisitions, newReq]);
    resetForm();
    toast.success("Customer Order added to the list!");
  };

  const handleRemoveRequisition = (id) => {
    setPurchaseRequisitions(purchaseRequisitions.filter((r) => r.id !== id));
    toast.info("Order removed from list");
  };

  const handleSubmitAll = async () => {
    if (!document) {
      toast.error("Please upload the document.");
      return;
    }
    if (purchaseRequisitions.length === 0) {
      toast.warning("No Customer Order to submit!");
      return;
    }

    setIsSubmitting(true); // Start loader

    try {
      const ordersPayload = purchaseRequisitions.map((req) => ({
        roNo: req.roNo,
        roDate: req.roDate,
        roReceiveDate: req.roReceiveDate,
        customerName: req.customerName,
        partNo: req.partNo,
        partDescription: req.partDescription,
        quantity: Number(req.quantity),
        batchNo: req.partSerialNumber,
        cmmRefNo: req.cmmRefNo,
        makerUserName: req.makerUserName,
        makerDate: req.makerDate,
        userAction: "1",
        userRole: req.userRole,
      }));

      const formData = new FormData();
      formData.append("document", document);
      formData.append("orders", JSON.stringify(ordersPayload));

      const response = await axiosInstance.post(
        "/api/customerOrder/uploadWithOrders",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("All orders submitted successfully!");
      setPurchaseRequisitions([]);
      setDocument(null);
      resetForm();

      if (response) {
        console.log("Server response:", response);
      }
    } catch (err) {
      console.error("Submit failed:", err.response?.data);
      toast.error(err.response?.data || "Failed to submit orders");
    } finally {
      setIsSubmitting(false); // Stop loader
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button className={styles.backButton} onClick={() => window.history.back()}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Add Customer Order</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Order Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-file-alt"></i>
                    <span>Order Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Repair Order No <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        value={roNo}
                        onChange={handleRoNoChange}
                        placeholder="Enter RO No"
                      />
                      {error.roNo && (
                        <span className={styles.errorText}>{error.roNo}</span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        RO Received Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        value={roReceiveDate}
                        onChange={(e) => handleInputChange(e, setRoReceiveDate)}
                      />
                      {error.roReceiveDate && (
                        <span className={styles.errorText}>{error.roReceiveDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Part Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-box"></i>
                    <span>Part Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
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
                        <span className={styles.errorText}>{error.partNo}</span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Serial Number <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        value={partSerialNumber}
                        onChange={(e) => handleInputChange(e, setPartSerialNumber)}
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
                        <span className={styles.errorText}>{error.partSerialNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Customer Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-user"></i>
                    <span>Customer Information</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Customer Name <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
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
                        <span className={styles.errorText}>{error.customerName}</span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Unit Receive Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        value={roDate}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Additional Details Section */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Description <span className={styles.required}>*</span>
                      </label>
                      <textarea
                        className={styles.textarea}
                        value={partDescription}
                        onChange={(e) => handleInputChange(e, setPartDescription)}
                        rows="3"
                        placeholder="Auto-filled when part number is selected"
                        disabled
                      />
                      {error.partDescription && (
                        <span className={styles.errorText}>{error.partDescription}</span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        value={quantity}
                        onChange={(e) => handleInputChange(e, setQuantity)}
                        placeholder="Enter quantity"
                      />
                      {error.quantity && (
                        <span className={styles.errorText}>{error.quantity}</span>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnAdd}>
                      <i className="fa fa-plus"></i>
                      <span>Add to List</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Display Table */}
            {purchaseRequisitions.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <i className="fa fa-list"></i>
                  <span>
                    Customer Order List ({purchaseRequisitions.length}{" "}
                    {purchaseRequisitions.length === 1 ? "order" : "orders"})
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>RO No</th>
                          <th>Unit Submit Date</th>
                          <th>RO Received Date</th>
                          <th>Customer Name</th>
                          <th>Part No</th>
                          <th>Part Serial Number</th>
                          <th>Part Description</th>
                          <th>Quantity</th>
                          <th className={styles.actionsHeader}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseRequisitions.map((req, index) => (
                          <tr key={req.id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>{index + 1}</td>
                            <td>{req.roNo}</td>
                            <td>{req.roDate}</td>
                            <td>{req.roReceiveDate}</td>
                            <td>{req.customerName}</td>
                            <td>{req.partNo}</td>
                            <td>{req.partSerialNumber}</td>
                            <td>{req.partDescription}</td>
                            <td>{req.quantity}</td>
                            <td className={styles.actionsCell}>
                              <button
                                className={styles.btnRemove}
                                onClick={() => handleRemoveRequisition(req.id)}
                                title="Remove"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Upload & Submit Section */}
                  <div className={styles.uploadSection}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Upload Document <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="file"
                        className={styles.fileInput}
                        onChange={(e) => setDocument(e.target.files[0])}
                      />
                      {document && (
                        <div className={styles.uploadedFile}>
                          <i className="fa fa-check-circle"></i>
                          <span>Uploaded: {document.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.submitActions}>
                    <button
                      className={styles.btnSubmitAll}
                      onClick={handleSubmitAll}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa fa-paper-plane"></i>
                          <span>Submit All {purchaseRequisitions.length} Orders</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerOrder;