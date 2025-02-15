import { useEffect, useRef, useState } from "react";
import Footer from "./Footer"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStore, getStoreDetail, listAllStore } from "../services/db_manager";

const ViewStoreAcc = () =>
{
    // Variable
    const [tableData, setTableData] = useState([{}]);  // State to store data
    const navigate = useNavigate();
    const modalRef = useRef();                      // Create a reference to the modal component


    // ########################### HOOKS ##############################

    // This function is used to display part num list reposne
        useEffect(() => 
        {
            debugger
            listAllStore().then(response => 
            { 
                let data = response
                if ( data )
                {
                    setTableData(response); // Set the data into state
                }
            }).catch(error => 
            {
                console.log("Error fetching data");
            });
        }, []);

    // ########################### FUNCTION ############################

    // This function delete the selected element
    async function deleteSelectedElement(elementId)
    {
        // Code for delete modal
        if ( elementId !== '' )
        {
            let response = await deleteStore(elementId)
            if ( response )
            {
                window.location.reload();
            }
        }
    }

    // Function to edit the selected element
    async function editSelectedElement(elementId) 
    {
        if (elementId !== '') 
            {
            try 
            {
                let storeId = elementId
                let storeData = await getStoreDetail(elementId);
                storeData = storeData.data
                if (storeId !== null) 
                {
                    navigate('/storeAcceptance', { state: { storeId, storeData } });         // Now, navigate and pass the resolved data as state
                }
            } 
            catch (error) 
            {
                console.error("Error fetching Store details: ", error);
            }
        }
    }


    // ############################ RETURN-COMPONENT ########################

    return (
        // Page Wrapper
        <div className="wrapper ">
            <Sidebar/>
      
            <div className="content">
                <Header />
                {/* conetnt Begin*/}

                {/* Content heading */}
                <div className="col-md-6">
                    <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-4">
                        <h5 className="h5 mx-3 mb-0 text-gray-800">View Store Acceptance</h5>
                    </div>
                </div>

                {/* Content Body */}
                <div className="card border border-dark shadow mx-4 my-4 p-2" style={{height : '500px'}}>
                    <div className="col-md-12">
                        <div className="table-responsive overflow-auto px-0 mt-4">
                            {/* <table id="dataTable" className="table border" style={{ width: "100%", cellspacing: "0", tableLayout: "fixed"}} > */}
                            <table id="" className="table border" style={{ width: "100%", cellspacing: "0", tableLayout: "fixed"}} >
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
                                    
                                    {tableData.map((store) => (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Content End */}
                {/* <MyModalComponent/> */}
                <Footer />
            </div>
        </div>
    )
}

export default ViewStoreAcc