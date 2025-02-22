

const DocAndProcControl = ({dataMap, handleChange, validateDataType}) => 
    {
        return (
            <div className="row m-2 p-2 mt-4">
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="writtenWorkInstructionsAvaibleInStation">
                Are written work instructions available at work stations?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="writtenWorkInstructionsAvaibleInStation" 
                        name="writtenWorkInstructionsAvaibleInStation" 
                        value="Yes" 
                        checked={dataMap.writtenWorkInstructionsAvaibleInStation === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="writtenWorkInstructionsAvaibleInStation">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="writtenWorkInstructionsAvaibleInStation" 
                        name="writtenWorkInstructionsAvaibleInStation" 
                        value="No" 
                        checked={dataMap.writtenWorkInstructionsAvaibleInStation === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="writtenWorkInstructionsAvaibleInStation">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="finalInspectionEvidence">
                Does the finished product show evidence of final inspection acceptance?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="finalInspectionEvidence" 
                        name="finalInspectionEvidence" 
                        value="Yes" 
                        checked={dataMap.finalInspectionEvidence === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="finalInspectionEvidence">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="finalInspectionEvidence" 
                        name="finalInspectionEvidence" 
                        value="No" 
                        checked={dataMap.finalInspectionEvidence === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="finalInspectionEvidence">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="statisMethod">
                Are statistical methods used to control the process?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="statisMethod" 
                        name="statisMethod" 
                        value="Yes" 
                        checked={dataMap.statisMethod === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="statisMethod">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="statisMethod" 
                        name="statisMethod" 
                        value="No" 
                        checked={dataMap.statisMethod === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="statisMethod">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="suppliedDocument">
                Are procedures in place for control of customer-supplied documents?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="suppliedDocument" 
                        name="suppliedDocument" 
                        value="Yes" 
                        checked={dataMap.suppliedDocument === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="suppliedDocument">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="suppliedDocument" 
                        name="suppliedDocument" 
                        value="No" 
                        checked={dataMap.suppliedDocument === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="suppliedDocument">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="includeMethod">
                Does rage procedure include a method for handling revision changes & obsolete documents?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="includeMethod" 
                        name="includeMethod" 
                        value="Yes" 
                        checked={dataMap.includeMethod === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="includeMethod">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="includeMethod" 
                        name="includeMethod" 
                        value="No" 
                        checked={dataMap.includeMethod === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="includeMethod">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="qualityCapabilities">
                Are quality capabilities of suppliers evaluated prior to procurement?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="qualityCapabilities" 
                        name="qualityCapabilities" 
                        value="Yes" 
                        checked={dataMap.qualityCapabilities === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="qualityCapabilities">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="qualityCapabilities" 
                        name="qualityCapabilities" 
                        value="No" 
                        checked={dataMap.qualityCapabilities === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="qualityCapabilities">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
                
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="approvedSupplierList">
                Do you have an approved supplier list?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="approvedSupplierList" 
                        name="approvedSupplierList" 
                        value="Yes" 
                        checked={dataMap.approvedSupplierList === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="approvedSupplierList">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="approvedSupplierList" 
                        name="approvedSupplierList" 
                        value="No" 
                        checked={dataMap.approvedSupplierList === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="approvedSupplierList">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="marketPrice">
                Is the supplier competent with respect to market price?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="marketPrice" 
                        name="marketPrice" 
                        value="Yes" 
                        checked={dataMap.marketPrice === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="marketPrice">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="marketPrice" 
                        name="marketPrice" 
                        value="No" 
                        checked={dataMap.marketPrice === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="marketPrice">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="certifiedTestReports">
                Are certified test reports & certifications of conformance obtained on purchased material?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="certifiedTestReports" 
                        name="certifiedTestReports" 
                        value="Yes" 
                        checked={dataMap.certifiedTestReports === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="certifiedTestReports">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="certifiedTestReports" 
                        name="certifiedTestReports" 
                        value="No" 
                        checked={dataMap.certifiedTestReports === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="certifiedTestReports">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="supplierOnTimeDelivery">
                Is the supplier capable of on-time delivery?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="supplierOnTimeDelivery" 
                        name="supplierOnTimeDelivery" 
                        value="Yes" 
                        checked={dataMap.supplierOnTimeDelivery === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="supplierOnTimeDelivery">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="supplierOnTimeDelivery" 
                        name="supplierOnTimeDelivery" 
                        value="No" 
                        checked={dataMap.supplierOnTimeDelivery === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="supplierOnTimeDelivery">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
            </div>
        )
    }
    
    export default DocAndProcControl