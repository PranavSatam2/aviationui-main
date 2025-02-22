
const IncomingInspectionTab = ({dataMap, handleChange, validateDataType}) =>
    {
        return (
        <div className="row m-2 p-2 mt-4">
            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="processDocumented">
            Is the incoming process documented?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="processDocumented" 
                    name="processDocumented" 
                    value="Yes" 
                    checked={dataMap.processDocumented === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="processDocumented">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="processDocumented" 
                    name="processDocumented" 
                    value="No" 
                    checked={dataMap.processDocumented === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="processDocumented">No</label>
            </div>
        </div>
    </div>
</div>
<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="samplingIncomingInsp">
            What sampling plan is used for incoming inspection?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="samplingIncomingInsp" 
                    name="samplingIncomingInsp" 
                    value="Yes" 
                    checked={dataMap.samplingIncomingInsp === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="samplingIncomingInsp">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="samplingIncomingInsp" 
                    name="samplingIncomingInsp" 
                    value="No" 
                    checked={dataMap.samplingIncomingInsp === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="samplingIncomingInsp">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="receivingInspectionResultsOnFile">
            Is Objective evidence of receiving inspection results maintained in file?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="receivingInspectionResultsOnFile" 
                    name="receivingInspectionResultsOnFile" 
                    value="Yes" 
                    checked={dataMap.receivingInspectionResultsOnFile === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="receivingInspectionResultsOnFile">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="receivingInspectionResultsOnFile" 
                    name="receivingInspectionResultsOnFile" 
                    value="No" 
                    checked={dataMap.receivingInspectionResultsOnFile === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="receivingInspectionResultsOnFile">No</label>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="identificationMaintained">
            Is lot number or other traceability identification maintained?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="identificationMaintained" 
                    name="identificationMaintained" 
                    value="Yes" 
                    checked={dataMap.identificationMaintained === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="identificationMaintained">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="identificationMaintained" 
                    name="identificationMaintained" 
                    value="No" 
                    checked={dataMap.identificationMaintained === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="identificationMaintained">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="sepInsMaterial">
            Is incoming material kept separate from inspected material?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="sepInsMaterial" 
                    name="sepInsMaterial" 
                    value="Yes" 
                    checked={dataMap.sepInsMaterial === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="sepInsMaterial">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="sepInsMaterial" 
                    name="sepInsMaterial" 
                    value="No" 
                    checked={dataMap.sepInsMaterial === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="sepInsMaterial">No</label>
            </div>
        </div>
    </div>
</div>


<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="nonConMaterial">
            Is there any procedure for isolating nonconforming material?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="nonConMaterial" 
                    name="nonConMaterial" 
                    value="Yes" 
                    checked={dataMap.nonConMaterial === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="nonConMaterial">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="nonConMaterial" 
                    name="nonConMaterial" 
                    value="No" 
                    checked={dataMap.nonConMaterial === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="nonConMaterial">No</label>
            </div>
        </div>
    </div>
</div>

            </div>
            
            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="affectCusReq">
            Are deviations that affect the customer's requirement referred to customers for disposition?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="affectCusReq" 
                    name="affectCusReq" 
                    value="Yes" 
                    checked={dataMap.affectCusReq === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="affectCusReq">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="affectCusReq" 
                    name="affectCusReq" 
                    value="No" 
                    checked={dataMap.affectCusReq === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="affectCusReq">No</label>
            </div>
        </div>
    </div>
</div>

            </div>
        </div>
        )
    }
    
    export default IncomingInspectionTab