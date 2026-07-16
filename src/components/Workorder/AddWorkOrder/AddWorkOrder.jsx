import { useEffect, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AddWorkOrder,
  getWorkOrder,
  getWorkOrderById,
} from "../../../services/db_manager";
import { toast } from "react-toastify";
import styles from "./AddWorkorder.module.css";

const AddWorkorder = () => {
  const location = useLocation();
  const { srNo, SerialNumber } = location.state || "";
  const navigate = useNavigate();
  console.log(srNo, "srnoooo");

  const getInitialFormState = () => ({
    cmmRevDate: "",
    issueDate: "",
    customerName: "",
    repairOrderNo: "",
    partNumber: "",
    qty: "",
    description: "",
    cmmRefNo: "",
    revNo: "",
    issuedBy: "",
    certifyingStaffhours: sessionStorage.getItem("username"),
    technician: "",
    totalManHour: "",
    actionTaken: "",
    toolsUsed: "",
    qualityManagerSignDate: "",
    workshopManagerSignDate: "",
    snBn: "",
    srNumber: "",

    workOrderSteps: [
      {
        stepNo: 1,
        detailOfWorkDone:
          "Incoming Inspection:\na) Carry out Visual Inspection of the unit at the time if receipt for\nphysical damage, missing parts, documentents and any other\naspect\nb) Report any discrepancy noticed to shop QC for further action\nand Disposition.\nc) Check SB Compliance\nRecord TSN:--                    CSN:--",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 2,
        detailOfWorkDone: "Test unit to confirm the defect as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 3,
        detailOfWorkDone: "Disassembly as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 4,
        detailOfWorkDone: "Cleaning as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 5,
        detailOfWorkDone: "Inspection/Check as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 6,
        detailOfWorkDone: "Trouble-shooting as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 7,
        detailOfWorkDone: "Repair as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 8,
        detailOfWorkDone: "Assembly as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 9,
        detailOfWorkDone: "Test unit as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 10,
        detailOfWorkDone: "Fit and Clearance as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 11,
        detailOfWorkDone: "Final Inspection",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 12,
        detailOfWorkDone: "Actual",
        technicianSign: "",
        certifyingStaffSign: "",
      },
    ],

    materialRequisitions: [
      {
        srNo: 101,
        description: "",
        partNo: "",
        snbn: "",
        qty: "",
        remarks: "Main part from order",
      },
    ],

    toolsTextBox1: "",
    toolsTextBox2: "",
  });

  const [form, setForm] = useState(getInitialFormState());
  const [loading, setLoading] = useState(true);

  const fetchPurchaseOrder = async () => {
    try {
      setLoading(true);
      const response = await getWorkOrderById(srNo);
      if (response) {
        console.log("API Response:", response);

        const mainPartMaterialRequisition = {
          srNo: 101,
          description: response.data?.partDescription || "",
          partNo: response.data?.partNo || "",
          qty: response.data?.quantity || "",
          remarks: response.data?.remark || "",
        };

        const initialState = getInitialFormState();

        const formattedData = {
          ...initialState,
          customerName: response.data?.customerName || "",
          repairOrderNo: String(response.orderNo || response.data?.roNo || ""),
          description: response.data?.partDescription || "",
          partNumber: response.data?.partNo || "",
          qty: response.data.quantity || "",
          workOrderSteps:
            response.data?.workOrderSteps ||
            response.data?.workDetails ||
            initialState.workOrderSteps,
          materialRequisitions: response.data?.materialRequisitions ||
            response.data?.partsUsed || [mainPartMaterialRequisition],
          issueDate:
            response.data?.roDate || response.data?.roReceiveDate || "",
          cmmRefNo: response.data?.cmmRefNo || "",
          revNo: response.data?.revisionNo || response.data?.revNo || "",
          certifyingStaffhours: sessionStorage.getItem("username") || "",
          technician: response.data?.technician || "",
          totalManHour: response.data?.totalManHour || "",
          actionTaken: response.data?.actionTaken || "",
          toolsTextBox1: response.data?.toolsUsed || "",
          qualityManagerSignDate: response.data?.qualityManagerSignDate || "",
          workshopManagerSignDate: response.data?.workshopManagerSignDate || "",
        };

        console.log("Formatted Data:", formattedData);
        setForm(formattedData);
        toast.success("Work Order data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching Purchase order details:", error);
      toast.error("Error fetching Purchase order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (srNo) {
      fetchPurchaseOrder();
    } else {
      setLoading(false);
    }
  }, [srNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleWorkOrderStepChange = (index, field, value) => {
    const updatedWorkOrderSteps = [...form.workOrderSteps];
    updatedWorkOrderSteps[index][field] = value;
    setForm({ ...form, workOrderSteps: updatedWorkOrderSteps });
  };

  const handleMaterialRequisitionChange = (index, field, value) => {
    const updatedMaterialRequisitions = [...form.materialRequisitions];
    updatedMaterialRequisitions[index][field] = value;
    setForm({ ...form, materialRequisitions: updatedMaterialRequisitions });
  };

  const addMaterialRequisitionRow = () => {
    const newSrNo =
      Math.max(...form.materialRequisitions.map((item) => item.srNo || 0)) + 1;
    setForm({
      ...form,
      materialRequisitions: [
        ...form.materialRequisitions,
        {
          srNo: newSrNo,
          description: "",
          partNo: "",
          snbn: "",
          qty: "",
          remarks: "",
        },
      ],
    });
  };

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

    return null;
  };

  const validationRules = {
    repairOrderNo: {
      length: 20,
      regex: /^[a-zA-Z0-9-]*$/,
    },
    customerName: {
      length: 200,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    partNumber: {
      length: 50,
      regex: /^[a-zA-Z0-9-\s]*$/,
    },
    description: {
      length: 200,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    qty: {
      type: "number",
      length: 20,
    },
    cmmRefNo: {
      length: 50,
      regex: /^[a-zA-Z0-9\s\-/._]*$/,
    },
    revNo: {
      type: "text",
      length: 50,
      regex: /^[a-zA-Z0-9\s-]*$/,
    },
    certifyingStaffhours: {
      type: "text",
      length: 50,
    },
    issuedBy: {
      length: 50,
      regex: /^[a-zA-Z\s]*$/,
    },
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 \-\/._]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.]/g, "");
    } else if (dataType === "REF") {
      value = value.replace(/[^a-zA-Z0-9 \-/._]/g, "");
    }
    event.target.value = value;
  };

  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen);
    event.target.value = value;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        toast.error(error);
        return;
      }
    }

    const payload = {
      cmmRevDate: form.cmmRevDate,
      issueDate: form.issueDate,
      customerName: form.customerName,
      repairOrderNo: form.repairOrderNo,
      partNumber: form.partNumber,
      qty: parseInt(form.qty) || 0,
      description: form.description,
      cmmRefNo: form.cmmRefNo,
      revNo: form.revNo,
      issuedBy: form.issuedBy,
      certifyingStaffhours: form.certifyingStaffhours,
      technician: form.technician,
      totalManHour: form.totalManHour,
      actionTaken: form.actionTaken,
      toolsUsed: form.toolsTextBox1 || "",
      qualityManagerSignDate: form.qualityManagerSignDate,
      workshopManagerSignDate: form.workshopManagerSignDate,
      snBn: SerialNumber,
      workOrderSteps: form.workOrderSteps.map((step) => ({
        stepNo: step.stepNo,
        detailOfWorkDone: step.detailOfWorkDone,
        technicianSign: step.technicianSign,
        certifyingStaffSign: step.certifyingStaffSign,
      })),
      srNumber: srNo,
      materialRequisitions: form.materialRequisitions.map((material) => ({
        srNo: material.srNo,
        description: material.description,
        partNo: material.partNo,
        snbn: SerialNumber,
        qty: parseInt(material.qty) || 0,
        remarks: material.remarks,
      })),
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const response = AddWorkOrder(payload);
      if (!response) {
        toast.error("Failed to add work order.");
      } else {
        console.log("Work order added successfully:", response);
        toast.success("Work Order Added Successfully!");
        navigate("/ViewWorkOrder");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding work order:", error);
      toast.error("Failed to add work order.");
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <h5>Loading Work Order Data...</h5>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!form.workOrderSteps || !Array.isArray(form.workOrderSteps)) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.mainContent}>
            <div className={styles.errorAlert}>
              <i className="fa fa-exclamation-triangle"></i>
              <span>Error loading work order data. Please try again.</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbSection}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Add Work Order</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  {/* Basic Information Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-info-circle"></i>
                    <span>Basic Information</span>
                    <span className={styles.readOnlyBadge}>Read Only</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Repair Order <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="repairOrderNo"
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        value={form.repairOrderNo}
                        onChange={handleChange}
                        placeholder="Auto Generated"
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Customer Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="customerName"
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 200);
                        }}
                        value={form.customerName}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Part Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="partNumber"
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        value={form.partNumber}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        className={styles.input}
                        name="qty"
                        onInput={(event) => validateLen(event, 1, 20)}
                        value={form.qty}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Description <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      className={styles.textarea}
                      name="description"
                      value={form.description}
                      onInput={(event) => {
                        validateDataType(event, "A");
                        validateLen(event, 1, 200);
                      }}
                      onChange={handleChange}
                      rows="3"
                      disabled
                    />
                  </div>

                  {/* Technical Details Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-cogs"></i>
                    <span>Technical Details</span>
                    <span className={styles.mixedBadge}>Mixed</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        CMM Ref No <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="cmmRefNo"
                        onInput={(event) => {
                          validateDataType(event, "REF");
                          validateLen(event, 1, 50);
                        }}
                        value={form.cmmRefNo}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Serial Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="snBn"
                        value={SerialNumber}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Revision No <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="revNo"
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        value={form.revNo}
                        onChange={handleChange}
                        placeholder="Enter revision number"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        CMM Rev Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="cmmRevDate"
                        value={form.cmmRevDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Personnel & Scheduling Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-users"></i>
                    <span>Personnel & Scheduling</span>
                    <span className={styles.editableBadge}>Editable</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Issue Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="issueDate"
                        value={form.issueDate}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Certifying Staff <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="certifyingStaffhours"
                        value={form.certifyingStaffhours}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Technician <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="technician"
                        value={form.technician}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        onChange={handleChange}
                        placeholder="Enter technician name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Total Man Hour <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="totalManHour"
                        value={form.totalManHour}
                        onChange={handleChange}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 10);
                        }}
                        placeholder="Enter total hours"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Issued By <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="issuedBy"
                        value={form.issuedBy}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 50);
                        }}
                        onChange={handleChange}
                        placeholder="Enter issuer name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Action Taken <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.input}
                        name="actionTaken"
                        value={form.actionTaken}
                        onChange={handleChange}
                        placeholder="Enter action taken"
                        required
                      />
                    </div>
                  </div>

                  {/* Signature Dates Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-pen"></i>
                    <span>Signatures</span>
                    <span className={styles.editableBadge}>Editable</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quality Manager Sign Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="qualityManagerSignDate"
                        value={form.qualityManagerSignDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Workshop Manager Sign Date <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        className={styles.input}
                        name="workshopManagerSignDate"
                        value={form.workshopManagerSignDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Material Requisitions Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-boxes"></i>
                    <span>Material Requisitions</span>
                    <span className={styles.mixedBadge}>Mixed</span>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Description</th>
                          <th>Part No</th>
                          <th>Serial Number</th>
                          <th>Qty</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.materialRequisitions.map((material, index) => (
                          <tr key={index}>
                            <td className={styles.centerText}>{material.srNo}</td>
                            <td>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={material.description}
                                disabled
                                onChange={(e) =>
                                  handleMaterialRequisitionChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={material.partNo}
                                disabled
                                onChange={(e) =>
                                  handleMaterialRequisitionChange(
                                    index,
                                    "partNo",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={SerialNumber}
                                disabled
                                onChange={(e) =>
                                  handleMaterialRequisitionChange(
                                    index,
                                    "snbn",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className={styles.tableInput}
                                value={material.qty}
                                disabled
                                onChange={(e) =>
                                  handleMaterialRequisitionChange(
                                    index,
                                    "qty",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={material.remarks}
                                onChange={(e) =>
                                  handleMaterialRequisitionChange(
                                    index,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter remarks"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tools Section */}
                  <div className={styles.sectionHeader}>
                    <i className="fa fa-wrench"></i>
                    <span>Tools Used</span>
                    <span className={styles.editableBadge}>Editable</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tools Used</label>
                    <input
                      type="text"
                      className={styles.input}
                      name="toolsTextBox1"
                      value={form.toolsTextBox1}
                      onChange={handleChange}
                      placeholder="Enter tools used"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSubmit}>
                      <i className="fa fa-plus-circle"></i>
                      <span>Add Work Order</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddWorkorder;