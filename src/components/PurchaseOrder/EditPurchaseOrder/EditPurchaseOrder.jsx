import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getPurchaseOrder,
  updatePurchaseOrder,
} from "../../../services/db_manager";
import { toast } from "react-toastify";
import AMCLOGO from "../../../static/img/AMCLOGO.jpg";
import styles from "./EditPurchaseOrder.module.css";

const EditPurchaseOrder = () => {
  const location = useLocation();
  const { purchaseOrderID } = location.state || "";
  const navigate = useNavigate();

  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    poNo: "",
    poDate: "",
    ourReference: "",
    yourReference: "",
    delivery: "",
    deliveryAddress: "",
    paymentTerms: "",
    address: "",
    items: [
      {
        srNo: 1,
        partNumber: "",
        description: "",
        requiredQty: 0,
        units: "",
        rate: 0,
        gross: 0,
      },
    ],
    pf: 0,
    transportation: 0,
    insurance: 0,
    other_Charges: 0,
    incoterm: "",
    currency: "",
    forwarder: "",
    unit: "",
    ratePerUnit: 0,
    grossAmount: 0,
    sgst: "",
    cgst: "",
    igst: "",
    total: 0,
    grandTotal: 0,
  });

  const fetchPurchaseOrder = async () => {
    setIsLoading(true);
    try {
      const response = await getPurchaseOrder(purchaseOrderID);
      if (response) {
        const itemsArray = [
          {
            srNo: response.srNo || 1,
            partNumber: response.partNumber || "",
            description: response.description || "",
            requiredQty: response.currentStoke || 0,
            units: response.unit || "",
            rate: response.ratePerUnit || 0,
            gross: response.grossAmount || 0,
          },
        ];

        const formattedData = {
          ...response,
          poNo: response.poNumber || "",
          poDate: response.poDate || "",
          items: itemsArray,
          pf: response.pf || 0,
          transportation: response.transportation || 0,
          insurance: response.insurance || 0,
          other_Charges: response.other_Charges || 0,
          sgst: response.sgstPercentage || 0,
          cgst: response.cgstPercentage || 0,
          igst: response.igstPercentage || 0,
        };

        setOriginalData(formattedData);
        setFormData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching Purchase order details:", error);
      toast.error("Error fetching Purchase order details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (purchaseOrderID) {
      fetchPurchaseOrder();
    }
  }, [purchaseOrderID]);

  useEffect(() => {
    const updatedItems = formData.items.map((item) => ({
      ...item,
      gross: calculateGross(item.requiredQty, item.rate),
    }));

    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  }, [
    formData.items.map((item) => item.requiredQty).join(","),
    formData.items.map((item) => item.rate).join(","),
    formData.pf,
    formData.transportation,
    formData.insurance,
    formData.other_Charges,
    formData.sgst,
    formData.cgst,
    formData.igst,
  ]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prevData) => ({
      ...prevData,
      [field]: numValue,
    }));
  };

  const handleItemChange = (index, field, value) => {
    let numValue = value;
    if (field === "requiredQty" || field === "rate") {
      numValue = parseFloat(value) || 0;
    }

    setFormData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numValue,
      };

      if (field === "requiredQty" || field === "rate") {
        updatedItems[index].gross = calculateGross(
          field === "requiredQty" ? numValue : updatedItems[index].requiredQty,
          field === "rate" ? numValue : updatedItems[index].rate
        );
      }

      return {
        ...prevData,
        items: updatedItems,
      };
    });
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9.]/g, "");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.\-_ ]/g, "");
    }
    event.target.value = value;
    return value;
  };

  const calculateGross = (qty, rate) => {
    return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.gross || 0), 0);
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() +
      (parseFloat(formData.pf) || 0) +
      (parseFloat(formData.transportation) || 0) +
      (parseFloat(formData.insurance) || 0) +
      (parseFloat(formData.other_Charges) || 0)
    );
  };

  const calculateTax = (taxRate) => {
    return (calculateTotal() * (parseFloat(taxRate) || 0)) / 100;
  };

  const getTaxAmount = (taxType) => {
    const taxRate = parseFloat(formData[taxType]) || 0;
    return calculateTax(taxRate);
  };

  const calculateGrandTotal = () => {
    if (formData.currency === "INR") {
      const sgstAmount = getTaxAmount("sgst");
      const cgstAmount = getTaxAmount("cgst");
      const igstAmount = getTaxAmount("igst");
      return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
    }
    return calculateTotal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const firstItem = formData.items[0] || {};
      const sgstAmount = formData.currency === "INR" ? getTaxAmount("sgst") : 0;
      const cgstAmount = formData.currency === "INR" ? getTaxAmount("cgst") : 0;
      const igstAmount = formData.currency === "INR" ? getTaxAmount("igst") : 0;

      const subtotal = calculateSubtotal();
      const total = calculateTotal();
      const grandTotal = calculateGrandTotal();

      const payload = {
        id: purchaseOrderID,
        poNumber: formData.poNo,
        poDate: formData.poDate,
        ourReference: formData.ourReference,
        yourReference: formData.yourReference,
        delivery: formData.delivery,
        deliveryAddress: formData.deliveryAddress,
        paymentTerms: formData.paymentTerms,
        incoterm: formData.incoterm,
        currency: formData.currency,
        forwarder: formData.forwarder,
        address: formData.address,
        srNo: firstItem.srNo,
        partNumber: firstItem.partNumber,
        description: firstItem.description,
        currentStoke: firstItem.requiredQty,
        unit: firstItem.units,
        ratePerUnit: firstItem.rate,
        grossAmount: subtotal,
        pf: parseFloat(formData.pf) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        insurance: parseFloat(formData.insurance) || 0,
        other_Charges: parseFloat(formData.other_Charges) || 0,
        total: total,
        sgst: sgstAmount,
        cgst: cgstAmount,
        igst: igstAmount,
        sgstPercentage:
          formData.currency === "INR" ? parseFloat(formData.sgst) || 0 : 0,
        cgstPercentage:
          formData.currency === "INR" ? parseFloat(formData.cgst) || 0 : 0,
        igstPercentage:
          formData.currency === "INR" ? parseFloat(formData.igst) || 0 : 0,
        grandTotal: grandTotal,
        termsAndConditions:
          formData.termsAndConditions ||
          "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...",
      };

      const response = await updatePurchaseOrder(purchaseOrderID, payload);
      if (response.status === 200) {
        toast.success("Purchase Order Updated Successfully!");
        navigate("/ViewPurchaseOrder");
      }
    } catch (error) {
      console.error("Error updating purchase order:", error);
      toast.error("Failed to update purchase order.");
    }
  };

  const handleTaxChange = (taxType, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prevData) => ({
      ...prevData,
      [taxType]: numValue,
    }));
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading purchase order...</p>
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
              <span className={styles.breadcrumbLabel}>Edit Purchase Order</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <div className={styles.poCard}>
              {/* Company Header */}
              <div className={styles.companySection}>
                <div className={styles.companyInfo}>
                  <div className={styles.logoSection}>
                    <img src={AMCLOGO} alt="AMC Technology Logo" className={styles.logoImage} />
                    <div className={styles.companyDetails}>
                      <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
                      <p className={styles.companyAddress}>105, Hiday Industrial Estate, Hira Industrial Park</p>
                      <p className={styles.companyAddress}>Off Western Express Highway, Vasai Phata,</p>
                      <p className={styles.companyAddress}>Vasai (East) Dist - Palghar, 401208</p>
                      <p className={styles.companyGst}>GST NO: 27ABTPS4731Z1ZA</p>
                    </div>
                  </div>
                </div>
                <div className={styles.orderInfoSection}>
                  <div className={styles.orderInfoGrid}>
                    <label>P.O. No.:</label>
                    <input type="text" disabled className={styles.input} value={formData.poNo} />
                    <label>P.O. Date:</label>
                    <input type="date" disabled className={styles.input} value={formData.poDate} />
                    <label>Our Reference:</label>
                    <input type="text" disabled className={styles.input} value={formData.ourReference} />
                    <label>Your Reference:</label>
                    <input type="text" disabled className={styles.input} value={formData.yourReference} />
                    <label>Delivery:</label>
                    <input type="text" disabled className={styles.input} value={formData.delivery} />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className={styles.addressSection}>
                <div className={styles.addressBox}>
                  <label className={styles.addressLabel}>To,</label>
                  <textarea
                    disabled
                    className={styles.textarea}
                    value={formData.deliveryAddress}
                    rows={3}
                  />
                </div>
                <div className={styles.addressBox}>
                  <label className={styles.addressLabel}>Delivery Address:</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Enter delivery address..."
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Terms */}
              <div className={styles.paymentSection}>
                <label className={styles.paymentLabel}>Payment Terms:</label>
                <input
                  type="text"
                  disabled
                  className={styles.input}
                  value={formData.paymentTerms}
                />
              </div>

              {/* Items Table */}
              <div className={styles.tableSection}>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Part Number</th>
                      <th>Description</th>
                      <th>QTY</th>
                      <th>Units</th>
                      <th>Rate/Unit</th>
                      <th>Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.length > 0 ? (
                      formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.srNo}</td>
                          <td>{item.partNumber}</td>
                          <td>{item.description}</td>
                          <td>{item.requiredQty}</td>
                          <td>{item.units}</td>
                          <td>
                            <input
                              type="text"
                              className={styles.tableInput}
                              value={item.rate}
                              onChange={(e) => {
                                validateDataType(e, "N");
                                handleItemChange(index, "rate", e.target.value);
                              }}
                            />
                          </td>
                          <td>{(item.gross || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className={styles.noData}>No items available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Section */}
              <div className={styles.footerSection}>
                <div className={styles.termsSection}>
                  <div className={styles.legalText}>
                    <h4>JURISDICTION OF COURTS:</h4>
                    <p>
                      All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...
                    </p>
                  </div>
                  <div className={styles.termsGrid}>
                    <h4>TERMS AND CONDITION:</h4>
                    <div className={styles.termsInputs}>
                      <div className={styles.termRow}>
                        <label>Incoterm:</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.incoterm}
                          onChange={(e) => {
                            validateDataType(e, "ANS");
                            handleChange("incoterm", e.target.value);
                          }}
                        />
                      </div>
                      <div className={styles.termRow}>
                        <label>Currency:</label>
                        <select
                          className={styles.select}
                          value={formData.currency}
                          onChange={(e) => handleChange("currency", e.target.value)}
                        >
                          <option value="">Select Currency</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="EURO">EURO</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>
                      <div className={styles.termRow}>
                        <label>Forwarder:</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.forwarder}
                          onChange={(e) => {
                            validateDataType(e, "A");
                            handleChange("forwarder", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.totalsSection}>
                  <div className={styles.totalsTable}>
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Gross</span>
                      <span className={styles.totalValue}>{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Total</span>
                      <span className={styles.totalValue}>{calculateTotal().toFixed(2)}</span>
                    </div>

                    {formData.currency === "INR" && (
                      <>
                        <div className={styles.totalRow}>
                          <div className={styles.taxInputRow}>
                            <span>SGST @ </span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className={styles.taxInput}
                              value={formData.sgst === 0 ? "" : formData.sgst}
                              onChange={(e) => {
                                const validatedValue = validateDataType(e, "N");
                                handleTaxChange("sgst", validatedValue === "" ? 0 : validatedValue);
                              }}
                            />
                            <span>%</span>
                          </div>
                          <span className={styles.totalValue}>{getTaxAmount("sgst").toFixed(2)}</span>
                        </div>
                        <div className={styles.totalRow}>
                          <div className={styles.taxInputRow}>
                            <span>CGST @ </span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className={styles.taxInput}
                              value={formData.cgst === 0 ? "" : formData.cgst}
                              onChange={(e) => {
                                const validatedValue = validateDataType(e, "N");
                                handleTaxChange("cgst", validatedValue === "" ? 0 : validatedValue);
                              }}
                            />
                            <span>%</span>
                          </div>
                          <span className={styles.totalValue}>{getTaxAmount("cgst").toFixed(2)}</span>
                        </div>
                        <div className={styles.totalRow}>
                          <div className={styles.taxInputRow}>
                            <span>IGST @ </span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className={styles.taxInput}
                              value={formData.igst === 0 ? "" : formData.igst}
                              onChange={(e) => {
                                const validatedValue = validateDataType(e, "N");
                                handleTaxChange("igst", validatedValue === "" ? 0 : validatedValue);
                              }}
                            />
                            <span>%</span>
                          </div>
                          <span className={styles.totalValue}>{getTaxAmount("igst").toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    <div className={`${styles.totalRow} ${styles.grandTotalRow}`}>
                      <span className={styles.totalLabel}>Grand Total</span>
                      <span className={styles.totalValue}>{calculateGrandTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={styles.signatureSection}>
                    <p className={styles.signatureTitle}>FOR AMC TECHNOLOGY</p>
                    <div className={styles.signatureSpace}></div>
                    <p className={styles.signatureTitle}>Authorised Signatory</p>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className={styles.formFooter}>
                <span>Form: AMC-32</span>
                <span>Rev:00</span>
                <span>Date: Jan 2021</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.btnCancel} onClick={() => navigate(-1)}>
                <i className="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button className={styles.btnUpdate} onClick={handleSubmit}>
                <i className="fa fa-check"></i>
                <span>Update Purchase Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditPurchaseOrder;