

const MaterialAndOther = ({dataMap, handleChange, validateDataType, actionPerformed}) => 
    {
        return (
            <div className="row m-2 p-2 mt-4">
                <div className="col-md-12">
                <div className="row">
<<<<<<< Updated upstream
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="processDocumented">Are Equipment calibrated <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="equipCalibrated1" name="equipCalibrated" value={dataMap.equipCalibrated} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="equipCalibrated1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="equipCalibrated2" name="equipCalibrated" value={dataMap.equipCalibrated} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="equipCalibrated2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="equipCalibrated3" name="equipCalibrated" value={dataMap.equipCalibrated} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="equipCalibrated3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Are Gauges, test equipment periodically certified & are records maintained for frequency of recalibration <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="recalibration1" name="recalibration" value={dataMap.recalibration} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="recalibration1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="recalibration2" name="recalibration" value={dataMap.recalibration} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="recalibration2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="recalibration3" name="recalibration" value={dataMap.recalibration} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="recalibration3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Are gauges, test equipment's available, sufficient for our scope of work <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="scopeOfWork1" name="scopeOfWork" value={dataMap.scopeOfWork} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="scopeOfWork1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="scopeOfWork2" name="scopeOfWork" value={dataMap.scopeOfWork} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="scopeOfWork2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="scopeOfWork3" name="scopeOfWork" value={dataMap.scopeOfWork} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="scopeOfWork3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Is there Adequate area & safety programs in place <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="safetyProgram1" name="safetyProgram" value={dataMap.safetyProgram} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="safetyProgram1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="safetyProgram2" name="safetyProgram" value={dataMap.safetyProgram} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="safetyProgram2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="safetyProgram3" name="safetyProgram" value={dataMap.safetyProgram} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="safetyProgram3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Is there procedure in place for house keeping <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="houseKeeping1" name="houseKeeping" value={dataMap.houseKeeping} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="houseKeeping1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="houseKeeping2" name="houseKeeping" value={dataMap.houseKeeping} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="houseKeeping2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="houseKeeping3" name="houseKeeping" value={dataMap.houseKeeping} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="houseKeeping3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
=======
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

>>>>>>> Stashed changes
            </div>
        </div>
        )
    }
    
export default MaterialAndOther