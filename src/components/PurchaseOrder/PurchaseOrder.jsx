// import { useEffect, useState } from 'react';
// import { Search } from 'lucide-react';
// import styles from './Purchase.module.css';
// import { GetAllDataUsingBatchNo } from '../../services/db_manager';

// export default function PurchaseOrderForm() {
//   const [batchNo, setBatchNo] = useState('');
//   const [formData, setFormData] = useState({
//     poNo: 'AMC/PO/21/04',
//     poDate: '21/01/2021',
//     reference: '',
//     items: [],
//     pAndF: 0,
//     transportation: 0,
//     insurance: 0,
//     otherCharges: 0
//   });
//   const [form, setForm] = useState({
//     srNo: "",
//     partNumber: "",
//     description: "",
//     currentStock: "",
//     requiredQty: "",
//     units: "",
//     rate: 0,
//   });

//   // Calculate gross amount whenever requiredQty or rate changes
//   useEffect(() => {
//     if (form.requiredQty && form.rate) {
//       const updatedForm = {
//         ...form,
//         gross: calculateGross(form.requiredQty, form.rate)
//       };
//       setForm(updatedForm);
//     }
//   }, [form.requiredQty, form.rate]);

//   const handleSearch = async () => {
//     try {
//       const response = await GetAllDataUsingBatchNo(batchNo);
//       console.log(response[0], "response");
//       if (response && response[0]) {
//         // Initialize with default values for editable fields if not present
//         setForm({
//           ...response[0],
//           units: response[0].units || "",
//           rate: response[0].rate || 0,
//           requiredQty: response[0].requiredQty || 0
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching purchase requisitions", error);
//     }
//   };

//   const handleFormChange = (field, value) => {
//     // Convert value to number if applicable
//     let numValue = value;
//     if (field === 'requiredQty' || field === 'rate') {
//       numValue = parseFloat(value) || 0;
//     }

//     setForm({
//       ...form,
//       [field]: numValue,
//     });
//   };

//   const handleAdditionalChargeChange = (field, value) => {
//     const numValue = parseFloat(value) || 0;
//     setFormData({
//       ...formData,
//       [field]: numValue
//     });
//   };

//   const calculateGross = (qty, rate) => {
//     return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
//   };

//   const calculateSubtotal = () => {
//     return calculateGross(form.requiredQty, form.rate);
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() +
//            formData.pAndF +
//            formData.transportation +
//            formData.insurance +
//            formData.otherCharges;
//   };

//   const calculateTax = (rate) => {
//     return calculateTotal() * (rate / 100);
//   };

//   const calculateGrandTotal = () => {
//     return calculateTotal() + calculateTax(18) + calculateTax(9) + calculateTax(9);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1 className={styles.headerTitle}>PURCHASE ORDER</h1>
//       </div>

//       {/* Search Section */}
//       <div className={styles.searchSection}>
//         <div className={styles.searchInputContainer}>
//           <label className={styles.searchLabel}>Batch Number</label>
//           <input
//             type="text"
//             className={styles.searchInput}
//             value={batchNo}
//             onChange={(e) => setBatchNo(e.target.value)}
//             placeholder="Enter Batch Number"
//           />
//         </div>
//         <div className={styles.searchButtonContainer}>
//           <button
//             onClick={handleSearch}
//             className={styles.searchButton}
//           >
//             <Search size={18} className={styles.searchIcon} />
//             Search
//           </button>
//         </div>
//       </div>

//      {batchNo && <div className={styles.formContainer}>
//         {/* Company Section */}
//         <div className={styles.companySection}>
//           <div className={styles.companyInfo}>
//             <div className={styles.companyLogo}>
//               <img src="/api/placeholder/100/50" alt="AMC Technology Logo" className={styles.logoImage} />
//               <div>
//                 <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
//                 <p className={styles.companyAddress}>105, Hiday Industrial Estate, Hira Industrial Park</p>
//                 <p className={styles.companyAddress}>Off Western Express Highway, Vasai Phata,</p>
//                 <p className={styles.companyAddress}>Vasai (East) Dist - Palghar, 401208</p>
//                 <p className={styles.companyAddress}>GST NO: 27ABTPS4731Z1ZA</p>
//               </div>
//             </div>
//           </div>
//           <div className={styles.orderInfoSection}>
//             <div className={styles.orderInfoGrid}>
//               <div className={styles.orderInfoLabel}>P.O. No.:</div>
//               <div>{formData.poNo}</div>
//               <div className={styles.orderInfoLabel}>P.O. Date:</div>
//               <div>{formData.poDate}</div>
//               <div className={styles.orderInfoLabel}>Our Reference:</div>
//               <div>{formData.reference}</div>
//               <div className={styles.orderInfoLabel}>Your Reference:</div>
//               <div>{formData.reference}</div>
//               <div className={styles.orderInfoLabel}>Delivery:</div>
//               <div>E</div>
//             </div>
//           </div>
//         </div>

//         {/* Address Section */}
//         <div className={styles.addressSection}>
//           <div className={styles.addressBox}>
//             <div className={styles.addressContainer}>
//               <div className={styles.addressTitle}>To,</div>
//               <div className={styles.addressText}>E</div>
//             </div>
//           </div>
//           <div className={styles.deliveryBox}>
//             <div className={styles.addressContainer}>
//               <div className={styles.addressTitle}>Delivery Address:</div>
//               <div className={styles.addressText}>
//                 AMC TECHNOLOGY<br />
//                 105, Hiday Industrial Estate, Hira Industrial Park<br />
//                 Off Western Express Highway, Vasai Phata,<br />
//                 Vasai (East) Dist - Palghar, 401208
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Payment Terms */}
//         <div className={styles.paymentTerms}>
//           <div className={styles.paymentContainer}>
//             <div className={styles.paymentTitle}>Payment Terms:</div>
//             <div className={styles.paymentText}>E</div>
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr className={styles.tableHead}>
//                 <th className={styles.tableHeader}>P_REQ_No</th>
//                 <th className={styles.tableHeader}>Part Number</th>
//                 <th className={styles.tableHeader}>Description</th>
//                 <th className={styles.tableHeaderCenter}>QTY</th>
//                 <th className={styles.tableHeaderCenter}>Units</th>
//                 <th className={styles.tableHeaderCenter}>Rate/Unit</th>
//                 <th className={styles.tableHeaderCenter}>Gross</th>
//               </tr>
//             </thead>
//             <tbody>
//               {form && form.srNo ? (
//                 <tr>
//                   <td className={styles.tableCell}>{form.srNo}</td>
//                   <td className={styles.tableCell}>{form.partNumber}</td>
//                   <td className={styles.tableCell}>{form.description}</td>
//                   <td className={styles.tableCellCenter}>{form.requiredQty}</td>
//                   <td className={styles.tableCellCenter}>
//                     <input
//                       type="text"
//                       className={styles.inputField}
//                       value={form.units}
//                       onChange={(e) => handleFormChange('units', e.target.value)}
//                     />
//                   </td>
//                   <td className={styles.tableCellCenter}>
//                     <input
//                       type="number"
//                       className={styles.inputField}
//                       value={form.rate}
//                       onChange={(e) => handleFormChange('rate', e.target.value)}
//                     />
//                   </td>
//                   <td className={styles.tableCellCenter}>
//                     {calculateGross(form.requiredQty, form.rate).toFixed(2)}
//                   </td>
//                 </tr>
//               ) : (
//                 Array(10).fill(0).map((_, index) => (
//                   <tr key={index}>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                     <td className={styles.tableCell}>&nbsp;</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer Section */}
//         <div className={styles.footerSection}>
//           <div className={styles.footerLeft}>
//             <div className={styles.legalText}>
//               <div className={styles.legalTitle}>JURISDICTION OF COURTS:</div>
//               <p>All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City and it is the distinct condition of the order that no suit or action for the purpose of enforcing any claim in respect of the order shall be instituted in any Court other than that situated in Mumbai City, Maharashtra State, India i.e. courts in Mumbai shall alone have jurisdiction to decide upon any dispute arising out of or in Respect of the contract.</p>
//             </div>
//             <div className={styles.termsSection}>
//               <div className={styles.termsTitle}>TERMS AND CONDITION:</div>
//               <div className={styles.termsGrid}>
//                 <div>Incoterm:</div>
//                 <div>Exworks, FOB</div>
//                 <div>Currency:</div>
//                 <div>USD, GBP, EURO, INR</div>
//                 <div>Forwarder:</div>
//                 <div>Text Box</div>
//               </div>
//             </div>
//           </div>
//           <div className={styles.totalSection}>
//             <table className={styles.totalTable}>
//               <tbody>
//                 <tr>
//                   <td className={styles.totalLabel}>Gross</td>
//                   <td className={styles.totalValue}>
//                     {form && form.srNo ? calculateSubtotal().toFixed(2) : ''}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>P&F</td>
//                   <td className={styles.totalValue}>
//                     <input
//                       type="number"
//                       className={styles.inputField}
//                       value={formData.pAndF}
//                       onChange={(e) => handleAdditionalChargeChange('pAndF', e.target.value)}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>Transportation</td>
//                   <td className={styles.totalValue}>
//                     <input
//                       type="number"
//                       className={styles.inputField}
//                       value={formData.transportation}
//                       onChange={(e) => handleAdditionalChargeChange('transportation', e.target.value)}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>Insurance</td>
//                   <td className={styles.totalValue}>
//                     <input
//                       type="number"
//                       className={styles.inputField}
//                       value={formData.insurance}
//                       onChange={(e) => handleAdditionalChargeChange('insurance', e.target.value)}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>Other Charges</td>
//                   <td className={styles.totalValue}>
//                     <input
//                       type="number"
//                       className={styles.inputField}
//                       value={formData.otherCharges}
//                       onChange={(e) => handleAdditionalChargeChange('otherCharges', e.target.value)}
//                     />
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>Total</td>
//                   <td className={styles.totalValue}>
//                     {form && form.srNo ? calculateTotal().toFixed(2) : ''}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>SGST @ 9%</td>
//                   <td className={styles.totalValue}>
//                     {form && form.srNo ? calculateTax(9).toFixed(2) : ''}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>CGST @ 9%</td>
//                   <td className={styles.totalValue}>
//                     {form && form.srNo ? calculateTax(9).toFixed(2) : ''}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>IGST @ 18%</td>
//                   <td className={styles.totalValue}>
//                     {form && form.srNo ? calculateTax(18).toFixed(2) : ''}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.totalLabel}>Grand Total</td>
//                   <td className={styles.totalValue}>
//                     {form && form.srNo ? calculateGrandTotal().toFixed(2) : ''}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             <div className={styles.signature}>
//               <div className={styles.signatureTitle}>FOR AMC TECHNOLOGY</div>
//               <div className={styles.signatureSpace}>
//                 <div className={styles.signatureTitle}>Authorised Signatory</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form Footer */}
//         <div className={styles.formFooter}>
//           <p>Form: AMC-32</p>
//           <p>Rev:00</p>
//           <p>Date: Jan 2021</p>
//         </div>
//       </div>}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Search, Save } from "lucide-react";
import styles from "./Purchase.module.css";
import {
  createPurchaseOrder,
  GetAllDataUsingBatchNo,
  listAllPurchaseRequisition,
} from "../../services/db_manager";
import Sidebar from "../Sidebar";
import Header from "../Header";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import Footer from "../Footer";
import { toast } from "react-toastify";

export default function PurchaseOrderForm() {
  const [batchNo, setBatchNo] = useState("");
  const [orderForm, setOrderForm] = useState(false);

  // State for table data
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    poNo: "PO-2025-001",
    poDate: "2025-04-26",
    ourReference: "OR-12345",
    yourReference: "YR-54321",
    delivery: "Immediate",
    deliveryAddress:
      "AMC TECHNOLOGY\n105, Hiday Industrial Estate, Hira Industrial Park\nOff Western Express Highway, Vasai Phata,\nVasai (East) Dist - Palghar, 401208",
    paymentTerms: "Net 30 Days",
    items: [],
    pf: 0,
    transportation: 0,
    insurance: 0,
    other_Charges: 0,
    incoterm: "FOB Mumbai",
    currency: "",
    forwarder: "BlueDart Logistics",
  });

  // Fetch data for table
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await listAllPurchaseRequisition();
      setTableData(response || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching purchase requisitions", error);
      toast.error("Failed to load purchase requisitions");
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Commented out batch search functionality
  // const handleSearch = async () => {
  //   try {
  //     const response = await GetAllDataUsingBatchNo(batchNo);
  //     // console.log(response, "response");
  //     if (response && response.length > 0) {
  //       // Transform the response into items with additional fields needed for the form
  //       const items = response.map((item) => ({
  //         ...item,
  //         units: item.units || "Nos", // Default to "Nos" if not present
  //         rate: item.rate ,
  //         gross: calculateGross(item.requiredQty || 0, item.rate || 0),
  //       }));

  //       setFormData({
  //         ...formData,
  //         items: items,
  //       });
  //       setOrderForm(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching purchase requisitions", error);
  //   }
  // };

  const handleItemChange = (index, field, value) => {
    // Convert value to number if applicable
    let numValue = value;
    if (field === "requiredQty" || field === "rate") {
      numValue = parseFloat(value) || 0;
    }

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: numValue,
    };

    // Recalculate gross if requiredQty or rate changes
    if (field === "requiredQty" || field === "rate") {
      updatedItems[index].gross = calculateGross(
        field === "requiredQty" ? numValue : updatedItems[index].requiredQty,
        field === "rate" ? numValue : updatedItems[index].rate
      );
    }

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleAdditionalChargeChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData({
      ...formData,
      [field]: numValue,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
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
      formData.pf +
      formData.transportation +
      formData.insurance +
      formData.other_Charges
    );
  };

  const calculateTax = (rate) => {
    return calculateTotal() * (rate / 100);
  };

  const calculateGrandTotal = () => {
    // For this implementation, we'll use the provided tax rates
    // SGST and CGST are both 9%, IGST can be 0% or 18% depending on state
    const sgstAmount = calculateTax(9);
    const cgstAmount = calculateTax(9);
    const igstAmount = 0; // Set to 0 as per the example payload

    return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
  };

  // Search functionality
  const filteredData = tableData.filter((requisition) => {
    return Object.values(requisition).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group data by batch number
  const groupedData = filteredData.reduce((groups, item) => {
    const batchNumber = item.batchNumber || "No Batch";
    if (!groups[batchNumber]) {
      groups[batchNumber] = [];
    }
    groups[batchNumber].push(item);
    return groups;
  }, {});

  // Convert grouped data to array for rendering
  const groupedArray = Object.entries(groupedData).map(
    ([batchNumber, items]) => ({
      batchNumber,
      items,
    })
  );

  // Sorting functionality for grouped data
  const sortedData = [...groupedArray].sort((a, b) => {
    const aValue = a.batchNumber;
    const bValue = b.batchNumber;

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Calculate total items for display
  const totalItems = filteredData.length;

  // Handle batch number click to open order form
  const handleBatchClick = async (batchNumber) => {
    setBatchNo(batchNumber);
    setOrderForm(true);

    try {
      const response = await GetAllDataUsingBatchNo(batchNumber);
      console.log(response, "response for batch:", batchNumber);
      if (response && response.length > 0) {
        // Transform the response into items with additional fields needed for the form
        const items = response.map((item) => ({
          ...item,
          units: item.units || "Nos", // Default to "Nos" if not present
          rate: item.rate || 0,
          gross: calculateGross(item.requiredQty || 0, item.rate || 0),
        }));

        setFormData({
          ...formData,
          items: items,
        });
      } else {
        // If no data found for this batch, show empty form
        setFormData({
          ...formData,
          items: [],
        });
        toast.info(`No data found for batch number: ${batchNumber}`);
      }
    } catch (error) {
      console.error(
        "Error fetching purchase requisitions for batch:",
        batchNumber,
        error
      );
      toast.error(`Failed to load data for batch: ${batchNumber}`);
      setFormData({
        ...formData,
        items: [],
      });
    }
  };

  // Handle closing the order form
  const handleCloseOrderForm = () => {
    setOrderForm(false);
    setBatchNo("");
    setFormData({
      ...formData,
      items: [],
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  // Column definitions for the table
  const columns = [
    { field: "batchNumber", label: "Batch Number", width: "200px" },
    { field: "id", label: "P_REQ_No", width: "100px" },
    { field: "partNumber", label: "Part Number", width: "130px" },
    { field: "description", label: "Description", width: "130px" },
    { field: "currentStock", label: "Current Stock", width: "70px" },
    { field: "requiredQty", label: "Required Qty", width: "70px" },
    { field: "requiredDate", label: "Required Date", width: "150px" },
    { field: "remark", label: "Remark", width: "100px" },
    {
      field: "unitOfMeasurement",
      label: "Unit of Measurement",
      width: "150px",
    },
  ];

  const handleSave = async () => {
    try {
      // If no items are loaded, show error
      if (formData.items.length === 0) {
        alert("Please search for a batch number first to load items.");
        return;
      }

      // Use the first item for the unit, rate and gross values
      // as the new API expects single values instead of arrays
      const firstItem = formData.items[0];

      // Prepare the payload according to the new structure
      const payload = {
        // Required fields
        batchNumber: batchNo,
        poNumber: formData.poNo,
        poDate: formData.poDate,
        ourReference: formData.ourReference,
        yourReference: formData.yourReference,
        delivery: formData.delivery,
        deliveryAddress: formData.deliveryAddress,
        paymentTerms: formData.paymentTerms,

        // Use the first item's values as per the new API requirements
        unit: firstItem.units,
        ratePerUnit: firstItem.rate,
        grossAmount: calculateSubtotal(),

        // Taxes & Totals
        sgst: 9.0,
        cgst: 9.0,
        igst: 18.0,
        total: calculateTotal(),
        grandTotal: calculateGrandTotal(),

        // Additional charges - using the new naming convention
        pf: formData.pf,
        transportation: formData.transportation,
        other_Charges: formData.other_Charges,
        insurance: formData.insurance,

        // Other Info
        termsAndConditions:
          "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...",
        incoterm: formData.incoterm,
        currency: formData.currency,
        forwarder: formData.forwarder,
      };

      console.log("Saving purchase order:", payload);

      // Call the API to save the data
      const responce = await createPurchaseOrder(payload);
      if (responce) {
        toast.success("Purchase Order saved successfully!");
      }
      // alert("Purchase Order saved successfully!");
    } catch (error) {
      toast.error(
        "Purchase order already saved or Error for saving Purchase Order."
      );
      // console.error("Error saving purchase order:", error);
      // alert("Error saving Purchase Order. Please try again.");
    }
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb
              breadcrumbsLabel="Purchase Order"
              // isBack={true}
            />
            <div className={styles.container}>
              {/* <div className={styles.header}>
              <h1 className={styles.headerTitle}>PURCHASE ORDER</h1>
            </div> */}

              {/* Commented out Search Section */}
              {/* <div className={styles.searchSection}>
              <div className={styles.searchInputContainer}>
                <label className={styles.searchLabel}>Batch Number</label>
                <input
                  type="text"
                  className={styles.searchInput}
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  placeholder="Enter Batch Number"
                />
              </div>
              <div className={styles.searchButtonContainer}>
                <button onClick={handleSearch} className={styles.searchButton}>
                  <Search size={18} className={styles.searchIcon} />
                  Search
                </button>
              </div>
            </div> */}

              {/* Purchase Requisitions Table */}
              <div
                className={[
                  "normalView",
                  "card border-0 shadow-lg  rounded-3",
                ].join(" ")}
              >
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="input-group">
                        <span className="input-group-text bg-primary text-white border-0">
                          <i className="fa fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          placeholder="Search requisitions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 ms-auto">
                      <div className="d-flex align-items-center justify-content-end">
                        <label className="me-2 text-muted fw-light">Show</label>
                        <select
                          className="form-select form-select-sm w-auto"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <label className="ms-2 text-muted fw-light">
                          entries
                        </label>
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <p className="mt-2 text-muted">Loading data...</p>
                    </div>
                  ) : (
                    <div
                      className="table-responsive"
                      style={{
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#ccc transparent",
                      }}
                    >
                      <table className="table table-hover table-striped align-middle">
                        <thead>
                          <tr className="bg-light">
                            {columns.map((column) => (
                              <th
                                key={column.field}
                                className="position-sticky top-0 bg-light py-3"
                                onClick={() => handleSort(column.field)}
                                style={{
                                  cursor: "pointer",
                                  width: column.width || "auto",
                                  fontSize: "0.9rem",
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <span>{column.label}</span>
                                  {sortField === column.field ? (
                                    <i
                                      className={`ms-1 fa fa-sort-${
                                        sortDirection === "asc" ? "up" : "down"
                                      } text-primary`}
                                    ></i>
                                  ) : (
                                    <i
                                      className="ms-1 fa fa-sort text-muted opacity-50"
                                      style={{ fontSize: "0.8rem" }}
                                    ></i>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length > 0 ? (
                            currentItems.map((group, groupIndex) => (
                              <React.Fragment key={group.batchNumber}>
                                {group.items.map((requisition, itemIndex) => (
                                  <tr
                                    key={`${group.batchNumber}-${requisition.id}`}
                                    className={
                                      (groupIndex + itemIndex) % 2 === 0
                                        ? "bg-white"
                                        : "bg-light bg-opacity-50"
                                    }
                                  >
                                    {columns.map((column) => (
                                      <td
                                        key={`${requisition.id}-${column.field}`}
                                        className="text-nowrap py-3"
                                        style={{
                                          maxWidth: "150px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={requisition[column.field]}
                                      >
                                        {column.field === "batchNumber" ? (
                                          itemIndex === 0 ? (
                                            <button
                                              className="btn btn-link p-0 text-primary fw-bold"
                                              onClick={() =>
                                                handleBatchClick(
                                                  group.batchNumber
                                                )
                                              }
                                              style={{
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {group.batchNumber}
                                            </button>
                                          ) : (
                                            <div
                                              style={{ height: "20px" }}
                                            ></div>
                                          )
                                        ) : (
                                          requisition[column.field]
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                                {/* Add spacing between different batch groups */}
                                {groupIndex < currentItems.length - 1 && (
                                  <tr>
                                    <td
                                      colSpan={columns.length}
                                      style={{ height: "10px", padding: "0" }}
                                    ></td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={columns.length + 1}
                                className="text-center py-5"
                              >
                                {searchTerm ? (
                                  <div>
                                    <i className="fa fa-search fa-2x text-muted mb-3"></i>
                                    <p className="mb-0">
                                      No matching records found
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <i className="fa fa-database fa-2x text-muted mb-3"></i>
                                    <p className="mb-0">No data available</p>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="row mt-4 align-items-center">
                    <div className="col-md-6">
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Showing{" "}
                        <span className="fw-bold text-dark">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="fw-bold text-dark">
                          {Math.min(indexOfLastItem, sortedData.length)}
                        </span>{" "}
                        of{" "}
                        <span className="fw-bold text-dark">
                          {sortedData.length}
                        </span>{" "}
                        batch groups
                        {searchTerm &&
                          ` (filtered from ${
                            Object.keys(groupedData).length
                          } total batch groups)`}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-end mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(1)}
                              aria-label="First page"
                            >
                              <i className="fa-solid fa-angles-left"></i>
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              aria-label="Previous page"
                            >
                              <i className="fa-solid fa-angle-left"></i>
                            </button>
                          </li>

                          {renderPageNumbers()}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              aria-label="Next page"
                            >
                              <i className="fa-solid fa-angle-right"></i>
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(totalPages)}
                              aria-label="Last page"
                            >
                              <i className="fa-solid fa-angles-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Form - opens when batch number is clicked */}
              {orderForm && (
                <div className={styles.formContainer}>
                  {/* Close button */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Purchase Order - Batch: {batchNo}</h4>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleCloseOrderForm}
                    >
                      <i className="fa fa-times me-2"></i>
                      Close Form
                    </button>
                  </div>
                  {/* Company Section */}
                  <div className={styles.companySection}>
                    <div className={styles.companyInfo}>
                      <div className={styles.companyLogo}>
                        <img
                          src="/api/placeholder/100/50"
                          alt="AMC Technology Logo"
                          className={styles.logoImage}
                        />
                        <div>
                          <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
                          <p className={styles.companyAddress}>
                            105, Hiday Industrial Estate, Hira Industrial Park
                          </p>
                          <p className={styles.companyAddress}>
                            Off Western Express Highway, Vasai Phata,
                          </p>
                          <p className={styles.companyAddress}>
                            Vasai (East) Dist - Palghar, 401208
                          </p>
                          <p className={styles.companyAddress}>
                            GST NO: 27ABTPS4731Z1ZA
                          </p>
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
                            onChange={(e) =>
                              handleInputChange("poNo", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>P.O. Date:</div>
                        <div>
                          <input
                            type="date"
                            className={styles.inputField}
                            value={formData.poDate}
                            onChange={(e) =>
                              handleInputChange("poDate", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>
                          Our Reference:
                        </div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.ourReference}
                            onChange={(e) =>
                              handleInputChange("ourReference", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>
                          Your Reference:
                        </div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.yourReference}
                            onChange={(e) =>
                              handleInputChange("yourReference", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>Delivery:</div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.delivery}
                            onChange={(e) =>
                              handleInputChange("delivery", e.target.value)
                            }
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
                            onChange={(e) =>
                              handleInputChange(
                                "deliveryAddress",
                                e.target.value
                              )
                            }
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.deliveryBox}>
                      <div className={styles.addressContainer}>
                        <div className={styles.addressTitle}>
                          Delivery Address:
                        </div>
                        <div className={styles.addressText}>
                          AMC TECHNOLOGY
                          <br />
                          105, Hiday Industrial Estate, Hira Industrial Park
                          <br />
                          Off Western Express Highway, Vasai Phata,
                          <br />
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
                          onChange={(e) =>
                            handleInputChange("paymentTerms", e.target.value)
                          }
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr className={styles.tableHead}>
                          <th className={styles.tableHeader}>P_REQ_No</th>
                          <th className={styles.tableHeader}>Part Number</th>
                          <th className={styles.tableHeader}>Description</th>
                          <th className={styles.tableHeaderCenter}>QTY</th>
                          <th className={styles.tableHeaderCenter}>Units</th>
                          <th className={styles.tableHeaderCenter}>
                            Rate/Unit
                          </th>
                          <th className={styles.tableHeaderCenter}>Gross</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.length > 0
                          ? formData.items.map((item, index) => (
                              <tr key={index}>
                                <td className={styles.tableCell}>{item.id}</td>
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
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "units",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className={styles.tableCellCenter}>
                                  <input
                                    type="number"
                                    className={styles.inputField}
                                    value={item.rate}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "rate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className={styles.tableCellCenter}>
                                  {(item.gross || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          : // Empty rows when no items are present
                            Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <tr key={index}>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                </tr>
                              ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Section */}
                  <div className={styles.footerSection}>
                    <div className={styles.footerLeft}>
                      <div className={styles.legalText}>
                        <div className={styles.legalTitle}>
                          JURISDICTION OF COURTS:
                        </div>
                        <p>
                          All contracts shall be deemed to have been wholly made
                          in Mumbai and all claims thereunder are payable in
                          Mumbai City and it is the distinct condition of the
                          order that no suit or action for the purpose of
                          enforcing any claim in respect of the order shall be
                          instituted in any Court other than that situated in
                          Mumbai City, Maharashtra State, India i.e. courts in
                          Mumbai shall alone have jurisdiction to decide upon
                          any dispute arising out of or in Respect of the
                          contract.
                        </p>
                      </div>
                      <div className={styles.termsSection}>
                        <div className={styles.termsTitle}>
                          TERMS AND CONDITION:
                        </div>
                        <div className={styles.termsGrid}>
                          <div>Incoterm:</div>
                          <div>
                            <input
                              type="text"
                              className={styles.inputField}
                              value={formData.incoterm}
                              onChange={(e) =>
                                handleInputChange("incoterm", e.target.value)
                              }
                            />
                          </div>
                          <div>Currency:</div>
                          <div>
                            <select
                              className={styles.inputField}
                              value={formData.currency}
                              onChange={(e) =>
                                handleInputChange("currency", e.target.value)
                              }
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
                              onChange={(e) =>
                                handleInputChange("forwarder", e.target.value)
                              }
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
                              {formData.items.length > 0
                                ? calculateSubtotal().toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>P&F</td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                className={styles.inputField}
                                value={formData.pf}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "pf",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>
                              Transportation
                            </td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                className={styles.inputField}
                                value={formData.transportation}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "transportation",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Insurance</td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                className={styles.inputField}
                                value={formData.insurance}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "insurance",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Other Charges</td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                className={styles.inputField}
                                value={formData.other_Charges}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "other_Charges",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Total</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTotal().toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>SGST @ 9%</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(9).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>CGST @ 9%</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(9).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>IGST @ 18%</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(18).toFixed(2)
                                : ""}
                              {/* Set to 0 as per example */}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Grand Total</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateGrandTotal().toFixed(2)
                                : ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className={styles.signature}>
                        <div className={styles.signatureTitle}>
                          FOR AMC TECHNOLOGY
                        </div>
                        <div className={styles.signatureSpace}>
                          <div className={styles.signatureTitle}>
                            Authorised Signatory
                          </div>
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
                    <button onClick={handleSave} className={styles.saveButton}>
                      <Save size={18} className={styles.saveIcon} />
                      Save Purchase Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
