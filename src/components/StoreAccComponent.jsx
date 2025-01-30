import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { createStore } from "../services/DB_Manager";


const StoreAccComponent = () =>
{
    // Variable
    const [form, setForm] = useState({partNum : '', description : '' , batch: '', condition : '', supplier : '', quantity : '', dom : '', doe : '', dateOfRecipet : '', document : '', nameOfQualityInsp : '', signatureOfQualityInsp : ''})
    // var partNumOpt = document.querySelectorAll('.editable-dropdown-item')
    var partNumInput = document.getElementById('partNum')


    // ######################### FUNCTION #####################

    // This functiom handle all change event's
    const handleChange = (event) => {
        const { name, value } = event.target; 
        setForm((prevData) => ({
            ...prevData,
            [name]: value 
        }));
    };

    // This function handle change event
    function saveFormData(event)
    {
        event.preventDefault();
        createStore(form)
    }

    // This function is
    function setSelectedPartNum(partNum)
    {
        partNumInput.value = partNum
    }

    return (
        // <!-- Page Wrapper -->
        <div id="wrapper">
            {/* Content Wrapper */}
            <div id="content-wrapper" className="d-flex flex-column">
                {/* Main Content */}
                <div id="content">
                    {/* Begin Page Content */}
                    <div className="container-fluid">

                        {/* Page Heading  */}
                        <div className="row mx-5" >
                            <div className="col-md-12 px-0 d-flex">
                                <div className="col-md-6">
                                    <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
                                        <h5 className="h5 mb-0 text-gray-800">Store Acceptance Form</h5>
                                    </div>
                                </div>

                                <div className="col-md-6 d-flex">
                                    <div className="col-md-9 w-100"></div>
                                    <div className="col-md-3 mt-2" >
                                        <button className="mx-2 btn btn-info" ><i className="fa-solid fa-house"></i> Home</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mx-5 card border border-dark shadow-lg">
                            <div className="col-md-12">
                                <form>
                                    <div className="col-md-12">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="partNum" className="col-md-4 mt-2">Part Number</label>
                                            <input className="form-control w-100" type="text"  id="partNum" name="partNum" placeholder="Enter part number" value={form.partNum} onChange={handleChange} required />
                                            {/* <div class="col-md-10">
                                                <div className="input-group">
                                                    <input type="text"  id="partNum" className="form-control w-100" value={form.partNum} onChange={handleChange} required /> */}
                                                    {/* <div className="input-group-append">
                                                        <button className="d-none d-sm-inline-block btn btn-sm btn-light shadow-sm dropdown-toggle dropdown-toggle" type="button" id="dropdownMsgPrflButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                                        <div className="dropdown-menu dropdown-menu-right" style="z-index: 1050; max-height: 350px; width: 430px ; overflow-y: auto;" aria-labelledby="dropdownMsgPrflButton"> */}
                                                            {/* Value will be generated dynamically */}
                                                            {/* <a className="dropdown-item editable-dropdown-item" onclick="" style="white-space: normal; word-wrap: break-word; overflow-wrap: break-word;" value='{{mti_code}}' >{{mti_code}} - {{mti_desc}}</a> */}
                                                        {/* </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <hr className="border border-dark m-1" />

                                    <div className="col-md-12 d-flex">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="description" className="col-md-4 mt-2">Description</label>
                                            <input className="form-control w-100" type="text"  id="description" name="description" placeholder="Enter description" value={form.description} onChange={handleChange} required />
                                        </div>

                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="batch" className="col-md-4 mt-2">Batch / Lot Number</label>
                                            <input className="form-control w-100" type="text"  id="batch" name="batch" placeholder="Enter description" value={form.batch} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="col-md-12 d-flex">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="condition" className="col-md-4 mt-2">Condition</label>
                                            <select className="form-control w-100" name="condition" id="condition" value={form.condition} onChange={handleChange}>
                                                <option value="Condition"> -- Select Condition --</option>
                                                <option value="Pawan" selected> -- Pawan --</option>
                                            </select>

                                        </div>

                                        <div className="col-md-6 p-2 d-flex flex-wrap align-items-center">
                                            <label htmlFor="batch" className="col-md-4 mt-2">Batch / Lot Number</label>
                                            <div className="col-md-6 d-flex">
                                                <div className="form-check col-md-4">
                                                    <input className="form-check-input p-0 m-0 mt-1" type="radio" name="new_opt" id="newRadio" />
                                                    <label className="form-check-label p-0 m-0" htmlFor="newRadio">New</label>
                                                </div>
                                                <div className="form-check col-md-4">
                                                    <input className="form-check-input p-0 m-0 mt-1" type="radio" name="o_w" id="o_wRadio" />
                                                    <label className="form-check-label p-0 m-0" htmlFor="o_wRadio">O/W</label>
                                                </div>
                                                <div className="form-check col-md-7">
                                                    <input className="form-check-input p-0 m-0 mt-1" type="radio" name="repaired" id="repairedRadio" />
                                                    <label className="form-check-label p-0 m-0" htmlFor="repairedRadio">Repaired</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 d-flex">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="desc" className="col-md-4 mt-2">Supplier</label>
                                            <input className="form-control w-100" type="text"  id="supplier" name="supplier" placeholder="Enter supplier Name" value={form.supplier} onChange={handleChange} required />
                                        </div>

                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="batch" className="col-md-4 mt-2">Quantity</label>
                                            <input className="form-control w-100" type="number"  id="quantity" name="quantity" placeholder="Enter Quantity" value={form.quantity} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="col-md-12 d-flex">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="dom" className="col-md-4 mt-2">DOM</label>
                                            {/* <input className="form-control w-100" type="date"  id="dom" name="dom"  value={form.dom} onChange={handleChange} required /> */}
                                            <input className="form-control w-100" type="text"  id="dom" name="dom"  value={form.dom} onChange={handleChange} required />
                                        </div>

                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="batch" className="col-md-4 mt-2">DOE</label>
                                            {/* <input className="form-control w-100" type="date"  id="doe" name="doe" value={form.doe} onChange={handleChange} required /> */}
                                            <input className="form-control w-100" type="text"  id="doe" name="doe" value={form.doe} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="col-md-12 d-flex">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="desc" className="col-md-4 mt-2">Inspection Report</label>
                                            <input className="form-control w-100 p-0" type="file"  id="document" name="document" value={form.document} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="batch" className="col-md-4 mt-2">Date Of Recipt</label>
                                            {/* <input className="form-control w-100" type="date"  id="recipt" name="recipt" value={form.recipt} onChange={handleChange} required /> */}
                                            <input className="form-control w-100" type="text"  id="dateOfRecipet" name="dateOfRecipet" value={form.dateOfRecipet} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="col-md-12 d-flex">
                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="desc" className="col-md-4 mt-2">Quality Inspector</label>
                                            <input className="form-control w-100" type="text"  id="nameOfQualityInsp" name="nameOfQualityInsp" value={form.nameOfQualityInsp} onChange={handleChange} placeholder="Name Of Quality Inspector" required />
                                        </div>

                                        <div className="col-md-6 p-2 d-flex">
                                            <label htmlFor="batch" className="col-md-4 mt-2">Sign</label>
                                            <input className="form-control w-100" type="text"  id="signatureOfQualityInsp" name="signatureOfQualityInsp" value={form.signatureOfQualityInsp} onChange={handleChange} placeholder="Signature Of Qualtiy Inspector" required />
                                        </div>
                                    </div>

                                    <hr className="border border-dark m-1" />

                                    <div className="col-md-12 text-end m-2">
                                        <div className="text-end m-2">
                                            <button className="btn btn-primary" onClick={(event) => saveFormData(event)}>Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>



                    {/* End of Begin Page */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreAccComponent;