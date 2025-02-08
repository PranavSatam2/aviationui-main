const GeneralTab = ({dataMap, handleChange, validateDataType}) => {
    return (
        <div className="m-2 p-2 mt-4">
            <div className="col-md-12 mb-3">
                <div className="col-md-6 ">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="name">Supplier/Sub-Contractor name</label>
                        <input className="col-md-8 form-control" type="text" name="supplierName" id="supplierName" placeholder="Full Name" value={dataMap.supplierName} onChange={handleChange} onInput={() => validateDataType('supplierName', 'A')}/>
                    </div>
                </div>
            </div>

            <hr className="mx-0 my-3 p-0 border "/>

            <div className="col-md-12 d-flex mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="phoneNum">Phone Number</label>
                        <input className="col-md-8 form-control" type="number" name="phoneNumber" id="phoneNumber" value={dataMap.phoneNumber} onChange={handleChange} onInput={() => validateDataType('phoneNumber', 'N')}/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="faxNum">Fax Number</label>
                        <input className="col-md-8 form-control" type="number" name="faxNum" id="faxNum" value={dataMap.faxNum} onChange={handleChange}/>
                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="email">Email Id</label>
                        <input className="col-md-8 form-control" type="email" name="email" id="email" required value={dataMap.email} onChange={handleChange}/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="address">Address</label>
                        <input className="col-md-8 form-control" type="text" name="address" id="address" value={dataMap.address} onChange={handleChange}/>
                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qualityManagerName">Quality Manager</label>
                        <input className="col-md-8 form-control" type="text" name="qualityManagerName" id="qualityManagerName" value={dataMap.qualityManagerName} onChange={handleChange}/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="qualityManagerPhoneNumber">Phone Number</label>
                        <input className="col-md-8 form-control" type="number" name="qualityManagerPhoneNumber" id="qualityManagerPhoneNumber" value={dataMap.qualityManagerPhoneNumber} onChange={handleChange}/>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-3 d-flex">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qmEmail">Email Id</label>
                        <input className="col-md-8 form-control" type="text" name="qmEmail" id="qmEmail" value={dataMap.qmEmail} onChange={handleChange}/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="SaleResp">Sales Representative</label>
                        <input className="col-md-8 form-control" type="text" name="SaleResp" id="SaleResp" value={dataMap.SaleResp} onChange={handleChange}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralTab;


// ############################# VALIDATION ###############################

