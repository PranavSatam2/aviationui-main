
const IncomingInspectionTab = ({dataMap, handleChange, validateDataType}) =>
    {
        return (
        <div className="row m-2 p-2 mt-4">
            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6">
            Is the incoming process documented?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="processDocumented1" 
                    name="processDocumented" 
                    value="Yes" 
                    checked={dataMap.processDocumented === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="processDocumented1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="processDocumented2" 
                    name="processDocumented" 
                    value="No" 
                    checked={dataMap.processDocumented === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="processDocumented2">No</label>
            </div>
        </div>
    </div>
</div>
<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6">
            What sampling plan is used for incoming inspection?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="samplingIncomingInsp1" 
                    name="samplingIncomingInsp" 
                    value="Yes" 
                    checked={dataMap.samplingIncomingInsp === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="samplingIncomingInsp1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="samplingIncomingInsp2" 
                    name="samplingIncomingInsp" 
                    value="No" 
                    checked={dataMap.samplingIncomingInsp === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="samplingIncomingInsp2">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6">
            Is Objective evidence of receiving inspection results maintained in file?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="receivingInspectionResultsOnFile1" 
                    name="receivingInspectionResultsOnFile" 
                    value="Yes" 
                    checked={dataMap.receivingInspectionResultsOnFile === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="receivingInspectionResultsOnFile1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="receivingInspectionResultsOnFile2" 
                    name="receivingInspectionResultsOnFile" 
                    value="No" 
                    checked={dataMap.receivingInspectionResultsOnFile === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="receivingInspectionResultsOnFile2">No</label>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" >
            Is lot number or other traceability identification maintained?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="identificationMaintained1" 
                    name="identificationMaintained" 
                    value="Yes" 
                    checked={dataMap.identificationMaintained === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="identificationMaintained1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="identificationMaintained2" 
                    name="identificationMaintained" 
                    value="No" 
                    checked={dataMap.identificationMaintained === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="identificationMaintained2">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" >
            Is incoming material kept separate from inspected material?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="sepInsMaterial1" 
                    name="sepInsMaterial" 
                    value="Yes" 
                    checked={dataMap.sepInsMaterial === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="sepInsMaterial1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="sepInsMaterial2" 
                    name="sepInsMaterial" 
                    value="No" 
                    checked={dataMap.sepInsMaterial === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="sepInsMaterial2">No</label>
            </div>
        </div>
    </div>
</div>


<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6">
            Is there any procedure for isolating nonconforming material?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="nonConMaterial1" 
                    name="nonConMaterial" 
                    value="Yes" 
                    checked={dataMap.nonConMaterial === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="nonConMaterial1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="nonConMaterial2" 
                    name="nonConMaterial" 
                    value="No" 
                    checked={dataMap.nonConMaterial === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="nonConMaterial2">No</label>
            </div>
        </div>
    </div>
</div>

            </div>
            
            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6">
            Are deviations that affect the customer's requirement referred to customers for disposition?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="affectCusReq1" 
                    name="affectCusReq" 
                    value="Yes" 
                    checked={dataMap.affectCusReq === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="affectCusReq1">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="affectCusReq2" 
                    name="affectCusReq" 
                    value="No" 
                    checked={dataMap.affectCusReq === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="affectCusReq2">No</label>
            </div>
        </div>
    </div>
</div>

            </div>
        </div>
        )
    }
    
    export default IncomingInspectionTab