const GeneralTab = ({ dataMap, handleChange, validateDataType, validateLen }) => {
    return (
        <div className="m-2 p-2 mt-4">
            {/* Supplier/Sub-Contractor Details */}
            <div className="col-md-12 mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="supplierName">Supplier/Sub-Contractor Name</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="text" 
                            name="supplierName" 
                            id="supplierName" 
                            placeholder="Full Name" 
                            value={dataMap.supplierName} 
                            onChange={handleChange} 
                            onInput={(event) => { validateDataType(event, 'A'); validateLen(event, 0, 100); }} 
                        />
                    </div>
                </div>
            </div>

            <hr className="mx-0 my-3 p-0 border border-dark" />

            {/* Contact Details */}
            <div className="col-md-12 d-flex mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="phoneNumber">Phone Number</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="number" 
                            name="phoneNumber" 
                            id="phoneNumber" 
                            value={dataMap.phoneNumber} 
                            onChange={handleChange} 
                            onInput={(event) => { validateDataType(event, 'N'); validateLen(event, 10, 10); }} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="faxNum">Fax Number</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="number" 
                            name="faxNum" 
                            id="faxNum" 
                            value={dataMap.faxNum} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>

            {/* Email & Address */}
            <div className="col-md-12 d-flex mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="email">Email ID</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="email" 
                            name="email" 
                            id="email" 
                            required 
                            value={dataMap.email} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="address">Address</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="text" 
                            name="address" 
                            id="address" 
                            value={dataMap.address} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>

            <hr className="mx-0 my-3 p-0 border border-dark" />

            {/* Quality Manager Details */}
            <h5 className="mb-3 fw-bold text-dark">Quality Manager Details</h5>
            <div className="col-md-12 d-flex mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qualityManagerName">Name</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="text" 
                            name="qualityManagerName" 
                            id="qualityManagerName" 
                            value={dataMap.qualityManagerName} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qualityManagerPhoneNumber">Phone Number</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="number" 
                            name="qualityManagerPhoneNumber" 
                            id="qualityManagerPhoneNumber" 
                            value={dataMap.qualityManagerPhoneNumber} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-12 mb-3">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qualityManagerEmailId">Email ID</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="email" 
                            name="qualityManagerEmailId"
                            id="qualityManagerEmailId"
                            value={dataMap.qualityManagerEmailId} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>

            <hr className="mx-0 my-3 p-0 border border-dark" />

            {/* Sales Representative Details */}
            <h5 className="mb-3 fw-bold text-dark">Sales Representative Details</h5>
            <div className="col-md-12 d-flex mb-3">
                     <div className="col-md-6">
                        <div className="row">
                    <label className="col-md-4 pt-2" htmlFor="saleRepresentativeName">Name</label>
                    <input 
                          className="col-md-8 form-control" 
                             type="text" 
                            name="saleRepresentativeName" 
                            id="saleRepresentativeName" 
                            value={dataMap.saleRepresentativeName} 
                            onChange={handleChange} 
                            />
                        </div>
                        </div>
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="saleRepresentativeEmailId">Email ID</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="email" 
                            name="saleRepresentativeEmailId" 
                            id="saleRepresentativeEmailId" 
                            required 
                            value={dataMap.saleRepresentativeEmailId} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-12 mb-2">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="saleRepresentativePhoneNumber">Phone Number</label>
                        <input 
                            className="col-md-8 form-control" 
                            type="number" 
                            name="saleRepresentativePhoneNumber" 
                            id="saleRepresentativePhoneNumber" 
                            value={dataMap.saleRepresentativePhoneNumber} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>
           
        </div>
    );
};

export default GeneralTab;
