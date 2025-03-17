import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { deleteStore, getStoreDetail, listAllStore } from "../services/db_manager";
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
        listAllStore().then(response => { 
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
            let response = await deleteStore(elementId);
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
                let supplierData = await getStoreDetail(elementId);
                supplierData = supplierData.data;
                if (supplierId !== null) {
                    navigate('/storeAcceptance', { state: { storeId, storeData } });
                }
            } catch (error) {
                console.error("Error fetching store details: ", error);
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
                        <h5 className="h5 mx-3 mb-0 text-gray-800">View Store Acceptance</h5>
                    </div>
                </div>

                {/* Content Body */}
                <div className="card border border-dark shadow mx-4 my-4 p-2" style={{ height: '500px' }}>
                    <div className="col-md-12">
                        <div className="table-responsive overflow-auto px-0 mt-4" style={{width : '100%'}}>
                            <table id="dataTable" className="table border" style={{ width: "100%", cellspacing: "0", tableLayout: "fixed" }}>
                                <thead className="position-sticky sticky-top bg-light">
                                    <tr>
                                        <th style={{ width: "80px" }}>Part Num</th>
                                        <th style={{ width: "200px" }}>Description</th>
                                        <th>Batch</th>
                                        <th>Supplier</th>
                                        <th>Quantity</th>
                                        <th>DOM</th>
                                        <th>DOE</th>
                                        <th>Recipt Date</th>
                                        <th>Quality Inspector</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="overflow-auto w-100">
                                    {tableData && tableData.length > 0 ? tableData.map((store) => (
                                        <tr key={store.partNum}>
                                            <td>{store.partNum}</td>
                                            <td>{store.description}</td>
                                            <td>{store.batch}</td>
                                            <td>{store.supplier}</td>
                                            <td>{store.quantity}</td>
                                            <td>{store.dom}</td>
                                            <td>{store.doe}</td>
                                            <td>{store.dateOfRecipet}</td>
                                            <td>{store.nameOfQualityInsp}</td>
                                            <td>
                                            <span className="ms-1 text-danger" onClick={()=> deleteSelectedElement(`${store.partNum}`)}><i className="fa-solid fa-trash"></i></span>
                                            <span className="mx-1 text-primary" onClick={()=> editSelectedElement(`${store.partNum}`)}><i className="fa-solid fa-pen-to-square"></i></span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="10" className="text-center">No data available</td>
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
