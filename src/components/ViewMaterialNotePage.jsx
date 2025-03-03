import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { listAllMaterials, deleteMaterial, getMaterialDetail } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net';

const ViewMaterialPage = () => {
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const dataTableInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await listAllMaterials();
                console.log("API Response:", response);  // Debug log
                setTableData(response.data || []); 
                //setTableData(response || []);
            } catch (error) {
                console.error("Error fetching materials", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Current table data:", tableData);  // Debug log

        if (tableData.length > 0) {
            if (dataTableInstance.current) {
                console.log("Destroying existing DataTable");
                dataTableInstance.current.destroy();
            }

            setTimeout(() => {
                if (tableRef.current) {
                    console.log("Initializing DataTable");
                    dataTableInstance.current = $(tableRef.current).DataTable({
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true,
                        destroy: true
                    });
                } else {
                    console.error("TableRef is null, DataTable cannot initialize.");
                }
            }, 100);  // Add slight delay to ensure table is in DOM
        }
    }, [tableData]);

    const deleteSelectedElement = async (materialId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteMaterial(materialId);
    
                // Directly remove the deleted record from tableData
                setTableData((prevData) =>
                    prevData.filter((material) => material.materialId !== materialId)
                );
    
                alert("Record deleted successfully!");
            } catch (error) {
                console.error("Failed to delete material", error);
                alert("Failed to delete material. Please try again.");
            }
        }
    };
    
    
    
    // const deleteSelectedElement = async (materialId) => {
    //     if (window.confirm("Are you sure you want to delete this item?")) {
    //         try {
    //             await deleteMaterial(materialId);
    
    //             // Directly filter out the deleted material from tableData
    //             setTableData(prevData => prevData.filter(material => material.materialId !== materialId));
    
    //         } catch (error) {
    //             console.error("Failed to delete material", error);
    //             alert("Failed to delete material. Please try again.");
    //         }
    //     }
    // };
    
    const editSelectedElement = async (materialId) => {
        try {
            const response = await getMaterialDetail(materialId);
            const materialData = response?.data;
            

            if (materialData) {
                navigate('/MaterialPage', { state: { materialId, materialData } });
            }
        } catch (error) {
            console.error("Error fetching material details: ", error);
        }
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="content">
                <Header />
                <div className="col-md-6">
                    <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-4">
                        <h5 className="h5 mx-3 mb-0 text-gray-800">View Material Records</h5>
                    </div>
                </div>

                <div className="card border border-dark shadow mx-4 my-4 p-2" style={{ height: '500px' }}>
                    <div className="col-md-12">
                        <div className="table-responsive overflow-auto px-0 mt-4" style={{ width: '100%' }}>
                            <table ref={tableRef} className="table border" style={{ width: "100%", tableLayout: "fixed" }}>
                                <thead className="position-sticky sticky-top bg-light">
                                    <tr>
                                        <th>Material Id</th>
                                        <th>MRN No</th>
                                        <th>Part No</th>
                                        <th>Description</th>
                                        <th>Supplier</th>
                                        <th>Order No</th>
                                        <th>Challan No</th>
                                        <th>Receipt Date</th>
                                        <th>Quantity</th>
                                        <th>Store Incharge</th>
                                        <th>Quality Acceptance</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.length > 0 ? (
                                        tableData.map((material) => (
                                            <tr key={material.materialId}>
                                                <td>{material.materialId}</td>
                                                <td>{material.mrnNo}</td>
                                                <td>{material.partNumber}</td>
                                                <td>{material.partDescription}</td>
                                                <td>{material.supplierName}</td>
                                                <td>{material.orderNumber}</td>
                                                <td>{material.challanNo}</td>
                                                <td>{material.receiptDate}</td>
                                                <td>{material.quantity}</td>
                                                <td>{material.storeInchargeSign}</td>
                                                <td>{material.qualityAcceptance}</td>
                                                <td>
                                                    <span className="ms-1 text-danger" onClick={() => deleteSelectedElement(material.materialId)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </span>
                                                    <span className="mx-1 text-primary" onClick={() => editSelectedElement(material.materialId)}>
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default ViewMaterialPage;
