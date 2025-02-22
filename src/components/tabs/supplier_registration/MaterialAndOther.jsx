

const MaterialAndOther = ({dataMap, handleChange, validateDataType, actionPerformed}) => 
    {
        return (
            <div className="row m-2 p-2 mt-4">
                <div className="col-md-12">
                <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-7" htmlFor="equipCalibrated">
            Are equipment calibrated?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="equipCalibrated" 
                    name="equipCalibrated" 
                    value="Yes" 
                    checked={dataMap.equipCalibrated === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="equipCalibrated">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="equipCalibrated" 
                    name="equipCalibrated" 
                    value="No" 
                    checked={dataMap.equipCalibrated === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="equipCalibrated">No</label>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-7" htmlFor="recalibration">
            Are gauges and test equipment periodically certified, and are records maintained for frequency of recalibration?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="recalibration" 
                    name="recalibration" 
                    value="Yes" 
                    checked={dataMap.recalibration === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="recalibration">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="recalibration" 
                    name="recalibration" 
                    value="No" 
                    checked={dataMap.recalibration === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="recalibration">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-7" htmlFor="scopeOfWork">
            Are gauges, test equipment available and sufficient for our scope of work?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="scopeOfWork" 
                    name="scopeOfWork" 
                    value="Yes" 
                    checked={dataMap.scopeOfWork === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="scopeOfWork">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="scopeOfWork" 
                    name="scopeOfWork" 
                    value="No" 
                    checked={dataMap.scopeOfWork === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="scopeOfWork">No</label>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-7" htmlFor="safetyProgram">
            Is there adequate area & safety programs in place?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="safetyProgram" 
                    name="safetyProgram" 
                    value="Yes" 
                    checked={dataMap.safetyProgram === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="safetyProgram">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="safetyProgram" 
                    name="safetyProgram" 
                    value="No" 
                    checked={dataMap.safetyProgram === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="safetyProgram">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12">
            <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-7" htmlFor="houseKeeping">
            Is there a procedure in place for housekeeping?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="houseKeeping" 
                    name="houseKeeping" 
                    value="Yes" 
                    checked={dataMap.houseKeeping === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="houseKeeping">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="houseKeeping" 
                    name="houseKeeping" 
                    value="No" 
                    checked={dataMap.houseKeeping === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="houseKeeping">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

            <div className="col-md-12 text-right align-items-end">
                <button type="button" className="btn btn-primary" onClick={actionPerformed}>Submit</button>
            </div>
        </div>
        )
    }
    
export default MaterialAndOther