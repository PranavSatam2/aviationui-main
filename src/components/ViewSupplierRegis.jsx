import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { deleteSupplier, getSupplierDetail, listAllSupplier } from "../services/db_manager";
import MyModalComponent from "./partials/MyModalComponent";
import { useNavigate } from "react-router-dom";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const ViewSupplierRegis = () => {
    // State
    const [tableData, setTableData] = useState([]);  // Store data
    const navigate = useNavigate();
    const modalRef = useRef();                      // Modal reference

    // Fetching data when the component is mounted
    useEffect(() => {
        listAllSupplier().then(response => { 
            if (response) {
                setTableData(response); // Update state with response data
            }
        }).catch(error => {
            console.log("Error fetching data", error);
        });
    }, []);

    // Apply dataTable utility after data is loaded from backend
    useEffect(() => {
        if (tableData.length > 0) {
            $('#dataTable').DataTable(); 
        }
    }, [tableData]);

    // Delete the selected supplier
    async function deleteSelectedElement(elementId) {
        if (elementId !== '') {
            let response = await deleteSupplier(elementId);
            if (response) {
                window.location.reload();
            }
        }
    }

    // Edit the selected supplier
    async function editSelectedElement(elementId) {
        if (elementId !== '') {
            try {
                let supplierId = elementId;
                let supplierData = await getSupplierDetail(elementId);
                supplierData = supplierData.data;
                if (supplierId !== null) {
                    navigate('/SupplierRegistration', { state: { supplierId, supplierData } });
                }
            } catch (error) {
                console.error("Error fetching supplier details: ", error);
            }
        }
    }

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="content">
                <Header />
                {/* Content heading */}
                <div className="col-md-6">
                    <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-4">
                        <h5 className="h5 mx-3 mb-0 text-gray-800">View Supplier Registration</h5>
                    </div>
                </div>

                {/* Content Body */}
                <div className="card border border-dark shadow mx-4 my-4 p-2" style={{ height: '500px' }}>
                    <div className="col-md-12">
                        <div className="table-responsive overflow-auto px-0 mt-4" style={{width : '100%'}}>
                            <table id="dataTable" className="table border" style={{ width: "100%", cellspacing: "0", tableLayout: "fixed" }}>
                                <thead className="position-sticky sticky-top bg-light">
                                    <tr>
                                      <th style={{ width: "35px" }}>Form ID</th>
                                    <th style={{ width: "200px" }}>Supplier Name</th>
                                    <th>Address</th>
                                    <th>Number</th>
                                    <th>Fax</th>
                                    <th>Email Id</th>
                                    <th>Quality Manager</th>
                                    <th>QM Number</th>
                                    <th>QM Email</th>
                                    <th>Sale Rep</th>
                                    <th>S Number</th>
                                    <th>S Email</th>
                                    <th>Core Product</th>
                                    <th>Action</th>
                                 </tr>
                                </thead>
                                <tbody className="overflow-auto w-100">
                                    {tableData && tableData.length > 0 ? tableData.map((supplier) => (
                                        <tr key={supplier.formId}>
                                            <td>{supplier.formId}</td>
                                            <td>{supplier.supplierName}</td>
                                            <td>{supplier.address}</td>
                                            <td>{supplier.phoneNumber}</td>
                                            <td>{supplier.fax}</td>
                                            <td>{supplier.emailId}</td>
                                            <td>{supplier.qualityManagerName}</td>
                                            <td>{supplier.qualityManagerPhoneNumber}</td>
                                            <td>{supplier.qualityManagerEmailId}</td>
                                            <td>{supplier.salesRepresentativeName}</td>
                                            <td>{supplier.salePhoneNumber}</td>
                                            <td>{supplier.saleEmailId}</td>
                                            <td>{supplier.coreProducts}</td>
                                            <td>
                                                <span className="ms-1 text-danger" onClick={() => deleteSelectedElement(`${supplier.formId}`)}><i className="fa-solid fa-trash"></i></span>
                                                <span className="mx-1 text-primary" onClick={() => editSelectedElement(`${supplier.formId}`)}><i className="fa-solid fa-pen-to-square"></i></span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="14" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <MyModalComponent ref={modalRef} modalTitle="My Custom Modal Title" modalBodyContent="This is a custom body for the modal." buttonLabel="Open Modal" />
                <Footer />
            </div>
        </div>
    );
};

export default ViewSupplierRegis;
