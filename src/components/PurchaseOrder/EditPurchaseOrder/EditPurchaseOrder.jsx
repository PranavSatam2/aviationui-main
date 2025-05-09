import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { getPurchaseOrder, updatePurchaseOrder } from "../../../services/db_manager";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

// Import Purchase.module.css styles
import styles from '../Purchase.module.css';

const EditPurchaseOrder = () => {
  const location = useLocation();
  const { purchaseOrderID } = location.state || "";
  const navigate = useNavigate();

  // Store the original data to compare changes
  const [originalData, setOriginalData] = useState(null);
  
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: "",
    ourReference: "",
    yourReference: "",
    delivery: "",
    deliveryAddress: "",
    paymentTerms: "",
    items: [{ 
      srNo: 1,
      partNumber: "",
      description: "",
      requiredQty: 0,
      units: "",
      rate: 0,
      gross: 0
    }],
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
    grandTotal: 0
  });

  const fetchPurchaseOrder = async () => {
    try {
      const response = await getPurchaseOrder(purchaseOrderID);
      console.log(response, "response");
      if (response) {
        // Create an items array since it's not in the response
        const itemsArray = [{
          srNo: response.srNo || 1,
          partNumber: response.partNumber || "",
          description: response.description || "",
          requiredQty: response.currentStoke || 0,
          units: response.unit || "",
          rate: response.ratePerUnit || 0,
          gross: response.grossAmount || 0
        }];

        const formattedData = {
          ...response,
          poNo: response.poNumber || "",
          poDate: response.poDate || "",
          items: itemsArray,
          // Make sure all required fields are present
          pf: response.pf || 0,
          transportation: response.transportation || 0,
          insurance: response.insurance || 0,
          other_Charges: response.other_Charges || 0,
          sgst: response.sgstPercentage || 0,
          cgst: response.cgstPercentage || 0,
          igst: response.igstPercentage || 0
        };
        
        // Store original data for comparison
        setOriginalData(formattedData);
        setFormData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching Purchase order details:", error);
      toast.error("Error fetching Purchase order details.");
    }
  };

  useEffect(() => {
    if (purchaseOrderID) {
      fetchPurchaseOrder();
    }
  }, [purchaseOrderID]);
  
  // Always recalculate values when inputs change
  useEffect(() => {
    // This recalculates the gross amount when quantity or rate changes
    const updatedItems = formData.items.map(item => ({
      ...item,
      gross: calculateGross(item.requiredQty, item.rate)
    }));
    
    setFormData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
    
  }, [
    formData.items.map(item => item.requiredQty).join(','),
    formData.items.map(item => item.rate).join(','),
    formData.pf,
    formData.transportation,
    formData.insurance,
    formData.other_Charges,
    formData.sgst,
    formData.cgst,
    formData.igst
  ]);

  const handleChange = (field, value) => {
    setFormData(prevData => ({ 
      ...prevData, 
      [field]: value
    }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    
    setFormData(prevData => {
      const updatedData = { 
        ...prevData, 
        [field]: numValue
      };
      
      return updatedData;
    });
  };

  const handleItemChange = (index, field, value) => {
    // Convert value to number if applicable
    let numValue = value;
    if (field === 'requiredQty' || field === 'rate') {
      numValue = parseFloat(value) || 0;
    }
    
    setFormData(prevData => {
      const updatedItems = [...prevData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numValue,
      };
      
      // Recalculate gross if requiredQty or rate changes
      if (field === 'requiredQty' || field === 'rate') {
        updatedItems[index].gross = calculateGross(
          field === 'requiredQty' ? numValue : updatedItems[index].requiredQty,
          field === 'rate' ? numValue : updatedItems[index].rate
        );
      }
      
      return {
        ...prevData,
        items: updatedItems
      };
    });
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9.]/g, "");
      // Ensure only valid numbers are entered
      if (value && !isNaN(parseFloat(value))) {
        event.target.classList.add("is-valid");
        event.target.classList.remove("is-invalid");
      } else {
        event.target.classList.add("is-invalid");
        event.target.classList.remove("is-valid");
      }
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.\-_ ]/g, "");
      event.target.classList.add("is-valid");
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
    return calculateSubtotal() + 
           (parseFloat(formData.pf) || 0) + 
           (parseFloat(formData.transportation) || 0) + 
           (parseFloat(formData.insurance) || 0) + 
           (parseFloat(formData.other_Charges) || 0);
  };

  const calculateTax = (taxRate) => {
    return calculateTotal() * (parseFloat(taxRate) || 0) / 100;
  };

  // Calculate tax amounts based on current tax rates and total
  const getTaxAmount = (taxType) => {
    const taxRate = parseFloat(formData[taxType]) || 0;
    return calculateTax(taxRate);
  };

  const calculateGrandTotal = () => {
    const sgstAmount = getTaxAmount('sgst');
    const cgstAmount = getTaxAmount('cgst');
    const igstAmount = getTaxAmount('igst');
    
    return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Extract the first item data since the backend expects it flattened
      const firstItem = formData.items[0] || {};
      
      // Calculate the tax amounts based on current values
      const sgstAmount = getTaxAmount('sgst');
      const cgstAmount = getTaxAmount('cgst');
      const igstAmount = getTaxAmount('igst');
      
      // Calculate all values to ensure consistency
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
        // Item data flattened
        srNo: firstItem.srNo,
        partNumber: firstItem.partNumber,
        description: firstItem.description,
        currentStoke: firstItem.requiredQty,
        unit: firstItem.units,
        ratePerUnit: firstItem.rate,
        // Calculations
        grossAmount: subtotal,
        pf: parseFloat(formData.pf) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        insurance: parseFloat(formData.insurance) || 0,
        other_Charges: parseFloat(formData.other_Charges) || 0,
        total: total,
        // Tax values with calculated amounts
        sgst: sgstAmount,
        cgst: cgstAmount,
        igst: igstAmount,
        // Tax percentages
        sgstPercentage: parseFloat(formData.sgst) || 0,
        cgstPercentage: parseFloat(formData.cgst) || 0,
        igstPercentage: parseFloat(formData.igst) || 0,
        grandTotal: grandTotal,
        termsAndConditions: formData.termsAndConditions || "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City..."
      };
      
      console.log(payload);
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

  // Handle tax percentage change
  const handleTaxChange = (taxType, value) => {
    const numValue = parseFloat(value) || 0;
    
    setFormData(prevData => ({
      ...prevData,
      [taxType]: numValue
    }));
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Edit Purchase Order"
            isBack={true}
          />

          <div className={styles.container}>
            {/* <div className={styles.header}>
              <h1 className={styles.headerTitle}>PURCHASE ORDER</h1>
            </div> */}
            
            <div className={styles.formContainer}>
              {/* Company Section */}
              <div className={styles.companySection}>
                <div className={styles.companyInfo}>
                  <div className={styles.companyLogo}>
                    <img src="/api/placeholder/100/50" alt="AMC Technology Logo" className={styles.logoImage} />
                    <div>
                      <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
                      <p className={styles.companyAddress}>105, Hiday Industrial Estate, Hira Industrial Park</p>
                      <p className={styles.companyAddress}>Off Western Express Highway, Vasai Phata,</p>
                      <p className={styles.companyAddress}>Vasai (East) Dist - Palghar, 401208</p>
                      <p className={styles.companyAddress}>GST NO: 27ABTPS4731Z1ZA</p>
                    </div>
                  </div>
                </div>
                <div className={styles.orderInfoSection}>
                  <div className={styles.orderInfoGrid}>
                    <div className={styles.orderInfoLabel}>P.O. No.:</div>
                    <div>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.poNo}
                        onChange={(e) => {
                          validateDataType(e, "ANS");
                          handleChange('poNo', e.target.value);
                        }}
                      />
                    </div>
                    <div className={styles.orderInfoLabel}>P.O. Date:</div>
                    <div>
                      <input
                        type="date"
                        className={styles.inputField}
                        value={formData.poDate}
                        onChange={(e) => handleChange('poDate', e.target.value)}
                      />
                    </div>
                    <div className={styles.orderInfoLabel}>Our Reference:</div>
                    <div>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.ourReference}
                        onChange={(e) => {
                          validateDataType(e, "ANS");
                          handleChange('ourReference', e.target.value);
                        }}
                      />
                    </div>
                    <div className={styles.orderInfoLabel}>Your Reference:</div>
                    <div>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.yourReference}
                        onChange={(e) => {
                          validateDataType(e, "ANS");
                          handleChange('yourReference', e.target.value);
                        }}
                      />
                    </div>
                    <div className={styles.orderInfoLabel}>Delivery:</div>
                    <div>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.delivery}
                        onChange={(e) => {
                          validateDataType(e, "A");
                          handleChange('delivery', e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className={styles.addressSection}>
                <div className={styles.addressBox}>
                  <div className={styles.addressContainer}>
                    <div className={styles.addressTitle}>To,</div>
                    <div className={styles.addressText}>
                      <textarea
                        className={styles.textareaField}
                        value={formData.deliveryAddress}
                        onChange={(e) => {
                          validateDataType(e, "ANS");
                          handleChange('deliveryAddress', e.target.value);
                        }}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.deliveryBox}>
                  <div className={styles.addressContainer}>
                    <div className={styles.addressTitle}>Delivery Address:</div>
                    <div className={styles.addressText}>
                      AMC TECHNOLOGY<br />
                      105, Hiday Industrial Estate, Hira Industrial Park<br />
                      Off Western Express Highway, Vasai Phata,<br />
                      Vasai (East) Dist - Palghar, 401208
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className={styles.paymentTerms}>
                <div className={styles.paymentContainer}>
                  <div className={styles.paymentTitle}>Payment Terms:</div>
                  <div className={styles.paymentText}>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={formData.paymentTerms}
                      onChange={(e) => {
                        validateDataType(e, "ANS");
                        handleChange('paymentTerms', e.target.value);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.tableHeader}>Sr. No</th>
                      <th className={styles.tableHeader}>Part Number</th>
                      <th className={styles.tableHeader}>Description</th>
                      <th className={styles.tableHeaderCenter}>QTY</th>
                      <th className={styles.tableHeaderCenter}>Units</th>
                      <th className={styles.tableHeaderCenter}>Rate/Unit</th>
                      <th className={styles.tableHeaderCenter}>Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.length > 0 ? (
                      formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className={styles.tableCell}>{item.srNo}</td>
                          <td className={styles.tableCell}>
                          {item.partNumber}
                          </td>
                          <td className={styles.tableCell}>
                          {item.description}
                          </td>
                          <td className={styles.tableCellCenter}>
                          {item.requiredQty}
                          </td>
                          <td className={styles.tableCellCenter}>
                            <input
                              type="text"
                              className={styles.inputField}
                              value={item.units}
                              onChange={(e) => {
                                validateDataType(e, "A");
                                handleItemChange(index, 'units', e.target.value);
                              }}
                            />
                          </td>
                          <td className={styles.tableCellCenter}>
                            <input
                              type="text"
                              className={styles.inputField}
                              value={item.rate}
                              onChange={(e) => {
                                validateDataType(e, "N");
                                handleItemChange(index, 'rate', e.target.value);
                              }}
                            />
                          </td>
                          <td className={styles.tableCellCenter}>
                            {(item.gross || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No items available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Section */}
              <div className={styles.footerSection}>
                <div className={styles.footerLeft}>
                  <div className={styles.legalText}>
                    <div className={styles.legalTitle}>JURISDICTION OF COURTS:</div>
                    <p>All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City and it is the distinct condition of the order that no suit or action for the purpose of enforcing any claim in respect of the order shall be instituted in any Court other than that situated in Mumbai City, Maharashtra State, India i.e. courts in Mumbai shall alone have jurisdiction to decide upon any dispute arising out of or in Respect of the contract.</p>
                  </div>
                  <div className={styles.termsSection}>
                    <div className={styles.termsTitle}>TERMS AND CONDITION:</div>
                    <div className={styles.termsGrid}>
                      <div>Incoterm:</div>
                      <div>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={formData.incoterm}
                          onChange={(e) => {
                            validateDataType(e, "ANS");
                            handleChange('incoterm', e.target.value);
                          }}
                        />
                      </div>
                      <div>Currency:</div>
                      <div>
                        <select
                          className={styles.inputField}
                          value={formData.currency}
                          onChange={(e) => handleChange('currency', e.target.value)}
                        >
                          <option value="">Select Currency</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="EURO">EURO</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>
                      <div>Forwarder:</div>
                      <div>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={formData.forwarder}
                          onChange={(e) => {
                            validateDataType(e, "A");
                            handleChange('forwarder', e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.totalSection}>
                  <table className={styles.totalTable}>
                    <tbody>
                      <tr>
                        <td className={styles.totalLabel}>Gross</td>
                        <td className={styles.totalValue}>
                          {calculateSubtotal().toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>P&F</td>
                        <td className={styles.totalValue}>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.inputField}
                            value={formData.pf}
                            onChange={(e) => {
                              const validatedValue = validateDataType(e, "N");
                              handleNumberChange('pf', validatedValue);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>Transportation</td>
                        <td className={styles.totalValue}>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.inputField}
                            value={formData.transportation}
                            onChange={(e) => {
                              const validatedValue = validateDataType(e, "N");
                              handleNumberChange('transportation', validatedValue);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>Insurance</td>
                        <td className={styles.totalValue}>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.inputField}
                            value={formData.insurance}
                            onChange={(e) => {
                              const validatedValue = validateDataType(e, "N");
                              handleNumberChange('insurance', validatedValue);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>Other Charges</td>
                        <td className={styles.totalValue}>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.inputField}
                            value={formData.other_Charges}
                            onChange={(e) => {
                              const validatedValue = validateDataType(e, "N");
                              handleNumberChange('other_Charges', validatedValue);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>Total</td>
                        <td className={styles.totalValue}>
                          {calculateTotal().toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>
                          <div className={styles.taxInputContainer}>
                            <span>SGST @ </span>
                            <input
                              type="number"
                              step="0.01"
                              className={styles.taxRateInput}
                              value={formData.sgst}
                              onChange={(e) => {
                                const validatedValue = validateDataType(e, "N");
                                handleTaxChange('sgst', validatedValue);
                              }}
                            />
                            <span>%</span>
                          </div>
                        </td>
                        <td className={styles.totalValue}>
                          {getTaxAmount('sgst').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>
                          <div className={styles.taxInputContainer}>
                            <span>CGST @ </span>
                            <input
                              type="number"
                              step="0.01"
                              className={styles.taxRateInput}
                              value={formData.cgst}
                              onChange={(e) => {
                                const validatedValue = validateDataType(e, "N");
                                handleTaxChange('cgst', validatedValue);
                              }}
                            />
                            <span>%</span>
                          </div>
                        </td>
                        <td className={styles.totalValue}>
                          {getTaxAmount('cgst').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>
                          <div className={styles.taxInputContainer}>
                            <span>IGST @ </span>
                            <input
                              type="number"
                              step="0.01" 
                              className={styles.taxRateInput}
                              value={formData.igst}
                              onChange={(e) => {
                                const validatedValue = validateDataType(e, "N");
                                handleTaxChange('igst', validatedValue);
                              }}
                            />
                            <span>%</span>
                          </div>
                        </td>
                        <td className={styles.totalValue}>
                          {getTaxAmount('igst').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.totalLabel}>Grand Total</td>
                        <td className={styles.totalValue}>
                          {calculateGrandTotal().toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className={styles.signature}>
                    <div className={styles.signatureTitle}>FOR AMC TECHNOLOGY</div>
                    <div className={styles.signatureSpace}>
                      <div className={styles.signatureTitle}>Authorised Signatory</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className={styles.formFooter}>
                <p>Form: AMC-32</p>
                <p>Rev:00</p>
                <p>Date: Jan 2021</p>
              </div>

              {/* Save Button */}
              <div className={styles.saveButtonContainer}>
                <button
                  onClick={handleSubmit}
                  className={styles.saveButton}
                >
                  <Save size={18} className={styles.saveIcon} />
                  Update Purchase Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditPurchaseOrder;