import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { createStore, getStoreDetail, listAllStore, updateStore } from "../services/db_manager";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const StoreAccComponent = () =>
{
    // Variable
    const [form, setForm] = useState({partNum : '', description : '' , batch: '', supplier : '', quantity : '', dom : '', doe : '', dateOfRecipet : '', document : '', nameOfQualityInsp : '', signatureOfQualityInsp : ''})
    const [dropdownItems, setDropdownItems] = useState([])
    const [listData, setListData] = useState('');

    // ######################### FUNCTION ########################

    // This functiom handle all change event's
    const handleChange = (event) => {
        const { name, value } = event.target; 
        setForm((prevData) => ({
            ...prevData,
            [name]: value 
        }));
    };

    // This function set selected part number to input field
    function setSelectedPartNum(event, value)
    {
        setForm((prevData) => ({
            ...prevData,
            partNum: value 
        }));
        handleViewRequest(event, value)
    }

    // ########################## HOOKS ##############################

    // This function is used to send save request
     async function sendSaveRequest()
    {

        debugger
        if(listData.includes(partNum))
        {
            let updateRes = await updateStore(partNum, form)
            console.log(updateRes);
            
        }
        else
        {
            let createRes = await createStore(form)
            console.log(createRes);
            
        }
    }

    // This function is used to handle view response
    async function handleViewRequest(event, partNum)
    {
        event.preventDefault(); 
        let response = await getStoreDetail(partNum)
        if (response.data)
        {
            setForm({ ...response.data, });
        }
    }

    // This function is used to display part num list reposne
    // useEffect(() => 
    // {
    //     listAllStore().then(response => 
    //         { 
    //             let data = response.data
    //             let list = []

    //             for (let index = 0; index < data.length; index++) 
    //             {
    //                 list.push(data[index])   
    //             }

    //             setDropdownItems([...list])
    //             setListData(list.join('~'));

    //         }).catch(error => 
    //         {
    //             console.error("Error fetching stores:", error);
    //         });
    // }, []);

    // ############################ RETURN ################################
    return (
        <div className="wrapper ">
        <Sidebar/>
      
      <div className="content">
        <Header />
          {/* conetnt Begin*/}

            {/* Content heading */}
            <div className="col-md-6">
                <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-4">
                    <h5 className="h5 mx-3 mb-0 text-gray-800">Supplier Registration</h5>
                </div>
            </div>

            {/* Content Body */}
            <div className="card border border-dark shadow mx-4 my-4 p-2" style={{height : '480px'}}>
                <div className="col-md-12">
                    <form>
                        <div className="col-md-12 my-3">
                            <div className="col-md-6 p-2 d-flex align-items-center">
                                <label htmlFor="partNum" className="col-md-4 mt-2">Part Number</label>
                                <div className="col-md-8 d-flex p-0">
                                    <input className="form-control w-100" type="text" id="partNum" name="partNum" placeholder="Enter part number" value={form.partNum} onChange={handleChange} required  />
                                    {/* <div className="input-group-append">
                                        <button className="btn btn-sm btn-light shadow-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                        <div className="dropdown-menu dropdown-menu-right" id="part-num-list" style={{zIndex: 1050, maxHeight: '350px', width: 'max-content', overflowY: 'auto' }}>
                                            <a className="dropdown-item editable-dropdown-item device-dropdown-item"  style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}></a>
                                            {dropdownItems.map((item) => ( <a key={item} onClick={(event)=> setSelectedPartNum(event, item)} className="dropdown-item editable-dropdown-item device-dropdown-item" style={{ whiteSpace: "normal", wordWrap: "break-word", overflowWrap: "break-word" }} > {item} </a> ))}
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <hr className="border m-1" />

                        <div className="col-md-12 d-flex mt-3">
                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="description" className="col-md-4 mt-2">Description</label>
                                <input className="form-control w-100" type="text"  id="description" name="description" placeholder="Enter description" value={form.description} onChange={handleChange} />
                            </div>

                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="batch" className="col-md-4 mt-2">Batch / Lot Number</label>
                                <input className="form-control w-100" type="number"  id="batch" name="batch" placeholder="Enter description" value={form.batch} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="col-md-12 d-flex mt-3">
                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="condition" className="col-md-4 mt-2">Condition</label>
                                <div className="col-md-8 d-flex">
                                    <div className="form-check col-md-4">
                                        <input className="form-check-input" type="radio" name="condition" id="newRadio" />
                                        <label className="form-check-label" htmlFor="newRadio">New</label>
                                    </div>
                                    <div className="form-check col-md-4">
                                        <input className="form-check-input" type="radio" name="condition" id="o_wRadio" />
                                        <label className="form-check-label" htmlFor="o_wRadio">O/W</label>
                                    </div>
                                    <div className="form-check col-md-7">
                                        <input className="form-check-input" type="radio" name="condition" id="repairedRadio" />
                                        <label className="form-check-label" htmlFor="repairedRadio">Repaired</label>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-md-12 d-flex mt-3">
                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="desc" className="col-md-4 mt-2">Supplier</label>
                                <input className="form-control w-100" type="text"  id="supplier" name="supplier" placeholder="Enter supplier Name" value={form.supplier} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="batch" className="col-md-4 mt-2">Quantity</label>
                                <input className="form-control w-100" type="number"  id="quantity" name="quantity" placeholder="Enter Quantity" value={form.quantity} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="col-md-12 d-flex mt-3">
                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="dom" className="col-md-4 mt-2">DOM</label>
                                <input className="form-control w-100" type="date"  id="dom" name="dom"  value={form.dom} onChange={handleChange} required />
                                {/* <input className="form-control w-100" type="text"  id="dom" name="dom"  value={form.dom} onChange={handleChange} required /> */}
                            </div>

                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="batch" className="col-md-4 mt-2">DOE</label>
                                <input className="form-control w-100" type="date"  id="doe" name="doe" value={form.doe} onChange={handleChange} required />
                                {/* <input className="form-control w-100" type="text"  id="doe" name="doe" value={form.doe} onChange={handleChange} required /> */}
                            </div>
                        </div>

                        <div className="col-md-12 d-flex mt-3">
                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="desc" className="col-md-4 mt-2">Inspection Report</label>
                                <input className="form-control w-100 p-0" type="file"  id="document" name="document" value={form.document} onChange={handleChange} />
                            </div>

                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="batch" className="col-md-4 mt-2">Date Of Recipt</label>
                                <input className="form-control w-100" type="date"  id="dateOfRecipet" name="dateOfRecipet" value={form.dateOfRecipet} onChange={handleChange} required />
                                {/* <input className="form-control w-100" type="text"  id="dateOfRecipet" name="dateOfRecipet" value={form.dateOfRecipet} onChange={handleChange} required /> */}
                            </div>
                        </div>

                        <div className="col-md-12 d-flex mt-3">
                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="desc" className="col-md-4 mt-2">Quality Inspector</label>
                                <input className="form-control w-100" type="text"  id="nameOfQualityInsp" name="nameOfQualityInsp" value={form.nameOfQualityInsp} onChange={handleChange} placeholder="Name Of Quality Inspector" required />
                            </div>

                            <div className="col-md-6 p-2 d-flex">
                                <label htmlFor="batch" className="col-md-4 mt-2">Sign</label>
                                <input className="form-control w-100" type="text"  id="signatureOfQualityInsp" name="signatureOfQualityInsp" value={form.signatureOfQualityInsp} onChange={handleChange} placeholder="Signature Of Qualtiy Inspector" required />
                            </div>
                        </div>

                        <hr className="border my-4" />

                        <div className="col-md-12 text-end mt-1">
                            <div className="text-end m-2">
                                <button className="btn btn-primary m-0 mt-2 mx-2" onClick={(event) => sendSaveRequest(event)}>Save</button>
                                <button className="btn btn-danger m-0 mt-2 mx-2" onClick={(event) => loadListResponse()}>Delete</button>
                            </div>
                        </div>
                    </form>
                {/* End of Begin Page */}
              </div>
            </div>          
        {/* Content End */}
      <Footer />
      </div>
      
    </div>
)
}

export default StoreAccComponent;
